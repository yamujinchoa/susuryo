"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

type Message = {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  created_at: string;
};

type PresenceUser = {
  presence_ref: string;
  user_id?: string;
  user_name?: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [usernameSet, setUsernameSet] = useState(false);

  useEffect(() => {
    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem("userId", storedUserId);
    }
    setUserId(storedUserId);

    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setUsernameSet(true);
    }

    fetchMessages();

    const messageChannel = supabase
      .channel("public:chat_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            payload.new as Message,
          ]);
          setTimeout(() => {
            setMessages((prevMessages) =>
              prevMessages.filter(
                (msg) => msg.id !== (payload.new as Message).id
              )
            );
          }, 600000);
        }
      )
      .subscribe();

    const onlineChannel = supabase.channel("online-users", {
      config: {
        presence: {
          key: storedUserId,
        },
      },
    });

    onlineChannel
      .on("presence", { event: "sync" }, () => {
        const state = onlineChannel.presenceState();
        const onlineUsersList = Object.keys(state)
          .flatMap((key) =>
            state[key].map((user: PresenceUser) => user.user_name || "")
          )
          .filter((username) => username !== "");
        setOnlineUsers(onlineUsersList);
      })
      .subscribe();

    if (storedUsername) {
      onlineChannel.track({ user_id: storedUserId, user_name: storedUsername });
    }

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(onlineChannel);
    };
  }, []);

  useEffect(() => {
    if (usernameSet && userId) {
      const onlineChannel = supabase
        .getChannels()
        .find((channel) => channel.topic === "online-users");
      if (onlineChannel) {
        onlineChannel.track({ user_id: userId, user_name: username });
      }
    }
  }, [usernameSet, userId, username]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select()
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error.message);
    } else {
      setMessages(data || []);
    }
  };

  const handleSetUsername = () => {
    if (username) {
      setUsernameSet(true);
      localStorage.setItem("username", username);

      const onlineChannel = supabase
        .getChannels()
        .find((channel) => channel.topic === "online-users");
      if (onlineChannel) {
        onlineChannel.track({ user_id: userId, user_name: username });
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage || !usernameSet) return;

    const { error } = await supabase
      .from("chat_messages")
      .insert([{ user_id: userId, user_name: username, message: newMessage }]);

    if (error) {
      console.error("Error sending message:", error.message);
    } else {
      setNewMessage("");
    }
  };

  useEffect(() => {
    const chatBox = document.querySelector(".chat-box");
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="container mt-5">
      <h2 className="text-center">크몽인들의 밤 - 실시간 채팅</h2>

      <div className="online-users mb-3">
        <strong>온라인 사용자 수: </strong>
        {onlineUsers.length > 0 ? (
          <span className="badge bg-success me-2">{onlineUsers.length}</span>
        ) : (
          <span className="text-muted">없음</span>
        )}
      </div>

      {!usernameSet && (
        <div className="mb-3">
          <label className="form-label">이름</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="이름을 입력하세요"
            required
          />
          <button onClick={handleSetUsername} className="btn btn-primary mt-2">
            이름 설정
          </button>
        </div>
      )}

      {usernameSet && (
        <>
          <div className="mb-3">
            <strong>사용자 이름: {username}</strong>
          </div>

          <div
            className="chat-box card mt-4 mb-4 p-3"
            style={{ height: "400px", overflowY: "scroll" }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-message mb-2 ${
                  msg.user_id === userId ? "text-end" : ""
                }`}
                style={{ color: msg.user_id === userId ? "blue" : "black" }}
              >
                <strong>{msg.user_name}:</strong> {msg.message}
                <div className="text-muted" style={{ fontSize: "0.8em" }}>
                  {new Date(msg.created_at).toLocaleString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage}>
            <div className="mb-3">
              <label className="form-label">
                {username}님, 메시지를 입력하세요
              </label>
              <input
                type="text"
                className="form-control"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              전송
            </button>
          </form>
        </>
      )}
    </div>
  );
}
