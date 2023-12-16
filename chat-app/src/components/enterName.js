import React from 'react';
import './enterName.css';

function EnterName({ username, setUsername, handleNameSubmit }) {
    return (
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
    );
}

export default EnterName;