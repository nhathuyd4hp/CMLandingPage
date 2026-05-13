const endAt = new Date();
endAt.setDate(endAt.getDate() + 2);
endAt.setHours(23, 59, 59, 999);

const daysNode = document.querySelector("[data-days]");
const hoursNode = document.querySelector("[data-hours]");
const minutesNode = document.querySelector("[data-minutes]");
const secondsNode = document.querySelector("[data-seconds]");

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const distance = Math.max(0, endAt.getTime() - Date.now());
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);

  daysNode.textContent = pad(days);
  hoursNode.textContent = pad(hours);
  minutesNode.textContent = pad(minutes);
  secondsNode.textContent = pad(seconds);
}

updateCountdown();
window.setInterval(updateCountdown, 1000);
