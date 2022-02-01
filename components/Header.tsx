import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from 'react';
import { useScrollPosition } from "@n8tb1t/use-scroll-position";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;
  
  const { data: session } = useSession()

  const [showHeader, setShowHeader] = useState(true);
  useScrollPosition(({ prevPos, currPos }) => {
    const visible = currPos.y > prevPos.y;
    setShowHeader(visible);
  }, []);

  return (
    <header className={`fixed top-0 pr-[60px] lg:pr-0 w-full max-w-[780px] z-10 bg-gray-200/80 duration-300
        ${showHeader ? "" : "translate-y-[-100%]"}`}>
      <Head>
        <title>Simple Post</title>
      </Head>
      <nav className="py-8 flex justify-between text-[20px]">
        <div className="left flex gap-3">
          <Link href="/">
            <a className="font-bold fall-down" data-active={isActive("/")}>
              Feed
            </a>
          </Link>
          <Link href="/create">
            <a className="font-bold fall-down" data-active={isActive("/create")}>
              Create
            </a>
          </Link>
          <Link href="/drafts">
            <a className="font-bold fall-down" data-active={isActive("/drafts")}>
              Draft
            </a>
          </Link>
        </div>
          <div className="translate-y-[-5px] slide-left">
            {session ? 
            <button className="danger-btn" onClick={()=>signOut()}>LogOut</button>:
            <button className="primary-btn" onClick={()=>signIn()}>LogIn</button>}
        </div>
        
        
        <style jsx>{`
        .left a[data-active="true"] {
            color: gray;
          }
        .fall-down{
          transform: translateY(-50px)
        }
        .fall-down:nth-child(1){
          animation: key-fall 1s both;
        }
        .fall-down:nth-child(2){
          animation: key-fall 1s 0.15s both;
        }
        .fall-down:nth-child(3){
          animation: key-fall 1s 0.3s both;
        }
        @keyframes key-fall {
          0%{ transform: translateY(-50px); opacity:0 }
          100%{ transform: translateY(0px); opacity:1 }
        }
        .slide-left{
          transform: translateX(70px);
          animation: key-left 1s 0.45s both;
        }
        @keyframes key-left {
          0%{ transform: translateX(70px); opacity:0 }
          100%{ transform: translateX(0px); opacity:1 }
        }
        `}</style>
      </nav>
    </header>
  );
};

export default Header;
