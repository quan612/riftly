import React, { useEffect, useState } from "react";

function ThemeSwitch() {
    const [toggleTheme, setToggleTheme] = useState(
        () => JSON.parse(localStorage.getItem("toggleTheme")) || "light-theme"
    );
    useEffect(() => {
        localStorage.setItem("toggleTheme", JSON.stringify(toggleTheme));
        document.body.classList.add(toggleTheme);
        return () => {
            document.body.classList.remove(toggleTheme);
        };
    }, [toggleTheme]);

    return (
        <div
            className="theme-switch"
            onClick={() =>
                toggleTheme === "light-theme"
                    ? setToggleTheme("dark-theme")
                    : setToggleTheme("light-theme")
            }
        >
            {toggleTheme === "light-theme" ? (
                <i className="ri-moon-line"></i>
            ) : (
                <i className="ri-sun-line"></i>
            )}
        </div>
    );
}

export default ThemeSwitch;
