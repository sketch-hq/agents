# Sketch agent plugin bundle

Multi-agent plugin bundle for **Cursor**, **Codex**, **Claude Code**, and **GitHub Copilot**. It includes the Claude MCPB connector package in `mcpb/`.

> The Sketch plugin is coming soon to official agent marketplaces. If it is not listed below for your agent, follow the manual MCP and skills setup instructions instead.

---

## Manual MCP and skills setup

### MCP server

Add the server to your agent after it is running in Sketch. Full client setup: [Sketch MCP server documentation](https://www.sketch.com/docs/mcp-server/).

```json
{
  "mcpServers": {
    "sketch": {
      "type": "http",
      "url": "http://localhost:31126/mcp"
    }
  }
}
```

Place it in the MCP config file your agent expects (for example Cursor **Settings → Tools & MCP**, or `claude mcp add --transport http sketch http://localhost:31126/mcp` for Claude Code).

### Skills

#### Skills CLI

Install the skills with the [Skills CLI](https://github.com/vercel-labs/skills) ([skills.sh](https://skills.sh)):

```bash
npx skills add sketch-hq/agents
```

List available skills before installing:

```bash
npx skills add sketch-hq/agents --list
```

See the [Skills CLI](https://github.com/vercel-labs/skills) for options, supported agents and install locations.

#### Clone and copy

Clone this repository and copy the skill folders into your agent’s skills directory:

```bash
git clone https://github.com/sketch-hq/agents.git
```

Copy `skills/<skill-name>/` folders from the cloned repo into your agent’s skills directory.

---

## Sketch MCP server

[Sketch MCP server documentation](https://www.sketch.com/docs/mcp-server/) — requires Sketch 2025.2.4 or later.

In Sketch: **⌘K** → “Start MCP Server”, or **Settings → General → MCP Server**. Allow Local Network access if macOS prompts you. The server listens at `http://localhost:31126/mcp` by default.

---

## License

You can find licenses for individual skills directly inside the skill’s directory inside the LICENSE.txt file.