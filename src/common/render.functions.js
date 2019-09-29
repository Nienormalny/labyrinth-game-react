import React from 'react';
import * as _ from 'lodash';
import {store} from '../index';

/* === GET VALID OPTIONS TO CHOSE === */
const showValidOptions = (pathIndex, props, changeSetting) => {
    const {validPathOptions, availablePathsArray, activePathArray, renderVrCreator, countSelectedBlocks, disableIfSelected, pathArray, labyrinthArray} = props.defaultSettings;

    changeSetting('countSelectedBlocks', countSelectedBlocks + 1);

    _.forEach(validPathOptions[pathIndex], option => {
        const rest = availablePathsArray.indexOf(option);
        // validPathOption looks like [clicked element, right, left, bottom, top]
        const pathOption = renderVrCreator ? document.getElementsByClassName('grid-path')[option] : document.getElementsByClassName('path')[option];
        changeSetting('lastClicked', pathIndex);
        if (rest > -1) {
            availablePathsArray.splice(rest, 1);
            changeSetting('availablePathsArray', availablePathsArray);
        }

        // mark path to use, but not already disabled blocks
        if (activePathArray[option] && !pathOption.classList.contains('disabled')) {
            labyrinthArray[pathIndex].selected = true;
            activePathArray[pathIndex] = false;

            changeSetting('labyrinthArray', labyrinthArray);
            changeSetting('activePathArray', activePathArray);

            pathOption.style.pointerEvents = 'auto';
            pathOption.classList.add('to-use');
            if (renderVrCreator && !pathOption.classList.contains('selected') && !pathOption.classList.contains('start-selected') && !pathOption.classList.contains('finish') && !pathOption.classList.contains('start-selected')) {
                pathOption.setAttribute('color', '#ec902e');
                pathOption.classList.add('clickable');
            } else {

            }
        }
    });
    /* === Disable block - create wall === */
    _.mapKeys(disableIfSelected[pathIndex], (position, key) => {
        const disOption = disableIfSelected[pathIndex][key];
        const pathEl = document.getElementsByClassName('path');
        const vrPathEl = document.getElementsByClassName('grid-path');
        const pathElement = renderVrCreator ? vrPathEl[disOption.disable] : pathEl[disOption.disable];
        let countDisabled = 0;

        _.forEach(disOption.options, opt => {
            if (labyrinthArray[opt].selected) {
                countDisabled = countDisabled + 1;
                if (disOption.options.length === countDisabled) {
                    countDisabled = 0;
                    pathElement.classList.remove('to-use');
                    pathElement.classList.add('disabled');
                    if (renderVrCreator) {
                        pathElement.setAttribute('color', '#333333');
                    }
                    pathElement.style.pointerEvents = 'none';
                    labyrinthArray[disOption.disable].active = false;
                    changeSetting('labyrinthArray', labyrinthArray);

                    document.getElementsByClassName('js-clock');
                    document.querySelector(".js-clock");
                    document.getElementsByTagName('h1');
                }
            }
        });
    });
    /* === Show selected paths / adding class to selected === */
    _.forEach(pathArray, item => {
        const thisItem = renderVrCreator ? document.getElementsByClassName('grid-path')[item] : document.getElementsByClassName('path')[item];
        _.forEach(availablePathsArray, ap => {
            if (item === ap) {
                thisItem.style.pointerEvents = 'none';
                thisItem.classList.remove('to-use');
            }
        });
        if (!activePathArray[item]) {
            thisItem.classList.remove('to-use');
        }
    });
};
/* === Selecting path function === */
function selectPath(element, index, wasClicked, props, changeSetting, event) {
    const {startSelected, renderFinish, labyrinthArray, finishCanBeSelected, finishSelected, renderVrCreator} = props.defaultSettings;

    if (startSelected && renderFinish && labyrinthArray.length !== 0) {
        if (element.classList.contains('to-use') && wasClicked) {
            element.classList.add('selected');

            element.dataset.clickCounter = '1';
            if (renderVrCreator && _.toNumber(element.dataset.clickCounter) === 1) {
                element.setAttribute('color', '#1ace65');
                const objectPosition = event.target.object3D.position;
                const objectScale = event.target.object3D.scale;
                element.setAttribute('animation', 'easing: easeOutElastic; from: ' + objectPosition.x + ' ' + objectPosition.y + ' ' + objectPosition.z + '; to: ' + objectPosition.x + ' ' + objectPosition.y + ' -0.5' + '; property: position; dur: 1500; elasticity: 600;');
                element.setAttribute('animation', 'easing: easeOutElastic; from: ' + objectScale.x + ' ' + objectScale.y + ' ' + objectScale.z + '; to: ' + (objectScale.x + 0.2) + ' ' + (objectScale.y + 0.2) + ' ' + (objectScale.z + 0.2) + '; property: scale; dur: 1500; elasticity: 600;');
            }
            element.classList.remove('to-use');
            labyrinthArray[index].option = 1;
            changeSetting('labyrinthArray', labyrinthArray);
        } else if (element.dataset.clickCounter === '1' && wasClicked) {
            element.dataset.clickCounter = '2';
        }

        if (element.classList.contains('selected') && !finishCanBeSelected && wasClicked) {
            changeSetting('finishCanBeSelected', true);
        } else if (element.dataset.clickCounter === '2' && element.classList.contains('finish') && wasClicked && finishSelected) {
            element.classList.remove('finish');
            element.classList.add('selected');
            element.dataset.clickCounter = '1';
            if (renderVrCreator) {
                element.setAttribute('color', '#1ace65');
            }
            labyrinthArray[index].option = 1;
            changeSetting('labyrinthArray', labyrinthArray);
            changeSetting('finishCanBeSelected', false);
            changeSetting('finishSelected', false);
        }

        if (element.dataset.clickCounter === '2' && finishCanBeSelected && wasClicked && !finishSelected) {
            element.classList.add('finish');
            if (renderVrCreator) {
                element.setAttribute('color', 'blue');
            }
            element.classList.remove('selected');
            labyrinthArray[index].option = 3;
            changeSetting('labyrinthArray', labyrinthArray);
            changeSetting('finishSelected', true);
        }
        showValidOptions(index, props, changeSetting);
    }
};

/* === Selecting start function === */
const selectStart = (element, index, props, changeSetting) => {
    const {renderVrCreator, generateGrid, labyrinthArray} = props.defaultSettings;
    const clickable = document.querySelectorAll('.clickable');
    _.forEach(clickable, clickableElement => {
        clickableElement.classList.remove('clickable');
    });

    if (generateGrid) {
        changeSetting('countClick', 1);
        labyrinthArray[index].option = 2;
        changeSetting('labyrinthArray' , props.defaultSettings.labyrinthArray);
        element.classList.add('start-selected');
        if (renderVrCreator) {
            element.setAttribute('color', '#fd2929');
        }
        changeSetting('startSelected', true);
        showValidOptions(index, props, changeSetting);
    }
};

export const selectRenderedPath = (selectedPathIndex, event, wasClicked, changeSetting) => {
    const props = store.getState();

    const {labyrinthArray, renderVrCreator} = props.defaultSettings;
    const {countClick} = props.defaultSettings;

    if (labyrinthArray[selectedPathIndex].active) {
        const element = event.target;
        console.log([element], element.dataset.clickCounter);

        if (renderVrCreator && countClick === 0) {
            const selectedObject3D = event.target.object3D;
            const objectPosition = selectedObject3D.position;
            const objectScale = selectedObject3D.scale;
            element.setAttribute('animation', 'easing: easeOutElastic; from: ' + objectPosition.x + ' ' + objectPosition.y + ' ' + objectPosition.z + '; to: ' + objectPosition.x + ' ' + objectPosition.y + ' -0.5' + '; property: position; dur: 1500; elasticity: 600;');
            element.setAttribute('animation', 'easing: easeOutElastic; from: ' + objectScale.x + ' ' + objectScale.y + ' ' + objectScale.z + '; to: ' + (objectScale.x + 0.2) + ' ' + (objectScale.y + 0.2) + ' ' + (objectScale.z + 0.2) + '; property: scale; dur: 1500; elasticity: 600;');
        }

        switch (countClick) {
            case 0:
                selectStart(element, selectedPathIndex, props, changeSetting);
                break;
            case 1:
                selectPath(element, selectedPathIndex, wasClicked, props, changeSetting, event);
                break;
            default:
                return false;
        }
    }
};
export const createArray = (props) => {
    const {pathArray, sumOfPaths, roundWalls, renderVrCreator, selectedCol, countClick} = props.defaultSettings;
    const renderValidPathOptions = [];
    const renderDisableIfSelected = [];
    const renderAvailablePathsArray = [];
    const renderActivePathArray = [];
    const renderLabyrinthArray = [];
    let currentMapArray;

    let previousPath = 0;
    _.forEach(pathArray, (item) => {
        const pathItem = renderVrCreator ? document.querySelectorAll('.grid-path')[item] : document.querySelectorAll('.path')[item];
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

    currentMapArray = [...Array(roundWalls).keys()].reduce((prev, curr) => {
        return [...prev,  pathArray.slice(roundWalls * curr, roundWalls * curr + roundWalls)];
    }, []);

    if (renderVrCreator && selectedCol) {
        currentMapArray.forEach(function (e, x) {
            currentMapArray.forEach(function (a, y) {
                const planes = document.querySelectorAll('.grid-path');
                const index = currentMapArray[x][y];

                planes[index].setAttribute('scale', '0 0 0');
                planes[index].setAttribute('animation', 'easing: easeOutElastic; from: 0 0 -' + index + '; to: 0.7 0.7 1; property: scale; dur: 3500; elasticity: 600; delay: ' + index + '0');
                planes[index].setAttribute('rotate', '0 0 0');
                planes[index].setAttribute('color', '#af71db');

                if (renderLabyrinthArray[index].active && countClick === 0) {
                    planes[index].classList.add('clickable');
                }

                if (planes[index].classList.contains('disabled')) {
                    planes[index].setAttribute('color', '#333333');
                }

                planes[index].setAttribute('position', `${x} ${y} -1`);
            });
        });
        // const gridPath = document.querySelectorAll('.grid-path');
        /*Array.from(gridPath).forEach(function (e, i) {
            gridPath[i].setAttribute('selectblock', '');
        });*/
        // vrInfo.setAttribute('value','Create your own labyrinth');
        // vrInfo.setAttribute('animation','property: position; from: 0 2.7 -1.4; to: 0 -20 -1.4; easing: easeInQuart; delay: 3000; dur: 1500');
        document.getElementById('render-grid').setAttribute('animation', `easing: easeOutElastic; from: -${Math.round(selectedCol / 2)} 0 -30; to: -${Math.round(selectedCol / 2)} 0 -25; property: position; dur: 1500;`);
    }
    props.changeSetting('mapArray', currentMapArray);
    props.changeSetting('renderFinish', true);
    props.changeSetting('labyrinthArray', renderLabyrinthArray);
    props.changeSetting('activePathArray', renderActivePathArray);
    props.changeSetting('availablePathsArray', renderAvailablePathsArray);
    props.changeSetting('validPathOptions', renderValidPathOptions);
    props.changeSetting('disableIfSelected', renderDisableIfSelected);
};