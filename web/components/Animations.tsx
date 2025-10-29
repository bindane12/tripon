'use client';

import { FC, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedComponentProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const FadeInUp: FC<AnimatedComponentProps> = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const FadeIn: FC<AnimatedComponentProps> = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const SlideIn: FC<AnimatedComponentProps> = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const HoverScale: FC<AnimatedComponentProps> = ({ children, className = '', delay = 0 }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.2 }}
    className={className}
  >
    {children}
  </motion.div>
);