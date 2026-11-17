// Registers the Sketch MCP server when this bundle is installed as a Pi package.
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.registerMcpServer("sketch", {
    url: "http://localhost:31126/mcp",
    description: "Read and edit the documents open in the Sketch Mac app",
  });
}
