/**
 * R0 print spike: A4 two-column Modern Split shell (no live data).
 */
export default function ModernSplitSpike() {
  return (
    <div class="resume-doc">
      <div class="resume-doc__page">
        <div class="resume-doc__split">
          <aside class="resume-doc__sidebar" aria-label="Resume sidebar">
            <h1 class="resume-doc__name">Your Name</h1>
            <p class="resume-doc__title">Job Title</p>
            <p class="resume-doc__placeholder">Contact · Skills · Education</p>
          </aside>
          <div class="resume-doc__main" aria-label="Resume main">
            <p class="resume-doc__placeholder">Summary · Experience · Projects</p>
          </div>
        </div>
      </div>
    </div>
  );
}
