module.exports = function getDateNow() {
  const d = new Date();
  const m = d.getMonth() + 1;
  return (
    d.getFullYear().toString().padStart(4, "0") +
    "-" +
    m.toString().padStart(2, "0") +
    "-" +
    d.getDate().toString().padStart(2, "0")
  );
};
