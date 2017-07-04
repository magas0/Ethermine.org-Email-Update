/*
Ethermine Email Update
This program will send a status update for your ethermine.org address.
It was made to work with Webtask.io as a cron job.

Uses the following outside APIs / websites
1. MailGun (Requires API Key and Domain)
2. Ethermine.org (Requires ETH wallet address)
*/

var moment = require('moment');
var request = require('request');
var Mailgun = require('mailgun-js');

// Function to run in Webtask.io, parameters are in ctx
module.exports = function(ctx, done) {

  // MailGun configuration
  var MAILGUN_API_KEY = ctx.data.MAILGUN_API_KEY;
  var MAILGUN_DOMAIN = ctx.data.MAILGUN_DOMAIN;

  // Ethermine.org parameters
  var MINER_ADDRESS = ctx.data.MINER_ADDRESS;
  var MINER_URL = 'https://ethermine.org/api/miner_new/';

  // Email to send the data to
  var EMAIL_TO = ctx.data.EMAIL_TO;

  // Check if the config vars were passed
  if ((!MAILGUN_API_KEY) || (!MAILGUN_DOMAIN)) {
    done(null, 'No Mailgun configuration');
  }

  if (!MINER_ADDRESS) {
    done(null, 'Need a miner address to look up.');
  }

  if (!EMAIL_TO) {
    done(null, 'Need an email to send to.');
  }

  // Grab the JSON data from ethermine.org
  request.get({
    url: MINER_URL + MINER_ADDRESS,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    // There was an error, output the result
    if (err) {
      done(null, 'Error:' + err);
    }
    // Connected, but got bad status code
    else if (res.statusCode !== 200) {
      done(null, 'Status:' + res.statusCode);
    }
    //Success, take the parsed JSON from 'data' and create an email body from it
    else {
      // Convert last seen into a moment instance for formatting
      var last_seen = moment(data.minerStats.lastSeen);

      var email_body =
      '<h3>Stats for address: ' + data.address + '</h3>' +
      '<b>Last Seen:</b> ' + last_seen.format("dddd, MMMM Do YYYY, h:mm:ss a") + '<br>' +
      '<b>Reported Hashrate:</b> ' + (data.minerStats.reportedHashrate / 1000000).toFixed(2) + ' MH/s <br>' +
      '<b>Current Hashrate:</b> ' + (data.minerStats.currentHashrate / 1000000).toFixed(2) + ' MH/s <br>' +
      '<b>Valid Shares:</b> ' + data.minerStats.validShares + '<br>' +
      '<b>Invalid Shares:</b> ' + data.minerStats.invalidShares + '<br>' +
      '<b>Average Hashrate:</b> ' + (data.minerStats.averageHashrate / 1000000).toFixed(2) + ' MH/s <br><br>' +
      '<b>Unpaid:</b> ' + (data.unpaid / 1E18).toFixed(5) + ' ETH';

      // Send the email using MailGun
      send_email(email_body);
    }
  });

  // Use the MailGun API to send an email
  // Params: email_body - the content of the email body in HTML format
  function send_email(email_body) {

    // Create a new MailGun instance and send the email
    var todays_date = moment().format('dddd, MMMM Do YYYY');
    var mailgun = new Mailgun({apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN});

    var email_data = {
      from: 'Ethermine Update <mailgun@' + MAILGUN_DOMAIN + '>',
      to: EMAIL_TO,
      subject: 'Ethermine Status for ' + todays_date,
      html: email_body
    };

    mailgun.messages().send(email_data, function(error, body) {
      // If there was an error, then output
      if (error) {
        done(null, "Could not send email:" + error);
      }
      // There were no errors from MailGun, output repsonse
      else {
        // Email was sent
        done(null, body.message);
      }
    });
  }
}
