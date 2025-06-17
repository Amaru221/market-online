<?php

namespace App\DataFixtures;

use App\Entity\Product;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
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
