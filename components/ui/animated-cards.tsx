"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverRotate?: number;
  delay?: number;
  duration?: number;
}

export const AnimatedCard = ({ 
  children, 
  className = "",
  hoverScale = 1.05,
  hoverRotate = 2,
  delay = 0,
  duration = 0.3
}: AnimatedCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15.5deg", "-15.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15.5deg", "15.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      whileHover={{
        scale: hoverScale,
        rotateZ: hoverRotate,
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      viewport={{ once: true }}
      className={`${className}`}
    >
      <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};

export const GlassCard = ({ 
  children, 
  className = "",
  blur = "blur-xl",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  blur?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
      viewport={{ once: true }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl ${blur} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const GradientCard = ({ 
  children, 
  className = "",
  gradient = "from-purple-600 via-blue-600 to-purple-600",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeOut",
      }}
      viewport={{ once: true }}
      whileHover={{
        y: -10,
        transition: { duration: 0.3 },
      }}
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-8 shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const FloatingCard = ({ 
  children, 
  className = "",
  duration = 6,
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeOut",
      }}
      viewport={{ once: true }}
      animate={{
        y: [-10, 10, -10],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`${className}`}
    >
      {children}
    </motion.div>
  );
};

export const InteractiveCard = ({ 
  children, 
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
      viewport={{ once: true }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      }}
      whileTap={{
        scale: 0.95,
      }}
      className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const ParallaxCard = ({ 
  children, 
  className = "",
  speed = 0.5,
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{
        duration: 0.8,
        delay,
        ease: "easeOut",
      }}
      viewport={{ once: true }}
      className={`${className}`}
    >
      {children}
    </motion.div>
  );
};

export const MorphingCard = ({ 
  children, 
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, borderRadius: "50%" }}
      whileInView={{ opacity: 1, borderRadius: "16px" }}
      transition={{
        duration: 1,
        delay,
        ease: "easeOut",
      }}
      viewport={{ once: true }}
      whileHover={{
        borderRadius: "24px",
        transition: { duration: 0.3 },
      }}
      className={`bg-white shadow-xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}; 