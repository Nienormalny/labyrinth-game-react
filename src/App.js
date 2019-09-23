import React, {useEffect} from 'react';
import Editor from './components/editor/editor.component';
// import HiScore from './components/hiscore/hiscore.component';
// import HelpModal from './components/helpModal/helpModal.component';
import VrScene from './components/vrScene/vrScene.component';
import Render2D from './components/editor/render2d.component';
import {connect} from 'react-redux'
import * as actionTypes from './store/actions';
// import {getRandomId, getTimeString} from './common/widgets';
import './firebase/firebase';
import './styles/style.scss';
import Render3D from './components/editor/render3d.component';

/*const map = {
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
const time = {
  seconds: 20,
  minutes: 0,
  hours: 0,
  owner: {
      id: getRandomId(),
      name: 'Test 2',
      date: new Date().getDateString()
  },
  timeString: getTimeString(20, 0, 0)
};*/

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
                {props.defaultSettings.vrView &&
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
