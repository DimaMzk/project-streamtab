# Project Streamtab

![](https://github.com/DimaMzk/project-streamtab/blob/a0b052eb2201536c7dfd42dcf9742a84fccd3323/readme_assets/demogif.gif)

## What is it?
This project aims to allow any user to convert their old device into a macro keypad. Similar to a Stream Deck.

## What's the status of this project?
Very Slowly being re-built as a proper electron application. In the future, if time permits, I'd also like to create native Windows/Mac/Linux(GTK) varients as well, but that currently seems very unlikely.

## How do I use it?
1. Download the latest release from the releases tab.
2. Extract the zip file.
3. Open a terminal to the root of the extracted folder, and run `pip install -r requirements.txt` to install the projects dependencies.
     1. If the above does not work, try `py -m pip install -r requirements.txt` or `python3 -m pip install -r requirements.txt`
4. In the same terminal, navigate to `/server` and run `python3 ./server.py`
     1. If the above does not work, try `py ./server.py`
5. In a second terminal, navigate to `/webclient` and run `python3 -m http.server 8080`.
     1. If the above does not work, try `py -m http.server 8080`
6. On a device of your choosing, navigate a web browser to `http://<YOUR IP ADDRESS>:8080`
   1. In the IP address field, enter the same IP address
   2. for the port, the default is `8765`
   3. the default password is `PASSWORD123`

Please note that this project is still in the prototyping phase, and should only be used for testing or development purposes. Running this in a production environment could put you and your data at risk.

## How does it work?
 1. `server.py` opens a websocket server, and waits for a client to connect.
 2. When the client device opens `index.html` either locally or through a webserver, it connects to the websocket server that `server.py` has created.
 3. When the user taps on a macro key, it sends the macro key number to the server.
 4. If the server determines that a valid macro key number has been sent, it inputs `ctrl`+`shift`+`F<MACRO NUMBER>`
 5. If the server is able to successfully input those key, it returns a success.
     1. If the client receives a success, it will highlight the key in green for 250ms
 6. If the server encounters an issues, it returns an error
     1. If the client receives an error, it will highlight the key in red for 250ms.

