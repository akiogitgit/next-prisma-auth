import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;
  
  const { data: session } = useSession()

  return (
    <div>
      <nav className="p-8 flex justify-between">
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
          <Link href="/Header">
            <a className="font-bold" data-active={isActive("/drafts")}>
              {session ? "LogOut" : "LogIn"}
            </a>
          </Link>
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
