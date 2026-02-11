"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
    progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />
        </div>
    );
}
