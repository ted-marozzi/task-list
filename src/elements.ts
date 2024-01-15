import { setIcon } from "obsidian";

export function getTaskStateIconBox({
	iconName,
	interactive,
}: {
	iconName: string | null;
	interactive: boolean;
}) {
	const iconBox = document.createElement("span");

	if (iconName !== null) {
		setIcon(iconBox, iconName);
	} else {
		const emptyIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		emptyIcon.setAttributeNS("http://www.w3.org/2000/svg", "width", "24");
		emptyIcon.setAttributeNS("http://www.w3.org/2000/svg", "height", "24");
		emptyIcon.addClass("svg-icon");
		iconBox.appendChild(emptyIcon);
	}

	iconBox.className = `task-state-icon-box ${interactive ? "interactive" : ""}`;
	iconBox.dataset.state = this.taskStateName;

	return iconBox;
}
