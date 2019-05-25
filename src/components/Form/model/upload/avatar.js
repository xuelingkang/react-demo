import React from 'react';
import propTypes from 'prop-types';
import Icon from 'components/Icon';
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
    getValueFromEvent,
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
            formFieldOptions.initialValue = {uid: 'fs_0', thumbUrl: record[name]}
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
        valuePropName: 'imageFile',
        getValueFromEvent,
        ...formFieldOptions
    })(
        <Avatar {...uploadProps} />
    );
}

class Avatar extends React.Component {
    render() {
        const {action, name, imageFile={}, title, loading, beforeUpload, onChange} = this.props;
        const uploadButton = (
            <div>
                {loading? <Icon type='loading' font='iconfont' />: <Icon type='plus' />}
                <div className="ant-upload-text">{loading ? '上传中' : title}</div>
            </div>
        );
        const {thumbUrl} = imageFile;
        return (
            <Upload
                listType='picture-card'
                className='avatar-uploader'
                showUploadList={false}
                name={name}
                action={action}
                onChange={onChange}
                beforeUpload={beforeUpload}
            >
                {loading||!thumbUrl ? uploadButton: <img src={thumbUrl} alt='avatar' className='avatar-image' />}
            </Upload>
        );
    }
}
