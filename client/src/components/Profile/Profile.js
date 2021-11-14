import React from "react";
import './Profile.css';

import ProfileInfo from "./ProfileInfo";
import ProfileRecipeList from "./ProfileRecipeList";

class Profile extends React.Component {
	constructor(props) {
		console.log("in prof constructor.  Current user: " + props.user)
		super(props);
		this.state = {
			currUser: props.user,
			profilePhoto: '',
			recipeListPhotos: [],
			followToggle: true,
			username: this.props.match.params.username,
			userInfo: {},
			recipeList: [{
				recipeID: '',
				recipeName: '',
				authorID: '',
				mainPhotoName: '',
				public: '',
				timeToCook: '',
				yield: '',
				instructions: [],
				components: []
			}]
		}
	}

	callBack = () => {
		this.componentDidMount();
	}

	async componentDidMount() {
		// Get Profile info
		const profileUrl = "http://localhost:5000/api/profiles/usr/" + this.state.username;
		const resProfileInfo = await fetch(profileUrl);
		const dataProfileInfo = await resProfileInfo.json();

		// Get recipe List
		const recListUrl = "http://localhost:5000/api/profiles/usr/" + this.state.username + "/recipeList";
		const resRecList = await fetch(recListUrl);
		const dataRecList = await resRecList.json()
		
		// Get Get URL for profilephoto
		let dataProfilePhoto = null;
		if(dataProfileInfo.photoname !== null)
		{
			const profilePhotoUrl = "http://localhost:5000/api/aws/s3Url/" + dataProfileInfo.photoname;
			const profilePhotoRes = await fetch(profilePhotoUrl);
			dataProfilePhoto = await profilePhotoRes.json();
		}
		

		let tempRecPhotos = []
		for (let rec of dataRecList) {
			const recPhotoUrl = "http://localhost:5000/api/aws/s3Url/" + rec.mainPhotoName;
			const recPhotoRes = await fetch(recPhotoUrl);
			const dataRecPhoto = await recPhotoRes.json();
			tempRecPhotos.push(dataRecPhoto.objUrl);
		}

		this.setState({recipeListPhotos: tempRecPhotos, userInfo: dataProfileInfo, recipeList: dataRecList, profilePhoto: dataProfilePhoto}, () => console.log(this.state.userInfo));
	}

	render() {
		return (
				<div className="profile_container">
					<ProfileInfo usr={this.state.userInfo} pic={this.state.profilePhoto} currUsr={this.state.currUser} reRender={this.callBack}/>
					<h2 id="profile_recipesTitle">Recipes</h2>
					<ProfileRecipeList recList={this.state.recipeList} pics={this.state.recipeListPhotos} usr={this.state.userInfo}/>
				</div>
		);
	};
}

export default Profile;