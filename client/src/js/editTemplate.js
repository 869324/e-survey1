import React from 'react';
import '../css/editTemplate.css';
import Axios from "axios";
import swal from 'sweetalert';
import EditPopup from '../js/editPopup.js';

import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

export class Edit extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            question_id: "",
            question: "",
            options: [],
            showEditTemplate: false,
        }

        this.deleteQtn = this.deleteQtn.bind(this);
        this.changeTemplateStatus = this.changeTemplateStatus.bind(this);
    }

    changeTemplateStatus(status) {
        this.setState({
            showEditTemplate: status
        });
    }

    loadQuestion(status, question_id, question_text, options) {
        this.setState({
            showEditTemplate: status,
            question_id: question_id,
            question: question_text,
            options: options
        });
    }

    deleteQtn(questionId) {
        this.changeTemplateStatus(false);

        swal({
            title: "Are you sure?",
            text: "that you want to delete this question?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                Axios.post("http://localhost:3080/DeleteQuestion", {
                    questionId: questionId
                }).then((response) => {
                    if (response.data.status) {
                        swal("Question has been deleted", {
                            icon: "success",
                        });
                    }
                    else {
                        swal("Failed to delete question", {
                            icon: "error",
                        });
                    }
                });

            } else {
                swal("Deletion Canceled!");
            }
        });

    }

    render() {
        const qtns = [];
        let optId = 1;

        this.props.questions.forEach((elem1, id1) => {
            const qtn = [];
            qtn.push(<div className="editQtn" id={`editQtn${id1}`} >{`Qtn ${id1 + 1}: ${elem1.question_text}`}</div>);

            const opts = [];
            const opts1 = [];

            this.props.options.forEach((elem2, id2) => {
                if (elem2.question_id == elem1.question_id) {
                    opts.push(<div id={`editOpt${id2}`} className="editOpt">{`${optId} ${elem2.option_text}`}</div>)
                    opts1.push(elem2.option_text);
                    optId += 1
                }

            });

            qtn.push(<div>{opts}</div>);
            optId = 1;

            let answered = this.props.responses.some(elem3 => elem3.question_id == elem1.question_id);
            if (!answered) {
                const edit = <button id="btnEdit" className="editQtn" onClick={() => this.loadQuestion(true, elem1.question_id, elem1.question_text, opts1)} className="editBtn">Edit</button>;
                const del = <button id="btnDelete" className="editBtn" onClick={() => this.deleteQtn(elem1.question_id)} >Delete</button>;

                qtn.push(<div className="editBtnDiv">{[edit, del]}</div>);
            }
            else {
                const info = <label className="adminInfo">This question already has responses therefore cannot be edited</label>
                qtn.push(<div className="editInfoDiv">{info}</div>);
            }

            qtns.push(<div className="editQtnDiv">{qtn}</div>);
        });


        return (
            <div>
                <div>{qtns}</div>
                <div>{this.state.showEditTemplate && <EditPopup changeTemplateStatus={this.changeTemplateStatus} question_id={this.state.question_id} question={this.state.question} options={this.state.options} />}</div>
            </div>
        );

    }
}

export default Edit;