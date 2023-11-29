<?php

namespace App\Controller;

use App\Service\TwitchApiClient;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class Authorization extends AbstractController
{
	#[Route('/authorization', name: 'authorization')]
	public function index(Request $request, TwitchApiClient $twitchApiClient): Response {
		$queryParams = $request->query->all();

		$code = $queryParams['code'] ?? null;
		$state = $queryParams['state'] ?? null; // Not used yet.
		$error = $queryParams['error'] ?? null;
		$error_description = $queryParams['error_description'] ?? null;
		
		if ($error != null) {
			return $this->render('error/index.html.twig', ["content" => "There was an error requesting authorization. Please try again."]);
		}

		if ($twitchApiClient->set_tokens($code)) {
			return $this->redirectToRoute('dashboard');
		} else {
			return $this->render('error/index.html.twig', ["content" => "There was an error requesting authorization. Please try again."]);
		}
	}

	#[Route('authorization/refresh', name: 'refresh')]
	public function refresh(TwitchApiClient $twitchApiClient): Response {
		$refresh_token = $_COOKIE["refresh_token"] ?? null;

		if ($refresh_token == null) {
			return $this->render('error/index.html.twig', ["content" => "There was an error requesting authorization. Please try again."]);
		}

		if(!$twitchApiClient->refresh_access_token($refresh_token)) {
			return $this->render('error/index.html.twig', ["content" => "There was an error requesting authorization. Please try again."]);
		}

		return $this->redirectToRoute('dashboard');
	}
}