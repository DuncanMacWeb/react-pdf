import Base from './Base';

class View extends Base {
  static defaultProps = {
    style: {},
  };

  async render() {
    this.drawBackgroundColor();

    if (typeof this.props.render === 'function') {
      this.props.render(this.root);
    }

    await this.renderChildren();
  }
}

export default View;
