import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const pageVariants = {
  initial: {
    x: 300,
  },
  enter: {
    x: 0,
    transition: {
      type: "spring",
      damping: 20,
      mass: 1,
    },
  },
  exit: {
    x: -300,
    transition: {
      type: "spring",
      damping: 20,
      mass: 1,
    },
  },
};
const PageAnimation = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimatePresence>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageAnimation;
