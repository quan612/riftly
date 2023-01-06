import React from "react";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { useDeviceDetect } from "lib/hooks";

export default function RenderBoardImage() {
    const { isMobile } = useDeviceDetect();
    return (
        <>
            {isMobile && (
                <img
                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/board_large.png`}
                    alt="Board Layout"
                    className={`${s.boardLarge_bgImg}  `}
                />
            )}
            {!isMobile && (
                <img
                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/board_med.png`}
                    alt="Board Layout"
                    className={`${s.boardLarge_bgImg}  `}
                />
            )}
        </>
    );
}
