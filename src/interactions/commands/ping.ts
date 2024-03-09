import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {Command} from "../../bot";

const command : Command = {
	command : new SlashCommandBuilder().setName("ping").setDescription("ping pong command"),
	name : "ping" , 
	execute : async(e : CommandInteraction) => { 
		return e.reply("hello world")
	},
	argumentLength : 0, 
	firstArgument : undefined ,
	secondArgument : undefined
}
module.exports = command
