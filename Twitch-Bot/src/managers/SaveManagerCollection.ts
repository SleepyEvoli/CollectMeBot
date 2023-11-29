import User from '../entities/User';
import SaveManager from './SaveManager';

import { CollectionData } from '../interfaces/SaveStructure';

export default class SaveManagerCollection extends SaveManager {

	public constructor() {
		super();
	}

	public getCollection(channelName: string, userLogin: string): CollectionData[] {
		if (!this.data.channels[channelName]) {
			return [];
		}
		const channel = this.data.channels[channelName];
		if (!channel.users[userLogin]) {
			return [];
		}
		return channel.users[userLogin].data.collection;
	}

	public getCollectible(channelName: string, userLogin: string, collectibleName: string): CollectionData | null {
		if (!this.data.channels[channelName]) {
			return null;
		}
		const channel = this.data.channels[channelName];
		if (!channel.users[userLogin]) {
			return null;
		}
		const collection = channel.users[userLogin].data.collection;
		for (const collectible of collection) {
			if (collectible.name.toLowerCase() === collectibleName.toLowerCase()) {
				return collectible;
			}
		}
		return null;
	}

	public addCollection(channelName: string, user: User, collectible: CollectionData): void { // TODO: Check if we can get user data from outside
		if (!this.data.channels[channelName]) {
			this.data.channels[channelName] = {
				users: {}
			}
		}
		const channels = this.data.channels[channelName];
		if (!channels.users[user.login]) {
			channels.users[user.login] = {
				displayName: user.displayName,
				id: user.userid,
				data: {
					collection: [],
				},
			}
		}
		channels.users[user.login].data.collection.push(collectible);
	}

	public removeCollectible(channelName: string, userLogin: string, collectibleName: string): void {
		if (!this.data.channels[channelName]) {
			return;
		}
		const channel = this.data.channels[channelName];
		if (!channel.users[userLogin]) {
			return;
		}
		const index = channel.users[userLogin].data.collection.findIndex((value) => {
			return value.name === collectibleName;
		});
		if (index === -1) {
			return;
		}
		channel.users[userLogin].data.collection.splice(index, 1);
	}

	public clearCollection(channelName: string, userLogin: string): void {
		if (!this.data.channels[channelName]) {
			return;
		}
		const channel = this.data.channels[channelName];
		if (!channel.users[userLogin]) {
			return;
		}
		channel.users[userLogin].data.collection = [];
	}
}