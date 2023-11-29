import Channel from "../entities/Channel";
import User from "../entities/User";
import GameState from "../entities/GameState";
import Bot from "../entities/Bot";

export default class GameStateManager {

	private gameStates: GameState[] = [];
	private static instance: GameStateManager;

	private constructor() {
		this.initializeGameStates(Bot.getInstance().registeredChannels);
	}

	public initializeGameStates(channels: Channel[]) {
		this.gameStates = [];
		channels.forEach(channel => {
			this.gameStates.push(new GameState(channel));
		})
	}

	public static getInstance(): GameStateManager {
		if (!GameStateManager.instance) {
			GameStateManager.instance = new GameStateManager();
		}
		return GameStateManager.instance;
	}

	public getGameState(channel: Channel): GameState {
		const instance = this.gameStates.find(instance => instance.channel.name === channel.name);
		if (instance) {
			return instance;
		} else {
			const newInstance = new GameState(channel);
			this.gameStates.push(newInstance);
			return newInstance;
		}
	}

	public resetGameStates() {
		this.gameStates.forEach(instance => {
			instance.players = [];
			instance.data = {};
		});
	}

	public getGameStates(): GameState[] {
		return this.gameStates;
	}


}