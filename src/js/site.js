/* Austin Area Firewise Alliance — rpdiscoverer.com
   Plain browser JS, no build step, no dependencies. */

(function () {
    "use strict";

    var yearEl = document.getElementById("year");
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    /* ---------------------------------------------------------------
       Signup / question form.

       Three states, in order of preference:

       1. AAFA_SIGNUP_ENDPOINT set  -> POST JSON to it.
       2. Only AAFA_CONTACT_EMAIL set -> open a prefilled mailto and say
          plainly that nothing was stored.
       3. Neither set (today) -> say the form is not connected yet and
          point at the official agency channels, which are always live.

       State 3 exists because this is a wildfire site. Someone with an
       urgent question must never be left believing a message was sent when
       nothing received it. That is also why the form never claims to be a
       way to report a fire — the markup says so above the fields.

       None of this substitutes for the consent and unsubscribe handling a
       real mailing list needs; that belongs with the backend when it
       exists. See infra/README.md.
       --------------------------------------------------------------- */

    var form = document.getElementById("signup-form");
    var statusEl = document.getElementById("signup-status");
    if (!form || !statusEl) {
        return;
    }

    function setStatus(kind, html) {
        statusEl.className = "form-status show " + kind;
        statusEl.innerHTML = html;
    }

    function mailtoLink(email, data) {
        var subject = "Austin Area Firewise Alliance — " + data.interest;
        var body =
            "Email: " + data.email + "\n" +
            "Name: " + (data.name || "(not given)") + "\n" +
            "Area: " + (data.area || "(not given)") + "\n" +
            "About: " + data.interest + "\n\n" +
            (data.note || "");
        return (
            "mailto:" + email +
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
            area: form.elements.area ? form.elements.area.value.trim() : "",
            interest: form.elements.interest.value,
            note: form.elements.note.value.trim(),
            source: "rpdiscoverer.com"
        };

        var endpoint = window.AAFA_SIGNUP_ENDPOINT;
        var contact = window.AAFA_CONTACT_EMAIL;

        if (!endpoint) {
            if (contact) {
                setStatus(
                    "info",
                    "The signup list isn't running yet, so nothing was stored here. Your mail app " +
                    "should have opened with the message ready to send — if it didn't, write to " +
                    "<a href=\"mailto:" + contact + "\">" + contact + "</a>."
                );
                window.location.href = mailtoLink(contact, data);
            } else {
                setStatus(
                    "info",
                    "This form isn't connected yet — nothing was stored and nothing was sent. " +
                    "For anything time-sensitive, use the official channels: call 911 for a fire, " +
                    "register at <a class=\"ext\" href=\"https://warncentraltexas.org/\" " +
                    "rel=\"noopener\">Warn Central Texas</a> for alerts, or contact your local fire " +
                    "department or Emergency Services District."
                );
            }
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
                setStatus("ok", "Got it. Watch for a confirmation email — the list only adds you once you click the link in it.");
            })
            .catch(function () {
                setStatus(
                    "err",
                    "That didn't go through. Try again in a moment." +
                    (contact ? " Or write to <a href=\"mailto:" + contact + "\">" + contact + "</a>." : "")
                );
            })
            .then(function () {
                if (button) {
                    button.disabled = false;
                }
            });
    });
})();
