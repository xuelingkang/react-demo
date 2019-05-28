import React from 'react';
import {Col, Divider, Form, Row} from "antd";
import objectAssign from 'object-assign';
import $$ from 'cmn-utils';
import cx from "classnames";
import PropTypes from "prop-types";
import omit from "object.omit";
import Password from "components/Form/model/password";
import Button from 'components/Button';
import getValueFromRecord from "@/utils/getValueFromRecord";

/*
{
    type: 'group',
    groupType: 'array',
    plus: true,
    minus: true,
    items: [
        {
            title: '名称',
            name: 'parameterName',
            col: { span: 6 },
            formItemLayout: {
                wrapperCol: { span: 24 }
            },
            rules: [
                {
                    required: true,
                    message: '请输入名称'
                }
            ]
        },
        {
            title: '类型',
            name: 'parameterType',
            type: 'select',
            dict: [
                {code: 'string', codeName: 'string'},
                {code: 'number', codeName: 'number'},
            ],
            col: { span: 6 },
            formItemLayout: {
                wrapperCol: { span: 24 }
            },
            rules: [
                {
                    required: true,
                    message: '请选择类型'
                }
            ]
        },
    ],
}
*/
export default ({
    groupType,
    items,
    plus,
    minus,
    form,
    name,
    initialValue,
    record,
    normalize,
    preview,
    ...otherProps
}) => {
    let initval = initialValue;
    if (record) {
        initval = getValueFromRecord(record, name);
    }
    // 如果存在初始值
    if (initval && typeof initval !== 'undefined') {
        if ($$.isFunction(normalize)) {
            initval = normalize(initval);
        }
    }
    record = {
        ...record,
        [name]: initval
    };
    const groupProps = {
        ...otherProps,
        groupName: name,
        groupType,
        items,
        plus,
        minus,
        form,
        preview,
        record,
    };
    return <Groups {...groupProps} />
}

class Groups extends React.Component {

    constructor(props) {
        super(props);
        const {record, groupName, groupType, items} = props;
        this.state = {
            record,
            groupName,
            groupType,
            items
        }
    }

    plus = () => {
        const {record, groupName, groupType} = this.state;
        if (groupType==='array') {
            const record_ = {
                ...record,
                [groupName]: record[groupName]? record[groupName].concat({}): [{}]
            };
            this.setState({
                record: record_
            });
        }
    }

    minus = i => {
        const {record, groupName, groupType} = this.state;
        if (groupType==='array') {
            // 这里只能用delete
            const array = record[groupName].map(a => a);
            delete array[i];
            this.setState({
                record: {
                    ...record,
                    [groupName]: array
                }
            });
        }
    }

    render() {
        const {
            items,
            plus,
            minus,
            form,
            preview,
            ...otherProps
        } = this.props;
        const {record, groupName, groupType} = this.state;
        if (groupType === 'array') {
            const plusBtn = <Button shape='circle'
                                    icon='plus'
                                    tooltip='增加'
                                    onClick={this.plus}
                                    style={{float: 'right', zIndex: 999}} />;
            return (
                <div>
                    {plus? plusBtn: null}
                    {
                        record[groupName]? record[groupName].map((val, index) => {
                            const props = {
                                ...otherProps,
                                form,
                                groupType,
                                groupName,
                                groupIndex: index,
                                preview,
                                columns: items,
                                record,
                                type: 'grid',
                                minus,
                                onMinus: this.minus,
                            };
                            return <Group key={index} {...props} />;
                        }): null
                    }
                </div>
            );
        } else {
            const props = {
                ...otherProps,
                form,
                groupType,
                groupName,
                preview,
                columns: items,
                record,
                type: 'grid',
            };
            return <Group {...props} />;
        }
    }
}

const Group = props => {
    const {
        className,
        prefixCls = 'antui-form',
        type = 'grid',
        rows,
        cols,
        formItemLayout: _formItemLayout = {labelCol: { span: 6 }, wrapperCol: { span: 17 }},
        layout,
        appendTo,
        columns,
        record,
        children,
        form,
        groupType,
        groupName,
        groupIndex,
        minus,
        onMinus,
        preview,
        loading = false,
        ...otherProps
    } = props;

    // 当type为grid时，指定每行元素个数
    const defaultCols = {
        xs: 24,
        md: 24,
        xl: 24
    };

    // 内联元素默认宽
    const defaultWidth = {
        date: 100,
        month: 100,
        'date~': 280,
        datetime: 140,
        select: 100,
        default: 100,
        treeSelect: 110,
        cascade: 110,
        cascader: 110
    };

    // 当type为grid时，指定每两个元素的间隔
    const defaultRows = {
        gutter: 8
    };

    let classname = cx(prefixCls, className, {
        'form-inline': type === 'inline',
        'form-grid': type === 'grid',
        preview: preview
    });

    const colopts = type === 'grid' ? cols || defaultCols : {};
    const rowopts = type === 'grid' ? rows || defaultRows : {};

    let ComponentRow = type === 'inline' ? PlainComp : Row;
    let ComponentCol = type === 'inline' ? PlainComp : Col;
    let ComponentItem = Form.Item;

    let formFields = columns;

    let getPopupContainer = null;
    if (appendTo) {
        if ($$.isFunction(appendTo)) getPopupContainer = appendTo;
        else if (appendTo === true)
            getPopupContainer = triggerNode => triggerNode.parentNode;
        else getPopupContainer = _ => appendTo;
    }
    const minusBtn = <Button shape='circle'
                             icon='minus'
                             tooltip='删除'
                             onClick={() => onMinus(groupIndex)} />;
    return (
        <div
            className={classname}
            {...objectAssign(otherProps, type === 'inline' && {layout: 'inline'})}
        >
            <ComponentRow className="row-item" {...rowopts}>
                {formFields.map((field, i) => {
                    // 传入个性化的列大小，改变这个值可以改变每行元素的个数
                    let col = {...colopts};
                    if (type === 'grid' && field.col) {
                        col = field.col;
                    } else if (type !== 'grid') {
                        col = {};
                    }

                    let formItemLayout = {..._formItemLayout, ...layout};
                    if (
                        type === 'grid' &&
                        (field.formItemLayout || field.layout)
                    ) {
                        formItemLayout = {
                            ...formItemLayout,
                            ...field.formItemLayout,
                            ...field.layout
                        };
                    } else if (type !== 'grid') {
                        formItemLayout = {};
                    }

                    const fieldType = field.type || 'input';

                    let formProps = {
                        form,
                        record,
                        preview,
                        loading,
                        ...field
                    };

                    if (type === 'inline') {
                        formProps.style = {
                            width: formProps.width || defaultWidth[fieldType]
                        };
                    }

                    if (getPopupContainer) {
                        formProps.getPopupContainer = getPopupContainer;
                    }

                    if (field.dict) {
                        formProps.dict = field.dict;
                    }

                    // 传入子组件前删除无用属性
                    formProps = omit(formProps, ['formItemLayout', 'layout', 'col']);

                    if (groupType==='array') {
                        const {name} = formProps;
                        formProps.name = `${groupName}.${groupIndex}.${name}`;
                    } else {
                        const {name} = formProps;
                        formProps.name = `${groupName}.${name}`;
                    }

                    let FieldComp;
                    switch (fieldType) {
                        case 'date~': // 日期范围
                        case 'datetime': // 日期时间
                        case 'date': // 日期
                        case 'month': // 月
                        case 'time': // 时间
                            FieldComp = require(`./date`).default(formProps);
                            break;
                        case 'input': // 输入框
                        case 'textarea': // 多行文本
                            FieldComp = require(`./input`).default(formProps);
                            break;
                        case 'hidden': // 隐藏域
                            return (
                                <span key={`col-${i}`}>
                                    {require(`./input`).default(formProps)}
                                </span>
                            );
                        case 'line': // 分隔线
                            const lineProps = omit(formProps, 'type');
                            return (
                                <Divider key={`col-${i}`} {...lineProps}>
                                    {formProps.title}
                                </Divider>
                            );
                        case 'password': // 密码
                            return (
                                <Password
                                    key={`col-${i}`}
                                    formItemLayout={formItemLayout}
                                    col={col}
                                    {...formProps}
                                />
                            );
                        default:
                            // 通用
                            try {
                                FieldComp = require(`./${fieldType.toLowerCase()}`).default(
                                    formProps
                                );
                            } catch (e) {
                                FieldComp = require(`./${fieldType.toLowerCase()}/index`).default(
                                    formProps
                                );
                            }
                    }

                    return (
                        <ComponentCol key={`col-${i}`} className="col-item" {...col}>
                            <ComponentItem
                                {...formItemLayout}
                                className="col-item-content"
                            >
                                {FieldComp}
                            </ComponentItem>
                        </ComponentCol>
                    );
                })}
                {children}
                {minus? minusBtn: null}
            </ComponentRow>
        </div>
    );
}

const PlainComp = ({className, children}) => (
    <div className={className}>{children}</div>
);
PlainComp.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
};
