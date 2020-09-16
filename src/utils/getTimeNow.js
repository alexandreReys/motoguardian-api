module.exports = function getTimeNow() {
  var data = new Date();
  const hour = data.getUTCHours() - 3;
  return (
    hour.toString().padStart(2, "0") +
    ":" +
    data.getMinutes().toString().padStart(2, "0") +
    ":" +
    data.getSeconds().toString().padStart(2, "0")
  );
};
