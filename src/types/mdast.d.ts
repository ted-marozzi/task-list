import "mdast";

type TextDirective = {
	type: "textDirective";
	name: string;
};

declare module "mdast" {
	interface PhrasingContentMap {
		textDirective: TextDirective;
	}

	interface ListItemData {
		index: number;
	}
}
