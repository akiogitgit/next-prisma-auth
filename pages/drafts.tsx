import { useRouter } from "next/router";
import { GetServerSideProps, GetStaticProps } from "next";
import { useState, VFC } from "react";
import { useSession, getSession } from "next-auth/react";
import Link from "next/dist/client/link"

import Layout from "../components/Layout";
import Login from "../components/Login";
import Post, { PostProps } from "../components/Post"
import prisma from "../lib/prisma";
import Local from "../lib/Local";

// getStaticProps に変えたい。
// ページ数を受け取りたい

// これを、このファイルのコンポーネントに入れたほうが楽
export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
    const session = await getSession({ req })
    // if(!session && !Local){
    //     res.statusCode = 403
    //     return{
    //         props: {
    //             drafts: []
    //         }
    //     }
    // }
    if(session || Local){
    
        // draft数
        const posts = await prisma.post.aggregate({
            _count: {
                published: true,
            },
            where: {
                author: { email: !Local ? session?.user?.email : "test" },
            }
        })
        const postNum = posts._count.published


        // 最新の５個取得
        const drafts = await prisma.post.findMany({
            where: {
                author: { email: !Local ? session?.user?.email : "test" },
                // published: false, // 非公開のを表示
            },
            include: {
                author: {
                    select: { name: true }
                }
            },
            orderBy: {
                id:"desc"
            },
            take: 5
            // skip: Number(index)
        })
        return {
            props: { drafts, postNum }
        }
    }
    
    else{ // ゲストユーザー
        return{
            props: {
                drafts: []
            }
        }
    }
}

type Props = {
    drafts: PostProps[]
    postNum: Number
}


const Drafts: VFC<Props> = ({ drafts, postNum }) => {

    return(
        <Layout>
            <Login>
                <div>
                    <h1 className="text-[30px] font-bold">My Drafts</h1>
                    <main>
                        {drafts.map((post)=> (
                            <div key={post.id}>
                                <Post post={post}/>
                            </div>
                        ))}
                    </main>

                    {postNum > 5 ?
                        <div className="float-right primary-btn mt-10">
                            <Link href={`/draftPagenation/${2}`}>
                                <a>2＞</a>
                            </Link>
                        </div> : ""
                    }
                </div>
            </Login>
        </Layout>
    )
}

export default Drafts