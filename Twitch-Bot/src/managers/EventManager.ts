import AppearEvent from '../events/AppearEvent';
import ChatEvent from '../interfaces/ChatEvent';
import { EventState } from '../CustomEnums';
import GameStateManager from './GameStateManager';
import Config from '../Config';
import MessageQueueManager from './MessageQueueManager';
import Channel from '../entities/Channel';
import User from '../entities/User';

export default class EventManager {
	
	currentEvent: ChatEvent | null = null;
	events: ChatEvent[] = [new AppearEvent(this)];
	state: EventState = EventState.STOPPED;
	channel: Channel;

	public constructor(channel: Channel) {
		this.channel = channel;
	}

	async startEventLooper(random: boolean = true) {
		const messageQueueManager = MessageQueueManager.getInstance();
		setInterval(() => {
			if (this.state === EventState.JOIN || this.state === EventState.RUNNING) {
				console.log(`Event ${this.currentEvent?.name} is still running.`);
				return;
			}

			messageQueueManager.addMessage("An event is starting!", this.channel.name);
			
			let event: ChatEvent = this.events[0];
			if (random) {
				event = this.events[Math.floor(Math.random() * this.events.length)];
			} else {
				event = this.events.shift() ?? this.events[0];
				if (event !== undefined) {
					this.events.push(event);
				}
			}

			GameStateManager.getInstance().resetGameStates(); // TODO: Better solution for GameState that is not a singleton?
			this.currentEvent = event;
			event.start();
		}, Config.EVENT_COOLDOWN);
	}
}