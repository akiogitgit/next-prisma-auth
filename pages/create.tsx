import React, { useState, VFC } from "react";
import Router from "next/router";
import Link from "next/dist/client/link";
import { useSession } from "next-auth/react";

import Layout from "../components/Layout";
import Local from "../lib/Local";

const Draft: VFC = () => {

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [published, setPublished] = useState(true)

    const { data: session } = useSession()

    const submitData = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try{
            const body = { title, content, published }
            await fetch("/api/create", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            await Router.push("/")
        }catch(err){
            console.error(err)
        }
    }

    return(
        <Layout>
            <form onSubmit={submitData} className="text-[25px]">
                <h1 className="mb-3 text-[30px] font-bold slide-right">New Draft</h1>
                <input
                    className="w-full p-2 outline-none border-2 fadeIn-deley focus:border-blue-400"
                    type="text"
                    autoFocus
                    required
                    minLength={2}
                    maxLength={30}
                    onChange={(e)=>setTitle(e.target.value)}
                    placeholder="title"
                    value={title}
                />
                <textarea
                    className="mt-[30px] w-full p-2 outline-none border-2 fadeIn-deley focus:border-blue-400"
                    cols={50}
                    rows={8}
                    required
                    minLength={2}
                    maxLength={200}
                    onChange={(e)=>setContent(e.target.value)}
                    placeholder="content"
                    value={content}
                />

                <div className="fadeIn-deley">
                    {session || Local ?
                        <div>
                            <label htmlFor="true" className="cursor-pointer">
                                <input type="radio" id="true" name="publish" className="mt-4"
                                        checked={published} onChange={()=>setPublished(true)}/>
                                publish
                            </label><br/>
                            <label htmlFor="false" className="cursor-pointer">
                                <input type="radio" id="false" name="publish"
                                        checked={!published} onChange={()=>setPublished(false)}/>
                                not publish
                            </label>
                        </div>:""
                    }<br/>
                </div>

                <div className="fadeIn-deley">
                    <button
                        className="primary-btn mt-4 mr-4 fadeIn-deley"
                        type="submit"
                        disabled={!content || !title}
                    >
                        Create 
                    </button>
                        <Link href="/">
                            <a className="danger-btn">Cancel</a>
                        </Link>
                </div>
            </form>
        </Layout>
    )
}

export default Draft