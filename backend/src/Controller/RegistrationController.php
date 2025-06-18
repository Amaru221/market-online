<?php

// src/Controller/RegistrationController.php
namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;

class RegistrationController extends AbstractController
{

    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request, EntityManagerInterface $em)
    {
        $data = json_decode($request->getContent(), true);
        if (!isset($data['email'], $data['password'])) {
            return new JsonResponse(['error' => 'Invalid data'], 400);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $hashed = $this->passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashed);

        $em->persist($user);
        $em->flush();

        return new JsonResponse(['message' => 'User created'], 201);
    }
}
