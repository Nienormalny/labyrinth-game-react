import React, {useEffect} from 'react';
import Editor from './components/editor/editor.component';
// import HiScore from './components/hiscore/hiscore.component';
// import HelpModal from './components/helpModal/helpModal.component';
// import VrScene from './components/vrScene/vrScene.component';
import Render2D from './components/editor/render2d.component';
import {connect} from 'react-redux'
import * as actionTypes from './store/actions';
import './firebase/firebase';
import './styles/style.scss';
import Render3D from './components/editor/render3d.component';

function App(props) {
    useEffect(() => {
        console.log('DEFAULT SETTINGS', props.defaultSettings)
    }, [props.defaultSettings]);
    return (
        <>
            <header className="heading">
                <h1>Welcome to the Labyrinth Game Experience</h1>
                <h3>Will you be able to back here...</h3>
            </header>
            <main>
                {props.defaultSettings.canRenderVr && <Render3D/>}
                {!props.defaultSettings.vrView && <Editor/>}
                {props.defaultSettings.render2DView && <Render2D/>}
                {/* <HelpModal/> */}
                {/* <HiScore/> */}
                {/*props.defaultSettings.vrView &&
                    <div className="preview">
                        <VrScene/>
                    </div>
                */}
                <div id="loadedMaps" className="hidden"/>
            </main>
        </>
    );
}

const mapStateToProps = state => {
  return {
      mapsState: state.mapState,
      defaultSettings: state.defaultSettings
  }
};

const mapDispatchToProps = dispatch => {
  return {
        onAddNewMap: (map) => dispatch({type: actionTypes.ADD_NEW_MAP, map: map}),
        onUpdateTime: (time, map) => dispatch({type: actionTypes.UPDATE_TIME, map: map, time: time})
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
