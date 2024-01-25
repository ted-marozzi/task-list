import { RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	type DecorationSet,
	EditorView,
	type PluginValue,
	ViewPlugin,
	ViewUpdate,
	type PluginSpec,
} from "@codemirror/view";
import { type LogLevel, logWithNamespace } from "@src/base/log";
import { getRemark, getTaskStateDirective } from "@src/base/tree";
import { visit } from "unist-util-visit";
import type { Root } from "remark-gfm/lib";
import { TaskStateWidget } from "@src/features/render_task_state/task_state_widget";

class TaskStateViewValue implements PluginValue {
	name = "TaskStateViewValue";
	decorations: DecorationSet;

	constructor(editorView: EditorView) {
		this.decorations = this.buildDecorations(editorView);
	}

	async update(viewUpdate: ViewUpdate) {
		if (viewUpdate.docChanged || viewUpdate.viewportChanged || viewUpdate.selectionSet) {
			this.decorations = this.buildDecorations(viewUpdate.view);
		}
	}

	destroy() {}

	buildDecorations(editorView: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();
		const builderRanges: Array<[number, number, Decoration]> = [];

		for (const { from, to } of editorView.visibleRanges) {
			getRemark()
				.use(() => (root: Root) => {
					visit(root, "list", (list) => {
						for (const listItem of list.children) {
							const directive = getTaskStateDirective(listItem);
							if (directive === null) {
								continue;
							}

							const isBetween = (point: number, from: number, to: number) =>
								point >= from && point < to;

							const selection = editorView.state.selection.main;

							if (
								directive.position.start.offset === undefined ||
								directive.position.end.offset === undefined
							) {
								continue;
							}

							const isPartiallySelected =
								isBetween(
									selection.from,
									directive.position.start.offset,
									directive.position.end.offset
								) ||
								isBetween(
									selection.to,
									directive.position.start.offset,
									directive.position.end.offset
								) ||
								(selection.from <= directive.position.start.offset &&
									selection.to >= directive.position.end.offset);

							if (!isPartiallySelected && list.position !== undefined) {
								builderRanges.push([
									directive.position.start.offset,
									directive.position.end.offset,
									Decoration.replace({
										widget: new TaskStateWidget({
											directivePosition: directive.position,
											listPosition: list.position,
											taskStateName: directive.name,
										}),
									}),
								]);
							}
						}
					});
				})
				.process(editorView.state.sliceDoc(from, to));
		}

		// Ranges must be sorted by from offset
		builderRanges
			.sort(([fromA], [fromB]) => fromA - fromB)
			.forEach((range) => builder.add(...range));

		return builder.finish();
	}

	log(level: LogLevel, ...messages: Array<unknown>) {
		const namespace = `[${this.name}]`;
		logWithNamespace(namespace, level, ...messages);
	}
}
const pluginSpec: PluginSpec<TaskStateViewValue> = {
	decorations: (value: TaskStateViewValue) => value.decorations,
};

export const taskStateViewPlugin = ViewPlugin.fromClass(TaskStateViewValue, pluginSpec);
