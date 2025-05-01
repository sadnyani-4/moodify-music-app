// components/FloatingOrbs.tsx
import React from 'react';
import FloatingOrb from './FloatingOrb';

interface FloatingOrbsProps {
    joyColor: string;
    sadnessColor: string;
    angerColor: string;
    fearColor: string;
    disgustColor: string;
    longTermMemoryColor: string;
    numberOfOrbs?: number;
}

const FloatingOrbs: React.FC<FloatingOrbsProps> = ({
    joyColor,
    sadnessColor,
    angerColor,
    fearColor,
    disgustColor,
    longTermMemoryColor,
    numberOfOrbs = 80,
}) => {
    const colors = [joyColor, sadnessColor, angerColor, fearColor, disgustColor, longTermMemoryColor, longTermMemoryColor];

    return (
        <div style={{ zIndex: 0, position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
            {Array.from({ length: numberOfOrbs }).map((_, index) => {
                const randomColor = colors[index % colors.length];

                return (
                    <FloatingOrb
                        key={index}
                        color={randomColor}
                        glowColor={randomColor}
                    />
                );
            })}
        </div>
    );
};

export default FloatingOrbs;