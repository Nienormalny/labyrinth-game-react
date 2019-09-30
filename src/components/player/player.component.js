import React                    from 'react';
import 'aframe';
import {Entity}                 from 'aframe-react';
import * as actionTypes         from '../../store/actions';
import {connect}                from 'react-redux';

function Player(props) {
    let defaultSettings = props.defaultSettings;
    let playerPosition = defaultSettings.actualPlayerPosition;

    return (
        <Entity id="player" look-controls>
            <Entity position={playerPosition} light={{type: 'point', color: '#ffffff', intensity: 2, decay: 2, distance: 5,}} />
            <Entity laser-controls raycaster="far: 35" />
            <Entity id="control" primitive="a-camera" position={playerPosition} wasd-controls={{enabled: false}}>
                {defaultSettings.cursorVisibility && <Entity cursor={{fuse: true, fuseTimeout: 300}} animation__click={{property: 'scale', startEvents: 'click', from: '0.5 0.5 0.5', to: '0.3 0.3 0.3', dur: 300}}><Entity primitive="a-cursor" scale="0.5 0.5 0.5" position={{x: 0, y: 0, z: '-1'}} material={{color: 'white'}}/></Entity>}
                <Entity  position={{x: 0, y: 0.1, z: '-0.4'}}>
                    <Entity id="timer" primitive="a-text" value={defaultSettings.timeStringValue} align="center" height="0.3" width="0.3" visible={defaultSettings.timeVisible} />
                </Entity>
            </Entity>
        </Entity>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Player);