import { EditorState } from "@codemirror/state";
import { logWithNamespace, type LogLevel } from "@src/base/log";
import { isListItemPrefix } from "@src/base/text";

export function insertOnNewListItem() {
	return EditorState.transactionFilter.of((transaction) => {
		let updatedTransaction: null | ReturnType<typeof transaction.startState.update> = null;

		transaction.changes.iterChanges((fromA, toA, _, __, insertedText) => {
			// TODO: nested lists, ordered lists
			const shouldUpdateTransaction =
				updatedTransaction === null &&
				isListItemPrefix(insertedText.lineAt(insertedText.length).text);

			if (shouldUpdateTransaction) {
				updatedTransaction = transaction.startState.update({
					changes: {
						from: fromA,
						to: toA,
						insert: insertedText.toString() + ":to-do ",
					},
				});

				log("info", "Inserting :to-do task state on list item");
			}
		}, false);

		return updatedTransaction ?? transaction;
	});
}

function log(level: LogLevel, ...messages: Array<unknown>) {
	logWithNamespace("[insertOnNewListItem]", level, ...messages);
}
