<?php

namespace App\Entity;

use App\Repository\OrderRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: '`order`')]
class Order
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'orders')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $owner = null;

    #[ORM\Column]
    private ?float $amount = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $dateOpen = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $dateClose = null;

    #[ORM\Column]
    private ?int $state = null;

    /**
     * @var Collection<int, Product>
     */
    #[ORM\ManyToMany(targetEntity: Product::class)]
    private Collection $ProductList;

    public function __construct()
    {
        $this->ProductList = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): static
    {
        $this->amount = $amount;

        return $this;
    }

    public function getDateOpen(): ?\DateTimeImmutable
    {
        return $this->dateOpen;
    }

    public function setDateOpen(\DateTimeImmutable $dateOpen): static
    {
        $this->dateOpen = $dateOpen;

        return $this;
    }

    public function getDateClose(): ?\DateTimeImmutable
    {
        return $this->dateClose;
    }

    public function setDateClose(?\DateTimeImmutable $dateClose): static
    {
        $this->dateClose = $dateClose;

        return $this;
    }

    public function getState(): ?int
    {
        return $this->state;
    }

    public function setState(int $state): static
    {
        $this->state = $state;

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
        }

        return $this;
    }

    public function removeProductList(Product $productList): static
    {
        $this->ProductList->removeElement($productList);

        return $this;
    }
}
