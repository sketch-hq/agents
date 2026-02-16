# Sketch Agent Skills
Sketch Agent Skills are folders of instructions, scripts, and resources that AI agents can discover and use to perform specific tasks in Sketch documents in a repeatable way.

We currently provide one skill — [Sketch Implement Design](https://github.com/sketch-hq/skills/tree/main/skills/sketch-implement-design).

## Installing a skill

You can install Sketch Agent Skills by placing a copy of the skill's directory in the agent's `skills` folder, typically `.agents/skills/`.

### Codex

Codex can install skills using the `$skills-installer` with the skill's GitHub directory URL:

```
$skill-installer install https://github.com/sketch-hq/skills/tree/main/skills/sketch-implement-design
```

After installing a skill, restart the agent to pick up new skills.

## License

You can find licenses for individual skills directly inside the skill's directory inside the LICENSE.txt file.
