import React from "react";
import './Profile.css';
import Blank from './blankProfPic.png';

import FollowButton from "./FollowButton";

class ProfileInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser: props.currUsr,
			userInfo: props.usr,
			profilePhoto: props.pic
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.usr !== this.props.usr) {
			this.setState({userInfo: this.props.usr, profilePhoto: this.props.pic, currentUser: this.props.currUsr }, () => console.log(this.state.userInfo));
		}
	}

	callBack = () => {
		this.props.reRender();
	}

	render() {
		return (
				<div className="profile_infoContainer">
					<div className="profile_idinfoContainer">
						<div className="profile_imageContainer">
							{(this.state.profilePhoto) ? <img src={this.state.profilePhoto.objUrl}></img> : <img src={Blank}></img>}
						</div>
						<div className="profile_namesContainer">
							<h2>{this.state.userInfo.displayname}</h2>
							<h3>{this.state.userInfo.username}</h3>
						</div>
					</div>
					<div className="analAndFollow">
						<div className="profile_analyticsContainer">
							<div className="profile_analyticsButton">
								<p>{this.state.userInfo.followingcount ? this.state.userInfo.followingcount : 0}</p>
								<h4>following</h4>
							</div>
							<div className="profile_analyticsButton">
								<p>{this.state.userInfo.followercount ? this.state.userInfo.followercount : 0}</p>
								<h4>followers</h4>
							</div>
							<div className="profile_analyticsButton">
								<p>{this.state.userInfo.recipecount}</p>
								<h4>recipes</h4>
							</div>
						</div>
						<div className="followButtonCont">
							<FollowButton currUsr={this.state.currentUser} usr={this.state.userInfo} reRender={this.callBack}/>
						</div>
					</div>
				</div>
		);
	};
}

export default ProfileInfo;