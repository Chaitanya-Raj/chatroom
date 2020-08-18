import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io.connect("http://localhost:5000");

function App() {
  const [msg, setMsg] = useState("");
  const [chats, setChats] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    let user = prompt("Please tell me your name");
    socket.emit("username", user);
    setUsername(user);
    console.log("username", user);

    socket.on("is_online", (status) => {
      setChats((p) => [...p, status]);
      console.log("status", status);
      window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on("chat_message", (msg) => {
      setChats((p) => [...p, msg]);
      console.log("msg", msg);
      window.scrollTo(0, document.body.scrollHeight);
    });

    return () => socket.disconnect();
  }, []);

  // useEffect(() => console.log(chats), [chats]);

  return (
    <div className="container">
      <div className="content">
        <div id="messages">
          {chats.map((chat, index) => {
            if (chat.type === "message") {
              let self = chat.user === username ? "self" : "";
              return (
                <div
                  className={`message ${self}`}
                  key={index}
                >{`${chat.user} : ${chat.message}`}</div>
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
        onSubmit={(e) => {
          e.preventDefault();
          socket.emit("chat_message", msg);
          setMsg("");
          return false;
        }}
      >
        <input
          id="input"
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
