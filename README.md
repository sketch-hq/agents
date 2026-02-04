# Sketch Agent Skills
Sketch Agent Skills are folders of instructions, scripts, and resources that AI agents can discover and use to perform at specific tasks in Sketch.

Sketch currently provides the following skill:

- [Sketch Implement Design](https://github.com/sketch-hq/skills/tree/main/skills/sketch-implement-design)

## Installing a skill

Sketch Skills are installed placing a copy of the skill's directory in the agent's `skills` folder, typically `.agents/skills/`.

### Codex

Codex can install skills using the `$skills-installer` with the skill's GitHub directory URL:

```
$skill-installer install https://github.com/sketch-hq/skills/tree/main/skills/sketch-implement-design
```

After installing a skill, restart the agent to pick up new skills.

## License

The license of an individual skill can be found directly inside the skill's directory inside the LICENSE.txt file.