import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import NoEditQuoteAppCalendar from './QuoteAppOnlyReads/NoEditQuoteAppCalendar';
import { getOneCard } from '../../utils/QuoteSetting';
import styled from 'styled-components';
import QuoteSpinner from './QuoteSpinner';
import NoEditDroppableComponent from './QuoteAppOnlyReads/NoEditDroppableComponent';
import sky from '../../constant/img/sky.jpg';
import { useLocation, useSearchParams } from 'react-router-dom';
import {  getPlannerBtoA } from '../../utils/DataAxios';
import { plannerCardStatusDevide } from '../../utils/DataParsing';
import { useDispatch } from 'react-redux';
import { noEditPlannerAction } from '../../store/noEditPlanner';
import NoEditQuoteHeader from './QuoteAppOnlyReads/NoEditQuoteHeader';
const _QuoteAppContainer = styled.div`
    display: flex;
    flex: 3;
    background-image: url(${(props) => props.$image});
    background-size: cover;
    background-repeat: no-repeat;
`;

const _QuoteContainer = styled.div`
    display: flex;
    flex: 3;
    align-items: flex-start;
    justify-content: space-evenly;
    margin-top: 20px;
`;

const _Thumbnail = styled.div`
    display: flex;
    width: 100%;
`;

export default function QuoteAppOnlyRead() {
    const dispatch = useDispatch();
    const [switchContext, setSwitchContext] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const noEditPlanner = useSelector((state) => state.noEditPlanner);
    const thumnnailRef = useRef(null);
    const [selectedCard, setSelectedCard] = useState(getOneCard(0, 'TODO'));
    const [visible, setVisible] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const location = useLocation();

    useEffect(() => {
        async function fetchData() {
            const btoaid = searchParams.get('id');
            if(btoaid){
                const data = await getPlannerBtoA(btoaid);
                let tmp = plannerCardStatusDevide(data.data.data);
                tmp = { ...tmp, quote: 1 };
                dispatch(noEditPlannerAction.setPlansInit(tmp));
            } else {
                const data = location.state?.sourceData
                if(data){
                    let tmp = plannerCardStatusDevide(data);
                    tmp = { ...tmp, quote: 1 };
                    dispatch(noEditPlannerAction.setPlansInit(tmp));
                }
            }
        }
        fetchData();
    }, [location]);


    let planner;
    let plannerId;
    let plannerTitle;
    let plannerThumbnail;
    let plannerInfo;

    function sortByIntOrder(data) {
        const tmp = [[], [], []];
        for (let i = 0; i < 3; i++) {
            tmp[i] = data[i].slice().sort((a, b) => a.intOrder - b.intOrder);
        }
        return tmp;
    }

    if (noEditPlanner["cards"]) {
        const { cards, plannerId: id, creator, title, thumbnail, plannerAccess: access, taglist: list, ...rest } = noEditPlanner;
        planner = sortByIntOrder(cards);
        plannerId = id;
        plannerTitle = title;
        plannerThumbnail = thumbnail;
        plannerInfo = {
            plannerId: id,
            creator,
            title,
            thumbnail,
            plannerAccess: access,
            taglist: list ? list : [],
        };
    }

    async function cardClick(ind, index) {
        setSelectedCard(planner[ind][index]);
        setVisible(true);
    }

    function onDragEnd(result, provided) {
        const { source, destination } = result;

        if (!destination) {
            return;
        }
    }

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const isCalendarVisible = windowWidth > 1024;
    if (!planner) {
        return <QuoteSpinner />;
    } else {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <NoEditQuoteHeader selectedCard={selectedCard} thumnnailRef={thumnnailRef} visible={visible} setVisible={setVisible} plannerList={noEditPlanner} plannerInfo={plannerInfo} setSwitch={setSwitchContext} />
                <_QuoteAppContainer $image={plannerThumbnail ? plannerThumbnail : sky}>
                    <_Thumbnail ref={thumnnailRef}>
                        {isCalendarVisible ? (
                            <>
                                <_QuoteContainer>
                                    <DragDropContext
                                        onDragEnd={(result, provided) => {
                                            onDragEnd(result, provided);
                                        }}
                                    >
                                        {planner.map((cardList, index) => (
                                            <NoEditDroppableComponent key={index} cardList={cardList} cardStatusIndex={index} handleClick={cardClick} plannerId={plannerId} noEdit={true} />
                                        ))}
                                    </DragDropContext>
                                </_QuoteContainer>
                                <NoEditQuoteAppCalendar />
                            </>
                        ) : switchContext == 0 ? (
                            <_QuoteContainer>
                                <DragDropContext
                                    onDragEnd={(result, provided) => {
                                        onDragEnd(result, provided);
                                    }}
                                >
                                    {planner.map((cardList, index) => (
                                        <NoEditDroppableComponent key={index} cardList={cardList} cardStatusIndex={index} handleClick={cardClick} plannerId={plannerId} />
                                    ))}
                                </DragDropContext>
                            </_QuoteContainer>
                        ) : (
                            <NoEditQuoteAppCalendar />
                        )}
                    </_Thumbnail>
                </_QuoteAppContainer>
            </div>
        );
    }
}
