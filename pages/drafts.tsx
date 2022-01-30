import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post"
import { useSession, getSession } from "next-auth/react";
import prisma from "../lib/prisma";
import { GetServerSideProps } from "next";
import { VFC } from "react";
import Local from "../lib/Local";

// getStaticProps に変えたい
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req })
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
            author: { email: !Local ? session.user.email : "test" },
            // published: false, // 非公開のを表示
        },
        include: {
            author: {
                select: { name: true }
            }
        },
        orderBy: {
            id:"desc"
        }
    })
    return {
        props: { drafts }
    }
}

type Props = {
    drafts: PostProps[]
}

const Drafts: VFC<Props> = (props) => {
    return(
        <Layout>
            <div>
                <h1 className="text-[30px] font-bold">My Drafts</h1>
                <main>
                    {props.drafts.map((post)=> (
                        <div key={post.id}>
                            <Post post={post}/>
                        </div>
                    ))}
                </main>
            </div>
        </Layout>
    )
}

export default Drafts