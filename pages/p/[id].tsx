import React, { useState, VFC } from "react"
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { PostProps } from "../../components/Post"
import prisma from "../../lib/prisma"
import { useSession } from "next-auth/react"
import Router from "next/router"
import Local from "../../lib/Local"

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


// getStaticPaths で作った paramsを取得
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
    revalidate: 1,
  }
}


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

  const userHasVlidSession = Boolean(session)
  const postbelongsToUser = session?.user?.email === props.author?.email

  let title = props.title

  // 他人の非公開を見れないようにしよう
  return (
    <Layout>
        <div className="text-[25px] fadeIn-deley">
          {postbelongsToUser || Local ? 
          <div>
            <form
              onSubmit={updatePost}
            >
                  <h1 className="mb-3 text-[30px] font-bold">Edit</h1>
                  <input
                      className="w-full p-2 outline-none border-2 focus:border-blue-400"
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
                      className="mt-[30px] w-full p-2 outline-none border-2 focus:border-blue-400"
                      cols={50}
                      rows={8}
                      required
                      minLength={2}
                      maxLength={200}
                      onChange={(e)=>setEContent(e.target.value)}
                      placeholder="content"
                      value={Econtent}
                  />

                  <label htmlFor="true" className="cursor-pointer">
                      <input type="radio" id="true" name="publish" className="mt-4"
                              checked={Epublished} onChange={()=>setEPublished(true)}/>
                      publish
                  </label><br/>
                  <label htmlFor="false" className="cursor-pointer">
                      <input type="radio" id="false" name="publish"
                              checked={!Epublished} onChange={()=>setEPublished(false)}/>
                      not publish
                  </label><br/>

                  <button
                      type="submit"
                      disabled={!Econtent || !Etitle}
                      className="primary-btn mt-4 mr-4"
                  > Update 
                  </button>
                  <button className="danger-btn"
                    onClick={()=>deletePost()}
                  >Delete
              </button>
              </form>
            </div>:

            // 他人の投稿
            <div>
              <div className="px-6 py-4 bg-white text-[25px]">
                <h2 className="text-[38px] underline break-words">{title}</h2>
                <p className="break-words">{props.content}</p>
                <p className="mt-2 text-[15px] text-gray-500">By {props?.author?.name || "Unknown author"}</p>
              </div>
            </div>
        }</div>
    </Layout>
  )
}

export default Post
