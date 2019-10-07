import React from 'react';
import { closeAllModals } from "../../common/modal";

const HelpModal = () => {
    return (
        <div id="help-modal" className={"hidden modal dimmer"}>
            <button className="button close-btn" onClick={closeAllModals}></button>
            <div className="modal-content">
                <h2>How to play</h2>
                <ul className="help-info-list">
                    <li>1. Define the number of columns and type in your name.</li>
                    <li>
                        <p>2. Create your own labyrinth with click or in vr look control</p>
                        <ul className="help-sub-menu">
                            <li className="text"><b>Legend:</b></li>
                            <li className="wall" data-color="#333"> - walls</li>
                            <li className="start"> - define start on first click</li>
                            <li className="paths"> - define path</li>
                            <li className="finish"> - last click defines finish</li>
                            <li className="option"> - choosable option</li>
                            <li className="default"> - option to chose</li>
                        </ul>
                    </li>
                    <li>3. Start the game and enjoy your way!</li>
                </ul>
            </div>
        </div>
    );
};

export default HelpModal;