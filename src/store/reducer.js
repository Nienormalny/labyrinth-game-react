import { combineReducers } from 'C:/Users/dawid/AppData/Local/Microsoft/TypeScript/3.6/node_modules/redux';
import timeReducer from './reducers/time.reducer';
import mapReducer from './reducers/map.reducer';

// const initialState = {
//     maps: []
// };

const rootReducer = combineReducers({
    mapState: mapReducer,
    timeState: timeReducer
});

export default rootReducer;