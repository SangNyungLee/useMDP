export function eventStyleGetter(event, start, end, isSelected) {
    var backgroundColor = event.coverColor;
    var style = {
        backgroundColor,
        borderRadius: '10px',
        opacity: 0.8,
        color: 'black',
        border: '0px',
        display: 'block',
        textAlign: 'center',
    };
    return {style};
};

// export function getNestedElement(array, indices) {
//     if(array.length === 0){
//       return array;
//     }

//     let result = (array[indices[0]]).cards;

//     switch (indices.length){
//       case 0:
//         return array.map( e => e.cards.flat());
//       case 1:
//         return result.flat();
//       case 2:
//         return result[indices[1]].flat();
//       case 3:
//         return [result[indices[1]][indices[2]]]
//     }
// }

export function getNestedElement(array, indices) {
  if(array.length === 0){
    return array;
  }

  let result = (array.find( item => item.plannerId === indices[0])).cards;

  switch (indices.length){
    case 0:
      return array.map( e => e.cards.flat());
    case 1:
      return result.flat();
    case 2:
      return result[indices[1]].flat();
    case 3:
      return [(result[indices[1]]).find( item => item.cardId === indices[2])]
  }
}