// ProjectInfo 컴포넌트에서 사용
export type InfoType = {
  title: string;
  description: string;
  period: string;
  memberInfo: string;
  mainFunction: string[];
  gitHub: string;
  link: string;
  simImageSrc?: string[][];
  tech: string[];
};
// ----------------------------

// ProjectsPage 컴포넌트에서 사용
export type ContentType = {
  summary: {
    src: string;
    alt: string;
    path: string;
    description: string;
  };
  detail: {
    title: string;
    description: string;
    period: string;
    memberInfo?: string;
    mainFunction: string[];
    gitHub: string;
    link: string;
    simImageSrc?: string[][];
    tech: string[];
    whatIDid: string[];
  };
};
// ----------------------------

// MyExperience 컴포넌트에서 사용
export type SkillType = {
  title: string;
  content: string;
  level: number;
};

export type ExperienceType = {
  date: string;
  name: string;
};
// ----------------------------

// 업데이트 기록 모달용

export interface UpdateInterface {
  date: string;
  content: string[];
}
