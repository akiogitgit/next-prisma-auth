import React, { VFC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from "next-auth/react"
import { getSession } from "next-auth/react"
import Layout from '../components/Layout';

const Header: VFC = () => {
    const { data: session} = useSession();

    if(!session){
        return(
            <Layout>
                <h1>loading...</h1>
                <button onClick={()=>signIn()}>SignIn</button>
                <Link href="/">Home</Link>
            </Layout>
        )
    }
    return(
        <Layout>
            <div className='flex flex-col gap-4 float-left'>
                <h1 className='text-[30px]'>Sign in Page</h1>
                <button onClick={()=>signOut()}>SignOut</button>
                <Link href="/">home</Link>
                <Link href="/create">create</Link>
            </div>
        </Layout>
    )
}

export default Header