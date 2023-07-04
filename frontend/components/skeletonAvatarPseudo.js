import { Skeleton } from "@rneui/themed";
import { View } from "react-native";

const SkeletonAvatarPseudo = () => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Skeleton height={60} style={{ margin: 10, borderRadius: "100%", width: 60 }} />
      <Skeleton height={30} style={{ margin: 5, borderRadius: 0, width: 150 }} />
    </View>
  );
};

export default SkeletonAvatarPseudo;
