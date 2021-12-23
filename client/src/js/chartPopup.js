import React from 'react';
import '../css/chartPopup.css';
import Axios from "axios";
import Chart from "../js/chart.js";
import swal from "sweetalert";

export class ChartPopup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="popupBg">
                <div className="popupCont">
                    <div className="editPopClose" onClick={this.props.closeChart}>+</div>
                    <h2>{`Question: Pie Chart`}</h2>
                    <h3 className="chartQtn">{this.props.question}</h3>
                    <Chart question={this.props.question} options={this.props.options} />
                </div>
            </div>
        );
    }
}

export default ChartPopup;