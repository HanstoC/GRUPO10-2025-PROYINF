import { untrack } from "svelte";

export class Utils {
	static async timeout(ms: number) {
		return new Promise((r) => setTimeout(r, ms));
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