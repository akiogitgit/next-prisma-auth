import React, { useEffect, useState } from "react"
import { GetStaticProps } from "next"
import Link from "next/dist/client/link"
import Router from "next/router";

import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import IndexPagenation from "../components/IndexPagenation"

// 思いっきりSSGやんけ
export const getStaticProps: GetStaticProps = async (context) => {
  try{
    await Router.push(`/pagenation/${1}`);
  }catch(e){console.error(e)}

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
    take: 5
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
          <div className="float-right primary-btn mt-10">
            <Link href={`/pagenation/${2}`}>
                <a>2＞</a>
            </Link>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default Blog
