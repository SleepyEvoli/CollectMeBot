import * as fs from 'fs';
import '../interfaces/SaveStructure';
import { Channels } from '../interfaces/SaveStructure';

export default class SaveManager {

	protected data: Channels = {
		channels: {}
	};	

	public constructor() {
		this.initializeFile(process.env.SAVE_FILE_PATH ?? "");
	}

	public async initializeFile(name: string): Promise<void> {
		if (!fs.existsSync(name) || fs.readFileSync(name, 'utf8') === '') {
			fs.writeFileSync(name, JSON.stringify(this.data), 'utf8');
		}
		this.read();
	}

	public read(): void {
		const data = fs.readFileSync(process.env.SAVE_FILE_PATH ?? "", 'utf8');
		const parsedData: Channels = JSON.parse(data);
		this.data = parsedData;
	}

	public save(): void {
		fs.writeFile(process.env.SAVE_FILE_PATH ?? "", JSON.stringify(this.data), 'utf8', (err) => {
			if (err) {
				console.log(err);
			} else {
				console.log('Save successful.');
			}
		})
	}
}