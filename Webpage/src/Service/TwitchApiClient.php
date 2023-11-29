<?php 

namespace App\Service;

use Symfony\Component\Dotenv\Dotenv;

class TwitchApiClient {
	
	private $client_id;
	private $app_secret;
	private $redirect_uri;
	private $environment;

	public function __construct() {
		$dotenv = new Dotenv();
		$dotenv->load(__DIR__ . "/../../.env");
		$this->client_id = $_ENV['CLIENT_ID'];
		$this->app_secret = $_ENV['APP_SECRET'];
		$this->redirect_uri = $_ENV['REDIRECT_URI'];
		$this->environment = $_ENV['APP_ENV'];
	}

	public function set_tokens($code) {
		$curl = curl_init("https://id.twitch.tv/oauth2/token");
		curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_POSTFIELDS, [
			"client_id" => $this->client_id,
			"client_secret" => $this->app_secret,
			"code" => $code,
			"grant_type" => "authorization_code",
			"redirect_uri" => $this->redirect_uri
		]);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

		if ($this->environment == "dev") {
			curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
		}
		
		$response = curl_exec($curl);
		$httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);

		if ($response === false || $httpcode != 200) {
			return false;
		}

		$response = json_decode($response, true);
		$access_token = $response["access_token"];
		$refresh_token = $response["refresh_token"];
		$expires_in = $response["expires_in"];

		setcookie("access_token", $access_token, time() + $expires_in, "/");
		setcookie("refresh_token", $refresh_token);
		return true;
	}

	public function refresh_access_token($refresh_token) {
		$curl = curl_init("https://id.twitch.tv/oauth2/token");
		curl_setopt($curl, CURLOPT_POST, true);
		curl_setopt($curl, CURLOPT_POSTFIELDS, [
			"client_id" => $this->client_id,
			"client_secret" => $this->app_secret,
			"refresh_token" => $refresh_token,
			"grant_type" => "refresh_token"
		]);

		if ($this->environment == "dev") {
			curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
		}

		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

		$response = curl_exec($curl);
		$httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);

		if ($response === false || $httpcode != 200) {
			return false;
		}

		$response = json_decode($response, true);
		$access_token = $response["access_token"];
		$refresh_token = $response["refresh_token"];
		$expires_in = $response["expires_in"];

		setcookie("access_token", $access_token, time() + $expires_in, "/");
		setcookie("refresh_token", $refresh_token);
		return true;
	}

	public function refresh_token_if_invalid($access_token, $refresh_token) {

		if ($access_token == null && $refresh_token == null) {
			return false;
		} else if ($access_token == null && $refresh_token != null) {
			return $this->refresh_access_token($refresh_token);
		}


		$curl = curl_init("https://id.twitch.tv/oauth2/validate");
		curl_setopt($curl, CURLOPT_HTTPHEADER, [
			"Authorization: OAuth $access_token"
		]);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

		if ($this->environment == "dev") {
			curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
		}

		$response = curl_exec($curl);
		$httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);

		if ($response === false || $httpcode != 200) {
			return false;
		}

		$response = json_decode($response, true);

		if (isset($response["status"]) && $response["status"] == 401) {
			if (!$this->refresh_access_token($refresh_token)) {
				return false;
			}
		}

		$expires_in = $response["expires_in"];
		if ($expires_in < 60) {
			if(!$this->refresh_access_token($refresh_token)){
				return false;
			}
		}
		return true;
	}

	public function get_user($access_token) {
		$curl = curl_init("https://api.twitch.tv/helix/users");
		curl_setopt($curl, CURLOPT_HTTPHEADER, [
			"Authorization: Bearer $access_token",
			"Client-Id: $this->client_id"
		]);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

		if ($this->environment == "dev") {
			curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
			curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
		}

		$response = curl_exec($curl);
		$httpcode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		curl_close($curl);

		if ($response === false || $httpcode != 200) {
			return false;
		}

		$response = json_decode($response, true);
		$user_id = $response["data"][0]["id"];
		$login = $response["data"][0]["login"];
		$display_name = $response["data"][0]["display_name"];
		$type = $response["data"][0]["type"];
		$broadcaster_type = $response["data"][0]["broadcaster_type"];
		$description = $response["data"][0]["description"];
		$profile_image_url = $response["data"][0]["profile_image_url"];
		$offline_image_url = $response["data"][0]["offline_image_url"];
		$created_at = $response["data"][0]["created_at"];

		return [
			"user_id" => $user_id,
			"login" => $login,
			"display_name" => $display_name,
			"type" => $type,
			"broadcaster_type" => $broadcaster_type,
			"description" => $description,
			"profile_image_url" => $profile_image_url,
			"offline_image_url" => $offline_image_url,
			"created_at" => $created_at
		];
	}
}