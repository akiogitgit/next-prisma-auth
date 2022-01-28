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
              <button className="py-2 px-4 bg-blue-500 border border-blue-500 text-white rounded-xl font-bold duration-300 hover:bg-white hover:text-blue-500"
                  onClick={()=>signIn()}>Login</button>
          </main>
        }
      </div>
    </div>
  );
}

export default Layout;
