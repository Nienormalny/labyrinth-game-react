import * as actionTypes from '../actions';
import * as _ from 'lodash';

const initialDefaultSettings = {
    countClick: 0,
    timer: '',
    time: {},
    hours: 0,
    minutes: 0,
    seconds: 0,
    moveCounter: 0,
    lastChange: 0,
    renderFinish: false,
    startSelected: false,
    pathSelected: false,
    finishConverting: false,
    ownerSaved: false,
    hover: false,
    vrView: false,
    finishSet: false,
    finishSelected: false,
    pathArray: [],
    availablePathsArray: [],
    activePathArray: [],
    labyrinthArray: [],
    disableIfSelected: [],
    validPathOptions: [],
    validGridOptions: [],
    validPaths: [],
    countSelectedBlocks: 0,
    pathCountClick: 0,
    finalArray: [],
    newArr: [],
    mapArray: [],
    lastClicked: '',
    applyLabyrinth: '',
    newCreatedMap: '',
    newCreatedMapIndex: '',
    maps: [],
    loadedMapObj: {},
    loadedMapIndex: '',
    loadMap: JSON.parse(localStorage.getItem('maps')) ? JSON.parse(localStorage.getItem('maps')) : []
};

const defaultSettingsReducer = (state = initialDefaultSettings, action) => {
    switch (action.type) {
        case actionTypes.SET_TO_DEFAULT:
            return initialDefaultSettings;
        case actionTypes.CHANGE_DEFAULT_SETTING:
            const settingKey = action.setting;
            // const settingValue = _.get(action, {settingKey});
            // console.log('CHANGE', settingValue, action);
            return {
                ...state,
                [settingKey]: action.value
            };
        default:
            return state;
    }
};

export default defaultSettingsReducer;