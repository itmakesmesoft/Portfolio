import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";
import useObserver from "components/useObserver";
import debounce from "components/useDebounce";

const Simulation = (props: { data: string[][] }) => {
  const [currentCard, setCurrentCard] = useState(-1); // -1: standBy, 0~N: 호버링 인덱스 번호
  const imageSrcs: string[][] = props.data;

  const playNext = useCallback(() => {
    // useCallback => useEffect로 인해 불필요한 재렌더링이 발생되는 것을 막기 위해 사용
    setCurrentCard(currentCard < imageSrcs.length - 1 ? currentCard + 1 : 0);
  }, [imageSrcs.length, currentCard]);

  // 디바운스 적용
  // const { status, setStatus } = useDebounce(playNext, 1000);

  useEffect(() => {
    // if (status === "standby") {
    const animPlaying = setTimeout(playNext, 3000);
    return () => {
      clearTimeout(animPlaying);
    };
    // }
  }, [playNext]);

  useEffect(() => {
    handleOnActive(currentCard);
    handleOnInActive();
  }, [currentCard]);

  useEffect(() => {
    loadAllImages(imageSrcs);
  }, []);

  const showCard = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        // observer.unobserve(entry.target); // 1회성 동작 시
        // setStatus("");
        setCurrentCard(0);
      } else {
        // setStatus(-2);
        setCurrentCard(-1);
      }
    });
  };

  const handleOnActive = (currentCard: number) => {
    const target = document.querySelector<HTMLImageElement>(".active > .gif");
    if (target && target.dataset.src) {
      // loadImage(target.dataset.src);
      changeImgPath(target, target.dataset.src);
      setCurrentCard(currentCard);
    }
  };

  const handleOnInActive = () => {
    const target = document.querySelectorAll<HTMLImageElement>(".gif");
    if (target) {
      target.forEach((el: HTMLImageElement) => {
        changeImgPath(el, el.dataset.thumbnail);
      });
    }
  };

  const [targetRef] = useObserver(showCard, 0.7); // 시뮬레이션 컴포넌트가 뷰포트에 교차되는 경우 작동

  const loadAllImages = (imageList: string[][]) => {
    imageList.forEach((src: string[]) => {
      const loadGif = new Image();
      loadGif.src = src[1];
    });
  };

  const changeImgPath = (
    target: HTMLImageElement,
    newSrc: string | undefined
  ) => {
    if (newSrc) target.src = newSrc;
  };

  const handleOnMouseOver = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    index: number
  ) => {
    if (e.currentTarget.dataset.src) {
      // loadImage(e.currentTarget.dataset.src);
      changeImgPath(e.currentTarget, e.currentTarget.dataset.src);
      setCurrentCard(index);
      // setStatus(1);
      debounce(playNext, 1000);
    }
  };

  const handleOnMouseLeave = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    changeImgPath(e.currentTarget, e.currentTarget.dataset.thumbnail);
    setCurrentCard(-1);
    // setStatus(-1);
  };

  return (
    <div
      ref={targetRef}
      className="w-full max-w-[700px] py-[5rem] lg:py-[10rem] px-12 sm:px-20 grid gap-4 md:gap-6 grid-cols-2 content-center"
    >
      {imageSrcs.map((src: string[], index: number) => {
        return (
          <WrapCard
            className={`rounded-lg sm:rounded-xl ${
              currentCard === index ? "hover" : "unhover"
            }`}
            key={`${src}-${index}`}
          >
            <Img src={src[0]} alt={`simulationImage_${index + 1}`} />
            <Img
              className="gif"
              onMouseOver={(e) => handleOnMouseOver(e, index)}
              onMouseLeave={handleOnMouseLeave}
              src={src[0]}
              data-src={src[1]}
              data-thumbnail={src[0]}
              alt={`simulationImage_${index + 1}`}
            />
          </WrapCard>
        );
      })}
    </div>
  );
};

const Img = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  transition: 300ms;
  &.gif {
    opacity: 0;
  }
`;

const WrapCard = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  aspect-ratio: 16/10;
  overflow: hidden;
  box-shadow: #00000069 0 5px 15px -5px;
  transition-duration: 0.5s;
  cursor: pointer;
  &.hover > .gif {
    opacity: 1;
  }

  &:nth-child(even).hover {
    transform: scale(1.12) translateY(-15%) translateX(12%);
    box-shadow: #00000050 -10px 10px 30px -10px;
  }
  &:nth-child(odd).hover {
    transform: scale(1.12) translateY(-15%) translateX(-12%);
    box-shadow: #00000050 10px 10px 30px -10px;
  }
`;

export default Simulation;
