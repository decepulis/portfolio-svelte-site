function createUI() {
	let shouldReduceMotion = $state<boolean | null>(null);
	return {
		get shouldReduceMotion() {
			return shouldReduceMotion;
		},
		set shouldReduceMotion(value) {
			shouldReduceMotion = value;
		}
	};
}
const ui = createUI();
export default ui;
