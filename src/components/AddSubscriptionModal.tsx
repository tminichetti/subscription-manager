'use client';

import { CreditCard, X } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import { debounce } from 'lodash';

type AddSubscriptionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (subscription: {
        name: string;
        startDate: string;
        price: number;
        billingCycle: string;
        icon?: string;
    }) => void;
};

const getLogoUrl = (companyName: string) => {
    if (!companyName || companyName.length < 3) return undefined;

    const cleanName = companyName.toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .trim();

    return cleanName ? `https://logo.clearbit.com/${cleanName}.com` : undefined;
};

export default function AddSubscriptionModal({ isOpen, onClose, onSave }: AddSubscriptionModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        price: '',
        billingCycle: 'monthly'
    });

    const [detectedLogo, setDetectedLogo] = useState<string | undefined>(undefined);
    const [logoError, setLogoError] = useState(false);

    // Créer une version debounced de la fonction de mise à jour du logo
    const debouncedSetLogo = useCallback(
        debounce((name: string) => {
            setDetectedLogo(getLogoUrl(name));
        }, 500), // Attendre 500ms après la dernière frappe
        []
    );

    useEffect(() => {
        if (formData.name && formData.name.length >= 3) {
            debouncedSetLogo(formData.name);
        } else {
            setDetectedLogo(undefined);
        }

        // Cleanup
        return () => {
            debouncedSetLogo.cancel();
        };
    }, [formData.name, debouncedSetLogo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.startDate || !formData.price) {
            alert('Veuillez remplir tous les champs');
            return;
        }

        onSave({
            name: formData.name,
            startDate: formData.startDate,
            price: parseFloat(formData.price),
            billingCycle: formData.billingCycle,
            icon: detectedLogo // Envoyer l'URL du logo
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
                    <div className="relative">
                        <label className="block text-lg mb-2">Nom de l&apos;abonnement</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Netflix, Spotify..."
                                className="w-full p-2 pl-10 rounded-lg bg-muted border border-border"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                {detectedLogo && !logoError ? (
                                    <img
                                        src={detectedLogo}
                                        alt={formData.name}
                                        className="h-6 w-6 object-contain"
                                        onError={() => {
                                            setLogoError(true);
                                            setDetectedLogo(undefined);
                                        }}
                                    />
                                ) : (
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                )}
                            </div>
                        </div>
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