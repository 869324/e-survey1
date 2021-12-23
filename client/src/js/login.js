import React from 'react';
import '../css/login.css';
import Axios from "axios";
import { withRouter } from "react-router-dom";
import shangri from "../icons/shangri.jpg";
import swal from 'sweetalert';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "admin@shangrila.gov.un",
      password: "shangrila@2021$",
      type: "resident"
    }

    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.changeType = this.changeType.bind(this);
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
  }

  changeEmail(event) {
    this.setState({
      email: event.target.value
    });
  }

  changePassword(event) {
    this.setState({
      password: event.target.value
    });
  }

  changeType(event) {
    this.setState({
      type: event.target.value
    });
  }

  signup() {
    this.props.history.push('/signup');
  }

  login(event) {
    event.preventDefault();

    const email = this.state.email;
    const password = this.state.password;
    const type = this.state.type;

    if (email == "" || password == "") {
      alert("Enter all details please");
    }
    else {
      Axios.post("http://localhost:3080/login", {
        email: email,
        password: password,
        type: type
      }).then((response) => {
        if (response.data.status) {
          swal("Excellent", "Login successful", "success");

          const state = {
            username: response.data.username,
            userId: response.data.userId
          }

          type == "resident" ? this.props.history.push({ pathname: '/home', state: state }) : this.props.history.push({ pathname: '/admin', state: state });
        }
        else {
          swal("Login Failed", "Check Credentials", "error");
        }
      });
    }

  }

  render() {
    return (
      <div style={{ backgroundImage: `url(${shangri})` }} className="body">
        <div className="loginDiv">
          <h1 className="loginHeader1">Welcome to e-Survey Shangri-La</h1>
          <div className="login">
            <h2 className="loginHeader2">Login to continue</h2>

            <form onSubmit={this.login} className="loginForm">
              <div className="loginRadio">
                <div>
                  <label>Resident</label>
                  <input type="radio" name="type" id="resident" checked={this.state.type == "resident"} onChange={this.changeType} value="resident" className="loginOption" />
                </div>

                <div>
                  <label>Admin</label>
                  <input type="radio" name="type" id="admin" checked={this.state.type == "admin"} onChange={this.changeType} value="admin" className="loginOption" />
                </div>
              </div>

              <input type="email" className="loginInput" onChange={this.changeEmail} placeholder="Enter Email" value={this.state.email} required></input>
              <input type="password" className="loginInput" onChange={this.changePassword} placeholder="Enter Password" value={this.state.password} required></input>
              <button type="submit" className="loginButton" id="login">Login</button>
            </form>

            <label onClick={this.signup} id="sign" >Sign Up</label>

          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);


