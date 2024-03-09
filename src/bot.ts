import {ActivityType, Client, ClientOptions, CommandInteraction, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes, SlashCommandBuilder} from "discord.js";
import {join} from "path"
import {readdirSync} from "fs"
export interface Command {
	command : SlashCommandBuilder,
	name : string , 
	execute : (e : CommandInteraction)=>Promise<any>, 
	argumentLength : number , 
	firstArgument : undefined | string ,
	secondArgument : undefined | string
}
export default class Bot {
	private readonly _client : Client
	private readonly _options : ClientOptions = {
		intents  : [
			"MessageContent",
			"Guilds",
			"GuildMembers",
			"GuildMessages",
			"GuildEmojisAndStickers",
			
		]
	}
	private readonly _commands : RESTPostAPIChatInputApplicationCommandsJSONBody[] = []
	private readonly _commandExe : {execute : (e : CommandInteraction) => Promise<any> , name : string}[] = []
	private readonly _rest : REST
	constructor(private readonly _token : string){
		this._client = new Client(this._options)
		this._rest = new REST().setToken(this._token)
		this._readingCommands()
		this._run()
	}

	//main function 
	private async _run() : Promise<void> {
		this._client.login(this._token)
		this._handleInteraction()
		this._handleOnline()
	}
	//handling bot when it gets online 
	private async _handleOnline () : Promise<void> {
		this._client.on("ready" , (e)=> {
			this._registerCommand(e.user.id)
			console.log(`i'm running at ${e.user.tag}`)
			e.user.setActivity({
				type : ActivityType.Playing , 
				name : "undertale"
			})
		} ) 
	}
	//registering all commands 
	private async _registerCommand (id : string) : Promise<void> {
		this._rest.put(Routes.applicationCommands(id) , {
			body : this._commands
		})	
	}

	//reading all commands 
	private _readingCommands () : void {
		const commandPath = join(process.cwd() , "/src/interactions/commands/") 
		const readDirr = readdirSync(commandPath)	
		for(const file of readDirr) {
			const filePath = join(commandPath , `/${file}`)
			const readFile : Command = require(filePath)
			this._commands.push(readFile.command.toJSON())
			this._commandExe.push({execute : readFile.execute , name : readFile.name})
		}
	}

	private  _handleInteraction () : void {
		this._client.on("interactionCreate" , async(e) => {
			if(e.isCommand()) {
				e as CommandInteraction 
				const findCommand = this._commandExe.find(c => c.name == e.commandName) 

				return await findCommand!.execute(e)
			}
		} )
	}
}
