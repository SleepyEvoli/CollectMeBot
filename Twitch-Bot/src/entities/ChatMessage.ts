export default class ChatMessage {
	
	id: string;
	content: string;
	emotes: string[];
	firstMessage: boolean;
	timestamp: number;

	constructor
	( 
		id: string, 
		content: string, 
		emotes: string[],
		firstMessage: boolean,
		timestamp: number
	) 
	{
		this.id = id;
		this.content = content;
		this.emotes = emotes;
		this.firstMessage = firstMessage;
		this.timestamp = timestamp;
	}

	static fromRawMessage(rawMessage: string) {
		const metaInformation = rawMessage.split(';');
		const messagePart = rawMessage.split('PRIVMSG')[1].split(':')[1].trim();

		const metaMap = new Map();
		metaInformation.forEach(element => {
			metaMap.set(element.split('=')[0].trim(), element.split('=')[1].trim());
		});

		const id = metaMap.get('id');
		
		let emotes = [];
		if (metaMap.get('emotes') != '') {
			emotes = metaMap.get('emotes').split('/')
		}

		const firstMessage = Boolean(parseInt(metaMap.get('first-msg')));
		const timestamp = new Date().getTime(); 
		return new ChatMessage(id, messagePart, emotes, firstMessage, timestamp);
	}

}