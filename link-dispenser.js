const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// Replace with your bot's token
const TOKEN = 'YOUR_BOT_TOKEN_HERE';

// Links for options
const links = {
  v1: {
    vercel: ['https://vercel.com/v1/link1', 'https://vercel.com/v1/link2'],
    cloudflare: ['https://cloudflare.com/v1/link1', 'https://cloudflare.com/v1/link2'],
    netlify: ['https://netlify.com/v1/link1', 'https://netlify.com/v1/link2']
  },
  v2: {
    vercel: ['https://vercel.com/v2/link1', 'https://vercel.com/v2/link2'],
    cloudflare: ['https://cloudflare.com/v2/link1', 'https://cloudflare.com/v2/link2'],
    netlify: ['https://netlify.com/v2/link1', 'https://netlify.com/v2/link2'],
    site: ['https://site.com/v2/link1', 'https://site.com/v2/link2']
  }
};

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
  if (message.content.toLowerCase() === '!start') {
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('v1')
          .setLabel('Version 1')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('v2')
          .setLabel('Version 2 (Recommended)')
          .setStyle('PRIMARY')
      );

    await message.reply({ content: 'Select a version:', components: [row] });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const selectedVersion = interaction.customId;

  let options;
  if (selectedVersion === 'v1') {
    options = ['vercel', 'cloudflare', 'netlify'];
  } else if (selectedVersion === 'v2') {
    options = ['vercel', 'cloudflare', 'netlify', 'site'];
  } else {
    return;
  }

  const row = new MessageActionRow()
    .addComponents(
      options.map(option =>
        new MessageButton()
          .setCustomId(`${selectedVersion}_${option}`)
          .setLabel(option)
          .setStyle('SECONDARY')
      )
    );

  await interaction.update({ content: `Select a provider for ${selectedVersion}:`, components: [row] });
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const [version, provider] = interaction.customId.split('_');
  const urlList = links[version][provider];
  const randomUrl = urlList[Math.floor(Math.random() * urlList.length)];

  const embed = new MessageEmbed()
    .setTitle('Here is your link:')
    .setURL(randomUrl)
    .setDescription(randomUrl);

  await interaction.update({ content: '', components: [] });
  await interaction.followUp({ embeds: [embed] });
});

client.login(TOKEN);
