import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/router";
import { ProductCard } from "./Product.styled";
import { StyledLink } from "../Link/Link.styled";
import ProductForm from "../ProductForm";
import Comments from "../Comments";

export default function Product() {
  const [isEditMode, setIsEditMode] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, mutate } = useSWR(`/api/products/${id}`);

  async function handleEditProduct(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      mutate();
      setIsEditMode(false);
    }
  }

  async function handleDeleteProduct() {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      router.push("/");
    }
  }
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    return;
  }

  return (
    <ProductCard>
      <h2>{data.name}</h2>
      {isEditMode && <ProductForm onAdd={handleEditProduct} />}
      <p>Description: {data.description}</p>
      <p>
        Price: {data.price} {data.currency}
      </p>
      <button
        onClick={() => {
          setIsEditMode(!isEditMode);
        }}
        className="button"
      >
        Edit
      </button>
      <button
        onClick={() => {
          handleDeleteProduct();
        }}
        className="button"
      >
        Delete
      </button>
      {data.reviews.length > 0 && <Comments reviews={data.reviews} />}
      <StyledLink href="/">Back to all</StyledLink>
    </ProductCard>
  );
}
