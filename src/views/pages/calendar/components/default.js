export const defaultMonth = {
  Day01: 0,
  Day02: 0,
  Day03: 0,
  Day04: 0,
  Day05: 0,
  Day06: 0,
  Day07: 0,
  Day08: 0,
  Day09: 0,
  Day10: 0,
  Day11: 0,
  Day12: 0,
  Day13: 0,
  Day14: 0,
  Day15: 0,
  Day16: 0,
  Day17: 0,
  Day18: 0,
  Day19: 0,
  Day20: 0,
  Day21: 0,
  Day22: 0,
  Day23: 0,
  Day24: 0,
  Day25: 0,
  Day26: 0,
  Day27: 0,
  Day28: 0,
  Day29: 0,
  Day30: 0,
  Day31: 0,
};
export const monthLst = [
  {
    label: "Tháng 1",
    value: "01",
  },
  {
    label: "Tháng 2",
    value: "02",
  },
  {
    label: "Tháng 3",
    value: "03",
  },
  {
    label: "Tháng 4",
    value: "04",
  },
  {
    label: "Tháng 5",
    value: "05",
  },
  {
    label: "Tháng 6",
    value: "06",
  },
  {
    label: "Tháng 7",
    value: "07",
  },
  {
    label: "Tháng 8",
    value: "08",
  },
  {
    label: "Tháng 9",
    value: "09",
  },
  {
    label: "Tháng 10",
    value: "10",
  },
  {
    label: "Tháng 11",
    value: "11",
  },
  {
    label: "Tháng 12",
    value: "12",
  },
];

export const headerCalender = [
  {
    FullName: "Ngày",
    Day01: 1,
    Day02: 2,
    Day03: 3,
    Day04: 4,
    Day05: 5,
    Day06: 6,
    Day07: 7,
    Day08: 8,
    Day09: 9,
    Day10: 10,
    Day11: 11,
    Day12: 12,
    Day13: 13,
    Day14: 14,
    Day15: 15,
    Day16: 16,
    Day17: 17,
    Day18: 18,
    Day19: 19,
    Day20: 20,
    Day21: 21,
    Day22: 22,
    Day23: 23,
    Day24: 24,
    Day25: 25,
    Day26: 26,
    Day27: 27,
    Day28: 28,
    Day29: 29,
    Day30: 30,
    Day31: 31,
  },
  {
    FullName: "Thứ",
    Day01: 1,
    Day02: 2,
    Day03: 3,
    Day04: 4,
    Day05: 5,
    Day06: 6,
    Day07: 7,
    Day08: 8,
    Day09: 9,
    Day10: 10,
    Day11: 11,
    Day12: 12,
    Day13: 13,
    Day14: 14,
    Day15: 15,
    Day16: 16,
    Day17: 17,
    Day18: 18,
    Day19: 19,
    Day20: 20,
    Day21: 21,
    Day22: 22,
    Day23: 23,
    Day24: 24,
    Day25: 25,
    Day26: 26,
    Day27: 27,
    Day28: 28,
    Day29: 29,
    Day30: 30,
    Day31: 31,
  },
];
export const yearLst = [
  {
    value: "2023",
  },
  {
    value: "2024",
  },
  {
    value: "2025",
  },
];

export function getWeekdays(weekdays) {
  switch (weekdays) {
    case 0:
      return "CN";
    case 1:
      return "T2";
    case 2:
      return "T3";
    case 3:
      return "T4";
    case 4:
      return "T5";
    case 5:
      return "T6";
    case 6:
      return "T7";
  }
}
export function checkContinualXDay(day, item, itemBefore, dayBefore) {
  var conti = 0;

  if (day > 6) {
    for (var be = 1; be <= 6; be++) {
      if (
        item[`Day` + `0${day - be}`.slice(-2)] == undefined ||
        item[`Day` + `0${day - be}`.slice(-2)] == "" ||
        item[`Day` + `0${day - be}`.slice(-2)] == "-" ||
        item[`Day` + `0${day - be}`.slice(-2)] == "--"
      ) {
        break;
      } else {
        conti++;
      }
    }
    for (var be = 1; be <= 6; be++) {
      if (
        item[`Day` + `0${day + be}`.slice(-2)] == undefined ||
        item[`Day` + `0${day + be}`.slice(-2)] == "" ||
        item[`Day` + `0${day + be}`.slice(-2)] == "-" ||
        item[`Day` + `0${day + be}`.slice(-2)] == "--"
      ) {
        break;
      } else {
        conti++;
      }
    }
  } else {
    if (itemBefore) {
      for (var be = 1; be <= 6; be++) {
        if (day > be) {
          if (
            item[`Day` + `0${day - be}`.slice(-2)] == undefined ||
            item[`Day` + `0${day - be}`.slice(-2)] == "" ||
            item[`Day` + `0${day - be}`.slice(-2)] == "-" ||
            item[`Day` + `0${day - be}`.slice(-2)] == "--"
          ) {
            break;
          } else {
            conti++;
          }
        } else {
          if (
            itemBefore[`Day` + `0${dayBefore + day - be}`.slice(-2)] ==
              undefined ||
            itemBefore[`Day` + `0${dayBefore + day - be}`.slice(-2)] == "" ||
            itemBefore[`Day` + `0${dayBefore + day - be}`.slice(-2)] == "-" ||
            itemBefore[`Day` + `0${dayBefore + day - be}`.slice(-2)] == "--"
          ) {
            break;
          } else {
            conti++;
          }
        }
      }
      for (var be = 1; be <= 6; be++) {
        if (
          item[`Day` + `0${day + be}`.slice(-2)] == undefined ||
          item[`Day` + `0${day + be}`.slice(-2)] == "" ||
          item[`Day` + `0${day + be}`.slice(-2)] == "-" ||
          item[`Day` + `0${day + be}`.slice(-2)] == "--"
        ) {
          break;
        } else {
          conti++;
        }
      }
    } else {
      for (var be = 1; be <= 6; be++) {
        if (
          item[`Day` + `0${day - be}`.slice(-2)] == undefined ||
          item[`Day` + `0${day - be}`.slice(-2)] == "" ||
          item[`Day` + `0${day - be}`.slice(-2)] == "-" ||
          item[`Day` + `0${day - be}`.slice(-2)] == "--"
        ) {
          break;
        } else {
          conti++;
        }
      }
      for (var be = 1; be <= 6; be++) {
        if (
          item[`Day` + `0${day + be}`.slice(-2)] == undefined ||
          item[`Day` + `0${day + be}`.slice(-2)] == "" ||
          item[`Day` + `0${day + be}`.slice(-2)] == "-" ||
          item[`Day` + `0${day + be}`.slice(-2)] == "--"
        ) {
          break;
        } else {
          conti++;
        }
      }
    }
  }

  return conti;
}
