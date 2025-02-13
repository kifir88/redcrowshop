"use client";

import { useState, useEffect } from "react";

export default function ClientOnly({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div/>; // Or a loading placeholder

    return <>{children}</>;
}