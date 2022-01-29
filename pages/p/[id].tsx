import React, { VFC } from "react"
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { PostProps } from "../../components/Post"
import prisma from "../../lib/prisma"
import { useSession } from "next-auth/react"
import { Router } from "next/router"

type PageProps = {

}

// [id].ts は動的ルーティングだから、SSRのgetServerSideProps
// ルーティングの情報が入ったparamsを受け取る


export const getStaticPaths: GetStaticPaths = async() => {
  const path = await prisma.post.findMany()
  // 必ずparamsに入れる
  const paths = path.map((post)=>({
    params:{
      // 数値だとだめらしい
      id: String(post.id)
    },
  }))
  const paths1 = [
    { params: { id: '1' } },
    { params: { id: '2' } },
    { params: { id: '3' } }
  ]
  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: { name: true, email: true }
      }
    }
  })
  return {
    // 渡すものが一つだけなら、props = postになる
    props: post,
    revalidate: 10,
  }
}

async function publishPost(id: number): Promise<void> {
    await fetch(`http://localhost:3000/api/publish/${id}`, {
      method: 'PUT',
    });
    Router.push('/');
}



// const publishPost: Promise<void> async = (id: number) => {
//   await fetch(`http://localhost:3000/api/publish/${id}`, {
//     method: 'PUT',
//   });
//   await Router.push('/');
// }

const Post: VFC<PostProps> = (props) => {
  // const [session, loading] = useSession()
  const { data: session } = useSession()

  const deletePost = async (id: number) => {
    const body = {id}
    try{
      await fetch("api/delete",{
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }catch(e){
      console.error(e)
    }
  }

  if(!session){
    return <div>ログインしてね ... (^^</div>
  }
  const userHasVlidSession = Boolean(session)
  const postbelongsToUser = session?.user?.email === props.author?.email
  let tittle = props.title

  let title = props.title
  if (!props.published) {
    title = `${title} (Draft)`
  }

  // 他人の非公開を見れないようにしよう
  return (
    <Layout>
      {!(!props.published && !postbelongsToUser) ?
        <div> {postbelongsToUser ? 
          <form
            // onClick={()=>updatePost(props.id)}
          >
                <h1 className="text-[30px] font-bold">Edit</h1>
                <input
                    className="w-full"
                    type="text"
                    autoFocus
                    required
                    minLength={2}
                    maxLength={30}
                    // onChange={(e)=>setEtitle(e.target.value)}
                    placeholder="title"
                    // value={Etitle}
                />
                <textarea
                    className="mt-[30px] w-full"
                    cols={50}
                    rows={8}
                    required
                    minLength={2}
                    maxLength={100}
                    // onChange={(e)=>setEcontent(e.target.value)}
                    // value={Econtent}
                />
                <input
                    id="1"
                    type="checkbox"
                    // onClick={()=>setEpublished(!Epublished)}
                />
                <label htmlFor="1">not publish</label><br/>
                <button
                    type="submit"
                    // disabled={!Econtent || !Etitle}
                >
                    Update 
                </button>
                {!props.published && userHasVlidSession && postbelongsToUser && (
              <button className="primary-btn" onClick={()=>publishPost(props.id)}>Publish</button>
            )}
            {postbelongsToUser ? 
              <button className="danger-btn"
                onClick={()=>deletePost(props.id)}
              >Delete</button>
            :""}
            </form>:

            // 他人の投稿
          <div>
            <div className="p-4 bg-white">
              <h2 className="text-[20px] underline">{title}</h2>
              <p>{props.content}</p>
              <p className="mt-2 text-[12px] text-gray-500">By {props?.author?.name || "Unknown author"}</p>
            </div>
            
          </div>
        }</div> : "anpan"
      }
    </Layout>
  )
}

export default Post
