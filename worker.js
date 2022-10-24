// Class FileProcessor
// This class processes data readed from a cvs file and generate two arrays with the readed data
// it is designed to work from a Worker, when finishes postMessage to the worker caller with the generated arrays
// Inputs:
//    readedData: content of the file
// Outputs:
//    data: Two dimensional array with the content of the file split (in rows and columns).
//    totalRow: One dimensional array with the sum of the columns of the readed data.
class FileProcessor {
  constructor(readedData, port) {
    this.readedData = readedData;
    this.port = port;
    this.data = [];
    this.totalRow = [];
    this.numberOfColumns = 0;
  }

  // main method of the class, it generates both arrays: data matrix and total array.
  processFile() {
    try {
      let lines = this.readedData.split('\r\n');
      if (lines.length === 1) {
        lines = this.readedData.split('\n');
      }
      this.splitLinesIntoColumns(lines);
      if (this.data && this.data[0] && this.data[0][0] && this.data[0][0].trim() === '') this.data[0][0] = 'Item';
      this.totalRow = this.totalizeColumns();
      this.port.postMessage({ error: false, data: this.data, totalRow: this.totalRow });
    } catch (e) {
      this.handleError(e);
    }
  }

  splitLinesIntoColumns(lines) {
    try {
      let lineCount = 0;
      lines.forEach((line) => {
        if (line && line.trim() === '') {
          this.port.postMessage({ error: true, data: `File line ${lineCount} is empty and was not rendered, ` });
        }
        const columns = line.split(',');
        this.validate(columns, lineCount);
        lineCount++;
      });
    } catch (e) {
      this.handleError();
    }
  }

  // I make some validation rules to determine if add line to table or not
  validate(columns, lineCount) {
    if (columns.length > 50) {
      this.data.clear();
      this.port.postMessage({ error: true, data: 'Critical Error file not rendered, max number of columns is 50' });
      throw new Error('max number of columns is 50');
    }
    if (columns.length === 0) {
      this.port.postMessage({ error: true, data: `File line ${lineCount} was not rendered, it has zero columns` });
      return false;
    }
    if (lineCount === 0) { // is the first line
      this.numberOfColumns = columns.length;
      this.data.push(columns);
    } else if (columns.length !== this.numberOfColumns) {
      if (!(columns.length === 1 && columns[0].trim() === '')) {
        this.port.postMessage({ error: true, data: `File line ${lineCount} was not rendered, it has a different number of columns than the first line` });
      }
    } else {
      this.data.push(columns);
    }
    return true;
  }

  // returns the sum Vector
  totalizeColumns() {
    try {
      const firstRow = this.data.shift();
      const result = this.data.reduce((r, a) => {
        a.forEach((b, i) => {
          const readedNumber = Number.isNaN(Number(b.trim())) ? 0 : Math.round(Number(b.trim()));
          r[i] = (r[i] || 0) + readedNumber;
        });
        return r;
      }, []);
      if (result[0] !== undefined) {
        result[0] = 'Total';
      }
      this.data.unshift(firstRow);
      return result;
    } catch (e) {
      this.handleError(e);
      return 0;
    }
  }

  handleError(error) {
    throw error;
  }
}

self.onmessage = function onMessage(tblob) {
  const fileReader = new FileReader();
  fileReader.readAsText(tblob.data);
  fileReader.onload = function onLoad() {
    const processor = new FileProcessor(fileReader.result, tblob.ports[0]);
    processor.processFile(); // it post data to the worker caller
  };

  fileReader.onerror = function onError() {
    this.port.postMessage({ error: true, data: 'Error loading file' });
  };
};
