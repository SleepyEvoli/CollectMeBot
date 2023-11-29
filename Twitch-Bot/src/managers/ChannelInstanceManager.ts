import Bot from "../entities/Bot";
import Channel from "../entities/Channel";
import EventManager from "./EventManager";

export default class ChannelInstanceManager {

	public channel: Channel;
	private eventManager: EventManager;

	public constructor(channel: Channel) {
		this.channel = channel;
		this.eventManager = new EventManager(channel);
		this.eventManager.startEventLooper();
	}

	public static getInstanceByChannelName(channelName: string): ChannelInstanceManager | null {
		const bot = Bot.getInstance();
		return bot.channelInstances.find((channelInstance) => channelInstance.channel.name === channelName) ?? null;
	}

	public getEventManager(): EventManager {
		return this.eventManager;
	}

}