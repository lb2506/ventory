import { Skeleton, LinearGradient } from "@rneui/themed";
import { Dimensions, View } from "react-native";
const windowWidth = Dimensions.get("window").width;

const SkeletonClotheOutfit = () => {
  const numberOfSkeletons = 4;

  const listSkeletons = () => {
    let skeletons = [];
    for (let i = 0; i < numberOfSkeletons; i++) {
      skeletons.push(
        <Skeleton
          key={i}
          LinearGradientComponent={LinearGradient}
          height={350}
          style={{ margin: 1, borderRadius: 0, width: windowWidth / 2 - 4 }}
        />
      );
    }
    return skeletons;
  };

  return <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>{listSkeletons()}</View>;
};

export default SkeletonClotheOutfit;
