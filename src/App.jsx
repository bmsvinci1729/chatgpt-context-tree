import { useState } from 'react'

function App() {
  const [value, setValue] = useState("");
  const [subVal, setSubVal] = useState("Nothing submitted yet");
  const [messages, setMessages] = useState([]);

  function onInputChange(e) {
    setValue(e.target.value);
  }

  function handleClick(e) {
    console.log("I am Clicked!!");
    setSubVal(value);
    setMessages([
      ...messages,
      value
    ]);
  }

  return (
    <div>
      <h1>Hey, Welcome to the land of ECHO-nversation</h1>
      <h3>Echo</h3>
      <input
        type="text"
        placeholder='Type here'
        value={value}
        onChange={onInputChange}
      />
      <button onClick={handleClick}>Submit</button>
      <div>
        <ul>
          {
            messages.map((msg) => {
              return (
                <li>{msg}</li>
              );
            })
          }
        </ul>
      </div>
    </div>
  );
}

export default App;
