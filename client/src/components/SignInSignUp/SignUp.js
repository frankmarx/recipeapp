import React from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import { Redirect } from "react-router-dom";
import * as Yup from 'yup';
import './SignInSignUp.css';


class SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			submitted: false,
			username: '',
		}
	}

	onChangeToSignIn = () => {
		this.props.onVisible();
	}

	render() {
		return (
			<div>
				{(this.state.submitted) ? <Redirect to={`/profile/${this.state.username}`} /> :
				<Formik 
					initialValues={{ 
						firstName: '',
						lastName: '',
						email: '',
						username: '',
						password: ''
						}}
						validationSchema={Yup.object().shape({
							firstName: Yup.string()
									.required('First Name is required.'),
							lastName: Yup.string()
									.required('Last Name is required.'),
							username: Yup.string()
									.required('Username is required.')
									.test('usernameTaken', 'Username is taken.',
									async function(value) {
										const authorUrl = "http://localhost:5000/api/profiles/usr/" + value;
										const resAuthor = await fetch(authorUrl);
										const dataAuthor = await resAuthor.json();
										// If user doesn't exist, re-render with username error message
										if (dataAuthor.usernameWrong) {
											return true;
										}
										return false;
									}),
							email: Yup.string()
									.required('Email Address is required.'),
							password: Yup.string()
									.required('Password is required.')
					})}
					onSubmit={ async (data, { setSubmitting, resetForm }) =>  {
						// Set submitting disables submit button after first click
						setSubmitting(true);

						// Set up new user object
						console.log(data);
						// Send to database
						const dbUrl = "http://localhost:5000/api/profiles/new";
						const dataBaseResponse = await fetch(dbUrl, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(data)
						});
						const dbResData = await dataBaseResponse.json();
						console.log("db stuff done" + dbResData);
						this.props.onComplete(data.username);
						this.setState({ username: data.username, submitted: true });
						setSubmitting(false);
				}}>
					{({ values, isSubmitting, errors, touched }) => (
					<Form className="signUpForm">
						<h2>Sign Up</h2>
						{errors.firstName && touched.firstName ? (
             <div className="formError">{errors.firstName}</div>
           	) : null}
						<Field className="infoInput" name="firstName" type="input" placeholder="First Name"/>
						{errors.lastName && touched.lastName ? (
             <div className="formError">{errors.lastName}</div>
           	) : null}
						<Field className="infoInput" name="lastName" type="input" placeholder="Last Name"/>
						{errors.email && touched.email ? (
             <div className="formError">{errors.email}</div>
           	) : null}
						<Field className="infoInput" name="email" type="input" placeholder="Email Address"/>
						{errors.username && touched.username ? (
             <div className="formError">{errors.username}</div>
           	) : null}
						<Field className="infoInput" name="username" type="input" placeholder="Username"/>
						{errors.password && touched.password ? (
             <div className="formError">{errors.password}</div>
           	) : null}
						<Field className="infoInput" name="password" type="input" placeholder="Password"/>
						<button className="submitButton" disabled={isSubmitting} type="submit">Sign Up</button>
						<div className="switchViews">
							<p>Already have an account?  </p>
							<p id="clickableP" onClick={this.onChangeToSignIn}>Sign In.</p>
						</div>
					</Form>	
				)}</Formik>}
			</div>
		);
	};
}

export default SignUp;