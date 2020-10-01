module.exports = function getTimeNow() {
  var data = new Date();
  
  let hour = data.getUTCHours() - 3;

  if (hour < 0) hour = hour + 24;

  return (
    hour.toString().padStart(2, "0") +
    ":" +
    data.getMinutes().toString().padStart(2, "0") +
    ":" +
    data.getSeconds().toString().padStart(2, "0")
  );
};
