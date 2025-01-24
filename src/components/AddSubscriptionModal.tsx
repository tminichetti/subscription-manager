'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

type AddSubscriptionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (subscription: {
        name: string;
        startDate: string;
        price: number;
        renewalDate: string;
    }) => void;
};

export default function AddSubscriptionModal({ isOpen, onClose, onSave }: AddSubscriptionModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        price: '',
        billingCycle: 'monthly'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Utiliser la date de début comme première date de renouvellement
        const startDate = new Date(formData.startDate);

        onSave({
            name: formData.name,
            startDate: startDate.toISOString(),
            price: parseFloat(formData.price),
            renewalDate: startDate.toISOString() // Utiliser la même date pour commencer
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-2xl font-semibold mb-6">Ajouter un abonnement</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-lg mb-2">Nom de l&apos;abonnement</label>
                        <input
                            type="text"
                            placeholder="Netflix, Spotify..."
                            className="w-full p-2 rounded-lg bg-muted border border-border"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-lg mb-2">Date de début</label>
                        <input
                            type="date"
                            className="w-full p-2 rounded-lg bg-muted border border-border"
                            value={formData.startDate}
                            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-lg mb-2">Fréquence de facturation</label>
                        <select
                            className="w-full p-2 rounded-lg bg-muted border border-border"
                            value={formData.billingCycle}
                            onChange={(e) => setFormData(prev => ({ ...prev, billingCycle: e.target.value }))}
                            required
                        >
                            <option value="monthly">Mensuel</option>
                            <option value="yearly">Annuel</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-lg mb-2">Coût</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="9.99"
                            className="w-full p-2 rounded-lg bg-muted border border-border"
                            value={formData.price}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="flex-1 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 