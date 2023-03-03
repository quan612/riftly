import { shortenAddress } from "./shortenAddress";

export const debounce = (func, wait) => {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

export const remove_duplicates_es6 = (arr) => {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
}

export const getUserName = (session) => {
    switch (session?.provider) {
        case "discord":
            return session?.profile?.username + "#" + session?.profile?.discriminator;
        case "twitter":
            return session?.profile?.data?.username;
        case "unstoppable-authenticate":
            return session?.user?.uauthUser;
        case "email":
            return session?.user?.email;
        default:
            if (session?.user?.address.length > 16)
                return shortenAddress(session?.user?.address);
            return ""; //session?.user?.wallet || shortenAddress(session?.user?.address);
    }
};

export function sleep(ms = 500) {
    return new Promise((res) => setTimeout(res, ms));
}

export const getTomorrow = () => new Date(new Date().setDate(new Date().getDate() + 1))
export const getFirstDayCurMonth = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1);
export const getLastDayCurMonth = () => new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
export const getFirstDayPrevMonth = () => new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
export const getLastDayPrevMonth = () => new Date(new Date().getFullYear(), new Date().getMonth(), 0);
export const getFirstDayOfYear = () => new Date(new Date().getFullYear(), 0, 1);

export const getFirstDayOfLastYear = () => new Date(new Date().getFullYear() - 1, 0, 1);
export const getLastDayOfLastYear = () => new Date(new Date().getFullYear() - 1, 11, 31);