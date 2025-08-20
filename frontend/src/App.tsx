import { Route, Routes, Navigate, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostPage from "./pages/PostPage";
import { useEffect, useState } from "react";
import { api } from "./lib/api";

export type Me = { id: string; username: string } | null;

export default function App() {
  const [me, setMe] = useState<Me>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get("/auth/me").then(r => setMe(r.data)).catch(()=>{}).finally(()=>setLoaded(true));
  }, []);

  if (!loaded) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <Link to="/" className="text-2xl font-bold">LetsDiscuss</Link>
        <nav className="flex gap-3">
          {me ? (
            <>
              <span className="text-sm">Hi, {me.username}</span>
              <button onClick={() => api.post("/auth/logout").then(()=>setMe(null))}
                      className="text-sm underline">Logout</button>
            </>
          ) : (
            <>
              <Link className="underline text-sm" to="/login">Login</Link>
              <Link className="underline text-sm" to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home me={me} />} />
        <Route path="/login" element={me ? <Navigate to="/" /> : <Login onAuthed={setMe} />} />
        <Route path="/signup" element={me ? <Navigate to="/" /> : <Signup onAuthed={setMe} />} />
        <Route path="/post/:id" element={<PostPage me={me} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
