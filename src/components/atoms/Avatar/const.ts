import { createContext, useContext } from "solid-js";

export type AvatarContext = {
  loadingStatus: () => ImageLoadingStatus;
  updateLoadingState: (status: ImageLoadingStatus) => void;
};

export enum ImageLoadingStatus {
  LOADING,
  IDLE,
  LOADED,
  ERROR,
}

export const AvatarContext = createContext<AvatarContext>({
  loadingStatus: () => ImageLoadingStatus.IDLE,
  updateLoadingState: () => null,
});

export const useAvatarContext = () => useContext(AvatarContext);
