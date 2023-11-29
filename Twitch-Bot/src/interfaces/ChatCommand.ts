import Context from "../entities/Context";

export default interface ChatCommand {
	name: string;
	description: string;
	aliases: string[];
	args: string[];
	execute: (ctx: Context) => void;
	validArgs: () => boolean;
}