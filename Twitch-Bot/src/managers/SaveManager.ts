import * as fs from 'fs';
import User from '../entities/User';

interface Channels {
	channels: Record<string, ChannelData>,
}

interface ChannelData  {
	users: Record<string, UserData>,
}

interface UserData {
	displayName: string,
	id: string,
	data: {
		collection: CollectionData[],
	},
}

interface CollectionData {
	id: string,
	name: string,
	category: string,
	date: Date,
	shiny: boolean,
	image: string,
}

export default class SaveManager {

	private static instance: SaveManager;
	private data: Channels = {
		channels: {}
	};	

	private constructor() {}

	public static getInstance(): SaveManager {
		if (!SaveManager.instance) {
			SaveManager.instance = new SaveManager();
		}
		return SaveManager.instance;
	}

	public async initializeFile(name: string): Promise<void> {
		if (!fs.existsSync(name)) {
			fs.writeFileSync(name, JSON.stringify(this.data), 'utf8');
		}
		await this.read();
	}

	public async read(): Promise<void> {
		const data = await fs.promises.readFile(process.env.SAVE_FILE_PATH ?? "", 'utf8');
		const parsedData: Channels = JSON.parse(data);
		this.data = parsedData;
	}

	public getCollection(channelName: string, user: User): CollectionData[] {
		if (!this.data.channels[channelName]) {
			return [];
		}
		const channel = this.data.channels[channelName];
		if (!channel.users[user.userid]) {
			return [];
		}
		return channel.users[user.userid].data.collection;
	}

	public getCollectionByName(channelName: string, name: string): CollectionData[] {
		if (!this.data.channels[channelName]) {
			return [];
		}
		const channel = this.data.channels[channelName];
		for (const user in channel.users) {
			if (channel.users[user].displayName.toLowerCase() === name.toLowerCase()) {
				return channel.users[user].data.collection;
			}
		}
		return [];
	}

	public getCollectible(channelName: string, user: User, collectibleName: string): CollectionData | null {
		if (!this.data.channels[channelName]) {
			return null;
		}
		const channel = this.data.channels[channelName];
		if (!channel.users[user.userid]) {
			return null;
		}
		const collection = channel.users[user.userid].data.collection;
		for (const collectible of collection) {
			if (collectible.name.toLowerCase() === collectibleName.toLowerCase()) {
				return collectible;
			}
		}
		return null;
	}

	public addCollection(channelName: string, user: User, collectible: CollectionData): void {
		if (!this.data.channels[channelName]) {
			this.data.channels[channelName] = {
				users: {}
			}
		}
		const channels = this.data.channels[channelName];
		if (!channels.users[user.userid]) {
			channels.users[user.userid] = {
				displayName: user.displayName,
				id: user.userid,
				data: {
					collection: [],
				},
			}
		}
		channels.users[user.userid].data.collection.push(collectible);
	}

	public removeCollectible(channelName: string, user: User, collectibleName: string): void {
		if (!this.data.channels[channelName]) {
			return;
		}
		const channel = this.data.channels[channelName];
		if (!channel.users[user.userid]) {
			return;
		}
		const index = channel.users[user.userid].data.collection.findIndex((value) => {
			return value.name === collectibleName;
		});
		if (index === -1) {
			return;
		}
		channel.users[user.userid].data.collection.splice(index, 1);
	}

	public clearCollection(channelName: string, user: User): void {
		if (!this.data.channels[channelName]) {
			return;
		}
		const channel = this.data.channels[channelName];
		if (!channel.users[user.userid]) {
			return;
		}
		channel.users[user.userid].data.collection = [];
	}

	public save(): void {
		fs.writeFile(process.env.SAVE_FILE_PATH ?? "", JSON.stringify(this.data), 'utf8', (err) => {
			if (err) {
				console.log(err);
			} else {
				console.log('Save successful.');
			}
		})
	}
}