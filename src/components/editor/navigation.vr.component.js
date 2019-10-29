import React from 'react';
import 'aframe';
import 'aframe-react';
import {Entity} from 'aframe-react';

function NavigationVr({editorSettings}) {
    return (
        <a-entity id="navigation" position="-1 -0.5 0" rotation="0 90 0">
            <Entity primitive="a-text" id="vr-info" value="Chose your labyrinth grid" align="center" scale="0.4 0.4 1" position="0 2.7 -1.4" geometry="primitive: plane; width: 3; height: 0.5" material="color: #0e7ef6;" />
            {/*<Entity primitive="a-text" value="Hello Friend, just turn around." align="center" scale="0.4 0.4 1" rotation="0 -180 0" position="0 2.7 3.5" geometry="primitive: plane; width: 5; height: 0.5" material="color: #0e7ef6;" />*/}
            <Entity primitive="a-text" className="get-grid-value clickable" value="10x10" events={{click: () => editorSettings({selectedGrid: 10})}} align="center" geometry="primitive: plane;" scale="0.21 0.21 1" position="-0.3 2.3 -1.14" />
            <Entity primitive="a-text" className="get-grid-value clickable" value="15x15" events={{click: () => editorSettings({selectedGrid: 15})}} align="center" geometry="primitive: plane" scale="0.21 0.21 1" position="0 2.3 -1.14" />
            <Entity primitive="a-text" className="get-grid-value clickable" value="20x20" events={{click: () => editorSettings({selectedGrid: 20})}} align="center" geometry="primitive: plane" scale="0.21 0.21 1" position="0.3 2.3 -1.14" />
        </a-entity>
    )
}

export default NavigationVr;