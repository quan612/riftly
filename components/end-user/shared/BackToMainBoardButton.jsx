import React, { useContext } from "react";

import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { useRouter } from "next/router";

export default function BackToMainBoardButton() {
    const router = useRouter();
    return (
        <button
            className={s.board_tealBtn}
            onClick={() => {
                router.push("/");
            }}
        >
            <img
                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large 3.png`}
                alt="Back To Quest page"
            />
            <div>
                <span>Back to quests</span>
            </div>
        </button>
    );
}
