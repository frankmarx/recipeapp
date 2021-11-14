import React from "react";
import './Post.css';
import { Link } from 'react-router-dom';

class PostHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			authorPic: props.pic,
			author: props.auth,
			recipe: props.rec
		}
	}

	getTimeDif(timePast) {
		console.log(timePast);
		const currTime = new Date().getTime();
		console.log(currTime);
		const dif = currTime - timePast;
		let timeMinutes = Math.floor(dif / 60000);
		if (timeMinutes > 59)
		{
			let timeHours = Math.floor(timeMinutes / 60) + " hours ago"
			return timeHours;
		}
		timeMinutes += " minutes ago";
		return timeMinutes;
	}

	componentDidUpdate(prevProps) {
		if (prevProps.auth !== this.props.auth) {
			this.setState({authorPic: this.props.pic, author: this.props.auth, recipe: this.props.rec});
		}
	}
	render() {
		return (
			<div className="post_header">
				<img className="post_authorPic" src={this.state.authorPic}></img>
				<div className="post_authorName">
					<Link id="link" to={`/profile/${this.state.author.username}`}>
						{this.state.author.displayname}
					</Link>
				</div>
				<div className="timeAgo">
					{this.getTimeDif(this.state.recipe.timePosted)}
				</div>
			</div>
		);
	};
}

export default PostHeader;