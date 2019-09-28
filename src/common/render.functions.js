import React from 'react';
import * as _ from 'lodash';

/* === GET VALID OPTIONS TO CHOSE === */
const showValidOptions = (pathIndex, props) => {
    const {validPathOptions, availablePathsArray, activePathArray, vrView, countSelectedBlocks, disableIfSelected, pathArray, labyrinthArray} = props.defaultSettings;
    const {changeSetting} = props;

    changeSetting('countSelectedBlocks', countSelectedBlocks + 1);

    _.forEach(validPathOptions[pathIndex], option => {
        const rest = availablePathsArray.indexOf(option);
        // validPathOption looks like [clicked element, right, left, bottom, top]
        const pathOption = vrView ? document.getElementsByClassName('grid-path')[option] : document.getElementsByClassName('path')[option];
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
            if (vrView && !pathOption.classList.contains('selected') && !pathOption.classList.contains('start-selected') && !pathOption.classList.contains('finish') && !pathOption.classList.contains('start-selected')) {
                pathOption.setAttribute('color', '#ec902e');
                pathOption.classList.add('clickable');
            }
        }
    });
    /* === Disable block - create wall === */
    _.mapKeys(disableIfSelected[pathIndex], (position, key) => {
        const disOption = disableIfSelected[pathIndex][key];
        const pathEl = document.getElementsByClassName('path');
        const vrPathEl = document.getElementsByClassName('grid-path');
        const pathElement = vrView ? vrPathEl[disOption.disable] : pathEl[disOption.disable];
        let countDisabled = 0;

        _.forEach(disOption.options, opt => {
            if (labyrinthArray[opt].selected) {
                countDisabled = countDisabled + 1;
                if (disOption.options.length === countDisabled) {
                    countDisabled = 0;
                    pathElement.classList.remove('to-use');
                    pathElement.classList.add('disabled');
                    if (vrView) {
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
        const thisItem = vrView ? document.getElementsByClassName('grid-path')[item] : document.getElementsByClassName('path')[item];
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
function selectPath(element, index, wasClicked, props) {
    const {startSelected, renderFinish, labyrinthArray, finishCanBeSelected, finishSelected, vrView} = props.defaultSettings;
    const {changeSetting} = props;

    if (startSelected && renderFinish && labyrinthArray.length !== 0) {
        if (element.classList.contains('to-use') && wasClicked) {
            element.classList.add('selected');
            element.dataset.clickCounter = '1';
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
            if (vrView) {
                element.setAttribute('color', '#1ace65');
            }
            labyrinthArray[index].option = 1;
            changeSetting('labyrinthArray', labyrinthArray);
            changeSetting('finishCanBeSelected', false);
            changeSetting('finishSelected', false);
        }

        if (element.dataset.clickCounter === '2' && finishCanBeSelected && wasClicked && !finishSelected) {
            element.classList.add('finish');
            if (vrView) {
                element.setAttribute('color', 'blue');
            }
            element.classList.remove('selected');
            labyrinthArray[index].option = 3;
            changeSetting('labyrinthArray', labyrinthArray);
            changeSetting('finishSelected', true);
        }
        showValidOptions(index, props);
    }
};
/* === Selecting start function === */
const selectStart = (element, index, props) => {
    const {vrView, generateGrid, labyrinthArray} = props.defaultSettings;
    const clickable = document.querySelectorAll('.clickable');
    _.forEach(clickable, clickableElement => {
        clickableElement.classList.remove('clickable');
    });

    if (generateGrid) {
        props.changeSetting('countClick', 1);
        labyrinthArray[index].option = 2;
        props.changeSetting('labyrinthArray' , props.defaultSettings.labyrinthArray);
        element.classList.add('start-selected');
        if (vrView) {
            element.setAttribute('color', '#fd2929');
        }
        props.changeSetting('startSelected', true);
        showValidOptions(index, props);
    }
};
export const selectRenderedPath = (selectedPathIndex, event, wasClicked, props) => {
    const {labyrinthArray} = props.defaultSettings;
    const {countClick} = props.defaultSettings;

    if (labyrinthArray[selectedPathIndex].active) {
        const element = event.target;

        switch (countClick) {
            case 0:
                selectStart(element, selectedPathIndex, props);
                break;
            case 1:
                selectPath(event.target, selectedPathIndex, wasClicked, props);
                break;
            default:
                return false;
        }
    }
};
export const createArray = (props) => {
    const {mapArray, pathArray, sumOfPaths, roundWalls, renderVrCreator, selectedCol, countClick} = props.defaultSettings;
    const renderValidPathOptions = [];
    const renderDisableIfSelected = [];
    const renderAvailablePathsArray = [];
    const renderActivePathArray = [];
    const renderLabyrinthArray = [];
    let currentMapArray;

    console.log('CREATE ARRAY', renderVrCreator);
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
    }, [])

    props.changeSetting('mapArray', currentMapArray);
    props.changeSetting('renderFinish', true);
    props.changeSetting('labyrinthArray', renderLabyrinthArray);
    props.changeSetting('activePathArray', renderActivePathArray);
    props.changeSetting('availablePathsArray', renderAvailablePathsArray);
    props.changeSetting('validPathOptions', renderValidPathOptions);
    props.changeSetting('disableIfSelected', renderDisableIfSelected);

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
};