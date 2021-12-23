import React from 'react';
import '../css/admin.css';
import Axios from "axios";
import { Signup } from "../js/signup";
import { Add } from "../js/addTemplate";
import { Edit } from "../js/editTemplate";
import { Responses } from "../js/Responses";
import { HeatMap } from "../js/heatmap.js";

import shangri from "../icons/shangri.jpg";
import homeIcon from "../icons/homeIcon.png";
import addIcon from "../icons/addIcon.png";
import viewIcon from "../icons/viewIcon.png";
import editIcon from "../icons/editIcon.png";
import logoutIcon from "../icons/logoutIcon.png";
import heatmapIcon from "../icons/heatmapIcon.png";

class Admin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            view: 'home',
            questions: [],
            addedQuestion: "",
            addedOptions: ["", ""],
            options: [],
            responses: [],
            locations: [],
            positions: []
        }

        this.logout = this.logout.bind(this);
        this.changeView = this.changeView.bind(this);
        this.getQuestions = this.getQuestions.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.getResponses = this.getResponses.bind(this);
        this.onDataChange = this.onDataChange.bind(this);
        this.getLocations = this.getLocations.bind(this);
    }

    componentDidMount() {
        const intervalId = setInterval(this.onDataChange, 3000);
        this.setState({ intervalId: intervalId });
        this.getLocations();
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

    getLocations() {
        Axios.get("http://localhost:3080/GetLocations").then((response) => {
            if (response.data.locations) {
                const positions = response.data.locations.map(element => {
                    return { lat: element.latitude, lng: element.longitude }
                });

                this.setState({
                    positions: positions
                });
            }
        });
    }

    onDataChange() {
        this.getQuestions();
        this.getOptions();
        this.getResponses();
    }

    render() {
        const state = this.props.location.state;
        let username = "";

        if (typeof state == "undefined") {
            this.props.history.push("/")
        }
        else {
            username = state.username + ", ";
        }

        let display = '';
        let homeClass = "navBtn";
        let addClass = "navBtn";
        let editClass = "navBtn";
        let viewClass = "navBtn";
        let mapClass = "navBtn";

        if (this.state.view == 'home') {
            homeClass = homeClass.concat(" adminSelectedView");

            display = <div className="homeDiv">
                <h2 className="adminHeader3">Manage the SLEZ (Shangri-L Low Emission Zone) survey service</h2>
                <p className="adminInfo">We at Shangri-La City Council, have made a committment to reduce greenhouse gas emissions such as CO2 and N2O from transport.
                      We plan to introduce SLEZ (Shangri-L Low Emission Zone) to the city by the end of 2022 and install more electric vehicle charging stations.
                      We have therefore, opened this channel to consult the public on this plan to implement SLEZ.
                      We request residents to offer their opinions on the detail and the proposed boundaries of SLEZ. Enjoy!</p>
            </div>
        }

        else if (this.state.view == 'addQtns') {
            addClass = addClass.concat(" adminSelectedView");
            display = <div className="adminAdd">
                <h2 className="adminHeader3">Add Survey Question</h2>
                <Add operation="add" question="" options={["", ""]} />
            </div>
        }

        else if (this.state.view == 'editQtns') {
            editClass = editClass.concat(" adminSelectedView");
            display = <div className="adminEdit">
                <h2 className="adminHeader3">Edit Survey Questions</h2>
                <Edit questions={this.state.questions} options={this.state.options} responses={this.state.responses} />
            </div>

        }

        else if (this.state.view == 'viewResponses') {
            viewClass = viewClass.concat(" adminSelectedView");
            display = <div className="adminEdit">
                <h2 className="adminHeader3">Responses</h2>
                <Responses questions={this.state.questions} options={this.state.options} responses={this.state.responses} />
            </div>

        }

        else if (this.state.view == 'heatmap') {
            mapClass = mapClass.concat(" adminSelectedView");
            display = <div className="adminEdit">
                <h2 className="adminHeader3">heatmap</h2>
                <HeatMap positions={this.state.positions} />
            </div>

        }

        return (
            <div className="adminContainer" style={{ backgroundImage: `url(${shangri})` }}>

                <div className="adminHeader1">E-Survey  Shangri-La Management Center</div>

                <div className="adminContent">
                    <div className="adminDashboard">
                        <h2 className="adminHeader2">DASHBOARD</h2>

                        <div className={homeClass} onClick={() => this.changeView('home')}>
                            <img src={`${homeIcon}`} className="adminIcon" />
                            <label className="adminLink">Home</label>
                        </div>

                        <div className={addClass} onClick={() => this.changeView('addQtns')}>
                            <img src={`${addIcon}`} className="adminIcon" />
                            <label className="adminLink">Add Questions</label>
                        </div>

                        <div className={editClass} onClick={() => this.changeView('editQtns')}>
                            <img src={`${editIcon}`} className="adminIcon" />
                            <label className="adminLink">Edit Questions</label>
                        </div>

                        <div className={viewClass} onClick={() => this.changeView('viewResponses')}>
                            <img src={`${viewIcon}`} className="adminIcon" />
                            <label className="adminLink">View Responses</label>
                        </div>

                        <div className={mapClass} onClick={() => this.changeView('heatmap')}>
                            <img src={`${heatmapIcon}`} className="adminIcon" />
                            <label className="adminLink">Heat Map</label>
                        </div>

                        <div className="navBtn" onClick={this.logout}>
                            <img src={`${logoutIcon}`} className="adminIcon" />
                            <label className="adminLink">logout</label>
                        </div>
                    </div>

                    <div className="adminDisplay">
                        {display}
                    </div>
                </div>

            </div >
        );
    }

}


export default Admin;