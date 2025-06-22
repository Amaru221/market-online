<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Product;
use App\Entity\Category;
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
        $categories = [];

        //crea 10 categorias
        foreach (range(1, 10) as $i) {
            $category = new Category();
            $category->setName("Category $i");
            $categories[] = $category;

            $manager->persist($category);
        }

        // Crea 100 productos
        foreach (range(1, 100) as $i) {
            $product = new Product();
            $product->setName("Producto $i");
            $product->setPrice(mt_rand(10, 100));
            $product->setStock(mt_rand(0, 50));
            $randomCategory = $categories[array_rand($categories)];
            $product->setCategory($randomCategory);

            // Imagen aleatoria con ID específica
            // Picsum asegura una imagen única por ID
            $imageId = 100 + $i; // Para evitar IDs demasiado bajos
            $imageUrl = "https://picsum.photos/id/$imageId/300/200"; // Tamaño personalizable
            $product->setImageUrl($imageUrl);

            $manager->persist($product);
        }

        $manager->flush();
    }
}
