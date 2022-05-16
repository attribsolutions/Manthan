import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar,HorizontalBar } from 'react-chartjs-2';
// import faker from 'faker';
// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend
//   )
 const HorizontalChart =()=> {
;

const options = {
  plugins: {
    title: {
      display: true,
      text: 'Chart.js Bar Chart - Stacked',
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July','April', 'May', 'June', 'July',];

 const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => 15),
      backgroundColor: 'rgb(255, 99, 132)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => 20),
      backgroundColor: 'rgb(75, 192, 192)',
    },
    {
      label: 'Dataset 3',
      data: labels.map(() => 124),
      backgroundColor: 'rgb(53, 162, 235)',
    },
  ],
};


  return <div className='page-content'><HorizontalBar options={options} data={data} width={labels.length*90}
  height={labels.length*30} /></div>
}
export default HorizontalChart