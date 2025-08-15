"use client"

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
}

export const AnimatedText = ({ 
  text, 
  className = "", 
  delay = 0, 
  duration = 0.5,
  stagger = 0.05,
  once = true
}: AnimatedTextProps) => {
  const words = text.split(" ");

  return (
    <motion.div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration,
            delay: delay + index * stagger,
          }}
          viewport={{ once }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export const AnimatedHeading = ({ 
  text, 
  className = "", 
  variant = "h1" 
}: {
  text: string;
  className?: string;
  variant?: "h1" | "h2" | "h3" | "h4";
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  const headingClasses = {
    h1: "text-5xl lg:text-7xl font-bold",
    h2: "text-4xl lg:text-5xl font-bold", 
    h3: "text-3xl lg:text-4xl font-semibold",
    h4: "text-2xl lg:text-3xl font-semibold"
  };

  return (
    <motion.div
      ref={containerRef}
      style={{ y, opacity }}
      className={`${headingClasses[variant]} ${className}`}
    >
      {text}
    </motion.div>
  );
};

export const GradientText = ({ 
  text, 
  className = "",
  gradient = "from-purple-600 via-blue-600 to-purple-600"
}: {
  text: string;
  className?: string;
  gradient?: string;
}) => {
  return (
    <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}>
      {text}
    </span>
  );
};

export const TypewriterText = ({ 
  text, 
  className = "",
  speed = 50,
  delay = 0
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <motion.span
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{
          duration: text.length * speed / 1000,
          delay,
          ease: "easeInOut"
        }}
        className="inline-block overflow-hidden whitespace-nowrap"
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

export const AnimatedCounter = ({ 
  value, 
  duration = 2,
  className = ""
}: {
  value: number;
  duration?: number;
  className?: string;
}) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        initial={{ number: 0 }}
        whileInView={{ number: value }}
        transition={{ duration }}
      >
        {Math.round(useTransform(useTransform(0, [0, value], [0, value]), (val) => val).get())}
      </motion.span>
    </motion.span>
  );
};

export const FloatingText = ({ 
  text, 
  className = "",
  duration = 3,
  delay = 0
}: {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-10, 10, -10],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {text}
    </motion.div>
  );
};

export const RevealText = ({ 
  text, 
  className = "",
  direction = "up",
  delay = 0
}: {
  text: string;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
}) => {
  const directionVariants = {
    up: { initial: { y: 50, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    down: { initial: { y: -50, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    left: { initial: { x: 50, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    right: { initial: { x: -50, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  };

  return (
    <motion.div
      className={className}
      initial={directionVariants[direction].initial}
      whileInView={directionVariants[direction].animate}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeOut"
      }}
      viewport={{ once: true }}
    >
      {text}
    </motion.div>
  );
}; 