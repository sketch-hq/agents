# Sketch MCP Bundle Connector

The official Sketch MCP connector package for Claude clients that install `.mcpb` archives.

It allows AI clients to interact with your designs:

- Explore designs and Libraries, compare code to Sketch components, and fix inconsistencies
- Expand and iterate on existing designs
- Replace placeholders with lifelike data
- Organize and export assets
- Generate screens and components as code

This connector communicates with the Sketch app, so make sure Sketch is running and Settings > General > Allow AI tools to interact with open documents is enabled.

---

## Usage

### Claude Desktop

1. Go to **Customize > Connectors**.
2. Press the `+` button.
3. Choose **Browse connectors**.
4. Search for **Sketch** and press **Install**.

### Local archive

Build the local `.mcpb` archive from this folder:

```bash
npm ci
npm run pack
```

This creates `sketch.mcpb`.

---

## Development

This is an stdio MCP server that forwards messages to and from the local Streamable HTTP MCP server that is part of the Sketch Mac app. The proxy is needed for clients that support stdio MCP connectors but cannot connect directly to Sketch's local HTTP MCP server.

### Setup

```bash
npm ci
```

### Run the server

1. Launch Sketch and choose MCP

```bash
npm run start
```

### Archive

Generate the `.mcpb` archive ready for distribution:

```bash
npm run pack
```
