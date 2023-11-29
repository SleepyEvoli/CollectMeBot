export default interface ChatEvent {
	name: string;
	start: () => void;
	execute: () => void;
	finish: () => void;
}