import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;
  
  const { data: session } = useSession()

  return (
    <div>
      <nav className="py-8 flex justify-between">
        <div className="left flex gap-3">
          <Link href="/">
            <a className="font-bold" data-active={isActive("/")}>
              Feed
            </a>
          </Link>
          <Link href="/create">
            <a className="font-bold" data-active={isActive("/create")}>
              Create
            </a>
          </Link>
          <Link href="/drafts">
            <a className="font-bold" data-active={isActive("/drafts")}>
              Draft
            </a>
          </Link>
        </div>
          <div>
            {session ? 
            <button className="danger-btn" onClick={()=>signOut()}>LogOut</button>:
            <button className="primary-btn" onClick={()=>signIn()}>LogIn</button>}
          {/* <Link href="/Header">
            <a className="font-bold">
              {session ? "LogOut" : "LogIn"}
            </a>
          </Link> */}
        </div>
        <style jsx>{`
        .left a[data-active="true"] {
            color: gray;
          }
        `}</style>
      </nav>
    </div>
  );
};

export default Header;
