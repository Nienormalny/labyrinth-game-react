import React, {useEffect, useState, useRef} from 'react';
import * as _ from 'lodash';
import 'aframe';
import {Scene, Entity} from 'aframe-react';
import Player from '../player/player.component';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';
import {createArray, saveFinalMap, selectRenderedPath} from '../../common/render.functions';

function VrScene(props) {
    const prevPropsDefaultSettings = useRef();
    useEffect(() => {
        prevPropsDefaultSettings.current = props.defaultSettings;
    });

    const {renderVrCreator, generateGrid, pathArray, cursorVisibility} = props.defaultSettings;
    const pathElement = [];
    const [pathElements, setPathElements] = useState([]);
    const [pathSummary, setPathSummary] = useState(0);
    const [generateGridState, setGenerateGridStates] = useState(false);

    useEffect(() => {
        if (!_.isEqual(!_.isUndefined(prevPropsDefaultSettings) && prevPropsDefaultSettings.pathArray, pathArray)) {
            if (generateGridState) {
                for (let pathNumber = 0; pathNumber < pathSummary; pathNumber++) {
                    pathElement.push(<Entity primitive="a-plane" shadow={{receive: true, castShadow: false}} class="grid-path clickable" data-path-index={pathNumber} key={pathNumber} events={{click: event => selectRenderedPath(pathNumber, event, true, props.changeSetting)}} selectelement/>);
                }
                setPathElements(pathElement);
            }
            if (generateGrid) {
                createArray(props);
            }
        }
    }, [generateGrid, generateGridState, pathArray]);

    const toggleCursorVisibility = () => {
        props.changeSetting('cursorVisibility', !cursorVisibility);
    };

    const show3DEditor = (value) => {
        const roundWalls = value + 2;
        const sumOfPaths = roundWalls * roundWalls;
        const renderPathArray = [];

        for (let pathNumber = 0; pathNumber < sumOfPaths; pathNumber++) {
            renderPathArray.push(pathNumber);
        }

        setGenerateGridStates(true);
        setPathSummary(sumOfPaths);
        props.changeSetting('generateGrid', !props.defaultSettings.generateGrid);
        props.changeSetting('selectedCol', value);
        props.changeSetting('roundWalls', roundWalls);
        props.changeSetting('sumOfPaths', sumOfPaths);
        props.changeSetting('placeWidth', roundWalls * (25 + 2));
        props.changeSetting('pathArray', renderPathArray);
    };

    return (
        <Scene  id="labyrinth-scene" background={{color: 'black'}} wasd-controls={false}>
            <Player/>
            {renderVrCreator && <Entity id="render-vr">
                <Entity light={{type: 'spot', color: '#ffffff', intensity: 3, decay: 1.6, distance: 24.5, castShadow: true}} position={{x: 0, y: 7.5, z: -13}} />
                <Entity light={{type: 'spot', color: '#ffffff', intensity: 5, decay: 1.6, distance: 24.5, castShadow: true}} position={{x: 0, y: 20, z: -13}} />
                <a-plane rotation={{x: -90, y: 0, z: 0}} color="#fd2929" scale={{x: 10, y: 10, z: 0}} />
                {!generateGridState && <Entity position="0 0 -1" >
                    <Entity primitive="a-text" id="vr-info" value="Chose your labyrinth grid" align="center" scale="0.4 0.4 1" position="0 2.7 -1.4" geometry="primitive: plane; width: 3; height: 0.5" material="color: #0e7ef6;" />
                    <Entity primitive="a-text" value="Hello Friend, just turn around." align="center" scale="0.4 0.4 1" rotation="0 -180 0" position="0 2.7 3.5" geometry="primitive: plane; width: 5; height: 0.5" material="color: #0e7ef6;" />
                    <Entity primitive="a-text" className="get-grid-value clickable" value="10x10" events={{click: () => show3DEditor(10)}} align="center" geometry="primitive: plane;" material="color: #fd2929" scale="0.21 0.21 1" position="-0.3 2.3 -1.14" />
                    <Entity primitive="a-text" className="get-grid-value clickable" value="15x15" events={{click: () => show3DEditor(15)}} align="center" geometry="primitive: plane" material="color: #fd2929" scale="0.21 0.21 1" position="0 2.3 -1.14" />
                    <Entity primitive="a-text" className="get-grid-value clickable" value="20x20" events={{click: () => show3DEditor(20)}} align="center" geometry="primitive: plane" material="color: #fd2929" scale="0.21 0.21 1" position="0.3 2.3 -1.14" />
                </Entity>}
                <a-text geometry="primitive: plane; width: 7" material="color: white; depthWrite: false;" color="#333333" value="If you will click green path second time, it will set finish point." align="center" scale="3 3 1" position="0 24 -26" rotation="35 0 0" />
                <a-text id="error-info-vr" visible="false" geometry="primitive: plane; width: 6; height: 0.5" material="color: #ff2c2c; depthTest: false;" color="white" value="Please set FINISH point" align="center" scale="4 4 1" position="0 28 -25.5" rotation="35 0 0" />
                <Entity id="render-grid" rotation="0 0 0">
                    {!_.isEmpty(pathElements) && pathElements}
                </Entity>
                <Entity primitive="a-text" id="toggle-cursor" value="Click to turn off circle at the center" align="center" geometry="primitive: plane; width: 4" events={{click: () => toggleCursorVisibility() }} material="color: #fd2929" scale="0.3 0.3 1" position="1 0.5 -2" rotation="-45 -10 0" />
                <Entity primitive="a-text" id="start-game" value="START GAME" align="center" geometry="primitive: plane;  width: 3" material="color: #05a349" scale="0.3 0.3 1" events={{click: () => saveFinalMap(props.changeSetting)}} position="-1 0.5 -2" rotation="-45 10 0" />
                <a-box geometry="primitive: cylinder" color="#ddd" scale="1 1 1" />
            </Entity>}
        </Scene>
    );
};

const mapStateToProps = state => {
    return {
        defaultSettings: state.defaultSettings,
        // selectRenderedPaths: (selectedPathIndex, event, wasClicked, props) => selectRenderedPath(selectedPathIndex, event, wasClicked, props)
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeSetting: (setting, value) => dispatch({type: actionTypes.CHANGE_DEFAULT_SETTING, setting, value})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(VrScene);