import AppearEvent from '../events/AppearEvent';
import ChatEvent from '../interfaces/ChatEvent';
import { EventState } from '../CustomEnums';
import GameStateManager from './GameStateManager';
import Config from '../Config';
import Bot from '../entities/Bot';
import MessageQueueManager from './MessageQueueManager';

export default class EventManager {
	
	private static instance: EventManager;
	currentEvent: ChatEvent | null;
	events: ChatEvent[];
	state: EventState;

	private constructor() {
		this.currentEvent = null;
		this.events = [
			new AppearEvent()
		];
		this.state = EventState.STOPPED;
	}

	public static getInstance(): EventManager {
		if (!EventManager.instance) {
			EventManager.instance = new EventManager();
		}
		return EventManager.instance;
	}

	startEventLooper(random: boolean = true) {
		const messageQueueManager = MessageQueueManager.getInstance();
		setInterval(() => {
			if (this.state === EventState.JOIN || this.state === EventState.RUNNING) {
				console.log(`Event ${this.currentEvent?.name} is still running.`);
				return;
			}

			messageQueueManager.addMessageToAllChannels(`A new event is starting!`);
			
			let event: ChatEvent = this.events[0];
			if (random) {
				event = this.events[Math.floor(Math.random() * this.events.length)];
			} else {
				event = this.events.shift() ?? this.events[0];
				if (event !== undefined) {
					this.events.push(event);
				}
			}
			GameStateManager.getInstance().resetGameStates();
			this.currentEvent = event;
			event.start();
		}, Config.EVENT_COOLDOWN);
	}
}