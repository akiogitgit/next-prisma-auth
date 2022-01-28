import React, { useState, VFC } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import Link from "next/dist/client/link";
import prisma from "../lib/prisma";

const Draft: VFC = () => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try{
            const body = { title, content }
            await fetch("/api/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            // const result = await prisma.post.create({
            //     data: {
            //         title: title,
            //         content: content,
            //         // author: { connect: { email: session?.user?.email } }
            //     }
            // })
            await Router.push("/drafts")
        }catch(err){
            console.error(err)
        }
    }

    return(
        <Layout>
            <form onSubmit={submitData}>
                <h1 className="text-[30px] font-bold">New Draft</h1>
                <input
                    className="w-full"
                    type="text"
                    autoFocus
                    onChange={(e)=>setTitle(e.target.value)}
                    placeholder="title"
                    value={title}
                />
                <textarea
                    className="mt-[30px] w-full"
                    cols={50}
                    rows={8}
                    onChange={(e)=>setContent(e.target.value)}
                    value={content}
                />
                <button
                    type="submit"
                    disabled={!content || !title}
                >
                    Create
                </button>
                <Link href="/">Cancel</Link>
            </form>
        </Layout>
    )
}

export default Draft