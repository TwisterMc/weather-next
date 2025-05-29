'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type UnitSystem = 'imperial' | 'metric';

interface UnitContextType {
    unitSystem: UnitSystem;
    setUnitSystem: (system: UnitSystem) => void;
}

const UnitContext = createContext<UnitContextType | null>(null);

export function UnitProvider({ children }: { children: ReactNode }) {
    const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');

    return <UnitContext.Provider value={{ unitSystem, setUnitSystem }}>{children}</UnitContext.Provider>;
}

export function useUnit() {
    const context = useContext(UnitContext);
    if (!context) {
        throw new Error('useUnit must be used within a UnitProvider');
    }
    return context;
}
