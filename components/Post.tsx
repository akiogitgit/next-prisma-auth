import React from "react";
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

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";

  return (
    <>
      <div className="p-4 bg-white mt-4 shadow-md">
        <Link href={`/p/${post.id}`}>
          <a className="flex gap-10">
            <div>
              {post.published ?
                <p className="bg-blue-500 py-1 px-3 rounded-xl text-white font-bold">公開</p>:
                <p className="bg-red-500 py-1 px-3 rounded-xl text-white font-bold">非公開</p>}
            </div>
            <div>
              <h2>{post.title}</h2>
              <p>By {authorName}</p>
              <p>{post.content}</p>
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
