import React, { useState } from "react";
import { HorizontalBar } from "react-chartjs-2";
import CountUp from "react-countup";

// import { DataApi } from "./ChartJSData";
export default function AmountComponent(props) {
    const ChartData =props.GETApiData;
    const SataSetinitial = []
//    console.log(props,'props')

   ChartData.DataArray.forEach((element) => {
        const TableListData = {
            label: element.label,
            pointStyle: "rectRounded",
            backgroundColor: element.Colour,
            barThickness: 20,
            categoryPercentage: 1,
            data: element.dataSet//From API
        }
        SataSetinitial.push(TableListData);
    })
    let sum = 0;
    return (
        <React.Fragment>
            <div className="d-flex  flex-wrap ">
              <div className="col" style={{ marginTop: "10px", textAlign: "center" }} >
                    <h4 className="mb-3" style={{ color: "black" }}>
                        Total Amount: &#x20b9;
                        <span className="counter-value">
                            <CountUp
                                start={0}
                                end={ChartData.GrandTotal}
                                duration={1}
                            />

                        </span>
                    </h4>
                </div>
            </div>
            <div style={{ marginLeft: "5%", marginRight: "5%" }}>
                <div className="d-flex gap-2 flex-wrap" >
                    {ChartData.CompanyPer.map((element,key) => {
                        return (<div className="col rounded border border-dark text-white text-center " style={{ backgroundColor: element.Color, margin: "5px", padding: "6px", fontWeight: "bold" }}  >{element.percentage} %</div>)
                    })}
                </div>
            </div>
            <HorizontalBar
                pointStyle="star"
                backgroundColor={'rgba(01, 10, 0, 0.1)'}
                data={{
                    labels: ChartData.CompanyLabels,
                    responsive: true,
                    offset: false,
                    datasets: SataSetinitial
                }}
                // height={(ChartData.CompanyLabels.length) * 8}
                // height={50}
                options={{
                    offsetGridLines: true,
                    drawTicks: true,
                    // maintainAspectRatio:true,
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
                            beforeBody: function (context) {
                                sum = 0
                                context.forEach((e) => {
                                    sum += e.xLabel
                                })
                                return (`Total Amount : ${sum.toFixed(2)}`)
                            },

                            label: function (tooltips, data) {
                                var label = data.datasets[tooltips.datasetIndex].label
                                var values = tooltips.xLabel
                                var percentage = ((values * 100) / sum)
                                return (`${label}:${values} (${percentage.toFixed(2)}%)`)
                            },
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
                    responsive: true,
                    maintainAspectRatio: true,
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
