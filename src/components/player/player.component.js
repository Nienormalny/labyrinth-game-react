import React                    from 'react';
import 'aframe';
import {Entity}                 from 'aframe-react';

function Player({lightOff, positionPlayer, timeVisible, timeStringValue, cursorVisibility}) {
    let playerPosition = positionPlayer ? positionPlayer : {x: 0, y: 1, z: 0};

    return (
        <Entity id="player" primitive="a-camera" position={playerPosition}>
            {!lightOff && <Entity position={{x: 0, y: 10, z: 0}} light={{type: 'directional', color: '#ffffff', intensity: 2, decay: 2, distance: 5,}} />}
            {cursorVisibility && <Entity cursor={{fuse: true, fuseTimeout: 800}} raycaster="objects: .clickable"><Entity primitive="a-cursor" scale="0.5 0.5 0.5" position={{x: 0, y: 0, z: '-1'}} material={{color: 'white'}} /></Entity>}
            <Entity  position={{x: 0, y: 0.1, z: '-0.4'}}>
                <Entity id="timer" primitive="a-text" value={timeStringValue} align="center" height="0.3" width="0.3" visible={timeVisible} />
            </Entity>
        </Entity>
    );
}

export default Player;