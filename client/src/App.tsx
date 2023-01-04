import React from 'react';
import './styles/App.css';
import Canvas from "./components/Canvas";
import Header from "./components/Header";

function App() {

  return (
    <div className="App">
      <Header/>
      <section>
          <Canvas/>
      </section>
    </div>
  );
}

export default App;
