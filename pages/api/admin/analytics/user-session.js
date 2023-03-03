
import adminMiddleware from "middlewares/adminMiddleware";
import { prisma } from "@context/PrismaContext";
import { analyticsDataClient } from "@context/GoogleApisContext";

async function googleAnalyticsUserSessionQuery(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {


                let client = await analyticsDataClient();
                let variables = await prisma.questVariables.findFirst()
                const { googlePropertyId } = variables;

                const [response] = await client.runReport({
                    property: `properties/${googlePropertyId}`,

                    // {
                    //     dimensions: [
                    //         {
                    //             name: 'country',
                    //         },
                    //         {
                    //             name: 'region',
                    //         },
                    //         {
                    //             name: 'city',
                    //         },
                    //     ],
                    //     metrics,
                    //     dateRanges: [
                    //         {
                    //             startDate: '2023-01-01',
                    //             endDate: 'today',
                    //         },
                    //     ],
                    // },
                    // {
                    //     dimensions: [
                    //         {
                    //             name: 'browser',
                    //         },
                    //     ],
                    //     metrics,
                    //     dateRanges: [
                    //         {
                    //             startDate: '2023-01-01',
                    //             endDate: 'today',
                    //         },
                    //     ],
                    // },

                    dimensions: [
                        {
                            name: "week",
                        },
                    ],
                    metrics: [
                        // // {
                        // //     name: "totalUsers",
                        // // },
                        // {
                        //     name: "screenPageViews"
                        // },
                        {
                            name: "sessions"
                        },

                        // {
                        //     name: "bounceRate"
                        // },
                    ],
                    dateRanges: [
                        {
                            startDate: "2023-01-01",
                            endDate: "today",
                        },
                    ],
                    metricAggregations: [
                        "TOTAL"
                    ]
                });

                // printRunReportResponse(response);
                // response.reports.forEach(report => {
                //     printRunReportResponse(report);
                // });

                // console.log(response?.rows[0]?.dimensionValues)
                // console.log(response?.rows[0]?.metricValues)
                res.status(200).json(response);
            } catch (err) {
                res.status(200).json({ isError: true, error: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default adminMiddleware(googleAnalyticsUserSessionQuery)

function printRunReportResponse(response) {
    //[START analyticsdata_print_run_report_response_header]
    console.log(`${response.rowCount} rows received`);
    response.dimensionHeaders.forEach((dimensionHeader) => {
        console.log(`Dimension header name: ${dimensionHeader.name}`);
    });
    response.metricHeaders.forEach((metricHeader) => {
        console.log(`Metric header name: ${metricHeader.name} (${metricHeader.type})`);
    });
    //[END analyticsdata_print_run_report_response_header]

    // [START analyticsdata_print_run_report_response_rows]
    console.log("Report result:");
    response.rows.forEach((row) => {
        console.log(row.metricValues)
        console.log(`${row.dimensionValues[0].value}, ${row.metricValues[0].value}`);

    });
    // [END analyticsdata_print_run_report_response_rows]
}
const getFirstLastDayOfWeek = () => {
    const today = new Date()
    const day = today.getDay()
    const diff = (today.getDate() - day + (day === 0 ? -6 : 1))

    let monday = new Date(today.setDate(diff))
    let sunday = new Date(monday)
    sunday.setDate(sunday.getDate() + 6)

    return { monday: new Date(monday.setHours(0, 0, 0, 0)), sunday: new Date(sunday.setHours(23, 59, 59, 59)) }
}
