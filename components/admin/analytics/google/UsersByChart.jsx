import { useEffect, useRef, useState } from "react";

import axios from "axios";
import dynamic from "next/dynamic";
const PieChart = dynamic(() => import("../shared/PieChart"), { ssr: false });

function UsersByChart() {
    const [clientData, clientDataSet] = useState(null);
    useEffect(async () => {
        let res = await axios
            .post(`/api/admin/analytics/users-by-type`, {
                byType: "browser",
            })
            .then((r) => r.data)
            .catch((err) => console.log(err));

        if (!res.isError) {
            let labels = [],
                arrayOfValues = [];

            console.log(arrayOfValues);
            for (let i = 0; i < res.rows.length; i++) {
                let label = res.rows[i].dimensionValues[0].value;
                let value = res.rows[i].metricValues[0].value;
                arrayOfValues.push(value);
                labels.push(`${label} - ${value}`);
            }

            clientDataSet({
                labels,
                values: arrayOfValues,
                title: "Users By Browser",
                datasetLabel: "# of Total Users",
            });
        } else {
        }
    }, []);

    return <>{clientData && <PieChart clientData={clientData} />}</>;
}
export default UsersByChart;
