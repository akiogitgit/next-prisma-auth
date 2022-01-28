import { GetServerSideProps } from "next"
import { Router } from "next/router"
import { useSession } from "next-auth/react"
import prisma from "../../../lib/prisma"

// 自分の投稿した非公開を公開に
export default async function handle(req, res) {
    const postId = req.query.id
    const post = await prisma.post.update({
        where: { id: Number(postId) },
        data: { published: true }
    })
    res.json(post)
}