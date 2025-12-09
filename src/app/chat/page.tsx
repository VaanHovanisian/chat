// app/chat/page.tsx  (если ты используешь app router)
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

type Message = {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  createdAt: string;
  user?: { id: string; name?: string };
};

export default function ChatPage() {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const chatId = "1"; // заменяй на реальный
  const userId = "1"; // возьми из сессии/NextAuth

  useEffect(() => {
    const s = io(SOCKET_URL);
    setSocket(s);

    s.on("connect", () => {
      console.log("connected", s.id);
      s.emit("join", { chatId, userId });
    });

    s.on("history", (msgs: Message[]) => {
      setMessages(msgs);
    });

    s.on("message", (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    s.on("typing", ({ userId: uid, isTyping }: any) => {
      // handle typing indicator
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const send = () => {
    if (!socket) return;
    if (!text.trim()) return;
    socket.emit("message", { chatId, userId: userId, text });
    setText("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Chat</h1>
      <div style={{ border: "1px solid #ccc", height: 400, overflow: "auto", padding: 10 }}>
        {messages.map(m => (
          <div key={m.id} style={{ marginBottom: 8 }}>
            <b>{m.user?.name ?? m.userId}</b>: {m.text}
            <div style={{ fontSize: 10, color: "#666" }}>{new Date(m.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <Input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            socket?.emit("typing", { chatId, userId, isTyping: e.target.value.length > 0 });
          }}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          placeholder="Напиши сообщение..."
          style={{ width: "70%" }}
        />
        <Button onClick={send}>Send</Button>
      </div>
    </div>
  );
}
