import React                from 'react';
import * as _               from 'lodash';
import * as actionTypes     from '../../store/actions';
import {connect}            from 'react-redux';
import {getRandomId}        from '../../common/widgets';
import {saveFinalMap} from '../../common/render.functions';

function StartGame(props) {
    return (
        <button onClick={() => saveFinalMap(props.changeSetting)}>START GAME</button>
    )
};

const mapDispatchToProps = dispatch => {
    return {
        changeSetting: (setting, value) => dispatch({type: actionTypes.CHANGE_DEFAULT_SETTING, setting, value})
    }
};

export default connect(null, mapDispatchToProps)(StartGame);