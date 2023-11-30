import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { plannerListActions } from '../../../store/plannerList';
import PlannerListLi from './PlannerListLi';
import useRead from '../../../hook/useRead';
import { plannerCardStatusDevide, plannerListCardStatusDevide, readSpecifiedPlanner, readUnspecifiedPlanner, readUnspecifiedPlannerList, specifyPlanner } from '../../../utils/DataParsing';
import { validatePlannerData, validatePlannerListData, validateUnspecifiedPlannerData, validateUnspecifiedPlannerListData } from '../../../utils/DataValidate';
import { calendarActions } from '../../../store/calendar';
import { HOME } from '../../../constant/constant';

const _Container = styled.div`
    border-radius: 20px;
    background-color: skyblue;
    height: 78vh;
    width: 240px;
    white-space: nowrap;
    overflow-x: hidden;
    overflow-y: hidden;
    text-overflow: ellipsis;
    padding-top: 30px;
    margin: 0px 30px;
    flex: 1;
`;

const _PlannerListUl = styled.ul`
    list-style-type: none;
    padding: 5px;
`;

export default function CalendarSideBar() {
    const plannerList = useSelector((state) => state.plannerList);

    const readerRegister = useRead(HOME);

    return (
        <>
            <_Container {...readerRegister}>
                <_PlannerListUl>
                    {plannerList.map((planner) => (
                        <PlannerListLi key={planner.plannerId} planner={planner} />
                    ))}
                </_PlannerListUl>
            </_Container>
        </>
    );
}
