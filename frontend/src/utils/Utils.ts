export class Utils {
	static async timeout(ms: number) {
		return new Promise((r) => setTimeout(r, ms));
	}
}
