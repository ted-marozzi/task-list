# Task list

A simple obsidian plugin enabling better task management via lists.

# Features

- [x] Create lists with task states

  ```md
  - Supported task states
    - :to-do I need to be done
    - :doing I am being done
    - :paused I am paused
    - :done I am done
  ```

- [x] Click a state box to cycle to the next state
- [x] Right click the state box to select mark a different state
- [x] Lists are automatically sorted when a state changes but can be manually sorted with the "Task list: Sort tasks" command

# Installation

1. Clone this repo to `./vault/.obsidian/plugins`
1. Run `npm run build`
1. Start obsidian
1. Navigate to Settings > Community plugins
1. Enable the "Task list" plugin
