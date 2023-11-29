export default class Config {
	public static readonly BOT_NAME: string = 'CollectMeBot';
	public static readonly REGISTERED_CHANNELS: string[] = ['dasevoli'];
	//public static readonly EVENT_COOLDOWN: number = 1000 * 60 * 30;
	//public static readonly EVENT_DURATION: number = 1000 * 60 * 1;
	public static readonly EVENT_COOLDOWN: number = 1000 * 5 * 1;
	public static readonly EVENT_DURATION: number = 1000 * 15 * 1;
	public static readonly COLLECTION_URL: string = 'https://collectmebot.dasevoli.com/collection/';
	public static readonly SHINY_CHANCE: number = 0.1;
	public static readonly MESSAGE_DELAY: number = 1000 * 3;
	public static readonly CHECK_FOR_NEW_CHANNELS_INTERVAL: number = 1000 * 60 * 5;
}