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
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {

//   const post = await prisma.post.findUnique({
//     where: {
//       id: Number(params?.id) || -1,
//     },
//     include: {
//       author: {
//         select: { name: true}
//       }
//     }
//   })
//   return {
//     // 渡すものが一つだけなら、props = postになる
//     props: post,
//   }
// }

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
    await Router.push('/');
}

const Post: VFC<PostProps> = (props) => {
  // const [session, loading] = useSession()
  const { data: session } = useSession()
  if(!session){
    return <div>Authenticating ... (^^</div>
  }
  const userHasVlidSession = Boolean(session)
  const postbelongsToUser = session?.user?.email === props.author?.email
  let tittle = props.title

  let title = props.title
  if (!props.published) {
    title = `${title} (Draft)`
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || "Unknown author"}</p>
        <ReactMarkdown source={props.content} />
        {!props.published && userHasVlidSession && postbelongsToUser && (
          <button onClick={()=>publishPost(props.id)}>Publish</button>
        )}
      </div>
    </Layout>
  )
}

export default Post
