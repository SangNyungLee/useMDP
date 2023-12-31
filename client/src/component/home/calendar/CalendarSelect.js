import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import CalendarSelectList from "./CalendarSelectList";
import { HOME, QUOTE } from "../../../constant/constant";

const _SelectContainer = styled.div`
  background: none;
  width: 130px;
  height: 43px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  margin-left: -10px;
`;

const _SelectArrow = styled.div`
  width: fit-content;
  margin-left: 10px;
  font-size: 10px;
  color: white;

  &:hover {
    cursor: pointer;
  }
`;

const _Flex = styled.div`
  display: flex;
  align-content: center;
  flex-direction: column;
  height: fit-content;
  position: absolute;
  left: 10px;
  z-index: 10;
  margin-top: -10px;

  @media screen and (min-width: 1300px) {
    & {
      display: none;
    }
  }
`;

const _Container = styled.div`
  display: flex;
  width: 130px;
  overflow-y: scroll;
  background-color: white;
  height: 200px;
  border-radius: 2px;
  flex-direction: column;
  margin-left: -10px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const _Title = styled.div`
  margin-left: 10px;
  text-overflow: ellipsis;
  color: white;
  @media screen and (max-width: 700px) {
    & {
      display: none;
    }
  }
`;

export default function CalendarSelect({ target }) {
  const [isClick, setIsClick] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const plannerList = useSelector((state) => state.plannerList);
  const { home, quote } = useSelector((state) => state.calendar);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (plannerList.length > 0) {
      let planner;
      switch (target) {
        case HOME:
          planner = plannerList.find((e) => e.plannerId === home[0]);
          setTitle(planner.title);
          break;
        case QUOTE:
          planner = plannerList.find((e) => e.plannerId === quote[0]);
          setTitle(planner.title);
          break;
      }
    }
  }, [plannerList, home, quote]);

  const selectClick = (e) => {
    e.stopPropagation();
    setIsClick((prev) => !prev);
    setIsVisible((prev) => !prev);
  };

  return (
    <_Flex>
      <_SelectContainer>
        {isClick ? (
          <_SelectArrow onClick={(e) => selectClick(e)}>
            <div>{"▼"}</div>
          </_SelectArrow>
        ) : (
          <_SelectArrow onClick={(e) => selectClick(e)}>
            <div>{"▶"}</div>
          </_SelectArrow>
        )}
        <_Title onClick={(e) => selectClick(e)}>{title}</_Title>
      </_SelectContainer>
      {isVisible ? (
        <_Container>
          {plannerList.map( planner => (
            <CalendarSelectList
              key={planner.plannerId}
              planner={planner}
              setIsVisible={setIsVisible}
              setIsClickPlanner={setIsClick}
              target={target}
            />
          ))}
        </_Container>
      ) : (
        <></>
      )}
    </_Flex>
  );
}
