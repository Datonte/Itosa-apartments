// Litepicker date-range picker initialization.
// Litepicker is loaded via CDN on the pages that need it:
//   <script src="https://cdn.jsdelivr.net/npm/litepicker/dist/litepicker.js"></script>

import { expandRange, todayIso } from "./utils/date.js";

export function initRangePicker({
  inputEl,
  startInput,
  endInput,
  blockedRanges = [],
  onSelect = () => {},
  minDate = todayIso()
}) {
  if (!window.Litepicker) {
    console.error("[calendar] Litepicker not loaded");
    return null;
  }

  const lockDays = blockedRanges.flatMap((r) => expandRange(r.start, r.end));

  const picker = new window.Litepicker({
    element: inputEl,
    singleMode: false,
    numberOfMonths: 2,
    numberOfColumns: 2,
    minDate,
    minDays: 1,
    autoApply: true,
    format: "MMM D, YYYY",
    lockDays,
    tooltipText: { one: "night", other: "nights" },
    setup: (p) => {
      p.on("selected", (start, end) => {
        const a = start && start.format("YYYY-MM-DD");
        const b = end && end.format("YYYY-MM-DD");
        if (startInput) startInput.value = a || "";
        if (endInput) endInput.value = b || "";
        onSelect(a, b);
      });
    }
  });

  return picker;
}
