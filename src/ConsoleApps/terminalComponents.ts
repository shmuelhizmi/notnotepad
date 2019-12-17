export const makeTable = (items: string[][]) => {
  return (
    '<table class="bp3-html-table-bordered bp3-html-table bp3-interactive" style="width:100%">' +
    items.map(row => {
      return (
        "<tr>" +
        row.map(col => {
          return "<td>" + col + "</td>";
        }) +
        "</tr>"
      );
    }) +
    "</table>"
  );
};
export const makeIcon = (icon: string, size = 25) => {
  return '<span class="bp3-icon-' + size + " bp3-icon-" + icon + '"></span>';
};
