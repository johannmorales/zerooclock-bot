require("dotenv").config();

const Discord = require("discord.js");
const moment = require("moment-timezone");

const VOICE_CHANNEL_NAME = "00:00";
const ZERO_O_CLOCK_AT = "83";

function log(data) {
  console.log(`[${moment.tz("America/Lima").toISOString()}] - ${data}`);
}

exports.play = (req, res) => {
  const client = new Discord.Client();
  client.login(process.env.DISCORD_KEY);

  client.on("ready", () => {
    log("client ready");
    const channel = client.channels.cache
      .filter((channel) => channel.type === "voice")
      .find((channel) => channel.name === VOICE_CHANNEL_NAME);

    log(`found voice channel ${VOICE_CHANNEL_NAME} (id: ${channel.id})`);
   
    channel.join().then((connection) => {
      log("joined voice channel");
      const now = moment().tz("America/Lima");
      const target = moment()
        .tz("America/Lima")
        // .add(1, "days")
        .milliseconds(0)
        .seconds(0)
        .minutes(32)
        .hours(16)
        .subtract(ZERO_O_CLOCK_AT, "seconds")
        .subtract(parseInt(process.env.CODE_DELAY), "milliseconds");

        // const wait = target.diff(now);
        const wait = 0;
        log(`waiting ${wait}ms`)
        
      // setTimeout(() => {
        connection
          .play('./resources/audio.mp3')
          .on("start", () => {
            log("started playing");
          })
          .on("finish", () => {
            log("finished playing");
            channel.leave();
            log("left");
            client.destroy();
            res && res.status(200).send("played successfully");
          });
      // }, wait);
      log(`scheduled for ${target.toISOString()}`)
    });
  });
};
