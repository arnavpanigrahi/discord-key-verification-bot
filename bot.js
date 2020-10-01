require('dotenv').config();
const fs = require('fs'); 
const { Client } = require('discord.js');
const PREFIX = "!verify";
const Discord = require('discord.js');
const client = new Client({
    partials:['MESSAGE', 'REACTION']
    });

client.on('ready',()=>{
    console.log(`Logged in as ${client.user.tag}`)
    });

client.on('message', (message)=>{
    const Imperial_Citizen = message.guild.roles.cache.find(role=>role.name==="Imperial Citizen");
    if(message.content.startsWith(PREFIX)){
        message.delete();
        var key = message.content.substring(PREFIX.length+1);
        if(message.channel.id!=761229568185991209) return message.reply("Please verify in <#761229568185991209>").then(message => {message.delete({ timeout: 3000 })});
        else{
            if(!key||!key.length) return message.reply("Please provide valid order id").then(message => {message.delete({ timeout: 3000 })});
            fs.readFile('order_id.txt', function (err, data) {
                if (err) throw err;
                if(data.includes(key)){
                    fs.readFile('consumed_keys.txt', function(e,d){
                        if (e) throw e;
                        if(d.includes(key))
                        {
                            console.log(`Duplicate key sent by ${message.author.tag}: ${key}`);
                            message.reply("Already redeemed!").then(message => {message.delete({ timeout: 3000 })});

                        }
                        else {
                            fs.appendFileSync('consumed_keys.txt', `${key}\n`);
                            console.log(`Successfully verified ${message.author.tag}'s key: ${key}`);
                            message.reply("Success!").then(message => {message.delete({ timeout: 3000 })});
                            const member = message.guild.members.cache.get(message.author.id);
                            if(member){
                                member.roles.add(Imperial_Citizen.id);
                            }
                        }
                    });

                }
                else{
                    message.reply("Invalid order id").then(message => {message.delete({ timeout: 3000 })});
                    console.log(`Verification failed by ${message.author.tag}`);
                }
              });

            }
        }
});
client.login(process.env.TOKEN);