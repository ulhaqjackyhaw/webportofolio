import React from 'react';
import Image from 'next/image';
import LaunchSharpIcon from '@mui/icons-material/LaunchSharp';

const CertificateCard = ({ name, imgSrc, certificateLink }) => {
  const CardContent = (
    <div
      className={`bg-zinc-800 p-4 rounded-xl w-full max-w-lg transition-all duration-300 ${
        certificateLink
          ? 'hover:scale-[1.02] hover:bg-zinc-700/80 hover:ring-2 hover:ring-sky-500/50 cursor-pointer group'
          : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <figure className="img-box flex flex-col items-center gap-2 rounded-lg w-full max-w-lg mx-auto relative overflow-hidden">
          <Image
            src={imgSrc}
            width={typeof imgSrc === 'string' ? 600 : undefined}
            height={typeof imgSrc === 'string' ? 420 : undefined}
            loading="lazy"
            alt={name || 'Certificate'}
            quality={75}
            className={`img-cover w-full h-auto rounded-lg transition-transform duration-300 ${
              certificateLink ? 'group-hover:scale-105' : ''
            }`}
          />
          <figcaption className="text-center font-semibold text-zinc-200 mt-2 flex items-center justify-center gap-1.5 w-full">
            <span>{name}</span>
            {certificateLink && (
              <span className="text-sky-400 opacity-70 group-hover:opacity-100 transition-opacity">
                <LaunchSharpIcon sx={{ fontSize: 18 }} />
              </span>
            )}
          </figcaption>
        </figure>
      </div>
    </div>
  );

  if (certificateLink) {
    return (
      <a
        href={certificateLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Lihat sertifikat ${name}`}
        className="block w-full max-w-lg reveal-up no-underline"
      >
        {CardContent}
      </a>
    );
  }

  return <div className="reveal-up w-full max-w-lg">{CardContent}</div>;
};

export default CertificateCard;
