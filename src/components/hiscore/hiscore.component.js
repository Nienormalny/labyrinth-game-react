import React from 'react';

export default function HiScore() {
    return (
        <div id="hiscore-owner" className="hidden">
            <h1> Congratulations!</h1>
            <label for="owner-name">Your Name</label>
            <input id="owner-name" name="owner-name" placeholder="Write your name"/>
            <button id="save-owner">Accept</button>
        </div>
    );
}