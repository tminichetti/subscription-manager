'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CalendarDays } from 'lucide-react';

type CalendarProps = {
    subscriptions: {
        id: string;
        name: string;
        price: number;
        renewalDate: Date;
        icon?: string;
    }[];
    monthlySpend: number;
};

export default function SubscriptionCalendar({ subscriptions, monthlySpend }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        // Convertir dimanche (0) en 7 pour l'alignement avec lundi (1)
        return firstDay.getDay() || 7;
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4 bg-card rounded-lg">
            {/* En-tête du calendrier */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                        className="p-2 hover:bg-muted rounded-full"
                    >
                        ←
                    </button>
                    <h2 className="text-xl font-semibold capitalize">
                        {currentMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                        className="p-2 hover:bg-muted rounded-full"
                    >
                        →
                    </button>
                    <button
                        onClick={goToToday}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted rounded-md transition-colors"
                    >
                        <CalendarDays className="h-4 w-4" />
                        <span>Aujourd&apos;hui</span>
                    </button>
                </div>
                <div className="text-xl font-bold">
                    {monthlySpend.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </div>
            </div>

            {/* Grille des jours */}
            <div className="grid grid-cols-7 gap-1">
                {['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                        {day}
                    </div>
                ))}

                {/* Cases vides pour l'alignement */}
                {Array.from({ length: getFirstDayOfMonth(currentMonth) - 1 }).map((_, index) => (
                    <div key={`empty-${index}`} className="aspect-square p-2 border rounded-lg opacity-50" />
                ))}

                {/* Jours du mois */}
                {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, index) => {
                    const day = index + 1;
                    const subscriptionsForDay = subscriptions.filter(sub =>
                        new Date(sub.renewalDate).getDate() === day &&
                        new Date(sub.renewalDate).getMonth() === currentMonth.getMonth()
                    );

                    return (
                        <div
                            key={day}
                            className={cn(
                                "aspect-square p-2 border rounded-lg",
                                "hover:bg-muted transition-colors",
                                "relative flex flex-col",
                                subscriptionsForDay.length > 0 && "bg-accent"
                            )}
                        >
                            <div className="text-sm absolute bottom-1 left-1/2 -translate-x-1/2 text-muted-foreground">
                                {day}
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {subscriptionsForDay.map(sub => (
                                    <div
                                        key={sub.id}
                                        className="text-xs mt-1 truncate"
                                        title={`${sub.name} - ${sub.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`}
                                    >
                                        {sub.icon && <span className="mr-1">{sub.icon}</span>}
                                        {sub.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 