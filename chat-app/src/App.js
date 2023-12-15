import './App.css';

function App() {
  return (
    <div className='chat-app'>
      <header>
        <h1>Group Chat</h1>
      </header>
      <div className='chat'>

      </div>
      <footer>
        <input type="text" placeholder="Type a message" />
        <button className="send-btn">➤</button>
      </footer>
    </div>
  );
}

export default App;
