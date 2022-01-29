import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react"
import Router from "next/router";
import prisma from "../../../lib/prisma"

// 受信したHTTP POST リクエストのbodyからタイトルとコンテントを抽出します
export default async function handle(req, res: NextApiResponse) {

        const { id } = req.body
        const session = await getSession({ req })
        
        if (!session) {
            res.status(401).json({ message: 'Not authenticated' })
            return
        }
        if (req.method === 'DELETE') {
            await prisma.post.delete({ // title, content, authorが必須
                where: { id: id }
            })
            res.end()
    }
        
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