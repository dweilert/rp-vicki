/* RP Discoverer — rpdiscoverer.com
   Plain browser JS, no build step, no dependencies. */

(function () {
    "use strict";

    var yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    /* ---------------------------------------------------------------
       Signup / information-request form.

       There is no collection backend yet, on purpose: the site is static
       and nothing here should pretend to store an address it cannot store.
       So the form has two modes.

       1. No endpoint configured (today). Submitting hands the visitor a
          prefilled mailto: so the request still reaches a human, and the
          status line says plainly that nothing was stored.

       2. Endpoint configured (later). Set RP_SIGNUP_ENDPOINT in
          config.js to an HTTPS URL — the planned shape is API Gateway ->
          Lambda -> DynamoDB in the same account as the Amplify app — and
          this posts JSON to it instead. See infra/README.md.

       Nothing below is a substitute for the consent and unsubscribe
       handling a real mailing list needs; that belongs with the backend
       when it exists.
       --------------------------------------------------------------- */

    var CONTACT_EMAIL = "support@softwarebydaw.com";

    var form = document.getElementById("signup-form");
    var statusEl = document.getElementById("signup-status");
    if (!form || !statusEl) {
        return;
    }

    function setStatus(kind, message) {
        statusEl.className = "form-status show " + kind;
        statusEl.textContent = message;
    }

    function mailtoFallback(data) {
        var subject = "RP Discoverer — information request";
        var body =
            "Email: " + data.email + "\n" +
            "Name: " + (data.name || "(not given)") + "\n" +
            "Interested in: " + data.interest + "\n\n" +
            (data.note || "");
        return (
            "mailto:" + CONTACT_EMAIL +
            "?subject=" + encodeURIComponent(subject) +
            "&body=" + encodeURIComponent(body)
        );
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Honeypot: a filled hidden field means a bot. Say nothing useful.
        if (form.elements.company && form.elements.company.value) {
            setStatus("ok", "Thanks — we'll be in touch.");
            return;
        }

        var email = form.elements.email.value.trim();
        if (!email || email.indexOf("@") < 1 || email.indexOf(".") < 0) {
            setStatus("err", "That email address doesn't look right. Check it and try again.");
            form.elements.email.focus();
            return;
        }

        var data = {
            email: email,
            name: form.elements.name.value.trim(),
            interest: form.elements.interest.value,
            note: form.elements.note.value.trim(),
            source: "rpdiscoverer.com"
        };

        var endpoint = window.RP_SIGNUP_ENDPOINT;

        if (!endpoint) {
            var link = mailtoFallback(data);
            setStatus(
                "info",
                "The signup list isn't live yet, so nothing was stored. Your mail app should " +
                "open with the message ready to send — if it didn't, write to " + CONTACT_EMAIL + "."
            );
            window.location.href = link;
            return;
        }

        var button = form.querySelector("button[type=submit]");
        if (button) {
            button.disabled = true;
        }
        setStatus("info", "Sending…");

        fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("HTTP " + response.status);
                }
                form.reset();
                setStatus("ok", "You're on the list. Watch for the next release note.");
            })
            .catch(function () {
                setStatus(
                    "err",
                    "That didn't go through. Try again, or write to " + CONTACT_EMAIL + "."
                );
            })
            .then(function () {
                if (button) {
                    button.disabled = false;
                }
            });
    });
})();
