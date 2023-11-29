import Collectible from "../entities/Collectible";
import fs from "fs";

export default class CollectionManager {

	private static instance: CollectionManager;
	private collectibles: Collectible[] = [];

	private constructor() {
		this.initializeCollectibles();
	}

	public async initializeCollectibles(): Promise<void> {
		return new Promise<void>((resolve) => {
			const file = fs.readFileSync(process.env.COLLECTIBLE_FILE_PATH ?? "", "utf-8");
			const rows = file.split("\n");

			rows.forEach((row) => {
				if (row != "") {
					const cells = row.split(",");
					const collectible = new Collectible(cells[0], cells[1], cells[2], cells[3].trim());
					this.collectibles.push(collectible);
				}
			})
			resolve();
		})
	}

	public static getInstance(): CollectionManager {
		if (!CollectionManager.instance) {
			CollectionManager.instance = new CollectionManager();
		}
		return CollectionManager.instance;
	}

	public getRandomCollectible(): Collectible {
		return this.collectibles[Math.floor(Math.random() * this.collectibles.length)];
	}

	public getCollectibleById(id: string): Collectible | undefined {
		return this.collectibles.find(collectible => collectible.id === id);
	}
}