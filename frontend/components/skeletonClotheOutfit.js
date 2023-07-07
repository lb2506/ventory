import { Skeleton, LinearGradient } from "@rneui/themed";
import { Dimensions, View } from "react-native";
const windowWidth = Dimensions.get("window").width;

const SkeletonClotheOutfit = () => {
  const numberOfSkeletons = 12;

  const listSkeletons = () => {
    for (let i = 0; i < numberOfSkeletons; i++) {
      return (
        <Skeleton
          LinearGradientComponent={LinearGradient}
          animation="wave"
          height={windowWidth / 3 - 4}
          style={{ margin: 1, borderRadius: 0, width: windowWidth / 3 - 4 }}
        />
      );
    }
  };
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
      <>{listSkeletons}</>
    </View>
  );
};

export default SkeletonClotheOutfit;
