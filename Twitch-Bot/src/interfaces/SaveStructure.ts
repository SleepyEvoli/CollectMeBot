export interface Channels {
	channels: Record<string, ChannelData>,
}

export interface ChannelData  {
	users: Record<string, UserData>,
}

export interface UserData {
	displayName: string,
	id: string,
	data: {
		collection: CollectionData[],
	},
}

export interface CollectionData {
	id: string,
	name: string,
	category: string,
	date: Date,
	shiny: boolean,
	image: string,
}

export * from './SaveStructure';