const Client = require('instagram-private-api').V1;

const async = require('async');
const writeToCsv = require('./csv');

function fetchFollowers(accountId, password, targetAccountUsername) {

    console.log(`Fetching data for ${accountId}, ${password}, ${targetAccountUsername}`);

    const device = new Client.Device(accountId);
    const storage = new Client.CookieFileStorage(__dirname + `/cookies/${accountId}.json`);

    Client.Session.create(device, storage, accountId, password)
    .then(session => {
        let targetAccount = Client.Account.searchForUser(session, targetAccountUsername);
        return [session, targetAccount]
    })
    .spread(function (session, targetAccount) {
        const followers = new Client.Feed.AccountFollowers(session, targetAccount.id, 10);
        return [session, targetAccount, followers.get()];
    })
    .spread((session, targetAccount, accounts) => {

        async.mapSeries(accounts, function (acc, callback) {

            const p1 = getUserProfile(acc);

            const p2 = getFollowersCount(session, acc);

            const p3 = getFollowingCount(session, acc);
            
            Promise.all([p1, p2, p3]).then(function(values){
                //console.log(values)
                let d = values[0];
                d.followersCount = values[1].length;
                d.followingCount = values[2].length;

                callback(null, d);
            })
            .catch(error => {
                console.error(error);
            })
            
        }, function (err, results) {
            if(err) {
                console.error(err);
                throw err;
            }

            writeToCsv(targetAccount.params.username, results);
        });
    })
    .catch(err => {
        console.error(err);
    })
}


// series of functions
function getUserProfile(acc) {
    return new Promise((resolve, reject) => {
        let d = {};
        d.userId = acc.id;
        d.username = acc.params.username;
        d.fullname = acc.params.fullName;
        d.profilePic = acc.params.profilePicUrl;
        d.isPrivate = acc.params.isPrivate;
        d.isVerified = acc.params.isVerified;
        d.externalUrl = `https://www.instagram.com/${d.username}`;
        resolve(d);
    })
}
function getFollowersCount(session, account) {
    const feed = new Client.Feed.AccountFollowers(session, account.id, 10);
    return feed.get();
}

function getFollowingCount(session, account) {
    const feed = new Client.Feed.AccountFollowing(session, account.id, 10);
    return feed.get();
}


module.exports = fetchFollowers;