# Sketch Agent Skills
Sketch Agent Skills are folders of instructions, scripts, and resources that AI agents can use to discover and perform tasks in Sketch documents.

These skills teach agents how to complete specific tasks in a repeatable way, whether that's creating documents with your company's brand guidelines, analyzing data using your organization's specific workflows, or automating personal tasks.

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
