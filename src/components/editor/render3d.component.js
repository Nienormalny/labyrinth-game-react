import React, {useEffect, useState}     from 'react';
import * as _                           from 'lodash';
import * as AFRAME from 'aframe';
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
    const [actualPosition, setActualPosition] = useState(undefined);

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
            const blockPosition = x + ' 0.5 ' + z;
            switch (finalMapArray[mapArray[x][z]]) {
                case 0:
                    return <a-box key={mapArray[x][z]} height={5} position={blockPosition} material="color: #333333" option="0" data-name="wall"/>;
                case 1:
                    return <a-box key={mapArray[x][z]} height={0.1} width={0.9} depth={0.9} position={blockPosition} material="color: #1ace65" option="1" data-name="path" movement/>;
                case 2:
                    positionPlayer = x + ' 1 ' + z;
                    if (!actualPosition) {
                        setActualPosition(positionPlayer);
                    }
                    // onClick={(click) => changePosition(`${x}0.5 ${z}`)}
                    return <a-box key={mapArray[x][z]} height={0.1} width={0.9} depth={0.9} position={blockPosition} material="color: #ff2c2c" option="2" data-name="start"/>;
                case 3:
                    return <a-box key={mapArray[x][z]} height={0.1} width={0.9} depth={0.9} position={blockPosition} material="color: #0e7ef6" option="3" data-name="finish"/>;
                default:
                    return <a-box key={mapArray[x][z]} height={5} position={blockPosition} material="color: #333333"/>;
            }
        })
    });

    useEffect(() => {
        props.changeSetting('vrView', true);
        props.changeSetting('generateGrid', false);
        props.changeSetting('timeVisible', true);
        props.changeSetting('actualPlayerPosition', positionPlayer);
    });

    return (
        <a-scene id="render-labyrinth">
            <a-entity light="type: spot; color: #ffffff; intensity: 3; decay: 1.6; distance: 24.5" position="0 7.5 -13" />
            <a-entity light="type: spot; color: #ffffff; intensity: 5; decay: 1.6; distance: 24.5" position="0 20 -13" />
            <Player actualPlayerPosition={actualPosition}/>
            {render3DBlocks}
        </a-scene>
    )
}

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