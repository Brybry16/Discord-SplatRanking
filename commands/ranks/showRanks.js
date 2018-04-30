const { Command } = require('discord.js-commando');
const fileName = '../../settings/ranks.json';
const rankings = require(fileName);
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
            return msg.channel.send('Mode saisi incorrect. Veuillez utiliser l\'un des termes suivants: ' + modes.join(', ').toLowerCase());
        }

        const date = new Date();

        if(!month) {
            month = date.getFullYear().toString() + ('0' + (date.getMonth() + 1).toString()).slice(-2);
        }

        if(month.length !== 6) {
            return msg.channel.send('Format du mois saisi incorrect, veuillez saisir le mois sous le format \'yyyymm\'.');
        }

        const mYear = parseInt(month.substr(0,4));
        const mMonth = parseInt(month.substr(4,2));

        if(isNaN(mYear) || isNaN(mMonth)) {
            return msg.channel.send('Format du mois saisi incorrect, veuillez saisir le mois sous le format \'yyyymm\'.');
        }

        if(mYear < 2018 || mYear > date.getFullYear() || mMonth < 1 || mMonth > 12) {
            return msg.channel.send('Mois saisi incorrect. Veuillez saisir une année entre 2018 et l\'année actuelle ainsi qu\'un mois entre 1 et 12');
        }
        
        const notThisMonth = function() {
            return msg.channel.send('Aucun Power n\'a été saisi pour ce mois');
        }

        if(!rankings.hasOwnProperty(month)) {
            return notThisMonth();
        }

        const guildId = msg.guild.id;

        if(!rankings[month].hasOwnProperty(guildId)) {
            return notThisMonth();
        }

        let classement = '**__Rankings ' + mMonth + '/' + mYear + ':__**';

        const sortFn = function (a, b) {
            if(a === null){
                return 1;
            }
            else if(b === null){
                return -1;
            }

            return b.power - a.power;
        };

        const printFn = function (entry, i) {
            classement += (i+1) + '. ' + entry.tag + ': ' + entry.power + '\n';
        };

        if(mode.toLowerCase() !== 'all') {
            if(!rankings[month][guildId].hasOwnProperty(mode.toLowerCase())) {
                return msg.channel.send('Aucun Power n\'a été saisi dans le mode ' + mode.toUpperCase() + ' pour le mois demandé.');
            }
            if(rankings[month][guildId][mode.toLowerCase()].length === 0) {
                return msg.channel.send('Aucun Power n\'a été saisi dans le mode ' + mode.toUpperCase() + ' pour le mois demandé.');
            }

            classement += '\n**' + mode.toUpperCase() + '**\n';

            rankings[month][guildId][mode.toLowerCase()].sort(sortFn).forEach(printFn);
        }
        else {
            let nbRankings = 0;
            Object.keys(rankings[month][guildId]).forEach(m => {
                if(rankings[month][guildId][m].length === 0) {
                    return;
                }

                classement += '\n**' + m.toUpperCase() + '**\n';

                rankings[month][guildId][m].sort(sortFn).forEach(printFn);

                nbRankings++;
            });

            if(nbRankings === 0) {
                return msg.channel.send('Aucun Power n\'a été saisi pour le mois demandé.');
            }
        }

        return msg.channel.send(classement);
    }
};