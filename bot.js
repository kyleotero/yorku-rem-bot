const Discord = require("discord.js");
const { token, prefix } = require("./config.json");
const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const got = require("got");
const puppeteer = require("puppeteer");

client.once("ready", () => {
  console.log("Ready!");
});

const discid = "INSERT DISCORD ID HERE";
const webhookid = "INSERT WEBHOOK ID HERE";
const webhooktoken = "INSERT WEBHOOK TOKEN HERE";

const testwebhook = new Discord.WebhookClient({
  id: webhookid,
  token: webhooktoken,
});

const testembed = new Discord.MessageEmbed()
  .setColor("BLUE")
  .setTitle("YorkU Enrolment Bot")
  .setDescription(
    `Congrats ${discid}, you have successfully enrolled in your course.`
  );

const enrolled = false;

const codes = ["INSERT COURSE CODE(S) HERE IN ARRAY FORMAT"];
async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
    ],
  });
  const page = await browser.newPage();

  await page.goto(
    "https://wrem.sis.yorku.ca/Apps/WebObjects/REM.woa/wa/DirectAction/rem"
  );

  //user pass login
  await page.type("#mli", "INSERT YORKU USERNAME HERE", { delay: 50 });
  console.log("Username inputted");
  await page.type("#password", "INSERT YORKU PASSWORD HERE", { delay: 50 });
  console.log("Password inputted");
  console.log(page.url());
  await page.click("[name='dologin']");

  //2fa login
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await page.waitForTimeout(3000);
  await page.waitForSelector("#duo_iframe");
  const elementHandle = await page.$("#duo_iframe");
  const frame = await elementHandle.contentFrame();
  await frame.waitForSelector("div.row-label.push-label button");
  await frame.evaluate(() => {
    document.querySelector("div.row-label.push-label button").click();
  });

  //rem home page
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  await page.select("select", "3");
  await page.click('[type="submit"]');

  do {
    for (var i = 0; i < codes.length; i++) {
      //rem courses page
      await page.waitForSelector('[name="5.1.27.1.23"]');
      await page.click('[name="5.1.27.1.23"]');

      //rem enter course code page
      await page.waitForSelector('[type="text"]');
      await page.type('[type="text"]', codes[i], { delay: 40 });
      await page.click('[type="submit"]');

      //rem confirm page
      await page.waitForSelector('[type="submit"][value="Yes"]');
      await page.click('[type="submit"][value="Yes"]');

      //rem not added page
      await page.waitForSelector('[type="submit"]');
      const stringIsIncluded = await page.evaluate(() => {
        const string = "The course has been  successfully added.";
        const selector =
          "body > form > div:nth-child(1) > table > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td > table:nth-child(4) > tbody > tr:nth-child(1) > td:nth-child(2) > span > font > b";
        console.log(document.querySelector(selector).textContent);
        return document.querySelector(selector).textContent.includes(string);
      });

      //checks for successful add
      console.log(stringIsIncluded);
      if (stringIsIncluded === true) {
        testwebhook.send({
          embeds: [testembed],
        });
        console.log("Successfully added.");
        enrolled = true;
      }
      await page.click('[type="submit"]');
      await page.waitForTimeout(300000);
    }
  } while (enrolled == false);
}

run();
console.log(enrolled);
client.login(token);
