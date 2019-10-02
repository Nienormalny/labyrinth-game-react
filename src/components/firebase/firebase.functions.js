import firebase from 'firebase';
import moment from 'moment';
import * as actionTypes from '../../store/actions';

export function fetchUserById(userId) {
    return firebase.database().ref('users/' + userId);
}
export function createUser(userId, email, name) {
    return firebase.database().ref('users/' + userId).set({
        id: userId,
        name,
        email,
        createdAt: new Date().getDateString() + ' ' + moment().format('HH:MM:SS')
    });
}
