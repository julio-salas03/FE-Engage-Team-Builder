import { Show, createEffect } from "solid-js";
import { ImageLoadingStatus, useAvatarContext } from "./const";

export type AvatarImageProps = {
  src: string;
};

const AvatarImage = (props: AvatarImageProps) => {
  const { loadingStatus, updateLoadingState } = useAvatarContext();
  const hasLoaded = () => loadingStatus() === ImageLoadingStatus.LOADED;

  createEffect(() => {
    if (!props.src) {
      updateLoadingState(ImageLoadingStatus.ERROR);
      return;
    }

    const image = new Image();

    image.onload = () => {
      updateLoadingState(ImageLoadingStatus.LOADED);
    };
    image.onerror = () => {
      updateLoadingState(ImageLoadingStatus.ERROR);
    };
    image.src = props.src;
  });

  return (
    <Show when={hasLoaded()}>
      <img src={props.src} alt="Avatar" />
    </Show>
  );
};

export default AvatarImage;
