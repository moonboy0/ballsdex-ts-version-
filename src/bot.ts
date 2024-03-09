import {ActivityType, Client, ClientOptions} from "discord.js";

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
	constructor(private readonly _token : string){
		this._client = new Client(this._options)
		this._run()
	}

	private async _run() : Promise<void> {
		this._client.login(this._token)
		this._handleOnline()
	}
	private async _handleOnline () : Promise<void> {
		this._client.on("ready" , (e)=> {
			console.log(`i'm running at ${e.user.tag}`)
			e.user.setActivity({
				type : ActivityType.Playing , 
				name : "undertale"
			})
		} ) 
	}





}
