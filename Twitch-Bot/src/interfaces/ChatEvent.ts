import EventManager from "../managers/EventManager";

export default interface ChatEvent {
	name: string;
	start: () => void;
	execute: () => void;
	finish: () => void;
}