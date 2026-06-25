#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const SKETCH_MCP_URL = new URL("http://localhost:31126/mcp");
const BRIDGE_VERSION = "3.0.0";
const SKETCH_SERVER_NAME = "SketchMCP";
const SKETCH_SERVER_VERSION = "2.0";
const SKETCH_NOT_RUNNING_ERROR_MESSAGE =
  "Error: This is a fallback response because the Sketch MCP server is not available. Either Sketch is not running or Settings > General > Allow AI tools to interact with open documents is not enabled. Explain the situation to the user and direct them to this help article: https://www.sketch.com/docs/mcp-server/. Mention that they might need to restart Claude after starting Sketch and enabling the MCP Server to get the full functionality.";
const PLACEHOLDER_TOOL_DESCRIPTION_MESSAGE =
  "This is a placeholder tool description provided while the Sketch MCP server is not available. Try to re-fetch the tool list after the user has started Sketch and enabled the MCP Server";
const READONLY_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
};
const DESTRUCTIVE_ANNOTATIONS = {
  readOnlyHint: false,
  destructiveHint: true,
};
const FALLBACK_TOOLS = [
  {
    name: "get_libraries",
    description:
      "Returns a list of libraries available for the given target Sketch document. Before using this tool, load `get_guide` topic `mcp` in context.",
    inputSchema: {
      type: "object",
      properties: {
        targetDocumentID: {
          type: "string",
          description:
            "An identifier a document you're currently working with. Call `run_code` for currently open documents or to open a new one.",
        },
      },
      required: ["targetDocumentID"],
    },
    annotations: READONLY_ANNOTATIONS,
  },
  {
    name: "get_design_assets",
    description:
      "Returns a list of design assets of the given kind grouped by their source library. Before using this tool, load `get_guide` topic `mcp` in context.",
    inputSchema: {
      type: "object",
      properties: {
        targetDocumentID: {
          type: "string",
          description:
            "An identifier a document you're currently working with.",
        },
        sourceLibraryID: {
          type: "string",
          description:
            "(Optional) An identifier of a library to search design assets in. Use together with `get_libraries` when asked to use assets from a specific library.",
        },
        kind: {
          type: "string",
          description:
            "One of: `symbol`, `textStyle`, `layerStyle`, `swatch`, `frameTemplate`, `graphicTemplate`.",
        },
        nameContains: {
          type: "string",
          description:
            "(Optional) Only return assets that include this substring in their name (ignoring case).",
        },
      },
      required: ["targetDocumentID", "kind"],
    },
    annotations: READONLY_ANNOTATIONS,
  },
  {
    name: "get_symbol_overrides",
    description:
      "Returns a list of available Overrides on the given SymbolInstance. Before using this tool, load `get_guide` topic `mcp` in context.",
    inputSchema: {
      type: "object",
      properties: {
        targetDocumentID: {
          type: "string",
          description:
            "An identifier a document you're currently working with.",
        },
        symbolInstanceID: {
          type: "string",
          description: "An identifier of a target SymbolInstance.",
        },
        kind: {
          type: "string",
          description: "One of `text`, `color`, `image`, or `all`",
        },
      },
      required: ["targetDocumentID", "symbolInstanceID", "kind"],
    },
    annotations: READONLY_ANNOTATIONS,
  },
  {
    name: "get_screenshot",
    description:
      "Generates a PNG screenshot of the requested Sketch layer. If no layer identifier is provided, takes a screenshot of the currently selected layer instead. Before using this tool, load `get_guide` topic `mcp` in context.",
    inputSchema: {
      type: "object",
      properties: {
        targetDocumentID: {
          type: "string",
          description:
            "An identifier a document containing a layer to screenshot.",
        },
        layerID: {
          type: "string",
          description: "(Optional) An identifier of a layer to screenshot.",
        },
      },
      required: ["targetDocumentID"],
    },
    annotations: READONLY_ANNOTATIONS,
  },
  {
    name: "run_code",
    description:
      "Runs ECMAScript 2020 Sketch plugin scripts. Before calling this tool, the `get_guide` topic `mcp` must be loaded in context.",
    inputSchema: {
      type: "object",
      properties: {
        script: {
          type: "string",
          description: "A JavaScript code to be run inside Sketch.",
        },
        title: {
          type: "string",
          description: "The purpose of this code in fewer than 10 words.",
        },
      },
      required: ["script", "title"],
    },
    annotations: DESTRUCTIVE_ANNOTATIONS,
  },
  {
    name: "get_guide",
    description:
      "Returns editable Markdown guidance for using Sketch MCP tools. Call this before using Sketch MCP. If no topic is provided, returns `mcp`.",
    inputSchema: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description:
            "(Optional) Guide topic to return. Supported topics: mcp, troubleshooting, use, layout, styling, symbols, assets, prototyping.",
        },
      },
      required: [],
    },
    annotations: READONLY_ANNOTATIONS,
  },
  {
    name: "get_document_info",
    description:
      "Returns basic information about an open Sketch document: file name, page names, layer counts, and top-level frames with position and dimensions.",
    inputSchema: {
      type: "object",
      properties: {
        targetDocumentID: {
          type: "string",
          description:
            "(Optional) An identifier of an open Sketch document. If omitted, uses the current document.",
        },
      },
      required: [],
    },
    annotations: READONLY_ANNOTATIONS,
  },
  {
    name: "get_layer_tree_summary",
    description:
      "Returns a compact indented text summary of a layer's subtree hierarchy, including type, name, ID, position, dimensions, text content, and stack layout hints.",
    inputSchema: {
      type: "object",
      properties: {
        targetDocumentID: {
          type: "string",
          description:
            "(Optional) An identifier of an open Sketch document. If omitted, uses the current document.",
        },
        layerID: {
          type: "string",
          description:
            "(Optional) An identifier of a layer to use as the root of the summary. If omitted, uses the first page of the document.",
        },
        depth: {
          type: "number",
          description:
            "(Optional) Maximum depth to traverse (default 3, max 10).",
        },
      },
      required: [],
    },
    annotations: READONLY_ANNOTATIONS,
  },
];

let proxyServer;

async function withSketchClient(callback) {
  const transport = new StreamableHTTPClientTransport(SKETCH_MCP_URL);
  const client = new Client({
    name: "sketch-mcp-bridge",
    version: BRIDGE_VERSION,
  });
  try {
    await client.connect(transport);
    return await callback(client);
  } finally {
    await transport.close().catch(() => {});
  }
}

async function createProxyServer() {
  let info;
  let capabilities;

  try {
    await withSketchClient((sketch) => {
      info = sketch.getServerVersion();
      capabilities = sketch.getServerCapabilities();
    });
  } catch (error) {
    // If we fail to connect to Sketch, we still want to start the proxy server, just with placeholder info
    console.error("Failed to connect to Sketch MCP server:", error);
    info = {
      name: SKETCH_SERVER_NAME,
      version: SKETCH_SERVER_VERSION,
    };
    capabilities = {
      tools: {
        listChanged: false,
      },
    };
  }

  const server = new Server(
    {
      name: info.name,
      version: info.version,
    },
    {
      capabilities,
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    try {
      return await withSketchClient((sketch) => sketch.listTools());
    } catch (error) {
      return {
        tools: FALLBACK_TOOLS.map((tool) => ({
          ...tool,
          description: `${tool.description} (${PLACEHOLDER_TOOL_DESCRIPTION_MESSAGE})`,
        })),
      };
    }
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      return await withSketchClient((sketch) =>
        sketch.callTool({
          name: request.params.name,
          arguments: request.params.arguments,
        }),
      );
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: SKETCH_NOT_RUNNING_ERROR_MESSAGE,
          },
        ],
      };
    }
  });

  return server;
}

async function main() {
  proxyServer = await createProxyServer();

  const transport = new StdioServerTransport();
  await proxyServer.connect(transport);
}

main().catch(async (error) => {
  console.error("Fatal server bootstrap error:", error);
  await proxyServer?.close().catch(() => {});

  process.exit(1);
});

process.on("SIGINT", async () => {
  await proxyServer?.close().catch(() => {});

  process.exit(0);
});
