import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDzofJ59ejALVsyAWvQGIZu0lBviDdYuN8",
    authDomain: "labyrinth-game.firebaseapp.com",
    databaseURL: "https://labyrinth-game.firebaseio.com",
    projectId: "labyrinth-game",
    storageBucket: "labyrinth-game.appspot.com",
    messagingSenderId: "732211058094",
    appId: "1:732211058094:web:91c7d8a4854ea7852c243f"
};

firebase.initializeApp(config);
const database = firebase.database();

database.ref().set({
    name: "Dawud Nienormalny"
});