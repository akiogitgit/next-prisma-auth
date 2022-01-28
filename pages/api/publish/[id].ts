import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma"

// 自分の投稿した非公開を公開に
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const postId = req.query.id
    const post = await prisma.post.update({
        where: { id: Number(postId) },
        data: { published: true }
    })
    res.json(post)
}