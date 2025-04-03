"use client";

import { motion, useReducedMotion } from "motion/react";
import React from "react";

const FadeInStaggerContext = React.createContext(false);

const viewport = { once: true, margin: "0px 0px -200px" };

export const FadeIn = (
  props: React.ComponentPropsWithoutRef<typeof motion.div>,
) => {
  const shouldReduceMotion = useReducedMotion();
  const isInStaggerGroup = React.useContext(FadeInStaggerContext);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      {...(isInStaggerGroup
        ? {}
        : {
            initial: "hidden",
            whileInView: "visible",
            viewport,
          })}
      {...props}
    />
  );
};

export const FadeInStagger = ({
  faster = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.div> & {
  faster?: boolean;
}) => (
  <FadeInStaggerContext value={true}>
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{ staggerChildren: faster ? 0.06 : 0.1 }}
      {...props}
    />
  </FadeInStaggerContext>
);
