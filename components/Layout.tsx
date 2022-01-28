import React, { ReactNode } from "react";
import Header from "./Header";
import { useSession, signIn } from "next-auth/react"

type Props = {
  children: ReactNode;
};


const Layout: React.FC<Props> = (props) => {
  const { data: session } = useSession()

  return(
    <div className="px-[30px] min-h-screen bg-gray-200">
      <div className="max-w-[1000px] mx-auto">
        <Header />
        
        {session ?
          props.children:

          <main className="mt-10">
              <p className="mb-4">こちらからログインしてください</p>
              <button className="primary-btn"
                  onClick={()=>signIn()}>Login</button>
          </main>
        }
      </div>
    </div>
  );
}

export default Layout;
