# Sketch Skills

Sketch Skills are folders of instructions, scripts, and resources that AI agents use to perform specific tasks with Sketch documents.

## Available skills

### [sketch-implement-design](https://github.com/sketch-hq/skills/tree/main/skills/sketch-implement-design)

Translates Sketch layers into production-ready code with 1:1 visual fidelity. Queries live document data through the Sketch MCP server — uses `run_code` to inspect and export data, and `get_selection_as_image` as the visual source of truth.

**How to use:**

1. Install the skill.
1. Open your design in Sketch.
1. Start the MCP server (press `s` and type “MCP server”).
1. Select a frame in your document to work with.
1. Ask your AI agent to implement the design selected in Sketch.

## Installing a skill

You can install Sketch Skills by placing a copy of the skill’s directory in the agent’s `skills` folder, typically `.agents/skills/`. After installing a skill, restart your AI agent to pick up any new skills.

### `skills.sh` CLI

You can use the [skills.sh](https://skills.sh) installer to install Sketch skills:

```
npx skills add sketch-hq/skills
```

### Codex

Codex can install skills using the `$skills-installer` with the skill’s GitHub directory URL:

```
$skill-installer install https://github.com/sketch-hq/skills/tree/main/skills/sketch-implement-design
```

### Manual

You can manually install skills by cloning the skill’s folder in the GitHub repository into the agent’s `skills` folder:

```
git clone https://github.com/sketch-hq/skills/tree/main/skills/sketch-implement-design .agents/skills/sketch-implement-design
```

## License
You can find licenses for individual skills directly inside the skill’s directory inside the LICENSE.txt file.
