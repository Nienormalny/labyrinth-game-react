import React, {useEffect, useState} from 'react';
import * as _ from 'lodash';
import 'aframe';
import buttonObj from '../../assets/lab-button-3.obj';
import addMapObj from '../../assets/add-map.obj';
import loadMapObj from '../../assets/load-map.obj';
import backButtonObj from '../../assets/back-button.obj';

function Menu({changeScene, activeScene, isGridSelected}) {
    const [sceneMenu, setSceneMenu] = useState([]);
    const [isHome, setIsHome] = useState(true);

    const navigation = {
        home: {
            color: '#ff313b',
            object: backButtonObj
        },
        creatorVr: {
            color: '#27c45c',
            object: addMapObj
        },
        loadMap: {
            color: '#ed9339',
            object: loadMapObj
        }
    };
    useEffect(() => {
        console.log('ACTIVE SCENE', activeScene);
        switch (activeScene) {
            case 'creatorVr':
                setSceneMenu(['home']);
                setIsHome(false);
                break;
            default:
                setSceneMenu(['creatorVr', 'loadMap']);
                setIsHome(true);
                return;
        }
    }, [activeScene]);
    return (
        <a-entity position={`-${(sceneMenu.length * 0.25) / 2} 0 0`}>
            {_.map(sceneMenu, (scene, key) => {
                console.log('SCENE MENU', scene, key);
                // animation={isHome ? `property: rotation; from: 0 0 0; to: 0 -90 0; easing: easeInOutCubic; dur: 3500` : `property: rotation; from: 0 -90 0; to: 0 0 0; easing: easeInOutCubic; dur: 3500`}
                return (
                    <a-entity key={key}>
                        <a-entity light={`type: point; color: ${navigation[scene].color}; distance: 2; intensity: 5;`} position={`${(key * (sceneMenu.length * 0.5) / 2)} 0.5 -1.2`}/>
                        <a-obj-model
                            src={buttonObj}
                            position={`${(key *(sceneMenu.length * 0.5) / 2)} 1 -1`}
                            scale="0.1 0.1 0.1"
                            rotation="0 20 0"
                            material={`color: ${navigation[scene].color}; emissive: ${navigation[scene].color}; emissiveIntensity: 1`}
                            animation="property: rotation; from: 0 -20 0; to: 0 -380 0; easing: linear; dur: 10000; loop: true;"
                        />
                        {/*animation__rotation="property: rotation; from: 0 -2 0; to: 0 340 0; easing: linear; dur: 10000; loop: true;"*/}
                        <a-obj-model
                            src={navigation[scene].object}
                            position={`${(key * (sceneMenu.length * 0.5) / 2)} 1 -1`}
                            rotation="0 20 0"
                            animation="property: scale; from: 0.03 0.03 0.03; to: 0.04 0.04 0.04; easing: easeInOutQuad; dur: 1500; loop: true; dir: alternate"
                            animation__rotation="property: rotation; from: 0 -20 0; to: 0 340 0; easing: linear; dur: 10000; loop: true;"
                            onClick={() => changeScene(scene)}
                            material={`color: ${navigation[scene].color}; emissive: ${navigation[scene].color}; emissiveIntensity: 0.4`}
                        />
                    </a-entity>
                )
            })}
        </a-entity>
    )
}
export default Menu;