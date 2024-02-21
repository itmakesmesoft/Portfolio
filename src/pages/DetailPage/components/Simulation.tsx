import styled from "styled-components";
import { useEffect, useState } from "react";
import useObserver from "components/useObserver";

let simTimer: NodeJS.Timeout;

const Simulation = (props: { data: string[][] }) => {
  const imageSrcs: string[][] = props.data;
  const [card, setCard] = useState<number>(-1); // -1: standBy, 0~N: 호버링 인덱스 번호
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const { target: targetRef, isIntersecting } = useObserver(0.7); // 시뮬레이션 컴포넌트가 뷰포트에 교차되는 경우 작동

  useEffect(() => {
    loadAllImages(imageSrcs);
    return () => simTimer && clearTimeout(simTimer);
  }, []);

  useEffect(() => {
    if (isIntersecting) setCurrentCard(0);
    else setCurrentCard(-1);
  }, [isIntersecting]);

  const loadAllImages = (imageList: string[][]) => {
    imageList.forEach((src: string[]) => {
      const loadGif = new Image();
      loadGif.src = src[1];
    });
  };

  const setCurrentCard = (index: number) => {
    const target = document.querySelector(`#sim-${index}`) as HTMLImageElement;
    if (target) {
      handleOnBgClick();
      changeImgPath(target, target.dataset.src);
      setCard(index);
    } else setCard(index);
  };

  const unSetCardAll = () => {
    const targets: NodeListOf<HTMLImageElement> =
      document.querySelectorAll(`.sim`);
    targets.forEach((target: HTMLImageElement) => {
      changeImgPath(target, target.dataset.thumbnail);
    });
    setCard(-1);
  };

  const changeImgPath = (
    target: HTMLImageElement,
    newSrc: string | undefined
  ) => {
    if (newSrc) target.src = newSrc;
  };

  const getElementOffset = (target: HTMLElement) => {
    const top = target.offsetTop;
    const left = target.offsetLeft;
    const height = target.offsetHeight;
    const width = target.offsetWidth;
    return { top, left, height, width };
  };

  const handleOnMouseOver = (index: number) => {
    if (isClicked) return;
    setCurrentCard(index);
  };

  const handleOnMouseLeave = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    if (isClicked) return;
    unSetCardAll();
  };

  const handleOnBgClick = () => {
    setIsClicked(false);
    const bg = document.querySelector("#blurbg-sim") as HTMLDivElement;
    bg.style.opacity = "";
    bg.style.zIndex = "";
    const images = document.querySelectorAll(".animatedImage");
    images.forEach((target: any) => {
      target.parentNode.style.transform = "";
      target.parentNode.style.opacity = "";
      changeImgPath(target, target.dataset.thumbnail);
      if (target.parentNode.style.zIndex) {
        setTimeout(() => {
          if (target.parentNode.style.zIndex) {
            target.parentNode.style.zIndex = "";
          }
        }, 500);
      }
    });
    unSetCardAll();
  };

  const handleOnClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsClicked(true);
    const child = getElementOffset(e.currentTarget);
    const parent = getElementOffset(
      document.querySelector("#container-wrapcards") as HTMLElement
    );
    const px = parent.left + parent.width / 2;
    const py = parent.top + parent.height / 2;
    const cx = parent.left + child.left + child.width / 2;
    const cy = parent.top + child.top + child.height / 2;

    e.currentTarget.style.transform = `translateX(${px - cx}px) translateY(${
      py - cy
    }px) scale(2)`;
    e.currentTarget.style.zIndex = "2";
    const bg = document.querySelector("#blurbg-sim") as HTMLDivElement;
    bg.style.opacity = "1";
    bg.style.zIndex = "1";
  };

  const eventHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index?: number
  ) => {
    const targetClass = (e.currentTarget as HTMLElement).classList;
    if (targetClass.contains("hover")) {
      console.log("????");
      handleOnClick(e);
    } else if (index !== undefined) {
      handleOnMouseOver(index);
    }
  };

  return (
    <div className="w-full relative flex flex-row justify-center">
      <div
        id="container-wrapcards"
        ref={targetRef}
        className="relative w-full max-w-[700px] py-[5rem] lg:py-[10rem] px-12 sm:px-20 grid gap-4 md:gap-6 grid-cols-2 content-center"
      >
        {imageSrcs.map((src: string[], index: number) => {
          return (
            <WrapCard
              className={`sim rounded-lg sm:rounded-xl${
                card === index ? " hover" : ""
              }`}
              key={`${src}-${index}`}
              onClick={(e) => eventHandler(e)}
              onMouseLeave={handleOnMouseLeave}
              onMouseOver={(e) => eventHandler(e, index)}
            >
              {/* Img 태그가 하나 더 존재하는 이유는 opacity를 통한 페이드 인 효과를 위함 */}
              <Img
                className="thumbnail"
                src={src[0]}
                alt={`simulationImage_${index + 1}`}
              />
              <Img
                id={`sim-${index}`}
                className="animatedImage"
                src={src[0]}
                data-src={src[1]}
                data-thumbnail={src[0]}
                alt={`simulationImage_${index + 1}`}
              />
            </WrapCard>
          );
        })}
      </div>
      <Background id="blurbg-sim" onClick={handleOnBgClick} />
    </div>
  );
};
const Background = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: -1;
  backdrop-filter: blur(10px);
`;
const Img = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  transition: 300ms;
  &.animatedImage {
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
  transition: all 0.5s;
  cursor: pointer;
  &.hover > .animatedImage {
    opacity: 1;
  }
  &.hover > .thumbnail {
    opacity: 0;
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
