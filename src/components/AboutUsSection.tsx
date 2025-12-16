'use client';
import { FC, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from './CountUp';

const stats = [
  { value: 21, suffix: '+', label: 'Years Driving\n ' },
  { value: 98, suffix: '%', label: 'Stakeholder\nSatisfaction Rate' },
  { value: 200, suffix: '+', label: 'Research Projects\nCoordinated Nationwide' },
  { value: 10000, suffix: '+', label: 'Beneficiaries of Digital\nCapacity Programs' },
];

const AboutUsSection: FC = () => {
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "WOLLEGA UNIVERSITY ",
    "ወለጋ ዩኒቨርሲቲ"
  ];

  // Cycle text every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="about" 
      className="relative w-full min-h-screen flex items-center justify-center bg-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-12 flex flex-col items-center text-center gap-6">
        
        {/* Central Hollow ABOUT US */}
        <h1 
          className="text-[52px] md:text-[100px] font-extrabold leading-none text-transparent bg-clip-text bg-center bg-cover"
          style={{ backgroundImage: "url('/about-us.jpg')" }}
        >
          ABOUT US
        </h1>

        {/* Animated Heading */}
        <div className="h-[60px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={textIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-text-primary"
            >
              {texts[textIndex]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Description */}
        <p className="text-sm md:text-base text-text-primary max-w-2xl leading-snug">
          Our company was established in 1999 E.C. with the vision of driving innovation, excellence, and sustainable growth in every aspect of our work. Since our founding, we have been committed to delivering high-quality products and services that meet the evolving needs of our customers. Through teamwork, creativity, and technology, we strive to create value, inspire progress, and make a positive impact in our community and beyond.
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full mt-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              className="flex flex-col items-center justify-center bg-gray-50 rounded-xl shadow p-4 min-h-[130px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-2xl md:text-3xl font-bold text-[#087684] mb-1">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-text-primary text-xs sm:text-sm md:text-base whitespace-pre-line leading-snug font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
