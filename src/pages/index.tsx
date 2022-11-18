import React, { useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import Link from 'next/dist/client/link'
import Router from 'next/router'

import Layout from '../components/Layout'
import Post, { PostProps } from '../components/Post'
import prisma from '../lib/prisma'
import SlideInRight from '../components/SlideInRight'

// 思いっきりSSGやんけ
export const getStaticProps: GetStaticProps = async context => {
  try {
    await Router.push(`/pagenation/${1}`)
  } catch (e) {
    console.error(e)
  }

  const posts = await prisma.post.aggregate({
    _count: {
      published: true,
    },
  })
  const postNum = posts._count.published

  // .post.findMany はpostを全取得
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
    skip: 0,
    take: 10,
  })
  return {
    props: { feed, postNum },
    revalidate: 1,
  }
}

type Props = {
  feed: PostProps[]
  postNum: Number
}

//                            ( props )だと、下はprops.feedになる
const Blog: React.FC<Props> = ({ feed, postNum }) => {
  return (
    <Layout>
      <div>
        <h1 className='text-[30px] font-bold slide-right'>Public Feed</h1>
        <main>
          {feed.map(post => (
            <div key={post.id} className='fadeIn-deley'>
              <Post post={post} />
            </div>
          ))}
          {postNum > 10 ? (
            <SlideInRight>
              <div className='float-right mt-10'>
                <Link href={`/pagenation/${2}`}>
                  <a className='primary-btn'>2＞</a>
                </Link>
              </div>
            </SlideInRight>
          ) : (
            ''
          )}
        </main>
      </div>
    </Layout>
  )
}

export default Blog
