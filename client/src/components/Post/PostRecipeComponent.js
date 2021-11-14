import React from "react";
import './Post.css';

class PostRecipeComponent extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			component: props.comp,
			photo: props.pic
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.comp !== this.props.comp) {
			this.setState({component: this.props.comp});
		}
	}

	render() {
		return (
				<div className="post_components">
					<div className="post_componentName">
						<h3>{this.state.component.name}</h3>
					</div>
					<div className="post_componentImage">
						<img src={this.state.photo}></img>
					</div>
					<div className="post_componentIngredients">
						<h4>Ingredients</h4>
						<ul>
							{this.state.component.ingreds.map(ingred => (
								<li key={ingred.ingredient}>{ingred.amount} {ingred.ingredient}</li>
							))}
						</ul>
					</div>
					<div className="post_componentInstructions">
						<h4>Instructions</h4>
						<ol>
							{this.state.component.instructs.map(instruct => (
								<li key={instruct.stepnum}>{instruct.instructions}</li>
							))}
						</ol>
					</div>
				</div>

		);
	};
}

export default PostRecipeComponent;