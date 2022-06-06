const config =  require("./config.json");
const Discord = require("discord.js");
const command = require("./libs/commands.js");
const welcome = require("./libs/commands/welcome.js");
const goodbye = require("./libs/commands/goodbye.js");
const membercount = require("./libs/commands/membercount.js");

const client = new Discord.Client
({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"],
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});


client.on("ready", () =>
{
    console.log("Il bot è pronto!!");

    /* Welcome, goodbye, member count and reaction roles */
    membercount(client);
    welcome(client);
    goodbye(client);

    /* Commands */

    // For showing the members count
    command(client, "membri", (message) =>
    {
        client.guilds.cache.forEach((guild) => 
        {
            const embed = new Discord.MessageEmbed()
            .setColor("#0388fc")
            .setTitle(`Membri totali`)
            .setURL("https://github.com/OselgianMC/Oselgian-BOT/")
            .setThumbnail("attachment://img.png")
            .setDescription(`Questo server fantastico ha un totale di ${guild.memberCount} membri! Wow, impressionante!👀`);

            message.channel.send ({
                embeds: [embed],
                files: ["./src/img.png"]
            });
        });
    });

    // For clearing all the messages
    command(client, "pulisci", (message) => 
    {
        const {member} = message;

        if (member.permissions.has("ADMINISTRATOR"))
        {
            // es: /pulisci 10
            if (message.content.split(" ").length > 1)
            {
                const amount = message.content.split(" ")[1];

                message.channel.bulkDelete(amount);
            }
            else
            {
                message.channel.bulkDelete(100);
            }
        }
        else
        {
            message.reply("Non hai i permessi per pulire i messaggi, lol");
        }
    });

    // For creating text channels
    command(client, "canaletxt", (message) => 
    {
        const {member} = message;
        const name = message.content.replace("/canaletxt", "");

        if (member.permissions.has("ADMINISTRATOR"))
        {
            message.guild.channels.create(name,
            {
                type: "GUILD_TEXT",
            })
            .then((channel) => 
            {
                console.log(`Hai appena creato il canale testuale ${channel.name}! Sei più forte di Goku ultra istinto lmfao`);
            });
        }
    });

    // For creating voice channels
    command(client, "canalevc", (message) => 
    {
        const name = message.content.replace("/canalevc", "");
        const {member} = message;

        if (member.permissions.has("ADMINISTRATOR"))
        {
            message.guild.channels.create(name,
            {
                type: "GUILD_VOICE",
            });
        }
    });

    // For creating temporary voice channels
    command(client, "aprivc", (message) =>
    {
        const name = message.content.replace("/aprivc", "");

        message.guild.channels.create(name,
        {
            type: "GUILD_VOICE",
        });

        command(client, "chiudivc", (message) =>
        {
            const fetchedChannel = message.guild.channels.find(r => r.name === args.join(' '));

            fetchedChannel.delete();
        });
    });

    // Server info command
    command(client, "info", (message) => 
    {
        const {guild} = message;
        const owner = guild.fetchOwner();
        const {name, memberCount, AFKtimeout} = guild;

        const embed = new Discord.MessageEmbed()
            .setColor("#0388fc")
            .setTitle(`${name} info`)
            .setURL("https://github.com/OselgianMC/Oselgian-BOT")
            .setThumbnail("attachment://img.png")
            .addFields
            (
                {
                    name: "Regione",
                    value: `${message.guild.preferredLocale}`,
                },
                {
                    name: "Membri",
                    value: `${memberCount}`,
                },
                {
                    name: "Creatore",
                    value: `${owner}`,
                },
                {
                    name: "Timeout AFK",
                    value: `${AFKtimeout / 60}`,
                },
            );
        
        message.channel.send ({
            embeds: [embed],
            files: ["./src/img.png"]});
    });
    
    // Help command
    command(client, "aiuto", (message) => 
    {
        const aembed = new Discord.MessageEmbed()
            .setColor("#0388fc")
            .setTitle("Impara i miei comandi!")
            .setURL("https://github.com/OselgianMC/Oselgian-BOT")
            .setThumbnail("attachment://img.png")
            .addFields
            (
                {name: "/membri:", value: "Mostra il numero di membri del server"},
                {name: "/info:", value: "Mostra informazioni sul server"},
                {name: "/ticket", value: "Crea un ticket"},
            );

        message.channel.send({embeds: [aembed], files: ["./src/img.png"]});
    });

    command(client, "adminaiuto", (message) => 
    {
        const {member} = message;

        const embed = new Discord.MessageEmbed()
            .setColor("#0388fc")
            .setTitle("Impara i miei comandi da vero staffer!")
            .setURL("https://github.com/OselgianMC/Oselgian-BOT")
            .setThumbnail("attachment://img.png")
            .addFields
            (
                {name: "/pulisci:", value: "Pulisce tutti i messaggi in un canale"},
                {name: "/canaletxt <Nome canale>:", value: "Crea un canale testuale"},
                {name: "/canalevc <Nome canale>:", value: "Crea un canale vocale"},
                {name: "/ban <@utente>:", value: "Banna membri"},
                {name: "/kick <@utente>:", value: "Kicka membri"},
                {name: "/mute <@utente>:", value: "Muta un utente"},
                {name: "/unmute <@utente già stato mutato>:", value: "Smuta un utente"},
                {name: "/chiudi:", value: "Chiude un ticket"},
            );

        if (member.permissions.has("ADMINISTRATOR"))
        {
            message.channel.send({embeds: [embed], files: ["./src/img.png"]});
        }
        else
        {
            message.channel.send("Non hai i permessi per usare questo comando!😹");
        }
    });

    // Ban command
    command(client, "ban", (message) => 
    {
        const {member, mentions} = message;
        const tag =    `<@${member.id}>`;

        if (member.permissions.has("ADMINISTRATOR") || member.permissions.has("BAN_MEMBERS"))
        {
            const target = mentions.users.first();

            if (target)
            {
                const targetMember = message.guild.members.cache.get(target.id);

                targetMember.ban();
                message.channel.send(`GG ${tag}, hai appena bannato un fuori legge!`);
            }
            else
            {
                message.channel.send(`${tag} Chi vuoi bannare?? Te stesso😹?`);
            }
        }
        else
        {
            message.channel.send(`${tag} Bruh non hai neanche i permessi per bannare qualcuno😹`);
        }
    });

    // Kick command
    command(client, "kicka", (message) => 
    {
        const {member, mentions} = message;
        const tag =    `<@${member.id}>`;

        if (member.permissions.has("ADMINISTRATOR") || member.permissions.has("KICK_MEMBERS"))
        {
            const target = mentions.users.first();

            if (target)
            {
                const targetMember = message.guild.members.cache.get(target.id);

                targetMember.kick();
                message.channel.send(`GG ${tag}, hai appena kickato un fuori legge!`);
            }
            else
            {
                message.channel.send(`${tag} Chi vuoi kickare?? Te stesso😹?`);
            }
        }
        else
        {
            message.channel.send(`${tag} Bruh non hai neanche i permessi per bannare qualcuno😹`);
        }
    });

    // Mute and unmute command
    command(client, "muta", (message) =>
    {
        const {member, mentions} = message;
        const giverole = member.guild.roles.cache.find((role) => role.name === "Mutato");

        if (member.permissions.has("ADMINISTRATOR") || member.permissions.has("MANAGE_ROLES"))
        {
            const target = mentions.users.first();
            const tag =    `<@${member.id}>`;

            if (target)
            {
                const targetMember = message.guild.members.cache.get(target.id);

                if (targetMember.roles.cache.has(giverole.id))
                {
                    targetMember.roles.remove(giverole);
                    message.channel.send(`${tag} ha appena smutato ${target}!`);
                }
                else
                {
                    targetMember.roles.add(giverole);
                    message.channel.send(`${tag} ha appena mutato ${target}!`);
                }
            }
            else
            {
                message.channel.send(`${tag} Chi vuoi mutare?? Te stesso😹?`);
            }
        }
    });


    // Ticket command
    command(client, "ticket", (message) =>
    {
        const channelID = "936910314312704010";
        const categoryID = "858268528661889035";

        const {guild, member} = message;
        const channel = guild.channels.cache.get(channelID);
        const channelname = `ticket-${member.id}`;

        channel.send(`Un nuovo ticket è stato creato da ${member}!`)
        .then(() => 
        {
            message.guild.channels.create(`${channelname}`,
            {
                type: "GUILD_TEXT",
                parent: categoryID,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: ["VIEW_CHANNEL"],
                    },
                    {
                        id: member.id,
                        allow: ["VIEW_CHANNEL"],
                    },
                    {
                        id: guild.roles.everyone.id,
                        deny: ["VIEW_CHANNEL"],
                    },
                ],
            });

            channel.send(`Ti aiuteremo presto nel canale ticket! ${channelname}`);

            command(client, "chiudi", (message) =>
            {
                const {guild, member} = message;
                const channel = guild.channels.cache.get(channelID);

                channel.send(`Il ticket è stato chiuso da ${member}`);
                message.channel.delete();
            })
        });
    });

    client.on("messageCreate", (message) => 
    {
        const {member, content} = message;

        /* discord.gg/hemerald */

        if (content.includes("discord.gg/") || content.includes("discord.com/invite/"))
        {
            message.delete();
            message.channel.send(`${member} non puoi pubblicizzare!`);
            message.channel.send(`/muta ${member}`);
        }
    });

    client.on("messageCreate", (message) =>
    {
        const {member, content} = message;
        
        /* Anti-rickroll */
        if
        (
            content.includes("https://www.youtube.com/watch?v=dQw4w9WgXcQ") || content.includes("https://www.youtube.com/watch?v=iik25wqIuFo") ||
            content.includes("https://www.youtube.com/watch?v=X_8Nh5XfRw0") || content.includes("https://www.youtube.com/watch?v=QB7ACr7pUuE") ||
            content.includes("https://www.youtube.com/watch?v=j7gKwxRe7MQ") || content.includes("https://www.youtube.com/watch?v=-pHhb4biR9k") ||
            content.includes("https://www.youtube.com/watch?v=RvBwypGUkPo") || content.includes("https://www.youtube.com/watch?v=fm4fLvDPv0Y") ||
            content.includes("https://www.youtube.com/watch?v=a6pbjksYUHY") || content.includes("https://www.youtube.com/watch?v=sSSOG8g7PFg") ||
            content.includes("https://www.youtube.com/watch?v=LWErcuHm_C4") || content.includes("https://www.youtube.com/watch?v=j8PxqgliIno") ||
            content.includes("https://www.youtube.com/watch?v=AACOcpA8i")   || content.includes("https://www.youtube.com/watch?v=dRV6NaciZVk") ||
            content.includes("https://www.youtube.com/watch?v=MCjlo7PtXMQ") || content.includes("https://www.youtube.com/watch?v=ll-mQPDCn-U") ||
            content.includes("https://www.youtube.com/watch?v=mrThFRR3n8A") || content.includes("https://www.youtube.com/watch?v=bIwVIx5pp88") ||
            content.includes("https://www.youtube.com/watch?v=HnfkEVtetuE")
        )
        {        
            const rrembed = new Discord.MessageEmbed()
            .setColor("#0388fc")
            .setTitle(`Non inviare una gif tanto non funzionerà`)
            .setURL("https://github.com/OselgianMC/Oselgian-BOT")
            .setThumbnail("attachment://nerd.jpg")
            .setDescription(`${member} Bruh veramente pensavi di rickrollare qualcuno lol😹`);

            message.delete();

            message.channel.send({
                embeds: [rrembed],
                files: ["./src/nerd.jpg"]
            });
        }
    });
});

client.login(process.env.token);
