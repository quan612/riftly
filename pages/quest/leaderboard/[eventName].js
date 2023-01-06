import React, { useEffect, useState } from "react";
import s from "/sass/claim/claim.module.css";
import { useRouter } from "next/router";
import { Leaderboard } from "@components/end-user";
import axios from "axios";
import Enums from "enums";

const util = require("util");

function QuestLeaderBoard() {
    const router = useRouter();
    const { eventName } = router.query;
    const [questData, setQuestData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(async () => {
        if (!router.isReady || !eventName) return;

        setIsLoading(true);

        const res = await axios
            .get(`${Enums.BASEPATH}/api/user/quest/leaderboard`, {
                params: {
                    eventName,
                },
            })
            .then((r) => r.data);

        if (res && res.hasOwnProperty("userQuests")) {
            setQuestData(res);
            setIsLoading(false);
        }
    }, [router]);

    return (
        <>
            <div className={s.app}>
                {questData && <Leaderboard isLoading={isLoading} questData={questData} />}
            </div>
        </>
    );
}

export default QuestLeaderBoard;
