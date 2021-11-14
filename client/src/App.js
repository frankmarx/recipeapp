import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Post from './components/Post/Post.js';
import NavBar from './components/NavBar/NavBar.js';
import Profile from './components/Profile/Profile.js';
import AddRecipe from './components/AddRecipe/AddRecipe.js';
import SignInSignUp from './components/SignInSignUp/SignInSignUp.js';
import Search from './components/Search/Search.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navBarVis: true,
      user: null
    }
  }

  disableNavBar = () => {
    this.setState({navBarVis: false});
  }

  handleNewUser = (childData) => {
    this.setState({user: childData, navBarVis: true});
    console.log("changed state in app handlenewuser")
  }

  render() {
    return (
      <Router>
        {(this.state.navBarVis) && <NavBar user={this.state.user}/>}
        <Switch>
          <Route exact path="/post/:recID" render={props => (this.state.user) ? <Post {...props} user={this.state.user}/> : <Redirect to="/"/>}>
          </Route>
          <Route exact path="/new" render={props => (this.state.user) ? <AddRecipe {...props} user={this.state.user}/> : <Redirect to="/"/>}>
          </Route>
          <Route exact path="/profile/:username" render={props => (this.state.user) ? <Profile {...props} user={this.state.user}/> : <Redirect to="/"/>}>
          </Route>
          <Route exact path="/" render={props => <SignInSignUp {...props} onNewUser={this.handleNewUser} onLoad={this.disableNavBar}/>}>
          </Route>
          <Route exact path="/search" render={props => (this.state.user) ? <Search /> : <Redirect to="/"/>}>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
