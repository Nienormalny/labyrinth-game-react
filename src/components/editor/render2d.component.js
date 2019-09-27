import React, {useEffect, useState}       from 'react';
import * as _                   from 'lodash';
import * as actionTypes         from '../../store/actions';
import {connect}                from 'react-redux';
import StartGame                from '../startGame/startGame.component';
import {createArray, selectRenderedPath} from '../../common/render.functions';

function Render2D(props) {
    let { generateGrid, placeWidth, sumOfPaths} = props.defaultSettings;
    const pathElement = [];
    useEffect(() => {
        if (generateGrid) {
            createArray(props);
        }
    }, [generateGrid]);

    for (let pathNumber = 0; pathNumber < sumOfPaths; pathNumber++) {
        pathElement.push(<div className="path" data-path-index={pathNumber} key={pathNumber} onClick={event => props.selectRenderedPaths(pathNumber, event, true, props)}/>);
    }

    return (
        <div id="render2D">
            <StartGame/>
            <div id="creator-place" style={{width: placeWidth}}>
                {pathElement}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        defaultSettings: state.defaultSettings,
        selectRenderedPaths: (selectedPathIndex, event, wasClicked, props) => selectRenderedPath(selectedPathIndex, event, wasClicked, props)
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeSetting: (setting, value) => dispatch({type: actionTypes.CHANGE_DEFAULT_SETTING, setting, value})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Render2D);