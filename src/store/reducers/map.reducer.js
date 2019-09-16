import * as actionTypes from '../actions';
import * as _ from 'lodash';

const initialMapState = {
    maps: []
}
const mapReducer = (state = initialMapState, action) =>  {
    switch (action.type) {
        case actionTypes.ADD_NEW_MAP:
            return {
                ...state,
                maps: state.maps.concat(action.map)
            };
        case actionTypes.UPDATE_TIME:
            const updateMap = _.map(state.maps, map => {
                if (map && map.id === action.map.id) {
                    map.time = action.time;
                    return map;
                }
            });
            return {
                ...state,
                maps: updateMap
            };
        default:
            return state;
    }
};

export default mapReducer;