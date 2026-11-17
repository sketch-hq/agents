# Sketch agent plugin bundle

Multi-agent plugin bundle for **Cursor**, **Codex**, **Claude Code**, **GitHub Copilot**, **Xcode**, and **Pi**. It includes the Claude MCPB connector package in `mcpb/`.

> If your agent isn’t listed below, follow the manual MCP and skills setup instructions instead.


---

## Install the plugins

### Codex

Add this repository as a Codex marketplace and install the plugin from there:

```bash
codex plugin marketplace add sketch-hq/agents
codex plugin add sketch@sketch
```

Start a new Codex thread after installing. New threads pick up newly installed plugins, skills, and MCP tools.

### Claude Code

Add this repository as a Claude marketplace and install the plugin from there:

```bash
claude plugin marketplace add sketch-hq/agents
claude plugin install sketch@sketch
```

Run `/reload-plugins` in an active Claude Code session after installing, or start a new session.

### GitHub Copilot

Add this repository as a Copilot CLI marketplace and install the plugin from there:

```bash
copilot plugin marketplace add sketch-hq/agents
copilot plugin install sketch@sketch
```

VS Code can also discover plugins installed with Copilot CLI in its Agent Plugins view.

### Xcode 27

Xcode plugins can be installed from this repository URL by following the instructions below.

In Xcode:
1. Open _Settings_ and go to _Intelligence_
2. Make sure you have at least one agent set up
3. Select _Plug-ins_ then click _Add Plug-in_ 
4. Choose _Add from URL_ and enter `https://github.com/sketch-hq/agents`
5. Select `sketch` in the Plug-ins section
6. Click _Import_ and confirm installation

The Sketch MCP server and skills are now available in the Coding Assistant chat.

### Pi

Install this repository as a [Pi package](https://pi.dev/packages) to add the Sketch MCP server and skills. Pi 1.0 or later is required.

```bash
pi install git:github.com/sketch-hq/agents
```

Add `-l` to install for the current project only. Run `/reload` in an active Pi session after installing, or start a new session. Run a skill with `/skill:<skill-name>`, for example `/skill:sketch-design-to-code`.

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

For Pi 1.0 or later, run `pi mcp add sketch --url http://localhost:31126/mcp`. This writes the server to `~/.pi/agent/mcp.json`; add `-l` to write `.pi/mcp.json` instead, which Pi loads only in trusted projects. Run `pi mcp list` to check the connection.

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

Copy `skills/<skill-name>/` folders from the cloned repo into your agent’s skills directory. For example, Pi and other agents that support the Agent Skills locations discover skills in `~/.agents/skills/` (global) or `.agents/skills/` (project).

---

## Sketch MCP server

[Sketch MCP server documentation](https://www.sketch.com/docs/mcp-server/) — requires Sketch 2025.2.4 or later.

In Sketch: **⌘K** → “Start MCP Server”, or **Settings → General → MCP Server**. Allow Local Network access if macOS prompts you. The server listens at `http://localhost:31126/mcp` by default.

---

## License

The Sketch agent plugin bundle is available under the [Apache License 2.0](LICENSE). Individual skill directories also include a copy of the license.
