import ChatCommand from '../interfaces/ChatCommand';
import Collection from '../commands/Collection';
import Gift from '../commands/Gift';
import Catch from '../commands/Catch';

export default class CommandManager {

	constructor() {}

	public createCommand(name: string): ChatCommand | null {
		switch (name) {
			case 'catch':
				return new Catch();
			case 'collection':
				return new Collection();
			case 'gift':
				return new Gift();
			default:
				return null;
		}
	}

	public getCommandFromMessage(msg: string): ChatCommand | null {
		if (!msg.startsWith('!')) return null;
		const args = msg.split(' ');
		const name = args[0].replace('!', '');
		args.shift();

		const command = this.createCommand(name);
		if (!command) return null;

		command.name = name;
		command.args = args;
		return command;
	}

	public getArgumentsFromCommand(msg: string): string[] {
		const args = msg.split(' ');
		if (args.length > 1) {
			args.shift();
			return args;
		} else {
			return [];
		}
	}
}