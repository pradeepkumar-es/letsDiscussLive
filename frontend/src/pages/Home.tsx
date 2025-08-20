import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Me } from "../App";
import PostBox from "../components/PostBox";
import PostList from "../components/PostList";

export default function Home({ me }:{ me: Me }) {
  const [posts, setPosts] = useState<any[]>([]);
  const load = () => api.get("/posts").then(r => setPosts(r.data));
  useEffect(() => { load(); }, []);
  return (
    <>
      <PostBox me={me} onPosted={load} />
      <PostList posts={posts} />
    </>
  );
}
