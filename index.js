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
            ['ranks', 'Ranking commands']
        ])
        .registerDefaultGroups()
        .registerDefaultCommands()
        .registerCommandsIn(path.join(__dirname, 'commands'));

    client.on('ready', () => {
        console.log('Logged in!');
        client.user.setActivity('x!help');
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