import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Signature } from "./components/Signature";
import styled from "styled-components";

function App() {
  // 메인화면에서 screen height 만큼 스크롤 시 --scrolled css변수 변경
  document.documentElement.style.setProperty("--scrolled", "0");
  window.addEventListener("scroll", () => {
    if (window.innerHeight < window.scrollY) {
      document.documentElement.style.setProperty("--scrolled", "1");
    } else {
      document.documentElement.style.setProperty("--scrolled", "0");
    }
  });

  // 모바일 브라우저 주소창을 고려한 css height 설정
  let timer: ReturnType<typeof setTimeout> | null = null;
  let raf: number | null = null;

  window.addEventListener("resize", () => {
    if (!timer) resize(); // 디바운스 적용
    else clearTimeout(timer); // timer 삭제 후 재할당
    timer = setTimeout(() => {
      if (raf) cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
      timer = null;
    }, 1000);
  });

  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  const resize = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`); // css 변수 변경
    raf = requestAnimationFrame(resize);
  };

  // 코드 스플리팅 적용
  const MainPage = lazy(() => import("./pages/MainPage/index"));
  const DetailPage = lazy(() => import("./pages/DetailPage/index"));

  return (
    <Container>
      <Header />
      <Suspense fallback={<div className="w-screen h-screen">Loading...</div>}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/project/:id" element={<DetailPage />} />
        </Routes>
      </Suspense>
      <Signature />
    </Container>
  );
}

export default App;

const Container = styled.div`
  position: relative;
  background-color: var(--primary-bgColor);
  color: var(--primary-fontColor);
  font-weight: 100;
  font-family: Pretendard-Regular;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
`;
