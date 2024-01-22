import { getRemark } from "@src/base/remark";
import type { Root } from "remark-gfm/lib";

export function isListItemPrefix(line: string): boolean {
	let result = false;
	getRemark()
		.use(() => (root: Root) => {
			if (root.children.length !== 1) {
				return;
			}

			const firstChild = root.children[0];
			if (firstChild.type !== "list") {
				return;
			}

			if (firstChild.children.length !== 1) {
				return;
			}

			const secondChild = firstChild.children[0];
			if (secondChild.type !== "listItem" || secondChild.children.length !== 0) {
				return;
			}

			result = true;
		})
		.processSync(line);

	console.log("returning", result);

	return result;
}
