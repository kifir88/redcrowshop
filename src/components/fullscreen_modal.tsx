"use client";

import { useEffect, useState } from "react";

export default function FullscreenModal() {
    const [isVisible, setIsVisible] = useState(false);
    const [content, setContent] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
            fetchPopupContent();
        }, 10 * 1000); // 20 minutes

        return () => clearTimeout(timer);
    }, []);

    async function fetchPopupContent() {
        try {
            const response = await fetch("/api/popup");
            if (!response.ok) throw new Error("Failed to fetch popup content");

            const data = await response.json();
            setContent(data.content.rendered);
        } catch (error) {
            console.error("Error fetching popup content:", error);
        }
    }

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="relative bg-white p-8 rounded-lg shadow-lg w-full max-w-lg text-center">
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
                >
                    &times;
                </button>
                <div
                    className="prose w-full lg:prose-xl"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </div>
        </div>
    );
}