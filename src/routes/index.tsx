import { component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <>
      <img
        width={56}
        height={56}
        src="/images/emblem-icon-marth.webp"
        alt="foo"
      />
      <img
        width={56}
        height={56}
        src="/images/emblem-icon-marth.png"
        alt="foo"
      />
    </>
  );
});
