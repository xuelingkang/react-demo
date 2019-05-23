import React from 'react';
import {Icon, message} from 'antd';
import omit from "object.omit";
import $$ from "cmn-utils/lib";
import Upload from 'components/Upload';
import './avatar.less';

export default ({
                    form,
                    name,
                    formFieldOptions = {},
                    record,
                    initialValue,
                    normalize,
                    rules,
                    maxFileSize, // 最大文件大小
                    fileTypes, // 允许文件类型
                    action,    // 后台地址
                    fileName,  // 后台接受文件的参数名
                    ...otherProps
                }) => {
    const {getFieldDecorator} = form;

    let initval = initialValue;

    if (record) {
        initval = record[name];
    }

    // 如果存在初始值
    if (initval && typeof initval !== 'undefined') {
        if ($$.isFunction(normalize)) {
            formFieldOptions.initialValue = normalize(initval);
        } else {
            formFieldOptions.initialValue = $$.isArray(initval)
                ? initval.map((item, index) => ({
                    uid: 'fs_' + index,
                    thumbUrl: item
                }))
                : [
                    {
                        uid: 'fs_0',
                        thumbUrl: record[name]
                    }
                ];
        }
    }

    // 如果有rules
    if (rules && rules.length) {
        formFieldOptions.rules = rules;
    }

    if (maxFileSize || fileTypes) {
        formFieldOptions.rules = [
            {
                validator: (rule, value, callback) => {
                    if (value) {
                        const sizeMsg = validatorFileSize(maxFileSize, value);
                        if (sizeMsg) {
                            callback(sizeMsg);
                            return false;
                        }
                        const typeMsg = validatorFileTypes(fileTypes, value);
                        if (typeMsg) {
                            callback(typeMsg);
                            return false;
                        }
                    }
                    callback();
                }
            },
            ...(formFieldOptions.rules || [])
        ];
    }

    let uploadProps = {}

    // 直接上传到后台
    if (action) {
        uploadProps = omit(otherProps, ['beforeUpload']);
        uploadProps.action = action;
        uploadProps.name = fileName || 'file';
    }

    return getFieldDecorator(name, {
        valuePropName: 'fileList',
        getValueFromEvent: normFile,
        ...formFieldOptions
    })(
        <Avatar {...uploadProps} />
    );
}

const validatorFileSize = (maxFileSize, value) => {
    if (value.some(item => item.size > maxFileSize * 1024)) {
        return `请上传文件大小在${maxFileSize}K以内的图片`;
    }
};

const validatorFileTypes = (fileTypes, value) => {
    if ($$.isArray(fileTypes) && fileTypes.length > 0) {
        if (
            value.some(
                item =>
                    item.name &&
                    !fileTypes.some(
                        type => item.name.toLowerCase().indexOf(type.toLowerCase()) !== -1
                    )
            )
        ) {
            return `请上传${fileTypes.join('、')}，类型文件`;
        }
    }
};

const normFile = e => {
    console.log(e);
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

class Avatar extends React.Component {
    state = {
        loading: false,
    };

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
        } else if (info.file.status === 'done') {
            const { code, data } = info.file.response;
            const { attachmentAddress: imageUrl } = data;
            if (code===200) {
                this.setState({
                    imageUrl,
                    loading: false
                });
            }
        }
    };

    render() {
        const {action, name, fileList, title, onChange} = this.props;
        let {loading, imageUrl} = this.state;
        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">{title}</div>
            </div>
        );
        if (!imageUrl && fileList) {
            imageUrl = fileList[0].thumbUrl;
        }
        return (
            <Upload
                listType='picture-card'
                className='avatar-uploader'
                showUploadList={false}
                name={name}
                action={action}
                onChange={this.handleChange}
            >
                {imageUrl ? <img src={imageUrl} alt='avatar' style={{width: '100%'}} /> : uploadButton}
            </Upload>
        );
    }
}
