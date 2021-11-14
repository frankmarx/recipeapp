import React from "react";
import { Formik, Field, Form } from "formik";
import SearchProf from "./SearchProf";
import './Search.css';

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchedProf: null,
			profPic: null,
			noResults: false,
		}
	}


	render() {
		return (
			<div className="search_container">
				<h2 className="searchTitle">Find a profile</h2>
				<Formik 
					initialValues={{
						search: ''
						}}
					onSubmit={ async (data, { setSubmitting, resetForm }) =>  {
						// Set submitting disables submit button after first click
						setSubmitting(true);
						console.log(data.search);
						
						// Get Author Info
						const authorUrl = "http://localhost:5000/api/profiles/usr/" + data.search;
						const resAuthor = await fetch(authorUrl);
						const dataAuthor = await resAuthor.json();

						// If user doesn't exist, re-render with no results message
						if (dataAuthor.usernameWrong) {
							this.setState({noResults: true});
							return;
						}
						console.log(dataAuthor)
						let dataProfilePhoto = null;
						if(dataAuthor.photoname !== null)
						{
							const profilePhotoUrl = "http://localhost:5000/api/aws/s3Url/" + dataAuthor.photoname;
							const profilePhotoRes = await fetch(profilePhotoUrl);
							dataProfilePhoto = await profilePhotoRes.json();
						}
						console.log(dataProfilePhoto);
						this.setState({searchedProf: dataAuthor, profPic: dataProfilePhoto});

						setSubmitting(false);
				}}>
					{({ values, isSubmitting, errors, touched }) => (
						<Form className="searchForm">
							<Field className="searchInput" name="search" type="input" placeholder="Search by username"/>
							<button className="searchButton" disabled={isSubmitting} type="submit">Search</button>
							{this.state.noResults && <h3 className="notFound">User not found.</h3>}
						</Form>	
				)}</Formik>
				{this.state.searchedProf && <SearchProf acc={this.state.searchedProf} pic={this.state.profPic}/>}
			</div>
		);
	};
}

export default Search;