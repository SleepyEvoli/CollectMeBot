import ChatEvent from '../interfaces/ChatEvent';
import EventManager from '../managers/EventManager';
import { EventState } from '../CustomEnums';
import GameStateManager from '../managers/GameStateManager';
import CollectionManager from '../managers/CollectionManager';
import Collectible from '../entities/Collectible';
import Config from '../Config';
import MessageQueueManager from '../managers/MessageQueueManager';
import SaveManagerCollection from '../managers/SaveManagerCollection';

export default class AppearEvent implements ChatEvent {
	
	name: string = 'appear';
	description: string = 'A character appears and players have to catch it.';
	collectible: Collectible | null = null;
	shiny: boolean = false;
	eventManager: EventManager;

	constructor(eventManager: EventManager) {
		this.eventManager = eventManager;
	}

	async start() {
		const collectionManager = CollectionManager.getInstance();

		this.eventManager.state = EventState.JOIN;
		this.collectible = collectionManager.getRandomCollectible();

		const messageQueueManager = MessageQueueManager.getInstance();
		messageQueueManager.addMessage(`${this.collectible.name} from ${this.collectible.category} has appeared! Type !catch to catch it!`, this.eventManager.channel.name);
		this.shiny = Math.random() < Config.SHINY_CHANCE;
		if (this.shiny) {
		messageQueueManager.addMessage(`Holy moly! It is a shiny ${this.collectible.name}!`, this.eventManager.channel.name);
		}
		await new Promise(resolve => setTimeout(resolve, Config.EVENT_DURATION));
		this.execute();
	}

	execute() {
		const saveManager = new SaveManagerCollection();

		const gameStateManager = GameStateManager.getInstance();
		const messageQueueManager = MessageQueueManager.getInstance();

		this.eventManager.state = EventState.RUNNING;
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
		this.eventManager.state = EventState.STOPPED;
	}

}