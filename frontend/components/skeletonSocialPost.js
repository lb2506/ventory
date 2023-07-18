import { Skeleton, LinearGradient } from "@rneui/themed";

const SkeletonSocialPost = () => {
  return <Skeleton LinearGradientComponent={LinearGradient} height={300} style={{ borderRadius: 0, width: "100%" }} />;
};

export default SkeletonSocialPost;
