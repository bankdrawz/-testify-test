const { ContextMenuCommandBuilder, EmbedBuilder, ApplicationCommandType, AttachmentBuilder } = require('discord.js');
const levelSchema = require('../../schemas/userLevelSystem');
const Canvacord = require(`canvacord`)

module.exports = {
    usableInDms: false,
    category: "Leveling",
    data: new ContextMenuCommandBuilder()
    .setName('• Rank')
    .setType(ApplicationCommandType.User),
    async execute(interaction, client) {

        const member = interaction.guild.members.cache.get(interaction.targetId);
        const guild = interaction.guild;
        const Data = await levelSchema.findOne({ Guild: guild.id, User: member.id});

        const embed = new EmbedBuilder()
        .setColor(client.config.embedLevels)
        .setAuthor({ name: `Leveling System ${client.config.devBy}`})
        .setTitle(`> ${client.user.username} Leveling System ${client.config.arrowEmoji}`)
        .setDescription(`${member} has not gained any XP yet`)
        .setFooter({ text: `Leveling System Rank`})
        .setTimestamp()
        .setThumbnail(client.user.avatarURL())

        if (!Data) return await interaction.reply({ embeds: [embed] })

        await interaction.deferReply();

        const Required = Data.Level * Data.Level * 20 + 20;

        const rank = new Canvacord.Rank()
        .setAvatar(member.displayAvatarURL({ forceStatic: true }))
        .setBackground("IMAGE", "https://img.freepik.com/free-photo/ultra-detailed-nebula-abstract-wallpaper-4_1562-749.jpg")
        .setCurrentXP(Data.XP)
        .setRequiredXP(Required)
        .setRank(1, "Rank", false)
        .setLevel(Data.Level, "Level")
        .setProgressBar("#800080", "COLOR")
        .setUsername(member.user.username)
        .setDiscriminator('0000')

        const Card = await rank.build();

        const attachment = new AttachmentBuilder(Card, { name: "rank.png"})

        await interaction.editReply({ files: [attachment] })
    }
}