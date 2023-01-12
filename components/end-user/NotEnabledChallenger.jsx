import React, { useEffect, useState, useContext } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { BoardSmallDollarSign } from ".";
import { DisconnectButton } from "./shared";

const NotEnabledChallenger = ({ session }) => {
    const { SignOut } = useContext(Web3Context);
    return (
        <div className={s.board}>
            <div className={s.board_container}>
                <BoardSmallDollarSign />
                <div className={s.board_wrapper}>
                    <div className={s.board_content}>
                        <>
                            <div className={s.board_goneFishTitle}>CLOSED - GONE FISHIN'</div>
                            <div className={s.board_goneFishText}>
                                The DeepSea Challenger has been paused.
                            </div>
                            <div className={s.board_goneFishText}>
                                Check back on <span>November 15</span>!
                            </div>
                            <button
                                className={s.board_pinkBtn}
                                onClick={() => {
                                    window.open(`https://www.anomuragame.com/shell-redemption`);
                                }}
                            >
                                <img
                                    src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large.png`}
                                    alt="connectToContinue"
                                />
                                <div>
                                    <span>LET’S GO</span>
                                </div>
                            </button>
                        </>
                    </div>
                </div>
            </div>
            <DisconnectButton />
        </div>
    );
};

export default NotEnabledChallenger;
