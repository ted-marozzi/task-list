import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	EditorView,
	type PluginSpec,
	type PluginValue,
	ViewPlugin,
	ViewUpdate,
} from "@codemirror/view";
import { TaskStateWidget } from "./task_state_widget";
import { logWithPrefix, type LogLevel } from "./log";

class TaskStateViewPlugin implements PluginValue {
	decorations: DecorationSet;
	name = "TaskStateViewPlugin";

	constructor(view: EditorView) {
		this.decorations = this.buildDecorations(view);
	}

	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged) {
			this.decorations = this.buildDecorations(update.view);
		}
	}

	destroy() {}

	buildDecorations(view: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();

		for (const { from, to } of view.visibleRanges) {
			syntaxTree(view.state).iterate({
				from,
				to,
				enter(node) {
					console.log(node);
					if (node.type.name.startsWith("list")) {
						builder.add(node.from, node.from + 1, Decoration.replace({}));
					}
				},
			});
		}

		return builder.finish();
	}

	log(level: LogLevel, ...messages: Array<unknown>) {
		const prefix = `[${this.name}]`;
		logWithPrefix(prefix, level, ...messages);
	}
}

const pluginSpec: PluginSpec<TaskStateViewPlugin> = {
	decorations: (value: TaskStateViewPlugin) => value.decorations,
};

export const taskStateViewPlugin = ViewPlugin.fromClass(TaskStateViewPlugin, pluginSpec);
