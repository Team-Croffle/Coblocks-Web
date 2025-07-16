import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';

// --- Type Definitions ---

export type CarouselItem = {
  id: number;
  title: string;
  content: string;
};

interface CarouselProps {
  slides: CarouselItem[];
  options?: EmblaOptionsType;
}

// --- Helper Components ---

interface DotButtonProps {
  selected: boolean;
  onClick: () => void;
}

// 캐러셀 하단 버튼
function DotButton({ selected, onClick }: DotButtonProps): JSX.Element {
  return (
    <button
      className={`h-3 w-3 rounded-full transition-colors duration-300 ${
        selected ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
      }`}
      onClick={onClick}
      type='button'
    />
  );
}

// --- Main Carousel Component ---

export default function Carousel({ slides, options }: CarouselProps): JSX.Element {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay({ delay: 3000 })]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number): void => {
      if (!emblaApi) {
        return;
      }
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType): void => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType): void => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onInit);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  return (
    <div className='relative'>
      <div
        className='overflow-hidden rounded-lg'
        ref={emblaRef}
      >
        <div className='flex'>
          {slides.map((item) => {
            return (
              <div
                className='relative min-w-0 flex-[0_0_100%]'
                key={item.id}
              >
                <div className='flex h-full flex-col items-center justify-center p-8 text-center text-white'>
                  <h3 className='text-xl font-bold'>{item.title}</h3>
                  <p className='mt-2'>{item.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className='absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2'>
        <div className='flex justify-center gap-2'>
          {scrollSnaps.map((_, index) => {
            return (
              <DotButton
                key={index}
                selected={index === selectedIndex}
                onClick={(): void => {
                  onDotButtonClick(index);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
