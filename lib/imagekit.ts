import ImageKit from "imagekit";

export const PAPABASE_IMAGEKIT_URL_ENDPOINT =
  "https://ik.imagekit.io/buildersgarden/beearly/";
export const IMAGEKIT_PUBLIC_KEY = "public_k1LSzOuC5idqGtjPwkT8ti4UJNY=";

const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: PAPABASE_IMAGEKIT_URL_ENDPOINT,
});

export const uploadImage = async (file: string | Buffer, fileName: string) => {
  return await imagekit.upload({
    file, //required
    fileName, //required
  });
};
