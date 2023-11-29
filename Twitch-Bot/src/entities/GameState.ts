import Channel from "./Channel";
import User from "./User";

export default class GameState {

	channel: Channel;
	players: User[] = [];
	data: any = {};

	constructor(channel: Channel) {
		this.channel = channel;
	}

	playerExists(user: User): boolean {
		return this.players.includes(user);
	}


}