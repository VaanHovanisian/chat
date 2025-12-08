/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
"use client";

import io from "socket.io-client";
import { useEffect, useState } from "react";

export const Chat = () => {
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const s = io("http://localhost:3000");
    setSocket(s);

    s.on("message", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("message", text);
    setText("");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Socket.IO Chat</h1>

      <div className="border rounded h-64 p-2 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg.id}>{msg.text}</div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border p-2 rounded flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};
