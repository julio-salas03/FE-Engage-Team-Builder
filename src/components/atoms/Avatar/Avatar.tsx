import { createSignal } from "solid-js";
import type { JSX } from "solid-js";
import { AvatarContext, ImageLoadingStatus } from "./const";

export type AvatarProps = JSX.HTMLAttributes<HTMLSpanElement> & {
  children: JSX.Element;
};

const Avatar = (props: AvatarProps) => {
  const [loadingStatus, setLoadingStatus] = createSignal(
    ImageLoadingStatus.IDLE,
  );

  return (
    <AvatarContext.Provider
      value={{
        loadingStatus: loadingStatus,
        updateLoadingState: (status) => setLoadingStatus(status),
      }}
    >
      <span class="grid h-10 w-10 overflow-hidden rounded-full bg-red-500">
        {props.children}
      </span>
    </AvatarContext.Provider>
  );
};
export default Avatar;
