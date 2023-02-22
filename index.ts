import { executablePath, Frame, Page } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

if (!process.env.CHATGPT_EMAIL || !process.env.CHATGPT_PASSWORD) {
  throw new Error('CHATGPT_EMAIL and CHATGPT_PASSWORD env vars are required')
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function delay(min: number, max: number = min) {
  return new Promise((resolve) => setTimeout(resolve, rand(min, max)))
}

async function clickToElement(page: Page | Frame, selector: string) {
  const element = await page.waitForSelector(selector)
  await delay(200, 500)
  await element.click({ delay: rand(5, 100) })
}

async function typeText(page: Page, text: string) {
  await page.keyboard.type(text, { delay: rand(30, 150) })
}

const CLOUDFLARE_SELECTOR = 'iframe[src^="https://challenges.cloudflare.com"]'

async function solveCloudflareCaptcha(page: Page) {
  const iframeElement = await page.waitForSelector(CLOUDFLARE_SELECTOR)
  const iframe = await iframeElement.contentFrame()
  await delay(3000)
  await iframe.waitForSelector('#verifying-text', { hidden: true })
  await clickToElement(iframe, '.ctp-checkbox-container .mark')
  await page.waitForSelector(CLOUDFLARE_SELECTOR, { hidden: true })
  await solveCloudflareCaptcha(page)
}

const VERIFY_BUTTON_SELECTOR = 'input[value="Verify you are human"]'

async function solveVerifyButton(page: Page) {
  await clickToElement(page, VERIFY_BUTTON_SELECTOR)
  await page.waitForSelector(VERIFY_BUTTON_SELECTOR, { hidden: true })
  await solveVerifyButton(page)
}

async function solveCapacity(page: Page) {
  await page.waitForSelector('text/ChatGPT is at capacity right now')
  await delay(500)
  throw new Error()
}

async function signIn(page: Page) {
  await page.waitForSelector('text/Welcome to ChatGPT')

  await page.waitForNavigation()
  await clickToElement(page, 'div[id="__next"] > div:nth-of-type(1) > div > div:last-of-type > button:first-of-type')

  await page.waitForNavigation()
  const usernameInput = await page.waitForSelector('input[id="username"]')
  await usernameInput.focus()
  await typeText(page, process.env.CHATGPT_EMAIL)
  await clickToElement(page, 'button[type="submit"]')

  await page.waitForNavigation()
  const passwordInput = await page.waitForSelector('input[id="password"]')
  await passwordInput.focus()
  await typeText(page, process.env.CHATGPT_PASSWORD)
  await clickToElement(page, 'button[type="submit"]')

  await clickToElement(page, 'text/Next')
  await clickToElement(page, 'text/Next')
  await clickToElement(page, 'text/Done')
}

puppeteer.use(StealthPlugin())

const browser = await puppeteer.launch({
  executablePath: executablePath(),
  headless: false,
  args: [
    '--proxy-server=socks5://127.0.0.1:9050',
    '--app=https://chat.openai.com',
    '--window-size=1000,900',
  ],
})

while(true) {
  const [page] = await browser.pages()
  await page.setDefaultTimeout(60000)

  try {
    await Promise.race([
      solveCloudflareCaptcha(page),
      solveVerifyButton(page),
      solveCapacity(page),
      signIn(page),
    ])
    break;
  } catch (e) {
    await page.reload()
  }
}
