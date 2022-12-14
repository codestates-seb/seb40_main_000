import styled from "styled-components";
import { useState } from "react";
import MenuModal from "./MenuModal";
import { RiArrowGoBackFill } from "react-icons/ri";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "react-router-dom";

const GoBack = styled(RiArrowGoBackFill)`
  position: absolute;
  top: 10px;
  left: 5px;
  &:hover {
    opacity: 70%;
    transition: 0.5s;
  }
`;

const HeaderContainer = styled.header`
  position: relative;
  max-width: 410px;
  margin: auto;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray;
`;

const MenuButton = styled(AiOutlineMenu)`
  right: 5px;
  position: absolute;
  &:hover {
    opacity: 70%;
    transition: 0.5s;
  }
`;

export default function SubHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <HeaderContainer>
      <Link to="/reviews">
        <GoBack size={25} color="gray" />
      </Link>
      <MenuButton size={25} color="gray" onClick={() => setIsModalOpen(true)} />
      {isModalOpen ? <MenuModal setIsModalOpen={setIsModalOpen} /> : null}
    </HeaderContainer>
  );
}
