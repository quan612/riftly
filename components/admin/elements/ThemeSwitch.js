import React, { useEffect, useState } from "react";

import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    Flex,
    Switch,
    Text,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react";


function ThemeSwitch() {

    const { colorMode, toggleColorMode } = useColorMode();

    const [toggleTheme, setToggleTheme] = useState(
        () => JSON.parse(localStorage.getItem("toggleTheme")) || "light-theme"
    );
    useEffect(() => {

        localStorage.setItem("toggleTheme", JSON.stringify(toggleTheme));
        window.dispatchEvent(new Event("toggleTheme"));
        document.body.classList.add(toggleTheme);
        return () => {
            document.body.classList.remove(toggleTheme);
        };
    }, [toggleTheme]);


    const handleSwitchTheme = () => {
        if (toggleTheme === "light-theme") {
            setToggleTheme("dark-theme")
        } else {
            setToggleTheme("light-theme")
        }
        toggleColorMode()
    }
    return (
        <>
            <div
                className="theme-switch"
                onClick={() => handleSwitchTheme()}
            >
                {toggleTheme === "light-theme" ? (
                    <i className="ri-moon-line"></i>
                ) : (
                    <i className="ri-sun-line"></i>
                )}
            </div>
        </>
    );
}

export default ThemeSwitch;
