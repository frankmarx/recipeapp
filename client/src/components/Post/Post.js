import React from "react";
import './Post.css';

import PostRecipeComponent from "./PostRecipeComponent";
import PostSummary from "./PostSummary";
import PostRecipeInstructions from "./PostRecipeInstructions";
import PostHeader from "./PostHeader";

class Post extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			user: props.user,
			authorPic: null,
			recipeID: props.match.params.recID,
			mainPhoto: null,
			compPhotos: [],
			recipe: {
				recipeID: '',
				recipeName: '',
				authorID: '',
				mainPhotoName: '',
				public: '',
				timeToCook: '',
				yield: '',
				instructions: [],
				components: []
			},
			author: {
				displayname: '',
				photourl: ''
			}
		}
	}

	async componentDidMount() {
		// Get recipe Info
		const recipeUrl = "http://localhost:5000/api/recipes/" + this.state.recipeID;
		const resRecipe = await fetch(recipeUrl);
		const dataRecipe = await resRecipe.json();

		// Get Author Info
		const authorUrl = "http://localhost:5000/api/profiles/" + dataRecipe.authorID;
		const resAuthor = await fetch(authorUrl);
		const dataAuthor = await resAuthor.json();
		console.log(dataAuthor);

		// Get Author Pic
		console.log(dataAuthor.photoname);
		const profilePhotoUrl = "http://localhost:5000/api/aws/s3Url/" + dataAuthor.photoname;
		const profilePhotoRes = await fetch(profilePhotoUrl);
		const dataProfilePhoto = await profilePhotoRes.json();

		// Get Main Photo
		const s3Url = "http://localhost:5000/api/aws/s3Url/" + dataRecipe.mainPhotoName;
		const urlRes = await fetch(s3Url);
		const dataUrl = await urlRes.json();

		// Get Comp Photos
		let tempCompPhotoArr = [];
		for (let comp of dataRecipe.components) {
			const compS3Url = "http://localhost:5000/api/aws/s3Url/" + comp.compPhotoName;
			const compUrlRes = await fetch(compS3Url);
			const dataCompUrl = await compUrlRes.json();
			tempCompPhotoArr.push(dataCompUrl.objUrl);
		}

		this.setState({ authorPic: dataProfilePhoto.objUrl, mainPhoto: dataUrl.objUrl, compPhotos: tempCompPhotoArr, recipe: dataRecipe, author: dataAuthor });
	}
	
	render() {
		return (
				<div className="post_container">
					<PostHeader auth={this.state.author} pic={this.state.authorPic} rec={this.state.recipe}/>
					<div className="post_recipe">
						<PostSummary rec={this.state.recipe} pic={this.state.mainPhoto}/>
						<PostRecipeInstructions rec={this.state.recipe}/>
						{this.state.recipe.components.map((component, index) => (
							<PostRecipeComponent key={component.name} comp={component} pic={this.state.compPhotos[index]}/>))}
					</div>
				</div>
		);
	};
}

export default Post;