import React, {useEffect} from 'react';
import * as _ from 'lodash';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';

function Render2D(props) {
    let {selectedCol, render2DView, labyrinthArray} = props.defaultSettings;
    const roundWalls = selectedCol + 2;
    const sumOfPaths = roundWalls * roundWalls;
    const placeWidth = roundWalls * (25 + 2);
    const pathElement = [];
    const renderPathArray = [];
    const renderValidPathOptions = [];
    const renderDisableIfSelected = [];
    const renderAvailablePathsArray = [];
    const renderActivePathArray = [];
    const renderLabyrinthArray = [];

    useEffect(() => {
        if (render2DView) {
            let previousPath = 0;
            _.forEach(renderPathArray, (item) => {
                const pathItem = document.querySelectorAll('.path')[item];
                const pathIndex = parseFloat(pathItem.dataset.pathIndex);
                const isOutside = pathItem.dataset.pathIndex <= roundWalls
                    || pathItem.dataset.pathIndex - previousPath === roundWalls
                    || (pathItem.dataset.pathIndex > sumOfPaths - roundWalls
                    && pathItem.dataset.pathIndex < sumOfPaths + 1),
                    rightSide = pathItem.dataset.pathIndex - previousPath === roundWalls - 1;
                if (isOutside) {
                    previousPath = pathIndex;
                }
                if (isOutside || rightSide) {
                    pathItem.classList.add('disabled');
                }
                if (!pathItem.classList.contains('disabled')) {
                    const right = pathIndex + 1,
                        left = pathIndex - 1,
                        bottom = pathIndex + parseFloat(roundWalls),
                        top = pathIndex - parseFloat(roundWalls),
                        bottomRight = pathIndex + parseFloat(roundWalls) + 1,
                        bottomLeft = pathIndex + parseFloat(roundWalls) - 1,
                        topRight = pathIndex - parseFloat(roundWalls) + 1,
                        topLeft = pathIndex - parseFloat(roundWalls) - 1;
                    /* Generate next choosable option */
                    renderValidPathOptions[pathIndex] = [pathIndex, right, left, bottom, top];
                    renderDisableIfSelected[pathIndex] = {
                        TopLeft: {
                            options: [pathIndex, right, topRight],
                            disable: top
                        },
                        TopRight: {
                            options: [pathIndex, left, topLeft],
                            disable: top
                        },
                        BottomLeft: {
                            options: [pathIndex, left, bottomLeft],
                            disable: bottom
                        },
                        BottomRight: {
                            options: [pathIndex, right, bottomRight],
                            disable: bottom
                        },
                        LeftTop: {
                            options: [pathIndex, top, topLeft],
                            disable: left
                        },
                        LeftBottom: {
                            options: [pathIndex, bottom, bottomLeft],
                            disable: left
                        },
                        RightTop: {
                            options: [pathIndex, top, topRight],
                            disable: right
                        },
                        RightBottom: {
                            options: [pathIndex, bottom, bottomRight],
                            disable: right
                        }
                    };
                    renderAvailablePathsArray.push(pathIndex);
                    renderActivePathArray[pathIndex] = true;
                    /* Create standard option in labyrinthArray for choosable blocks */
                    renderLabyrinthArray.push({
                        active: true,
                        selected: false,
                        pathId: pathIndex,
                        option: 0
                    });
                } else {
                    renderActivePathArray[pathIndex] = false;
                    renderLabyrinthArray.push({
                        active: false,
                        selected: false,
                        pathId: pathIndex,
                        option: 0
                    });
                }
            });
            props.changeSetting('labyrinthArray', renderLabyrinthArray);
            props.changeSetting('activePathArray', renderActivePathArray);
            props.changeSetting('availablePathsArray', renderAvailablePathsArray);
        }
        console.log(props.defaultSettings);
    }, [props.defaultSettings.startSelected]);



    for (let pathNumber = 0; pathNumber < sumOfPaths; pathNumber++) {
        pathElement.push(<div className="path" data-path-index={pathNumber} key={pathNumber} onClick={event => selectRenderedPath(pathNumber, event, true)}/>);
        renderPathArray.push(pathNumber);
    }
    /* === Selecting start function === */
    function selectStart(element, index) {
        const {vrView} = props.defaultSettings;
        const clickable = document.querySelectorAll('.clickable');
        Array.from(clickable).forEach(function (clickableElement) {
            clickableElement.classList.remove('clickable');
        });

        if (render2DView) {
            props.changeSetting('countClick', 1);
            labyrinthArray[index].option = 2;
            props.changeSetting('labyrinthArray' , props.defaultSettings.labyrinthArray);
            element.classList.add('start-selected');
            if (vrView) {
                element.setAttribute('color', '#fd2929');
            }
            props.changeSetting('startSelected', true);
            // showValidOptions(index);
        }
    }

    function selectRenderedPath(selectedPathIndex, event, wasClicked) {
        const {countClick} = props.defaultSettings;
        if (labyrinthArray[selectedPathIndex].active) {
            const element = event.target,
                pathId = selectedPathIndex;

            switch (countClick) {
                case 0:
                    selectStart(element, pathId);
                    break;
                case 1:
                    // selectPath(element, pathId, wasClicked);
                    break;
                default:
                    return false;
            }
        }
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