I recommend not using this as there is a high chance your account will get locked but I decided to opensource it anyways.

This is a puppeteer based program that automates the process of enrolling in courses on the YorkU REM website. It automates the process of duo 2FA and will have a notification sent to your phone which needs to be accepted within 30s to prevent the program timing out, but after that the bot runs on it's own.

If you decide you don't care if your account gets locked, create a discord bot on the discord developer panel, and add the required values in config.json, then create a webhook in your discord server and go to bot.js, then insert your discord id on line 14, webhook id on line 15, and webhook token on line 16. Insert the desired course codes on line 32 in the format ["XXXXXX", "XXXXXX", "XXXXXX"]. Then insert your YorkU username on line 48 and password on line 50. This is completely hosted on your device so you don't have to worry about it getting compromised. I have applied a 30 minute interval inbetween requests to help the chances of getting your account locked as there is a limit of 100 "transactions" per login session, and that interval length can be changed on line 107.

Best of luck.
