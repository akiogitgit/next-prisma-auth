import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import prisma from "../../../lib/prisma"
import { NextApiHandler } from "next/dist/shared/lib/utils"

import Adapters from "next-auth/adapters"
import Providers from 'next-auth/providers'

// vercelの公式
// const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
// export default authHandler
// const options = {
//     providers: [
//         GithubProvider({
//             clientId: process.env.GITHUB_ID,
//             clientSecret: process.env.GITHUB_SECRET,
//         }),
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         }),
//     ],
//     // adapter: Adapters.Prisma.Adapter({ prisma }),
//     adapter: PrismaAdapter(prisma),

//     // secret: process.env.SECRET,
// }

// next-authの公式
// export default NextAuth({
//     adapter: PrismaAdapter(prisma),
//     providers: [
//         GithubProvider({
//             clientId: process.env.GITHUB_ID,
//             clientSecret: process.env.GITHUB_SECRET,
//         }),
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         }),
//     ],
//     secret: "secret",
// })

// これだと行ける

export default NextAuth({
    providers: [
        // http://localhost:3000/api/auth/providersに行くとなんか出るよ
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    // adapter: PrismaAdapter(prisma),
    secret: "secret",
})