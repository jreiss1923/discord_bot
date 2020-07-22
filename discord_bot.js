const api = require("mangadex-full-api");
const Discord = require("discord.js");
require('dotenv').config();
api.agent.domainOverride = "mangadex.org";

const client = new Discord.Client();
client.on('ready', () => {
  console.log("Bot is ready!");
});

client.on('guildCreate', () => {
  var guilds = client.guilds.cache.values();
  var arr_guilds = [];
  for (let value of guilds) {
    arr_guilds.push(value);
  }
  var newest_guild;
  for (let i = 0; i < arr_guilds.length; i++) {
    console.log(arr_guilds.length);
    if (newest_guild === undefined || newest_guild.joinedTimestamp < arr_guilds[i]) {
      newest_guild = arr_guilds[i];
    }
  }
  var channels = newest_guild.channels.cache.values();
  for (let value of channels) {
    console.log(value);
    if (value.deleted == false && value.type === 'text') {
      const channel = client.channels.cache.get(value.id);
      const startUpEmbed = new Discord.MessageEmbed()
      .setAuthor('The Plot Device')
      .setThumbnail('https://formeinfullbloom.files.wordpress.com/2017/06/gaen5.png')
      .setColor('#c5e300')
      .setTitle('Hi! I\'m The Plot Device!')
      .addField('My prefix is \"!\" For all my commands, type \"!help\"', "!help: Shows all commands\n !search: Search for the most recent release of a manga")
      .setFooter("There is nothing that I don't know. I know everything.");
      channel.send(startUpEmbed);
      break;
    }
  }
});

client.on('message', msg => {
  var message_content = msg.content;
  if (message_content.length >= 9 && message_content.substring(0, 7) === '!search') {
    var manga_title = message_content.substring(8, message_content.length);
    api.agent.login("jreiss1923", process.env.MANGADEX_PWD, false).then(() => {
      var manga = new api.Manga();
      manga.fillByQuery(manga_title).then(manga => {
        var latest_chapter;
        var manga_chapters = manga.chapters;
        for (let i = 0; i < manga_chapters.length; i++) {
          if ((typeof latest_chapter === "undefined" || latest_chapter.timestamp < manga_chapters[i].timestamp) && manga_chapters[i].language === "GB") {
            latest_chapter = manga_chapters[i];
          }
        }
        return latest_chapter;
      }).then(latest_chapter => {
        const mangaEmbed = new Discord.MessageEmbed()
        .setTitle('Your manga has been found!')
        .setAuthor('The Plot Device')
        .setThumbnail('https://formeinfullbloom.files.wordpress.com/2017/06/gaen5.png')
        .setColor('#c5e300')
        .addField("The latest chapter of " + manga.title + " is Chapter " + latest_chapter.chapter + ", which was released on " + convertUnixToString(latest_chapter.timestamp), latest_chapter.link, true)
        .setImage('https://www.mangadex.org' + manga.cover)
        .setTimestamp()
        .setFooter("There is nothing that I don't know. I know everything.");
        msg.channel.send(mangaEmbed);
        msg.channel.send(msg.author.toString());
      }).catch((error) => {
        console.log(error);
      });
    }).catch((error) => {
      const errorEmbed = new Discord.MessageEmbed()
      .setTitle('Oops!')
      .setAuthor('The Plot Device')
      .setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvignette.wikia.nocookie.net%2Fyandere-simulator%2Fimages%2F4%2F4c%2FOugi_Oshino.png%2Frevision%2Flatest%3Fcb%3D20170408052712&f=1&nofb=1')
      .setColor('#c5e300')
      .addField('Mangadex has thrown an error.', error)
      .setTimestamp()
      .setFooter("I know nothing. It's you who knows, mangadex-kun.");
      msg.channel.send(errorEmbed);
      msg.channel.send(msg.author.toString());
    })
  }
   else if (message_content.substring(0, 5) === "!help") {
    const helpEmbed = new Discord.MessageEmbed()
    .setTitle('Help is on the way!')
    .setAuthor('The Plot Device')
    .setThumbnail('https://formeinfullbloom.files.wordpress.com/2017/06/gaen5.png')
    .setColor('#c5e300')
    .addField("Here's my list of commands:", "!help: Shows all commands\n!search: Search for the most recent release of a manga")
    .setFooter("There is nothing that I don't know. I know everything.");
    msg.channel.send(helpEmbed);
    msg.channel.send(msg.author.toString());
   }
   else if (message_content.substring(0, 10) === "!searchplus" && message_content.length >= 12) {
    var manga_title = message_content.substring(11, message_content.length);
    api.agent.login("jreiss1923", process.env.MANGADEX_PWD, false).then(() => {
      console.log(manga_title);
      api.Manga.search(manga_title).then(manga => {
        var mangaSearch = new api.Manga();
        var allManga = [];
        for (let i = 0; i < manga.length; i++) {
          allManga.push(mangaSearch.fill(manga[i]));
        }
        return Promise.all(allManga);
      }).then((allManga) => {
        console.log(allManga);
      }).catch((error) => {
        console.log(error);
      })
    }).catch((error) => {
      const errorEmbed = new Discord.MessageEmbed()
      .setTitle('Oops!')
      .setAuthor('The Plot Device')
      .setThumbnail('https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fvignette.wikia.nocookie.net%2Fyandere-simulator%2Fimages%2F4%2F4c%2FOugi_Oshino.png%2Frevision%2Flatest%3Fcb%3D20170408052712&f=1&nofb=1')
      .setColor('#c5e300')
      .addField('Mangadex has thrown an error.', error)
      .setTimestamp()
      .setFooter("I know nothing. It's you who knows, mangadex-kun.");
      msg.channel.send(errorEmbed);
      msg.channel.send(msg.author.toString());
    })
  }
})

function convertUnixToString(unixTime) {
  var date = new Date(unixTime * 1000);
  return (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
}

client.login(process.env.BOT_KEY);


