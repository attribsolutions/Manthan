import React, { Component } from "react"
import ReactEcharts from "echarts-for-react"

class Pie extends Component {


    constructor(props) {

        super(props)
        this.items = props.Item

    }


    getOption = () => {
        const data = this.items;
        const item = data.map(item => (item.ItemName))


        const Data = data.map((Data) => ({
            value: Data.TotalAmount,
            name: Data.ItemName
        }));

        debugger
        return {
            toolbox: {
                show: true,
            },
            tooltip: {
                trigger: "item",
                formatter: "{a} <br/>{b} : {c} ({d}%)",
            },
         
            color: ["#02a499", "#f8b425", "#ec4561", "#38a4f8", "#3c4ccf"],
            series: [
                {
                    name: "Total sales",
                    type: "pie",
                    radius: "55%",
                    center: ["50%", "50%"],
                    data: Data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)",
                        },
                    },
                },
            ],
        }
    }
    render() {
        return (
            <React.Fragment>
                <ReactEcharts style={{ height: "350px" }} option={this.getOption()} />
            </React.Fragment>
        )
    }
}
export default Pie
