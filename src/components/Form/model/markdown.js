import React from 'react';
import Editor from 'components/Markdown';
import $$ from 'cmn-utils';
import getValueFromRecord from "@/utils/getValueFromRecord";

/**
 * markdown编辑器插件
 */
export default ({
    form,
    name,
    formFieldOptions = {},
    record,
    initialValue,
    rules,
    normalize,
    markdownProps = {}
}) => {
    const { getFieldDecorator } = form;
    let initval = initialValue;
    if (record) {
        initval = getValueFromRecord(record, name);
    }
    // 如果存在初始值
    if (initval !== null && typeof initval !== 'undefined') {
        if ($$.isFunction(normalize)) {
            formFieldOptions.initialValue = normalize(initval);
        } else {
            formFieldOptions.initialValue = initval;
        }
    }
    // 如果有rules
    if (rules && rules.length) {
        formFieldOptions.rules = rules;
    }
    return getFieldDecorator(name, formFieldOptions)(<Editor {...markdownProps} />);
}
