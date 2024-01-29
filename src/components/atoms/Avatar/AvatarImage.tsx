import { Show, createEffect, JSX, createSignal } from "solid-js";
import { ImageLoadingStatus, useAvatarContext } from "./const";
import classNames from "classnames";

export type AvatarImageProps = JSX.ImgHTMLAttributes<HTMLImageElement> & {
  alt: string;
  src: string;
};

const AvatarImage = (props: AvatarImageProps) => {
  const { loadingStatus, updateLoadingState } = useAvatarContext();
  const hasLoaded = () => loadingStatus() === ImageLoadingStatus.LOADED;
  const [getSrc, setSrc] = createSignal("");

  createEffect(() => {
    if (!props.src) {
      updateLoadingState(ImageLoadingStatus.ERROR);
      return;
    }
    async function handleLoad() {
      try {
        const cache = await window.caches.open(props.src);
        const cacheImg = await cache.match(props.src);

        if (!cacheImg) {
          const response = await fetch(props.src);
          await cache.put(props.src, response);
          const cacheImg = await cache.match(props.src);
          const img = await cacheImg?.blob();
          setSrc(URL.createObjectURL(img as Blob));
          updateLoadingState(ImageLoadingStatus.LOADED);
          return;
        }
        const img = await cacheImg.blob();
        setSrc(URL.createObjectURL(img));
        updateLoadingState(ImageLoadingStatus.LOADED);
      } catch (error) {
        console.log(error);
      }
    }

    handleLoad();
  });

  return (
    <Show when={hasLoaded()}>
      <img
        {...props}
        class={classNames("object-cover object-center", props.class)}
        src={getSrc()}
        alt={props.alt}
      />
    </Show>
  );
};

export default AvatarImage;
