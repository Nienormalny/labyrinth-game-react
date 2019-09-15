import React                from 'react';
import ReactDOM             from 'react-dom';
import App                  from './App';
import * as serviceWorker   from './serviceWorker';
import {Provider}           from 'react-redux';
import rootReducer          from './store/reducer';
import {createStore}        from 'redux';
import {getRandomId, getTimeString} from './common/widgets';

const store = createStore(rootReducer);
console.log(store.getState());
const map = {
    id: getRandomId(),
    creator: {
        id: getRandomId(),
        name: 'Dawid',
        date: new Date().getDateString()
    },
    map: [
        [30, 31, 32, 33, 34, 35],
        [24, 25, 26, 27, 28, 29],
        [18, 19, 20, 21, 22, 23],
        [12, 13, 14, 15, 16, 17],
        [6, 7, 8, 9, 10, 11],
        [0, 1, 2, 3, 4, 5]
    ],
    final: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 3, 1, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    time: {
        seconds: 25,
        minutes: 0,
        hours: 0,
        owner: {
            id: getRandomId(),
            name: 'Test 2',
            date: new Date().getDateString()
        },
        timeString: getTimeString(25, 0, 0)
    }
};
store.dispatch({type: 'ADD_NEW_MAP', map});
console.log('NEW MAP', store.getState());

store.dispatch({type: 'UPDATE_TIME', map, time: map.time});
console.log(store.getState());


const LabyrinthApp = <Provider store={store}><App /></Provider>;

ReactDOM.render(LabyrinthApp, document.getElementById('labyrinth-app'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
