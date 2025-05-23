import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function usePageFocus() {
    const pathname = usePathname();

    useEffect(() => {
        // Focus at the top of the page on page change
        const mainContent = document.querySelector('body');
        if (mainContent instanceof HTMLElement) {
            mainContent.focus();
        }
    }, [pathname]); // Re-run when the pathname changes
} 