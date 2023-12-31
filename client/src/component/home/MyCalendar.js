import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { plannerListActions } from "../../store/plannerList";
import MDPModal from "../modal/MDPModal";

import {
  eventStyleGetter,
  getNestedElement,
} from "../../utils/CalendarController";
import { getOneCard } from "../../utils/QuoteSetting";
import { dateParsing } from "../../utils/DataParsing";
import CalendarSideBar from "./calendar/CalendarSideBar";
import styled from "styled-components";
import CalendarSelect from "./calendar/CalendarSelect";
import { patchCard, postCard, postPlanner } from "../../utils/DataAxios";
import { calendarActions } from "../../store/calendar";
import { HOME } from "../../constant/constant";
import { requestFail } from "../etc/SweetModal";
import "../../constant/css/calendar.css";

moment.locale("ko-KR");
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const _Container = styled.div`
  display: flex;
  margin-top: 40px;
`;

const _Toolbar = styled.div`
  width: 50vw;
  margin-bottom: 10px;
  @media screen and (max-width: 1300px) {
    & {
      width: 65vw;
    }
  }
`;

const _ToGoButton = styled.div`
  border: none;
  background: none;
  font-size: 20px;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 50%;
  color: white;

  &:hover {
    cursor: pointer;
    background-color: #393e46;
  }
`;

const _Label = styled.span`
  font-size: 25px;
  font-weight: bolder;
  color: white;
`;

const _SwitchButton = styled.button`
  background: none;
  border: none;
  margin: 0px 5px;
  width: 70px;
  color: white;
  border-radius: 2px;

  &:hover {
    background-color: #393e46;
  }

  @media screen and (max-width: 700px) {
    & {
      margin: 0px;
    }
  }

  @media screen and (max-width: 500px) {
    & {
      font-size: 13px;

      width: fit-content;
    }
  }
`;

const _Flex = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const _CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
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
          marginBottom: "20px",
        }}
      >
        <_ToGoButton onClick={(e) => goToPrev(e)}>{"<"}</_ToGoButton>
        <div onClick={(e) => goToToday(e)} style={{ textAlign: "center" }}>
          <_Label>{label}</_Label>
        </div>
        <_ToGoButton onClick={(e) => goToNext(e)}>{">"}</_ToGoButton>
      </div>
      <_CalendarContainer>
        <div>
          <CalendarSelect target={HOME} />
        </div>
        <div>
          <_SwitchButton onClick={(e) => switchToMonthView(e)}>
            Month
          </_SwitchButton>
          <_SwitchButton onClick={(e) => switchToWeekView(e)}>
            Week
          </_SwitchButton>
          <_SwitchButton onClick={(e) => switchToDayView(e)}>Day</_SwitchButton>
          <_SwitchButton onClick={(e) => switchToAgendaView(e)}>
            Agenda
          </_SwitchButton>
        </div>
      </_CalendarContainer>
    </_Toolbar>
  );
};

export default function MyCalendar() {
  const plannerList = useSelector((state) => state.plannerList);
  const { home } = useSelector((state) => state.calendar);

  const plannerId = home[0];
  const cardStatusIndex = home[1] ? home[1] : 0;
  const cardStatus = cardStatusIndex
    ? cardStatusIndex === 0
      ? "TODO"
      : cardStatusIndex === 1
      ? "DOING"
      : "DONE"
    : "TODO";

  const [events, setEvents] = useState();
  const [selectedCard, setSelectedCard] = useState(getOneCard(0, "TODO"));
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (plannerList.length > 0) {
      const selectedEvents = getNestedElement(plannerList, home);
      if (selectedEvents) {
        const parsedEvents = dateParsing(selectedEvents);
        setEvents(parsedEvents);
      } else {
        const plannerId = plannerList[0].plannerId;
        dispatch(calendarActions.setHome([plannerId]));
      }
    }
  }, [plannerList, home]);

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
      checklists: [{ title: "done", checked: 0 }],
    };

    dispatch(
      plannerListActions.updateCard({
        cardId,
        startDate,
        endDate,
      })
    );

    const res = await patchCard(requestData);
    if (res.status !== 200) {
      requestFail("카드 데이터 저장");
    }
  };

  const onSelectSlot = async (slotInfo) => {
    const newEvent = getOneCard(events.length, cardStatus);

    delete newEvent.cardId;
    delete newEvent.startDate;
    delete newEvent.endDate;

    const startDate = new Date(slotInfo.start).toISOString();
    const endDate = new Date(slotInfo.end).toISOString();

    if (plannerList.length === 0) {
      const newPlannerData = {
        creator: "default creator",
        title: "default title",
        thumbnail: "",
        plannerAccess: "PUBLIC",
      };

      const result = await postPlanner(newPlannerData);

      if (result.status === 201) {
        const newPlannerId = result.data.data;

        const newCardData = {
          ...newEvent,
          plannerId: newPlannerId,
          startDate,
          endDate,
          cardStatus,
          checklists: [{ checked: 0, title: "done" }],
        };

        const newCardId = await postCard(newCardData);

        dispatch(
          plannerListActions.addPlanner({
            ...newPlannerData,
            plannerId: newPlannerId,
            cards: [
              [
                {
                  ...newEvent,
                  cardId: newCardId.data.data,
                  startDate,
                  endDate,
                },
              ],
              [],
              [],
            ],
            taglist: [
              {
                title: "DEFAULT",
                valuer: "DEFAULT",
                thumbnail: "/svg/css.svg",
              },
            ],
          })
        );

        dispatch(calendarActions.setHome([newPlannerId]));
      } else {
        requestFail("플래너 id 생성");
        return;
      }
    } else {
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
          card: {
            ...newEvent,
            cardId: res.data.data,
            startDate,
            endDate,
          },
        })
      );
    }
  };

  const onSelectEvent = (event, e) => {
    setSelectedCard(event);
    setVisible(true);
  };

  return (
    <_Flex>
      <_Container>
        <CalendarSideBar />
        <MDPModal
          selectedCard={selectedCard}
          modalStatus={visible}
          modalClose={() => setVisible(false)}
          plannerId={plannerId}
        />
        <DnDCalendar
          className="my-calendar"
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
            flex: 1,
            height: "80vh",
            background: "#393e46",
            padding: "10px",
            borderRadius: "5px",
          }}
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </_Container>
    </_Flex>
  );
}
