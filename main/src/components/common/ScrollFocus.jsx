import { useState, useEffect, useRef } from "react";

/**
 *  This components is prevent global lenis to be hijacking scrolling
 *  via horizontal direction & make normal scroll as horizontal
 */
const ScrollFocus = ({ children, direction = "horizontal" }) => {
    const scrollRef = useRef(null);
    const [hasOverflow, setHasOverflow] = useState(false);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const checkOverflow = () => {
            const overflow = 
                direction === "horizontal" 
                ? el.scrollWidth  > el.clientWidth 
                : el.scrollHeight > el.clientHeight;
            setHasOverflow(overflow);
        };

        checkOverflow();
        window.addEventListener("resize", checkOverflow);

        return () => {
            window.removeEventListener("resize", checkOverflow);
        };
    }, [direction]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el || !hasOverflow) return;

        const onWheel = (e) => {
            const deltaPrimary = direction === "horizontal" ? e.deltaY : e.deltaX;
            const deltaIgnore  = direction === "horizontal" ? e.deltaX : e.deltaY;

            const isIntendedDirection = Math.abs(deltaPrimary) > Math.abs(deltaIgnore);

            if (isIntendedDirection && !e.shiftKey) {
                e.preventDefault();
            }

            if (direction === "horizontal") {
                el.scrollLeft += e.deltaY;
            } else {
                el.scrollTop += e.deltaX;
            }
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [hasOverflow]);

    const style = {
        maxWidth: "100%",
        maxHeight: "100%",
        overflowX: direction === "horizontal" && hasOverflow ? "auto" : "hidden",
        overflowY: direction === "vertical" && hasOverflow ? "auto" : "hidden",
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
        touchAction: direction === "horizontal" ? "pan-x" : "pan-y",
        paddingBottom: direction === "horizontal" && hasOverflow ? "1rem" : undefined,
        paddingRight: direction === "vertical" && hasOverflow ? "1rem" : undefined,
    };

    return (
        <div
            ref={scrollRef}
            style={style}
            className="scroll-focus-container"
            {...(hasOverflow ? { "data-lenis-prevent": true } : {})}
        >
            {children}
        </div>
    );
};

export default ScrollFocus;
