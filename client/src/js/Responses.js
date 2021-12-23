import React from 'react';
import '../css/Responses.css';
import Axios from "axios";
import swal from 'sweetalert';
import EditPopup from '../js/editPopup.js';
import ChartPopup from "../js/chartPopup.js"

import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

export class Responses extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showChart: false,
            qtnId: "",
            question: "",
            options: []
        }

        this.showChart = this.showChart.bind(this);
        this.closeChart = this.closeChart.bind(this);
    }

    showChart(qtnId, question, options) {
        this.setState({
            showChart: true,
            qtnId: qtnId,
            question: question,
            options: options
        });
    }

    closeChart() {
        this.setState({
            showChart: false
        });
    }

    render() {
        const responses = [];
        let optId = 1
        let qtnId = 1;

        this.props.questions.forEach((elem1, id1) => {
            const responded = this.props.responses.filter(response1 => response1.question_id == elem1.question_id);
            if (responded.length > 0) {
                const response = [];

                response.push(<div className="viewQtn" id={`resQtn${id1}`} >{`Qtn ${qtnId}: ${elem1.question_text}  (Responses = ${responded.length})`}</div>);
                qtnId += 1;

                const options = [];
                const options1 = [];

                this.props.options.forEach((elem2, id2) => {
                    if (elem2.question_id == elem1.question_id) {
                        const res = this.props.responses.filter(response1 => response1.question_id == elem1.question_id && response1.option_id == elem2.option_id);
                        const count = res.length;
                        const perc = count > 0 ? (count / responded.length) * 100 : 0;
                        options.push(<div id={`editOpt${id2}`} className="resOpt">
                            <div className="viewOpt">{`${optId}: ${elem2.option_text}`}</div>
                            <div className="results">{`votes = ${count} percentage = ${perc}%`}</div>
                        </div>)
                        options1.push({ option: elem2.option_text, value: count });
                        optId += 1
                    }

                });

                optId = 1;

                response.push(<div>{options}</div>);

                const viewChart = <button onClick={() => this.showChart(qtnId, elem1.question_text, options1)} className="viewChart">View Chart</button>
                response.push(viewChart);


                responses.push(<div className="editQtnDiv">{response}</div>);
            }
        });

        return (
            <div>
                <div>{responses}</div>
                {this.state.showChart && <ChartPopup qtnId={this.state.qtnId} question={this.state.question} options={this.state.options} closeChart={this.closeChart} />}
                <div></div>
            </div>
        );

    }
}

export default Responses;