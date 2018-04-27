const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const { prefix, token, owner } = require('./settings/config.json');
const links = require('./settings/ranks.json');

try {
    const client = new CommandoClient({
        commandPrefix: prefix,
        owner: owner,
        disableEveryone: true
    });

    client.registry
        .registerDefaultTypes()
        .registerGroups([
            ['link', 'Channel links'],
            ['msgformat', 'Message formatting']
        ])
        .registerDefaultGroups()
        .registerDefaultCommands()
        .registerCommandsIn(path.join(__dirname, 'commands'));

    client.on('ready', () => {
        console.log('Logged in!');
        client.user.setActivity('Watching you');
    });

    // Copie les messages sur les channels linkés
    client.on('message', msg => {
        try {
            // Ne fait rien si on est dans un channel de DM
            if(!msg.guild) {
                return;
            }

            // Ne copie pas si un bot a écrit le message ou si le serveur n'a pas de lien
            if((msg.content.length === 0 && msg.attachments.size === 0)
            || msg.author.bot
            || !links.guilds.hasOwnProperty(msg.guild.id)) {
                return;
            }

            const to = links.guilds[msg.guild.id][msg.channel.id];

            // Ne copie pas si le canal n'a pas de lien
            if(typeof to === 'undefined') {
                return;
            }

            // Récupère le format du message
            const format = formats.hasOwnProperty(msg.guild.id) ? formats[msg.guild.id] : '\\m';

            // Formattage du message
            const formattedMsg = format.replace('\\t', new Date().toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' }))
                                        .replace('\\c', msg.channel)
                                        .replace('\\u', msg.author.tag)
                                        .replace('\\m', msg.cleanContent);

            // Copie des messages
            to.forEach(id => {
                const channel = client.channels.get(id);
                if(channel.type === 'text') {

                    // Envoi de message avec pièce jointe
                    if(msg.attachments.size > 0) {
                        msg.attachments.forEach((MA) => {
                            channel.send(formattedMsg, {
                                files:
                                    [MA.url]
                                });
                        });
                    }

                    // Envoi de message sans pièce jointe
                    else {
                        channel.send(formattedMsg);
                    }
                }
            });
        }
        catch(err) {
            console.log(err);
        }
    });

    try {
        client.login(token);
    }
    catch(err) {
        console.log('Login failed, token may be invalid. Please check the configuration file.\n' + err);
        return;
    }
}
catch(err) {
    console.log('An error occured. Did you enter correct informations in the configuration file ?\n' + err);
}