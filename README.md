# Opens the OpenAI's ChatGPT

* 🌍 Opens the ChatGPT from any country, even from unsupported ones (e.g. Russia).
* 👨🏻‍💻 Bypasses captcha.
* 🔁 Tries again if ChatGPT is at capacity right now.

## How it works
[![Video](https://img.youtube.com/vi/gFqiFfD8O8M/0.jpg)](https://www.youtube.com/watch?v=gFqiFfD8O8M)

## How to run

Install the `node` and `tor` packages. On MacOS, this can be done as follows:
```sh
brew install node tor
```

Clone this repository somewhere:
```sh
cd ~
git clone https://github.com/oxilor/chatgpt-runner
```

Install dependencies:
```sh
cd chatgpt-runner
npm install
```

Create a new file `chatgpt.command` which will open ChatGPT
```sh
touch ~/Desktop/chatgpt.command
```

with the following content
```sh
#!/bin/sh

PROJECT_PATH="$HOME/chatgpt-runner"

export CHATGPT_EMAIL="<YOUR_EMAIL>"
export CHATGPT_PASSWORD="<YOUR_PASSWORD>"

cd "$PROJECT_PATH" && npm run start &> /dev/null &
```

Make the file executable:
```sh
chmod +x ~/Desktop/chatgpt.command
```

🎉 Now you can open ChatGPT by double-clicking on the `chatgpt.command` file.
