'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NotFound() {
    const pathname = usePathname();

    useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", pathname);
    }, [pathname]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="text-center space-y-6">
                {/* 404 Text with Cyberpunk Glow */}
                <h1 className="text-8xl md:text-9xl font-bold font-orbitron bg-linear-to-r from-neon-pink via-neon-purple to-neon-cyan bg-clip-text text-transparent glow-pink animate-pulse">
                    404
                </h1>

                <p className="text-2xl md:text-3xl font-orbitron text-foreground">
                    Signal Lost in the Matrix
                </p>

                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    The page you're looking for has been deleted, moved, or never existed in this timeline.
                </p>

                <Link
                    href="/"
                    className="inline-block mt-8 px-8 py-4 bg-neon-pink text-primary-foreground font-semibold rounded-xl glow-pink hover:scale-105 transition-all duration-300 shadow-lg"
                >
                    Return to Homebase
                </Link>
            </div>
        </div>
    );
}