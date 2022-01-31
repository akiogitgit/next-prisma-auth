import React, { useState, VFC } from "react"
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import { getSession, useSession } from "next-auth/react"
import Router from "next/router"
import Link from "next/link"

import Local from "../../lib/Local"
import Layout from "../../components/Layout"
import Login from "../../components/Login"
import Post, { PostProps } from "../../components/Post"
import prisma from "../../lib/prisma"

// [id].ts は動的ルーティングだから、SSRのgetServerSideProps
// ルーティングの情報が入ったparamsを受け取る

// export const getStaticPaths: GetStaticPaths = async() => {
//     const path = await prisma.post.findMany({
//         where: { published: true }
//     })
//     const paths = path.map((post)=>({
//         params:{
//             id: String(post.id)
//         },
//     }))
//     return {
//         paths,
//         fallback: true
//     }
// }

    // getStaticPaths で作った paramsを取得
export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
    const session = await getSession({req})

    const posts = await prisma.post.aggregate({
        _count: {
            published: true,
        },
        where: {
            author: { email: !Local ? session?.user?.email : "test" },
        }
    })
    const postNum = posts._count.published
    const feed = await prisma.post.findMany({
        where: { 
            // published: true,
            author: { email: !Local ? session?.user?.email : "test" },
        },
        include: {
            author: {
                select: { name: true },
            },
        },
        orderBy: {
            id: "desc"
        },
        // skipで何番目から取得するか、takeは取得数
        // skip: 0, 
        skip: (Number(params.id)-1)*5, 
        take: 5
    });
    return {
        props: {
            feed,
            index: params.id,
            posts: postNum
        },
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
            <Login>
                <div>
                    <h1 className="text-[30px] font-bold">My Drafts</h1>
                    <main>
                        {feed ? feed.map((post) => (
                            <div key={post.id} className="bg-white">
                            <Post post={post} />
                            </div>
                        )):""}
                    </main>

                    {prev > 0 ?
                        <div className="float-left primary-btn mt-10">
                            <Link href={`/draftPagenation/${prev}`}>
                                <a>＜{prev}</a>
                            </Link>
                        </div> : ""
                    }
                    {(next-1)*5 < posts ? 
                        <div className="float-right primary-btn mt-10">
                            <Link href={`/draftPagenation/${next}`}>
                                <a>{next}＞</a>
                            </Link>
                        </div> : ""
                    }
                </div>
            </Login>
        </Layout>
    )
}

export default FilterPost
