import * as React from 'react';
import 'aframe';
import {Entity} from 'aframe-react';

export default function Player() {
    return (
        <Entity id="player" position={{x: 0, y: '0.5', z: 0}}>
            <Entity position={{x: 0, y: 1, z: 0}} light={{type: 'point', color: '#ffffff', intensity: 2, decay: 2, distance: 5,}} />
            <Entity laser-controls raycaster="far: 35" />
            <Entity camera look-controls wasd-controls>
                <Entity id="cursor" position={{x: 0, y: 0, z: '-0.5'}} geometry={{primitive: 'ring', radiusOuter: '0.012', radiusInner: '0.005'}} material={{color: 'white'}} cursor={{fuseTimeout: 1000, fuse: true}} visible={true} />
                <Entity  position={{x: 0, y: 0., z: '-0.4'}}>
                    <Entity id="timer" text={{value: "00:00:00"}} align="center" height="0.3" width="0.3" visible="false" />
                </Entity>
            </Entity>
        </Entity>
    );
}