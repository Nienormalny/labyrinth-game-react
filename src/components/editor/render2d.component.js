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
        pathElement.push(<div className="path" data-path-index={pathNumber} key={pathNumber} onClick={event => props.selectRenderedPaths(pathNumber, event, true, props.changeSetting)}/>);
    }

    const legends = [
        { boxStyle: 'path dark-gray-legend', label: 'walls' },
        { boxStyle: 'path red-legend', label: 'define start on first click' },
        { boxStyle: 'path green-legend', label: 'define path' },
        { boxStyle: 'path blue-legend', label: 'last click defines finish' },
        { boxStyle: 'path yellow-legend', label: 'choosable option' },
        { boxStyle: 'path purple-legend', label: 'option to choose' },
    ]

    const popover = (
        <div className="popover-content">
            {_.map(legends, (legend, id) => (
                <div key={id} className="legend">
                    <div className={legend.boxStyle} />
                    <div className="legend-label">{legend.label}</div>
                </div>
            ))}
        </div>
    );

    return (
        <div id="render2D">
            <div id="buttons-container2D">
                <div style={{ width: 50 }} />
                <StartGame />
                <div className="popover-wrapper">
                    <button className="button help">?</button>
                    {popover}
                </div>
            </div>
            <div id="creator-place" style={{width: placeWidth}}>
                {pathElement}
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        defaultSettings: state.defaultSettings,
        selectRenderedPaths: (selectedPathIndex, event, wasClicked, changeSetting) => selectRenderedPath(selectedPathIndex, event, wasClicked, changeSetting)
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeSetting: (setting, value) => dispatch({type: actionTypes.CHANGE_DEFAULT_SETTING, setting, value})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Render2D);