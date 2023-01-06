import React, { useEffect, useState, useCallback } from "react";
import useSWR from "swr";
import axios from "axios";
import { BuildCsv } from "./BuildCsv";
import useTable from "@hooks/useTable";
import TableFooter from "../elements/Table/TableFooter";
import { utils } from "ethers";
const fetcher = async (url, req) => await axios.post(url, req).then((res) => res.data);

const USER_STATS_SEARCH = "/challenger/api/admin/user-stats";
function sleep(ms = 500) {
    return new Promise((res) => setTimeout(res, ms));
}

export default function UserStatsSearchResult({ formData }) {
    // const { data, error } = useSWR([USER_STATS_SEARCH, formData], fetcher);
    const [apiError, setApiError] = useState(null);
    const [tableData, setTableData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getNftOwners = useCallback(async (formData) => {
        let cursor = "";
        let nftOwners = [];
        do {
            let contractQuery = await axios
                .get(
                    `/challenger/api/admin/user-stats/contract/${formData.contract.trim()}/${
                        formData.chainId
                    }/${cursor}`,
                    formData
                )
                .then((r) => r.data);

            for (const nft of contractQuery.result) {
                nftOwners = [...nftOwners, nft];
            }

            cursor = contractQuery?.cursor;

            sleep();
        } while (cursor != null && cursor != "");

        return nftOwners;
    });

    useEffect(async () => {
        setIsLoading(true);
        let data = [];
        console.time();
        try {
            if (formData.contract.trim().length === 0 && formData.wallet.trim().length > 0) {
                // searching individual
                let res = await axios
                    .get(`/challenger/api/admin/user-stats/${formData.wallet}/${formData.chainId}`)
                    .then((r) => r.data);

                data = [...data, res];
            }
            if (formData.contract.trim().length > 0) {
                /* searching contract*/
                let nftOwners = await getNftOwners(formData);

                if (formData.wallet.trim().length > 0) {
                    /* searching contract and individual */
                    let walletOwners = nftOwners.map((nft) => utils.getAddress(nft.owner_of));

                    if (walletOwners.includes(utils.getAddress(formData.wallet))) {
                        // walletOwners = utils.getAddress(formData.wallet);
                        // let searchRes = {};

                        // searchRes = await axios
                        //     .post(`/challenger/api/admin/user-stats/wallets`, { walletOwners })
                        //     .then((r) => r.data);

                        // data = [...data, ...searchRes.users];
                        /* this is just searching individual, as it exists on the contract nft */
                        let res = await axios
                            .get(
                                `/challenger/api/admin/user-stats/${formData.wallet}/${formData.chainId}`
                            )
                            .then((r) => r.data);

                        data = [...data, res];
                    } else {
                        data = [];
                    }
                } else {
                    let walletOwners = nftOwners.map((nft) => utils.getAddress(nft.owner_of));
                    walletOwners = remove_duplicates_es6(walletOwners);

                    let searchRes = {};

                    searchRes = await axios
                        .post(`/challenger/api/admin/user-stats/wallets`, { walletOwners })
                        .then((r) => r.data);

                    data = [...data, ...searchRes.users];
                }
            }
            if (formData.contract.trim().length === 0 && formData.wallet.trim().length === 0) {
                // searching everyone in the database
                let page = 0,
                    searchRes = {};

                do {
                    searchRes = await axios.post(
                        `/challenger/api/admin/user-stats?page=${page}`,
                        formData
                    );

                    data = [...data, ...searchRes.data.users];
                    page = page + 1;
                } while (searchRes?.data?.shouldContinue);
            }
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
        console.timeEnd();
        setTableData(data);
        setIsLoading(false);
    }, [formData]);

    if (apiError) {
        return <div>API Error: {apiError}</div>;
    }
    if (!tableData || isLoading) return <div>Loading...</div>;
    console.log(tableData);
    return (
        <>
            <div className="card-header px-0">
                <h4 className=" mb-0">Result</h4>
                <div className="d-flex ">
                    {/* <a
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
                    </a> */}
                    <div className="text-green-600 font-bold">
                        Search Results: {tableData?.length}
                    </div>
                </div>
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
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const handleSortChange = (accessor) => {
        const newOrder = accessor === sortField && sortOrder === "asc" ? "desc" : "asc";
        setSortField(accessor);
        setSortOrder(newOrder);
        handleSorting(accessor, newOrder, data);
    };

    const handleSorting = (sortField, sortOrder) => {
        try {
            if (sortField) {
                const sortedData = [...data].sort((a, b) => {
                    if (
                        a.whiteListUserData === null ||
                        a.whiteListUserData.data[sortField] === null ||
                        !a.whiteListUserData.data[sortField]
                    )
                        return 1;

                    if (
                        b.whiteListUserData === null ||
                        b.whiteListUserData.data[sortField] === null ||
                        !b.whiteListUserData.data[sortField]
                    )
                        return -1;

                    if (
                        (a.whiteListUserData.data[sortField] === null &&
                            b.whiteListUserData.data[sortField] === null) ||
                        (a.whiteListUserData === null && b.whiteListUserData === null)
                    )
                        return 0;

                    return (
                        a.whiteListUserData.data[sortField]
                            .toString()
                            .localeCompare(b.whiteListUserData.data[sortField].toString(), "en", {
                                numeric: true,
                            }) * (sortOrder === "asc" ? 1 : -1)
                    );
                });
                setTableData(sortedData);
            }
        } catch (error) {}
    };

    return (
        <div className="card">
            <div className="card-body">
                <div className="table-responsive table-icon">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="col-4">Wallet</th>
                                <th className="col-1">Twitter</th>
                                <th className="col-1">Discord</th>
                                <th
                                    className={`col-1 ${
                                        sortField &&
                                        sortField === "followers_count" &&
                                        sortOrder === "asc"
                                            ? "up"
                                            : sortField &&
                                              sortField === "followers_count" &&
                                              sortOrder === "desc"
                                            ? "down"
                                            : "default"
                                    }`}
                                    key={"followers_count"}
                                    onClick={() => handleSortChange("followers_count")}
                                >
                                    Followers
                                </th>
                                <th
                                    className={`col-1 ${
                                        sortField && sortField === "eth" && sortOrder === "asc"
                                            ? "up"
                                            : sortField &&
                                              sortField === "eth" &&
                                              sortOrder === "desc"
                                            ? "down"
                                            : "default"
                                    }`}
                                    key={"eth"}
                                    onClick={() => handleSortChange("eth")}
                                >
                                    ETH
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {slice.map((el, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="col-3">{el.wallet}</td>
                                        <td className="col-1">{el.twitterUserName}</td>
                                        <td className="col-1">{el.discordUserDiscriminator}</td>
                                        <td className="col-1">
                                            {el.whiteListUserData?.data?.followers_count || 0}
                                        </td>
                                        <td className="col-1">
                                            {el.balance || el.whiteListUserData?.data?.eth || 0}
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

function remove_duplicates_es6(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
}
/*
                console.time();
                do {
                    searchRes = await axios
                        .post(`/challenger/api/admin/user-stats?page=${page}`, formData)
                        .then((r) => r.data);

                    temp = [...temp, ...searchRes.users];
                    page = page + 1;
                } while (searchRes?.shouldContinue);

                console.log("temp.length", temp.length);

                let whitelistUsers = [];
                let whitelistUserWallet = temp.map((w) => utils.getAddress(w.wallet));
                let mapOp = walletOwners.map((wallet) => {
                    console.log("Processing nft owner");
                    if (whitelistUserWallet.includes(wallet)) {
                        whitelistUsers.push(wallet);
                    }
                  
                });

                await Promise.all(mapOp);
                whitelistUsers = remove_duplicates_es6(whitelistUsers);
                */
/* if (data) {
            try {
              old implement to cache the nft, run very long, may not be feasible, should take another approach
                if (formData.contract.length > 0) {
                    let filtered = [];
                    setIsLoading(true);

                    // request a job to run
                    let res = await axios.post(`/challenger/api/admin/user-stats/update`, {
                        contract: formData.contract,
                        chainId: formData.chainId,
                    });

                    if (res.data?.isStale == true) {
                        let request;
                        do {
                            request = await axios.get(
                                `/challenger/api/admin/user-stats/getJobState`
                            );

                            await timer(3000);
                        } while (request.data.state !== "completed");
                    }

                    res = await axios.get(
                        `/challenger/api/admin/user-stats/getMoralisData?contractAddress=${formData.contract}`
                    );

                    filtered = data.filter((d) => {
                        let index = res.data.contractData.findIndex(
                            (e) => e.toLowerCase() == d.wallet.toLowerCase()
                        );
                        if (index !== -1) {
                            return true;
                        } else return false;
                    });

                    setIsLoading(false);
                    return setTableData(filtered);
                 
                }
         
            } catch (error) {
                setApiError(error?.message);
                setIsLoading(false);
            }
        }
  */

// let data = [],
//     page = 0,
//     searchRes = {};
// setIsLoading(true);

// try {
//     do {
//         searchRes = await axios.post(
//             `/challenger/api/admin/user-stats?page=${page}`,
//             formData
//         );

//         data = [...data, ...searchRes.data.users];
//         page = page + 1;
//     } while (searchRes?.data?.shouldContinue);
//     setIsLoading(false);
//     setTableData(data);
// } catch (error) {
//     setIsLoading(false);
// }
// setTableData(data);
