// lib/prisma.ts
// prisma.user.create()で新しいUserレコードを作成したり
// prisma.post.findMany()でデータベースから全てのPostレコードを取得したりすることができます

import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma

// この prismaを読み込むと
// データベースにアクセスする必要があるときはいつでも、必要なファイルにprismaインスタンスをインポートすることができます。
