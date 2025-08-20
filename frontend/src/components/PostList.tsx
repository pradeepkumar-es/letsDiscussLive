import { Link } from "react-router-dom";
import { useRelativeTime } from "../lib/useRelativeTime";

function PostItem({ post }: { post: any }) {
  const ago = useRelativeTime(post.createdAt);

  return (
    <div className="block border rounded p-3 hover:bg-gray-50">
      <div className="text-sm text-gray-600">
        by {post.createdBy?.username || "unknown"} · {ago}
      </div>
      <div className="mt-1 mb-2">{post.content.slice(0, 280)}</div>
      <Link to={`/post/${post._id}`}
         className="text-xs cursor-pointer text-green-800 font-bold  border border-1 p-2 rounded-full hover:bg-[#33ff77]">
          Join Live Discussion
        {/* </div> */}
      </Link>
    </div>
  );
}

export default function PostList({ posts }: { posts: any[] }) {
  return (
    <div className="space-y-3">
      {posts.map((p) => (
        <PostItem key={p._id} post={p} />
      ))}
    </div>
  );
}
