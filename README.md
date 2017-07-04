# Ethermine.org Email Update

This program will send a status update for your ethermine.org address.
It was made to work with Webtask.io. 

Requires
1. MailGun (Requires API Key and Domain)
2. Ethermine.org (Requires Eth wallet address)
3. Email address to send update to

Example One Time Usage:
wt create ethermine_update.js -s MAILGUN_API_KEY=<MAILGUN_API_KEY>
curl "https://<webtask.io URL>/ethermine_update?MAILGUN_DOMAIN=<MAILGUN_DOMAIN>&MINER_ADDRESS=<WALLET ADDRESS>&EMAIL_TO=<YOUR_EMAIL>"




