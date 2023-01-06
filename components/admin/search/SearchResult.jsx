import React, { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import useTable from "@hooks/useTable";
import TableFooter from "../elements/Table/TableFooter";

const fetcher = async (url, req) => await axios.post(url, req).then((res) => res.data);

export default function SearchResults({ formData }) {
    const [isLoading, setIsLoading] = useState(false);
    const [tableData, setTableData] = useState(null);

    useEffect(async () => {
        let data = [],
            page = 0,
            searchRes = {};
        setIsLoading(true);

        try {
            do {
                searchRes = await axios.post(`/challenger/api/admin/search?page=${page}`, formData); //.then((res) => res.data);

                data = [...data, ...searchRes.data.users];
                page = page + 1;
            } while (searchRes?.data?.shouldContinue);
            setIsLoading(false);
            setTableData(data);
        } catch (error) {
            setIsLoading(false);
        }
    }, [formData]);

    if (!tableData || isLoading) return <div>Loading...</div>;

    return (
        <>
            <div className="card-header px-0">
                <h4 className=" mb-0">Result</h4>

                {/*      need to redo this as another function*/}
                {/* <div className="d-flex ">
                    <a
                        href={`data:text/csv;charset=utf-8,${encodeURIComponent(
                            BuildCsv(tableData)
                        )}`}
                        download={`Search - ${new Date().toISOString()}.csv`}
                        className="mr-2"
                    >
                        Export as CSV
                    </a>

                    <a
                        href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                            JSON.stringify(tableData)
                        )}`}
                        download={`Search - ${new Date().toISOString()}.json`}
                        className="mr-2"
                    >
                        Export as Json
                    </a>
                    <div className="text-green-600 font-bold">
                        Search Results: {tableData?.length}
                    </div>
                </div> */}
            </div>
            {tableData?.length > 0 && (
                <Table data={tableData} rowsPerPage={10} setTableData={setTableData} />
            )}
        </>
    );
}

const Table = ({ data, rowsPerPage, setTableData }) => {
    const [page, setPage] = useState(1);
    const { slice, range } = useTable(data, page, rowsPerPage);

    return (
        <div className="card">
            <div className="card-body">
                <div className="table-responsive table-icon">
                    <table className="table">
                        <thead>
                            <tr>
                                {/* <th className="col-2">User</th> */}
                                <th className="col-4">Wallet</th>
                                <th className="col-1">Twitter</th>
                                <th className="col-2">Discord</th>
                                <th className="col-3">Rewards</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slice.map((el, index) => {
                                return (
                                    <tr key={index}>
                                        {/* <td className="col-2">{el.userId}</td> */}
                                        <td className="col-4">{el.wallet}</td>
                                        <td className="col-2">{el.twitterUserName}</td>
                                        <td className="col-2">{el.discordUserDiscriminator}</td>
                                        <td className="col-2">
                                            {el?.rewards?.map((reward, rIndex) => {
                                                return (
                                                    <span key={rIndex} className="text-blue-500">
                                                        {rIndex === 0
                                                            ? `${reward.rewardType.reward} (${reward.quantity})`
                                                            : `, ${reward.rewardType.reward} (${reward.quantity})`}
                                                    </span>
                                                );
                                            })}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
                </div>
            </div>
        </div>
    );
};

const BuildCsv = async (data) => {
    const csvString = [
        [
            "UserID",
            "Wallet",
            "Twitter Id",
            "TwitterUserName",
            "Discord User Discriminator",
            "Discord Id",
            "Rewards",
        ],
        ...data.map((item) => [
            // item.userId,
            item.wallet,
            item.twitterId,
            item.twitterUserName,
            getDiscordUserDiscriminator(item.discordUserDiscriminator),
            item.discorId,

            flattenRewards(item.rewards),
        ]),
    ]
        .map((e) => e.join(","))
        .join("\n");

    return csvString;
};

const flattenRewards = (rewards) => {
    let res = "";
    rewards?.map((r) => {
        res = res + ` ${r.rewardType.reward}(${r.quantity}),`;
    });
    return res;
};

const getDiscordUserDiscriminator = (discordUserDiscriminator) => {
    if (discordUserDiscriminator === null) {
        return "";
    }
    let str = discordUserDiscriminator.split("#");
    return str[0] + "#" + str[1];
};
