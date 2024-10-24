import styled from "styled-components";
import { UpdateInterface } from "types/common";

const UpdateLogModal = ({ updates }: { updates: UpdateInterface[] }) => (
  <MyModal>
    <H1 className="sticky top-0 text-lg font-bold py-4 px-[3rem] bg-light-secondary z-10">
      업데이트 기록
    </H1>
    <Div>
      {updates
        .slice(0)
        .reverse()
        .map((mylog: UpdateInterface, index: number) => (
          <div key={`${mylog.date}-${index}`}>
            <p className="sticky top-[60px] font-[600] text-dark-secondary left-0 bg-light-primary border-y border-[gainsboro]">
              {mylog.date}
            </p>
            <div className="pt-2 pb-3 text-dark-primary">
              {mylog.content.map((text: string, index: number) => (
                <p key={`${text}-${index}`}>· {text}</p>
              ))}
            </div>
          </div>
        ))}
    </Div>
  </MyModal>
);

export default UpdateLogModal;

const MyModal = styled.div`
  height: auto;
  max-height: 70vh;
  min-height: 500px;
  width: 90%;
  overflow: auto;
  min-width: 330px;
  max-width: 700px;
  background-color: white;
  border-radius: 10px;
  cursor: default;
`;

const Div = styled.div`
  background: var(--secondary-bgColor);
  font-size: 0.875rem;
  line-height: 1.25rem;
  & p {
    padding: 0 1.5rem;
  }
  @media screen and (min-width: 640px) {
    font-size: 1rem;
    line-height: 1.5rem;
    & p {
      padding: 0 3rem;
    }
  }
`;

const H1 = styled.h1`
  text-align: center;
  box-shadow: 0px 6px 10px -11px #000000a1;
  height: 60px;
`;
