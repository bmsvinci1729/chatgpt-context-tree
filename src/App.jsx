import './App.css';
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { LuSun } from 'react-icons/lu';
import { LuMoon } from 'react-icons/lu';
export default function ChatApp() {

  // the states
  /*
    1. left panel chat section is stored - id, name/title and messages(content)
    2. activeChatId - current chat of the panel (left) which is active or being used on the right
    3. inputText - prompt / chat we enter in the box in the main panel
  */
  const [chats, setChats] = useState([
    { id: 1, title: 'Memory 1', messages: [] }
  ]);
  const [activeChatId, setActiveChatId] = useState(1);
  const [inputText, setInputText] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // the functions
  /*
    1. addNewChat() - adding new chat
    2. addSubChat() - add subchats to my present one
    3. promptSend() - send prompts to gemini to get back the response and display on the main panel for the active chat
  */
  function addNewChat() {
    const newId = chats.length + 1;
    setChats([...chats, { id: newId, title: `Memory ${newId}`, messages: [] }]);
    setActiveChatId(newId);
  }

  function addSubChat(parentId) {
    const parentChat = chats.find(chat => chat.id === parentId);
    const newId = chats.length + 1;
    setChats([
      ...chats,
      {
        id: newId,
        title: `${parentChat.title} (subchat)` ,
        messages: [...parentChat.messages],
        parentId: parentId
      }
    ]);
    setActiveChatId(newId);
  }


  async function promptSend() {
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
            const newTitle = isFirstMessage ? inputText.split(/\s/).slice(0, 5).join(' ') : chat.title;
            return {
              ...chat, title: newTitle, messages: [...chat.messages, userMessage]
            }
          }
          return chat;
        })
      );

      // >>>CONTEXT INCLUSION HEE HAA<<<
      const N = 6;
      const chat = chats.find(c => c.id === activeChatId) || { messages: [] };
      const recentMessages = chat.messages.slice(-N); // if less then all of them are scraped
      const contextParts = recentMessages.map(m => ({
        text: m.text
      }));
      contextParts.push({ text: inputText });

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: contextParts }]
        })
      });
      setInputText('');
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

    } catch (error) {
      console.error('Error', error);
    }
  }


  const activeChat = chats.find(chat => chat.id === activeChatId);

  return (

    <div className="app-container">
      <div className="sidebar">
        <h2 className="sidebar-header">Memories</h2>
        <button
          className="new-chat-button"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <LuMoon /> : <LuSun />}
        </button>

        <button className="new-chat-button" onClick={addNewChat}>
          New Chat
        </button>
        <div>
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`chat-item${chat.id === activeChatId ? ' active' : ''}`}
              onClick={() => setActiveChatId(chat.id)}
            >
              {chat.title}
              <button onClick = {()=>addSubChat(chat.id)}>+</button>
            </div>
          ))}
        </div>
      </div>

      <div className="main">
        <h1 className="title">childGPT</h1>
        <div className="chat-window">
          {activeChat && activeChat.messages.map((msg, idx) => (
            <div
              key={idx}
              className={msg.role === 'user' ? 'user-bubble' : 'bot-bubble'}
            >
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
                promptSend();
              }
            }}
            rows={2}
            className="textarea"
          />

          <button className="send-button" onClick={promptSend}>
          </button>
        </div>
      </div>
    </div>
  );

}