# Opens the OpenAI's ChatGPT

* 🌍 Opens the ChatGPT from any country, even from unsupported ones (e.g. Russia).
* 👨🏻‍💻 Bypasses captcha.
* 🔥 Bypasses «ChatGPT is at capacity right now»

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
#!/bin/zsh

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
