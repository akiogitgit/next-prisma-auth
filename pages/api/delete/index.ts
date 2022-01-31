import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react"
import prisma from "../../../lib/prisma"
import Local from "../../../lib/Local";


// 受信したHTTP POST リクエストのbodyからタイトルとコンテントを抽出します
export default async function handle(req, res) {

    const session = getSession({ req })
    if(session || Local){
        const { id } = req.body
        // if (req.method === 'DELETE') {
            if (req.method === 'DELETE') {
            const result = await prisma.post.delete({
                where: { id: Number(id) },
            })
            // res.end()
            res.json(result)
        }
    }
}