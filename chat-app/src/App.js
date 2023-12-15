import React, { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    setMessages([...messages, newMessage]);
    setNewMessage('');
  };

  return (
    <div className='chat-app'>
      <header>
        <h1>Group Chat</h1>
      </header>
      <div className='chat'>
        {messages.map((message, index) => <p key={index}>{message}</p>)}
      </div>
      <footer>
        <input type="text" placeholder="Type a message" value={newMessage} onChange={e => setNewMessage(e.target.value)} />
        <button className="send-btn" onClick={handleSend}>➤</button>
      </footer>
    </div>
  );
}

export default App;