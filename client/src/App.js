import React,{Component} from 'react';
import {BrowserRouter,Route,Switch,useParams} from 'react-router-dom';
import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'
import { setCurrentUser,logoutUser} from './actions/authActions';

import PrivateRoute from './components/privateroute/PrivateRoute'
import Dashboard from './components/dashboard/Dashboard'
import './App.css';

import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import {Provider} from 'react-redux';
import store from './store';
import Reset from './components/auth/Reset';
import Newpassword from './components/auth/NewPassword';

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
// Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component{
  render(){
  return (
    <Provider store = {store}>
    <BrowserRouter>
    <div>
      
      <Route exact path='/' component={Landing}/>
      <Route exact path='/register' component={Register}/>
      <Route exact path='/login' component={Login}/>
      <Route exact path='/reset'><Reset/></Route>
      <Route  path='/reset/:token' component={Newpassword}/>
      <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
    </div>
    </BrowserRouter>
    </Provider>
  );
  }
}

export default App;
