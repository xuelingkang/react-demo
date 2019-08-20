import React, {Component} from 'react';
import { Progress } from 'antd';
import Editor from 'for-editor';
import config from '@/config';
import { axiosPost } from '@/utils/axios';

const { notice } = config;

export default class extends Component {
    state = {
        timerId: null,
        progressVisible: false,
        progressPercent: 0
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
        const {upload} = this.props;
        const {action, name, maxSize, accepts, getUrl, success} = upload;
        if (!accepts.includes(file.type)) {
            notice.error(`文件类型必须是${accepts.join('、')}中的一种`);
            return;
        }
        if (file.size / 1024 /1024 > maxSize) {
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
        const timerId = setTimeout(() => {
            this.setState({
                progressVisible: false,
                timerId: null
            });
        }, 1000);
        this.setState({
            timerId
        });
    }
    render() {
        const {progressVisible, progressPercent} = this.state;
        const {addImg, ...otherProps} = this.props;
        return (
            <div>
                <Editor ref={this.$vm} addImg={this.handleAddImg} {...otherProps} />
                {progressVisible && <Progress type='circle' default='default' percent={progressPercent} style={this.progressStyle} />}
            </div>
        );
    }
}
