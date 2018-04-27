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
            examples: ['rank cb 2740.2', 'rank cb @Brybry#0001 2740.2'],
            guildOnly: true,
            args: [
                {
                    key: 'mode',
                    prompt: 'The mode in which the user wants to update his or her rank',
                    type: 'string'
                },
                {
                    key: 'user',
                    prompt: 'The user you want tu update the score',
                    type: 'user',
                    default: ''
                },
                {
                    key: 'power',
                    prompt: 'Your power in this mode',
                    type: 'string'
                }
            ]
        });
    }

    run(msg, { mode, user, power }) {

        // Vérification des valeurs saisies
        if(modes.indexOf(mode.toUpperCase()) == -1) {
            return msg.say('Mode saisi incorrect. Veuillez utiliser l\'un des termes suivants: ' + modes.join(', ').toLowerCase());
        }
        if(isNaN(power.parseFloat())) {
            return msg.say('Power invalide. Veuillez saisir une valeur numérique à 4 chiffres (et un chiffre après la virgule)');
        }
        if(power.parseFloat() < 1500 || power.parseFloat() > 5000) {
            return msg.say('Power invalide. Veuillez saisir une valeur supérieure à 1500 et inférieure à 5000');
        }

        if(!user) {
            user = msg.user;
        }

        if(user.id != msg.user.id && !msg.member.permissions.has('ADMINISTRATOR') && !this.client.isOwner(msg.author)) {
            return msg.say('Erreur: Vous n\'avez pas les permissions nécessaires pour modifier le power d\'un autre utilisateur.');
        }

        const date = new Date();
        const month = date.getFullYear().toString() + ('0' + date.getMonth().toString()).slice(-2);

        if(!rankings.hasOwnProperty(month)) {
            rankings[month] = {};
        }

        if(!rankings[month].hasOwnProperty(msg.guild.id)) {
            rankings[month][msg.guild.id] = {};
            rankings[month][msg.guild.id]['sz'] = {};
            rankings[month][msg.guild.id]['tc'] = {};
            rankings[month][msg.guild.id]['rm'] = {};
            rankings[month][msg.guild.id]['cb'] = {};
        }

        rankings[month][msg.guild.id][mode.toLowerCase()][user.id] = power.parseFloat();

        // Updating JSON file
        fs.writeFile('./settings/ranks.json', JSON.stringify(rankings, null, 4), function(err) {
            if(err) {
                return console.log(err);
            }
        });

        return msg.say('Power mis à jour.');
    }
};