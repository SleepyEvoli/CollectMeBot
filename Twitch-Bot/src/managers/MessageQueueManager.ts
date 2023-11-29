import Bot from '../entities/Bot';
import Config from '../Config';

export default class MessageQueueManager {

	private static instance: MessageQueueManager;
	private messages: any = {};

	private constructor() {
		this.processQueue();
	}

	public static getInstance(): MessageQueueManager {
		if (!MessageQueueManager.instance) {
			MessageQueueManager.instance = new MessageQueueManager();
		}
		return MessageQueueManager.instance;
	}

	public processQueue(): void {
		const bot = Bot.getInstance();
		setInterval(() => {
			for (const channelName in this.messages) {
				if (this.messages[channelName].length === 0) continue;
				bot.sendMessageToChannel(channelName, this.messages[channelName][0]);
				this.messages[channelName].shift();
			}
		}, Config.MESSAGE_DELAY);
	}

	public addMessage(message: string, channelName: string) {
		if (!this.messages[channelName]) {
			this.messages[channelName] = [];
		}
		this.messages[channelName].push(message);
	}

	public addMessageToAllChannels(message: string) {
		const bot = Bot.getInstance();
		// TODO: We can use the config file here
		bot.registeredChannels.forEach((channel) => {
			this.addMessage(message, channel.name);
		})
	}
}