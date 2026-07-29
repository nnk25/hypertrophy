# Agent instructions: [hypertrophy]
- Do not run build commands.
- Do not do things that the prompt isn't asking for
- Do not modify shadcn components stored in @/components/ui/
- search, install and use shadcn components much as possible. only create custom frontend components if no shadcn component suitable exists.
- Decompose recurring frontend code into reusable ui components.
- If the code has been manually changed by the user after the previous request DO NOT restore it to the previous state. read the file again.