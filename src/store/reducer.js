import { combineReducers }      from 'redux';
import mapReducer               from './reducers/map.reducer';
import defaultSettingsReducer   from './reducers/defaultSettings.reducer';
import authUserReducer from "./reducers/authUser.reducer";

const rootReducer = combineReducers({
    mapState: mapReducer,
    defaultSettings: defaultSettingsReducer,
    authUser: authUserReducer
});

export default rootReducer;