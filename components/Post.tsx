import React, { VFC } from "react";
import Router from "next/router";
import Link from "next/dist/client/link";

export type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
};

const Post: VFC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";

  return (
    <>
      <div className="px-6 py-4 bg-white mt-4 shadow-md">
        <Link href={`/p/${post.id}`}>
          <a className="flex flex-col sm:flex-row gap-10">
            <div className="w-[80px] translate-y-4">
              {post.published ?
                <p className="publish">公開</p>:
                <p className="not-publish">非公開</p>}
            </div>
            <div className="sm:w-[50%] md:w-[60%]">
              <h2 className="text-[20px] underline break-all">{post.title}</h2>
              <p className="break-all">{post.content}</p>
              <p className="mt-2 text-[12px] text-gray-500">By {authorName}</p>
            </div>
          </a>
        </Link>
      </div>
      {/* <div
        onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}
        className="p-4"
      >
        <h2>{post.title}</h2>
        <p>By {authorName}</p>
        <p>{post.content}</p>
      </div> */}
      
    </>
  );
};

export default Post;
