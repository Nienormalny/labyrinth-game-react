import React    from 'react';
import * as _                           from 'lodash';
import 'aframe';
import {Entity}                         from 'aframe-react';

let finishPoint = false;
let positionPlayer = undefined;
let movementCount = 0;
let firstPlayerPlacement = 0;

function Render3D({finalMap, changePlayerPosition, timeValue}) {
    let time;
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let fullTime;
    let timer = null;

    const changePosition = (position, option) => {
        if (movementCount === 0) {
            timer = setInterval(() => count(), 1000);
        }
        if (option === 'finish') {
            finishPoint = true;
        }
        changePlayerPosition(position);
    };

    function count() {
        if (!finishPoint) {
            seconds = seconds + 1;
            if (seconds >= 60) {
                seconds = 0;
                minutes = minutes + 1;
                if (minutes >= 60) {
                    minutes = 0;
                    hours = hours + 1;
                }
            }

            fullTime = String(hours).padStart(2, '0') + ":" + String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');

            time = {
                seconds: seconds,
                minutes: minutes,
                hours: hours,
                stringTime: fullTime,
                owner: {}
            };
            timeValue(fullTime);
        } else {
            return clearInterval(timer)
        }
    }

    const render3DBlocks = _.map(finalMap.map, (n, x) => {
        return _.map(finalMap.map, (a, z) => {
            switch (finalMap.final[finalMap.map[x][z]]) {
                case 0:
                    return <Entity key={finalMap.map[x][z]} geometry={{primitive: 'box', height: 5}} position={{x, y: 0.5, z}} material={{color: '#333333'}} option="0" data-name="wall"/>;
                case 1:
                    return <Entity key={finalMap.map[x][z]} geometry={{primitive: 'box', height: 0.1, width: 0.9, depth: 0.9}} events={{click: () => changePosition({x, y: 1, z})}} position={{x, y: 0.5, z}} material={{color: '#1ace65'}} option="1" data-name="path" movement/>;
                case 2:
                    if (_.isUndefined(positionPlayer)) {
                        firstPlayerPlacement++;
                        positionPlayer = {x, y: 1, z};
                        if (firstPlayerPlacement < 2) {
                            changePlayerPosition(positionPlayer);
                        }
                    }
                    return <Entity key={finalMap.map[x][z]} geometry={{primitive: 'box', height: 0.1, width: 0.9, depth: 0.9}} events={{click: () => changePosition({x, y: 1, z})}} position={{x, y: 0.5, z}} material={{color: '#ff2c2c'}} option="2" data-name="start"/>;
                case 3:
                    return <Entity key={finalMap.map[x][z]} geometry={{primitive: 'box', height: 0.1, width: 0.9, depth: 0.9}} events={{click: () => changePosition({x, y: 1, z}, 'finish')}} position={{x, y: 0.5, z}} material={{color: '#0e7ef6'}} option="3" data-name="finish"/>;
                default:
                    return <Entity key={finalMap.map[x][z]} geometry={{primitive: 'box', height: 5}} position={{x, y: 0.5, z}} material={{color: '#333333'}}/>;
            }
        })
    });

    return (
        <a-entity id="render-labyrinth">
            {render3DBlocks}
        </a-entity>
    )
}

export default Render3D;