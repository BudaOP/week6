// App.js
import SingleCounter from "./SingleCounter"; // Import the SingleCounter component
import "./App.css"; // Import styles for the app
import { useState } from "react";
import useLocalStorage from "./useLocalStorage";

// PART 1
// const App = () => {
//   return (
//     <div className="app-container">
//       <SingleCounter />
//       <SingleCounter />
//       <SingleCounter />
//     </div>
//   );
// };

// export default App;

// PART 2
const App = () => {
  const [name, setName] = useLocalStorage("name", "");
  const [born, setBorn] = useLocalStorage("");
  const [height, setHeight] = useLocalStorage("");

  return (
    <div>
      <form>
        <div>
          Name:
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <br />
        <div>
          Birthdate:
          <input
            type="date"
            value={born}
            onChange={(event) => setBorn(event.target.value)}
          />
        </div>
        <br />
        <div>
          Height:
          <input
            type="number"
            value={height}
            onChange={(event) => setHeight(event.target.value)}
          />
        </div>
      </form>
      <div>
        {name} {born} {height}
      </div>
    </div>
  );
};

export default App;
