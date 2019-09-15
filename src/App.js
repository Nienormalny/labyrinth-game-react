import React from 'react';
import './styles/style.scss';
import Player from './components/player/player.component';
import { Scene } from 'aframe-react';
import HelpModal from './components/helpModal/helpModal.component';
function App() {
  return (
    <div className="App">
        <header>
            <h1>Labyrinth Game</h1>
        </header>
      <main className="App-header">
          <HelpModal/>
          <div id="preview">
              <Scene id="labyrinth-scene">
                  <Player/>
              </Scene>
          </div>
      </main>
    </div>
  );
}

export default App;
