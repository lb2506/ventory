import { Skeleton } from "@rneui/themed";
import { Dimensions, View } from "react-native";
const windowWidth = Dimensions.get("window").width;

const SkeletonClotheOutfit = () => {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
      <Skeleton height={windowWidth / 3 - 4} style={{ margin: 1, borderRadius: 0, width: windowWidth / 3 - 4 }} />
      <Skeleton height={windowWidth / 3 - 4} style={{ margin: 1, borderRadius: 0, width: windowWidth / 3 - 4 }} />
      <Skeleton height={windowWidth / 3 - 4} style={{ margin: 1, borderRadius: 0, width: windowWidth / 3 - 4 }} />
      <Skeleton height={windowWidth / 3 - 4} style={{ margin: 1, borderRadius: 0, width: windowWidth / 3 - 4 }} />
      <Skeleton height={windowWidth / 3 - 4} style={{ margin: 1, borderRadius: 0, width: windowWidth / 3 - 4 }} />
      <Skeleton height={windowWidth / 3 - 4} style={{ margin: 1, borderRadius: 0, width: windowWidth / 3 - 4 }} />
      <Skeleton height={windowWidth / 3 - 4} style={{ margin: 1, borderRadius: 0, width: windowWidth / 3 - 4 }} />
      <Skeleton height={windowWidth / 3 - 4} style={{ margin: 1, borderRadius: 0, width: windowWidth / 3 - 4 }} />
      <Skeleton height={windowWidth / 3 - 4} style={{ margin: 1, borderRadius: 0, width: windowWidth / 3 - 4 }} />
      <Skeleton height={windowWidth / 3 - 4} style={{ margin: 1, borderRadius: 0, width: windowWidth / 3 - 4 }} />
      <Skeleton height={windowWidth / 3 - 4} style={{ margin: 1, borderRadius: 0, width: windowWidth / 3 - 4 }} />
      <Skeleton height={windowWidth / 3 - 4} style={{ margin: 1, borderRadius: 0, width: windowWidth / 3 - 4 }} />
    </View>
  );
};

export default SkeletonClotheOutfit;
