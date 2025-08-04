// Platform to site mapping
const PLATFORM_SITES = {
  "Google Drive": "drive.google.com",
  "YouTube": "youtube.com",
  "Coursera": "coursera.org",
  "Mega": "mega.nz",
  "GitHub": "github.com",
  "PDF": null // Special case, not a site
};

// File format to filetype mapping
const FORMAT_TYPES = {
  "PDF": "pdf",
  "MP4": "mp4",
  "ZIP": "zip",
  "None": null
};

// Operator cycling logic
const OPERATORS = ["OR", "AND", "NONE"];

// Custom dropdown options
const PLATFORM_OPTIONS = [
  "Google Drive",
  "YouTube",
  "Coursera",
  "Mega",
  "GitHub",
  "PDF"
];
const FORMAT_OPTIONS = [
  "PDF",
  "MP4",
  "ZIP",
  "None"
];

function cycleOperator(current) {
  const idx = OPERATORS.indexOf(current);
  return OPERATORS[(idx + 1) % OPERATORS.length];
}

function getSelectedOptions(select) {
  return Array.from(select.selectedOptions).map(opt => opt.value).filter(Boolean);
}

function renderDropdown(containerId, options, selectedSet) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  options.forEach(option => {
    const btn = document.createElement('div');
    btn.className = 'dropdown-option' + (selectedSet.has(option) ? ' selected' : '');
    btn.textContent = option;
    btn.tabIndex = 0;
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-pressed', selectedSet.has(option));
    btn.addEventListener('click', () => {
      if (selectedSet.has(option)) {
        selectedSet.delete(option);
      } else {
        selectedSet.add(option);
      }
      renderDropdown(containerId, options, selectedSet);
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        btn.click();
      }
    });
    container.appendChild(btn);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('course-form');
  const courseInput = document.getElementById('course-input');
  const platformsSelect = document.getElementById('platforms-select');
  const formatsSelect = document.getElementById('formats-select');
  const output = document.getElementById('output');
  const queryBox = document.getElementById('generated-query');
  const copyBtn = document.getElementById('copy-btn');
  const searchBtn = document.getElementById('search-btn');
  const platformsOperatorBtn = document.getElementById('platforms-operator-btn');
  const formatsOperatorBtn = document.getElementById('formats-operator-btn');
  const courseOperatorBtn = document.getElementById('course-operator-btn');

  let platformsOperator = "OR";
  let formatsOperator = "OR";
  let courseOperator = "OR";

  platformsOperatorBtn.addEventListener('click', function() {
    platformsOperator = cycleOperator(platformsOperator);
    platformsOperatorBtn.textContent = platformsOperator;
  });

  formatsOperatorBtn.addEventListener('click', function() {
    formatsOperator = cycleOperator(formatsOperator);
    formatsOperatorBtn.textContent = formatsOperator;
  });

  courseOperatorBtn.addEventListener('click', function() {
    courseOperator = cycleOperator(courseOperator);
    courseOperatorBtn.textContent = courseOperator;
  });

  // Use Sets to track selected options
  const selectedPlatforms = new Set();
  const selectedFormats = new Set();

  renderDropdown('platforms-dropdown', PLATFORM_OPTIONS, selectedPlatforms);
  renderDropdown('formats-dropdown', FORMAT_OPTIONS, selectedFormats);

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const course = courseInput.value.trim();
    if (!course) return;
    const platforms = Array.from(selectedPlatforms);
    const formats = Array.from(selectedFormats);

    // Build course part
    let courseJoiner = courseOperator === "NONE" ? " " : ` ${courseOperator} `;
    const coursePart = `("${course} course"${courseJoiner}"${course} tutorial"${courseJoiner}"${course}")`;

    // Build platform part
    let platformJoiner = platformsOperator === "NONE" ? " " : ` ${platformsOperator} `;
    const siteParts = platforms
      .map(p => PLATFORM_SITES[p] ? `site:${PLATFORM_SITES[p]}` : null)
      .filter(Boolean);
    const platformPart = siteParts.length ? `(${siteParts.join(platformJoiner)})` : '';

    // Build filetype part
    let formatJoiner = formatsOperator === "NONE" ? " " : ` ${formatsOperator} `;
    const filetypeParts = formats
      .map(f => FORMAT_TYPES[f] ? `filetype:${FORMAT_TYPES[f]}` : null)
      .filter(Boolean);
    const filetypePart = filetypeParts.length ? `(${filetypeParts.join(formatJoiner)})` : '';

    // Combine parts using the operator before each section (except the first non-empty)
    const sections = [
      { part: coursePart, op: courseOperator },
      { part: platformPart, op: platformsOperator },
      { part: filetypePart, op: formatsOperator }
    ];
    let query = '';
    let first = true;
    for (const section of sections) {
      if (section.part) {
        if (!first) {
          let op = section.op === 'NONE' ? ' ' : ` ${section.op} `;
          query += op;
        }
        query += section.part;
        first = false;
      }
    }

    // Show output
    queryBox.textContent = query;
    output.style.display = 'block';

    // Set Google search link
    const encoded = encodeURIComponent(query);
    searchBtn.href = `https://www.google.com/search?q=${encoded}`;
  });

  copyBtn.addEventListener('click', function() {
    const text = queryBox.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = 'Copy Query';
      }, 1200);
    });
  });
}); 