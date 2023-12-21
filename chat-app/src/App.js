import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './components/enterName.js';
import EnterName from './components/enterName.js';
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";

function App() {
  // Create a Yjs document
  const ydoc = new Y.Doc();
  const sharedMessages = ydoc.getArray('messages');
  const typingState = ydoc.getMap('typingState');

  // Connect it to the backend
  const provider = new HocuspocusProvider({
    url: "ws://127.0.0.1:1234",
    name: "messages",
    document: ydoc,
  });

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const updateMessages = () => {
      setMessages(sharedMessages.toArray());
    };

    // Listen for changes on the sharedMessages
    sharedMessages.observe(updateMessages);

    // Initial update
    updateMessages();

    // Cleanup observer on unmount
    return () => {
      sharedMessages.unobserve(updateMessages);
    };
  }, []);

  const handleSend = () => {
    if (newMessage && hasEnteredName && !isSettingsOpen) {
      // Add the new message along with the username to the shared array
      sharedMessages.push([{ text: newMessage, timestamp: new Date().toISOString(), username }]);
      setNewMessage('');
    }
    typingState.delete(username);
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

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    typingState.set(username, e.target.value);
  };

  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    const updateTypingUsers = () => {
      const typing = {};
      typingState.forEach((message, user) => {
        if (message && user !== username) {
          typing[user] = message;
        }
      });
      setTypingUsers(typing);
    };

    typingState.observe(updateTypingUsers);
    updateTypingUsers();

    return () => {
      typingState.unobserve(updateTypingUsers);
    };
  }, [username]);

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
            {messages.map((message, index) => (
              <div key={index} className={`message-container ${message.username === username ? 'own-message' : 'other-message'}`}>
                <p className={message.username === username ? 'message sent own' : 'message sent other'}>
                  {message.text}
                </p>
                <p className={`time-and-name ${message.username === username ? 'own-message' : 'other-message'}`}>
                  {message.username} - {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
            {newMessage && (
              <div className='message-container own-message'>
                <p className='message typing own'>
                  {newMessage}
                </p>
                <p className='time-and-name own-message'>
                  Typing...
                </p>
              </div>
            )}
            <div className='typing-messages'>
              {Object.entries(typingUsers).map(([user, message]) => (
                <p key={user}>{`${user} is typing: ${message}`}</p>
              ))}
            </div>
          </>
        )}
        <div ref={chatEndRef} />
      </div>
      <footer>
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={handleTyping}
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