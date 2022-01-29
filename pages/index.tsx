import React from "react"
import { GetStaticProps } from "next"
import Link from "next/dist/client/link"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
// prisma.user.create()で新しいUserレコードを作成したり、prisma.post.findMany()でデータベースから全てのPostレコードを取得したりすることができます
import prisma from '../lib/prisma';

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
  });
  return {
    props: { feed },
    revalidate: 10
  }
}

type Props = {
  feed: PostProps[]
}

//                            ( props )だと、下はprops.feedになる
const Blog: React.FC<Props> = ({ feed }) => {
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

export default Blog
