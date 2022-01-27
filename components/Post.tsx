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
      <div className="p-4">
        <Link href={`/p/${post.id}`}>
          <a>
            <h2>{post.title}</h2>
            <p>By {authorName}</p>
            <p>{post.content}</p>
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
