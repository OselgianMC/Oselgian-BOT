const Discord = require("discord.js");

module.exports = (client) =>
{
    const channelID = "965921694764109905";

    client.on("guildMemberRemove", async (member) => 
    {
        const tag =     `${member}`;
        const msg = `Bruh, alla fine chi gliene frega di ${tag}?`;
        const channel = member.guild.channels.cache.get(channelID);

        const embed = new Discord.MessageEmbed()
            .setColor("#0388fc")
            .setTitle(`È stato bello...`)
            .setURL("https://chardoxzard.github.io/")
            .setThumbnail("attachment://img.png")
            .setDescription(`${msg}`);

        channel.send ({
            embeds: [embed],
            files: ["./src/img.png"]
        });

        console.log(member);
    });
}
