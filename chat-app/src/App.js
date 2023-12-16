import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  const handleSend = () => {
    if (newMessage) {
      setMessages([...messages, { text: newMessage, timestamp: new Date() }]);
      setNewMessage('');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const [username, setUsername] = useState('');
  const [hasEnteredName, setHasEnteredName] = useState(false);

  const handleNameSubmit = () => {
    if (username) {
      setHasEnteredName(true);
    }
  };

  return (
    <div className='chat-app'>
      <header>
        <h1>Group Chat</h1>
      </header>
      <div className='chat'>
        {!hasEnteredName ? (
          <div className='name-prompt'>
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleNameSubmit();
                  e.preventDefault(); 
                }
              }}
            />
            <button onClick={handleNameSubmit}>Enter</button>
          </div>
        ) : (
          messages.map((message, index) =>
          <div>
            <p className='sent-message' key={index}>
              {message.text}
            </p>
            <p className='time-and-name'>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          )
        )}
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