const rasterizer = document.createElement('canvas');
const upscaler = document.createElement('canvas');

const size = { x: 16, y: 16 };
const scale = { x: 14, y: 21 };
const data = new ImageData(size.x, size.y);

rasterizer.width = size.x;
rasterizer.height = size.y;
const rasterizerContext = rasterizer.getContext('2d');
rasterizerContext.imageSmoothingEnabled = false;

upscaler.width = size.x * scale.x;
upscaler.height = size.y * scale.y;
const upscalerContext = upscaler.getContext('2d');
upscalerContext.imageSmoothingEnabled = false;

export default (pixels) => {
  for (let i = 0, p = 0, y = 0; y < size.y; y += 1) {
    for (let x = 0; x < size.x; x += 1, i += 4, p += 1) {
      const color = parseInt(pixels[p], 16);
      data.data[i] = (color >> 16) & 0xFF;
      data.data[i + 1] = (color >> 8) & 0xFF;
      data.data[i + 2] = color & 0xFF;
      data.data[i + 3] = 0xFF;
    }
  }
  rasterizerContext.putImageData(data, 0, 0);
  upscalerContext.drawImage(
    rasterizer,
    0, 0, rasterizer.width, rasterizer.height,
    0, 0, upscaler.width, upscaler.height
  );
  return upscaler.toDataURL();
};
