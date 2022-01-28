import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../lib/prisma"

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const postId = req.query.id
    const post = await prisma.post.delete({
        where: { id: Number(postId) },
    })
    res.json(post)
}