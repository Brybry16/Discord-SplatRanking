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
            examples: ['ranking', 'ranking cb', 'ranking tc 201805'],
            guildOnly: true,
            args: [
                {
                    key: 'mode',
                    prompt: 'The mode in which you want to show the ranking',
                    type: 'string',
                    default: 'all'
                },
                {
                    key: 'season',
                    prompt: 'The season of the ranking',
                    type: 'integer',
                    default: ''
                }
            ]
        });
    }

    run(msg, {mode, season}) {

        if(modes.indexOf(mode.toUpperCase()) == -1) {
            return msg.channel.send('Mode saisi incorrect. Veuillez utiliser l\'un des termes suivants: ' + modes.join(', ').toLowerCase());
        }

        const date = new Date();

        if(!season) {
            season = date.getFullYear().toString() + ('0' + (date.getMonth() + 1).toString()).slice(-2);
        }

        if(season.length !== 6) {
            return msg.channel.send('Format de la saison saisie incorrect, veuillez saisir la saison sous le format \'yyyymm\'.');
        }

        const mYear = parseInt(season.substr(0,4));
        const mMonth = parseInt(season.substr(4,2));

        if(isNaN(mYear) || isNaN(mMonth)) {
            return msg.channel.send('Format de la saison saisie incorrect, veuillez saisir la saison sous le format \'yyyymm\'.');
        }

        if(mYear < 2018 || mYear > date.getFullYear() || mMonth < 1 || mMonth > 12) {
            return msg.channel.send('Saison saisie incorrecte. Veuillez saisir une année entre 2018 et l\'année actuelle ainsi qu\'un mois entre 1 et 12');
        }
        
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

        let classement = '**__Rankings ' + mMonth + '/' + mYear + ':__**\n';

        const sortFn = function (a, b) {
            if(a === null){
                return 1;
            }
            else if(b === null){
                return -1;
            }

            return b.power - a.power;
        };

        const printMode = function(mode) {
            classement += '\n**__' + mode + '__**\n';
        };

        const printFn = function (entry, i) {
            
            if(i === 3) {
                classement += '\n';
            }
            classement += i < 3 ? '**' + (i+1) + '.** ' : (i+1) + '. ';

            classement += entry.power + ' - ' + entry.tag + '\n';
        };

        if(mode.toLowerCase() !== 'all') {
            if(!rankings[season][guildId].hasOwnProperty(mode.toLowerCase())) {
                return msg.channel.send('Aucun Power n\'a été saisi dans le mode ' + mode.toUpperCase() + ' pour la saison demandée.');
            }
            if(rankings[season][guildId][mode.toLowerCase()].length === 0) {
                return msg.channel.send('Aucun Power n\'a été saisi dans le mode ' + mode.toUpperCase() + ' pour la saison demandée');
            }

            printMode(mode.toUpperCase());

            rankings[season][guildId][mode.toLowerCase()].sort(sortFn).forEach(printFn);
        }
        else {
            let nbRankings = 0;
            Object.keys(rankings[season][guildId]).forEach(m => {
                if(rankings[season][guildId][m].length === 0) {
                    return;
                }

                printMode(m.toUpperCase());

                rankings[season][guildId][m].sort(sortFn).forEach(printFn);

                nbRankings++;
            });

            if(nbRankings === 0) {
                return msg.channel.send('Aucun Power n\'a été saisi pour la saison demandée.');
            }
        }

        return msg.channel.send(classement);
    }
};