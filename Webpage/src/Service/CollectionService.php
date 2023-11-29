<?php

namespace App\Service;

use Symfony\Component\Dotenv\Dotenv;

class CollectionService {

	private $file_path;

	public function __construct() {
		$dotenv = new Dotenv();
		$dotenv->load(__DIR__ . "/../../.env");
		$this->file_path = $_ENV['COLLECTION_SAVE_FILE_PATH'];
	}

	public function getCollections($name) {

		$collection = [];

		$file = file_get_contents($this->file_path);
		$json = json_decode($file, true);

		try {
			foreach ($json['channels'] as $channel_name => $channel) {
				if (isset($channel['users'][$name])){
					$user = $channel['users'];
					if (isset($user[$name]['data']) && isset($user[$name]['data']['collection'])) {
						$collection[$channel_name] = $user[$name]['data']['collection'];
					}
				}
			}
		} catch (\Exception $e) {
			$collection = [];
		}

		return $collection;
	}
}