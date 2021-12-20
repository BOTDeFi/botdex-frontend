import React from 'react';

export interface ImgWebpProps {
  loading: 'eager' | 'lazy' | undefined;
  src: string;
  alt: string;
  className?: string;
}
/**
 * This function creates webp picture component
 *
 * @param src-src to jpg/png etc img,  srcWebp-src to webp img
 * @returns Component
 * @expample
            import picture from 'src/assets/img/space.jpg';
            <ImgWebp loading="lazy" src={picture} alt="Space" />
 */

const ImgWebp: React.FC<ImgWebpProps> = ({ loading, src, alt, className }) => {
  const concatedResolution = (imgSrc: string) => {
    return imgSrc.slice(0, imgSrc.lastIndexOf('.'));
  };

  return (
    <>
      <picture className={className}>
        <source type="image/webp" srcSet={`${concatedResolution(src)}.webp`} />
        <img loading={loading} src={`${src}`} alt={alt} />
      </picture>
    </>
  );
};

export default ImgWebp;
