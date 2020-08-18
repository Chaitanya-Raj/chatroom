import React from "react";
import "./App.css";

function App() {
  return (
    <div className="container">
      <div class="container">
        <div id="messages"></div>
      </div>
      <form action="">
        <input
          id="input"
          autocomplete="off"
          autofocus="on"
          placeholder="type your message here..."
        />
      </form>
    </div>
  );
}

export default App;
