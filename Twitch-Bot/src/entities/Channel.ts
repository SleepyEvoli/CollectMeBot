export default class Channel {
	
	name: string;
	roomId: string;

	constructor(name: string, roomId: string = '') {
		this.name = name;
		this.roomId = roomId;
	}

	static fromRawMessage(rawMessage: string) {
		const metaInformation = rawMessage.split(';');

		const metaMap = new Map();
		metaInformation.forEach(element => {
			metaMap.set(element.split('=')[0].trim(), element.split('=')[1].trim());
		});

		const channel = rawMessage.split('PRIVMSG')[1].split(':')[0].trim().replace('#', '');
		const roomId = metaMap.get('room-id');

		return new Channel(channel, roomId);
	}
}