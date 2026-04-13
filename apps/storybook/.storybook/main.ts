import type { StorybookConfig } from "@storybook/react-vite";
import { resolve } from "path";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@vscode-file-tree/core": resolve(__dirname, "../../../packages/core/src/index.ts"),
      "@vscode-file-tree/react": resolve(__dirname, "../../../packages/react/src/index.ts"),
      "@vscode-file-tree/icons": resolve(__dirname, "../../../packages/icons/src/index.ts"),
    };
    return config;
  },
};

export default config;
