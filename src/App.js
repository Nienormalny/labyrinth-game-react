import React, { useState}       from 'react';
import {connect}                from 'react-redux';
import * as actionTypes         from './store/actions';
import 'aframe';
import Player from './components/player/player.component';
import CreatorVr from './components/creatorVr/creator.vr.component';
import Menu from './components/menu/menu.component';
import scenery from './assets/lab-main-menu-scenery.obj';
import sceneryMtl from './assets/lab-main-menu-scenery.mtl';
import buttonObj from './assets/lab-button-3.obj';
import './firebase/firebase';
import './styles/style.scss';
import Render3D from './components/editor/render3d.component';

function App(props) {
    const [creatorVr, setCreatorVr]= useState(false);
    const [mapIsDone, setMapToDone]= useState(false);
    const [activeScene, setActiveScene]= useState('home');
    const [finalMap, setFinalMap]= useState({});
    const [position, setPlayerPosition]= useState(undefined);
    const [timeValue, setTimeValue]= useState('00:00:00');

    /*useEffect(() => {
        // console.log('DEFAULT SETTINGS', props.defaultSettings)
    }, []);*/

    const changeScene = (selectedMenu) => {
        switch (selectedMenu) {
            case 'creatorVr':
                setCreatorVr(true);
                setActiveScene(selectedMenu);
                break;
            default:
                setCreatorVr(false);
                setActiveScene('home');
                break;
        }
    };

    const saveFinalMap = (finalMap) => {
        setFinalMap(finalMap);
        console.log('SAVE FINAL MAP', finalMap);
        setMapToDone(true);
        setCreatorVr(false);
    };

    const getPlayerPosition = (position) => {
      console.log('GET PLAYER POSITION', position);
      setPlayerPosition(position)
    };

    return (
        <a-scene>
            <a-assets>
                <a-asset-item id="gr-obj" src={scenery}/>
                <a-asset-item id="button-obj" src={buttonObj}/>
            </a-assets>
            <Player lightOff={!mapIsDone} positionPlayer={position} cursorVisibility={true} timeVisible={mapIsDone} timeStringValue={timeValue}/>
            <Menu activeScene={activeScene} changeScene={(selectedScene) => changeScene(selectedScene)} />
            {/*<a-entity laser-controls="hand: right" raycaster="objects: .clickable; far: 30"/>*/}
            <a-entity light="type: point; distance: 10; decay: 5; intensity: 5; castShadow: true" position="0 3 0"/>
            {creatorVr && !mapIsDone && <CreatorVr saveFinalMap={(finalMap) => saveFinalMap(finalMap)}/>}
            {mapIsDone && !creatorVr && <Render3D finalMap={finalMap} changePlayerPosition={(p) => getPlayerPosition(p)} timeValue={(time) => setTimeValue(time)}/>}

            {!mapIsDone && <a-obj-model id="main-menu-scenery" src="#gr-obj" mtl={sceneryMtl} scale={"5 5 5"}  material="color: #333" position="0 0 -2.5"/>}
            <a-sky color="black"/>
        </a-scene>
    )
}

const mapStateToProps = state => {
  return {
      mapsState: state.mapState,
      defaultSettings: state.defaultSettings
  }
};

const mapDispatchToProps = dispatch => {
  return {
      changeSetting: (setting, value) => dispatch({type: actionTypes.CHANGE_DEFAULT_SETTING, setting, value})
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
