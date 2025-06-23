import './App.css';
import { useState } from 'react';
import Markdown from 'react-markdown';
// dotenv import

export default function MyApp() {
  const [v, Sv] = useState([]);
  const [inputText, setInputText] = useState('');
  const [resp, setResp] = useState('');

  function handleClick() {
    Sv([...v, 'Chatty chatbox']);
  }

  async function handleSend() {
    if (inputText === '') {
      alert("Ask to become deserving first!");
      return;
    }

    const API_KEY = 'AIzaSyCaKymLnI--F37Vn2RlFsTo8rE1dy3bCao';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: inputText }] }]
        })
      });

      const data = await response.json();
      const result = data.candidates[0].content.parts[0].text;

      // console.log(result);
      // Use result however you need
      setResp(result);

    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <>
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ background: '#D4A373', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{
            color: '#0F172A', backgroundColor: '#D4A373', height: 'auto', width: 'auto', textAlign: 'center'
          }}>Memories</h2>
          <button onClick={handleClick} style={{
            backgroundColor: '#fefae0', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '8px',
            fontSize: '16px', cursor: 'pointer', width: 'fit-content', height: 'auto'
          }}>New Chat</button>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '10px', width: '100%'
          }}>
            {v.map((val, index) => (
              <div key={index} style={{
                backgroundColor: '#0B1E', color: 'white', padding: '8px 12px', borderRadius: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)', textAlign: 'center'
              }}>{val}</div>
            ))}
          </div>
        </div>

        <div style={{
          background: '#0F172A', flex: 3, display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: '16px'
        }}>
          <h1 style={{
            color: '#10FDF8', textAlign: 'center', fontSize: '32px',
            marginBottom: '20px', fontWeight: 'bold'
          }}>childGPT</h1>


          {/*Main component typing box (chat box)*/}
          <div>

            {resp && (
              <div style={{
                backgroundColor: '#fefae0', color: '#0F172A', padding: '12px', marginTop: '16px', borderRadius: '8px'
              }}>
                <em>childGPT:</em> <Markdown>{resp}</Markdown>
              </div>
            )}

          </div>
          <div style={{
            display: 'flex', alignItems: 'center',
            borderRadius: '60px', padding: '30px 25px', border: '1px solid #D4A373'
          }}>
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

              rows={4}
              style={{
                flex: 1, resize: 'none', border: 'none', outline: 'none', color: "#CCD5AE",
                backgroundColor: 'transparent', fontSize: '16px'
              }}
            />

            <button className="arrow-right send-button"

              onClick={handleSend}
              style={{
                backgroundColor: '#D4A373', border: 'none', color: '#0F172A',
                borderRadius: '50%', width: '50px', height: '50px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', cursor: 'pointer', marginLeft: '8px'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-up-short" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5A.5.5 0 0 0 8 12z" />
              </svg> {/* xmlns  used for namespace */}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
