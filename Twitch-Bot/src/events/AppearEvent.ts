import ChatEvent from '../interfaces/ChatEvent';
import EventManager from '../managers/EventManager';
import { EventState } from '../CustomEnums';
import Bot from '../entities/Bot';
import GameStateManager from '../managers/GameStateManager';
import CollectionManager from '../managers/CollectionManager';
import SaveManager from '../managers/SaveManager';
import Collectible from '../entities/Collectible';
import Config from '../Config';
import MessageQueueManager from '../managers/MessageQueueManager';

export default class AppearEvent implements ChatEvent {
	
	name: string;
	description: string;
	collectible: Collectible | null;
	shiny: boolean = false;

	constructor() {
		this.name = 'appear';
		this.description = 'A character appears and players have to catch it.';
		this.collectible = null;
	}

	async start() {
		const eventManager = EventManager.getInstance();
		const bot = Bot.getInstance();
		const collectionManager = CollectionManager.getInstance();

		eventManager.state = EventState.JOIN;
		this.collectible = collectionManager.getRandomCollectible();

		const messageQueueManager = MessageQueueManager.getInstance();
		messageQueueManager.addMessageToAllChannels(`${this.collectible.name} from ${this.collectible.category} has appeared! Type !catch to catch it!`);
		this.shiny = Math.random() < Config.SHINY_CHANCE;
		if (this.shiny) {
			messageQueueManager.addMessageToAllChannels(`Holy moly! It is a shiny ${this.collectible.name}!`);
		}
		await new Promise(resolve => setTimeout(resolve, Config.EVENT_DURATION));
		this.execute();
	}

	execute() {
		const eventManager = EventManager.getInstance();
		const saveManager = SaveManager.getInstance();
		const gameStateManager = GameStateManager.getInstance();
		const messageQueueManager = MessageQueueManager.getInstance();

		eventManager.state = EventState.RUNNING;
		gameStateManager.getGameStates().forEach((gameState) => {
			if (this.collectible) {
				if (gameState.players.length === 0) {
					messageQueueManager.addMessage(`Nobody has caught ${this.collectible.name}...`, gameState.channel.name);
					return;
				}
				const user = gameState.players[Math.floor(Math.random() * gameState.players.length)];
				messageQueueManager.addMessage(`${user.displayName} has caught ${this.collectible.name}! Congratulations! Type !collection to see what you have caught so far.`, gameState.channel.name);
				saveManager.addCollection(gameState.channel.name, user, {
					id: this.collectible.id,
					name: this.collectible.name,
					category: this.collectible.category,
					date: new Date(),
					shiny: this.shiny,
					image: this.collectible.image,
				});
				saveManager.save();
			}
		})
		this.finish();
	}

	finish() {
		const eventManager = EventManager.getInstance();
		eventManager.state = EventState.STOPPED;
	}

}