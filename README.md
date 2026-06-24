# Sketch agent plugin bundle

Multi-agent plugin bundle for **Cursor**, **Codex**, **Claude Code**, and **GitHub Copilot**. It includes the Claude MCPB connector package in `mcpb/`.

> The Sketch plugin is still being published to official agent marketplaces. If it is not listed yet for your agent, use the manual MCP and skills setup below.

---

## Install the plugin

Install **Sketch** from each agent’s official plugin marketplace when it is listed.

### Cursor

**App:** Open **Cursor Settings → Plugins**, search for **Sketch**, or browse the [Cursor Marketplace](https://cursor.com/marketplace). In Agent chat: `/add-plugin sketch`.

**CLI:** Not supported — Cursor has no terminal plugin install command.

Docs: [Cursor plugins](https://cursor.com/docs/plugins)

### Codex

**App:** Open the **Codex** app → **Plugins** → find **Sketch** in the curated directory → **Add to Codex**. Start a new thread after installing.

**CLI:** Run `codex`, type `/plugins`, open **Sketch**, choose **Install plugin**. Or run `codex plugin add sketch@<marketplace>` once the plugin is listed (use `codex plugin list` to confirm the marketplace name).

Docs: [Codex plugins](https://developers.openai.com/codex/plugins)

### Claude Code

**App:** Run `/plugin`, open **Discover**, and install **Sketch**. Or browse [claude.com/plugins](https://claude.com/plugins).

**CLI:** `claude plugin install sketch@claude-plugins-official` (in Claude Code: `/plugin install sketch@claude-plugins-official`, then `/reload-plugins`).

Docs: [Discover and install plugins](https://code.claude.com/docs/en/discover-plugins)

### GitHub Copilot

**App (VS Code):** Enable agent plugins (`chat.plugins.enabled`), open **Extensions → Agent Plugins**, and install **Sketch** from the marketplace. Reload the window after installing.

**CLI:** `copilot plugin install sketch@copilot-plugins` (interactive session: `/plugin install sketch@copilot-plugins`).

Docs: [Finding and installing Copilot CLI plugins](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing), [Agent plugins in VS Code](https://code.visualstudio.com/docs/agent-customization/agent-plugins)

---

## Manual MCP and skills setup

Use this if you do not install the full plugin bundle.

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