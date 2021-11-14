import React from "react";
import { Link } from 'react-router-dom';
import './Profile.css';

class ProfileRecipeList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			account: props.usr,
			recipePhotos: props.pics,
			recipeList: props.recList
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.recList !== this.props.recList) {
			this.setState({recipeList: this.props.recList, recipePhotos: this.props.pics, account: this.props.usr});
		}
	}

	render() {
		return (
			<div className="profile_recipeListCont">
				{(this.state.recipeList.length > 0) ? this.state.recipeList.map((rec, index) => (
						<div className="profile_recipePreview" key={rec.recipeID}>	
							<div className="profile_recipePreviewInfo">
								<Link id="link" to={`/post/${rec.recipeID}`}>
									<h3>{rec.recipeName}</h3>
								</Link>
								<h4>Takes {rec.timeToCook}</h4>
								<h4>Makes {rec.yield}</h4>
							</div>
							<img className="profile_recipePreviewImage" src={this.state.recipePhotos[index]}></img>
						</div>
				)) : <div className="noRecipes">{`${this.state.account.displayname} hasn't posted any recipes yet.`}</div>}
			</div>
			);		
	};
}

export default ProfileRecipeList;