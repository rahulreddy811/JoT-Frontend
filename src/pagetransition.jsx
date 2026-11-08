import { motion } from "motion/react";
import { Children } from "react";

function PageTransition({ children }) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 30
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            exit={{
                opacity: 0,
                y: -30
            }}
            transition={{
                duration: 0.4,
                ease: "easeOut"
            }}
            style={{
                width: "100%",
                minHeight: "100vh"
            }}
        >
            {children}
        </motion.div>
    );
}



export default PageTransition