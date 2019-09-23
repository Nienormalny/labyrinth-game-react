import React, {useEffect} from 'react';
import 'aframe';
import {Entity} from 'aframe-react';

export default function Player(props) {
    useEffect(() => {
        setPlayer();
        setCircle();
    });
    const setPlayer = () => {
        const player = document.getElementById('player');
        const control = document.getElementById('control');

        player.setAttribute('position', '0 0.5 0');
        control.setAttribute('wasd-controls', false);
    };
    const setCircle = () => {
        const cursor = document.getElementById('cursor');

        cursor.setAttribute('position', '0 0 -1');
        cursor.setAttribute('material', 'color: white');
        cursor.setAttribute('visible', true);
        cursor.setAttribute('cursor', {
            fuseTimeout: 1000,
            fuse: true
        });
        cursor.setAttribute('geometry', {
            primitive: 'ring',
            radiusOuter: 0.012,
            radiusInner: 0.005
        });
    };
    return (
        <Entity id="player">
            <Entity position={props.setPosition} light={{type: 'point', color: '#ffffff', intensity: 2, decay: 2, distance: 5,}} />
            <Entity laser-controls raycaster="far: 35" />
            <Entity id="control" camera look-controls>
                <Entity id="cursor" />
                <Entity  position={{x: 0, y: 0., z: '-0.4'}}>
                    <Entity id="timer" text={{value: "00:00:00"}} align="center" height="0.3" width="0.3" visible="false" />
                </Entity>
            </Entity>
        </Entity>
    );
}