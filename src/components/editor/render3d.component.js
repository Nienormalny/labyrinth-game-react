import React, {useEffect, useState}     from 'react';
import * as _                           from 'lodash';
import 'aframe';
import {Entity}                         from 'aframe-react';
import * as actionTypes                 from '../../store/actions';
import {connect}                        from 'react-redux';
import Player                           from '../player/player.component';

// const AFRAME = window.AFRAME;
let finishPoint = false;

function Render3D(props) {
    let time;
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let fullTime;
    const {mapArray, finalMapArray, movementCount} = props.defaultSettings;
    let positionPlayer = {x: 0, y: 1, z: 0} /* (THIS IS INITIAL VALUE) */;
    let timer = null;

    const changePosition = (position, option) => {
        props.changeSetting('actualPlayerPosition', position);
        props.changeSetting('movementCount', movementCount + 1);
        if (movementCount === 0) {
            timer = setInterval(() => count(), 1000);
        }
        if (option === 'finish') {
            finishPoint = true;
            props.changeSetting('finish', true);
        }
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

            props.changeSetting('time', time);
            props.changeSetting('timeStringValue', fullTime);
        } else {
            return clearInterval(timer)
        }
    }

    let render3DBlocks = _.map(mapArray, (n, x) => {
        return _.map(mapArray, (a, z) => {
            switch (finalMapArray[mapArray[x][z]]) {
                case 0:
                    return <Entity key={mapArray[x][z]} geometry={{primitive: 'box', height: 5}} position={{x, y: 0.5, z}} material={{color: '#333333'}} option="0" data-name="wall"/>;
                case 1:
                    return <Entity key={mapArray[x][z]} geometry={{primitive: 'box', height: 0.1, width: 0.9, depth: 0.9}} events={{click: () => changePosition({x, y: 1, z})}} position={{x, y: 0.5, z}} material={{color: '#1ace65'}} option="1" data-name="path" movement/>;
                case 2:
                    positionPlayer = {x, y: 1, z};
                    return <Entity key={mapArray[x][z]} geometry={{primitive: 'box', height: 0.1, width: 0.9, depth: 0.9}} events={{click: () => changePosition({x, y: 1, z})}} position={{x, y: 0.5, z}} material={{color: '#ff2c2c'}} option="2" data-name="start"/>;
                case 3:
                    return <Entity key={mapArray[x][z]} geometry={{primitive: 'box', height: 0.1, width: 0.9, depth: 0.9}} events={{click: () => changePosition({x, y: 1, z}, 'finish')}} position={{x, y: 0.5, z}} material={{color: '#0e7ef6'}} option="3" data-name="finish"/>;
                default:
                    return <Entity key={mapArray[x][z]} geometry={{primitive: 'box', height: 5}} position={{x, y: 0.5, z}} material={{color: '#333333'}}/>;
            }
        })
    });

    useEffect(() => {
        props.changeSetting('vrView', true);
        props.changeSetting('generateGrid', false);
        props.changeSetting('timeVisible', true);
        props.changeSetting('actualPlayerPosition', positionPlayer);
        document.getElementById('render-labyrinth').enterVR();
    }, []);

    return (
        <a-scene id="render-labyrinth">
            <Entity light={{type: 'spot', color: '#ffffff', intensity: 3, decay: 1.6, distance: 24.5}} position={{x: 0, y: 7.5, z: -13}} />
            <Entity light={{type: 'spot', color: '#ffffff', intensity: 5, decay: 1.6, distance: 24.5}} position={{x: 0, y: 20, z: -13}} />
            <Player/>
            {render3DBlocks}
        </a-scene>
    )
};

const mapStateToProps = state => {
    return {
        defaultSettings: state.defaultSettings
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeSetting: (setting, value) => dispatch({type: actionTypes.CHANGE_DEFAULT_SETTING, setting, value})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Render3D);