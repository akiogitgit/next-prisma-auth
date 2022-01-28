import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react"
import Router from "next/router";
import prisma from "../../../lib/prisma"

// 受信したHTTP POST リクエストのbodyからタイトルとコンテントを抽出します
export default async function handle(
        req: NextApiRequest,
        res: NextApiResponse
    ) {
        const { title, content, published } = req.body
        const session = await getSession({ req })
        if (!session) {
            res.status(401).json({ message: 'Not authenticated' })
            return
        }
        
        // 自分が登録されてるか確認
        const user = await prisma.user.findFirst({
            where: {
                email: session?.user?.email
            }
        })
        if(!user){ // ユーザー作成
            await prisma.user.create({
                data:{
                    name: session?.user?.name,
                    email: session?.user?.email
                }
            })
        }
        await prisma.post.create({ // title, content, authorが必須
            data: {
                title: title,
                content: content,
                // author: {},
                author: { connect: { email: session?.user?.email } },
                published: published
            },
        })
        res.end()
    // const { title, content } = req.body
    // // session してるか確認
    // const session = await getSession({ req })
    // const result = await prisma.post.create({
    //     data: {
    //         title: title,
    //         content: content,
    //         author: { connect: { email: session?.user?.email } }
    //     }
    // })
    // res.json(result)
}