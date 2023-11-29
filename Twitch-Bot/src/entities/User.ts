export default class User {

	userid: string;
	displayName: string;
	data: any;
	subscriber: boolean;
	turbo: boolean;
	returningChatter: boolean;
	mod: boolean;
	color: string;
	vip: boolean;

	constructor(
		userid: string, 
		displayName: string,
		data: any = {},
		subscriber: boolean = false,
		turbo: boolean = false,
		returningChatter: boolean = false,
		mod: boolean = false,
		color: string = '',
		vip: boolean = false,
	) 
	{
		this.userid = userid;
		this.displayName = displayName;
		this.data = data;
		this.subscriber = subscriber;
		this.turbo = turbo;
		this.returningChatter = returningChatter;
		this.mod = mod;
		this.color = color;
		this.vip = vip;
	}

	static fromRawMessage(rawMessage: string) {
		const metaInformation = rawMessage.split(';');

		const metaMap = new Map();
		metaInformation.forEach(element => {
			metaMap.set(element.split('=')[0].trim(), element.split('=')[1].trim());
		});

		const userId = metaMap.get('user-id')
		const subscriber = Boolean(parseInt(metaMap.get('subscriber')))
		const turbo = Boolean(parseInt(metaMap.get('turbo')))
		const returningChatter = Boolean(parseInt(metaMap.get('returning-chatter')))
		const mod = Boolean(parseInt(metaMap.get('mod')))
		const displayName = metaMap.get('display-name')
		const color = metaMap.get('color')
		const vip = Boolean(parseInt(metaMap.get('vip')))
		const data = {}

		return new User(userId, displayName, data, subscriber, turbo, returningChatter, mod, color, vip);
	}
}