import fetch from 'node-fetch';

export default class TwitchApiService {

	accessToken: string;
	clientId: string;

	public constructor(accessToken: string, clientId: string) {
		this.accessToken = accessToken;
		this.clientId = clientId;
	}

	async getUser(id: string = "", login: string = ""): Promise<any | undefined> {
		if (id !== "") {
			try {
				const response = await fetch(`https://api.twitch.tv/helix/users?id=${id}`, {
					headers: {
						'Authorization': `Bearer ${this.accessToken}`,
						'Client-Id': `${this.clientId}`,
					}
				});
				const data = await response.json();
				return data['data'][0];
			} catch (error) {
				return undefined;
			}

		}
		else if (login !== "") {
			try {
				const response = await fetch(`https://api.twitch.tv/helix/users?login=${login}`, {
					headers: {
						'Authorization': `Bearer ${this.accessToken}`,
						'Client-Id': `${this.clientId}`,
					}
				});
				const data = await response.json();
				return data['data'][0];
			} catch (error) {
				return undefined;
			}
		}
	}
}