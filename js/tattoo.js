export function get_tattoo() {
  let svg = document.getElementById("git-grid");

  // one for each day of the week
  let arrs = [[], [], [], [], [], [], []];

  for (const [week_idx, week] of svg.childNodes.entries()) {
    for (const [weekday_idx, cell] of week.childNodes.entries()) {
      arrs[weekday_idx].push(cell.getAttribute("data-coloridx"));
    }
  }

  // remove the leftmost column
  return arrs.map(weekday => weekday.slice(1).join("")).join("|");
}
