"use client";

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";

interface ClassesPackageContextValue {
	/** Package id from CLASS_PACKAGES ("starter" | "standard" | "intensive"). */
	selectedPackage: string | null;
	selectPackage: (packageId: string) => void;
}

const ClassesPackageContext = createContext<ClassesPackageContextValue | null>(
	null,
);

/**
 * Lets the pricing cards hand a chosen plan to the application form without
 * threading props through every section in between.
 */
export function ClassesPackageProvider({ children }: { children: ReactNode }) {
	const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

	const selectPackage = useCallback((packageId: string) => {
		setSelectedPackage(packageId);
	}, []);

	const value = useMemo(
		() => ({ selectedPackage, selectPackage }),
		[selectedPackage, selectPackage],
	);

	return (
		<ClassesPackageContext.Provider value={value}>
			{children}
		</ClassesPackageContext.Provider>
	);
}

export function useClassesPackage() {
	const context = useContext(ClassesPackageContext);
	if (!context) {
		throw new Error(
			"useClassesPackage must be used inside ClassesPackageProvider",
		);
	}
	return context;
}
