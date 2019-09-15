import * as _ from 'lodash';

const initialState = {
    maps: []
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_NEW_MAP':
            return {
                ...state,
                maps: state.maps.concat(action.map)
            };
        case 'UPDATE_TIME':
            const updateMap = _.map(_.filter(state, e => e.id), map => {
               if (map && map.id === action.map.id) {
                   return {time: action.time}
               }
            });
            if (!_.isEmpty(updateMap)) {
                return Object.assign({}, state, {
                    [action.map]: updateMap
                });
            }
            return state;
        default:
            return state;
    }
};

export default rootReducer;