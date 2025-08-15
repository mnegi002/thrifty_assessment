
import React from "react";

const bubbleBg = (sentiment) => {
  switch (sentiment) {
    case "positive":
      return "bg-green-100";
    case "negative":
      return "bg-red-100";
    case "neutral":
      return "bg-gray-100";
    case "pending":
    default:
      return "bg-gray-100";
  }
};

const SentimentRow = ({ sentiment }) => {
  if (sentiment === "pending") {
    return (
      <div className="mt-1 flex items-center gap-2">
        <span className="text-xs text-gray-500">Sentiment: </span>
        <span className="h-2 w-16 rounded bg-gray-300 animate-pulse" />
      </div>
    );
  }
  return (
    <div className="mt-1 text-xs text-gray-600">
      Sentiment: <span className="font-medium capitalize">{sentiment}</span>
    </div>
  );
};

export default function MessageList({ messages }) {
  return (
    <div className="p-4  space-y-3">
      {messages.map((msg) => {
        if (msg.type === "system") {
          
          return (
            <div key={msg.id} className="flex justify-center my-1">
              <span className="px-3 py-1 text-xs rounded-full bg-gray-700 text-white shadow">
                {msg.text}
              </span>
            </div>
          );
        }

        // normal chat message
        return (
          <div
            key={msg.id}
            className={`p-3 rounded-lg  w-[50%] shadow-sm ${bubbleBg(msg.sentiment)}`}
          >
            <p className="text-sm  font-semibold">{msg.name}</p>
            <p className="text-[15px] text-gray-900">{msg.text}</p>
            <SentimentRow sentiment={msg.sentiment} />
          </div>
        );
      })}
    </div>
  );
}
