import sharp from 'sharp';
import PNG from '../png';

const renderServerGIF = async data => {
  const pngBuffer = await sharp(data).toBuffer();
  return new PNG(pngBuffer);
};

export default renderServerGIF;
