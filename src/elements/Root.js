import PDFDocument from '@react-pdf/pdfkit';

class Root {
  constructor({ Yoga } = {}) {
    if (!Yoga) {
      throw new Error('Must provide Yoga object to Root constructor');
    }
    this.Yoga = Yoga;
    this.isDirty = false;
    this.document = null;
    this.instance = null;
  }

  get name() {
    return 'Root';
  }

  appendChild(child) {
    this.document = child;
  }

  removeChild() {
    this.document = null;
  }

  markDirty() {
    this.isDirty = true;
  }

  async render() {
    this.instance = new PDFDocument({ autoFirstPage: false });
    await this.document.render();
    this.isDirty = false;
  }
}

export default Root;
