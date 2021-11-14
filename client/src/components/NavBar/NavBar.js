import React from "react";
import { BrowserRouter as Router, Link } from 'react-router-dom';
import './NavBar.css';

import searchIcon from './SearchIconCircle.png';
import plusIcon from './PlusIconCirle.png';
import profileIcon from './ProfileIconCircle.png';
import homeIcon from './HomeIconCircle.png';


class NavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currUser: this.props.user
		}
	}

	render() {
		return (
				<div className="navbar_container">
					<Link to="/post/1">
						<button className="navbar_button" id="home">
							<img src={homeIcon}></img>
						</button>
					</Link>
					<Link to="/search">
						<button className="navbar_button" id="search">
							<img src={searchIcon}></img>
						</button>
					</Link>
					<Link to="/new/">
						<button className="navbar_button" id="add">
							<img src={plusIcon}></img>
						</button>
					</Link>
					<Link to={`/profile/${this.state.currUser}`}>
						<button className="navbar_button" id="profile">
							<img src={profileIcon}></img>
						</button>
					</Link>
				</div>
		);
	};
}

export default NavBar;