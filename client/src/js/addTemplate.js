import React from 'react';
import '../css/addTemplate.css';
import Axios from "axios";
import swal from 'sweetalert';

import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

export class Add extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            question: "",
            options: [],
        }

        this.changeQtn = this.changeQtn.bind(this);
        this.changeOpts = this.changeOpts.bind(this);
        this.addOption = this.addOption.bind(this);
        this.removeOption = this.removeOption.bind(this);
        this.addQtn = this.addQtn.bind(this);
        this.editQtn = this.editQtn.bind(this);
    }

    componentDidMount() {
        const question = this.props.question;
        const options = this.props.options;
        this.setState({
            question: question,
            options: options
        });
    }

    changeQtn(event) {
        this.setState({
            question: event.target.value
        });
    }

    changeOpts(event) {
        const id = event.target.id;
        const value = event.target.value;

        const newState = [...this.state.options];
        newState[id] = value;

        this.setState({
            options: newState
        });
    }

    addOption() {
        this.setState(state => ({
            options: state.options.concat("")
        }));
    }

    removeOption() {
        this.setState(state => {
            if (state.options.length > 2) {
                return {
                    options: state.options.slice(0, state.options.length - 1)
                }
            }
        });
    }

    addQtn() {
        if (this.state.question == "" || this.state.options.some(option => option == "")) {
            swal({
                title: "Some field is empty!",
                icon: "warning"
            });
        }
        else {

            Axios.post("http://localhost:3080/add", {
                question: this.state.question,
                options: this.state.options,
            }).then((response) => {
                if (response.data.status) {
                    swal("Success", "Question has been added", "success");
                    this.setState({
                        question: "",
                        options: ["", ""]
                    });

                }
                else {
                    swal("Failed", "Failed to add question", "error");
                }
            });
        }
    }

    editQtn() {
        const changes = [];

        if (this.state.question != this.props.question) {
            changes.push("qtn");
        }

        if (JSON.stringify(this.state.options) != JSON.stringify(this.props.options)) {
            changes.push("opt");
        }

        if (changes.length == 0) {
            swal({
                title: "No changes made to the question!",
                icon: "warning"
            });
        }
        else {
            Axios.post("http://localhost:3080/edit", {
                questionId: this.props.question_id,
                question: this.state.question,
                options: this.state.options,
                changes: changes
            }).then((response) => {
                if (response.data.status) {
                    swal("Success", "Question has been updated", "success");
                    this.props.changeTemplateStatus(false);
                    this.setState({
                        question: '',
                        options: ["", ""]
                    });
                }
                else {
                    swal("Failed", "Failed to update question", "error");
                }
            });
        }
    }

    render() {
        const options = [];
        this.state.options.forEach((option, id) => {
            const opt = <input id={id} className="addInput" type="text" value={option} placeholder={`Option ${id + 1}`} onChange={this.changeOpts} required />
            options.push(opt);
        });

        const btnText = this.props.operation == "add" ? "Add Question" : "Save";
        const action = this.props.operation == "add" ? this.addQtn : this.editQtn;

        return (
            <div className="add">
                <textarea className="addTextarea" value={this.state.question} placeholder="Type a question" onChange={this.changeQtn} required />
                <label className="addHeader3">options</label>
                <div className="addOptions">{options}</div>
                <div className="addAdjustDiv">
                    <button onClick={this.addOption} className="addAdjust" >Add Option</button>
                    <button onClick={this.removeOption} className="addAdjust">Remove Option</button>
                </div>
                <button onClick={action} className="addBtn" >{btnText}</button>

            </div>
        );
    }
}

export default Add;