export const hmsToFloat = hms => {
  // handle the input being  a string number of seconds
  const hmsNumber = Number(hms);
  if (hmsNumber !== NaN) {
    return hmsNumber;
  }

  const hourSplitArray = hms.split("h");
  let ms;
  let s;
  debugger;

  if (hourSplitArray.length === 1) {
    // ['1'] or ['2m']
  }

  // ["", ""] or ['h', '2'] or ['2', h]

  let hourString;
  let minuteString;

  if (hourSplitArray.length === 2) {
    hourString = hourSplitArray[0];
    ms = hourSplitArray[1];
  } else {
    hourString = "0";
    ms = hourSplitArray[0];
  }

  // const [hourString = "0", ms] = hms.split("h");
  const minuteSplitArray = ms.split("m");
  if (minuteSplitArray.length === 2) {
    minuteString = minuteSplitArray[0];
    s = minuteSplitArray[1];
  } else {
    minuteString = "0";
    s = minuteSplitArray[0];
  }

  // const [minuteString = "0", s] = ms.split("m");

  const secondString = s.split("s")[0];

  const hoursInt = parseInt(hourString, 10);
  const minuteInt = parseInt(minuteString, 10);
  let secondFloat = parseFloat(secondString);

  if (!isNaN(minuteInt)) {
    secondFloat += minuteInt * 60;
  }
  if (!isNaN(hoursInt)) {
    secondFloat += hoursInt * 3600;
  }
  return secondFloat;
};
