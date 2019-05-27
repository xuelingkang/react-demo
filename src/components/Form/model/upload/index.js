import React from 'react';
import {Button} from 'antd';
import Upload from 'components/Upload';
import $$ from 'cmn-utils';

export default ({
    form,
    name,
    formFieldOptions = {},
    record,
    initialValue,
    normalize,
    getValueFromEvent,
    rules,
    max,
    onChange,
    preview,
    btnIcon = 'upload',
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
                    url: item
                }))
                : [
                    {
                        uid: 'fs_0',
                        url: record[name]
                    }
                ];
        }
    }

    // 如果有rules
    if (rules && rules.length) {
        formFieldOptions.rules = rules;
    }

    if (getValueFromEvent) {
        formFieldOptions.getValueFromEvent = getValueFromEvent;
    } else {
        formFieldOptions.getValueFromEvent = info => {
            const {fileList} = info;
            return fileList.map(file => {
                const {response} = file;
                if (response) {
                    const {code, data, message} = response;
                    if (code) {
                        if (code===200) {
                            const {id, attachmentAddress} = data;
                            return {
                                ...file,
                                id,
                                url: attachmentAddress
                            };
                        } else {
                            return {
                                ...file,
                                response: message
                            };
                        }
                    }
                }
                return file;
            });
        }
    }

    // 如果需要onChange
    if (typeof onChange === 'function') {
        formFieldOptions.onChange = args => onChange(form, args); // form, args
    }

    let uploadProps = {}

    if (action) {
        uploadProps = {...otherProps};
        uploadProps.action = action;
        uploadProps.name = fileName || 'file';
        uploadProps.className = 'upload-list-inline';
        uploadProps.onChange = onChange && (info => onChange(form, info)) || (info => info);
    }

    if (preview) {
        return getFieldDecorator(name, {
            valuePropName: 'fileList',
            ...formFieldOptions
        })(
            <Upload {...uploadProps} onRemove={() => false} />
        );
    }

    return getFieldDecorator(name, {
        valuePropName: 'fileList',
        ...formFieldOptions
    })(
        <Upload {...uploadProps}>
            <Button icon={btnIcon} disabled={isDisabled(max, form.getFieldValue(name))}>
                点击上传
            </Button>
        </Upload>
    );
};

// 如果设置max，控制按钮禁用状态
const isDisabled = (max, value) => {
    if (!max) return false;
    if (!value) return false;
    return !(value && value.length < max);
};
