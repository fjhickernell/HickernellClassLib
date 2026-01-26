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

  function setFooterLink() {
    const link = document.getElementById("fh-course-website");
    if (!link) return;

    const url = getCourseWebsite();
    if (!url) return;

    link.href = url;
  }

  if (window.Reveal && typeof window.Reveal.on === "function") {
    window.Reveal.on("ready", setFooterLink);
    setFooterLink();
  } else {
    document.addEventListener("DOMContentLoaded", setFooterLink);
  }
})();

