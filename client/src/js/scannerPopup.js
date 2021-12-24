import React from 'react';
import '../css/editPopup.css';
import swal from "sweetalert";
import QrReader from "react-qr-scanner";

export class ScannerPopup extends React.Component {
    constructor(props) {
        super(props);

        this.scanError = this.scanError.bind(this);
    }

    scanError() {
        swal({
            title: "Failed to scan QR",
            icon: "error"
        });
        this.props.scan(false);
    }

    render() {
        return (
            <div className="popupBg">
                <div className="popupCont">
                    <div className="editPopClose" onClick={() => this.props.scan(false)}>+</div>
                    <h3>Scan QR</h3>
                    <QrReader className="scanner" delay={100} onError={this.scanError} onScan={this.props.getScan} />
                </div>
            </div>
        );
    }
}

export default ScannerPopup;