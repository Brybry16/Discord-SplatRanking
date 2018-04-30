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
        if(isNaN(parseFloat(power)) && power !== deletePower) {
            return msg.channel.send('Power invalide. Veuillez saisir une valeur numérique à 4 chiffres (et un chiffre après la virgule)');
        }
        if(power !== deletePower && (parseFloat(power) < 1500 || parseFloat(power) > 5000)) {
            return msg.channel.send('Power invalide. Veuillez saisir une valeur supérieure à 1500 et inférieure à 5000');
        }



        const userId = !user ? msg.author.id : user.id;

        if(userId != msg.author.id && !msg.member.permissions.has('ADMINISTRATOR') && !this.client.isOwner(msg.author)) {
            return msg.channel.send('Erreur: Vous n\'avez pas les permissions nécessaires pour modifier le power d\'un autre utilisateur.');
        }

        const date = new Date();
        const month = date.getFullYear().toString() + ('0' + (date.getMonth() + 1).toString()).slice(-2);

        if(!rankings.hasOwnProperty(month)) {
            rankings[month] = {};
        }

        const guildId = msg.guild.id;

        if(!rankings[month].hasOwnProperty(guildId)) {
            rankings[month][guildId] = {};
            rankings[month][guildId]['sz'] = [];
            rankings[month][guildId]['tc'] = [];
            rankings[month][guildId]['rm'] = [];
            rankings[month][guildId]['cb'] = [];
        }

        const tag = !user ? msg.author.tag : user.tag;

        const updateFn = function (obj, i, a) {
            if(obj.user === userId) {

                if(power === deletePower) {
                    a.splice(i, 1);
                    let deleteNode = true;

                    Object.keys(rankings[month][guildId]).forEach(m => {
                        if(deleteNode && rankings[month][guildId][m].length > 0) {
                            deleteNode = false;
                        }
                    });

                    if(deleteNode) {
                        delete rankings[month][guildId];
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

        if(!rankings[month][guildId][mode.toLowerCase()].some(updateFn)) {
            if(power === deletePower) {
                return msg.channel.send('Erreur: Vous ne pouvez pas supprimer un Power inexistant.');
            }

            rankings[month][guildId][mode.toLowerCase()].push({'user': userId, 'tag': tag, 'power': parseFloat(power)});
        }

        // Updating JSON file
        fs.writeFile('./settings/ranks.json', JSON.stringify(rankings, null, 4), function(err) {
            if(err) {
                return console.log(err);
            }

            return console.log('Power updated');
        });

        return msg.channel.send('Power mis à jour.');
    }
};