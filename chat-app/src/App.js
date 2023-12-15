import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  const handleSend = () => {
    setMessages([...messages, newMessage]); // Add new message to the list of messages
    setNewMessage('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); // scrolls to the bottom div
  }, [messages]);

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
        <div ref={chatEndRef} />
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
              e.preventDefault(); 
            }
          }}
        />
        <button className="send-btn" onClick={handleSend}>➤</button>
      </footer>
    </div>
  );
}

export default App;