import { untrack } from "svelte";

export class Utils {
	static async timeout(ms: number) {
		return new Promise((r) => setTimeout(r, ms));
	}
	static msToHHMMSS(ms: number) {
		if (ms < 0) {
			ms = 0;
		}

		const seconds = Math.floor(ms / 1000);
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;

		const pad = (num: number) => num.toString().padStart(2, '0');

		const hh = pad(hours);
		const mm = pad(minutes);
		const ss = pad(remainingSeconds);

		return `${hh}:${mm}:${ss}`;
	}
}

export const lerp = (a: number, b: number, t: number) => a + t * (b - a);
export function explicitEffect(fn: () => unknown, deps: () => unknown, pre?: boolean) {
	if (pre)
		$effect.pre(() => {
			deps()
			untrack(fn);
		});
	else $effect(() => {
		deps()
		untrack(fn);
	});
}