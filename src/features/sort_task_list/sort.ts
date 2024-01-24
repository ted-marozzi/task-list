import { EXIT, visit } from "unist-util-visit";
import type { Root } from "remark-gfm/lib";
import type { EditorView } from "@codemirror/view";
import { taskStates } from "@src/base/task_states";
import { logWithNamespace, type LogLevel } from "@src/base/log";
import type { List } from "mdast";
import { getRemark, getTaskStateDirective } from "@src/base/tree";

export async function sortTaskList(editorView: EditorView): Promise<void> {
	log("info", "Running command");

	await getRemark()
		.use(() => sortTasks(editorView))
		.process(editorView.state.doc.toString());
}

function sortTasks(editorView: EditorView) {
	return (root: Root) => {
		let listWasSorted = false;
		visit(root, "list", (list) => {
			assignChildIndices(list);
			sortChildren(list);

			const transactionSpecs = getTransactionSpecs(list, editorView);
			if (transactionSpecs.length > 0) {
				editorView.dispatch(...transactionSpecs);
				listWasSorted = true;
				return EXIT;
			}
		});
		if (listWasSorted) {
			sortTaskList(editorView);
		}
	};
}

function assignChildIndices(list: List) {
	list.children.forEach((child, index) => {
		if (child.data === undefined) {
			child.data = {
				index,
			};
		} else {
			child.data.index = index;
		}
	});
}

function sortChildren(list: List) {
	list.children.sort((a, b) => {
		const stateA = getTaskStateDirective(a);
		const stateB = getTaskStateDirective(b);

		if (stateA === stateB) {
			return 0;
		}

		if (stateA === null) {
			return 1;
		}

		if (stateB === null) {
			return -1;
		}

		const sortOrderA = taskStates[stateA.name].sortOrder;
		const sortOrderB = taskStates[stateB.name].sortOrder;

		return sortOrderA - sortOrderB;
	});
}

function getTransactionSpecs(list: List, editorView: EditorView) {
	const transactionSpecs: Parameters<typeof editorView.dispatch> = [];

	const nodeMap = new Map(list.children.map((child) => [child.data!.index, child]));

	list.children.forEach((child, index) => {
		if (child.data?.index === index) {
			return;
		}

		const node = nodeMap.get(index)!;

		const nodeText = editorView.state.sliceDoc(
			node.position!.start.offset!,
			node.position!.end.offset!
		);

		const childText = editorView.state.sliceDoc(
			child.position!.start.offset!,
			child.position!.end.offset!
		);

		let nodeMarkerLength = nodeText.indexOf(" ");
		if (nodeMarkerLength < 0) {
			nodeMarkerLength = 0;
		}

		let childMarkerLength = childText.indexOf(" ");
		if (childMarkerLength < 0) {
			childMarkerLength = 0;
		}

		transactionSpecs.push({
			changes: {
				insert: childText.substring(childMarkerLength),
				from: node.position!.start.offset! + nodeMarkerLength,
				to: node.position!.end.offset!,
			},
		});
	});

	return transactionSpecs;
}

function log(level: LogLevel, ...messages: Array<unknown>) {
	const namespace = `[Sort task list]`;
	logWithNamespace(namespace, level, ...messages);
}
