import React from 'react';
import Axios from "axios";
import swal from 'sweetalert';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';

class Chart extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const data = this.props.options.map((option, id) => {
            return { name: option.option, value: option.value }
        })

        const data01 = [
            { name: 'Group A', value: 400 },
            { name: 'Group B', value: 300 },
            { name: 'Group C', value: 300 },
            { name: 'Group D', value: 200 },
            { name: 'Group E', value: 278 },
            { name: 'Group F', value: 189 },
        ];

        return (
            <PieChart width={400} height={500}>
                <Pie
                    dataKey="value"
                    isAnimationActive={false}
                    data={data}
                    cx={200}
                    cy={200}
                    outerRadius={80}
                    fill="#8884d8"
                    label
                />
                <Tooltip />
            </PieChart>
        );
    }
}

export default Chart;