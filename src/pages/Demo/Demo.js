import React, { useEffect, useState } from "react";
import { render } from "react-dom";

// import { Chart, defaults } from "react-chartjs-2";
// import * as Zoom from "chartjs-plugin-zoom";
import BarChart from "./BarChart";
import { Chart, registerables } from 'chart.js';
import "./styles.css";
import { Bar } from "react-chartjs-2";
Chart.register(...registerables);
// 
const initialOptions = {
 
  responsive: true,
  maintainAspectRatio: false,
  title: { display: true, text: 'My Chart' },
        zoom: {
          enabled: true,
          mode: 'x',
        },
        pan: {
          enabled:true,
          mode: 'x',
        },
  skipNull: true
};

const sampleData = {
  labels: [1, 2, 3, 4],
  datasets: [
    {
      label: "dataset1",
      data: [1, 2, 3, 4],
      backgroundColor: "green"
    },
    {
      label: "dataset2",
      data: [1, 2, null, 4],
      backgroundColor: "red"
    }
  ]
};

const Demo = () => {
  const [value, setValue] = useState(0);
  const [data, setData] = useState(sampleData);

  useEffect(() => {
    // Chart.register(Zoom);
  }, []);

  return (
    <div className="page-content">
      
    <div style={{ width: "100%", height: "80vh" }}>
      <Bar data={data} options={initialOptions} />

      {/* this should have plotted sample dataset */}
      <button
        onClick={() => {
          setData(sampleData);
          setValue(value + 1);
        }}
      >
        add data
      </button>
    </div>
    </div>
  );
};

export default Demo
// render(<Demo />, document.getElementById("root"));
// import React, { Component } from 'react'

// export default class Demo extends Component {
//   render() {
//     return (
//       <div className='page-content'>Demo</div>
//     )
//   }
// }
