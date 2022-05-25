import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react"
import Local from "../../../lib/Local";
import prisma from "../../../lib/prisma"

// 受信したHTTP POST リクエストのbodyからタイトルとコンテントを抽出します
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
        const { title, content, published } = req.body
        const session = await getSession({ req })

        // 自分が登録されてるか確認
        // これをCreateの度にやらず、sessionで管理する
        let user:{email:string,name:string} = {email:"",name:""}
        if(session){
            user = await prisma.user.findFirst({
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
            user = await prisma.user.findFirst({
                where: {
                    email: session?.user?.email
                }
            })
        }
        await prisma.post.create({ // title, content, authorが必須
            data: {
                title: title,
                content: content,
                author: {
                    connect: {
                        email: Local ? "test" :
                                (!user ? "guest" : user.email)
                    }
                },
                published: published
            },
        })
        res.end()
}