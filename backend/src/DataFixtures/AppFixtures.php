<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Product;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{

    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // Crea un usuario
        $user = new User();
        $user->setEmail('admin@example.com');

        $hashedPassword = $this->passwordHasher->hashPassword($user, 'admin123');
        $user->setPassword($hashedPassword);

        $manager->persist($user);



        foreach (range(1, 10) as $i) {
            $product = new Product();
            $product->setName("Producto $i");
            $product->setPrice(mt_rand(10, 100));
            $product->setStock(mt_rand(0, 50));
            $product->setImageUrl("https://via.placeholder.com/150");
            $manager->persist($product);
        }

        $manager->flush();
    }
}
