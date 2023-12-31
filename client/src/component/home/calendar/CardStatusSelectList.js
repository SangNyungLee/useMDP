import { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { calendarActions } from "../../../store/calendar";
import CardSelectList from "./CardSelectList";

const _CardsContainer = styled.div`
  width: 130px;
  background-color: white;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #ccc;

  @keyframes dropdown {
    0% {
      transform: translateY(-15%);
    }
    100% {
      transform: translateY(0);
    }
  }

  animation: dropdown 0.4s ease;

  &:hover {
    cursor: pointer;
  }
`;

const _SelectContainer = styled.div`
  background-color: white;
  width: 130px;
  height: 40px;
  border-radius: 2px;
  display: flex;
  align-items: center;
`;

const _SelectArrow = styled.div`
  width: fit-content;
  margin-left: 10px;
  font-size: 10px;
  color:black &:hover {
    cursor: pointer;
  }
`;

const _CardStatusTitle = styled.div`
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  width: 100%;
  margin-left: 10px;
  padding: 5px;
  color: black;
`;

const _CardContainer = styled.div`
  display: flex;
  width: 130px;
  background-color: white;
  border-radius: 2px;
  flex-direction: column;
  margin-left: 15px;
`;

const _Arrow = styled.div`
  font-size: 10px;
`;

export default function CardStatusSelectList({
  cardStatusArr,
  target,
  index,
  plannerId,
  setIsVisible,
  setIsClickPlanner,
}) {
  const [isClick, setIsClick] = useState(false);
  const dispatch = useDispatch();

  const title = index === 0 ? "TODO" : index === 1 ? "DOING" : "DONE";

  const handleClick = (e) => {
    e.stopPropagation();
    dispatch(
      calendarActions.setSelect({
        target,
        value: [plannerId, index],
      })
    );
    setIsVisible(false);
    setIsClickPlanner(false);
  };

  const selectClick = (e) => {
    e.stopPropagation();
    dispatch(
      calendarActions.setSelect({
        target,
        value: [plannerId, index],
      })
    );
    setIsClick((prev) => !prev);
  };

  return (
    <_CardsContainer>
      <_SelectContainer>
        {isClick ? (
          <_SelectArrow onClick={(e) => selectClick(e)}>
            <_Arrow>▼</_Arrow>
          </_SelectArrow>
        ) : (
          <_SelectArrow onClick={(e) => selectClick(e)}>
            <_Arrow>▶</_Arrow>
          </_SelectArrow>
        )}
        <_CardStatusTitle onClick={(e) => handleClick(e)}>
          {title}
        </_CardStatusTitle>
      </_SelectContainer>
      {isClick ? (
        <_CardContainer>
          {cardStatusArr.map((card) => (
            <CardSelectList
              key={card.cardId}
              card={card}
              target={target}
              plannerId={plannerId}
              index={index}
              setIsVisible={setIsVisible}
            />
          ))}
        </_CardContainer>
      ) : (
        <></>
      )}
    </_CardsContainer>
  );
}
