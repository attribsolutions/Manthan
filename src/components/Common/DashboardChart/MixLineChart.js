import React, { Component } from "react"
import ReactEcharts from "echarts-for-react"
class LineBar extends Component {
    constructor(props) {
        super(props)
        this.Data = props.Data
        this.Name = props.Name
        this.color = props.color
    }

    getOption = () => {

        const Month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "sep", "Oct", "Nov", "Dec"]
        const MonthContentData = () => {
            if (this.Data.length > 0) {
                const filteredMonths = Month.filter((month, index) => this.Data[index] !== 0);
                const MonthData = this.Data.filter((month, index) => this.Data[index] !== 0);
                return { filteredMonths, MonthData }
            }

        }

        return {
            grid: {
                zlevel: 0,
                x: 50,
                x2: 50,
                y: 30,
                y2: 30,
                borderWidth: 0,
                backgroundColor: "rgba(0,0,0,0)",
                borderColor: "rgba(0,0,0,0)",
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                    crossStyle: {
                        color: "#999",
                    },
                },
            },
            toolbox: {
                feature: {
                    dataView: { show: false, readOnly: false },
                    magicType: { show: true },
                    restore: { show: false },
                    saveAsImage: { show: false },
                },
            },
            color: [this.color],  //Chart Pillar Color

            legend: {
                textStyle: {
                    color: ["black"],
                },
            },
            xAxis: [
                {
                    type: "category",
                    data: MonthContentData().filteredMonths, //Filter Month That Content Data
                    axisPointer: {
                        type: "shadow",
                    },
                    axisLine: {
                        lineStyle: {
                            color: "#74788d",
                        },
                    },
                },
            ],
            yAxis: [
                {
                    type: "value",
                    name: "Total",
                    min: 0,
                    max: 150,
                    interval: 50,
                },
                {
                    interval: 0,
                    axisLine: "none"
                },
            ],
            series: [
                // {
                //     name: "Invoice",
                //     type: "bar",
                //     data: [2, 4, 7, 23, 25, 76, 135, 130],
                // },
                {
                    name: this.Name,
                    type: "bar",
                    data: MonthContentData().MonthData,
                },
                // {
                //     name: "Grn",
                //     type: "bar",
                //     yAxisIndex: 1,
                //     data: [2, 2, 3, 4, 6, 10, 20, 23],
                // },
            ],
            textStyle: {
                color: ["#74788d"],
            },
        }
    }
    render() {
        return (
            <React.Fragment>
                <ReactEcharts style={{ height: "180px", width: "100%" }} option={this.getOption()} />
            </React.Fragment>
        )
    }
}
export default LineBar
