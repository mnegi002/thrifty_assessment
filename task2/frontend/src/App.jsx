import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";

const socket = io("http://localhost:3001", { autoConnect: true });

export default function App() {
  const [userId] = useState(uuid());
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);

  // socket lifecycle
  useEffect(() => {
    const onConnect = () => {
      // fresh session each connect
      setMessages([]);
    };
    socket.on("connect", onConnect);

    socket.on("message", (msg) => {
      // normal chat message (pending -> later update)
      setMessages((prev) => [...prev, { ...msg, type: "chat" }]);
    });

    socket.on("sentimentUpdate", ({ id, sentiment }) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, sentiment } : m))
      );
    });

    socket.on("systemMessage", (text) => {
      // treat as system; NO sentiment
      setMessages((prev) => [
        ...prev,
        { id: uuid(), type: "system", text, createdAt: new Date().toISOString() },
      ]);
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("message");
      socket.off("sentimentUpdate");
      socket.off("systemMessage");
    };
  }, []);

  const joinChat = () => {
    if (!name.trim()) return;
    socket.emit("join", { userId, name: name.trim() });
    setJoined(true);
  };

  const sendMessage = (text) => {
    fetch("http://localhost:3001/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, text }),
    }).catch(console.error);
  };

  return (
    <div className="flex flex-col items-center   h-full min-h-screen   w-full p-4 ">
      {!joined ? (
        <div className=" p-6  bg-gray-500  rounded-lg shadow w-full max-w-md">
          <h1 className="text-xl font-semibold text-center  mb-3">Join the chat</h1>
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              onClick={joinChat}
            >
              Join
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl  bg-gray-500 rounded-lg shadow flex flex-col ">
          <div className=" px-4 text-center  py-3 font-semibold">Real-Time Chat App</div>
          <div className="flex-1 overflow-y-auto">
            <MessageList messages={messages} selfName={name} />
          </div>
          <MessageInput onSend={sendMessage} />
        </div>
      )}
    </div>
  );
}
