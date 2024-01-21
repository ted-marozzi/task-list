import { remark } from "remark";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";

export function getRemark() {
	return remark().use(remarkGfm).use(remarkDirective);
}
