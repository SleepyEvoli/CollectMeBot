import Channel from './Channel';
import Config from '../Config';
import fs, { read } from 'fs';
import ChannelInstanceManager from '../managers/ChannelInstanceManager';

export default class Bot {
	
	private static instance: Bot;
	registeredChannels: Channel[] = [];
	channelInstances: ChannelInstanceManager[] = [];
	name: string = Config.BOT_NAME;
	onlineSince: Date;
	conn: any = null;

	private constructor(connection: any) {
		this.conn = connection;
		this.onlineSince = new Date();
		this.connectToTwitchServer();
		this.checkChannelsFileLooper();
	}

	public static getInstance(connection: any = null): Bot {
		if (!this.instance) {
			this.instance = new this(connection);
		}
		return this.instance;
	}

	private checkChannelsFileLooper() {
		setInterval(() => {
			this.readFileAndAddNewChannels();
			this.readFileAndDeleteRemovedChannels();
		}, Config.CHECK_FOR_NEW_CHANNELS_INTERVAL);
	}

	public readFileAndAddNewChannels() {
		const file = fs.readFileSync(process.env.CHANNEL_FILE_PATH ?? "", 'utf8');
		file.split(',').forEach((channelName) => {
			if (!this.registeredChannels.find((channel) => channel.name === channelName)) {
				const newChannel = new Channel(channelName);
				this.registeredChannels.push(newChannel);
				this.channelInstances.push(new ChannelInstanceManager(newChannel));
				this.joinChannel(newChannel);
			}
		})
	}

	private readFileAndDeleteRemovedChannels() {
		const file = fs.readFileSync(process.env.CHANNEL_FILE_PATH ?? "", 'utf8');
		const fileChannels = file.split(',');
		const registeredChannelNames = this.registeredChannels.map((channel) => channel.name);
		const deletedChannels = registeredChannelNames.filter((channelName) => !fileChannels.includes(channelName));
		if (deletedChannels.length > 0) {
			console.log(`Deleted channels: ${deletedChannels.join(', ')}`);
			this.registeredChannels = this.registeredChannels.filter((channel) => !deletedChannels.includes(channel.name));
			this.channelInstances = this.channelInstances.filter((channelInstance) => !deletedChannels.includes(channelInstance.channel.name));
		}
	}

	private connectToTwitchServer() {
		console.log('Connecting to Twitch IRC...');
		this.conn.sendUTF('CAP REQ :twitch.tv/commands twitch.tv/tags twitch.tv/membership');
		this.conn.sendUTF(`PASS oauth:${process.env.ACCESS_TOKEN}`);
		this.conn.sendUTF(`NICK ${process.env.CLIENT_NAME}`);
	}

	private joinChannels() {
		console.log('Joining channels...')
		const channels = this.registeredChannels.map((channel) => {
			return '#' + channel.name;
		});
		this.conn.sendUTF('JOIN ' + channels.join(','));
	}

	private joinChannel(channel: Channel) {
		this.conn.sendUTF('JOIN #' + channel.name);
	}

	public sendPong() {
		this.conn.sendUTF('PONG :tmi.twitch.tv');
		console.log('PONG sent');
	}

	public sendMessageToChannel(channelName: String, msg: string, users = []) {
		if (users.length > 0) {
			let usersStr = users.join(', ');
			msg = `${usersStr} ${msg}`;
		}
		this.conn.sendUTF(`PRIVMSG #${channelName} :${msg}`);
	}

	public sendMessageToChannels(channels: Channel[], msg: string) {
		for (let channel of channels) {
			this.conn.sendUTF(`PRIVMSG #${channel.name} :${msg}`);
		}
	}
}