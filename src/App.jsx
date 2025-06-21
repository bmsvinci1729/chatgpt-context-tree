import './App.css';
import { useState } from 'react'

export default function MyApp() {

  const [v, Sv] = useState([]);
  function handleClick() {
    Sv([...v, ['Chatty chatbox']]);
  }

  return (
    <>
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{
          background: 'grey',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <h2 style={{ color: 'black', backgroundColor: 'yellow', height: 'auto', width: 'auto' }}>Conversations</h2>
          <button onClick={handleClick} style={{ backgroundColor: 'rgb(253, 249, 7)', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', transition: 'background 0.3s ease', width: 'fit-content', height: 'auto' }}>
            {/* <></>New Chat */}
            New Chat
           
          </button>


          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {v.map((val, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'yellow',
                  color: 'black',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  textAlign: 'center'
                }}
              >
                {val}
              </div>
            ))}
          </div>

        </div>

        <div style={{
          background: 'black',
          flex: 3,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: '12px'
        }}>
          <h1 style={{ color: 'white' }}>childGPT</h1>
        </div>

      </div>
    </>
  );
}