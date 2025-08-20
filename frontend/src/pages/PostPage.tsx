import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
import ChatBox from "../components/ChatBox";
import type { Me } from "../App";
import { useRelativeTime } from "../lib/useRelativeTime";

export default function PostPage({ me }:{ me: Me }) {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    api.get(`/posts/${id}`).then(r => setPost(r.data));
    api.get(`/messages/${id}`).then(r => setHistory(r.data));
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="border rounded p-4">
        <div className="text-sm text-gray-600">
          by {post.createdBy?.username} · {new Date(post.createdAt).toLocaleString()}
        </div>
        <div className="mt-2 whitespace-pre-wrap">{post.content}</div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Live discussion</h2>
        {/* Pass history into ChatBox so ChatBox owns the full message list */}
        <ChatBox postId={id!} me={me} initialMessages={history} />
      </div>
    </div>
  );
}
