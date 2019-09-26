import * as actionTypes from '../actions';

const initialDefaultSettings = {
    activePathArray: [],
    actualPlayerPosition: {x: 0, y: 1, z: 0},
    actualMapId: '',
    // applyLabyrinth: '',
    availablePathsArray: [],
    cols: [10, 15, 20, 30],
    countClick: 0,
    countSelectedBlocks: 0,
    cursorVisibility: true,
    canRenderVr: false,
    disableIfSelected: [],
    finalMapArray: [],
    // finishConverting: false,
    finish: false,
    finishSelected: false,
    finishCanBeSelected: false,
    generateGrid: false,
    // hours: 0,
    hover: false,
    labyrinthArray: [],
    // lastChange: 0,
    lastClicked: '',
    // loadedMapIndex: '',
    // loadedMapObj: {},
    loadMap: JSON.parse(localStorage.getItem('maps')) ? JSON.parse(localStorage.getItem('maps')) : [],
    mapArray: [],
    movementCount: 0,
    // maps: [],
    // minutes: 0,
    // moveCounter: 0,
    // newArr: [],
    // newCreatedMap: '',
    // newCreatedMapIndex: '',
    // ownerSaved: false,
    pathArray: [],
    pathElement: [],
    placeWidth: 0,
    // pathSelected: false,
    renderFinish: false,
    renderVrCreator: false,
    selectedCol: 0,
    sumOfPaths: 0,
    // seconds: 0,
    startSelected: false,
    time: {},
    timeVisible: false,
    timeStringValue: '00:00:00',
    // timer: '',
    vrView: false,
    validCreatorName: false,
    validPathCreated: false,
    validPathOptions: [],
    // validGridOptions: [],
    // validPaths: []
};

const defaultSettingsReducer = (state = initialDefaultSettings, action) => {
    switch (action.type) {
        case actionTypes.SET_TO_DEFAULT:
            return initialDefaultSettings;
        case actionTypes.CHANGE_DEFAULT_SETTING:
            const settingKey = action.setting;
            return {
                ...state,
                [settingKey]: action.value
            };
        default:
            return state;
    }
};

export default defaultSettingsReducer;