const request = require('request-promise');
const Discord = require('discord.js');
exports.run = async (client, msg, args) => {
	const filter = ['porno', 'xnxx', 'pornhub', 'porn', 'livesex', 'nsfw'];

	for (var i = 0; i < filter.length; i++) {
		if (args.includes(filter[i])) return msg.channel.send('Nix da');
	}

	if (args.length < 1) {
		return msg.reply('Please specify what you are looking for');
	}

	const input = args.slice().join(" ").toLowerCase();

	if (input.includes('porno')) return msg.channel.send('hey');

	const config = require('../../settings.json').googleKey;
	const config2 = require('../../settings.json').googlekey;
	const response = await request({
		headers: { 'User-Agent': 'Mozilla/5.0' },
		uri: 'https://www.googleapis.com/customsearch/v1',
		json: true,
		qs: {
			cx: config,
			key: config2,
			num: 1,
			q: args.join(' ')
		}
	}).catch(error => console.error(error.response.body.error, msg.channel));

	if (!response) return false;

	if (response.searchInformation.totalResults !== '0') {
		const result = response.items[0];
		const link = decodeURIComponent(result.link);

		const embed = new Discord.RichEmbed()
		    .setColor('#0066CC')
			.setAuthor(`${msg.author.username}#${msg.author.discriminator}`, msg.author.avatarURL)
			.setURL(link)
			.setTitle(result.title)
			.setDescription(result.snippet)
			.setFooter(result.link, result.link);

		if (result.pagemap && result.pagemap.cse_thumbnail) embed.setThumbnail(result.pagemap.cse_thumbnail[0].src);

		await msg.channel.send({ embed });
	}

	return false;
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ['g'],
    userpermissions: []
};
exports.help = {
	name: 'google',
	description: 'Searches something on google',
	usage: 'google {query}',
	example: 'google Discord',
	category: 'searches',
    botpermissions: ['SEND_MESSAGES']
};
