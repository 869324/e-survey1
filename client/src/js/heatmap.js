import React from 'react';
import '../css/heatmap.css';
import Axios from "axios";
import Add from "../js/addTemplate.js";
import swal from "sweetalert";
import GoogleMapReact from "google-map-react";

export class HeatMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            center: this.props.positions[0],
            zoom: 11,
        }

    }

    componentDidMount() {
        const script = document.createElement("script");

        script.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=visualization&callback=initMap";
        script.async = true;

        document.body.appendChild(script);
    }

    render() {

        const heatMapData = {
            positions: this.props.positions,
            options: {
                radius: 20,
                opacity: 0.6,
            }
        }

        return (
            <div style={{ height: 'calc(100vh - 120px)', width: '78vw' }}>
                <GoogleMapReact
                    ref={(el) => this._googleMap = el}
                    bootstrapURLKeys={{ key: "" }}
                    defaultCenter={this.state.center}
                    defaultZoom={this.state.zoom}
                    heatmapLibrary={true}
                    heatmap={heatMapData}
                >
                </GoogleMapReact>
            </div>
        );
    }
}

export default HeatMap;