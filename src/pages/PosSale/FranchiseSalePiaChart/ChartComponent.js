import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Card, CardBody } from "reactstrap";
import ReactApexChart from "react-apexcharts"

function ChartComponent(props) {
  console.log(props)
    const ChartData = props.GETApiData;
    var newNumberArray1 = ChartData.PrimaryData.map(function(item) {
        return parseFloat(item)
      })
    
      const series1 = newNumberArray1
      const options1 = {
        labels: ChartData.labels,
        colors: ["#34c38f", "#556ee6", "#f46a6a", "#50a5f1", "#f1b44c"],
        legend: {
          show: true,
          position: "bottom",
          horizontalAlign: "center",
          verticalAlign: "middle",
          floating: false,
          fontSize: "25px",
          offsetX: 0,
          offsetY: -10,
        },
        responsive: [
          {
            breakpoint: 600,
            options: {
              chart: {
                height: 240,
              },
              legend: {
                show: false,
              },
            },
          },
        ],
      }
    
       var newNumberArray2 = ChartData.SecondaryData.map(function(item) {
        return parseFloat(item)
      })
    
      const series2 = newNumberArray2
      const options2 = {
        labels: ChartData.Secondarylabels,
        colors: ["#34c38f", "#556ee6", "#f46a6a", "#50a5f1", "#f1b44c"],
        legend: {
          show: true,
          position: "bottom",
          horizontalAlign: "center",
          verticalAlign: "middle",
          floating: false,
          fontSize: "25px",
          offsetX: 0,
          offsetY: -10,
        },
        responsive: [
          {
            breakpoint: 600,
            options: {
              chart: {
                height: 240,
              },
              legend: {
                show: false,
              },
            },
          },
        ],
      }

      const series3 = [
        {
          name: "Net Profit",
          data: [46, ],
        },
        {
          name: "Revenue",
          data: [74,],
        },
        {
          name: "Free Cash Flow",
          data: [37,]
        },
      ]
      const options3 = {
        chart: {
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: "top", // top, center, bottom
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return  val 
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"],
          },
        },
    
        colors: ["#556ee6"],
        grid: {
          borderColor: "#f1f1f1",
        },
        xaxis: {
          // categories:ChartData.Secondarylabels,
          // position: "bottom",
          labels: {
            offsetY: -18,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          crosshairs: {
            fill: {
              type: "gradient",
              gradient: {
                colorFrom: "#D8E3F0",
                colorTo: "#BED1E6",
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              },
            },
          },
          tooltip: {
            enabled: true,
            offsetY: -35,
          },
        },
        fill: {
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [50, 0, 100, 100],
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val + "%"
            },
          },
        },
        title: {
          text: "Top Five Items",
          floating: true,
          offsetY: 400,
          align: "center",
          style: {
            color: "#444",
          },
        },
      }
    return (
        <React.Fragment>
            <br></br>

            <div className="row">
                <div className="col col-6">
                    <Card><CardBody>
                        <div className="col" style={{ marginTop: "10px", textAlign: "center" }} >
                            <p > <h4 style={{ color: "black" }}> <i className="mdi mdi-arrow-up-bold text-success"></i> Top 5 Items </h4> </p>
                        </div>
                        {/* <ReactApexChart options={options1} series={series1} type="pie" height="380" /> */}
                        <TopFive  data={ChartData}/>
                    </CardBody>
                    </Card>
                </div>
                <div className="col col-6">
                    <Card><CardBody>
                        <div className="col" style={{ marginTop: "10px", textAlign: "center" }} >
                            <p > <h4 style={{ color: "black" }}>  <i className="mdi mdi-arrow-down-bold text-danger"></i> Bottom 5 Items </h4> </p>
                        </div>
                        {/* <ReactApexChart options={options3} series={series3} type="bar" height="380" /> */}
                        <BottomFive  data={ChartData}/>
                    </CardBody>
                    </Card>
                </div>
              
            </div>


        </React.Fragment>
    )
}
export default ChartComponent;

const TopFive = (props) => {
  const ChartData = props.data;
  var newNumberArray2 = ChartData.PrimaryData.map(function(item) {
    return parseFloat(item)
  })
    const series = [
      {
        name: "Total Sale",
        data: newNumberArray2,
      },
    ]
    const options = {
      fill: {
        colors: [ '#E91E63', '#9C27B0']
      },
      chart: {
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: false,
            position: "top", // top, center, bottom
          },
       colour:"black"

        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"],
        },
      },
  
      colors: ["#41B883"],
      grid: {
        borderColor: "#f1f1f1",
      },
      xaxis: {
        categories:  ChartData.labels,
        position: "top",
        labels: {
          offsetY: -300,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
          offsetY: -35,
        },
      },
      fill: {
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100],
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val
          },
        },
      },
      title: {
        text: "Top Five Sales Item",
        floating: true,
        offsetY: 330,
        align: "center",
        style: {
          color: "#444",
        },
      },
    }
    return (
      <>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
       <div style={{ marginLeft: "5%", marginRight: "5%" }}>
                  <div className="d-flex gap-2 flex-wrap" >
                     <div className="col  text-dark text-center " style={{ margin: "5px", padding: "6px", fontWeight: "bold" }}  >{ChartData.labels[0]}</div>
                     <div className="col  text-dark text-center " style={{  margin: "5px", padding: "6px", fontWeight: "bold" }}  >{ChartData.labels[1]}</div>
                     <div className="col  text-center " style={{  margin: "5px", padding: "6px", fontWeight: "bold" }}  >{ChartData.labels[2]}</div>
                     <div className="col text-center " style={{  margin: "5px", padding: "6px", fontWeight: "bold" }}  >{ChartData.labels[3]}</div>
                     <div className="col  text-center " style={{  margin: "5px", padding: "6px", fontWeight: "bold" }}  >
                    {ChartData.labels[4]}</div>
                   
                  </div>
              </div>
      </>
    )
  }
  

const BottomFive = (props) => {

const ChartData = props.data;
var newNumberArray2 = ChartData.SecondaryData.map(function(item) {
  return parseFloat(item)
})
  const series = [
    {
      name: "Total Sale",
      data: newNumberArray2,
    },
  ]
  const options = {
   
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: false,
          position: "top", // top, center, bottom
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val
      },
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },

    colors: ['#e01f26'],
    grid: {
      borderColor: "#ffebcd",
    },
    xaxis: {
      categories:  ChartData.Secondarylabels,
      position: "top",
      labels: {
        offsetY: -300,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        fill: {
          type: "gradient",
          gradient: {
            colorFrom: "#D8E3F0",
            colorTo: "#ffebcd",
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          },
        },
      },
      tooltip: {
        enabled: true,
        offsetY: -35,
      },
    },
    fill: {
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors:  "#D8E3F0",
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [50, 0, 100, 100],
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val) {
          return val
        },
      },
    },
    title: {
      text: "Bottom Five Sales Item",
      floating: true,
      offsetY: 330,
      align: "center",
      style: {
        color: "#444",
      },
    },
  }
  return (<>
    <ReactApexChart options={options} series={series} type="bar" height={350} />
     <div style={{ marginLeft: "5%", marginRight: "5%" }}>
                <div className="d-flex gap-2 flex-wrap" >
                   <div className="col  text-dark text-center " style={{ margin: "5px", padding: "6px", fontWeight: "bold" }}  >{ChartData.Secondarylabels[0]}</div>
                   <div className="col  text-dark text-center " style={{  margin: "5px", padding: "6px", fontWeight: "bold" }}  >{ChartData.Secondarylabels[1]}</div>
                   <div className="col  text-center " style={{  margin: "5px", padding: "6px", fontWeight: "bold" }}  >{ChartData.Secondarylabels[2]}</div>
                   <div className="col text-center " style={{  margin: "5px", padding: "6px", fontWeight: "bold" }}  >{ChartData.Secondarylabels[3]}</div>
                   <div className="col  text-center " style={{  margin: "5px", padding: "6px", fontWeight: "bold" }}  >
                  {ChartData.Secondarylabels[4]}</div>
                 
                </div>
            </div>
    </>
  )
}

const PieChartTopFive = (props) => {
const ChartData = props.data;

var newNumberArray1 = ChartData.PrimaryData.map(function(item) {
    return parseFloat(item)
  })

  const series1 = newNumberArray1
  const options1 = {
    labels: ChartData.labels,
    colors: ["#34c38f", "#556ee6", "#f46a6a", "#50a5f1", "#f1b44c"],
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      verticalAlign: "middle",
      floating: false,
      fontSize: "25px",
      offsetX: 0,
      offsetY: -10,
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 240,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  }

  return (
    <ReactApexChart options={options1} series={series1} type="bar" height="380" />
  )
}