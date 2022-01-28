import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import prisma from "../../../lib/prisma"

// 自分の投稿した非公開を公開に
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    const { id,Etitle, Econtent, Epublished } = req.body
        const session = await getSession({ req })
        if (!session) {
            res.status(401).json({ message: 'Not authenticated' })
            return
        }
    const postId = req.query.id
    const post = await prisma.post.update({
        where: { id: Number(id) },
        data: {
            title: Etitle,
            content: Econtent,
            published: Epublished
        }
    })
    
    // res.json(post)
    res.end()

}