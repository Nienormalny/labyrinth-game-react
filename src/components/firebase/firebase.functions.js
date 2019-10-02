import firebase from 'firebase';
import * as actionTypes from "../../store/actions";
import * as _ from 'lodash';
import moment from 'moment';

export function fetchUsers(changeSetting) {
    const usersRef = firebase.database().ref('users');
    let users = [];
    usersRef.on('value', (snapshot) => {
        const usersData = snapshot.val();

        for (let user in usersData) {
            users.push(usersData[user]);
        }
    });

    changeSetting('usersArray', users);
}
export function updateUserOnlineStatus(userId, online) {
    const userRef = firebase.database().ref('users/' + userId);
    let userData = '';
    console.log('online', online);
    userRef.on('value', (snapshot) => {
        userData = snapshot.val();
    });

    userRef.set({
        ...userData,
        online
    }).then((res) => {
        console.log(res);
    });
}
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
