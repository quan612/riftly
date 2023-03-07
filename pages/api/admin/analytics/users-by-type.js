import { analyticsDataClient } from "../../../../context/GoogleApisContext";
import adminMiddleware from "middlewares/adminMiddleware";
import { prisma } from "@context/PrismaContext";
import { THIS_YEAR, LAST_YEAR } from "@enums/index";
import { getFirstDayOfLastYear, getFirstDayOfYear, getLastDayOfLastYear } from "@util/index";

async function AnalyticsUserByQuery(req, res) {
    const { method } = req;

    switch (method) {
        case "POST":
            try {
                const { filterBy } = req.body;

                let client = await analyticsDataClient();

                let variables = await prisma.questVariables.findFirst()

                const { googlePropertyId } = variables;

                let startDate = "", endDate = ""
                switch (filterBy) {
                    case THIS_YEAR:
                        startDate = getFirstDayOfYear().toISOString("YYYY-MM-DD").split('T')[0]; //google require YYYY-MM-DD
                        endDate = "today";
                        break;
                    case LAST_YEAR:
                        startDate = getFirstDayOfLastYear().toISOString("YYYY-MM-DD").split('T')[0];
                        endDate = getLastDayOfLastYear().toISOString("YYYY-MM-DD").split('T')[0];
                        break;
                    default:
                }


                const [response] = await client.runReport({
                    property: `properties/${googlePropertyId}`,

                    dimensions: [
                        {
                            name: "deviceCategory",
                        },
                    ],
                    metrics: [
                        {
                            name: "totalUsers",
                        },

                    ],
                    dateRanges: [
                        {
                            startDate: startDate, //"2023-01-01",
                            endDate,
                        },
                    ],
                });

                res.setHeader('Cache-Control', 'max-age=0, s-maxage=3600, stale-while-revalidate');
                res.status(200).json(response);
            } catch (err) {
                console.log(err)
                res.status(200).json({ isError: true, error: err.message });
            }
            break;
        default:
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}

export default adminMiddleware(AnalyticsUserByQuery)

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

 // console.log(response)
                // printRunReportResponse(response);
                // response.reports.forEach(report => {
                //     printRunReportResponse(report);
                // });

                // console.log(response?.rows[0]?.dimensionValues)
                // console.log(response?.rows[0]?.metricValues)
// let type = "browser"
// const [response] = await client.runReport({
//     property: `properties/${googlePropertyId}`,

//     // {
//     //     dimensions: [
//     //         {
//     //             name: 'country',
//     //         },
//     //         {
//     //             name: 'region',
//     //         },
//     //         {
//     //             name: 'city',
//     //         },
//     //     ],
//     //     metrics,
//     //     dateRanges: [
//     //         {
//     //             startDate: '2023-01-01',
//     //             endDate: 'today',
//     //         },
//     //     ],
//     // },
//     // {
//     //     dimensions: [
//     //         {
//     //             name: 'browser',
//     //         },
//     //     ],
//     //     metrics,
//     //     dateRanges: [
//     //         {
//     //             startDate: '2023-01-01',
//     //             endDate: 'today',
//     //         },
//     //     ],
//     // },

//     dimensions: [
//         {
//             name: "deviceCategory",
//         },
//     ],
//     metrics: [
//         {
//             name: "totalUsers",
//         },
//         // {
//         //     name: "screenPageViews"
//         // },
//         // {
//         //     name: "sessions"
//         // },
//         // {
//         //     name: "sessionsPerUser"
//         // },
//         // {
//         //     name: "bounceRate"
//         // },
//     ],
//     dateRanges: [
//         {
//             startDate: "2023-01-01",
//             endDate: "today",
//         },
//     ],
// });