import React from 'react';

interface TooltipProps {
    message: string;
}

const Tooltip: React.FC<TooltipProps> = ({ message }) => {
    return <div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded-lg p-2 shadow-lg z-10">{message}</div>;
};

export default Tooltip;
