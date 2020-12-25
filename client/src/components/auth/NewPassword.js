import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { NewPassword } from '../../actions/authActions';
import classnames from 'classnames';
class Newpassword extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      errors: {}
    };
  }

  


onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
onSubmit = e => {
    e.preventDefault();
const userData = {
      token: this.props.match.params.token,
      password: this.state.password
    };

this.props.NewPassword(userData,this.props.history);
  };
render() {
    const { errors } = this.state;
return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/" className="btn-flat waves-effect">
              <i className="material-icons left">keyboard_backspace</i> Back to
              home
            </Link>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <h4>
                <b>Change Password</b>
              </h4>
              
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                />
                <label htmlFor="password">Enter New Password</label>
                <span className="red-text">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </div>
              
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
Newpassword.propTypes = {
    Newpassword: PropTypes.func.isRequired,
    
    errors: PropTypes.object.isRequired
  };
  const mapStateToProps = (state) => ({
    errors: state.errors
  });
  
  export default connect(
    mapStateToProps,
    { NewPassword }
  )(Newpassword);