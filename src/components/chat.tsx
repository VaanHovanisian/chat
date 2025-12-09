/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
"use client";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export  function Chat({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socket = io("http://localhost:3000");
    socket.emit("join", { userId });

    socket.on("newMessage", (msg) => {
      setMessages((s) => [...s, msg]);
      ref.current?.scrollIntoView({ behavior: "smooth" });
    });

    // initial fetch of last 50 messages
    fetch("/api/chat/history")
      .then((r) => r.json())
      .then((data) => setMessages(data));

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const send = async () => {
    if (!text.trim()) return;
    socket.emit("sendMessage", { text, userId });
    setText("");
  };

  return (
    <div>
      <div style={{ height: 400, overflow: "auto" }}>
        {messages.map((m) => (
          <div key={m.id}>
            <b>{m.user?.name ?? m.userId}:</b> {m.text}
          </div>
        ))}
        <div ref={ref} />
      </div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={send}>Send</button>
    </div>
  );
}
