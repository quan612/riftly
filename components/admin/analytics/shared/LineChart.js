import { Line } from "react-chartjs-2";

function LineChart({ lineData }) {
    const data = {
        labels: [
            "4 Jan",
            "5 Jan",
            "6 Jan",
            "7 Jan",
            "8 Jan",
            "9 Jan",
            "10 Jan",
            "11 Jan",
            "12 Jan",
            "13 Jan",
            "14 Jan",
            "15 Jan",
        ],
        datasets: [
            {
                label: `$`,
                backgroundColor: "rgba(0, 138, 255, 0.10)",
                borderColor: "rgba(0, 138, 255, 1)",
                data: lineData, //lineData.facebook,
                lineTension: 0,
                pointRadius: 4,
                borderWidth: 4,
            },
            // {
            //     label: "Facebook",
            //     backgroundColor: "rgba(0, 138, 255, 0.5)",
            //     borderColor: "transparent",
            //     data: lineData.youtube,
            //     lineTension: 0,
            //     // borderDash: [10, 5],
            //     borderWidth: 1,
            //     pointRadius: 0,
            // },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false,
        },
        scales: {
            x:
            {
                stacked: true,
                barPercentage: 0.45,
                gridLines: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    display: false,
                    // fontColor: "#8a909d",
                },
            },
            y:
            {

            },

        },
    };
    return (
        <>
            <Line data={data} height={150} options={options} id="activity" />
        </>
    );
}
export default LineChart;
