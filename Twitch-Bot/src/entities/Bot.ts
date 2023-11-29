import Channel from './Channel';
import Config from '../Config';
import fs, { read } from 'fs';


export default class Bot {
	
	registeredChannels: Channel[] = [];
	name: string;
	onlineSince: Date;
	conn: any = null;
	private static instance: Bot;

	private constructor() {
		this.readChannelsFile();
		this.checkForNewChannelsLooper();
		this.name = Config.BOT_NAME;
		this.onlineSince = new Date();
	}

	private checkForNewChannelsLooper() {
		setInterval(() => {
			this.readChannelsFile();
		}, 1000 * 60 * 5);
	}

	private readChannelsFile() {
		// TODO: Check if we can get the room id when a new channel is added
		const file = fs.readFileSync(process.env.CHANNEL_FILE_PATH ?? "", 'utf8');
		file.split(',').forEach((channelName) => {
			if (!this.registeredChannels.find((channel) => channel.name === channelName)) {
				this.registeredChannels.push(new Channel(channelName));
			}
		})
	}

	public setConnection(conn: any) {
		this.conn = conn;
	}

	public static getInstance(): Bot {
		if (!this.instance) {
			this.instance = new this();
		}
		return this.instance;
	}

	public connect() {
		console.log('Connecting to Twitch IRC...');
		this.conn.sendUTF('CAP REQ :twitch.tv/commands twitch.tv/tags twitch.tv/membership');
		this.conn.sendUTF(`PASS oauth:${process.env.ACCESS_TOKEN}`);
		this.conn.sendUTF(`NICK ${process.env.CLIENT_NAME}`);
		this.joinChannels();
	}

	public joinChannels() {
		console.log('Joining channels...')
		const channels = this.registeredChannels.map((channel) => {
			return '#' + channel.name;
		});
		this.conn.sendUTF('JOIN ' + channels.join(','));
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

	public sendPong() {
		this.conn.sendUTF('PONG :tmi.twitch.tv');
		console.log('PONG sent');
	}
}