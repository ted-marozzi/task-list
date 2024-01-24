import "mdast";

type Location = { line: number; column: number; offset: number };

type TextDirective = {
	type: "textDirective";
	name: string;
	position: { start: Location; end: Location };
};

declare module "mdast" {
	interface PhrasingContentMap {
		textDirective: TextDirective;
	}

	interface ListItemData {
		index: number;
	}
}
