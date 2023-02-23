import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function PageViewsApexChart({ clientData, legends }) {
    const barChartOptionsDailyTraffic = {
        colors: ["#4d3a96", "#4576b5"],
        chart: {
            type: "bar",
            height: 450,
            toolbar: {
                show: false,
            },
        },
        tooltip: {
            style: {
                fontSize: "12px",
                fontFamily: undefined,
            },
            onDatasetHover: {
                style: {
                    fontSize: "12px",
                    fontFamily: undefined,
                },
            },
            theme: "dark",
        },
        xaxis: {
            // categories: ["00", "04", "08", "12", "14", "16", "18"],
            categories: clientData?.labels,
            // show: false,
            labels: {
                show: true,
                style: {
                    colors: "#A3AED0",
                    fontSize: "14px",
                    fontWeight: "500",
                },
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            show: true,
            color: "black",
            labels: {
                show: true,
                style: {
                    colors: "#A3AED0",
                    // colors: "#CBD5E0",
                    fontSize: "14px",
                },
            },
        },
        grid: {
            show: false,
            strokeDashArray: 5,
            yaxis: {
                lines: {
                    show: true,
                },
            },
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        fill: {
            type: "gradient",
            gradient: {
                type: "horizontal",
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                colorStops: [
                    [
                        {
                            offset: 0,
                            color: "rgba(67, 24, 255, 1)",
                            opacity: 0.55,
                        },
                        {
                            offset: 50,
                            color: "#5c49b8",
                            opacity: 1,
                        },
                    ],
                    [
                        {
                            offset: 0,
                            color: "rgba(67, 24, 255, 1)",
                            opacity: 0.55,
                        },
                        {
                            offset: 50,
                            color: "#5c49b8",
                            opacity: 1,
                        },
                    ],
                    [
                        {
                            offset: 0,
                            color: "rgba(67, 24, 255, 1)",
                            opacity: 0.55,
                        },
                        {
                            offset: 50,
                            color: "#5c49b8",
                            opacity: 1,
                        },
                    ],
                    [
                        {
                            offset: 0,
                            color: "rgba(67, 24, 255, 1)",
                            opacity: 0.55,
                        },
                        {
                            offset: 50,
                            color: "#5c49b8",
                            opacity: 1,
                        },
                    ],
                ],
            },
        },
        dataLabels: {
            enabled: false,
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                columnWidth: "50px",
                horizontal: true,
                // barHeight: '20%',
            },
        },

        stroke: {
            colors: ["transparent"],
            width: 8,
        },
    };
    return (
        <>
            {/* <Bar data={data} height={150} options={options} id="activity" /> */}
            <Chart
                options={barChartOptionsDailyTraffic}
                series={barChartDataDailyTraffic}
                type="bar"
                width="100%"
                // height="100%"
                height={450}
            />
        </>
    );
}
export default PageViewsApexChart;

const barChartDataDailyTraffic = [
    {
        name: "Total Users",
        data: [23, 55],
    },
    {
        name: "Page Views",
        data: [20, 50],
    },
    {
        name: "Sessions",
        data: [80, 90],
    },
    {
        name: "Sessions Per User",
        data: [23, 65],
    },
];

// const data = {
//     labels,
//     datasets: [
//         {
//             label: legends[0],
//             data: clientData?.arrayOfValues[0],
//             borderColor: 'rgb(255, 99, 132)',
//             backgroundColor: 'rgba(255, 99, 132, 0.5)',
//         },
//         {
//             label: legends[1],
//             data: clientData?.arrayOfValues[1],
//             borderColor: 'rgb(100,187,70)',
//             backgroundColor: 'rgba(100,187,70, 0.5)',
//         },
//         {
//             label: legends[2],
//             data: clientData?.arrayOfValues[2],
//             borderColor: 'rgb(90,200,217)',
//             backgroundColor: 'rgba(90,200,217, 0.5)',
//         },
//         {
//             label: legends[3],
//             data: clientData?.arrayOfValues[3],
//             borderColor: 'rgb(247,234,52)',
//             backgroundColor: 'rgba(247,234,52, 0.5)',
//         },

//     ],
// };
