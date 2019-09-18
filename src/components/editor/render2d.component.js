import React, {useEffect} from 'react';
import * as _ from 'lodash';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';

function Render2D(props) {
    let {selectedCol,render2DView} = props.defaultSettings;
    useEffect(() => {
        if (render2DView) {
            let previousPath = 0;
            _.forEach(renderPathArray, (item) => {
                const pathItem = document.querySelectorAll('.path')[item];
                const pathIndex = parseFloat(pathItem.dataset.pathIndex);
                const isOutside = pathItem.dataset.pathIndex <= roundWalls
                    || pathItem.dataset.pathIndex - previousPath === roundWalls
                    || pathItem.dataset.pathIndex > sumOfPaths - roundWalls
                    && pathItem.dataset.pathIndex < sumOfPaths + 1,
                    rightSide = pathItem.dataset.pathIndex - previousPath === roundWalls - 1;
                if (isOutside) {
                    previousPath = pathIndex;
                }
                if (isOutside || rightSide) {
                    pathItem.classList.add('disabled');
                }
            });
        }
    }, [render2DView]);

    const roundWalls = selectedCol + 2;
    const sumOfPaths = roundWalls * roundWalls;
    const placeWidth = roundWalls * (25 + 2);
    const pathElement = [];
    const renderPathArray = [];

    for (let gridNumber = 0; gridNumber < sumOfPaths; gridNumber++) {
        pathElement.push(<div className="path" data-path-index={gridNumber} key={gridNumber}/>);
        renderPathArray.push(gridNumber);
    }

    return (
        <div id="render2D">
            <div id="creator-place" style={{width: placeWidth}}>
                {pathElement}
            </div>
        </div>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(Render2D);