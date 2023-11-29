<?php

namespace App\Service;
use Symfony\Component\Dotenv\Dotenv;

class ChannelWriter {

	private $file;

	public function __construct() {
		$dotenv = new Dotenv();
		$dotenv->load(__DIR__ . "/../../.env");
		$this->file = $_ENV['CHANNEL_FILE_PATH'];
	}

	public function add_channel($channel) {
		$channels = $this->get_channels();
		if (!$this->channel_exists($channels, $channel)) {
			$channels[] = $channel;
			$this->save($channels);
		}
	}

	public function remove_channel($channel) {
		$channels = $this->get_channels();
		if ($this->channel_exists($channels, $channel)) {
			$channels = array_filter($channels, function($c) use ($channel) {
				return $c != $channel;
			});
			$this->save($channels);
		}
	}

	public function channel_exists(array $channels, string $channel): bool {
		foreach ($channels as $c) {
			if ($c == $channel) {
				return true;
			}
		}
		return false;
	}

	public function get_channels(): array {
		$channels = [];
		$file = fopen($this->file, "r");
		while (!feof($file)) {
			$line = fgets($file);
			$line = trim($line);
			if ($line != "") {
				$channels = array_merge($channels, explode(',', $line));
			}
		}
		fclose($file);
		return $channels;
	}

	private function save($channels): void {
		$file = fopen($this->file, "w");
		fwrite($file, implode(',', $channels));
		fclose($file);
	}
}