import { syntaxTree } from "@codemirror/language";
import { type Extension, RangeSetBuilder, StateField, Transaction } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView } from "@codemirror/view";
import { TaskStateWidget } from "./task_state_widget";
import type TaskList from "./main";

export function getTaskStateField({ taskList }: { taskList: TaskList }) {
	return StateField.define<DecorationSet>({
		create(state): DecorationSet {
			return Decoration.none;
		},
		update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
			const builder = new RangeSetBuilder<Decoration>();
			syntaxTree(transaction.state).iterate({
				enter(node) {
					if (node.type.name.startsWith("list")) {
						console.log(node);
						builder.add(
							node.from,
							node.to,
							Decoration.replace({
								widget: new TaskStateWidget({
									taskList,
									taskStateName: "doing",
									text: "a",
									directiveRange: { from: { ch: 2, line: 12 }, to: { ch: 12, line: 12 } },
								}),
							})
						);
					}
				},
			});

			return builder.finish();
		},
		provide(field: StateField<DecorationSet>): Extension {
			return EditorView.decorations.from(field);
		},
	});
}
