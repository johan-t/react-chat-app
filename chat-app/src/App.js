import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './components/enterName.js';
import EnterName from './components/enterName.js';

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  const handleSend = () => {
    if (newMessage && hasEnteredName && !isSettingsOpen) {
      setMessages([...messages, { text: newMessage, timestamp: new Date() }]);
      setNewMessage('');
      console.log(username)
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
      setIsSettingsOpen(false);
    }
  };

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  return (
    <div className='chat-app'>
      <header>
        <h1>Group Chat</h1>
        <button onClick={handleSettingsClick}>Settings</button>
      </header>
      <div className='chat'>
        {(!hasEnteredName || isSettingsOpen) ? (
          <EnterName
            username={username}
            setUsername={setUsername}
            handleNameSubmit={handleNameSubmit}
          />
        ) : (
          <>
            {messages.map((message, index) =>
              <div key={index} className='message-container'>
                <p className='sent-message'>
                  {message.text}
                </p>
                <p className='time-and-name'>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}
            {newMessage && (
              <div className='message-container'>
                <p className='sent-message'>
                  {newMessage}
                </p>
                <p className='time-and-name'>
                  Typing...
                </p>
              </div>
            )}
          </>
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