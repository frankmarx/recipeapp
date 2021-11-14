import React from "react";
import '../Post/Post.css';

class AddRecipeHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			author: props.auth,
			profilePhoto: null
		}
	}


	async componentDidMount() {
		const authorUrl = "http://localhost:5000/api/profiles/usr/" + this.state.author;
		const resAuthor = await fetch(authorUrl);
		const dataAuthor = await resAuthor.json();

		const profilePhotoUrl = "http://localhost:5000/api/aws/s3Url/" + dataAuthor.photoname;
		const profilePhotoRes = await fetch(profilePhotoUrl);
		const dataProfilePhoto = await profilePhotoRes.json();

		this.setState({ author: dataAuthor, profilePhoto: dataProfilePhoto.objUrl });
	}

	render() {
		return (
			<div className="post_header">
				<img className="post_authorPic" src={this.state.profilePhoto}></img>
				<div className="post_authorName">
					{this.state.author.displayname}
				</div>
			</div>
		);
	};
}

export default AddRecipeHeader;