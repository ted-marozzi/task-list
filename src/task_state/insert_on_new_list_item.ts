import { EditorState } from "@codemirror/state";
import { logWithNamespace, type LogLevel } from "@src/base/log";
import { isListItemPrefix } from "@src/base/text";

export function insertOnNewListItem() {
	return EditorState.transactionFilter.of((transaction) => {
		let text = "";

		let from: number | null = null;
		let to: number | null = null;

		transaction.changes.iterChanges((fromA, toA, _, __, insertedText) => {
			text += insertedText.toString();
			if (from === null) {
				from = fromA;
			} else {
				from = Math.min(from, fromA);
			}

			if (to === null) {
				to = toA;
			} else {
				to = Math.max(to, toA);
			}
		});

		console.log(`text-${text}-text`);

		if (from !== null && to !== null && isListItemPrefix(text)) {
			log("info", "Inserting :to-do task state on list item");
			return transaction.startState.update({
				changes: {
					from,
					to,
					insert: text + ":to-do ",
				},
			});
		}

		return transaction;
	});
}

function log(level: LogLevel, ...messages: Array<unknown>) {
	logWithNamespace("[insertOnNewListItem]", level, ...messages);
}
