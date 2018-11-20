import Base from './Base';

class View extends Base {
  static defaultProps = {
    style: {},
    wrap: true,
  };

  get name() {
    return 'View';
  }

  async render() {
    this.root.instance.save();
    this.applyTransformations();
    this.drawBackgroundColor();
    this.drawBorders();
    if (typeof this.props.render === 'function') {
      this.props.render(this.root);
    }
    await this.renderChildren();
    if (this.props.debug) this.debug();
    this.root.instance.restore();
  }
}

export default View;
