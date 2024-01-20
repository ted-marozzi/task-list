import * as path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "jsdom",
		alias: {
			"@test": path.resolve(__dirname, "./test/"),
			"@src": path.resolve(__dirname, "./src/"),
		},
	},
});
