import React, { useState, VFC } from "react"
import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/react"
import Router from "next/router"
import Link from "next/link"

import Local from "../../lib/Local"
import Layout from "../../components/Layout"
import Post, { PostProps } from "../../components/Post"
import prisma from "../../lib/prisma"

// [id].ts は動的ルーティングだから、SSRのgetServerSideProps
// ルーティングの情報が入ったparamsを受け取る

export const getStaticPaths: GetStaticPaths = async() => {
    const { data: session } = useSession()
    const path = await prisma.post.findMany({
        where: { 
            // author: { email: !Local ? session?.user?.email : "test" },
            published: true 
        }
    })
    // 必ずparamsに入れる
    const paths = path.map((post)=>({
        params:{
            // 数値だとだめらしい
            id: String(post.id)
        },
    }))
    // const paths1 = [
    //     { params: { id: '1' } },
    //     { params: { id: '2' } },
    //     { params: { id: '3' } }
    // ]
    return {
        paths,
        fallback: true
    }
}

    // getStaticPaths で作った paramsを取得
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { data: session } = useSession()
    // posts._cont.ppublishedでカウントが取り出せる
    const posts = await prisma.post.aggregate({
        _count: {
            published: true
        },
    })
    const postNum = posts._count.published
    const feed = await prisma.post.findMany({
        where: {
            author: { email: !Local ? session?.user?.email : "test" },
            // published: false, // 非公開のを表示
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
            revalidate: 1
        }
}

type Props = {
    feed: PostProps[]
    index: Number
    posts: Number
}


const DraftFilterPost: VFC<Props> = ({ feed, index, posts }) => {

    // const [Etitle, setETitle] = useState(props.title)
    // const [Econtent, setEContent] = useState(props.content)
    // const [Epublished, setEPublished] = useState(props.published)
    const { data: session } = useSession()
    const prev = Number(index) - 1
    const next = Number(index) + 1

    if(!session && !Local){
    return <div>ログインしてね ... (^^</div>
    }
    // const userHasVlidSession = Boolean(session)
    // const postbelongsToUser = session?.user?.email === props.author?.email

    return (
        <Layout>
            <div>
                <h1 className="text-[30px] font-bold">Public Feed</h1>
                <main>
                    {feed ? feed.map((post) => (
                        <div key={post.id} className="bg-white">
                        <Post post={post} />
                        </div>
                    )):""}
                </main>

                {prev > 0 ?
                    <div className="float-left primary-btn mt-10">
                        <Link href={`/draftpagenation/${prev}`}>
                            <a>＜{prev}</a>
                        </Link>
                    </div> : ""
                }
                {next*5 < posts ? 
                    <div className="float-right primary-btn mt-10">
                        <Link href={`/draftpagenation/${next}`}>
                            <a>{next}＞</a>
                        </Link>
                    </div> : ""
                }
            </div>
        </Layout>
    )
}

export default DraftFilterPost
