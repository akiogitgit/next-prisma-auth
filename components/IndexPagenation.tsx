import React, { useEffect, useState, VFC } from "react"
import { GetStaticProps } from "next"
import Link from "next/dist/client/link"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
// prisma.user.create()で新しいUserレコードを作成したり、prisma.post.findMany()でデータベースから全てのPostレコードを取得したりすることができます
import prisma from '../lib/prisma';
import { useRouter } from 'next/router';

// 思いっきりSSGやんけ
export const getStaticProps: GetStaticProps = async () => {
  // .post.findMany はpostを全取得
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
    orderBy: {
      id: "desc"
    },
    // skipで何番目から取得するか、takeは取得数
    skip: 0, 
    take: 10
  });
  return {
    props: { feed },
    revalidate: 1
  }
}

type Props = {
  feed: PostProps[]
}

//                            ( props )だと、下はprops.feedになる
const IndexPagenation: VFC<Props> = ({ feed }) => {
  return (
    <Layout>
      <div>
        <h1 className="text-[30px] font-bold">Public Feed</h1>
        <main>
          {feed.map((post) => (
            <div key={post.id} className="bg-white">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  )
}

export default IndexPagenation
