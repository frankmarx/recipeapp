import React from "react";
import './Post.css';

class PostRecipeInstructions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			recipe: props.rec
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.rec !== this.props.rec) {
			this.setState({recipe: this.props.rec});
		}
	}

	render() {
		return (
			<div className="post_instructions">
				<h3>Instructions</h3>
				<ol>
					{this.state.recipe.instructions.map(ins => (
						<li key={ins.stepnum}>{ins.instructions}</li>
					))}
				</ol>
			</div>	
		);
	};
}

export default PostRecipeInstructions;