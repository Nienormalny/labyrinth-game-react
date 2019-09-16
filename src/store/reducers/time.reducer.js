import * as _ from 'lodash';
import * as actionTypes from '../actions';

const initialTimeState = {
    time: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        owner: {
            id: '',
            name: '',
            date: ''
        },
        timeString: ''
    }
}

const timeReducer = (state = initialTimeState, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_TIME:
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
}

export default timeReducer;