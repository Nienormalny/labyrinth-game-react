import React from 'react';
import './styles/style.scss';
import Player from './components/player/player.component';
import { Scene } from 'aframe-react';
function App() {
  return (
    <div className="App">
      <header className="App-header">
          <h1>Labyrinth Game</h1>
          <Scene id="labyrinth-scene">
            <Player/>
          </Scene>
      </header>
    </div>
  );
}

export default App;
