import React, { useState, VFC } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import Router from 'next/router'
import Link from 'next/link'

import Local from '../../lib/Local'
import Layout from '../../components/Layout'
import Post, { PostProps } from '../../components/Post'
import prisma from '../../lib/prisma'
import SlideInRight from '../../components/SlideInRight'
import SlideInLeft from '../../components/SlideInLeft'

// [id].ts は動的ルーティングだから、SSRのgetServerSideProps
// ルーティングの情報が入ったparamsを受け取る

export const getStaticPaths: GetStaticPaths = async () => {
  const path = await prisma.post.findMany({
    where: { published: true },
  })

  // うまく入ってるかは、知らん
  // const path1 = await prisma.post.aggregate({ // count, avg, max, min...
  //     _count: {
  //         id: true
  //     }
  // })
  // let i = 1
  // let path2 = []
  // while(i <= Number(path1)){
  //     if(i%5 == 0){
  //         path2.push(i/5)
  //     }
  //     i++
  // }
  // const paths = path2.map((post)=>({
  //     params:{
  //         // 数値だとだめらしい
  //         id: String(post.id)
  //     },
  // }))
  // path.filter(filter => filter.id % 5 == 0)

  // 必ずparamsに入れる
  const paths = path.map(post => ({
    params: {
      // 数値だとだめらしい
      id: String(post.id),
    },
  }))
  return {
    paths,
    fallback: true,
  }
}

// getStaticPaths で作った paramsを取得
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // これダメみたいよ
  const posts = await prisma.post.aggregate({
    _count: {
      published: true,
    },
    // where: {
    //     author: {
    //         name: "a"
    //     }
    // },
  })
  const postNum = posts._count.published
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
    orderBy: {
      id: 'desc',
    },
    // skipで何番目から取得するか、takeは取得数
    // skip: 0,
    skip: (Number(params.id) - 1) * 10,
    take: 10,
  })
  return {
    props: {
      feed,
      index: params.id,
      posts: postNum,
    },
    revalidate: 1,
  }
}

type Props = {
  feed: PostProps[]
  index: Number
  posts: Number
}

const FilterPost: VFC<Props> = ({ feed, index, posts }) => {
  const prev = Number(index) - 1
  const next = Number(index) + 1

  return (
    <Layout>
      <div>
        <h1 className='text-[30px] font-bold slide-right'>Public Feed</h1>
        <main>
          {feed
            ? feed.map(post => (
                <div key={post.id} className='fadeIn-deley'>
                  <Post post={post} />
                </div>
              ))
            : ''}
        </main>

        {prev > 0 ? (
          <SlideInLeft>
            <div className='float-left mt-10'>
              <Link href={`/pagenation/${prev}`}>
                <a className='primary-btn'>＜{prev}</a>
              </Link>
            </div>
          </SlideInLeft>
        ) : (
          ''
        )}
        {/* countで、正確に測れない? */}
        {(next + 1) * 10 < posts ? (
          <SlideInRight>
            <div className='float-right mt-10'>
              <Link href={`/pagenation/${next}`}>
                <a className='primary-btn'>{next}＞</a>
              </Link>
            </div>
          </SlideInRight>
        ) : (
          ''
        )}
      </div>
    </Layout>
  )
}

export default FilterPost
