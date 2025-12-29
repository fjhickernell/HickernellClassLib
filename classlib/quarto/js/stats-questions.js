(function () {
  const checkboxes = document.querySelectorAll('[data-filter]');
  const questions = document.querySelectorAll('.stats-q');

  function updateVisibility() {
    const active = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.dataset.filter);

    questions.forEach(q => {
      const courses = (q.dataset.course || "").split(/\s+/).filter(Boolean);
      const show = courses.some(c => active.includes(c));
      q.style.display = show ? '' : 'none';
    });

    const note = document.getElementById('filter-note');
    if (note) {
      note.textContent = (active.length === 0)
        ? 'No courses selected'
        : `Showing: ${active.join(', ')}`;
    }
  }

  checkboxes.forEach(cb => cb.addEventListener('change', updateVisibility));
  updateVisibility();
})();
