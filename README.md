# Project Streamtab

## What is it?
This project aims to allow any user to convert their old device into a macro keypad. Similar to the Elgato Stream Deck.

## What's the status of this project?
This project is currently in the prototyping phase.

Currently is has 20 functional macro keys. It uses uses `ctrl` + `shift` + `F1 - F20` for the macros.

Traffic between the client and server are currently un-encrypted.

## How do I use it?
1. Install the latest release from the releases tab.
2. Extract the zip file.
3. Open a terminal to the root of the extracted folder, and run `pip install -r requirements.txt` to install the projects dependencies.
     1. If the above does not work, try `py -m pip install -r requirements.txt` or `python3 -m pip install -r requirements.txt`
4. Open `/webserver/index.html` in a text editor of your choice, and replace the IP address in line **77** with the IP address of your local machine.
5. In the same terminal, run `python3 ./server/server.py`
     1. If the above does not work, try `py ./server/server.py`
6. In a second terminal, navigate to `/webserver` and run `python3 -m http.server 8080`.
     1. If the above does not work, try `py -m http.server 8080`
7. On a device of your chosing, navigate a web browser to `http://<YOUR IP ADDRESS>:8080`

Please note that this project is still in the prototyping phase, and should only be used for testing or development purposes. Running this in a production environment could put you and your data at risk.

## How does it work?
 1. `server.py` opens a websocket server, and waits for a client to connect.
 2. When the client device opens `index.html` either locally or through a webserver, it connects to the websocket server that `server.py` has created.
 3. When the user taps on a macro key, it sends the macro key number to the server.
 4. If the server determines that a valid macro key number has been sent, it inputs `ctrl`+`shift`+`F<MACRO NUMBER>`
 5. If the server is able to successfully input those key, it returns a success.
     1. If the client receives a success, it will highlight the key in green for 250ms
 6. If the server encounters an issues, it returns an error
     1. If the client receices an error, it will highlight the key in red for 250ms.
     
## What is the future of this project.
On no particular order, these are the features I would like to add.
 - [ ] Encrypted Traffic between client and server.
 - [ ] Password requirement for client to connect to server.
 - [ ] Allow keys to be held down, this would allow features like Push To Talk in Discord to work.
 - [ ] Allow the macro that is run to be modified. Ex. The server enters `alt`+`shift`+`a` instead of `ctrl`+`shift`+`F1 - F20`
 - [ ] Folders
 - [ ] Pages
 - [ ] Then the webclient page loads, it automatically enters fullscreen mode.
 - [ ] Allow Macros to be Named
 - [ ] Allow Images to be used for the buttons.

