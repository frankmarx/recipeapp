import React from "react";
import './Profile.css';


class FollowButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser: props.currUsr,
			userInfo: props.usr,
			following: false,
			disabled: false
		}
	}

	getFollowing = async (currentUser, userInfo) => {
		console.log("inGetfollowing");
		const currUserDBUrl = "http://localhost:5000/api/profiles/usr/" + currentUser;
		const currUserRes = await fetch(currUserDBUrl);
		const currUserData = await currUserRes.json();
		const followBody = {
			follower: currUserData.accountid,
			followee: userInfo.accountid
		}
		if (followBody.followee == followBody.follower) {
			this.setState({disabled: true})
		}

		const followingUrl = "http://localhost:5000/api/profiles/following/" + followBody.follower + "/" + followBody.followee;
		const followingBody = await fetch(followingUrl);
		const followingData = await followingBody.json();
		return followingData.following;
		
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.usr !== this.props.usr) {
			this.setState({userInfo: this.props.usr, currentUser: this.props.currUsr, following: await this.getFollowing(this.props.currUsr, this.props.usr)}, () => console.log(this.state.following));
		}
	}

	render() {
		return (!this.state.disabled && (
			(!this.state.following) ? 
			<button className="followButton" onClick={async () => {
				const currUserDBUrl = "http://localhost:5000/api/profiles/usr/" + this.state.currentUser;
				const currUserRes = await fetch(currUserDBUrl);
				const currUserData = await currUserRes.json();
				const followBody = {
					follower: currUserData.accountid,
					followee: this.state.userInfo.accountid
				}

				// Send to database
				const dbUrl = "http://localhost:5000/api/profiles/follow";
				const dataBaseResponse = await fetch(dbUrl, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(followBody)
				});
				const dbData = await dataBaseResponse.json();
				this.props.reRender();
				this.setState({following: true});
			
			}}>
				Follow
			</button> : 
			<button className="unfollowButton" onClick={async () => {
				const currUserDBUrl = "http://localhost:5000/api/profiles/usr/" + this.state.currentUser;
				const currUserRes = await fetch(currUserDBUrl);
				const currUserData = await currUserRes.json();
				const followBody = {
					follower: currUserData.accountid,
					followee: this.state.userInfo.accountid
				}

				// delete from database to database
				const dbUrl = "http://localhost:5000/api/profiles/unfollow/" + followBody.follower + "/" + followBody.followee;

				const dataBaseResponse = await fetch(dbUrl, {
					method: 'DELETE',
				})
				const dbData = await dataBaseResponse.json();
				this.props.reRender();
				this.setState({following: false});
			}}>
				Unfollow
			</button>
		) );
	};
}

export default FollowButton;