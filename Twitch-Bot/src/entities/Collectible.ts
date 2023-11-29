export default class Collectible {
	
	id: string;
	name: string;
	category: string;
	image: string;

	constructor(id: string, name: string, category: string, image: string) {
		this.id = id;
		this.name = name;
		this.category = category;
		this.image = image;
	}
}