import React, { useEffect } from 'react';
import '../css/home.css';
import Axios from "axios";
import swal from 'sweetalert';

import { Signup } from "../js/signup";

import shangri from "../icons/shangri.jpg";
import homeIcon from "../icons/homeIcon.png";
import viewIcon from "../icons/viewIcon.png";
import logoutIcon from "../icons/logoutIcon.png";
import answerIcon from "../icons/answerIcon.png";

import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'home',
      questions: [],
      options: [],
      responses: [],
      newResponses: [],
      intervalId: 0
    }

    this.logout = this.logout.bind(this);
    this.changeView = this.changeView.bind(this);
    this.getQuestions = this.getQuestions.bind(this);
    this.getOptions = this.getOptions.bind(this);
    this.getResponses = this.getResponses.bind(this);
    this.onDataChange = this.onDataChange.bind(this);
    this.changeResponses = this.changeResponses.bind(this);
    this.submitResponse = this.submitResponse.bind(this);
  }

  componentDidMount() {
    const intervalId = setInterval(this.onDataChange, 3000);
    this.setState({ intervalId: intervalId });

    navigator.geolocation.getCurrentPosition(function (position) {
      Axios.post("http://localhost:3080/recordLocation", {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });

    });

  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  logout() {
    this.props.location.state = undefined;
    this.props.history.push("/")
  }

  changeView(view) {
    this.setState({
      view: view
    });
  }

  getQuestions() {
    Axios.get("http://localhost:3080/GetQuestions").then((response) => {
      if (response.data.questions) {
        this.setState({
          questions: response.data.questions
        });
      }
    });
  }

  getOptions() {
    Axios.get("http://localhost:3080/GetAllOptions").then((response) => {
      if (response.data.options) {
        this.setState({
          options: response.data.options
        });
      }
    });
  }

  getResponses() {
    Axios.get("http://localhost:3080/GetAllResponses").then((response) => {
      if (response.data.responses) {
        this.setState({
          responses: response.data.responses
        });
      }
    });
  }

  onDataChange() {
    this.getQuestions();
    this.getOptions();
    this.getResponses();
  }

  changeResponses(newOption) {
    const oldOption = this.state.newResponses.find(response => response.question_id == newOption.question_id);
    if (oldOption) {
      const index = this.state.newResponses.indexOf(oldOption);
      const newState = this.state.newResponses
      newState[index].option_id = newOption.option_id;
      this.setState({
        newResponses: newState
      });
    }

    else {
      const newState = [...this.state.newResponses]
      newState.push(newOption);
      this.setState({
        newResponses: newState
      });
    }

  }

  submitResponse(question_id) {
    const newOption = this.state.newResponses.find(option => option.question_id == question_id);

    if (newOption != undefined) {
      Axios.post("http://localhost:3080/submitResponse", {
        question_id: question_id,
        user_id: this.props.location.state.userId,
        option_id: newOption.option_id
      }).then(response => {
        if (response.data.status) {
          swal("Successful", "Response has been submitted", "success");
        }
        else {
          swal("Failed", "Something went wrong!", "warning");
        }
      });
    }
    else {
      swal({
        title: "Did you choose an Option?",
        icon: "warning"
      });
    }
  }

  render() {
    const state = this.props.location.state;
    let username = "";

    if (typeof state == "undefined") {
      this.props.history.push("/")
    }
    else {
      username = ", " + state.username;
    }

    let display = '';
    let homeClass = "navBtn"
    let viewClass = "navBtn"
    let answerClass = "navBtn"

    if (this.state.view == 'home') {
      homeClass = homeClass.concat(" homeSelectedView");

      display = <div className="homeDiv">
        <p className="homeHeader3">Share your views with us about SLEZ (Shangri-L Low Emission Zone) - a new project to reduce green house gas emissions</p>
        <p className="homeInfo">We at Shangri-La City Council, have made a committment to reduce greenhouse gas emissions such as CO2 and N2O from transport.
              We plan to introduce SLEZ (Shangri-L Low Emission Zone) to the city by the end of 2022 and install more electric vehicle charging stations.
              We have therefore, opened this channel to consult the public on this plan to implement SLEZ.
              We request residents to offer their opinions on the detail and the proposed boundaries of SLEZ. Enjoy!
        </p>
      </div>
    }

    else if (this.state.view == 'viewQtns') {
      viewClass = viewClass.concat(" homeSelectedView");

      const qtns = [];
      let optId = 1;

      this.state.questions.forEach((elem1, id1) => {
        const qtn = [];
        qtn.push(<div id="homeQuestion">{`Qtn ${id1 + 1}: ${elem1.question_text}`}</div>);
        const opts = [];

        this.state.options.forEach(elem2 => {
          if (elem2.question_id == elem1.question_id) {
            opts.push(<div className="homeOpt">{`${optId} ${elem2.option_text}`}</div>)
            optId += 1
          }

        });

        qtn.push(opts);
        qtns.push(<div className="homeQtn">{qtn}</div>);
        optId = 1;

      });

      display = <div className="homeQtnDiv">
        <h2 className="homeHeader3">Survey Questions</h2>
        {qtns}
      </div>
    }

    else if (this.state.view == 'answerQtns') {
      answerClass = answerClass.concat(" homeSelectedView");

      const qtns = [];
      let optId = 1;
      let qtnId = 1;

      this.state.questions.forEach((elem1, id1) => {
        const answered = this.state.responses.some(response => response.question_id == elem1.question_id && response.user_id == state.userId);

        if (!answered) {
          const qtn = [];
          qtn.push(<div id="homeQuestion">{`Qtn ${qtnId}: ${elem1.question_text}`}</div>);
          const opts = [];

          this.state.options.forEach((elem2, id2) => {

            if (elem2.question_id == elem1.question_id) {
              opts.push(<div>
                <label className="optLabel1">{`${optId}: `}</label>
                <input id={`radio${id2}`} type='radio' name={elem1.question_id} value={elem2.option_id} onChange={() => this.changeResponses({ question_id: elem1.question_id, option_id: elem2.option_id })} className="homeOpt" />
                <label className="optLabel2">{`${elem2.option_text}`}</label>
              </div>)
              optId += 1
            }

          });

          qtn.push(<div>{opts}</div>);
          const submit = <button onClick={() => this.submitResponse(elem1.question_id)} className="submitBtn">Submit</button>
          qtn.push(submit);
          qtns.push(<div className="homeQtn">{qtn}</div>);

          optId = 1;
          qtnId += 1;
        }
      });

      display = <div className="homeQtnDiv">
        <h2 className="homeHeader3">Survey Questions</h2>
        {qtns}
      </div>
    }

    return (
      <div className="homeContainer" style={{ backgroundImage: `url(${shangri})` }} >

        <div><h1 className="homeHeader1">Welcome to E-Survey  Shangri-La{username}</h1></div>

        <div className="homeContent">
          <div className="homeDashboard">
            <h2 className="homeHeader2">DASHBOARD</h2>

            <div className={homeClass} onClick={() => this.changeView('home')}>
              <img src={`${homeIcon}`} className="icon" />
              <label className="homeLink">Home</label>
            </div>

            <div className={viewClass} onClick={() => this.changeView('viewQtns')}>
              <img src={`${viewIcon}`} className="icon" />
              <label className="homeLink">View Questions</label>
            </div>

            <div className={answerClass} onClick={() => this.changeView('answerQtns')}>
              <img src={`${answerIcon}`} className="icon" />
              <label className="homeLink">Answer Questions</label>
            </div>

            <div className="navBtn" onClick={this.logout}>
              <img src={`${logoutIcon}`} className="icon" />
              <label className="homeLink">logout</label>
            </div>
          </div>

          <div className="homeDisplay">
            {display}
          </div>
        </div>


      </div>
    );
  }

}


export default Home;