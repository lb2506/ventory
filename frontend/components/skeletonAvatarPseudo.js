import { Skeleton } from "@rneui/themed";
import { View } from "react-native";

const SkeletonAvatarPseudo = () => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Skeleton height={40} style={{ margin: 10, borderRadius: "100%", width: 40 }} />
      <Skeleton height={30} style={{ margin: 5, borderRadius: 0, width: 150 }} />
    </View>
  );
};

export default SkeletonAvatarPseudo;
