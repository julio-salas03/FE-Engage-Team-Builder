import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from '@builder.io/qwik-city';
import { readFile } from "fs/promises";

const getResourceAssets = (file: string) => {
  return {
    defaultAsset: file,
    webp: file.replace(".png", ".webp"),
    avif: file.replace(".png", ".avif")
  }
}

export const useData = routeLoader$(async () => {
  const loadData = async (file: string) => JSON.parse(await readFile(file, "utf-8"))
  return {
    characters: await loadData("./data/characters.json"),
    synchoSkills: await loadData("./data/syncho-skills.json"),
    inheritableSkills: await loadData("./data/inheritable-skills.json"),
    weapons: await loadData("./data/weapons.json"),
    engravings: await loadData("./data/engravings.json"),
    emblems: await loadData("./data/emblems.json"),
  }
});

export default component$(() => {
  const data = useData()
  return (
    <>
      {
        data.value.characters.map((item: any, i: number) => {
          const { avif, defaultAsset, webp } = getResourceAssets(item.img)
          return <picture key={i}>
            <source srcSet={avif} type="image/avif" />
            <source srcSet={webp} type="image/webp" />
            <img src={defaultAsset} alt="" width={100} height={100} />
          </picture>
        })
      }
      {
        data.value.engravings.map((item: any, i: number) => {
          const { avif, defaultAsset, webp } = getResourceAssets(item.img)
          return <picture key={i}>
            <source srcSet={avif} type="image/avif" />
            <source srcSet={webp} type="image/webp" />
            <img src={defaultAsset} alt="" width={100} height={100} />
          </picture>
        })
      }
      {
        data.value.inheritableSkills.map((item: any, i: number) => {
          const { avif, defaultAsset, webp } = getResourceAssets(item.img)
          return <picture key={i}>
            <source srcSet={avif} type="image/avif" />
            <source srcSet={webp} type="image/webp" />
            <img src={defaultAsset} alt="" width={100} height={100} />
          </picture>
        })
      }
      {
        data.value.synchoSkills.map((item: any, i: number) => {
          const { avif, defaultAsset, webp } = getResourceAssets(item.img)
          return <picture key={i}>
            <source srcSet={avif} type="image/avif" />
            <source srcSet={webp} type="image/webp" />
            <img src={defaultAsset} alt="" width={100} height={100} />
          </picture>
        })
      }
      {
        data.value.weapons.map((item: any, i: number) => {
          const { avif, defaultAsset, webp } = getResourceAssets(item.img)
          return <picture key={i}>
            <source srcSet={avif} type="image/avif" />
            <source srcSet={webp} type="image/webp" />
            <img src={defaultAsset} alt="" width={100} height={100} />
          </picture>
        })
      }
      {
        data.value.emblems.map((item: any, i: number) => {
          const { avif, defaultAsset, webp } = getResourceAssets(item.img)
          return <picture key={i}>
            <source srcSet={avif} type="image/avif" />
            <source srcSet={webp} type="image/webp" />
            <img src={defaultAsset} alt="" width={100} height={100} />
          </picture>
        })
      }
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
