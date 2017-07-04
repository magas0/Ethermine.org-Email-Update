# Ethermine.org Email Update

This program will send a status update for your ethermine.org address.
It was made to work with Webtask.io. 

Requires
1. MailGun (Requires API Key and Domain)
2. Ethermine.org (Requires Eth wallet address)
3. Email address to send update to

Example One Time Usage:

wt create ethermine_update.js -s MAILGUN_API_KEY=<your_api_key>

curl "https://<webtask.io URL>/ethermine_update?MAILGUN_DOMAIN=<your_mailgun_domain>&MINER_ADDRESS=<your_wallet_address>&EMAIL_TO=<your_email>"




