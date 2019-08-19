import React, {Component} from 'react';
import Editor from 'for-editor';

export default class extends Component {
    constructor() {
        super();
        this.$vm = React.createRef();
    }
    addImg = file => {
        const {addImg} = this.props;
        addImg && addImg(this.$vm, file);
    }
    render() {
        const {addImg, ...otherProps} = this.props;
        return <Editor ref={this.$vm} addImg={this.addImg} {...otherProps} />;
    }
}
