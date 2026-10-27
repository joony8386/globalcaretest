/**
 * Global Care — light UI enhancements
 * Mobile nav + contact form UX (frontend only)
 */
(function () {
  "use strict";

  /* ----- Mobile navigation ----- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("#site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.textContent = "Menu";
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
        toggle.focus();
      }
    });
  }

  /* ----- Contact / inquiry forms (static demo) ----- */
  document.querySelectorAll("form[data-demo-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var success = form.querySelector(".form-success");
      if (success) {
        success.classList.add("is-visible");
        success.setAttribute("role", "status");
      }

      form.reset();

      if (success) {
        success.focus && success.focus();
        success.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  });

  /* ----- Current year in footer ----- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();

  /* ----- Interactive OR showroom hotspots ----- */
  (function initOrShowroom() {
    var root = document.querySelector("[data-or-showroom]");
    if (!root) return;

    var hotspots = Array.prototype.slice.call(root.querySelectorAll("[data-or-id]"));
    var panel = document.getElementById("or-panel");
    var backdrop = document.getElementById("or-panel-backdrop");
    if (!panel || !backdrop) return;

    var titleEl = panel.querySelector("[data-or-title]");
    var bodyEl = panel.querySelector("[data-or-body]");
    var ctaEl = panel.querySelector("[data-or-cta]");
    var closeBtn = panel.querySelector("[data-or-close]");
    var lastFocus = null;

    var items = {
      scrub: {
        title: "Scrub sink",
        body: "A full scrub station sets the tone for OR protocol—so product trials feel like a clinical environment, not a conference booth.",
        cta: "Book a showroom visit",
        href: "../contact.html?interest=showroom"
      },
      carm: {
        title: "C-arm",
        body: "Mobile imaging support for procedure simulation—useful when you want to walk through implant placement under fluoroscopy-style guidance.",
        cta: "Book a showroom visit",
        href: "../contact.html?interest=showroom"
      },
      table: {
        title: "Operating table · spine trainer",
        body: "Aldaver spine surgical training dummy staged on the table for prone lumbar technique practice during Innovation Lab visits—positioning, access, and implant workflow review on a clinical OR bed.",
        cta: "Book a showroom visit",
        href: "../contact.html?interest=showroom",
        images: [
          { src: "../assets/or-whiteboard/spine-dummy-3d.jpg", alt: "Aldaver spine surgical training dummy (skin on) on black tray" }
        ]
      },
      light: {
        title: "Surgical light",
        body: "High-visibility lighting for demos—so instrument detail, surface finish, and tray layout are easy to evaluate up close.",
        cta: "Book a showroom visit",
        href: "../contact.html?interest=showroom"
      },
      instruments: {
        title: "Instrument set case",
        body: "Open instrument case staged on the back table—hand instruments and cannulas for technique review during a showroom visit.",
        cta: "Book a showroom visit",
        href: "../contact.html?interest=showroom",
        zoom: {
          src: "../assets/or-whiteboard/instrument-case-web.jpg",
          alt: "Open surgical instrument case with hand instruments",
          eyebrow: "Showroom station",
          title: "Instrument set case",
          text: "Sterile-layout case with handled instruments and cannulas for hands-on review. Tap close or press Esc to return to the OR map."
        }
      },
      whiteboard: {
        title: "Novel product implementation for market research",
        body: "Case imaging on the showroom whiteboard—coronal, sagittal, and axial views used to discuss novel product implementation and gather surgeon feedback for market research.",
        cta: "Book a showroom visit",
        href: "../contact.html?interest=showroom",
        images: [
          { src: "../assets/or-whiteboard/ct-coronal-web.jpg", alt: "Coronal CT view for market research discussion" },
          { src: "../assets/or-whiteboard/ct-sagittal-web.jpg", alt: "Sagittal CT view for market research discussion" },
          { src: "../assets/or-whiteboard/ct-axial-web.jpg", alt: "Axial CT view for market research discussion" }
        ]
      },
      endoscope: {
        title: "4K Endoscopic Camera System",
        body: "4K endoscopic visualization tower staged on the right of the operating table (former anesthesia station)—monitor, camera and light modules on a mobile cart for hands-on review during Innovation Lab visits.",
        cta: "Book a showroom visit",
        href: "../contact.html?interest=showroom",
        images: [
          { src: "../assets/or-whiteboard/endoscope-tower-3d.jpg", alt: "3D render of the 4K Endoscopic Camera System" }
        ]
      },
      cabinet: {
        title: "Implant / supply cabinet",
        body: "Global Care implant samples on display. Browse families on the shelf, then pull specific systems for a closer look on the table.",
        cta: "Browse product families",
        href: "../products.html"
      },
      entrance: {
        title: "OR entrance",
        body: "Showroom visits are by appointment at our Bangkok office. Request a time, tell us your specialty, and we’ll confirm logistics.",
        cta: "Schedule a session",
        href: "../contact.html?interest=showroom"
      }
    };

    function setExpanded(id, open) {
      hotspots.forEach(function (btn) {
        var match = btn.getAttribute("data-or-id") === id;
        btn.setAttribute("aria-expanded", match && open ? "true" : "false");
      });
    }

    var zoomEl = document.getElementById("or-zoom");
    var zoomImg = zoomEl ? zoomEl.querySelector("[data-or-zoom-img]") : null;

    function openZoom(data, trigger) {
      if (!zoomEl || !data.zoom) return;
      lastFocus = trigger || document.activeElement;
      zoomImg.src = data.zoom.src;
      zoomImg.alt = data.zoom.alt || "";
      zoomEl.querySelector("[data-or-zoom-eyebrow]").textContent = data.zoom.eyebrow || "Showroom station";
      zoomEl.querySelector("[data-or-zoom-title]").textContent = data.zoom.title || data.title;
      zoomEl.querySelector("[data-or-zoom-text]").textContent = data.zoom.text || data.body;
      zoomEl.hidden = false;
      zoomEl.setAttribute("aria-hidden", "false");
      zoomEl.classList.add("is-open");
      document.body.style.overflow = "hidden";
      setExpanded("instruments", true);
      window.setTimeout(function () {
        var close = zoomEl.querySelector("[data-or-zoom-close]");
        if (close) close.focus();
      }, 40);
    }

    function closeZoom() {
      if (!zoomEl || zoomEl.hidden) return;
      zoomEl.classList.remove("is-open");
      zoomEl.hidden = true;
      zoomEl.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      setExpanded(null, false);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    if (zoomEl) {
      zoomEl.querySelectorAll("[data-or-zoom-close]").forEach(function (btn) {
        btn.addEventListener("click", closeZoom);
      });
    }

    function openPanel(id, trigger) {
      var data = items[id];
      if (!data) return;

      if (data.zoom) {
        openZoom(data, trigger);
        return;
      }

      lastFocus = trigger || document.activeElement;
      titleEl.textContent = data.title;
      bodyEl.textContent = data.body;
      ctaEl.textContent = data.cta;
      ctaEl.setAttribute("href", data.href);

      var mediaEl = panel.querySelector("[data-or-media]");
      if (mediaEl) {
        mediaEl.innerHTML = "";
        if (data.images && data.images.length) {
          mediaEl.hidden = false;
          data.images.forEach(function (img) {
            var el = document.createElement("img");
            el.src = img.src;
            el.alt = img.alt || "";
            el.loading = "lazy";
            mediaEl.appendChild(el);
          });
        } else {
          mediaEl.hidden = true;
        }
      }

      panel.classList.add("is-open");
      backdrop.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
      backdrop.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setExpanded(id, true);

      window.setTimeout(function () {
        closeBtn.focus();
      }, 40);
    }

    function closePanel() {
      if (!panel.classList.contains("is-open")) return;
      panel.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
      backdrop.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      setExpanded(null, false);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    hotspots.forEach(function (btn) {
      btn.addEventListener("click", function () {
        openPanel(btn.getAttribute("data-or-id"), btn);
      });
    });

    closeBtn.addEventListener("click", closePanel);
    backdrop.addEventListener("click", closePanel);

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (zoomEl && !zoomEl.hidden) {
        e.preventDefault();
        closeZoom();
        return;
      }
      if (panel.classList.contains("is-open")) {
        e.preventDefault();
        closePanel();
      }
    });

    panel.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !panel.classList.contains("is-open")) return;
      var focusables = panel.querySelectorAll('a[href], button:not([disabled])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  })();

  /* ----- Product category carousels ----- */
  (function initCarousels() {
    var roots = Array.prototype.slice.call(document.querySelectorAll("[data-carousel]"));
    if (!roots.length) return;

    function pageStep(track) {
      var slide = track.querySelector(".carousel__slide");
      if (!slide) return track.clientWidth;
      var styles = window.getComputedStyle(track.querySelector(".carousel__track") || track);
      var gap = parseFloat(styles.columnGap || styles.gap) || 16;
      return slide.getBoundingClientRect().width + gap;
    }

    function maxScroll(track) {
      return Math.max(0, track.scrollWidth - track.clientWidth);
    }

    function currentIndex(track) {
      var step = pageStep(track);
      if (step <= 0) return 0;
      return Math.round(track.scrollLeft / step);
    }

    function pageCount(track) {
      var step = pageStep(track);
      if (step <= 0) return 1;
      return Math.max(1, Math.ceil((maxScroll(track) + step * 0.5) / step));
    }

    function initOne(root) {
      var track = root.querySelector("[data-carousel-track]");
      var prev = root.querySelector("[data-carousel-prev]");
      var next = root.querySelector("[data-carousel-next]");
      var dotsHost = root.querySelector("[data-carousel-dots]");
      var status = root.querySelector("[data-carousel-status]");
      var slides = Array.prototype.slice.call(root.querySelectorAll(".carousel__slide"));
      if (!track || !slides.length) return;

      var dots = [];
      var syncing = false;

      function scrollToIndex(index, behavior) {
        var step = pageStep(track);
        var left = Math.min(index * step, maxScroll(track));
        track.scrollTo({ left: left, behavior: behavior || "smooth" });
      }

      function updateUI() {
        var pages = pageCount(track);
        var idx = Math.min(currentIndex(track), pages - 1);
        var atStart = track.scrollLeft <= 2;
        var atEnd = track.scrollLeft >= maxScroll(track) - 2;

        if (prev) prev.disabled = atStart;
        if (next) next.disabled = atEnd;

        if (status) {
          status.textContent = "Showing " + (idx + 1) + " of " + pages;
        }

        if (dotsHost) {
          if (dots.length !== pages) {
            dotsHost.innerHTML = "";
            dots = [];
            for (var i = 0; i < pages; i++) {
              (function (page) {
                var btn = document.createElement("button");
                btn.type = "button";
                btn.className = "carousel__dot";
                btn.setAttribute("role", "tab");
                btn.setAttribute("aria-label", "Go to page " + (page + 1));
                btn.addEventListener("click", function () {
                  scrollToIndex(page);
                });
                dotsHost.appendChild(btn);
                dots.push(btn);
              })(i);
            }
          }
          dots.forEach(function (btn, i) {
            btn.setAttribute("aria-selected", i === idx ? "true" : "false");
          });
        }
      }

      if (prev) {
        prev.addEventListener("click", function () {
          scrollToIndex(Math.max(0, currentIndex(track) - 1));
        });
      }
      if (next) {
        next.addEventListener("click", function () {
          scrollToIndex(currentIndex(track) + 1);
        });
      }

      track.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          scrollToIndex(Math.max(0, currentIndex(track) - 1));
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          scrollToIndex(currentIndex(track) + 1);
        } else if (e.key === "Home") {
          e.preventDefault();
          scrollToIndex(0);
        } else if (e.key === "End") {
          e.preventDefault();
          scrollToIndex(pageCount(track) - 1);
        }
      });

      var scrollTimer = null;
      track.addEventListener("scroll", function () {
        if (scrollTimer) window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(updateUI, 60);
      }, { passive: true });

      window.addEventListener("resize", function () {
        if (syncing) return;
        syncing = true;
        window.requestAnimationFrame(function () {
          updateUI();
          syncing = false;
        });
      });

      updateUI();
    }

    roots.forEach(initOne);
  })();
