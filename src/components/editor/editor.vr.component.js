import React, {useEffect, useState} from 'react';
import * as _ from 'lodash';
import 'aframe';

let fragment = document.createDocumentFragment();
let countClick = 0;
let countSelectedBlocks = 0;
let lastClicked = 0;
let startSelected = false;
let renderFinish = false;
let finishCanBeSelected = false;
let finishSelected = false;
let currentMapArray;
const pathArray = [];
let renderValidPathOptions = [];
let renderDisableIfSelected = [];
let renderAvailablePathsArray = [];
let renderActivePathArray = [];
let renderLabyrinthArray = [];
let createArrayOnce = 0;

function EditorVr({selectedGrid, mapSettings}) {
    const roundWalls = selectedGrid + 2;
    const sumOfPaths = roundWalls * roundWalls;
    const [mapArray, setMapArray] = useState([]);
    useEffect(() => {
        mapSettings(mapArray, renderLabyrinthArray);
    }, [mapArray, renderLabyrinthArray]);

    function selectRenderedPath(selectedPathIndex, event, wasClicked) {
        const element = event.target;

        if (renderLabyrinthArray[selectedPathIndex].active && element.classList.contains('clickable')) {
            if (countClick === 0) {
                const selectedObject3D = event.target.object3D;
                const objectPosition = selectedObject3D.position;
                element.setAttribute('animation', 'easing: linear; from: ' + objectPosition.x + ' ' + objectPosition.y + ' ' + objectPosition.z + '; to: ' + objectPosition.x + ' ' + objectPosition.y + ' 1' + '; property: position; dur: 3000; elasticity: 600;');
            }

            switch (countClick) {
                case 0:
                    selectStart(element, selectedPathIndex);
                    break;
                case 1:
                    selectPath(element, selectedPathIndex, wasClicked, event);
                    break;
                default:
                    return false;
            }
        }
    }

    /* === Selecting start function === */
    function selectStart(element, index) {
        const clickable = document.querySelectorAll('.clickable');

        _.forEach(clickable, clickableElement => {
            clickableElement.classList.remove('clickable');
        });

        countClick = 1;
        renderLabyrinthArray[index].option = 2;
        element.classList.add('start-selected');
        element.setAttribute('color', '#fd2929');
        startSelected = true;
        showValidOptions(index);
    }

    function selectPath(element, index, wasClicked, event) {

        if (startSelected && renderFinish && renderLabyrinthArray.length !== 0) {
            if (element.classList.contains('to-use') && wasClicked) {
                element.classList.add('selected');

                element.dataset.clickCounter = '1';
                if (_.toNumber(element.dataset.clickCounter) === 1) {
                    element.setAttribute('color', '#1ace65');
                    const objectPosition = event.target.object3D.position;
                    element.setAttribute('animation', 'easing: linear; from: ' + objectPosition.x + ' ' + objectPosition.y + ' ' + objectPosition.z + '; to: ' + objectPosition.x + ' ' + objectPosition.y + ' 1' + '; property: position; dur: 3000; elasticity: 600; delay: 0;');
                }
                element.classList.remove('to-use');
                renderLabyrinthArray[index].option = 1;
            } else if (element.dataset.clickCounter === '1' && wasClicked) {
                element.dataset.clickCounter = '2';
            }

            if (element.classList.contains('selected') && !finishCanBeSelected && wasClicked) {
                finishCanBeSelected = true;
            } else if (element.dataset.clickCounter === '2' && element.classList.contains('finish') && wasClicked && finishSelected) {
                element.classList.remove('finish');
                element.classList.add('selected');
                element.dataset.clickCounter = '1';
                element.setAttribute('color', '#1ace65');
                renderLabyrinthArray[index].option = 1;
                finishCanBeSelected = false;
                finishSelected = false;
            }

            if (element.dataset.clickCounter === '2' && finishCanBeSelected && wasClicked && !finishSelected) {
                element.classList.add('finish');
                element.setAttribute('color', 'blue');
                element.classList.remove('selected');
                renderLabyrinthArray[index].option = 3;
                finishSelected = true;
            }
            showValidOptions(index);
        }
    }

    function showValidOptions(pathIndex) {
        countSelectedBlocks += 1;

        _.forEach(renderValidPathOptions[pathIndex], option => {
            const rest = renderAvailablePathsArray.indexOf(option);
            // validPathOption looks like [clicked element, right, left, bottom, top]
            const pathOption = document.getElementsByClassName('grid-path')[option];

            lastClicked = pathIndex;
            if (rest > -1) {
                renderAvailablePathsArray.splice(rest, 1);
            }

            // mark path to use, but not already disabled blocks
            if (renderActivePathArray[option] && !pathOption.classList.contains('disabled')) {
                renderLabyrinthArray[pathIndex].selected = true;
                renderActivePathArray[pathIndex] = false;

                pathOption.style.pointerEvents = 'auto';
                pathOption.classList.add('to-use');
                if (!pathOption.classList.contains('selected') && !pathOption.classList.contains('start-selected') && !pathOption.classList.contains('finish') && !pathOption.classList.contains('start-selected')) {
                    pathOption.setAttribute('color', '#ec902e');
                    pathOption.classList.add('clickable');
                }
            }
        });
        /* === Disable block - create wall === */
        _.mapKeys(renderDisableIfSelected[pathIndex], (position, key) => {
            const disOption = renderDisableIfSelected[pathIndex][key];
            const vrPathEl = document.getElementsByClassName('grid-path');
            const pathElement = vrPathEl[disOption.disable];
            let countDisabled = 0;

            _.forEach(disOption.options, opt => {
                if (renderLabyrinthArray[opt].selected) {
                    countDisabled = countDisabled + 1;
                    if (disOption.options.length === countDisabled) {
                        countDisabled = 0;
                        pathElement.classList.remove('to-use');
                        pathElement.classList.add('disabled');
                        pathElement.setAttribute('color', '#333333');
                        pathElement.style.pointerEvents = 'none';
                        renderLabyrinthArray[disOption.disable].active = false;

                        document.getElementsByClassName('js-clock');
                        document.querySelector(".js-clock");
                        document.getElementsByTagName('h1');
                    }
                }
            });
        });
        /* === Show selected paths / adding class to selected === */
        _.forEach(pathArray, item => {
            const thisItem = document.getElementsByClassName('grid-path')[item];
            _.forEach(renderAvailablePathsArray, ap => {
                if (item === ap) {
                    thisItem.style.pointerEvents = 'none';
                    thisItem.classList.remove('to-use');
                }
            });
            if (!renderActivePathArray[item]) {
                thisItem.classList.remove('to-use');
            }
        });
    }

    function createArray() {
        let previousPath = 0;

        _.forEach(pathArray, (item) => {
            const pathItem = document.querySelectorAll('.grid-path')[item];
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
            return [...prev, pathArray.slice(roundWalls * curr, roundWalls * curr + roundWalls)];
        }, []);

        setMapArray(currentMapArray);

        if (selectedGrid !== 0) {
            currentMapArray.forEach(function (e, x) {
                currentMapArray.forEach(function (a, y) {
                    const planes = document.querySelectorAll('.grid-path');
                    const index = currentMapArray[x][y];

                    planes[index].setAttribute('scale', '0 0 0');
                    planes[index].setAttribute('animation', 'easing: easeOutElastic; from: 0 0 0; to: 0.7 0.7 1; property: scale; dur: 3500; elasticity: 600; delay: ' + index + '0');
                    planes[index].setAttribute('rotate', '0 0 0');
                    planes[index].setAttribute('color', '#af71db');

                    if (planes[index].classList.contains('disabled')) {
                        planes[index].classList.remove('clickable');
                        planes[index].setAttribute('color', '#333333');
                    }

                    planes[index].setAttribute('position', `${x} ${y} 0`);
                });
            });

            // vrInfo.setAttribute('value','Create your own labyrinth');
            // vrInfo.setAttribute('animation','property: position; from: 0 2.7 -1.4; to: 0 -20 -1.4; easing: easeInQuart; delay: 3000; dur: 1500');
            document.getElementById('grid-container').setAttribute('animation', `easing: easeOutElastic; from: -${Math.round(selectedGrid / 2)} 0 -30; to: -${Math.round(selectedGrid / 2)} 0 -${selectedGrid + (selectedGrid / 2)}; property: position; dur: 1500;`);
            // selectRenderedPath(selectedPathIndex, event, wasClicked, changeSetting)
            // document.getElementById('scene-light').setAttribute('position', `0 ${Math.round(selectedCol / 2)} -${selectedCol - (selectedCol / 2)}`);
            // document.getElementById('scene-light').setAttribute('light', `distance: ${selectedCol + 5}; intensity: ${selectedCol / 3}`);
        }
    }
    function renderPath() {
        if (selectedGrid !== 0 && createArrayOnce < 1) {
            for (let i = 0; i < sumOfPaths; i++) {
                let gridElement = document.createElement('a-box');
                gridElement.classList.add('grid-path');
                gridElement.classList.add('clickable');
                gridElement.dataset.pathIndex = _.toString(i);
                gridElement.setAttribute('key', _.toString(i));
                gridElement.setAttribute('position', {
                    x: 0,
                    y: 0,
                    z: '-10'
                });
                pathArray.push(i);
                fragment.appendChild(gridElement);
            }
            document.getElementById('grid-container').append(fragment);
            Array.from(document.querySelectorAll('.grid-path')).forEach((element) => {
               element.addEventListener('click', (event) => {
                   const target = event.target;
                   selectRenderedPath(target.dataset.pathIndex, event, true);
               });
            });
            renderFinish = true;
            createArrayOnce++;
            createArray();
        }
    }

    return (
        <a-entity id="grid-container">
            {renderPath()}
        </a-entity>
    )
}

export default EditorVr;