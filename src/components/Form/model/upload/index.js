import React from 'react';
import {Button} from 'antd';
import Upload from 'components/Upload';
import omit from 'object.omit';
import $$ from 'cmn-utils';

/**
 * Upload元件, 可能需要自已处理反回值，如果后台需要FormData
 * const formData = new FormData();
 fileList.forEach((file) => {
     formData.append('files[]', file);
   });
 */
export default ({
                    form,
                    name,
                    formFieldOptions = {},
                    record,
                    initialValue,
                    normalize,
                    rules,
                    onChange,
                    type,
                    preview,
                    renderUpload,
                    btnIcon = 'upload',
                    max,
                    maxFileSize, // 最大文件大小
                    fileTypes, // 允许文件类型
                    action,    // 后台地址
                    fileName,  // 后台接受文件的参数名
                    getPopupContainer,
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

    if (preview) {
        return <div style={otherProps.style}>{initval || ''}</div>;
    }

    // 如果有rules
    if (rules && rules.length) {
        formFieldOptions.rules = rules;
    }

    if (maxFileSize || fileTypes) {
        formFieldOptions.rules = [
            {
                validator: (rule, value, callback) => {
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
                    callback();
                }
            },
            ...(formFieldOptions.rules || [])
        ];
    }

    // 如果需要onChange
    if (typeof onChange === 'function') {
        formFieldOptions.onChange = args => onChange(form, args); // form, args
    }

    let uploadProps = {
        listType: 'picture',
        beforeUpload: () => false,
    }

    // 真接上传到后台
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
        <Upload {...uploadProps} {...otherProps}>
            {renderUpload ? (
                renderUpload(form, record, isDisabled(max, form.getFieldValue(name)))
            ) : (
                <Button
                    icon={btnIcon}
                    disabled={isDisabled(max, form.getFieldValue(name))}
                >
                    点击上传
                </Button>
            )}
        </Upload>
    );
};

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

// 如果设置max，控制按钮禁用状态
const isDisabled = (max, value) => {
    if (!max) return false;
    if (!value) return false;
    return !(value && value.length < max);
};

const normFile = e => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};
