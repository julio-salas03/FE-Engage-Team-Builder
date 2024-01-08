import Avatar from "@components/atoms/Avatar";
import AvatarFallback from "@components/atoms/Avatar/AvatarFallback";
import AvatarImage from "@components/atoms/Avatar/AvatarImage";

function App() {
  return (
    <main>
      <Avatar>
        <AvatarFallback name="Louis" />
        <AvatarImage
          src="/images/characters/big/louis.png"
          alt="image of a knight"
        />
      </Avatar>
    </main>
  );
}

export default App;
