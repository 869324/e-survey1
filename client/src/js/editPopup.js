import React from 'react';
import '../css/editPopup.css';
import Axios from "axios";
import Add from "../js/addTemplate.js";
import swal from "sweetalert";

export class EditPopup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="popupBg">
                <div className="popupCont">
                    <div className="editPopClose" onClick={() => this.props.changeTemplateStatus(false)}>+</div>
                    <h3>Edit Question</h3>
                    <Add operation="edit" question_id={this.props.question_id} question={this.props.question} options={this.props.options} changeTemplateStatus={this.props.changeTemplateStatus} />
                </div>
            </div>
        );
    }
}

export default EditPopup;