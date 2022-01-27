import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div className="px-[30px] min-h-screen bg-gray-200">
    <div className="max-w-[1000px] mx-auto">
      <Header />
      {props.children}
    </div>
  </div>
);

export default Layout;
