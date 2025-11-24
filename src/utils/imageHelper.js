export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("e-market-dh-03e9602f6d1a.herokuapp.com")) {
    return `https://${imageUrl}`;
  }
  return `https://e-market-dh-03e9602f6d1a.herokuapp.com${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
};
