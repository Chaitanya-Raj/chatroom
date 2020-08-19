import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io.connect();

function App() {
  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState([]);
  const [username, setUsername] = useState(null);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    socket.on("is_online", (status) => {
      setChats((p) => [...p, status]);
      // console.log("status", status);
      window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on("chat_message", (msg) => {
      setChats((p) => [...p, msg]);
      // console.log("msg", msg);
      window.scrollTo(0, document.body.scrollHeight);
    });

    return () => socket.disconnect();
  }, []);

  if (!username) {
    return (
      <div className="nickname">
        <form
          id="nickname-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (nickname !== "") {
              socket.emit("username", nickname);
              // console.log("username", nickname);
              setUsername(nickname);
            }
          }}
        >
          <label htmlFor="nickname">What's your name?</label>
          <input
            type="text"
            name="nickname"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoFocus
            maxLength="20"
          />
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="content">
        <div id="messages">
          {chats.map((chat, index) => {
            if (chat.type === "message") {
              let self = chat.user === username ? "self" : "";
              return (
                <div className={`message ${self}`} key={index}>
                  {chat.user === username
                    ? `${chat.message}`
                    : `${chat.user} : ${chat.message}`}
                </div>
              );
            } else
              return (
                <div
                  className="status"
                  key={index}
                >{`${chat.user} has ${chat.action}`}</div>
              );
          })}
        </div>
      </div>
      <form
        id="message-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (msg !== "") {
            socket.emit("chat_message", msg);
            setMsg("");
          }
        }}
      >
        <input
          id="message-input"
          autoComplete="off"
          autoFocus="on"
          placeholder="type your message here..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
      </form>
    </div>
  );
}

export default App;
