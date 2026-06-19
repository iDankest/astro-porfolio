// Preferencias de la página (tema / animaciones / cursor).
// Manipulan los data-attrs de <html> y localStorage, y emiten un evento
// `prefchange` para que cualquier UI (panel de Preferencias y ⌘K) se sincronice.

const root = () => document.documentElement;
const emit = () => document.dispatchEvent(new CustomEvent("prefchange"));

export function getThemePref(): string {
	return localStorage.getItem("pref-theme") || "dark";
}

export function applyTheme(pref: string) {
	localStorage.setItem("pref-theme", pref);
	const prefersLight = matchMedia("(prefers-color-scheme: light)").matches;
	const resolved = pref === "system" ? (prefersLight ? "light" : "dark") : pref;
	root().dataset.theme = resolved;
	const meta = document.querySelector('meta[name="theme-color"]');
	if (meta) {
		const color =
			resolved === "light"
				? "#e7ecf3"
				: resolved === "dim"
					? "#1c1d21"
					: "#0a0a0c";
		meta.setAttribute("content", color);
	}
	emit();
}

export function isMotionOn(): boolean {
	return root().dataset.motion !== "off";
}
export function setMotion(on: boolean) {
	if (on) {
		root().removeAttribute("data-motion");
		localStorage.removeItem("pref-motion");
	} else {
		root().dataset.motion = "off";
		localStorage.setItem("pref-motion", "off");
	}
	emit();
}

export function isCursorOn(): boolean {
	return root().dataset.cursor !== "off";
}
export function setCursor(on: boolean) {
	if (on) {
		root().removeAttribute("data-cursor");
		localStorage.removeItem("pref-cursor");
	} else {
		root().dataset.cursor = "off";
		localStorage.setItem("pref-cursor", "off");
	}
	emit();
}

export function onPrefChange(cb: () => void) {
	document.addEventListener("prefchange", cb);
}
