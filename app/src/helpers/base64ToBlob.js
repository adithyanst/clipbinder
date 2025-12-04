export default function base64toBlob(base64Data) {
  let mime = "image/jpeg";
  if (base64Data.startsWith("data:")) {
    const match = base64Data.match(/^data:(.*?);base64,/);
    if (match) mime = match[1];
    base64Data = base64Data.split(",")[1];
  }

  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters.charCodeAt(offset);
    }

    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }

  return new Blob(byteArrays, { type: mime });
}
