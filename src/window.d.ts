interface Window {
	__theme: 'dark' | 'light' | null;
	__systemTheme: 'dark' | 'light' | null;
	__themePreference: 'dark' | 'light' | '__system' | null;
	__onThemeChange: () => void;
	__setThemePreference: (value: 'dark' | 'light' | '__system') => void;
}
