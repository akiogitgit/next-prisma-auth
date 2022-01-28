import React, { useState, VFC } from "react"
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next"
import ReactMarkdown from "react-markdown"
import Layout from "../../components/Layout"
import { PostProps } from "../../components/Post"
import prisma from "../../lib/prisma"
import { useSession } from "next-auth/react"
import { Router } from "next/router"
import { useRouter } from "next/router"

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
    fallback: false
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


const Post: VFC<PostProps> = (props) => {

  const [Etitle, setEtitle] = useState(props.title)
  const [Econtent, setEcontent] = useState(props.content)
  const [Epublished, setEpublished] = useState(props.published)
  

  const { data: session } = useSession()
  if(!session){
    return <div>ログインしてね ... (^^</div>
  }
  const userHasVlidSession = Boolean(session)
  const postbelongsToUser = session?.user?.email === props.author?.email

  let title = props.title
  if (!props.published) {
    title = `${title} (Draft)`
  }

  const router = useRouter()

  const publishPost = async (id: number) => {
    try{
      await fetch(`http://localhost:3000/api/publish/${id}`, {
        method: 'PUT',
      });
      // Router.push('/');
      await router.replace("/drafts")
    }catch(e){console.error(e)}
  }

  const deletePost = async (id: number) => {
    try{
      await fetch(`http://localhost:3000/api/delete/${id}`, {
        method: 'DELETE',
      });
      await router.replace("/drafts")
    }catch(e){console.error(e)}
  }

  const updatePost = async (id: Number) => {
    // e.preventDefault()
    try{
        const body = { id, Etitle, Econtent, Epublished }
        await fetch("http://localhost:3000/api/update/${id}", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })
      await router.replace("/drafts")
    }catch(err){
        console.error(err)
    }
}
  
  
  // 他人の非公開を見れない
  // 自分投稿は、編集画面に
  return (
    <Layout>
      {!(!props.published && !postbelongsToUser) ?
        <div> {postbelongsToUser ? 
          <form onClick={()=>updatePost(props.id)}>
                <h1 className="text-[30px] font-bold">Edit</h1>
                <input
                    className="w-full"
                    type="text"
                    autoFocus
                    required
                    minLength={2}
                    maxLength={30}
                    onChange={(e)=>setEtitle(e.target.value)}
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
                    onChange={(e)=>setEcontent(e.target.value)}
                    value={Econtent}
                />
                <input
                    id="1"
                    type="checkbox"
                    onClick={()=>setEpublished(!Epublished)}/>
                <label htmlFor="1">not publish</label><br/>
                <button
                    type="submit"
                    disabled={!Econtent || !Etitle}
                >
                    Update 
                </button>
                {!props.published && userHasVlidSession && postbelongsToUser && (
              <button className="primary-btn" onClick={()=>publishPost(props.id)}>Publish</button>
            )}
            {postbelongsToUser ? 
              <button className="danger-btn" onClick={()=>deletePost(props.id)}>Delete</button>
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
