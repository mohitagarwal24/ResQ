import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = (theme ?? resolvedTheme) as 'light' | 'dark' | undefined;
    const isDark = currentTheme === 'dark';
    const label = !mounted ? 'Toggle theme' : isDark ? 'Switch to light mode' : 'Switch to dark mode';

    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            aria-pressed={mounted ? isDark : undefined}
            onClick={() => mounted && setTheme(isDark ? 'light' : 'dark')}
            className={`relative h-9 w-16 overflow-hidden rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isDark ? 'bg-emerald-600/90 hover:bg-emerald-600' : 'bg-muted hover:bg-accent'}`}
        >
            <span className="absolute inset-y-0 left-2 flex items-center">
                <Sun className={`h-4 w-4 transition-opacity duration-300 ${isDark ? 'opacity-50' : 'opacity-100'}`} />
            </span>
            <span className="absolute inset-y-0 right-2 flex items-center">
                <Moon className={`h-4 w-4 transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-50'}`} />
            </span>
            <span
                className={`absolute top-1 left-1 h-7 w-7 rounded-full bg-background shadow-md transition-transform duration-300 ease-out will-change-transform ${isDark ? 'translate-x-[28px]' : 'translate-x-0'}`}
            />
        </button>
    );
}

export default ThemeToggle;


