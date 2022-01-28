import { getSession } from "next-auth/react"
import Router from "next/router";
import prisma from "../../../lib/prisma"

// 受信したHTTP POST リクエストのbodyからタイトルとコンテントを抽出します
export default async function handle(req, res) {
    const { title, content } = req.body
    // session してるか確認
    const session = await getSession({ req })
    const result = await prisma.post.create({
        data: {
            title: title,
            content: content,
            author: { connect: { email: session?.user?.email } }
        }
    })
    res.json(result)
}