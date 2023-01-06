import React, { useEffect } from "react";
import s from "/sass/admin/admin.module.css";

const TableFooter = ({ range, setPage, page, slice }) => {
    useEffect(() => {
        if (slice.length < 1 && page !== 1) {
            setPage(page - 1);
        }
    }, [slice, page, setPage]);

    return (
        <div className={s.tableFooter}>
            <button
                disabled={page === 1}
                onClick={() => setPage(1)}
                className="py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
                {"<<"}
            </button>

            <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="ml-2 py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
                {"<"}
            </button>

            <button
                disabled={page === range.length}
                onClick={() => setPage(page + 1)}
                className="ml-2 py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-r border-0 border-l border-gray-700 hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
                {">"}
            </button>

            <button
                disabled={page === range.length}
                onClick={() => setPage(range.length)}
                className="ml-2 py-2 px-4 text-sm font-medium text-white bg-gray-800 rounded-r border-0 border-l border-gray-700 hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
                {">>"}
            </button>

            <span className="text-md text-gray-700 dark:text-gray-400 ml-2">
                Page <span className="font-semibold text-gray-900 dark:text-white">{page}</span> Of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">{range.length}</span>{" "}
            </span>
        </div>
    );
};

export default TableFooter;
