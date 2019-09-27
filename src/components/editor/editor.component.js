import React from 'react';
import * as _ from 'lodash';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';
import classNames from 'classnames'

function Editor(props) {
    const {defaultSettings, changeSetting} = props;

    const collapseEditor = () => {
        const content = document.querySelector('.creator-content');
        content.classList.contains('collapsed') ? content.classList.remove('collapsed') : content.classList.add('collapsed');
    };

    const show2DEditor = (value) => {
        const roundWalls = value + 2;
        const sumOfPaths = roundWalls * roundWalls;
        const renderPathArray = [];

        for (let pathNumber = 0; pathNumber < sumOfPaths; pathNumber++) {
            renderPathArray.push(pathNumber);
        }

        changeSetting('generateGrid', !defaultSettings.generateGrid);
        changeSetting('selectedCol', value);
        props.changeSetting('roundWalls', roundWalls);
        props.changeSetting('sumOfPaths', sumOfPaths);
        props.changeSetting('placeWidth', roundWalls * (25 + 2));
        props.changeSetting('pathArray', renderPathArray);
    };

    const render3DEditor = () => {
        changeSetting('vrView', !defaultSettings.vrView);
        changeSetting('renderVrCreator', !defaultSettings.renderVrCreator);

    };

    return (
        <div className="editor">
            <div className="editor-body">
                <div id="settings-place">
                    <div>
                        <p className="creator-title creator-2d" onClick={collapseEditor}>2D creator</p>
                        <div className="creator-content collapsed">
                            <label htmlFor="creator-name">Creator name</label>
                            <input id="creator-name" name="creator-name" type="text" placeholder="Write your name"/>
                            <div className="hover-settings">
                                <div className={classNames('checkbox', {'checked': defaultSettings.hover})} onClick={() => changeSetting('hover', !defaultSettings.hover)} />
                                <span>On mouse hover creator</span>
                            </div>
                            <label htmlFor="grid-settings">Set number of columns</label>
                            <ul id="grid-settings">
                                {_.map(defaultSettings.cols, ((val, key) => {
                                    return (
                                        <li key={key} onClick={() => show2DEditor(val)}>{val}x{val}</li>
                                    )
                                }))}
                            </ul>
                        </div>
                    </div>
                    <button id="vr-creator" onClick={() => render3DEditor()}>VR creator</button>
                    <button id="another-maps" data-target="loadedMaps">See other maps <span className="maps-counter" /></button>
                    <button id="help" data-target="help-modal">Get some help</button>
                </div>
                <div className="panel-settings hidden">
                    <button id="apply">Start game!</button>
                    <h3 style={{borderRadius: '5px', color: '#333', fontWeight: 'normal', letterSpacing: '1px', backgroundColor: 'white', padding: '5px', marginBottom: '10px'}}>If you will click on the <span style={{color: '#1ace65', fontWeight: 'bold'}}>green</span> path second time, it will be set <span style={{color: '#0e7ef6', fontWeight: 'bold'}}>finish</span> point.</h3>
                    <h4 style={{borderRadius: '5px', color: '#333', fontWeight: 'normal', letterSpacing: '1px', backgroundColor: 'white', adding: '5px', marginTop: 0}}>If you will click on the <span style={{color: '#0e7ef6', fontWeight: 'bold'}}>finish</span> path second time, it will be removed.</h4>
                </div>
                <div id="creator-place" className="hidden"/>
                <div className="apply-block">
                    <h3 className="apply-error">Error</h3>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        defaultSettings: state.defaultSettings
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeSetting: (setting, value) => dispatch({type: actionTypes.CHANGE_DEFAULT_SETTING, setting, value})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);