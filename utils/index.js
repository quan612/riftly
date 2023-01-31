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