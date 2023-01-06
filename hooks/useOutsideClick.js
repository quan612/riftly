import { useEffect } from "react";

export const useOutsideClick = (ref, outsideRef = null, callback) => {
    useEffect(() => {
        /**
         * Execute callback function clicked on outside of element
         */
        function handleClickOutside(event) {
            if (outsideRef && outsideRef.current)
                if (
                    ref.current &&
                    !ref.current.contains(event.target) &&
                    !outsideRef.current.contains(event.target)
                ) {
                    callback();
                }

            if (outsideRef === null) {
                if (ref.current && !ref.current.contains(event.target)) {
                    callback();
                }
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
};
