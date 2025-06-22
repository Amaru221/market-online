<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\CategoryRepository;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: CategoryRepository::class)]
#[ApiResource()]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups('category:read')]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups('category:read')]
    private ?string $name = null;

    /**
     * @var Collection<int, Product>
     */
    #[ORM\OneToMany(targetEntity: Product::class, mappedBy: 'category')]
    private Collection $ProductList;

    public function __construct()
    {
        $this->ProductList = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, Product>
     */
    public function getProductList(): Collection
    {
        return $this->ProductList;
    }

    public function addProductList(Product $productList): static
    {
        if (!$this->ProductList->contains($productList)) {
            $this->ProductList->add($productList);
            $productList->setCategory($this);
        }

        return $this;
    }

    public function removeProductList(Product $productList): static
    {
        if ($this->ProductList->removeElement($productList)) {
            // set the owning side to null (unless already changed)
            if ($productList->getCategory() === $this) {
                $productList->setCategory(null);
            }
        }

        return $this;
    }
}
