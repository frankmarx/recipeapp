import React from "react";
import './SignInSignUp.css';
import Logo from './RecipeAppLogo.png'

import SignIn from './SignIn';
import SignUp from './SignUp';



class SignInSignUp extends React.Component {
	constructor(props) {
		super(props);
		props.onLoad();
		this.state = {
			signUpVisible: false,
			submitted: false,
			username: ''
		}
	}

	handleCompleteForm = (childData) => {
		console.log("in sisu handlecompletform" + childData);
		this.props.onNewUser(childData);
	}


	render() {
		return (
				<div className="signInSignUpContainer">
					<div className="nameLogo">
						<h1>Recipe App</h1>
						<img src={Logo}></img>
					</div>
					{(this.state.signUpVisible) ? (<SignUp onComplete={this.handleCompleteForm} onVisible={() => this.setState({ signUpVisible: false })}/>) : (<SignIn onComplete={this.handleCompleteForm} onVisible={() => this.setState({ signUpVisible: true })}/>)}
				</div>
		);
	};
}

export default SignInSignUp;