import { Meta, StoryFn } from "storybook-solidjs";
import { ComponentProps } from "solid-js";
import AvatarComponent from "./Avatar";
import "@src/index.css";
import AvatarImage from "./AvatarImage";
import AvatarFallback from "./AvatarFallback";

export default {
  component: AvatarComponent,
} as Meta<typeof AvatarComponent>;

type ExtraProps = { containerWidth: number };
type StoryProps = ComponentProps<typeof AvatarComponent> &
  ComponentProps<typeof AvatarImage> &
  ComponentProps<typeof AvatarFallback> &
  ExtraProps;

const Template: StoryFn<StoryProps> = (args) => {
  return (
    <div class="p-5" style={{ "max-width": `${args.containerWidth}px` }}>
      <AvatarComponent>
        <AvatarFallback name={args.name} />
        <AvatarImage src={args.src} alt={args.alt} />
      </AvatarComponent>
    </div>
  );
};

export const Avatar = Template.bind({});

Avatar.args = {
  // Component Props
  // Extra Props
  containerWidth: 1000,
  src: "https://cdn-icons-png.flaticon.com/512/2919/2919906.png",
  alt: "Hubert Lambert",
  name: "Hubert Lambert",
};
