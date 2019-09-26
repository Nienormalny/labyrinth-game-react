import React, {useEffect, useState}     from 'react';
import * as actionTypes                 from '../../store/actions';
import * as _                           from 'lodash';
import {connect}                        from 'react-redux';
import {getRandomId}                    from '../../common/widgets';

function HiScore(props) {
    const {time, loadMap, actualMapId} = props.defaultSettings;
    const [errorMsg, setErrorMsg] = useState('');
    const [name, setName] = useState('');
    const [saveMapEnabled, setMap] = useState(false);
    useEffect(() => {
        if (saveMapEnabled && name !== '') {
            time.owner = {
                id: getRandomId(),
                name,
                bestTime: time.stringTime,
                date: new Date().getDateString(),
            };
            props.changeSetting('time', time);
            _.map(loadMap, map => {
                if (map.id === actualMapId) {
                    map.time = time;
                }
                return map;
            });
            props.changeSetting('loadMap', loadMap);
            localStorage.setItem('maps', JSON.stringify(loadMap));
            props.changeSetting();
        }
    }, [saveMapEnabled, time]);
    function saveMap(e) {
        setMap(true);
    }
    function setOwner(event) {
        const name = event.target.value;
        if (new RegExp(/(?!.*[\.\-\_]{2,})^[a-zA-Z0-9\.\-\_]{3,24}$/,"gm").test(name) && name !== '') {
            setName(name);
            setErrorMsg('');
        } else {
            setErrorMsg('Please write correct name.');
        }
    }
    return (
        <div id="high-score-owner">
            <h1> Congratulations!</h1>
            <div className="best-score">
                <h2>Your best time:</h2>
                <h3>{time.stringTime}</h3>
            </div>
            <form>
                <label>Your Name</label>
                <input id="owner-name" name="owner-name" placeholder="Write your name" onChange={(e) => setOwner(e)}/>
                {errorMsg !== '' && <div className="error-msg"><p>{errorMsg}</p></div>}
                {!_.isEmpty(name) && <button id="save-owner" onClick={(e) => saveMap(e)}>Accept</button>}
            </form>
        </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(HiScore);
