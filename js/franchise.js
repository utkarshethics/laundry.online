/**
 * Franchise application form.
 *
 * Posts JSON to /api/franchise-lead, which validates server-side and files the
 * lead into the same leads-db CRM the Razorpay webhook writes to. Validation is
 * duplicated here purely to give faster feedback; the server is the authority.
 */
(function () {
  "use strict";

  var form = document.getElementById("franchiseForm");
  if (!form) return;

  var msg = document.getElementById("frMsg");
  var submit = document.getElementById("frSubmit");
  var CITY_VALUES = [
    "Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Chennai", "Pune",
    "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Indore", "Nagpur", "Other",
  ];

  function say(text, kind) {
    if (!msg) return;
    msg.textContent = text;
    msg.className = "fr-form-msg show " + (kind || "ok");
  }

  function clear() {
    if (msg) msg.className = "fr-form-msg";
  }

  /** Mirrors the server-side normalisePhone so both reject the same values. */
  function phoneDigits(raw) {
    var d = (raw || "").replace(/\D/g, "");
    if (d.length === 12 && d.indexOf("91") === 0) return d.slice(2);
    if (d.length === 11 && d.charAt(0) === "0") return d.slice(1);
    return d;
  }

  function validate() {
    var errors = [];
    var name = (form.name.value || "").trim();
    var phone = phoneDigits(form.phone.value);
    var email = (form.email.value || "").trim();
    var city = (form.city.value || "").trim();
    var capacity = (form.capacity.value || "").trim();

    if (name.length < 2) errors.push("Please enter your full name.");
    if (phone.length !== 10 || !/^[6-9]/.test(phone)) {
      errors.push("Enter a valid 10-digit Indian mobile number.");
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      errors.push("That email address does not look right.");
    }
    if (!city) errors.push("Select the city you want to open in.");
    if (!capacity) errors.push("Select your investment capacity.");

    return errors;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clear();

    var errors = validate();
    if (errors.length) {
      say(errors[0], "err");
      return;
    }

    var payload = {
      name: form.name.value,
      phone: form.phone.value,
      email: form.email.value,
      city: form.city.value,
      capacity: form.capacity.value,
      timeline: form.timeline.value,
      property: form.property.value,
      message: form.message.value,
      website: form.website.value,
    };

    submit.disabled = true;
    var original = submit.textContent;
    submit.textContent = "Submitting…";

    fetch("/api/franchise-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json().catch(function () {
          return { error: "Unexpected server response" };
        }).then(function (data) {
          return { ok: res.ok, status: res.status, data: data };
        });
      })
      .then(function (r) {
        // 202 is the endpoint's deliberate success-shaped response for honeypot
        // hits and rate-limited repeats, so it counts as received.
        if (r.ok && (r.status === 200 || r.status === 202)) {
          form.innerHTML =
            '<div class="form-success">' +
            '<div class="tick"><svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>' +
            "<h3>Application received</h3>" +
            '<p class="sub" style="text-align:center;color:var(--muted)">Our franchise team will call you within one working day with a location score for ' +
            escapeHtml(payload.city) +
            ". Reference <b>" +
            escapeHtml(r.data.id || "received") +
            "</b>.</p>" +
            "</div>";
          return;
        }

        if (r.status === 422 || r.status === 400) {
          say(r.data.error || "Please correct the highlighted fields and submit again.", "err");
          return;
        }
        if (r.status === 403) {
          say("This form can only be submitted from our own website. Please email franchise@laundry.online.", "err");
          return;
        }
        if (r.status === 500) {
          say("Something went wrong on our side. Please try again, or email franchise@laundry.online.", "err");
          return;
        }
        say("We could not submit your application. Please try again in a moment.", "err");
      })
      .catch(function () {
        say("Network error — we could not reach our server. Please check your connection and try again.", "err");
      })
      .then(function () {
        if (form.querySelector("button")) {
          submit.disabled = false;
          submit.textContent = original;
        }
      });
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Soft-dialer defence on the client: flags obviously synthetic entries so an
  // applicant is nudged to a real number rather than silently rejected later.
  var phone = form.phone;
  phone.addEventListener("blur", function () {
    var d = phoneDigits(phone.value);
    if (d.length === 10 && /^(\d)\1{9}$/.test(d)) {
      say("That number looks like a placeholder. Please enter the mobile number we should call you on.", "err");
    }
  });

  // The server owns the allowlist. If this copy drifts from the <select> or
  // from functions/api/franchise-lead.js, applicants get rejected for choosing
  // an option the page itself offered, so fail loudly rather than silently.
  (function guardCityList() {
    var offered = Array.prototype.slice
      .call(form.city.options, 1)
      .map(function (o) { return o.value; });
    var missing = CITY_VALUES.filter(function (c) { return offered.indexOf(c) === -1; });
    var extra = offered.filter(function (c) { return CITY_VALUES.indexOf(c) === -1; });
    if (missing.length || extra.length) {
      console.error(
        "Franchise city list out of sync with the server allowlist.",
        { missingFromSelect: missing, notInAllowlist: extra }
      );
    }
  })();
})();