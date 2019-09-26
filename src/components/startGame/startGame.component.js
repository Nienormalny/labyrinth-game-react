import React from 'react';
import * as actionTypes from '../../store/actions';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {saveFinalMap} from '../../common/render.functions';

function StartGame(props) {
    const buttonClasses = classNames({
        'start': true,
        'disabled': !props.defaultSettings.validCreatorName,
        'button': true
    });
    return (
        <button onClick={() => props.defaultSettings.validCreatorName ? saveFinalMap(props.changeSetting) : alertCreatorName()}
                className={buttonClasses}>START GAME</button>
    )
}

const alertCreatorName = () => {
  alert('Please write your name as creator or log in')
};

const mapStateToProps = state => {
    return {
        defaultSettings: state.defaultSettings
    }
};
const mapDispatchToProps = dispatch => {
  return {
    changeSetting: (setting, value) =>
      dispatch({ type: actionTypes.CHANGE_DEFAULT_SETTING, setting, value })
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StartGame)
