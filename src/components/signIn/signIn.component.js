import React, { Component, useState } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../firebase/index.component';
import {connect} from 'react-redux';
import {selectRenderedPath} from "../../common/render.functions";
import * as actionTypes from "../../store/actions";
import googleSingInImage from '../../assets/socialImages/btn_google_signin_dark_normal_web@2x.png';
import {createUser, fetchUserById} from '../firebase/firebase.functions';
import * as firebase from 'firebase';

const SignInPage = (props) => (
    <div className="ui container center two column centered grid">
        <div className="sixteen wide mobile eight wide tablet four wide computer column">
            {/*<h1 className="ui olive image header">*/}
            {/*    <div className="content">*/}
            {/*        Log-in to your account*/}
            {/*    </div>*/}
            {/*</h1>*/}
            {/*<SignInForm />*/}
            <SignInGoogle {...props}/>
            {/*<SignInFacebook />
            <SignInTwitter />*/}
        </div>
    </div>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

class SignInFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, password, error } = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <form onSubmit={this.onSubmit} className="ui large form">
                <div className="ui stacked segment">
                    <div className="field">
                        <div className="ui left icon input">
                            <i className="user icon"></i>
                            <input
                                name="email"
                                value={email}
                                onChange={this.onChange}
                                type="text"
                                placeholder="Email Address"
                            />
                        </div>
                    </div>
                    <div className="field">
                        <div className="ui left icon input">
                            <i className="lock icon"></i>
                            <input
                                name="password"
                                value={password}
                                onChange={this.onChange}
                                type="password"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    <button disabled={isInvalid} type="submit" className="ui fluid large olive submit button">
                        Login
                    </button>
                </div>

                {error && <div className="ui error message">{error.message}</div>}
            </form>
        );
    }
}

const SignInGoogleBase = (props) => {
    const [error, setError] = useState('');
    console.log(props);
    const onSubmit = event => {
        props.firebase
            .doSignInWithGoogle()
            .then(socialAuthUser => {
                const userRef = fetchUserById(socialAuthUser.user.uid);

                userRef.on('value', (snapshot) => {
                    const userData = snapshot.val();
                    if (userData && userData.id === socialAuthUser.user.uid) {
                        return props.changeSetting('online', !props.defaultSettings.online);
                    }
                    return createUser(socialAuthUser.user.uid, socialAuthUser.additionalUserInfo.profile.email, socialAuthUser.additionalUserInfo.profile.name);
                });
                setError(null);
            })
            .catch(error => {
                setError(error);
            });
        event.preventDefault();
    };
    return (
        <form onSubmit={onSubmit}>
            <button type="submit" className="signInButton"><img src={googleSingInImage}/></button>
            {error && <p>{error.message}</p>}
        </form>
    );
};

class SignInFacebookBase extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    onSubmit = event => {
        this.props.firebase
            .doSignInWithFacebook()
            .then(socialAuthUser => {
                console.log(socialAuthUser);
                this.setState({ error: null });
            })
            .catch(error => {
                this.setState({ error });
            });
        event.preventDefault();
    };
    render() {
        const { error } = this.state;
        return (
            <form onSubmit={this.onSubmit}>
                <button type="submit">Sign In with Facebook</button>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

class SignInTwitterBase extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    onSubmit = event => {
        this.props.firebase
            .doSignInWithTwitter()
            .then(socialAuthUser => {
                this.setState({ error: null });
            })
            .catch(error => {
                this.setState({ error });
            });
        event.preventDefault();
    };
    render() {
        const { error } = this.state;
        return (
            <form onSubmit={this.onSubmit}>
                <button type="submit">Sign In with Twitter</button>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignInForm = compose(
    withFirebase,
)(SignInFormBase);

const SignInGoogle = compose(
    withFirebase,
)(SignInGoogleBase);

const SignInFacebook = compose(
    withFirebase,
)(SignInFacebookBase);

const SignInTwitter = compose(
    withFirebase,
)(SignInTwitterBase);


const mapStateToProps = state => {
    return {
        defaultSettings: state.defaultSettings
    }
};

const mapDispatchToProps = dispatch => {
    return {
        changeSetting: (setting, value) => dispatch({type: actionTypes.CHANGE_DEFAULT_SETTING, setting, value}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInPage);