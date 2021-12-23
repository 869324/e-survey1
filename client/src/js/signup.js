import React from 'react';
import '../css/signup.css';
import Axios from "axios";
import shangri from "../icons/shangri.jpg";
import QrReader from 'react-qr-scanner';
import { ScannerPopup } from '../js/scannerPopup.js';
import swal from 'sweetalert';

export class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      log: false,
      username: '',
      email: "",
      name: '',
      dob: '',
      address: '',
      sni: '',
      password: '',
      scanner: false

    }

    this.changeEmail = this.changeEmail.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changeDob = this.changeDob.bind(this);
    this.changeAddress = this.changeAddress.bind(this);
    this.changeSni = this.changeSni.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.getScan = this.getScan.bind(this);
    this.scan = this.scan.bind(this);
  }

  changeEmail(event) {
    this.setState({
      email: event.target.value
    });
  }

  changeName(event) {
    this.setState({
      name: event.target.value
    });
  }

  changeDob(event) {
    this.setState({
      dob: event.target.value
    });
  }

  changeAddress(event) {
    this.setState({
      address: event.target.value
    });
  }

  scan(status) {
    this.setState({
      scanner: status
    });
  }

  getScan(sni) {
    this.setState({
      sni: sni
    });
  }

  changeSni(event) {
    this.setState({
      sni: event.target.value
    });
  }

  changePassword(event) {
    this.setState({
      password: event.target.value
    });
  }

  login() {
    this.props.history.push('/');
  }

  signup(event) {
    event.preventDefault();

    const email = this.state.email;
    const name = this.state.name;
    const dob = this.state.dob;
    const address = this.state.address;
    const sni = this.state.sni;
    const password = this.state.password;

    const data = {
      email: email,
      name: name,
      dob: dob,
      address: address,
      sni: sni,
      password: password
    }

    const empty = email == "" || name == "" || dob == "" || address == "" || sni == "" || password == "";

    if (empty) {
      swal({ title: "Please Enter all details", icon: "warning" })
    }
    else {
      Axios.post("http://localhost:3080/signup", data).then((response) => {
        if (response.data.status) {
          swal("Successful", response.data.msg, "success");
          this.login();
        }
        else {
          swal("Failed", response.data.msg, "error");
        }
      });
    }
  }

  render() {
    return (
      <div className="body" style={{ backgroundImage: `url(${shangri})` }}>
        <div className="signDiv">
          <h1 className="signHeader1">Welcome to e-Survey Shangri-La</h1>

          {this.state.scanner && <ScannerPopup scan={this.scan} getScan={this.getScan} />}

          <div className="sign">
            <h2 className="signHeader2">Sign Up</h2>
            <form onSubmit={this.signup} className="signForm">
              <input type="email" className="signInput" onChange={this.changeEmail} placeholder="Email" required></input>
              <input type="text" className="signInput" onChange={this.changeName} placeholder="Full Name" required></input>
              <input type="date" className="signInput" onChange={this.changeDob} placeholder="Date of Birth" required></input>
              <input type="text" className="signInput" onChange={this.changeAddress} placeholder="Home address" required></input>
              <span id="sniDiv">
                <input type="text" id="sniInput" className="signInput" onChange={this.changeSni} placeholder="SNI Number" required></input>
                <button id="btnScan" type="button" onClick={() => this.scan(true)}>Scan</button>
              </span>
              <input type="password" className="signInput" onChange={this.changePassword} placeholder="Password" required></input>
              <button type="submit" className="signButton">Signup</button>
              <label className="loginLabel" onClick={this.login}>Login</label>
            </form>
          </div>

        </div>
      </div>
    );
  }

}

export default Signup;