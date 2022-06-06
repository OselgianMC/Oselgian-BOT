module.exports = (client) =>
{
    name: "membercount";
    
    const channelID = "966752028099502080";

    const updateMembers = guild =>
    {
        const channel = guild.channels.cache.get(channelID);

        channel.setName(`Membri: ${guild.memberCount.toLocaleString()}`);
    }

    client.on("guildMemberAdd", (member) => updateMembers(member.guild));
    client.on("guildMemberRemove", (member) => updateMembers(member.guild));

    const guild = client.guilds.cache.get("858268528661889034");
    
    updateMembers(guild);
}
