import React from "react"
import { GetStaticProps } from "next"
import Link from "next/dist/client/link"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
// prisma.user.create()で新しいUserレコードを作成したり、prisma.post.findMany()でデータベースから全てのPostレコードを取得したりすることができます
import prisma from '../lib/prisma';

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

  // const addPost = await prisma.post.create({
  //   data: {
  //     title: "add Title",
  //     content: "add Content",
  //     published: true,
  //     authorId: 1,
  //   }
  // })

  // findUniqueは一意のやつ
  // findFirstは最初のやつ
  // findManyは全部
  return { props: { feed } }
}

type Props = {
  feed: PostProps[]
}

//                            ( props )だと、下はprops.feedになる
const Blog: React.FC<Props> = ({ feed }) => {
  return (
    <Layout>
      <div>
        <h1>Public Feed</h1>
        <p className="text-[20px] text-red-500">Public Feed</p>
        <main>
          {feed.map((post) => (
            <div key={post.id} className="bg-white mt-10">
              <Post post={post} />
            </div>
          ))}
          <ul>
            <li>
              <Link href="/Header">Header</Link>
            </li>
            <li>
              <Link href="/drafts">draft</Link>
            </li>
          </ul>
        </main>
      </div>
    </Layout>
  )
}

export default Blog
