'use client';

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { CalendarDays, Home, Settings } from "lucide-react";

export default function NavBar() {
    return (
        <nav className="fixed top-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-b z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo et titre */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-lg font-semibold hover:text-primary/80 transition-colors"
                        >
                            <CalendarDays className="h-6 w-6" />
                            <span>SubManager</span>
                        </Link>
                    </div>

                    {/* Navigation centrale */}
                    <div className="hidden sm:flex items-center gap-6">
                        <Link
                            href="/"
                            className="flex items-center gap-2 p-2 hover:bg-muted rounded-md transition-colors"
                        >
                            <Home className="h-4 w-4" />
                            <span>Accueil</span>
                        </Link>
                        <Link
                            href="/settings"
                            className="flex items-center gap-2 p-2 hover:bg-muted rounded-md transition-colors"
                        >
                            <Settings className="h-4 w-4" />
                            <span>Paramètres</span>
                        </Link>
                    </div>

                    {/* Profil utilisateur */}
                    <div className="flex items-center">
                        <UserButton
                            afterSignOutUrl="/"
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
                    </div>
                </div>
            </div>
        </nav>
    );
} 