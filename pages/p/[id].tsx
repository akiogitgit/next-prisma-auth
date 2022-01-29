import React, { useState, VFC } from "react"
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { PostProps } from "../../components/Post"
import prisma from "../../lib/prisma"
import { useSession } from "next-auth/react"
import Router from "next/router"

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

// async function publishPost(id: number): Promise<void> {
//     await fetch(`http://localhost:3000/api/publish/${id}`, {
//       method: 'PUT',
//     });
//     Router.push('/');
// }



// const publishPost: Promise<void> async = (id: number) => {
//   await fetch(`http://localhost:3000/api/publish/${id}`, {
//     method: 'PUT',
//   });
//   await Router.push('/');
// }

const Post: VFC<PostProps> = (props) => {

  const [Etitle, setETitle] = useState(props.title)
  const [Econtent, setEContent] = useState(props.content)
  const [Epublished, setEPublished] = useState(props.published)
  const { data: session } = useSession()

  const updatePost = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const body = { id: props.id, title: Etitle, content: Econtent, published: Epublished }
    try{
      await fetch("/api/update",{
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      // import {Router}のせい！
      await Router.push("/drafts")
    }catch(e){
      console.error(e)
    }
  }

  const deletePost = async () => {
    const body = { id: props.id }
    try{ // fetch(`http://localhost:3000/api/publish/${id})は嫌
      await fetch("/api/delete",{
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      // import {Router}のせい！
      await Router.push("/drafts")

    }catch(e){
      console.error(e)
    }
  }

  if(!session){
    return <div>ログインしてね ... (^^</div>
  }
  const userHasVlidSession = Boolean(session)
  const postbelongsToUser = session?.user?.email === props.author?.email

  let title = props.title
  if (!props.published) {
    title = `${title} (Draft)`
  }

  // 他人の非公開を見れないようにしよう
  return (
    <Layout>
      {!(!props.published && !postbelongsToUser) ?
        <div> {postbelongsToUser ? 
          <div>
            <form
              onSubmit={updatePost}
            >
                  <h1 className="text-[30px] font-bold">Edit</h1>
                  <input
                      className="w-full"
                      type="text"
                      autoFocus
                      required
                      minLength={2}
                      maxLength={30}
                      onChange={(e)=>setETitle(e.target.value)}
                      placeholder="title"
                      value={Etitle}
                  />
                  <textarea
                      className="mt-[30px] w-full"
                      cols={50}
                      rows={8}
                      required
                      minLength={2}
                      maxLength={100}
                      onChange={(e)=>setEContent(e.target.value)}
                      value={Econtent}
                  />
                  <input type="radio" id="true" name="publish" className="mt-4"
                        checked={Epublished} onChange={()=>setEPublished(true)}/>
                  <label htmlFor="true">publish</label><br/>

                  <input type="radio" id="false" name="publish"
                    checked={!Epublished} onChange={()=>setEPublished(false)}/>
                  <label htmlFor="false">not publish</label><br/>

                  <button
                      type="submit"
                      disabled={!Econtent || !Etitle}
                      className="primary-btn mt-4"
                  >
                      Update 
                  </button>
              </form>
              {/* {!props.published && userHasVlidSession && postbelongsToUser && (
                <button className="primary-btn"
                // onClick={()=>publishPost(props.id)}
                >Publish</button>
              )} */}
              <button className="danger-btn translate-x-[100px] translate-y-[-100%]"
                  onClick={()=>deletePost()}
                >Delete
              </button>
            </div>:

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
