import React, {Component} from 'react';
import { Progress } from 'antd';
import Editor from 'for-editor';
import CSSAnimate from 'components/CSSAnimate';
import { axiosPost } from '@/utils/axios';
import config from '@/config';

const { notice } = config;

export default class extends Component {
    state = {
        progressVisible: false,
        progressPercent: 0,
        progressAnimate: ''
    }
    constructor() {
        super();
        this.$vm = React.createRef();
    }
    componentWillUnmount() {
        const {timerId} = this.state;
        timerId && clearTimeout(timerId);
    }
    progressStyle = {
        position: 'fixed',
        top: document.body.offsetHeight/2-60,
        left: document.body.offsetWidth/2-60,
        zIndex: 999999
    }
    handleUploadProgress = event => {
        const percent = event.loaded / event.total * 100 | 0;
        this.setState({
            progressPercent: percent
        });
    }
    handleAddImg = async file => {
        const {upload={}} = this.props;
        const {action, name, getUrl, accepts, maxSize, success} = upload;
        if (!action || !name || !getUrl) {
            return;
        }
        if (accepts && !accepts.includes(file.type)) {
            notice.error(`文件类型必须是${accepts.join('、')}中的一种`);
            return;
        }
        if (maxSize && file.size / 1024 /1024 > maxSize) {
            notice.error(`文件不能大于${maxSize}M`);
            return;
        }
        this.setState({
            progressVisible: true,
            progressPercent: 0
        });
        const formData = new FormData();
        formData.append(name, file, file.name);
        const config = {
            headers: {'Content-Type': 'multipart/form-data'},
            onUploadProgress: this.handleUploadProgress
        };
        const {code, data} = await axiosPost(action, formData, config);
        if (code===200) {
            const url = getUrl(data);
            this.$vm.current.$img2Url(file.name, url);
            success && success(data);
        }
        this.setState({
            progressAnimate: 'fadeOut'
        });
    }
    handleProgressAnimate = () => {
        this.setState({
            progressVisible: false,
            progressAnimate: ''
        });
    }
    render() {
        const {progressVisible, progressPercent, progressAnimate} = this.state;
        const {addImg, upload, ...otherProps} = this.props;
        return (
            <div>
                <Editor ref={this.$vm} addImg={this.handleAddImg} {...otherProps} />
                {progressVisible &&
                    <CSSAnimate type={progressAnimate} callback={this.handleProgressAnimate} duration={500}>
                        <Progress type='circle' default='default' percent={progressPercent} style={this.progressStyle} />
                    </CSSAnimate>
                }
            </div>
        );
    }
}
