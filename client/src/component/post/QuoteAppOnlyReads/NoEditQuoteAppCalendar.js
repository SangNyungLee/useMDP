import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import NoEditMDPmodal from './NoEditMDPmodal';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { eventStyleGetter } from '../../../utils/CalendarController';
import { getOneCard } from '../../../utils/QuoteSetting';
import { dateParsing } from '../../../utils/DataParsing';
import styled from 'styled-components';

moment.locale("ko-KR");
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const _Toolbar = styled.div`
    margin-bottom: 10px;
    margin-top: 10px;
`;

const _ToGoButton = styled.div`
    border: none;
    background: none;
    font-size: 20px;
    width: 30px;
    text-align: center;
    border-radius: 50%;

    &:hover {
        cursor: pointer;
        background-color: #ccc;
    }
`;

const _Label = styled.span`
    font-size: 25px;
    font-weight: bolder;
`;

const _SwitchButton = styled.button`
    background: none;
    border: none;
    margin: 0px 5px;
    width: 70px;

    &:hover {
        background-color: #ccc;
    }
`;

const CustomToolbar = ({ label, onNavigate, onView }) => {
    const goToToday = (e) => {
        e.stopPropagation();
        onNavigate('TODAY');
    };

    const goToNext = (e) => {
        e.stopPropagation();
        onNavigate('NEXT');
    };

    const goToPrev = (e) => {
        e.stopPropagation();
        onNavigate('PREV');
    };

    const switchToMonthView = (e) => {
        e.stopPropagation();
        onView('month');
    };

    const switchToWeekView = (e) => {
        e.stopPropagation();
        onView('week');
    };

    const switchToDayView = (e) => {
        e.stopPropagation();
        onView('day');
    };

    const switchToAgendaView = (e) => {
        e.stopPropagation();
        onView('agenda');
    };

    return (
        <_Toolbar>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    marginBottom: '10px',
                }}
            >
                <_ToGoButton onClick={(e) => goToPrev(e)}>{'<'}</_ToGoButton>
                <div onClick={(e) => goToToday(e)} style={{ textAlign: 'center' }}>
                    <_Label>{label}</_Label>
                </div>
                <_ToGoButton onClick={(e) => goToNext(e)}>{'>'}</_ToGoButton>
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                <_SwitchButton onClick={(e) => switchToMonthView(e)}>Month</_SwitchButton>
                <_SwitchButton onClick={(e) => switchToWeekView(e)}>Week</_SwitchButton>
                <_SwitchButton onClick={(e) => switchToDayView(e)}>Day</_SwitchButton>
                <_SwitchButton onClick={(e) => switchToAgendaView(e)}>Agenda</_SwitchButton>
            </div>
        </_Toolbar>
    );
};

export default function NoEditQuoteAppCalendar() {
    const plannerList = useSelector((state) => state.noEditPlanner);
    const quote = plannerList.quote;

    const [events, setEvents] = useState();
    const [selectedCard, setSelectedCard] = useState(getOneCard(0, 'TODO'));
    const [visible, setVisible] = useState(false);

    const cardStatusIndex = quote ? quote : 0;
    const cardStatus = cardStatusIndex ? (cardStatusIndex === 0 ? 'TODO' : cardStatusIndex === 1 ? 'DOING' : 'DONE') : 'ALL';

    useEffect(() => {
        const selectedEvents = cardStatus === 'ALL' ? plannerList.cards.map((e) => e.flat()) : plannerList.cards[cardStatusIndex];
        setEvents(dateParsing(selectedEvents));
    }, [plannerList]);

    const onSelectEvent = (event) => {
        setSelectedCard(event);
        setVisible(true);
    };

    return (
        <>
            <NoEditMDPmodal selectedCard={selectedCard} modalStatus={visible} modalClose={() => setVisible(false)} />
            <DnDCalendar
                defaultDate={moment().toDate()}
                defaultView="month"
                startAccessor="startDate"
                endAccessor="endDate"
                events={events}
                localizer={localizer}
                onSelectEvent={onSelectEvent}
                resizable
                selectable
                style={{
                    height: '95%',
                    backgroundColor: 'white',
                    flex: 2,
                    overflowY: 'hidden',
                    borderRadius: '10px',
                    margin: '10px 10px 10px 10px',
                    padding: '8px',
                }}
                eventPropGetter={eventStyleGetter}
                components={{
                    toolbar: CustomToolbar,
                }}
            />
        </>
    );
}
