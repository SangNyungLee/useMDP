import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import moment from "moment";
import { plannerListActions } from "../../store/plannerList";
import MDPModal from "../modal/MDPModal";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {
  eventStyleGetter,
  getNestedElement,
} from "../../utils/CalendarController";
import { getOneCard } from "../../utils/QuoteSetting";
import { dateParsing } from "../../utils/DataParsing";
import { patchCard, postCard } from "../../utils/DataAxios";
import styled from "styled-components";
import CalendarSelect from "../home/calendar/CalendarSelect";
import { QUOTE } from "../../constant/constant";
import { requestFail } from "../etc/SweetModal";

moment.locale("ko-KR");
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const _Toolbar = styled.div`
  margin-bottom: 10px;
`;

const _ToGoButton = styled.div`
  border: none;
  background: none;
  font-size: 20px;
  width: 30px;
  height: 30px;
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
    onNavigate("TODAY");
  };

  const goToNext = (e) => {
    e.stopPropagation();
    onNavigate("NEXT");
  };

  const goToPrev = (e) => {
    e.stopPropagation();
    onNavigate("PREV");
  };

  const switchToMonthView = (e) => {
    e.stopPropagation();
    onView("month");
  };

  const switchToWeekView = (e) => {
    e.stopPropagation();
    onView("week");
  };

  const switchToDayView = (e) => {
    e.stopPropagation();
    onView("day");
  };

  const switchToAgendaView = (e) => {
    e.stopPropagation();
    onView("agenda");
  };

  return (
    <_Toolbar>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "10px",
        }}
      >
        <_ToGoButton onClick={(e) => goToPrev(e)}>{"<"}</_ToGoButton>
        <div onClick={(e) => goToToday(e)} style={{ textAlign: "center" }}>
          <_Label>{label}</_Label>
        </div>
        <_ToGoButton onClick={(e) => goToNext(e)}>{">"}</_ToGoButton>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <CalendarSelect target={QUOTE} />
        <_SwitchButton onClick={(e) => switchToMonthView(e)}>
          Month
        </_SwitchButton>
        <_SwitchButton onClick={(e) => switchToWeekView(e)}>Week</_SwitchButton>
        <_SwitchButton onClick={(e) => switchToDayView(e)}>Day</_SwitchButton>
        <_SwitchButton onClick={(e) => switchToAgendaView(e)}>
          Agenda
        </_SwitchButton>
      </div>
    </_Toolbar>
  );
};

export default function QuoteAppCalendar() {
  const plannerList = useSelector((state) => state.plannerList);
  const { quote } = useSelector((state) => state.calendar);
  const dispatch = useDispatch();

  const [events, setEvents] = useState();
  const [selectedCard, setSelectedCard] = useState(getOneCard(0, "TODO"));
  const [visible, setVisible] = useState(false);

  const plannerId = quote[0];
  const cardStatusIndex = quote[1] ? quote[1] : 0;
  const cardStatus = cardStatusIndex
    ? cardStatusIndex === 0
      ? "TODO"
      : cardStatusIndex === 1
      ? "DOING"
      : "DONE"
    : "TODO";

  useEffect(() => {
    const selectedEvents = getNestedElement(plannerList, quote);
    setEvents(dateParsing(selectedEvents));
  }, [plannerList, quote]);

  const plannerUpdateCard = async (data) => {
    const { start, end, event } = data;
    const cardId = event.cardId;
    const startDate = start.toISOString();
    const endDate = end.toISOString();
    const card = events.find((e) => e.cardId === cardId);
    
    const requestData = {
      ...card,
      startDate,
      endDate,
      plannerId,
      checklists: card.checklists? card.checklists : [{ checked: 0, title: "done" }],
    };

    dispatch(
      plannerListActions.updateCard({
        cardId,
        startDate,
        endDate,
      })
    );

    const result = await patchCard(requestData);
    if (result.status !== 200) {
      requestFail("카드 데이터 저장");
      return;
    }
  };

  const onSelectSlot = async (slotInfo) => {
    const newEvent = getOneCard(events.length, cardStatus);

    delete newEvent.cardId;

    const startDate = new Date(slotInfo.start).toISOString();
    const endDate = new Date(slotInfo.end).toISOString();

    const requestData = {
      ...newEvent,
      plannerId,
      cardStatus,
      startDate,
      endDate,
      checklists: [{ checked: 0, title: "done" }],
    };

    const res = await postCard(requestData);

    dispatch(
      plannerListActions.addCard({
        plannerId,
        cardStatusIndex,
        card: { ...newEvent, cardId: res.data.data, startDate, endDate },
      })
    );
  };

  const onSelectEvent = (event, e) => {
    setSelectedCard(event);
    setVisible(true);
  };

  return (
    <>
      <MDPModal
        selectedCard={selectedCard}
        modalStatus={visible}
        modalClose={() => setVisible(false)}
      />
      <DnDCalendar
        defaultDate={moment().toDate()}
        defaultView="month"
        startAccessor="startDate"
        endAccessor="endDate"
        events={events}
        localizer={localizer}
        onEventDrop={plannerUpdateCard}
        onEventResize={plannerUpdateCard}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        resizable
        selectable
        style={{
          height: "95%",
          backgroundColor: "white",
          flex: 2,
          overflowY: "hidden",
          borderRadius: "10px",
          marginTop: "20px",
          marginRight: "50px",
          marginLeft: "50px",
          padding: "8px",
        }}
        eventPropGetter={eventStyleGetter}
        components={{
          toolbar: CustomToolbar,
        }}
      />
    </>
  );
}
