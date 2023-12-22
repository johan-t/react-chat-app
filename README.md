# Quickstart Guide:

## Backend

Navigate to the 'backend' directory and run the following commands:

```bash
npm install
npx ts-node server.ts
```

## Frontend

Navigate to the 'chat-app' directory and run the following commands:

```bash
npm install
npm start
```

## Small documentation

### Key Components:

Yjs Integration: The app creates a Y.js document (Y.Doc) to manage shared states - sharedMessages for chat messages and typingState for tracking users' typing status.

**Hocuspocus Provider:** 

It connects to a Hocuspocus server using a WebSocket connection (ws://127.0.0.1:1234). This connection is established to sync the Y.js document across clients in real-time.

**State Management:**

messages: Stores chat messages. It's a React state synchronized with the Y.js shared array.
newMessage: Tracks the message currently being typed by the user.
userId, username, hasEnteredName, isSettingsOpen: Manage user-specific information and UI states.

**User Interaction:**

handleSend: Function to send a new message. It adds the message to the Y.js shared array and clears the input field.
handleTyping: Updates the typing state in real-time as the user types a message.
handleNameSubmit, handleSettingsClick: Functions to manage user settings and name entry.

**Real-Time Updates:**

Two useEffect hooks listen for changes in sharedMessages and typingState. They update the React state whenever there's a change in the shared Y.js data, ensuring all connected clients see the updates in real-time.

**UI Components:**

The app consists of a header, chat display area, and a footer with an input field for typing messages.
The EnterName component is used for user name entry.

# Current limitations:

- When running the app locally it can take a while until the message state is updated. This is most likely caused by external factors. (I had different performance results on different machines and networks)

- When you change your username, after sending a message, the message will keep the old username. This is because the message is sent before the username is updated.

- Typing indicators are not cleared after a certain amount of time. 