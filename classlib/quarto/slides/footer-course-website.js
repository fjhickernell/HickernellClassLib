(function () {
  function getCourseWebsite() {
    const el = document.getElementById("course-website-meta");
    if (!el) return "";
    try {
      const obj = JSON.parse(el.textContent || "{}");
      return (obj.course_website || "").trim();
    } catch {
      return "";
    }
  }

  function ensureFooterLinkBehavior() {
    const link = document.getElementById("fh-course-website");
    if (!link) return;

    const url = getCourseWebsite();

    // Keep href synced (Reveal/Quarto can re-render parts on navigation)
    if (url) {
      link.setAttribute("href", url);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
    } else {
      link.setAttribute("href", "#");
    }

    // Install click handler once
    if (link.dataset.fhBound === "1") return;
    link.dataset.fhBound = "1";

    link.addEventListener(
      "click",
      function (e) {
        // Stop Reveal from treating this as slide navigation
        e.preventDefault();
        e.stopPropagation();
        if (typeof e.stopImmediatePropagation === "function") {
          e.stopImmediatePropagation();
        }

        const finalUrl = getCourseWebsite();
        if (finalUrl) {
          window.open(finalUrl, "_blank", "noopener");
        }
      },
      true
    );
  }

  function hookReveal() {
    if (window.Reveal && typeof window.Reveal.on === "function") {
      window.Reveal.on("ready", ensureFooterLinkBehavior);
      window.Reveal.on("slidechanged", ensureFooterLinkBehavior);
      window.Reveal.on("fragmentshown", ensureFooterLinkBehavior);
      window.Reveal.on("fragmenthidden", ensureFooterLinkBehavior);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      hookReveal();
      ensureFooterLinkBehavior();
    });
  } else {
    hookReveal();
    ensureFooterLinkBehavior();
  }
})();