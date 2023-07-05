import { Skeleton, LinearGradient } from "@rneui/themed";

const SkeletonSocialPost = () => {
  return <Skeleton LinearGradientComponent={LinearGradient} animation="wave" height={300} style={{ margin: 10, borderRadius: 0, width: 355 }} />;
};

export default SkeletonSocialPost;
