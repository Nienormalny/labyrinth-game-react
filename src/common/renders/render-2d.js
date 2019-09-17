import * as _ from 'lodash';
import options from '../defaultSettings';

const AFRAME = window.AFRAME;

export function render2DPlane(value) {
    const gridSettingsNumber = parseFloat(value),
        roundWalls = gridSettingsNumber + 2,
        sumOfPaths = roundWalls * roundWalls,
        vrInfo = document.getElementById('vr-info'),
        place = options.vrView ? document.getElementById('render-grid') : document.getElementById('creator-place'),
        placeWidth = roundWalls * (25 + 2);
    let fragment = document.createDocumentFragment();

    document.getElementById('timer').setAttribute('visible', false);

    if (gridSettingsNumber > 0) {
        if (lastChange !== gridSettingsNumber) {
            place.innerHTML = '';
        }

        lastChange = parseFloat(gridSettingsNumber);

        for (let p = 0; p < sumOfPaths; p++) {
            let path;
            if (options.vrView && value) {
                path = document.createElement('a-plane');
                path.classList.add('grid-path');
                path.setAttribute('data-path-index', p);
            } else {
                path = document.createElement('div');
                path.classList.add('path');
                path.dataset.pathIndex = p;
            }
            pathArray.push(p);

            fragment.appendChild(path);
        }
        place.appendChild(fragment);
        document.querySelector('.panel-settings').classList.remove('hidden');

        place.style.width = placeWidth + 'px';
        renderFinish = true;
    }

    for (var p = 0; p < pathArray.length; p = p+roundWalls) {
        newArr.push(pathArray[p]);
    }
    if (renderFinish) {
        var prev = 0,
            outer = Array.from(pathArray).forEach(function (item) {
            const pathItem = options.vrView ? place.querySelectorAll('.grid-path')[item] : place.querySelectorAll('.path')[item],
                pathIndex = parseFloat(pathItem.dataset.pathIndex),
                isOutside = pathItem.dataset.pathIndex <= roundWalls
                || pathItem.dataset.pathIndex - prev === roundWalls
                || pathItem.dataset.pathIndex > sumOfPaths - roundWalls
                && pathItem.dataset.pathIndex < sumOfPaths + 1,
                rightSide = pathItem.dataset.pathIndex - prev === roundWalls - 1;

            if (isOutside) {
                prev = pathItem.dataset.pathIndex;
            }
            if (isOutside || rightSide) {
                pathItem.classList.add('disabled');
            }
            if (pathItem.className.indexOf('disabled') < 0) {
                var right = pathIndex + 1,
                    left = pathIndex - 1,
                    bottom = pathIndex + parseFloat(roundWalls),
                    top = pathIndex - parseFloat(roundWalls),
                    bottomRight = pathIndex + parseFloat(roundWalls) + 1,
                    bottomLeft = pathIndex + parseFloat(roundWalls) - 1,
                    topRight = pathIndex - parseFloat(roundWalls) + 1,
                    topLeft = pathIndex - parseFloat(roundWalls) - 1;

                /* Generate next choosable option */
                validPathOptions[pathIndex] = [pathIndex, right, left, bottom, top];
                /* Generate possible walls array for every block index */
                disableIfSelected[pathIndex] = {
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
                availablePathsArray.push(pathIndex);
                activePathArray[pathIndex] = true;
                /* Create standard option in labyrinthArray for choosable blocks */
                labyrinthArray.push({
                    active: true,
                    selected: false,
                    pathId: pathIndex,
                    option: 0
                });
            } else {
                activePathArray[pathIndex] = false;
                /* Create standard option in labyrinthArray for not choosable blocks */
                labyrinthArray.push({
                    active: false,
                    selected: false,
                    pathId: pathIndex,
                    option: 0
                });
            }
            if (options.vrView) {
                if (!AFRAME.components['selectblock']) {
                    AFRAME.registerComponent('selectblock', {
                        init: function () {
                            var index = this.el.dataset.pathIndex,
                                el = this.el;

                            this.el.addEventListener('click', function (evt) {
                                if (labyrinthArray[index].active && el.classList.contains('clickable')) {
                                    selectLabyrinthPath(evt, true);
                                }
                            });
                        }
                    });
                }
            } else {
                if (hover) {
                    pathItem.addEventListener('mouseover', function (event) {
                        if (labyrinthArray[pathIndex].active && startSelected) {
                            selectLabyrinthPath(event, false);
                        }
                    });
                }
                pathItem.addEventListener('click', function (event) {
                    if (event.type === 'click') {
                        if (labyrinthArray[pathIndex].active) {
                            selectLabyrinthPath(event, true);
                        }
                    }
                });
            }
        });
        document.getElementById('grid-settings').setAttribute('disabled', true);

        mapArray = [...Array(roundWalls).keys()].reduce((prev, curr) => {
            return [...prev,  pathArray.slice(roundWalls * curr, roundWalls * curr + roundWalls)];
        }, []);

        if (options.vrView && value) {
            mapArray.forEach(function (e, x) {
                mapArray.forEach(function (a, y) {
                    var planes = document.querySelectorAll('.grid-path'),
                        index = mapArray[x][y];
                        planes[index].setAttribute('scale', '0 0 0');
                        planes[index].setAttribute('animation', 'easing: easeOutElastic; from: 0 0 -' + index + '; to: 0.7 0.7 1; property: scale; dur: 3500; elasticity: 600; delay: ' + index + '0');
                        planes[index].setAttribute('rotate', '0 0 0');
                        planes[index].setAttribute('color', '#af71db');
                        if (labyrinthArray[index].active && countClick === 0) {
                            planes[index].classList.add('clickable');
                        }
                        if (planes[index].classList.contains('disabled')) {
                            planes[index].setAttribute('color', '#333333');
                        }
                        planes[index].setAttribute('position', `${x} ${y} -1`);
                });
            });
            var gridPath = document.querySelectorAll('.grid-path');
            Array.from(gridPath).forEach(function (e, i) {
                gridPath[i].setAttribute('selectblock', '');
            });
            vrInfo.setAttribute('value','Create your own labyrinth');
            vrInfo.setAttribute('animation','property: position; from: 0 2.7 -1.4; to: 0 -20 -1.4; easing: easeInQuart; delay: 3000; dur: 1500');
        }
        document.getElementById('render-grid').setAttribute('animation', `easing: easeOutElastic; from: -${Math.round(value / 2)} 0 -30; to: -${Math.round(value / 2)} 0 -25; property: position; dur: 1500;`);
        document.querySelector('[cursor]').setAttribute('cursor', `fuseTimeout: 300; fuse: true;`);
        document.getElementById('settings-place').classList.add('hidden');
        document.getElementById('creator-place').classList.remove('hidden');
    }
    if (options.vrView) {
        var gridValue = document.querySelectorAll('.get-grid-value');
        if (!AFRAME.components['rendergrid']) {
            AFRAME.registerComponent('rendergrid', {
                init: function () {
                    var selectedElement = this.el.object3D,
                        value = this.el.dataset.value;
                    this.el.addEventListener('click', function (evt) {
                        render2DPlane(value);
                        Array.from(gridValue).forEach(function (ele) {
                            ele.setAttribute('visible', false);
                            ele.setAttribute('position', '0 -20 5');
                        });
                    });
                }
            });
        }
        if (!AFRAME.components['startgame']) {
            AFRAME.registerComponent('startgame', {
                init: function () {
                    this.el.addEventListener('click', function () {
                        if (finishSet) {
                            setRestToDisabled();
                            convertBlocks();
                            document.getElementById('error-info-vr').setAttribute('visible', false);
                            document.getElementById('render-vr').setAttribute('visible', false);
                            renderLabyrinth();
                        } else {
                            document.getElementById('error-info-vr').setAttribute('visible', true);
                        }
                    });
                }
            });
        }
        document.getElementById('start-game').setAttribute('startgame', '');

        if (!AFRAME.components['togglecursor']) {
            AFRAME.registerComponent('togglecursor', {
                init: function () {
                    var cursor = document.querySelector('[cursor]'),
                        visible = true;
                    this.el.addEventListener('click', function (e) {
                        if (visible) {
                            cursor.setAttribute('visible', false);
                            visible = false;
                        } else {
                            cursor.setAttribute('visible', true);
                            visible = true;
                        }
                    });
                }
            });
        }
        document.getElementById('toggle-cursor').setAttribute('togglecursor', '');
        
        Array.from(gridValue).forEach(function (e, i) {
            gridValue[i].setAttribute('rendergrid', '');
        });
        preview3D.classList.remove('hidden');
    } else {
        /* open vr creator */
        document.getElementById('vr-creator').addEventListener('click', function () {
            var gridValue = document.querySelectorAll('.get-grid-value');
            option.vrView = true;
            document.getElementById('render-vr').setAttribute('visible', true);
            document.querySelector('a-scene').setAttribute('visible', true);
            document.getElementById('player').setAttribute('position', "0 2 0");
            Array.from(gridValue).forEach(function (ele) {
                ele.setAttribute('visible', true);
            });
            gridValue[0].setAttribute('position', "-0.3 2.3 -1.14");
            gridValue[1].setAttribute('position', "0 2.3 -1.14");
            gridValue[2].setAttribute('position', "0.3 2.3 -1.14");
            vrInfo.setAttribute('value','Chose your labyrinth grid');
            vrInfo.setAttribute('position','0 2.7 -1.4');
            vrInfo.removeAttribute('animation');
            document.getElementById('render-grid').removeAttribute('animation');
            document.getElementById('render-grid').removeAttribute('position', '0 0 -35');
            render2DPlane();
            document.querySelector('a-scene').enterVR();
        });
    }
}