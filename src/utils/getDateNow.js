module.exports = function getDateNow() {
  const d = new Date();
  return (
    d.getFullYear().toString().padStart(4, "0") +
    "-" +
    d.getMonth().toString().padStart(2, "0") +
    "-" +
    d.getDate().toString().padStart(2, "0")
  );
};
