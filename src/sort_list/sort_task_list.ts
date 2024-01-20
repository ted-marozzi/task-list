import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { EXIT, visit } from "unist-util-visit";
import type { Root } from "remark-gfm/lib";
import type { EditorView } from "@codemirror/view";
import { taskStates, type TaskStateName } from "@src/task_state/task_states";
import { logWithNamespace, type LogLevel } from "../base/log";
import type { ListItem, List } from "mdast";

export async function sortTaskList(editorView: EditorView): Promise<void> {
	log("info", "Running command");

	await remark()
		.use(remarkGfm)
		.use(remarkDirective)
		.use(() => sortTasks(editorView))
		.process(editorView.state.doc.toString());
}

function sortTasks(editorView: EditorView) {
	return (root: Root) => {
		let alreadySorted = false;
		visit(root, "list", (list) => {
			assignChildIndices(list);
			sortChildren(list);

			const transactionSpecs = getTransactionSpecs(list, editorView);
			if (transactionSpecs.length > 0) {
				editorView.dispatch(...transactionSpecs);
				alreadySorted = true;
				return EXIT;
			}
		});
		if (alreadySorted) {
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
		const stateA = getState(a);
		const stateB = getState(b);

		if (stateA === stateB) {
			return 0;
		}

		if (stateA === null) {
			return 1;
		}

		if (stateB === null) {
			return -1;
		}

		const sortOrderA = taskStates[stateA].sortOrder;
		const sortOrderB = taskStates[stateB].sortOrder;

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

function getState(listItem: ListItem): TaskStateName | null {
	if (
		(listItem.checked === null || listItem.checked === undefined) &&
		listItem.children.length > 0 &&
		listItem.children[0].type === "paragraph" &&
		listItem.children[0].children.length > 0 &&
		listItem.children[0].children[0].type === "textDirective"
	) {
		const state = listItem.children[0].children[0].name;
		if (state in taskStates) {
			return state as TaskStateName;
		}
	}

	return null;
}

function log(level: LogLevel, ...messages: Array<unknown>) {
	const namespace = `[Sort task list]`;
	logWithNamespace(namespace, level, ...messages);
}
