import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import cx from 'classnames';
import CSSAnimate from '../CSSAnimate';
import {Popconfirm} from 'antd';
import './style/index.less';

/**
 * 面板组件
 */
class Panel extends Component {
    static propTypes = {
        canRefresh: PropTypes.bool,
        canExpand: PropTypes.bool,
        canCollapse: PropTypes.bool,
        canClose: PropTypes.bool,
        onClose: PropTypes.func,
        onRefresh: PropTypes.func,
    };
    static defaultProps = {
        canRefresh: true,
        canExpand: true,
        canCollapse: true,
        canClose: true,
        prefix: 'antui-panel'
    };

    constructor(props) {
        super(props);
        this.state = {
            collapse: props.collapse || false,
            expand: props.expand || false,
            refresh: 0,
            animationName: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        const st = {};
        if ('collapse' in nextProps) {
            st.collapse = true;
        } else if ('expand' in nextProps) {
            st.expand = true;
        }
        if (Object.keys(st).length) {
            this.setState(st);
        }
    }

    onExpand = expand => e => {
        const {onChange} = this.props;

        this.setState({
            expand,
            collapse: false
        });

        if (onChange) {
            onChange({
                expand,
                collapse: false
            });
        }
    };

    onCollapse = collapse => e => {
        const {onChange} = this.props;

        this.setState({
            collapse,
            expand: false
        });

        if (onChange) {
            onChange({
                collapse,
                expand: false
            });
        }
    };

    onRefresh = () => {
        this.setState({
            refresh: this.state.refresh + 1,
            animationName: 'fadeIn'
        });
        this.props.onRefresh && this.props.onRefresh();
    };

    render() {
        const {expand, collapse, refresh, animationName} = this.state;
        const {
            canRefresh,
            canExpand,
            canCollapse,
            canClose,
            theme,
            prefix,
            className,
            title,
            width,
            height,
            style,
            children,
            header,
            cover,
            scroll,
            onClose
        } = this.props;

        const classnames = cx(prefix, className, {
            theme: !!theme,
            'panel-fullscreen': !!expand,
            'panel-collapsed': !!collapse,
            cover: !!cover
        });

        const styles = {
            ...style,
            width
        };
        const bodyStyles = {};
        if (!expand) {
            bodyStyles.height = height;
        }
        if (scroll) {
            bodyStyles.overflow = 'auto';
        }

        const Header =
            typeof header === 'undefined' ? (
                <div className={`${prefix}-header`}>
                    <span className={`${prefix}-header-title`}>{title}</span>
                    <span className={`${prefix}-header-controls`}>
                        {
                            canRefresh &&
                            <a className="panel-control-loader" onClick={this.onRefresh}>
                                <Icon type="refresh"/>
                            </a>
                        }
                        {
                            canExpand &&
                            <a
                                className="panel-control-fullscreen"
                                onClick={this.onExpand(!expand)}
                            >
                                <Icon type={`${expand ? 'shrink' : 'enlarge'}`}/>
                            </a>
                        }
                        {
                            canCollapse &&
                            <a
                                className="panel-control-collapsed"
                                onClick={this.onCollapse(!collapse)}
                            >
                                <Icon type={`${collapse ? 'plus' : 'minus'}`}/>
                            </a>
                        }
                        {
                            canClose &&
                            <Popconfirm
                                title="您确认要关闭这个面板？"
                                onConfirm={onClose}
                                placement="topRight"
                            >
                                <a className="panel-control-remove">
                                    <Icon type="close"/>
                                </a>
                            </Popconfirm>
                        }
                    </span>
                </div>
            ) : (
                header
            );

        return (
            <div className={classnames} style={styles}>
                {Header}
                <div className={`${prefix}-body`} style={bodyStyles}>
                    <CSSAnimate
                        className="panel-content"
                        type={animationName}
                        callback={_ => this.setState({animationName: ''})}
                        key={refresh}
                    >
                        {children}
                    </CSSAnimate>
                </div>
            </div>
        );
    }
}

export default Panel;
