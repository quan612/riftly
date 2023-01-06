import React from "react";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { useRouter } from "next/router";
import { BoardSmallDollarSign } from "@components/end-user";

function Unauthorized() {
    let router = useRouter();
    return (
        <>
            <div className={s.app}>
                <div className={s.board}>
                    <div className={s.board_container}>
                        <BoardSmallDollarSign />
                        <div className={s.board_wrapper}>
                            <div className={s.board_content}>
                                {/* <div className="flex justify-center content-center h1 text-red-400">
                                    Unauthorized access
                                </div> */}
                                <>
                                    <div className={s.board_text}>
                                        User not found. Please sign up.
                                    </div>
                                    <button
                                        className={s.board_pinkBtn}
                                        onClick={() => {
                                            router.push("/");
                                        }}
                                    >
                                        <img
                                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large.png`}
                                            alt="Go Back"
                                        />
                                        <div>
                                            <span>Go Back</span>
                                        </div>
                                    </button>
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Unauthorized;
