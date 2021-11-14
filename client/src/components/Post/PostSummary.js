import React from "react";
import './Post.css';

class PostSummary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			recipe: props.rec,
			mainPhoto: props.pic
		}
	}


	componentDidUpdate(prevProps) {
		if (prevProps.rec !== this.props.rec) {
			this.setState({recipe: this.props.rec, mainPhoto: this.props.pic});
		}
	}

	render() {
		return (
				<div className="post_summary">
					<div className="post_title">
						{this.state.recipe.recipeName}
					</div>
					<div className="post_info">
						<h2>{this.state.recipe.timeToCook}</h2>
						<h2>Yield: {this.state.recipe.yield}</h2>
					</div>
					<div className="post_image">
						<img src={this.state.mainPhoto}></img>
					</div>
				</div>
		); 
	}
}

export default PostSummary;