import { combineReducers }      from 'redux';
import mapReducer               from './reducers/map.reducer';
import defaultSettingsReducer   from './reducers/defaultSettings.reducer';

const rootReducer = combineReducers({
    mapState: mapReducer,
    defaultSettings: defaultSettingsReducer
});

export default rootReducer;