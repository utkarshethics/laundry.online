(function () {
  "use strict";

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  /* ---------- Booking modal ---------- */
  var overlay = document.getElementById("bookingModal");
  var openers = document.querySelectorAll("[data-open-booking]");
  var closeBtns = document.querySelectorAll(".modal .close-btn");

  openers.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (overlay) overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  closeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      btn.closest(".modal-overlay").classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        overlay.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        overlay.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  }

  /* ---------- Booking coupon / submit ---------- */
  var couponBtn = document.getElementById("applyCoupon");
  var couponMsg = document.getElementById("couponMsg");
  var used = false;
  if (couponBtn) {
    couponBtn.addEventListener("click", function () {
      var inp = document.getElementById("coupon");
      var code = inp ? inp.value.trim().toUpperCase() : "";
      var ok = code === "LAUNDRY30";
      if (!used && ok) {
        used = true;
        if (couponMsg) { couponMsg.textContent = "Congratulations! 30% off applied."; couponMsg.style.color = "#12a150"; }
      } else if (!used) {
        if (couponMsg) { couponMsg.textContent = "Hmm, that code didn't work. Try LAUNDRY30."; couponMsg.style.color = "#d93025"; }
      }
    });
  }

  var bookForm = document.getElementById("bookForm");
  if (bookForm) {
    var PAY_LINK = "https://razorpay.com/payment-link/plink_TfrpceYFPIv3Ch";
    var payConfirm = document.getElementById("payConfirm");
    var payMsgEl = document.getElementById("payMsg");
    var payWindowOpened = false;

    bookForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (document.getElementById("name") || {}).value || "";
      var phone = (document.getElementById("phone") || {}).value || "";
      if (!name.trim() || phone.trim().length < 10) return;

      if (!payConfirm || !payConfirm.checked) {
        if (payMsgEl) {
          payMsgEl.style.color = "#d93025";
          payMsgEl.textContent =
            "Complete the ₹50 advance in the Razorpay window to place your order, then tick the box above and click again.";
        }
        if (!payWindowOpened) {
          payWindowOpened = true;
          window.open(PAY_LINK, "_blank", "noopener");
        }
        return;
      }

      var box = document.querySelector("#bookingModal .form-success") ||
        (function () {
          var d = document.createElement("div");
          d.className = "form-success";
          document.querySelector("#bookingModal .modal").appendChild(d);
          return d;
        })();
      box.style.display = "block";
      box.innerHTML =
        '<div class="tick"><svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>' +
        "<h3>Order Confirmed!</h3>" +
        '<p class="sub">Thanks ' + name.trim() + ", we've received your ₹50 advance. Our rider will call you on " + phone.trim() +
        " to confirm the pickup. Free pickup &amp; drop at your doorstep.</p>";
      var form = document.getElementById("bookForm");
      if (form) form.style.display = "none";
    });
  }

  /* ---------- Hero slider ---------- */
  var slides = document.querySelectorAll("[data-slide]");
  var dots = document.querySelectorAll("[data-dot]");
  var current = 0;
  if (slides.length) {
    function show(i) {
      slides.forEach(function (s, k) { s.classList.toggle("active", k === i); });
      if (dots.length) dots.forEach(function (d, k) { d.classList.toggle("active", k === i); });
    }
    slides[0].classList.add("active");
    if (dots.length) dots[0].classList.add("active");
    dots.forEach(function (d, k) {
      d.addEventListener("click", function () { current = k; show(current); });
    });
    setInterval(function () {
      current = (current + 1) % slides.length;
      show(current);
    }, 5000);
  }

  /* ---------- FAQ: keep one open ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.querySelector("summary").addEventListener("click", function (e) {
      e.preventDefault();
      var wasOpen = item.hasAttribute("open");
      faqItems.forEach(function (i) { i.removeAttribute("open"); });
      if (!wasOpen) item.setAttribute("open", "");
    });
  });

  /* ---------- Contact form ---------- */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById("contactNote");
      contactForm.querySelectorAll("input, select, textarea, button").forEach(function (el) { el.disabled = true; });
      if (note) {
        note.style.color = "#12a150";
        note.textContent = "Thanks! Your message has been sent — we'll get back to you shortly.";
      }
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();