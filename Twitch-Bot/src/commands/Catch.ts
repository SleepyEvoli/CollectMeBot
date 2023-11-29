import EventManager from "../managers/EventManager";
import Context from "../entities/Context";
import ChatCommand from "../interfaces/ChatCommand";
import { EventState } from "../CustomEnums";
import GameStateManager from "../managers/GameStateManager";
import AppearEvent from "../events/AppearEvent";

export default class Catch implements ChatCommand {
	
	name: string;
	description: string;
	aliases: string[];
	args: string[];

	constructor() {
		this.name = 'catch';
		this.description = 'One character is able to catch a character.';
		this.aliases = ['capture'];
		this.args = [];
	}

	execute(ctx: Context): void {
		const eventManager = EventManager.getInstance();
		if (eventManager.currentEvent && eventManager.currentEvent instanceof AppearEvent && eventManager.state === EventState.JOIN) {
			const gameState = GameStateManager.getInstance().getGameState(ctx.channel);
			if (!gameState.playerExists(ctx.user)){
				gameState.players.push(ctx.user);
			}
		}
	}

	validArgs(): boolean {
		return this.args.length === 0;
	}
}