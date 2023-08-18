import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <picture>
        <source srcSet="/images/characters/big/clanne.avif" type="image/avif" />
        <source srcSet="/images/characters/big/clanne.webp" type="image/webp" />
        <img src="/images/characters/big/clanne.png" alt="" width={100} height={100} />
      </picture>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
