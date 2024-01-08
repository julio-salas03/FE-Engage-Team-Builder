import { Show, createEffect, JSX } from "solid-js";
import { ImageLoadingStatus, useAvatarContext } from "./const";
import classNames from "classnames";

export type AvatarImageProps = JSX.ImgHTMLAttributes<HTMLImageElement> & {
  alt: string;
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
      <img
        {...props}
        class={classNames("object-cover object-center", props.class)}
        src={props.src}
        alt={props.alt}
      />
    </Show>
  );
};

export default AvatarImage;
