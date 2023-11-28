import styled from 'styled-components';
import menuicon from '../../../constant/img/menu.svg';
import LeftClicker from '../RightClicker/LeftClicker';
import { useState } from 'react';
const HeaderDiv = styled.div`
    text-align: left;
    margin: 10px;
    font-weight: 700;
`;
const MenuImg = styled.img`
    height: 20px;
    margin: 10px;
    &:hover {
        cursor: pointer;
    }
`;
const FlexContainer = styled.div`
    display: flex;
    justify-content: space-between;
    text-align: center;
`;

export default function CardListHeader(props) {
    const { index } = props;
    const [point, setPoint] = useState([-1, -1]);

    const handleLeftClicker = (e) => {
        e.preventDefault();
        setPoint([e.clientY, e.clientX]);
    };

    switch (index) {
        case '0':
            return (
                <>
                    {point[0] !== -1 && point[1] !== -1 ? <LeftClicker point={point}></LeftClicker> : null}
                    <FlexContainer>
                        <HeaderDiv>TODO</HeaderDiv>
                        <MenuImg src={menuicon} onClick={(e) => handleLeftClicker(e)}></MenuImg>
                    </FlexContainer>
                </>
            );
        case '1':
            return (
                <FlexContainer>
                    <HeaderDiv>DOING</HeaderDiv>
                    <MenuImg src={menuicon}></MenuImg>
                </FlexContainer>
            );
        case '2':
            return (
                <FlexContainer>
                    <HeaderDiv>DONE</HeaderDiv>
                    <MenuImg src={menuicon}></MenuImg>
                </FlexContainer>
            );
        default:
            return (
                <FlexContainer>
                    <HeaderDiv>TODO</HeaderDiv>
                    <MenuImg src={menuicon}></MenuImg>
                </FlexContainer>
            );
    }
}