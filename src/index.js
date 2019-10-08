import React                from 'react';
import ReactDOM             from 'react-dom';
import App                  from './App';
import * as serviceWorker   from './serviceWorker';
import {Provider}           from 'react-redux';
import rootReducer          from './store/reducer';
import {createStore}        from 'redux';

export const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const LabyrinthApp = <Provider store={store}><App /></Provider>;

// NON-PASSIVE TO PASSIVE
(function () {
    if (typeof EventTarget !== "undefined") {
        let func = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function (type, fn, capture) {
            this.func = func;
            if(typeof capture !== "boolean"){
                capture = capture || {};
                capture.passive = false;
            }
            this.func(type, fn, capture);
        };
    }
}());

ReactDOM.render(LabyrinthApp, document.getElementById('labyrinth-app'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
