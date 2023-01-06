import React from "react";
import AdminNavbar from "./Navbar";

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen admin ">
            <AdminNavbar />
            <main className="">
                <div className="container"> {children}</div>
            </main>
        </div>
    );
}
