import React, { useContext } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";

export default function DisconnectButton() {
    const { SignOut } = useContext(Web3Context);
    return (
        <button className={s.boardLarge_disconnect} onClick={() => SignOut()}>
            <img
                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Disconnect.png`}
                alt="connectToContinue"
            />
            <div>
                <span>Disconnect</span>
            </div>
        </button>
    );
}
