import ChatMessage from "./ChatMessage";
import Channel from "./Channel";
import User from "./User";
import Bot from "./Bot";
import CommandManager from "../managers/CommandManager";
import ChatCommand from "../interfaces/ChatCommand";

export default class Context {
	
	message: ChatMessage;
	channel: Channel;
	user: User;
	command: ChatCommand | null;

	constructor(message: ChatMessage, channel: Channel, user: User, command: ChatCommand | null) {
		this.message = message;
		this.channel = channel;
		this.user = user;
		this.command = command;
	}

	static createContextFromRawMessage(rawMessage: string) {
		const message = ChatMessage.fromRawMessage(rawMessage);
		const channel = Channel.fromRawMessage(rawMessage);
		const user = User.fromRawMessage(rawMessage);
		const command = new CommandManager().getCommandFromMessage(message.content);
		return new Context(message, channel, user, command);
	}

	sendMessage(msg: string, users = []) {
		if (users.length > 0) {
			let usersStr = users.join(', ');
			msg = `${usersStr} ${msg}`;
		}
		Bot.getInstance().conn.sendUTF(`PRIVMSG #${this.channel.name} :${msg}`);
	}

	// TODO: to message queue
	replyToSender(msg: string) {
		Bot.getInstance().conn.sendUTF(`@reply-parent-msg-id=${this.message.id} PRIVMSG #${this.channel.name} :${msg}`);
	}

}