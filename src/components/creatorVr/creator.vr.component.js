import React, {useState} from 'react';
import * as _ from 'lodash';
import 'aframe';
import {Entity} from 'aframe-react';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';
import {getRandomId} from '../../common/widgets';
import EditorVr from '../editor/editor.vr.component';
import NavigationVr from '../editor/navigation.vr.component';

function CreatorVr(props) {
    const {cursorVisibility, time} = props.defaultSettings;
    const [selectedGrid, setGridNumber] = useState(0);
    const [isGridSelected, setIsGridSelected] = useState(false);
    // const [finalMap, setFinalMap] = useState({}); // JSON.parse(localStorage.getItem('maps')) ? JSON.parse(localStorage.getItem('maps')) : []
    const [mapSettings, setMapSettings] = useState({});
    const [planePosition, setPlanePosition] = useState('');


    const toggleCursorVisibility = () => {
        props.changeSetting('cursorVisibility', !cursorVisibility);
    };

    const editorSettings = (value) => {
        setIsGridSelected(true);
        setGridNumber(value);
    };

    const saveMap = (mapSet) => {
        const renderFinalMapArray = [];
        const actualMapId = getRandomId();
        /* Create final array to save - will be used to generate 3D blocks:
            finalArray = [0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 2, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
            0 - define wall
            1 - define path
            2 - define start
            3 - define finish
        */
        _.mapKeys(mapSet.renderLabyrinthArray, (labyrinth, key) => {
            renderFinalMapArray.push(mapSet.renderLabyrinthArray[key].option);
        });
        /* loadMap is an Array, that will be saved in localstorage, with all data like:
            - person that created map
            - finalArray to render correct places (wall, start, path, finish)
            - mapArray (3x3 example): [
                [0, 1, 2, 3, 4],
                [5, 6, 7, 8, 9],
                [10, 11, 12, 13, 14],
                [15, 16, 17, 18, 19],
                [20, 21, 22, 23, 24]
            ]
            - best time (owner, time, date)
        */
        props.saveFinalMap({
            id: actualMapId,
            creator: {
                id: getRandomId(),
                name: document.getElementById('creator-name') ? document.getElementById('creator-name').value : 'Created in VR',
                date: new Date().getDateString()
            },
            final: renderFinalMapArray.reverse(),
            map: mapSet.currentMapArray.reverse(),
            time
        });
    };

    return (
        <Entity id="creator">
            <Entity id="scene-light" light={{type: 'spot', color: '#ffffff', decay: 1, angle: 35, penumbra: 1, intensity: 1.25}} position={{x: 0, y: planePosition.z / 2, z: planePosition.z / 10}}/>
            <NavigationVr editorSettings={(value) => editorSettings(value.selectedGrid)} />
            <a-text geometry="primitive: plane; width: 7" material="color: white; depthWrite: false;" color="#333333" value="If you will click green path second time, it will set finish point." align="center" scale="3 3 1" position="0 24 -26" rotation="35 0 0" />
            <a-text id="error-info-vr" visible="false" geometry="primitive: plane; width: 6; height: 0.5" material="color: #ff2c2c; depthTest: false;" color="white" value="Please set FINISH point" align="center" scale="4 4 1" position="0 28 -25.5" rotation="35 0 0" />
            {isGridSelected && <EditorVr selectedGrid={selectedGrid} mapSettings={(currentMapArray, renderLabyrinthArray) => setMapSettings({currentMapArray, renderLabyrinthArray})} planePosition={(p) => setPlanePosition(p)}/>}
            <Entity primitive="a-text" id="toggle-cursor" value="Click to turn off circle at the center" align="center" geometry="primitive: plane; width: 4" events={{click: () => toggleCursorVisibility() }} material="color: #fd2929" scale="0.3 0.3 1" position="1 0.5 -2" rotation="-45 -10 0" />
            <Entity primitive="a-text" id="start-game" value="START GAME" align="center" geometry="primitive: plane;  width: 3" material="color: #05a349" scale="0.3 0.3 1" events={{click: () => saveMap(mapSettings)}} position="-1 0.5 -2" rotation="-45 10 0" />
        </Entity>
    );
}

const mapStateToProps = state => {
    return {
        defaultSettings: state.defaultSettings,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeSetting: (setting, value) => dispatch({type: actionTypes.CHANGE_DEFAULT_SETTING, setting, value})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatorVr);