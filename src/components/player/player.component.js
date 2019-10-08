import React                    from 'react';
import 'aframe';
import * as actionTypes         from '../../store/actions';
import {connect}                from 'react-redux';

function Player(props) {
    let defaultSettings = props.defaultSettings;
    let playerPosition = props.actualPlayerPosition ? props.actualPlayerPosition : defaultSettings.actualPlayerPosition;

    return (
        <a-entity id="player" look-controls>
            <a-entity position={playerPosition} light="type: point; color: #ffffff; intensity: 2; decay: 2; distance: 5" />
            <a-entity laser-controls raycaster="far: 35"/>
            <a-entity id="control" primitive="a-camera" position={playerPosition} wasd-controls={false}>
                {defaultSettings.cursorVisibility && <a-entity cursor="fuse: true; fuseTimeout: 300"><a-entity primitive="a-cursor" scale="0.5 0.5 0.5" position="0 0 -1" material="color: white"/></a-entity>}
                <a-entity  position="0 0.1 -0.4">
                    <a-entity id="timer" primitive="a-text" value={defaultSettings.timeStringValue} align="center" height="0.3" width="0.3" visible={defaultSettings.timeVisible} />
                </a-entity>
            </a-entity>
        </a-entity>
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