const { Command } = require('discord.js-commando');
const { rankings } = require('../../settings/ranks.json');
const modes = ['SZ', 'TC', 'RM', 'CB', 'ALL']

module.exports = class ShowRanksCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ranking',
            memberName: 'ranking',
            group: 'ranks',
            description: 'Show the ranking',
            examples: ['ranking cb', 'ranking tc 201805'],
            guildOnly: true,
            args: [
                {
                    key: 'mode',
                    prompt: 'The mode in which you want to show the ranking',
                    type: 'string',
                    default: 'all'
                },
                {
                    key: 'month',
                    prompt: 'The month of the ranking',
                    type: 'integer',
                    default: ''
                }
            ]
        });
    }

    run(msg, {mode, month}) {

        if(modes.indexOf(mode.toUpperCase()) == -1) {
            return msg.say('Mode saisi incorrect. Veuillez utiliser l\'un des termes suivants: ' + modes.join(', ').toLowerCase());
        }

        if(!month) {
            const date = new Date();
            month = date.getFullYear().toString() + ('0' + date.getMonth().toString()).slice(-2);
        }
        if(month.length !== 6) {
            return msg.say('Format du mois saisi incorrect, veuillez saisir le mois sous le format \'yyyymm\'.');
        }

        const mYear = month.substr(0,4).parseInt();
        const mMonth = month.substr(4,2).parseInt();

        if(mYear.isNaN() || mMonth.isNaN()) {
            return msg.say('Format du mois saisi incorrect, veuillez saisir le mois sous le format \'yyyymm\'.');
        }

        if(mYear < 2018 || mYear > date.getFullYear() || mMonth < 1 || mMonth > 12) {
            return msg.say('Mois saisi incorrect. Veuillez saisir une année entre 2018 et l\'année actuelle ainsi qu\'un mois entre 1 et 12');
        }
        
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

        let classement = '**__Rankings ' + mMonth + '/' + mYear + ':__**';

        if(mode.toLowerCase() !== 'all') {
            if(!rankings[month][guildId].hasOwnProperty(mode.toLowerCase())) {
                return msg.say('Aucun Power n\'a été saisi ce mois-ci pour le mode ' + mode.toUpperCase());
            }

            classement += '\n**Mode: ' + mode.toUpperCase() + '**\n';

            rankings[month][guildId][mode.toLowerCase()].sort(function (a, b) {
                return b-a;
            }).forEach((a, b) => {
                client.fetchUser(a).then(u => {
                    classement += u.tag + ' - ' + b + '\n';
                }, err => {
                    console.log(err);
                })
            });
        }
        else {
            Object.keys(rankings[month][guildId]).forEach(m => {
                classement += '\n**Mode: ' + m.toUpperCase() + '**\n';

                rankings[month][guildId][m].sort(function (a, b) {
                    return b-a;
                }).forEach((a, b) => {
                    client.fetchUser(a).then(u => {
                        classement += u.tag + ' - ' + b + '\n';
                    }, err => {
                        console.log(err);
                    })
                });
            });
        }

        return msg.say(classement);
    }
};