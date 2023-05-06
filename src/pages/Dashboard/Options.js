export const options = {
    chart: {
        height: 50,
        type: "line",
        toolbar: { show: false },
    },
    colors: ["#5156be"],
    stroke: {
        curve: 'smooth',
        width: 2,
    },
    xaxis: {
        labels: {
            show: false
        },
        axisTicks: {
            show: false
        },
        axisBorder: {
            show: false
        }
    },
    yaxis: {
        labels: {
            show: false
        }
    },
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    }
};