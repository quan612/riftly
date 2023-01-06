import Link from "next/link";
import dynamic from "next/dynamic";
import React, { useState, useContext } from "react";

import { Web3Context } from "@context/Web3Context";
import Modal from "./elements/Modal";
import AdminLogin from "./AdminLogin";

const ThemeSwitch = dynamic(() => import("./elements/ThemeSwitch.js"), {
    ssr: false,
});

/**
 * The main navbar for the website.
 * @returns
 */
export default function AdminNavbar() {
    const [isToggled, setToggled] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const { SignOut, session } = useContext(Web3Context);
    const toggleTrueFalse = () => setToggled(!isToggled);

    const handleLogout = () => {
        SignOut();
    };

    return (
        <>
            <div className="header landing">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="navigation">
                                <nav className="navbar navbar-expand-lg navbar-light">
                                    <div className="brand-logo">
                                        <Link href="/">
                                            <a>
                                                {/* <img
                                                src="/images/logo.png"
                                                alt=""
                                                className="logo-primary"
                                            />
                                            <img
                                                src="/images/logow.png"
                                                alt=""
                                                className="logo-white"
                                            /> */}
                                            </a>
                                        </Link>
                                    </div>
                                    <button
                                        className="navbar-toggler"
                                        type="button"
                                        onClick={() => toggleTrueFalse()}
                                    >
                                        <span className="navbar-toggler-icon"></span>
                                    </button>
                                    <div
                                        className={
                                            isToggled
                                                ? "collapse navbar-collapse show"
                                                : "collapse navbar-collapse"
                                        }
                                    >
                                        <ul className="navbar-nav me-auto">
                                            <li className="nav-item dropdown">
                                                <Link href="/admin">
                                                    <a className="nav-link">Home</a>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link href="/admin/reward">
                                                    <a className="nav-link">Rewards</a>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link href="/admin/search">
                                                    <a className="nav-link">Search</a>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link href="/admin/quest">
                                                    <a className="nav-link">Quests</a>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link href="/admin/user">
                                                    <a className="nav-link">User</a>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link href="/admin/user-stats">
                                                    <a className="nav-link">Stats</a>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link href="/admin/config">
                                                    <a className="nav-link">Config</a>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="signin-btn d-flex align-items-center">
                                        <ThemeSwitch />
                                        {!session ? (
                                            <>
                                                <button
                                                    onClick={() => setModalOpen(true)}
                                                    className="btn btn-primary"
                                                >
                                                    Connect
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleLogout()}
                                                    className="btn btn-danger"
                                                >
                                                    Disconnect
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title="Test"
                render={(modal) => <AdminLogin closeModal={() => setModalOpen(false)} />}
                isConfirm={true}
            />
        </>
    );
}
