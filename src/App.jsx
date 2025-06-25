import './App.css';
import { useState } from 'react';
import Markdown from 'react-markdown';

export default function ChatApp() {

  const [chats, setChats] = useState([
    { id: 1, title: 'Memory 1', messages: [] }
  ]);

  const [activeChatId, setActiveChatId] = useState(1);
  const [inputText, setInputText] = useState('');

  function handleClick() {
    const newId = chats.length + 1;
    setChats([...chats, { id: newId, title: `Memory ${newId}`, messages: [] }]);
    setActiveChatId(newId);
  }

  async function handleSend() {
    if (inputText === '') {
      alert('Ask to become deserving first lad!!');
      return;
    }

    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const userMessage = { role: 'user', text: inputText };
      setChats(prevChats =>
        prevChats.map(chat => {
          if (chat.id === activeChatId) {
            const isFirstMessage = chat.messages.length === 0;
            const newTitle = isFirstMessage
              ? inputText.split(/\s+/).slice(0, 5).join(' ')
              : chat.title;
            return {
              ...chat,
              title: newTitle,
              messages: [...chat.messages, userMessage]
            };
          }
          return chat;
        })
      );



      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: inputText }] }]
        })
      });

      const data = await response.json();
      const result = data.candidates[0].content.parts[0].text;
      const botMessage = { role: 'bot', text: result };

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, botMessage] }
            : chat
        )
      );

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === activeChatId ? { ...chat, messages: [...chat.messages, botMessage] } : chat
        )
      )

      setInputText('');
    } catch (error) {
      console.error('Error', error);
    }
  }

  const activeChat = chats.find(chat => chat.id === activeChatId);

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2 className="sidebar-header">Memories</h2>
        <button onClick={handleClick} className="new-chat-button">New Chat</button>
        <div>
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`chat-item ${chat.id === activeChatId ? 'active' : ''}`}
              onClick={() => setActiveChatId(chat.id)}
            >
              {chat.title}
            </div>
          ))}
        </div>
      </div>

      <div className="main">
        <h1 className="title">childGPT</h1>
        <div className="chat-window">
          {activeChat.messages.map((msg, index) => (
            <div key={index} className={msg.role === 'user' ? 'user-bubble' : 'bot-bubble'}>
              <Markdown>{msg.text}</Markdown>
            </div>
          ))}
        </div>

        <div className="input-container">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Help is given to those who deserve it ..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={2}
            className="textarea"
          />

          <button className="send-button" onClick={handleSend}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 
                   2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 
                   0 0 0-.708 0l-3 3a.5.5 0 1 0 
                   .708.708L7.5 5.707V11.5A.5.5 
                   0 0 0 8 12z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}