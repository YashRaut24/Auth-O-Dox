import { useEffect, useState } from "react";
import "./ThemeToggle.css";

const THEME_KEY = "authodox_theme";

function getInitialTheme() {
    const storedTheme = localStorage.getItem(THEME_KEY);
    return storedTheme === "dark" ? "dark" : "light";
}

function ThemeToggle() {
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const isDark = theme === "dark";

    return (
        <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            <span className="theme-toggle-icon" aria-hidden="true">{isDark ? "☀" : "☾"}</span>
        </button>
    );
}

export default ThemeToggle;
