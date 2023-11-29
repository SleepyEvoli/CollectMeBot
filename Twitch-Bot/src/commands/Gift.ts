import Context from "../entities/Context";
import ChatCommand from "../interfaces/ChatCommand";
import SaveManager from "../managers/SaveManager";
import SaveManagerCollection from "../managers/SaveManagerCollection";

export default class Gift implements ChatCommand {

	name: string = 'gift';
	description: string = 'Gift a character to another player.';
	aliases: string[] = ['gift'];
	args: string[] = [];

	constructor() {}

	execute(ctx: Context): void {
		if (!this.validArgs) return;
		let userDstName = this.args[0];
		if (userDstName.startsWith('@')) userDstName = userDstName.substring(1);
		const collectibleName = this.args[1];
		const saveManager = new SaveManagerCollection();
	}

	validArgs(): boolean {
		return this.args.length === 2;
	}

}