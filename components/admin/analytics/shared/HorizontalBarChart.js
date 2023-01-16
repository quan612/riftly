import { Bar } from "react-chartjs-2";
import { useEffect, useRef } from "react";

const HorizontalBarChart = ({ clientData }) => {
    const labels = clientData?.labels;
    const chartRef = useRef();
    const handleOnThemeSwitch = () => {
        let currentTheme = JSON.parse(localStorage.getItem("toggleTheme")) || "light-theme";
        const chart = chartRef.current;

        // console.log(chart)
        let chartOption = chart?.options;
        if (!chartOption) return;
        if (currentTheme === "light-theme") {
            chart.legend.options.labels.color = "black";
            chartOption.scales.x.ticks.color = "black";
        } else {
            chart.legend.options.labels.color = "white";
            chartOption.scales.x.ticks.color = "white";
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
        labels,
        datasets: [
            {
                label: "Top Pages",
                data: clientData?.arrayOfValues,
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                // barPercentage: 0.5
            },
        ],
    };

    let options = {
        indexAxis: "y",
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: "top",
                labels: {
                    color: "white",
                    font: {
                        size: 14,
                    },
                },
            },
            title: {
                display: true,
                text: "Page Views Analysis",
                color: "rgba(0, 138, 255)",
                font: {
                    size: 18,
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    precision: 0,
                    // color: "black",
                    color:
                        JSON.parse(localStorage.getItem("toggleTheme")) === "light-theme"
                            ? "black"
                            : "white",
                },
            },
            y: {
                ticks: {
                    beginAtZero: true,
                    precision: 0,
                    color: "orange",
                    font: {
                        size: 12,
                    },
                },
            },
        },
    };
    return (
        <>
            <Bar data={data} height={160} options={options} ref={chartRef} />
        </>
    );
};
export default HorizontalBarChart;
