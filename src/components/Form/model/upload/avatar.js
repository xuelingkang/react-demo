import React from 'react';
import {Icon} from 'antd';
import $$ from "cmn-utils/lib";
import Upload from 'components/Upload';
import './avatar.less';

export default
({
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
    onChange,
    loading,
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

    let uploadProps = {}

    if (action) {
        uploadProps = otherProps;
        uploadProps.action = action;
        uploadProps.name = fileName || 'file';
        uploadProps.onChange = onChange && (info => onChange(form, info)) || (info => info)
    }

    return getFieldDecorator(name, {
        valuePropName: 'fileList',
        getValueFromEvent: normFile,
        ...formFieldOptions
    })(
        <Avatar {...uploadProps} />
    );
}

const normFile = info => {
    if (info.file.status === 'done') {
        const {code, data} = info.file.response;
        if (code===200) {
            return data;
        }
    }
};

class Avatar extends React.Component {

    state = {
        imageUrl: ''
    }

    handleChange = info => {
        if (info.file.status === 'done') {
            const {code, data} = info.file.response;
            const {attachmentAddress: imageUrl} = data;
            if (code === 200) {
                this.setState({imageUrl});
            }
        }
        const {onChange} = this.props;
        onChange && onChange(info);
    };

    render() {
        const {action, name, fileList, title, loading, beforeUpload} = this.props;
        let {imageUrl} = this.state;
        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'}/>
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
                beforeUpload={beforeUpload}
            >
                {imageUrl ? <img src={imageUrl} alt='avatar' style={{width: '100%'}}/> : uploadButton}
            </Upload>
        );
    }
}
