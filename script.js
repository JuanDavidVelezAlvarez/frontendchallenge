// I added an extra feature: ordering the table clicking the columns titles,
// this four constants are used for that extra feature
const ASC = 1;
const DESC = -1;
const ARROW_ASC = '\u2193';
const ARROW_DESC = '\u2191';

// Class TableRenderizer
// This class renders the data read from the cvs file
// Inputs:
//    data: Two-dimensional array with the information read from the file
//    totalRow: One-dimensional array with the sum of the columns (columns two to n) of data matrix.
//    htmlTable: id of the dom table that will be used to display the data
// Outputs:
//    Renders the data-table in the htmlTable component.

// **** Extra Features: Order rows clicking on the column title.
class TableRenderizer {
  constructor(data, totalRow, htmlTable) {
    this.data = data;
    this.totalRow = totalRow;
    this.htmlTable = htmlTable;
  }

  // Method to render the data. It is the main method of the class.
  render() {
    this.clearTable();
    this.data.forEach((rowData) => this.htmlTable.appendChild(this.renderRow(rowData)));
    this.htmlTable.appendChild(this.renderRow(this.totalRow));
    const titles = this.htmlTable.querySelectorAll('tr:first-of-type td');
    let i = 0;
    titles.forEach((title) => title.addEventListener('click', this.sort(i++))); // extra feature ordering
  }

  renderRow(rowData) {
    const row = document.createElement('tr');
    rowData.forEach((cellData) => {
      const cell = document.createElement('td');
      cell.appendChild(document.createTextNode(Number.isNaN(Number(cellData)) ? cellData : Math.round(cellData)));
      row.appendChild(cell);
    });
    return row;
  }

  clearTable() {
    this.htmlTable.querySelectorAll('tr').forEach((row) => row.remove());
  }

  // functions for the extra feature of table ordering
  sort(columnIndex) {
    return (() => {
      let titlesRow = this.data.shift();
      const orderDirection = titlesRow[columnIndex].includes(ARROW_ASC) ? DESC : ASC;
      this.data.sort(this.compare(columnIndex, orderDirection));
      titlesRow = titlesRow.map((title) => title.replace(ARROW_ASC, '').replace(ARROW_DESC, ''));
      titlesRow[columnIndex] += orderDirection === ASC ? ARROW_ASC : ARROW_DESC;
      this.data.unshift(titlesRow);
      this.render();
    });
  }

  compare(columnNumber, orderDirection) {
    return ((a, b) => {
      if (columnNumber === 0) {
        return (a[columnNumber] <= b[columnNumber] ? 1 * orderDirection : -1 * orderDirection);
      }
      return (Number(a[columnNumber]) <= Number(b[columnNumber]) ? 1 * orderDirection : -1 * orderDirection);
    });
  }
}

const csv = document.getElementById('csv');
const errdiv = document.getElementById('errors');
const worker = new Worker('worker.js');

const processFile = (blob) => new Promise((res, rej) => {
  const channel = new MessageChannel();
  channel.port1.onmessage = ({ data }) => {
    if (data.error) {
      const p = document.createElement('p');
      p.innerHTML = data.data;
      errdiv.appendChild(p);
    } else {
      channel.port1.close();
      if (data.data) {
        (new TableRenderizer(data.data, data.totalRow, document.getElementById('dataTable'))).render();
      }
      res(data);
    }
  };
  worker.postMessage(blob, [channel.port2]);
});

csv.onchange = async function csvOnChange() {
  errdiv.replaceChildren(); // remove error messages
  await processFile(this.files[0]);
};
