// src/components/DynamicIsland.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DynamicIslandProps {
    message: string;
    show: boolean;
    onClose: () => void;
}

const DynamicIsland: React.FC<DynamicIslandProps> = ({ message, show, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 2000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-lg z-50"
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DynamicIsland;
