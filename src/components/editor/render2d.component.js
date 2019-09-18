import React from 'react';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';

function Render2D(props) {
    console.log(props);
    let {selectedCol} = props.defaultSettings;
    const roundWalls = selectedCol + 2;
    const sumOfPaths = roundWalls * roundWalls;
    const placeWidth = roundWalls * (25 + 2);
    const items = [];
    for (let gridNumber = 0; gridNumber < sumOfPaths; gridNumber++) {
        items.push(<div className="path" data-path-index={gridNumber} key={gridNumber}/>);
    }
    return (
        <div id="render2D">
            <div id="creator-place" style={{width: placeWidth}}>
                {items}
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