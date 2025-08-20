import { useState } from "react";
import { api } from "../lib/api";
import type { Me } from "../App";
import { useNavigate } from "react-router-dom";

export default function Login({ onAuthed }: { onAuthed: (m: Me) => void }) {
  const nav = useNavigate();
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await api.post("/auth/login", { email, password });
      onAuthed({ id: r.data.id, username: r.data.username });
      nav("/"); // redirect to Home
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Login failed");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <h1 className="text-xl font-bold">Login</h1>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <input className="border p-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
    </form>
  );
}
