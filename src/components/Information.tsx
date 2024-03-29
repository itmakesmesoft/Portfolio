import { MdFace } from "@react-icons/all-files/md/MdFace";
import { MdSmartphone } from "@react-icons/all-files/md/MdSmartphone";
import { MdEmail } from "@react-icons/all-files/md/MdEmail";
import styled from "styled-components";
import { HashLink as Link } from "react-router-hash-link";
import useModal from "./useModal";
import UPDATES from "../assets/updates.json";
import UpdateLogModal from "./UpdateLogModal";

const Information = () => {
  const { Modal, setIsOpen } = useModal();
  return (
    <div className="mt-[1.5rem] text-sm sm:text-base flex items-start flex-col">
      <Link
        to="/#about"
        scroll={(el) =>
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      >
        <Phrase>
          <MdFace className="icon" />
          이은혁
        </Phrase>
      </Link>
      <a href="tel:010-6396-7078">
        <Phrase>
          <MdSmartphone className="icon" />
          010-6396-7078
        </Phrase>
      </a>
      <a href="mailto:dmsgur7112@naver.com">
        <Phrase>
          <MdEmail className="icon" />
          dmsgur7112@naver.com
        </Phrase>
      </a>
      <p className="mt-8">
        Copyright 2023. Eunhyeok Lee. All rights reserved.{" "}
        <span
          className="text-neutral-400 underline cursor-pointer inline-block"
          onClick={() => setIsOpen(true)}
        >
          updated at {UPDATES[UPDATES.length - 1]["date"]}
        </span>
      </p>
      <Modal children={<UpdateLogModal updates={UPDATES} />} />
    </div>
  );
};

const Phrase = styled.span`
  margin-top: 0.125rem;
  color: #616161;
  & .icon {
    margin-right: 0.5rem;
  }
  & svg {
    display: inline-block;
  }
  &:hover {
    color: #45c0bb;
  }
`;

export default Information;
