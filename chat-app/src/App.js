import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    setMessages([...messages, newMessage]); // Add new message to the list of messages
    setNewMessage('');
  };

  return (
    <div className='chat-app'>
      <header>
        <h1>Group Chat</h1>
      </header>
      <div className='chat'>
        {messages.map((message, index) =>
          <p className='sent-message' key={index}>
            {message}
          </p>)}
      </div>
      <footer>
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleSend();
              e.preventDefault(); // Prevents form submission
            }
          }}
        />
        <button className="send-btn" onClick={handleSend}>➤</button>
      </footer>
    </div>
  );
}

export default App;