import React from "react";
import { Formik, Field, Form } from "formik";
import { Redirect } from "react-router-dom";
import * as Yup from 'yup';
import './SignInSignUp.css';


class SignIn extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			wrongUsername: false,
			wrongPassword: false,
			submitted: false,
			username: ''
		}
	}

	onChangeToSignUp = () => {
		this.props.onVisible();
	}

	render() {
		return (
			<div>
				{(this.state.submitted) ? <Redirect to={`/profile/${this.state.username}`} /> :
				<Formik 
					initialValues={{
						username: '',
						password: ''
						}}
					validationSchema={Yup.object().shape({
						username: Yup.string()
								.required('Username is required.'),
						password: Yup.string()
								.required('Password is required.')
					})}
					onSubmit={ async (data, { setSubmitting, resetForm }) =>  {
						// Set submitting disables submit button after first click
						setSubmitting(true);
						
						// Get Author Info
						const authorUrl = "http://localhost:5000/api/profiles/usr/" + data.username;
						const resAuthor = await fetch(authorUrl);
						const dataAuthor = await resAuthor.json();

						// If user doesn't exist, re-render with username error message
						if (dataAuthor.usernameWrong) {
							this.setState({wrongUsername: true});
							resetForm();
							return;
						}

						// If username exists check if password is correct
						if (data.password !== dataAuthor.password) {
							this.setState({wrongPassword: true});
							data.password = '';
							return;
						}
						
						// If correct, set state, give info to parent, and end form		
						this.props.onComplete(data.username);
						setSubmitting(false);
						this.setState({ username: data.username, submitted: true });

				}}>
					{({ values, isSubmitting, errors, touched }) => (
					
					<Form className="signInForm">
						<h2>Sign In</h2>
						{(this.state.wrongUsername && touched.username) && <h3 className="formError">Username does not exist.</h3>}
						{errors.username && touched.username ? (
             <div className="formError">{errors.username}</div>
           	) : null}
						<Field className="infoInput" name="username" type="input" placeholder="Username"/>
						{(this.state.wrongPassword && touched.password) && <h3 className="formError">Incorrect Password</h3>}
						{errors.password && touched.password ? (
             <div className="formError">{errors.password}</div>
           	) : null}
						<Field className="infoInput" name="password" type="password" placeholder="Password"/>
						<button className="submitButton" disabled={isSubmitting} type="submit">Sign In</button>
						<div className="switchViews">
							<p>Don't have an account?  </p>
							<p id="clickableP" onClick={this.onChangeToSignUp}> Sign Up.</p>
						</div>
					</Form>	
				)}</Formik>}
			</div>
		);
	};
}

export default SignIn;