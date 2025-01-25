'use client';

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

export default function NavBar() {
    return (
        <nav className="fixed top-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-b z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo et titre */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-xl font-bold tracking-tight hover:text-primary/80 transition-colors"
                        >
                            <CalendarDays className="h-6 w-6" />
                            <span>SubTrack</span>
                        </Link>
                    </div>

                    {/* Auth buttons */}
                    <div>
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton
                                showName={true}
                                appearance={{
                                    elements: {
                                        avatarBox: "h-8 w-8",
                                        userButtonPopoverCard: "text-foreground",
                                        userPreviewMainIdentifier: "text-foreground",
                                        userPreviewSecondaryIdentifier: "text-muted-foreground"
                                    }
                                }}
                            />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </nav>
    );
} 