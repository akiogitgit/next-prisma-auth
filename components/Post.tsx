import React, { VFC } from "react";
import Link from "next/dist/client/link";
import FadeIn from "./FadeIn"

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

  // Cannot read properties of null (reading 'length' はここ？
  if(post.title && (post.title.length > 20)) {
    post.title = post.title.substring(0, 20) + "..."
  }
  if(post.content && (post.content.length > 50)) {
    post.content = post.content.substring(0, 50) + "..."
  }

  return (
    <FadeIn>
      <div className="px-6 py-4 mt-8 bg-white shadow-md text-[25px]">
        <Link href={`/p/${post.id}`}>
          <a className="flex flex-col md:flex-row gap-10 md:ml-0">
            <div className="w-[160px] translate-y-4 text-center mx-auto">
              {post.published ?
                <p className="publish">公開</p>:
                <p className="not-publish">非公開</p>}
            </div>
            <div className="md:w-full">
              <h2 className="text-[38px] underline break-all text-center md:text-left">{post.title}</h2>
              <p className="break-all text-center md:text-left">{post.content}</p>
              <p className="mt-2 text-[15px] text-gray-500 text-center md:text-left">By {authorName}</p>
            </div>
          </a>
        </Link>
      </div>
    </FadeIn>
  );
};

export default Post;
