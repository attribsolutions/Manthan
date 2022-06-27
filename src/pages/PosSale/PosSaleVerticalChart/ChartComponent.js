import React, { useState } from "react";
import { Bar } from "react-chartjs-2";

function ChartComponent(props) {
    const ChartData=props.GETApiData;
    const SataSetinitial = []
    ChartData.DataArray.forEach((element) => {
        const TableListData = {
            label: element.label,
            pointStyle: "rectRounded",
            backgroundColor: element.Colour,
            barThickness: 40,
            categoryPercentage: 1,
            data: element.dataSet//From API
        }
        SataSetinitial.push(TableListData);
    })
    return (
        <React.Fragment>
            <div className="d-flex  flex-wrap ">
              <div className="col" style={{ marginTop: "10px", textAlign: "center" }} >
                    <p > <h4 style={{ color: "black" }}>  Total Amount: {ChartData.GrandTotal} </h4> </p>
                </div>
            </div>
         
            <Bar
                pointStyle="star"
                backgroundColor={'rgba(01, 10, 0, 0.1)'}
                data={{
                    labels: ChartData.CompanyLabels,
                    responsive: true,
                    offset: false,
                    datasets:SataSetinitial
                }}
               
                options={{
                    offsetGridLines: true,
                    drawTicks: true,
                   
                    layout: {
                        padding: {
                            top: 20,
                            right: 40,
                            bottom: 40,
                            left: -7
                        },
                    },
                    tooltips: {
                        displayColors: true,
                        backgroundColor: "#FFF",
                        bodyColor: "#000",
                        bodyFontColor: "#000",
                        borderColor: "#000",
                        borderWidth: 1,
                        padding: 30,
                        titleFontSize: 20,
                        bodyFontSize: 18,
                        titleFontColor: "#000",
                        callbacks: {
                            // beforeBody: function (context) {
                            //     sum = 0
                            //     context.forEach((e) => {
                            //         sum += e.xLabel
                            //     })
                            //     return (`Total Amount : ${sum.toFixed(2)}`)
                            // },

                            // label: function (tooltips, data) {
                            //     var label = data.datasets[tooltips.datasetIndex].label
                            //     var values = tooltips.xLabel
                           
                            //     return (`${label}:${values} (${tooltips.yLabel})`)
                            // },
                        }
                    },
                    legend: {
                        display: true,
                        position: "right",
                        align: "right",
                        labels: {
                            usePointStyle: true
                        },
                    },
                    scales: {
                        xAxes: [
                            {
                                stacked: true,
                                ticks: {
                                    padding: 1,
                                    borderColor: "black"
                                },
                                gridLines: {
                                    display: true
                                },
                            }
                        ],
                        yAxes: [
                            {
                                stacked: true,
                                ticks: {
                                    padding: 1,

                                }
                            }
                        ]
                    }
                   
                }}
            />
        </React.Fragment>
    )
}
export default ChartComponent;