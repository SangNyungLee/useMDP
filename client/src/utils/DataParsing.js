export function dateParsing(planner){
    return planner.flat().map( e => ({ ...e,
        startDate: new Date(e.startDate),
        endDate: new Date(e.endDate)}));
}

export function plannerCardStatusDevide(planner){
    const { cards } = planner
    return {...planner, cards : cards.length > 0 ? [
        cards.filter( card => card.cardStatus === "TODO" ),
        cards.filter( card => card.cardStatus === "DOING"),
        cards.filter( card => card.cardStatus === "DONE"),
    ] : [[],[],[]]}
}

export function plannerListCardStatusDevide( plannerList ){
    return plannerList.map( planner => plannerCardStatusDevide(planner))
}


export function removeSpecifiedIdProperty(planner){
    const newPlanner = {...planner, cards: planner.cards.flat().map( card => {
        delete card.cardId
        return card
    })}
    delete newPlanner.plannerId;
    return newPlanner
}

export function removeUnspecifiedIdProperty(planner){
    const newPlanner = {...planner, cards: planner.cards.map( card => {
        delete card.cardId
        return card
    })}
    delete newPlanner.plannerId;
    return newPlanner
}