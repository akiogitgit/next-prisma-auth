import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react"
import Router from "next/router";
import prisma from "../../../lib/prisma"

// 受信したHTTP POST リクエストのbodyからタイトルとコンテントを抽出します
export default async function handle(req, res) {

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