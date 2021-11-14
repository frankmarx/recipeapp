import React from "react";
import { Link } from 'react-router-dom';
import './Search.css';
import Blank from '../Profile/blankProfPic.png'

class SearchProf extends React.Component {
	constructor(props) {
		super(props);
		console.log(props.acc);
		this.state = {
			prof: this.props.acc,
			profPic: this.props.pic,
			name: '',
			username: '',
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.prof !== this.props.prof) {
			this.setState({prof: this.props.acc, profPic: this.props.pic });
		}
	}

	render() {
		return (
			<Link id="link" to={`/profile/${this.state.prof.username}`}>
			<div className="searchProf_container">	
				<div className="names">
					
						<h3>{this.state.prof.displayname}</h3>
					
					<h4>{this.state.prof.username}</h4>
				</div>
				{(this.state.profPic) ? <img className="searchProfImage" src={this.state.profPic.objUrl}></img> : <img className="searchProfImage" src={Blank}></img>}
			</div>
			</Link>
		);
	};
}

export default SearchProf;