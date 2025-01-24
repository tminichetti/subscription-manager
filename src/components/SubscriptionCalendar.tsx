'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CalendarDays, Plus } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import AddSubscriptionModal from './AddSubscriptionModal';

type CalendarProps = {
    subscriptions: {
        id: string;
        name: string;
        price: number;
        startDate: Date;
        billingCycle: string;
        icon?: string;
    }[];
    monthlySpend: number;
};

export default function SubscriptionCalendar({ subscriptions, monthlySpend }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const { isSignedIn } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleSaveSubscription = async (subscriptionData: {
        name: string;
        startDate: string;
        price: number;
        billingCycle: string;
    }) => {
        try {
            const response = await fetch('/api/subscriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: subscriptionData.name,
                    startDate: subscriptionData.startDate,
                    price: subscriptionData.price,
                    billingCycle: subscriptionData.billingCycle
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            setIsModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de l\'enregistrement');
        }
    };

    return (
        <>
            <div className="w-full max-w-3xl mx-auto p-4 bg-card rounded-lg flex flex-col gap-4">
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
                        const subscriptionsForDay = subscriptions.filter(sub => {
                            const startDate = new Date(sub.startDate);
                            const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);

                            // Vérifier si c'est le jour de début
                            const isStartDay = startDate.getDate() === day &&
                                startDate.getMonth() === currentMonth.getMonth() &&
                                startDate.getFullYear() === currentMonth.getFullYear();

                            // Pour les renouvellements mensuels
                            const isMonthlyRenewal = sub.billingCycle === 'monthly' &&
                                startDate.getDate() === day && // Même jour du mois
                                currentDate > startDate; // Date après le début

                            // Pour les renouvellements annuels
                            const isYearlyRenewal = sub.billingCycle === 'yearly' &&
                                startDate.getDate() === day &&
                                startDate.getMonth() === currentMonth.getMonth() &&
                                currentDate > startDate &&
                                currentDate.getFullYear() > startDate.getFullYear();

                            return isStartDay || isMonthlyRenewal || isYearlyRenewal;
                        });

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
                                            className="text-xs p-1 mt-1 truncate bg-primary/10 rounded"
                                            title={`${sub.name} - ${sub.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`}
                                        >
                                            {sub.icon && <span className="mr-1">{sub.icon}</span>}
                                            <span className="font-medium">{sub.name}</span>
                                            <span className="text-muted-foreground ml-1">
                                                {sub.price.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bouton d'ajout d'abonnement */}
                {isSignedIn && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 w-full p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Ajouter un abonnement</span>
                    </button>
                )}
            </div>

            <AddSubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveSubscription}
            />
        </>
    );
} 