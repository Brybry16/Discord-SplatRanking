const { Command } = require('discord.js-commando');
const fs = require('fs');
const fileName = '../../settings/ranks.json';
const rankings = require(fileName);
const modes = ['SZ', 'TC', 'RM', 'CB']

module.exports = class UpdateRankCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rank',
            memberName: 'rank',
            group: 'ranks',
            description: 'Updates the rank of a member',
            examples: ['rank cb 2740.2', 'rank rm 2740.2 @Brybry#0001', 'rank sz delete', 'rank tc delete @Brybry#0001'],
            guildOnly: true,
            args: [
                {
                    key: 'mode',
                    prompt: 'The mode in which the user wants to update his or her rank',
                    type: 'string'
                },
                {
                    key: 'power',
                    prompt: 'Your power in this mode; use delete if you want to remove your power',
                    type: 'string'
                },
                {
                    key: 'user',
                    prompt: 'The user you want tu update the score',
                    type: 'user',
                    default: ''
                }
            ]
        });
    }

    run(msg, { mode, power, user }) {

        const deletePower = 'delete';

        // Vérification des valeurs saisies
        if(modes.indexOf(mode.toUpperCase()) == -1) {
            return msg.channel.send('Mode saisi incorrect. Veuillez utiliser l\'un des termes suivants: ' + modes.join(', ').toLowerCase());
        }
        if(isNaN(parseFloat(power)) && power.toLowerCase() !== deletePower) {
            return msg.channel.send('Power invalide. Veuillez saisir une valeur numérique à 4 chiffres (et un chiffre après la virgule)');
        }
        if(power.toLowerCase() !== deletePower && (parseFloat(power) < 1500 || parseFloat(power) > 5000)) {
            return msg.channel.send('Power invalide. Veuillez saisir une valeur supérieure à 1500 et inférieure à 5000');
        }



        const userId = !user ? msg.author.id : user.id;

        if(userId != msg.author.id && !msg.member.permissions.has('ADMINISTRATOR') && !this.client.isOwner(msg.author)) {
            return msg.channel.send('Erreur: Vous n\'avez pas les permissions nécessaires pour modifier le power d\'un autre utilisateur.');
        }

        const date = new Date();
        const season = date.getFullYear().toString() + ('0' + (date.getMonth() + 1).toString()).slice(-2);

        if(!rankings.hasOwnProperty(season)) {
            rankings[season] = {};
        }

        const guildId = msg.guild.id;

        if(!rankings[season].hasOwnProperty(guildId)) {
            rankings[season][guildId] = {};
            rankings[season][guildId]['sz'] = [];
            rankings[season][guildId]['tc'] = [];
            rankings[season][guildId]['rm'] = [];
            rankings[season][guildId]['cb'] = [];
        }

        const tag = !user ? msg.author.tag : user.tag;

        const updateFn = function (obj, i, a) {
            if(obj.user === userId) {

                if(power.toLowerCase() === deletePower) {
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
                }
                else {
                    obj.power = parseFloat(power);
                    obj.userTag = tag;
                }

                return true;
            }

            return false;
        };

        if(!rankings[season][guildId][mode.toLowerCase()].some(updateFn)) {
            if(power.toLowerCase() === deletePower) {
                return msg.channel.send('Erreur: Vous ne pouvez pas supprimer un Power inexistant.');
            }

            rankings[season][guildId][mode.toLowerCase()].push({'user': userId, 'tag': tag, 'power': parseFloat(power)});
        }

        // Updating JSON file
        fs.writeFile('./settings/ranks.json', JSON.stringify(rankings, null, 4), function(err) {
            if(err) {
                return console.log(err);
            }
        });

        return msg.channel.send('Power mis à jour.');
    }
};