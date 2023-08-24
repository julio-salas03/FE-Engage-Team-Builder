import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from '@builder.io/qwik-city';
import { readFile } from "fs/promises";
import type { Character, Emblem, Engraving, Skill, Weapon } from "~/types";

// const getResourceAssets = (file: string) => {
//   return {
//     defaultAsset: file,
//     webp: file.replace(".png", ".webp"),
//     avif: file.replace(".png", ".avif")
//   }
// }

export const useData = routeLoader$(async () => {
  const loadData = async (file: string) => JSON.parse(await readFile(file, "utf-8"))
  return {
    characters: await loadData("./data/characters.json") as Character[],
    synchoSkills: await loadData("./data/syncho-skills.json") as Skill[],
    inheritableSkills: await loadData("./data/inheritable-skills.json") as Skill[],
    weapons: await loadData("./data/weapons.json") as Weapon[],
    engravings: await loadData("./data/engravings.json") as Engraving[],
    emblems: await loadData("./data/emblems.json") as Emblem[],
  }
});

export default component$(() => {
  const data = useData()
  const character = data.value.characters[9]
  return (
    <div>
      <div class="absolute inset-0 bg-desktop-art bg-cover bg-center bg-no-repeat"></div>
      <div class="relative z-50">
        <div class="mx-auto bg-white/80 py-40 px-30">
          <h3>{character.name}</h3>
        </div>
      </div>
    </div>
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
