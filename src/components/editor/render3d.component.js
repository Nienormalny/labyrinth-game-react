import React from 'react';
import * as _ from 'lodash';
import 'aframe';
import {Entity} from 'aframe-react';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';
import Player from '../player/player.component';

function Render3D(props) {
    const {mapArray, finalMapArray} = props.defaultSettings;
    let positionPlayer = {x: 0, y: 0.5, z: 0} /* (THIS IS INITIAL VALUE) */;
    let render3DBlocks = _.map(mapArray, (n, x) => {
        return _.map(mapArray, (a, z) => {
            switch (finalMapArray[mapArray[x][z]]) {
                case 0:
                    return <Entity key={mapArray[x][z]} geometry={{primitive: 'box', height: 5}} position={{x, y: 0.5, z}} material={{color: '#333333'}} option="0" data-name="wall"/>;
                case 1:
                    return <Entity key={mapArray[x][z]} geometry={{primitive: 'box', height: 0.1, width: 0.9, depth: 0.9}} position={{x, y: 0.5, z}} material={{color: '#1ace65'}} option="1" data-name="path"/>;
                case 2:
                    positionPlayer = {x, y: 0.5, z};
                    return <Entity key={mapArray[x][z]} geometry={{primitive: 'box', height: 0.1, width: 0.9, depth: 0.9}} position={{x, y: 0.5, z}} material={{color: '#ff2c2c'}} option="2" data-name="start"/>;
                case 3:
                    return <Entity key={mapArray[x][z]} geometry={{primitive: 'box', height: 0.1, width: 0.9, depth: 0.9}} position={{x, y: 0.5, z}} material={{color: '#0e7ef6'}} option="3" data-name="finish"/>;
                default:
                    return <Entity key={mapArray[x][z]} geometry={{primitive: 'box', height: 5}} position={{x, y: 0.5, z}} material={{color: '#333333'}}/>;
            }
        })
    });

    return (
        <a-scene>
            <Entity light={{type: 'spot', color: '#ffffff', intensity: 3, decay: 1.6, distance: 24.5}} position={{x: 0, y: 7.5, z: -13}} />
            <Entity light={{type: 'spot', color: '#ffffff', intensity: 5, decay: 1.6, distance: 24.5}} position={{x: 0, y: 20, z: -13}} />
            <Player setPosition={positionPlayer}/>
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