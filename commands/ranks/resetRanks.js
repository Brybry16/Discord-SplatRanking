const { Command } = require('discord.js-commando');
const fs = require('fs');
const fileName = '../../settings/ranks.json';
const rankings = require(fileName);
const modes = ['SZ', 'TC', 'RM', 'CB', 'ALL']

module.exports = class ResetRanksCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'reset',
            memberName: 'reset',
            group: 'ranks',
            description: 'Delete the rank of a user in a specific mode',
            examples: ['reset cb @Brybry#0001', 'reset sz', 'reset'],
            guildOnly: true,
            args: [
                {
                    key: 'mode',
                    prompt: 'The mode in which you want to reset your rank',
                    type: 'string',
                    default: 'all'
                },
                {
                    key: 'user',
                    prompt: 'From which channel do you want to copy the messages ?',
                    type: 'user',
                    default: ''
                }
            ]
        });
    }

    

    run(msg, {mode, user}) {

        // Vérification des valeurs saisies
        if(modes.indexOf(mode.toUpperCase()) == -1) {
            return msg.channel.send('Mode saisi incorrect. Veuillez utiliser l\'un des termes suivants: ' + modes.join(', ').toLowerCase());
        }

        if(!user) {
            user = msg.author;
        }

        const userId = !user ? msg.author.id : user.id;

        if(userId != msg.author.id && !msg.member.permissions.has('ADMINISTRATOR') && !this.client.isOwner(msg.author)) {
            return msg.channel.send('Erreur: Vous n\'avez pas les permissions nécessaires pour supprimer le power d\'un autre utilisateur.');
        }

        const date = new Date();
        const season = date.getFullYear().toString() + ('0' + (date.getMonth() + 1).toString()).slice(-2);

        const notThisMonth = function() {
            return msg.channel.send('Aucun Power n\'a été saisi pour cette saison');
        }

        if(!rankings.hasOwnProperty(season)) {
            return notThisMonth();
        }

        const guildId = msg.guild.id;

        if(!rankings[season].hasOwnProperty(guildId)) {
            return notThisMonth();
        }

        const deleteFn = function (obj, i, a) {
            if(obj.user === userId) {
                a.splice(i, 1);
                let deleteNode = true;

                Object.keys(rankings[season][guildId]).forEach(m => {
                    if(deleteNode && rankings[season][guildId][m].length > 0) {
                        deleteNode = false;
                    }
                });

                if(deleteNode) {
                    delete rankings[season][guildId];
                }
                return true;
            }

            return false;
        };

        if(mode.toLowerCase() !== 'all') {
            if(!rankings[season][guildId].hasOwnProperty(mode.toLowerCase())) {
                return msg.channel.send('Aucun Power n\'a été saisi cette saison dans le mode ' + mode.toUpperCase());
            }

            if(!rankings[season][guildId][mode.toLowerCase()].some(deleteFn)) {
                return msg.channel.send('Le membre **' + user.tag + '** n\'a pas de power enregistré cette saison dans le mode ' + mode.toUpperCase());
            }
        }
        else {
            Object.keys(rankings[season][guildId]).forEach(m => {
                if(!rankings[season][guildId][m.toLowerCase()].some(deleteFn)) {
                    return msg.channel.send('Le membre **' + user.tag + '** n\'a pas de power enregistré cette saison dans le mode ' + m.toUpperCase());
                }
            });
        }

        // Updating JSON file
        fs.writeFile('./settings/ranks.json', JSON.stringify(rankings, null, 4), function(err) {
            if(err) {
                return console.log(err);
            }
        });

        return msg.channel.send(mode.toUpperCase() + ' rank(s) reseted.');
    }
};