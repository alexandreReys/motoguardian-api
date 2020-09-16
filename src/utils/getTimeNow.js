module.exports = function getTimeNow() {
  var data = new Date();
  var fuso = data.getTimezoneOffset() / 60 - 3;
  data = new Date(data.valueOf() - (fuso * 3600000));
  return (
    data.getHours().toString().padStart(2, "0") +
    ":" +
    data.getMinutes().toString().padStart(2, "0") +
    ":" +
    data.getSeconds().toString().padStart(2, "0")
  );
};
