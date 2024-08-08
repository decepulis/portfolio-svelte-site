function createUI() {
	let shouldReduceMotion: boolean | null = $state(null);
	let theme: typeof window.__theme = $state(null);
	let systemTheme: typeof window.__systemTheme = $state(null);
	let themePreference: typeof window.__themePreference = $state(null);

	return {
		get shouldReduceMotion() {
			return shouldReduceMotion;
		},
		get theme() {
			return theme;
		},
		get systemTheme() {
			return systemTheme;
		},
		get themePreference() {
			return themePreference;
		},
		set themePreference(value) {
			if (value === null) {
				console.error(
					'themePreference should not be set to null. null is reserved only for our loading/ssr state'
				);
				return;
			}
			window.__setThemePreference(value);
		},
		// I would prefer that consumers don't directly set any of these values.
		// they should be set by the manage functions below
		// these __set functions are for those managers
		__setShouldReduceMotion(value: typeof shouldReduceMotion) {
			shouldReduceMotion = value;
		},
		__setTheme(value: typeof theme) {
			theme = value;
		},
		__setSystemTheme(value: typeof systemTheme) {
			systemTheme = value;
		},
		__setThemePreference(value: typeof themePreference) {
			themePreference = value;
		}
	};
}
const ui = createUI();
export default ui;

// call this in an effect to keep the `shouldReduceMotion` store up to date
export function manageReduceMotion() {
	const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

	const onQueryChange = (e: MediaQueryListEvent) => ui.__setShouldReduceMotion(e.matches);
	reduceQuery.addEventListener('change', onQueryChange);

	ui.__setShouldReduceMotion(reduceQuery.matches);

	return () => reduceQuery.removeEventListener('change', onQueryChange);
}

// call this in an effect to keep the theme stores up to date
export function manageTheme() {
	const onThemeChange = () => {
		ui.__setSystemTheme(window.__systemTheme);
		ui.__setThemePreference(window.__themePreference);
		ui.__setTheme(window.__theme);
	};
	onThemeChange();
	window.__onThemeChange = onThemeChange;

	return () => (window.__onThemeChange = function () {});
}
