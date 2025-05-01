// components/FloatingOrb.tsx
import { motion, type Transition } from 'framer-motion';
import React, { useState } from 'react';

interface FloatingOrbProps {
    color: string;
    glowColor: string;
}

const FloatingOrb: React.FC<FloatingOrbProps> = ({ color, glowColor }) => {
    const [initialX] = useState(() => Math.random() * 100);
    const [initialY] = useState(() => Math.random() * 100);
    const [size] = useState(() => Math.random() * 10 + 5);

    const path = {
        initial: {
            left: `${initialX}%`,
            top: `${initialY}%`,
            opacity: 0.6,
            scale: 1,
            x: 0,
            y: 0,
        },
        animate: {
            x: Math.random() * 40 - 20,
            y: Math.random() * 40 - 20,
            opacity: 0.8,
            scale: [1, 1.1, 1],
            transition: {
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                repeatType: 'mirror' as Transition['repeatType'],
                ease: 'easeInOut',
            },
        },
    };

    return (
        <motion.div
            className="absolute rounded-full"
            style={{
                position: 'absolute',
                backgroundColor: color,
                width: size,
                height: size,
                boxShadow: `0 0 10px ${glowColor}`,
                left: `${initialX}%`,
                top: `${initialY}%`,
            }}
            variants={path}
            initial="initial"
            animate="animate"
        />
    );
};

export default FloatingOrb;