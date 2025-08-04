function getSelectedOptionsCheckbox(groupId) {
  return Array.from(document.querySelectorAll(`#${groupId} input[type='checkbox']:checked`)).map(cb => cb.value);
}

document.addEventListener('DOMContentLoaded', function() {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const course = courseInput.value.trim();
    if (!course) return;
    const platforms = getSelectedOptionsCheckbox('platforms-checkboxes');
    const formats = getSelectedOptionsCheckbox('formats-checkboxes');
    // ... rest of logic unchanged ...
}); 