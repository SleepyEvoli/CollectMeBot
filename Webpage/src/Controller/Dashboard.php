<?php 

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Service\ChannelWriter;
use App\Service\TwitchApiClient;

class Dashboard extends AbstractController {
	
	#[Route('/dashboard', name: 'dashboard')]
	public function index(TwitchApiClient $twitchApiClient): Response {
		$access_token = $_COOKIE["access_token"] ?? null;
		$refresh_token = $_COOKIE["refresh_token"] ?? null;

		if(!$twitchApiClient->refresh_token_if_invalid($access_token, $refresh_token)) {
			return $this->render('error/index.html.twig', ["content" => "There was an error requesting authorization. Please try again."]);
		}

		$response = $twitchApiClient->get_user($access_token);

		if ($response === false) {
			return $this->render('error/index.html.twig', ["content" => "There was an error requesting authorization. Please try again."]);
		}

		return $this->render('dashboard/index.html.twig', [
			"user_id" => $response['user_id'],
			"login" => $response['login'],
			"display_name" => $response['display_name'],
			"type" => $response['type'],
			"broadcaster_type" => $response['broadcaster_type'],
			"description" => $response['description'],
			"profile_image_url" => $response['profile_image_url'],
			"offline_image_url" => $response['offline_image_url'],
			"created_at" => $response['created_at']
		]);
	}

	#[Route('/dashboard/add_bot', name: 'add_bot', methods: ['POST'])]
	public function addBot(ChannelWriter $channelWriter, TwitchApiClient $twitchApiClient): Response {
		$access_token = $_COOKIE["access_token"] ?? null;
		$refresh_token = $_COOKIE["refresh_token"] ?? null;

		if(!$twitchApiClient->refresh_token_if_invalid($access_token, $refresh_token)) {
			return $this->render('error/index.html.twig', ["content" => "There was an error requesting authorization. Please try again."]);
		}

		$response = $twitchApiClient->get_user($access_token);

		if ($response === false) {
			return $this->render('error/index.html.twig', ["content" => "There was an error requesting authorization. Please try again."]);
		}

		$login = $response['login'];

		if ($channelWriter->channel_exists($channelWriter->get_channels(), $login)) {
			return $this->json([
				"status" => "error",
				"message" => "Channel already registered."
			]);
		}

		$channelWriter->add_channel($login);

		if (!$channelWriter->channel_exists($channelWriter->get_channels(), $login)) {
			return $this->json([
				"status" => "error",
				"message" => "Unexpected error. Please try again. If the problem persists, please contact the developer"
			]);
		}

		return $this->json([
			"status" => "success",
			"message" => "Bot added successfully."
		]);
	}

	#[Route('/dashboard/remove_bot', name: 'remove_bot', methods: ['POST'])]
	public function removeBot(ChannelWriter $channelWriter, TwitchApiClient $twitchApiClient): Response {
		$access_token = $_COOKIE["access_token"] ?? null;
		$refresh_token = $_COOKIE["refresh_token"] ?? null;

		if(!$twitchApiClient->refresh_token_if_invalid($access_token, $refresh_token)) {
			return $this->render('error/index.html.twig', ["content" => "There was an error requesting authorization. Please try again."]);
		}

		$response = $twitchApiClient->get_user($access_token);

		if ($response === false) {
			return $this->render('error/index.html.twig', ["content" => "There was an error requesting authorization. Please try again."]);
		}

		$login = $response['login'];

		if (!$channelWriter->channel_exists($channelWriter->get_channels(), $login)) {
			return $this->json([
				"status" => "error",
				"message" => "No channel registered."
			]);
		}

		$channelWriter->remove_channel($login);

		if ($channelWriter->channel_exists($channelWriter->get_channels(), $login)) {
			return $this->json([
				"status" => "error",
				"message" => "Unexpected error. Please try again. If the problem persists, please contact the developer"
			]);
		}

		return $this->json([
			"status" => "success",
			"message" => "Bot removed successfully."
		]);
	}
}