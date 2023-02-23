import { useEffect, useRef, useState } from "react";

import axios from "axios";

import dynamic from "next/dynamic";
// const HorizontalBarChart = dynamic(() => import("../shared/HorizontalBarChart"), { ssr: false });

function PageViewsChart() {
    const legends = ["Total Users", "Page Views", "Sessions", "Sessions Per User"];
    const [clientData, clientDataSet] = useState(null);

    useEffect(async () => {
        let res = await axios
            .get(`/api/admin/analytics/page-views`)
            .then((r) => r.data)
            .catch((err) => console.log(err));

        if (!res.isError) {
            let labels = [],
                arrayOfValues = [];

            for (let i = 0; i < res.rows.length; i++) {
                labels.push(res.rows[i].dimensionValues[0].value);
                let value = res.rows[i].metricValues[0].value;
                arrayOfValues.push(value);
            }

            clientDataSet({ labels, arrayOfValues });
        } else {
        }
    }, []);

    return <>{/* <HorizontalBarChart clientData={clientData} /> */}</>;
}
export default PageViewsChart;

// const data = {
//     labels,
//     datasets: [
//         {
//             label: legends[0],
//             data: clientData?.arrayOfValues[0],
//             borderColor: "rgb(255, 99, 132)",
//             backgroundColor: "rgba(255, 99, 132, 0.5)",
//             // barPercentage: 0.5
//         },
//         {
//             label: legends[1],
//             data: clientData?.arrayOfValues[1],
//             borderColor: "rgb(100,187,70)",
//             backgroundColor: "rgba(100,187,70, 0.5)",
//             color: "red",
//         },
//         {
//             label: legends[2],
//             data: clientData?.arrayOfValues[2],
//             borderColor: "rgb(90,200,217)",
//             backgroundColor: "rgba(90,200,217, 0.5)",
//         },
//         {
//             label: legends[3],
//             data: clientData?.arrayOfValues[3],
//             borderColor: "rgb(247,234,52)",
//             backgroundColor: "rgba(247,234,52, 0.5)",
//         },
//     ],
// };
