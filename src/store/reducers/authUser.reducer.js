import * as actionTypes from '../actions';
import {getRandomId} from "../../common/widgets";

const initialUser = {
    id: '',
    email: '',
    name: '',
    registration: '',
    maps: []
};

const authUserReducer = (state = initialUser, action) => {
    switch (action.type) {
        case actionTypes.CREATE_USER:
            return;
        case actionTypes.UPDATE_USER:
            console.log(action);
            return {
                ...state,
                id: getRandomId(),
                email: action.email,
                name: action.name,
            };
        case actionTypes.DELETE_USER:
            return state;
        default:
            return state;
    }
};

export default authUserReducer;