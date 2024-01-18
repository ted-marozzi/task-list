import type { EditorView } from "@codemirror/view";
import "obsidian";

declare module "obsidian" {
	interface Editor {
		cm: EditorView;
	}
}
