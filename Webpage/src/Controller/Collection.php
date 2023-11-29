<?php

namespace App\Controller;

use App\Service\CollectionService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class Collection extends AbstractController {

	#[Route('/collection/{login}', name: 'collection')]
	public function index(Request $request, CollectionService $collectionService): Response {
		$login = $request->get('login');
		$collection = $collectionService->getCollections($login);

		return $this->render('collection/index.html.twig', [
			'collections' => $collection,
			'login' => $login,
		]);
	}
}