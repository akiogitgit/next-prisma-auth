import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react"
import Router from "next/router";
import prisma from "../../../lib/prisma"

// 受信したHTTP POST リクエストのbodyからタイトルとコンテントを抽出します
export default async function handle(req, res) {

    const { id, title, content, published } = req.body
        if (req.method === 'POST') {
            const result = await prisma.post.update({
                where: { id: Number(id) },
                data: {
                    title: title,
                    content: content,
                    published: published
                }
            })
            // res.end()
        res.json(result)
    }
}