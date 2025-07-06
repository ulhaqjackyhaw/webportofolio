import React from 'react';
import CertificateCard from './CertificateCard';

import jaringanImg from '@/assets/images/1.png';
import devopsImg from '@/assets/images/2.png';
import jsImg from '@/assets/images/4.png';
import beImg from '@/assets/images/3.png';


const certificate = [
  {
    name: 'Cloud & Gen AI di AWS',
    imgSrc: jaringanImg,
  },
  {
    name: 'Pemrograman JavaScript',
    imgSrc: devopsImg,
  },
  {
    name: 'Database Design',
    imgSrc: jsImg,
  },
  {
    name: 'Database Pemrograman with SQL',
    imgSrc: beImg,
  },
];

const Certificate = () => {
  return (
    <section id="certificate" className="section overflow-hidden">
      <div className="container">
        <h2 className="headline-2 mb-8 reveal-up">
          Certif<span className="headline-5">icate</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
          {certificate.map(({
            name, imgSrc
          }, key) => (
            <CertificateCard key={key} name={name} imgSrc={imgSrc} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Certificate;
