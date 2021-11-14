import React from "react";
import './AddRecipe.css';


class AddRecipeSubmitting extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: props.open,
			place: props.place
		}
	}


	componentDidUpdate(prevProps) {
		if (prevProps.open !== this.props.open) {
			this.setState({open: this.props.open});
		}
	}


	render() {
		return (this.state.open) ? (
			<div className="submittingContainer">
				<div id="loader"></div>
				<h2 id="loaderDescription">Uploading content to {this.props.place} ...</h2>
			</div>
		) : null;
	};
}

export default AddRecipeSubmitting;