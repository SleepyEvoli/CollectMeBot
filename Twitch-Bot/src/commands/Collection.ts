import Context from "../entities/Context";
import ChatCommand from "../interfaces/ChatCommand";
import Config from "../Config";
import MessageQueueManager from "../managers/MessageQueueManager";
import SaveManagerCollection from "../managers/SaveManagerCollection";

export default class Collection implements ChatCommand {
	
	name: string;
	description: string;
	aliases: string[];
	args: string[];

	constructor() {
		this.name = 'collection';
		this.description = 'See your collection.';
		this.aliases = [];
		this.args = [];
	}

	async execute(ctx: Context): Promise<void> {
		const saveManager = new SaveManagerCollection();
		const messageQueueManager = MessageQueueManager.getInstance();
		let collection = null;
		let name = null;

		if (!this.validArgs()) return;

		if (this.args.length == 1) {
			name = this.args[0];
			if (name.startsWith('@')) {
				name = name.substring(1);
			}
			collection = saveManager.getCollection(ctx.channel.name, name);
		} else {
			name = ctx.user.displayName
			collection = saveManager.getCollection(ctx.channel.name, ctx.user.login);
		}
		 if (collection.length == 0) {
			messageQueueManager.addMessage(`${name} has no collection yet.`, ctx.channel.name);
		} else {
			messageQueueManager.addMessage(`${name}'s collection: ${Config.COLLECTION_URL}?user=${name.toLowerCase()}&channel=${ctx.channel.name}`, ctx.channel.name);
		}
		
	}

	validArgs(): boolean {
		return this.args.length <= 1;
	}
}