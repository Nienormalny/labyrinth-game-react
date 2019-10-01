import React, { Component, useState } from 'react';
import { compose } from 'recompose';
import { withFirebase } from '../firebase/index.component';
import {connect} from 'react-redux';
import {selectRenderedPath} from "../../common/render.functions";
import * as actionTypes from "../../store/actions";

const SignInPage = () => (
    <div className="ui container center two column centered grid">
        <div className="sixteen wide mobile eight wide tablet four wide computer column">
            {/*<h1 className="ui olive image header">*/}
            {/*    <div className="content">*/}
            {/*        Log-in to your account*/}
            {/*    </div>*/}
            {/*</h1>*/}
            {/*<SignInForm />*/}
            <SignInGoogle />
            <SignInFacebook />
            <SignInTwitter />
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
    const onSubmit = event => {
        props.firebase
            .doSignInWithGoogle()
            .then(socialAuthUser => {
                console.log(socialAuthUser);
                props.updateUser(socialAuthUser.additionalUserInfo.profile.email, socialAuthUser.additionalUserInfo.profile.name);
                setError(null);
            })
            .catch(error => {
                setError(error);
            });
        event.preventDefault();
    };
    return (
        <form onSubmit={onSubmit}>
            <button type="submit">Sign In with Google</button>
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
        defaultSettings: state.defaultSettings,
        authUser: state.authUser
    }
};

const mapDispatchToProps = dispatch => {
    return {
        updateUser: (email, name) => dispatch({type: actionTypes.UPDATE_USER, email, name})
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignInGoogle);