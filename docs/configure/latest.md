# Configuration Instructions

#### You are viewing configuration instructions for: `alpha (latest)`

## Reseting configuration

1. Nagivate to the `server` folder of your project streamtab installation
2. Delete all files ending in `.json`
3. Project streamtab will automatically create new files using default configurations on next run

## Customising Project Streamtab

### `config.json`

Config.json allows you to set general configuration
| Configuration  | Default Setting | Description |
| -------------- | --------------- | ----------- |
| `PASSWORD`     | `""`            | Set Password To Connect |
| `PASSWORD_REQUIRED` | `false`    | Require the use of a password to connect **Note: ** Requireing a password currently does not encrypt traffic, use caution in public or untrusted networks |
| `USE_SECURE_PROTOCOL` | `false`  | Currently not in use in this version |
| `PORT`         | `8765`          | Port number for project streamtab to listen on |


### `macros.json`
The macros file contains a list of all user defined key combinations that can be referenced in `pages.json`

Each Macro Follows this format 
```json
"ID": {
        "type": "macro",
        "hold_down": false,
        "name": "Discord Deafen",
        "image": "undefined",
        "buttons": ["ctrl", "shift", "f5"]
    },
```
| Property  | Allowed Settings | Description |
| --------- | ---------------- | ----------- |
| `ID`      | This can be any string, the default configuration uses a five digit number in a string format (ex. `"00001"` |  |
| `type`    | `"macro"`        | Currently Unused | |
| `hold_down` | `true`, `false` | Currently Unsued, please use the `hold_down` flag in `pages.json` to use this functionality | |
| `name`    | Any String       | Currently Unused, will be used as to label macros when a GUI configurator is build | |
| `image`   | `"undefined"`    | Currently Unused | |
| `buttons` | An Array Of Buttons to be pressed Ex `"["ctrl", "shift", "f5"]"` | For a list of allowed keys, click [here](https://streamtab.dmaizik.ca/docs/keys) |
