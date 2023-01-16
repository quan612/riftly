import { Pie } from "react-chartjs-2";
import { useEffect, useRef } from "react";

const PieChart = ({ clientData }) => {
    const chartRef = useRef();

    const handleOnThemeSwitch = () => {
        let currentTheme = JSON.parse(localStorage.getItem("toggleTheme")) || "light-theme";
        const chart = chartRef.current;

        let chartOption = chart?.options;
        if (!chartOption) return;

        if (currentTheme === "light-theme") {
            // chartOption.scales.x.ticks.color = "black";
            chart.legend.options.labels.color = "black";
            chart.titleBlock.options.color = "rgba(0, 138, 255)";
            // console.log(chart.legend);
        } else {
            chart.legend.options.labels.color = "white";
            chart.titleBlock.options.color = "rgba(0, 138, 255)";
        }
        chart.update();
    };
    useEffect(() => {
        window.addEventListener("toggleTheme", handleOnThemeSwitch);

        return () => {
            document.removeEventListener("toggleTheme", handleOnThemeSwitch);
        };
    }, []);

    const data = {
        labels: clientData.labels,
        datasets: [
            {
                label: clientData.datasetLabel,
                data: clientData.values, //[12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    "#78b2f5",
                    "#f7b754",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                    "#60a6f7",
                    "#ed9c21",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    let options = {
        responsive: true,
        plugins: {
            legend: {
                position: "right",
                labels: {
                    color:
                        JSON.parse(localStorage.getItem("toggleTheme")) === "light-theme"
                            ? "black"
                            : "white",
                    font: {
                        size: 14,
                    },
                },
            },
            title: {
                display: true,
                text: clientData.title,
                color: "rgba(0, 138, 255)",
                font: {
                    size: 18,
                },
            },
        },
    };
    return (
        <>
            {/* <Bar data={data} height={150} options={options} id="activity" ref={chartRef} /> */}
            <Pie data={data} options={options} ref={chartRef} />
        </>
    );
};
export default PieChart;
