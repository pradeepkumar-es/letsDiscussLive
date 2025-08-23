import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import type { Me } from "../App";
import { useNavigate } from "react-router-dom";
import { useRelativeTime } from "../lib/useRelativeTime";

const socket = io( import.meta.env.VITE_BACKEND_BASE_URL, { withCredentials: true });

export default function ChatBox({
  postId,
  me,
  initialMessages = []
}: {
  postId: string;
  me: Me;
  initialMessages?: any[];
}) {
  const nav = useNavigate();
  const [messages, setMessages] = useState<any[]>(initialMessages || []);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState<any | null>(null); 
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages || []);
  }, [initialMessages]);

  useEffect(() => {
    socket.emit("join_post", { postId });
    socket.on("receive_message", (msg: any) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => {
      socket.off("receive_message");
    };
  }, [postId]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "auto" });
    }
  }, [messages]);

  const send = () => {
    if (!me) return nav("/login");
    if (!input.trim()) return;

    socket.emit("send_message", {
      postId,
      text: input,
      userId: me.id,
      username: me.username,
      parentId: replyTo?._id || null
    });

    setInput("");
    setReplyTo(null);
  };

  const onMessageClick = (m: any) => {
    setReplyTo(m);
    const el = document.getElementById("chat-input") as HTMLInputElement | null;
    el?.focus();
  };

  return (
    <div className="border rounded p-3">
      <div ref={listRef} className="h-64 overflow-y-auto space-y-2 mb-2 px-1">
        {messages.map((m: any) => (
          <ChatMessage key={m._id || Math.random()} msg={m} onReply={onMessageClick} />
        ))}
      </div>

      {replyTo && (
        <div className="mb-2 p-2 bg-gray-100 rounded flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-600">
              Replying to <b>{replyTo.username}</b>
            </div>
            <div className="text-sm text-gray-700 truncate max-w-xs">{replyTo.text}</div>
          </div>
          <button
            onClick={() => setReplyTo(null)}
            className="text-sm px-2 py-1 border rounded"
            aria-label="cancel reply"
          >
            x
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          id="chat-input"
          className="border p-2 flex-1 rounded"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={me ? "Type a message..." : "Login to join the discussion"}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
        />
        <button onClick={send} className="bg-blue-600 text-white px-4 rounded">Send</button>
      </div>
    </div>
  );
}

function ChatMessage({ msg, onReply }: { msg: any; onReply: (m: any) => void }) {
  const ago = msg.createdAt ? useRelativeTime(msg.createdAt) : "";

  return (
    <div className="p-2 rounded hover:bg-gray-50">
      <div className="text-xs text-gray-500">
        <b>{msg.username}</b> · {ago}
      </div>

      {msg.parentUsername && (
        <div className="mt-1 mb-1 text-sm bg-gray-50 p-2 rounded border-l-2 border-gray-200 text-gray-700">
          <div className="text-xs text-gray-500">Replying to {msg.parentUsername}:</div>
          <div className="text-sm truncate">{msg.parentText}</div>
        </div>
      )}

      <div className="mt-1">{msg.text}</div>
      <div 
        className="text-xs cursor-pointer"
        onClick={() => onReply(msg)}
      >
        Reply
      </div>
    </div>
  );
}
