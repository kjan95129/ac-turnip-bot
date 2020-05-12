const moment = require("moment");

const today =
  "" +
  moment()
    .startOf("day")
    .toString();

function sortByPrice(data) {
  let turnipData = data.history;
  let byPrice = turnipData.slice(0);
  byPrice.sort(function(a, b) {
    return b.price - a.price;
  });

  return formatTurnipDataAll(byPrice);
}

function sortByTime(data, user) {
  let turnipData = data.history
  let byTime = turnipData.slice(0);
  byTime.sort(function(a, b) {
    return b.price - a.price;
  });

  return formatTurnipDataUser(byTime, user);
}

function formatTurnipDataAll(data) {
  return `Here are today's turnip prices:
  ${data.map(row => {
    return `\nPrice: ${row.price} -- User: ${row.user} -- Updated: ${moment(
      row.timestamp * 1000
    ).format("LLLL")}`;
  })}
  `;
}

function formatTurnipDataUser(data, user) {
  return `Here are ${user}'s turnip prices:
  ${data.map(row => {
    return `\nPrice: ${row.price} -- User: ${user} -- Updated: ${moment(
      row.timestamp * 1000
    ).format("LLLL")}`;
  })}
  `;
}

module.exports = {
  today: today,
  sortByPrice: sortByPrice,
  sortByTime: sortByTime,
  formatTurnipDataAll: formatTurnipDataAll,
  formatTurnipDataUser: formatTurnipDataUser,
};
