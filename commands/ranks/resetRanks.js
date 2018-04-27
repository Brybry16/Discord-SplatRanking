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
            examples: ['reset cb @Brybry#0001', 'reset sz'],
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
                    type: 'User',
                    default: ''
                }
            ]
        });
    }

    

    run(msg, {mode, user}) {

        // Vérification des valeurs saisies
        if(modes.indexOf(mode.toUpperCase()) == -1) {
            return msg.say('Mode saisi incorrect. Veuillez utiliser l\'un des termes suivants: ' + modes.join(', ').toLowerCase());
        }

        if(!user) {
            user = msg.user;
        }

        if(user.id != msg.user.id && !msg.member.permissions.has('ADMINISTRATOR') && !this.client.isOwner(msg.author)) {
            return msg.say('Erreur: Vous n\'avez pas les permissions nécessaires pour supprimer le power d\'un autre utilisateur.');
        }

        const date = new Date();
        const month = date.getFullYear().toString() + ('0' + date.getMonth().toString()).slice(-2);

        const notThisMonth = function() {
            return msg.say('Aucun Power n\'a été saisi pour ce mois');
        }

        if(!rankings.hasOwnProperty(month)) {
            return notThisMonth();
        }

        const guildId = msg.guild.id;

        if(!rankings[month].hasOwnProperty(guildId)) {
            return notThisMonth();
        }

        if(mode.toLowerCase() !== 'all') {
            if(!rankings[month][guildId].hasOwnProperty(mode.toLowerCase())) {
                return msg.say('Aucun Power n\'a été saisi ce mois-ci pour le mode ' + mode.toUpperCase());
            }
            if(!rankings[month][guildId][mode.toLowerCase()].hasOwnProperty(user.id)) {
                return msg.say('Le membre ' + user.tag + 'n\'a pas de power enregistré ce mois-ci pour le mode ' + mode.toUpperCase());
            }

            delete rankings[month][guildId][mode.toLowerCase()][user.id];
        }
        else {
            Object.keys(rankings[month][guildId]).forEach(m => {
                if(rankings[month][guildId][m].hasOwnProperty(user.id)) {
                    delete rankings[month][guildId][m][user.id];
                }
            });
        }

        // Updating JSON file
        fs.writeFile('./settings/ranks.json', JSON.stringify(guildsList, null, 4), function(err) {
            if(err) {
                return console.log(err);
            }
        });

        return msg.say(mode.toUpperCase() + ' rank(s) reseted.');
    }
};