import { analyticsDataClient } from "../../../../context/GoogleApisContext";
import adminMiddleware from "middlewares/adminMiddleware";
import { prisma } from "@context/PrismaContext";

async function googleAnalyticsPageViewsQuery(req, res) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {

                console.log(1)
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
                            name: "pagePath",
                        },
                    ],
                    metrics: [
                        // {
                        //     name: "totalUsers",
                        // },
                        {
                            name: "screenPageViews"
                        },
                        // {
                        //     name: "sessions"
                        // },
                        // {
                        //     name: "sessionsPerUser"
                        // },
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
                });
                // console.log(response)
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

export default adminMiddleware(googleAnalyticsPageViewsQuery)

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

// const [response] = await client.runReport({
//     property: `properties/${propertyId}`,
//     requests: [
//         // {
//         //     dimensions: [
//         //         {
//         //             name: 'country',
//         //         },
//         //         {
//         //             name: 'region',
//         //         },
//         //         {
//         //             name: 'city',
//         //         },
//         //     ],
//         //     metrics,
//         //     dateRanges: [
//         //         {
//         //             startDate: '2023-01-01',
//         //             endDate: 'today',
//         //         },
//         //     ],
//         // },
//         // {
//         //     dimensions: [
//         //         {
//         //             name: 'browser',
//         //         },
//         //     ],
//         //     metrics,
//         //     dateRanges: [
//         //         {
//         //             startDate: '2023-01-01',
//         //             endDate: 'today',
//         //         },
//         //     ],
//         // },
//         {
//             dimensions: [
//                 {
//                     name: 'pagePath',
//                 },
//             ],
//             metrics: [
//                 {
//                     name: 'totalUsers',
//                 },
//                 { name: "screenPageViews" },
//                 { name: "bounceRate" }
//             ],
//             dateRanges: [
//                 {
//                     startDate: '2023-01-01',
//                     endDate: 'today',
//                 },
//             ],
//         },
//     ],
// });
