import React from 'react';
import * as _ from 'lodash';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';
import {getRandomId} from '../../common/widgets';

function StartGame(props) {
    const {defaultSettings, changeSetting} = props;
    const {labyrinthArray, loadMap, finalMapArray, mapArray, time} = defaultSettings;
    const renderFinalMapArray = [];
    const saveFinalMap = () => {
        /* Create final array to save - will be used to generate 3D blocks:
            finalArray = [0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 2, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]
            0 - define wall
            1 - define path
            2 - define start
            3 - define finish
        */
        _.mapKeys(labyrinthArray, (labyrinth, key) => {
            renderFinalMapArray.push(labyrinthArray[key].option);
        });
        changeSetting('finalMapArray', renderFinalMapArray);
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
        loadMap.push({
            id: getRandomId(),
            creator: {
                id: getRandomId(),
                name: document.getElementById('creator-name').value,
                date: new Date().getDateString()
            },
            final: finalMapArray.reverse(),
            map: mapArray.reverse(),
            time
        });
        defaultSettings.finishSelected && defaultSettings.startSelected && props.changeSetting('canRenderVr', true)
    };

    return (
        <button onClick={saveFinalMap}>START GAME</button>
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

export default connect(mapStateToProps, mapDispatchToProps)(StartGame);