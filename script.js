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

const chatToggle = document.querySelector("[data-chat-toggle]");
const chatClose = document.querySelector("[data-chat-close]");
const chatPanel = document.querySelector("[data-chat-panel]");
const chatForm = document.querySelector("[data-chat-form]");
const chatMessages = document.querySelector("[data-chat-messages]");
const supportChatTrigger = document.querySelector(".support-chat-trigger");

function setChatOpen(isOpen) {
  chatPanel.hidden = !isOpen;
  chatToggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    chatForm.elements.message.focus();
  }
}

function appendMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  chatMessages.append(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getBotReply(text) {
  const normalized = text.toLowerCase();

  if (normalized.includes("size") || normalized.includes("cỡ") || normalized.includes("kg")) {
    return "Bạn cho mình chiều cao, cân nặng và kiểu mặc thích gọn hay rộng nhé. Gợi ý nhanh: 59-67kg thường hợp M, 68-76kg thường hợp L.";
  }

  if (normalized.includes("đổi") || normalized.includes("trả") || normalized.includes("60")) {
    return "CoolMate hỗ trợ đổi trả 60 ngày không cần lý do. Bạn có thể đổi size, đổi màu hoặc trả nếu sản phẩm chưa phù hợp.";
  }

  if (normalized.includes("giá") || normalized.includes("ưu đãi") || normalized.includes("mua")) {
    return "Ưu đãi hè đang chạy trong thời gian giới hạn. Bạn có thể bấm “Chọn size ngay” ở cuối trang để xem giá và màu còn hàng.";
  }

  if (normalized.includes("vải") || normalized.includes("mồ hôi") || normalized.includes("mùi")) {
    return "Áo dùng cấu trúc vải thoát ẩm đa chiều, giúp kéo mồ hôi khỏi da nhanh hơn và hạn chế cảm giác bết dính sau khi tập.";
  }

  return "Mình đã nhận câu hỏi. Bạn có thể hỏi về size, chất liệu, ưu đãi hoặc đổi trả; nếu cần người thật hỗ trợ, hãy để lại số điện thoại hoặc email.";
}

chatToggle.addEventListener("click", () => {
  setChatOpen(chatPanel.hidden);
});

chatClose.addEventListener("click", () => {
  setChatOpen(false);
});

supportChatTrigger.addEventListener("click", () => {
  setChatOpen(true);
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = chatForm.elements.message;
  const text = input.value.trim();

  if (!text) {
    return;
  }

  appendMessage(text, "user");
  input.value = "";

  window.setTimeout(() => {
    appendMessage(getBotReply(text), "bot");
  }, 350);
});

const revealItems = document.querySelectorAll("[data-reveal]");
const showcaseVideo = document.querySelector(".video-frame video");

const orderModal = document.querySelector("[data-order-modal]");
const orderModalCloseButtons = document.querySelectorAll("[data-order-modal-close]");
const orderTriggers = document.querySelectorAll("[data-order-trigger]");
const orderForm = document.querySelector("[data-order-form]");
const orderFormError = document.querySelector("[data-order-form-error]");
const orderFormSuccess = document.querySelector("[data-order-form-success]");
let lastActiveElement = null;

function setOrderModalOpen(isOpen) {
  if (!orderModal) {
    return;
  }

  if (isOpen) {
    lastActiveElement = document.activeElement;
    orderModal.hidden = false;
    document.body.style.overflow = "hidden";

    if (orderFormError) {
      orderFormError.hidden = true;
    }
    if (orderFormSuccess) {
      orderFormSuccess.hidden = true;
    }

    const firstFocusable = orderModal.querySelector(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) {
      firstFocusable.focus();
    }
    return;
  }

  orderModal.hidden = true;
  document.body.style.overflow = "";
  if (lastActiveElement && typeof lastActiveElement.focus === "function") {
    lastActiveElement.focus();
  }
}

if (orderModal && orderTriggers.length) {
  orderTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      setOrderModalOpen(true);
    });
  });

  orderModalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => setOrderModalOpen(false));
  });

  orderModal.addEventListener("click", (event) => {
    if (event.target === orderModal) {
      setOrderModalOpen(false);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !orderModal.hidden) {
      setOrderModalOpen(false);
    }
  });
}

if (orderForm) {
  orderForm.addEventListener("input", () => {
    if (orderFormError) {
      orderFormError.hidden = true;
    }
  });

  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!orderForm.checkValidity()) {
      if (orderFormSuccess) {
        orderFormSuccess.hidden = true;
      }
      if (orderFormError) {
        orderFormError.hidden = false;
      }
      return;
    }

    if (orderFormError) {
      orderFormError.hidden = true;
    }
    if (orderFormSuccess) {
      orderFormSuccess.hidden = false;
    }

    orderForm.reset();
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
    revealObserver.observe(item);
  });

  if (showcaseVideo) {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const playResult = showcaseVideo.play();
            if (playResult && typeof playResult.catch === "function") {
              playResult.catch(() => { });
            }
          } else {
            showcaseVideo.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    videoObserver.observe(showcaseVideo);
  }
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));

  if (showcaseVideo) {
    // Fallback: keep video running if IntersectionObserver is unavailable.
  }
}
