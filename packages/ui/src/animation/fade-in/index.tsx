'use client';

import * as React from 'react';
import { createContext, useContext } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const FadeInStaggerContext = createContext(false);

const viewport = { once: true, margin: '0px 0px -200px' };

export const FadeIn = ({ children, ...props }: React.ComponentPropsWithoutRef<typeof motion.div>) => {
  const shouldReduceMotion = useReducedMotion();
  const isInStaggerGroup = useContext(FadeInStaggerContext);
  const MotionDiv = motion.div;

  return (
    <MotionDiv
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      {...(isInStaggerGroup
        ? {}
        : {
            initial: 'hidden',
            whileInView: 'visible',
            viewport,
          })}
      {...props}
    >
      {children}
    </MotionDiv>
  );
};

export const FadeInStagger = ({
  children,
  faster = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.div> & { faster?: boolean }) => {
  const MotionDiv = motion.div;

  return (
    <FadeInStaggerContext.Provider value={true}>
      <MotionDiv
        initial='hidden'
        whileInView='visible'
        viewport={viewport}
        transition={{ staggerChildren: faster ? 0.12 : 0.2 }}
        {...props}
      >
        {children}
      </MotionDiv>
    </FadeInStaggerContext.Provider>
  );
};
