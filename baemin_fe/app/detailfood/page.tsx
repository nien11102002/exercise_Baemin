"use client";
import { useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

export default function DetailFoodPage() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params?.get("id");

  useEffect(() => {
    if (!id) {
      router.back();
    }
  }, [id, router]);

  return <div>Food Details for ID: {id}</div>;
}
