import { Show, JSX } from "solid-js";
import { ImageLoadingStatus, useAvatarContext } from "./const";
import classNames from "classnames";

export type AvatarFallbackProps = JSX.HTMLAttributes<HTMLSpanElement> & {
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
      <span
        {...props}
        class={classNames(
          "flex items-center justify-center uppercase",
          props.class,
        )}
      >
        {getFallback()}
      </span>
    </Show>
  );
};

export default AvatarFallback;
