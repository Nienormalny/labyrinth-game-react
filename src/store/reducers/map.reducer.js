import * as actionTypes from '../actions';
const initialMapState = {
    id: '',
    creator: {
        id: '',
        name: '',
        date: ''
    },
    map: [],
    final: [],
}
const mapReducer = (state = initialMapState, action) =>  {
    switch (action.type) {
        case actionTypes.ADD_NEW_MAP:
            return {
                ...state,
                maps: state.maps.concat(action.map)
            };
        default:
            return state;
    }
}

export default mapReducer;