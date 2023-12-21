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

  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Generate a unique ID when the app is loaded
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    setUserId(uniqueId);
  }, []);

  useEffect(() => {
    const updateMessages = () => {
      setMessages(sharedMessages.toArray());
    };
    sharedMessages.observe(updateMessages);
    updateMessages();

    // Cleanup observer on unmount
    return () => {
      sharedMessages.unobserve(updateMessages);
    };
  }, []);

  const handleSend = () => {
    if (newMessage && hasEnteredName && !isSettingsOpen) {
      // Include the userId when adding the new message
      sharedMessages.push([{ text: newMessage, timestamp: new Date().toISOString(), username, userId }]);
      setNewMessage('');
    }
    typingState.delete(userId); // Use userId to delete the typing state
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
    typingState.set(userId, { username: username, message: e.target.value }); // Use userId as the key
  };  

  const [typingUsers, setTypingUsers] = useState({});

  useEffect(() => {
    const updateTypingUsers = () => {
      const typing = {};
      typingState.forEach((typingInfo, id) => {
        if (typingInfo.message && id !== userId) { // Compare with userId, not username
          typing[typingInfo.username] = typingInfo.message;
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
              <div key={index} className={`message-container ${message.userId === userId ? 'own-message' : 'other-message'}`}>
                <p className={message.userId === userId ? 'message sent own' : 'message sent other'}>
                  {message.text}
                </p>
                <p className={`time-and-name ${message.userId === userId ? 'own-message' : 'other-message'}`}>
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
            {Object.entries(typingUsers).map(([user, message]) => (
              <div key={user} className='message-container other-message'>
                <p className='message typing other'>{message}</p>
                <p className='time-and-name other-message'>{user} - Typing...</p>
              </div>
            ))}
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