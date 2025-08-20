import type { Me } from "../App";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { api } from "../lib/api";

export default function PostBox({ me, onPosted }:{ me: Me; onPosted: () => void }) {
  const nav = useNavigate();
  const [content, setContent] = useState("");

  const publish = async () => {
    if (!me) return nav("/login");        // redirect if not logged in
    if (!content.trim()) return;
    await api.post("/posts", { content }); // backend is protected
    setContent("");
    onPosted();                            // refresh
  };

  return (
    <div className="border rounded p-3 mb-4">
      <textarea
        className="w-full border p-2 rounded"
        rows={3}
        placeholder="What's in your mind?"
        value={content}
        onChange={e=>setContent(e.target.value)}
      />
      <div className="flex justify-end mt-2">
        <button onClick={publish} className="bg-green-600 text-white px-4 py-1 rounded">
          Publish
        </button>
      </div>
    </div>
  );
}
