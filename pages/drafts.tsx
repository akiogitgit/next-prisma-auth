import { useRouter } from "next/router";
import { GetServerSideProps, GetStaticProps } from "next";
import { useState, VFC } from "react";
import { useSession, getSession } from "next-auth/react";
import Link from "next/dist/client/link"

import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post"
import prisma from "../lib/prisma";
import Local from "../lib/Local";

// getStaticProps に変えたい。
// ページ数を受け取りたい

// これを、このファイルのコンポーネントに入れたほうが楽
export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
    const session = await getSession({ req })
    // let index = query.index ?? 0
    // if(index<0){
    //     index=0
    // }
    if(!session && !Local){
        res.statusCode = 403
        return{
            props: {
                drafts: []
            }
        }
    }

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
        props: { drafts }
    }
}

type Props = {
    drafts: PostProps[]
}


const Drafts: VFC<Props> = (props) => {

    const [index, setIndex] = useState(3);
    const router = useRouter()
    const handlePage = () => {
        router.push({
            pathname: "/drafts",
            query: {index: index}
        })
    }
    return(
        <Layout>
            <div>
                <h1 className="text-[30px] font-bold">My Drafts</h1>
                <main>
                    <p>{index}</p>
                    {props.drafts.map((post)=> (
                        <div key={post.id}>
                            <Post post={post}/>
                        </div>
                    ))}
                    <form onSubmit={handlePage}>
                        <button className="float-left" type="submit" onClick={()=>setIndex(0)}>0へ</button>
                        <button className="float-right" type="submit" onClick={()=>setIndex(3)}>2</button>
                    </form>
                </main>
                <div className="float-right primary-btn mt-10">
                    <Link href={`/draftpagenation/${2}`}>
                        <a>2＞</a>
                    </Link>
                </div>
            </div>
        </Layout>
    )
}
// この中にコンポーネントで、draftsのページネーション用のファイル入れて、
// props で useState 渡すのが簡単そう。。
// fetch query だと前の情報が得られない。(next押したから、今は１とか)
export default Drafts