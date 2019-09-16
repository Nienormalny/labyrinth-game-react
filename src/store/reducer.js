import { combineReducers }      from 'C:/Users/dawid/AppData/Local/Microsoft/TypeScript/3.6/node_modules/redux';
import mapReducer               from './reducers/map.reducer';
import defaultSettingsReducer   from './reducers/defaultSettings.reducer';

const rootReducer = combineReducers({
    mapState: mapReducer,
    defaultSettings: defaultSettingsReducer
});

export default rootReducer;