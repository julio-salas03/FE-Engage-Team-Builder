import { Show } from "solid-js";
import { ImageLoadingStatus, useAvatarContext } from "./const";

export type AvatarFallbackProps = {
  name: string;
};

const AvatarFallback = (props: AvatarFallbackProps) => {
  const { loadingStatus } = useAvatarContext();
  const hasNotLoaded = () => loadingStatus() !== ImageLoadingStatus.LOADED;
  const getFallback = () => {
    const splitted = props.name.split(" ");
    if (splitted.length === 1) return splitted[0][0];
    return splitted[0][0] + splitted[1][0];
  };
  return (
    <Show when={hasNotLoaded()}>
      <span class="flex items-center justify-center uppercase">
        {getFallback()}
      </span>
    </Show>
  );
};

export default AvatarFallback;
