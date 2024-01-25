import "mdast";

import type { Position } from "unist";

type TextDirective = {
	type: "textDirective";
	name: string;
	position: Position;
};

declare module "mdast" {
	interface PhrasingContentMap {
		textDirective: TextDirective;
	}

	interface ListItemData {
		index: number;
	}
}
