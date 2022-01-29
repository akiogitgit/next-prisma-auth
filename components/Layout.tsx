import React, { ReactNode } from "react";
import Header from "./Header";
import { useSession, signIn } from "next-auth/react"
import Footer from "./Footer";

type Props = {
  children: ReactNode;
};


const Layout: React.FC<Props> = (props) => {
  const { data: session } = useSession()

  return(
    <div className="px-[30px] pb-[50px] min-h-screen bg-gray-200 w-full overflow-hidden text-[20px]">
      <div className="max-w-[780px] mx-auto">
        <Header />
        
        {(session) ?
          props.children:

          <main className="mt-10 text-center">
              <p>こちらからログインしてください</p>
              <button className="primary-btn mt-10"
                  onClick={()=>signIn()}>Login</button>
          </main>
        }

        <Footer/>
      </div>
    </div>
  );
}

export default Layout;
