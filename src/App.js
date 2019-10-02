import React, {useEffect}       from 'react';
import Editor                   from './components/editor/editor.component';
// import HelpModal from './components/helpModal/helpModal.component';
import VrScene from './components/vrScene/vrScene.component';
import Render2D                 from './components/editor/render2d.component';
import {connect}                from 'react-redux'
import * as actionTypes         from './store/actions';
import './firebase/firebase';
import './styles/style.scss';
import Render3D                 from './components/editor/render3d.component';
import HiScore                  from './components/hiscore/hiscore.component';
import * as firebase from 'firebase';

function App(props) {
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user && !props.defaultSettings.online) {
                props.changeSetting('online', !props.defaultSettings.online);
            }
        });
    });
    useEffect(() => {
        console.log('DEFAULT SETTINGS', props);
    });
    return (
        <>
            {(!props.defaultSettings.vrView || !props.defaultSettings.canRenderVr) && <header className="heading">
                <h1>Welcome to the Labyrinth Game Experience</h1>
                <h3>Will you be able to back here...</h3>
            </header>}
            <main>
                {props.defaultSettings.canRenderVr && !props.defaultSettings.finish && <Render3D/>}
                {!props.defaultSettings.vrView && !props.defaultSettings.finish && <Editor/>}
                {props.defaultSettings.generateGrid && !props.defaultSettings.renderVrCreator && !props.defaultSettings.finish && <Render2D/>}
                {props.defaultSettings.finish && <HiScore/>}
                {/* <HelpModal/> */}
                {props.defaultSettings.vrView && props.defaultSettings.renderVrCreator && !props.defaultSettings.canRenderVr &&
                    <div className="preview">
                        <VrScene/>
                    </div>
                }
                <div id="loadedMaps" className="hidden"/>
            </main>
        </>
    );
}

const mapStateToProps = state => {
  return {
      defaultSettings: state.defaultSettings,
  }
};

const mapDispatchToProps = dispatch => {
  return {
        changeSetting: (setting, value) => dispatch({type: actionTypes.CHANGE_DEFAULT_SETTING, setting, value})
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
