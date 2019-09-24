import React, {useEffect} from 'react';
import 'aframe';
import {Entity} from 'aframe-react';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';

function Player(props) {
    let defaultSettings = props.defaultSettings;
    let playerPosition = defaultSettings.actualPlayerPosition;
    
    return (
        <Entity id="player" look-controls>
            <Entity position={playerPosition} light={{type: 'point', color: '#ffffff', intensity: 2, decay: 2, distance: 5,}} />
            <Entity laser-controls raycaster="far: 35" />
            <Entity id="control" primitive="a-camera" position={playerPosition} wasd-controls={{enabled: false}}>
                <Entity primitive="a-cursor" position={{x: 0, y: 0, z: '-0.4'}} material={{color: 'white'}} scale="0.2 0.2 0.2" animation__click={{property: 'scale', startEvents: 'click', from: '0.2 0.2 0.2', to: '0.1 0.1 0.1', dur: 800}}/>
                <Entity  position={{x: 0, y: 0.1, z: '-0.4'}}>
                    <Entity id="timer" primitive="a-text" value="00:00:00" align="center" height="0.3" width="0.3" visible={defaultSettings.timeVisible} />
                </Entity>
            </Entity>
        </Entity>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Player);