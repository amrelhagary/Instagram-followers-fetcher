const program = require('commander');
const inquirer = require('inquirer');
const fetchFollowers = require('./index');

const questions = [
    {
        type: 'input',
        name: 'accountId',
        message: 'Please provide instagram Account ID (username)',
        validate: function(value) {
            if(value == "" || value.length === 0){
                return 'username is required';
            }

            return true;
        }
    },
    {
        type: 'input',
        name: 'password',
        message: 'Please provide instagram Account Password',
        validate: function(value) {
            if(value == "" || value.length === 0){
                return 'password is required';
            }

            return true;
        }
    },
    {
        type: 'input',
        name: 'targetAccountUsername',
        message: 'Please provide targeted instagram Account ID (username)',
        validate: function(value) {
            if(value == "" || value.length === 0){
                return 'username is required';
            }

            return true;
        }
    }
]
program
    .version('1.0.0')
    .description('Instagram API Fetcher');

program
    .command('fetch')
    .alias('f')
    .description('Fetch target instagram account followers')
    .action(() => {
        inquirer.prompt(questions).then(answers => {
            fetchFollowers(answers.accountId, answers.password, answers.targetAccountUsername);
        });
    });

program.parse(process.argv);