import React, { Component } from 'react';
import Button from 'components/Button';
import Icon from 'components/Icon';
import CSSAnimate from 'components/CSSAnimate';
import './style/index.less';

export default class extends Component {
    state = {
        menuVisible: false
    };
    showMenu = () => {
        this.setState({
            menuVisible: true
        });
    }
    hideMenu = () => {
        this.setState({
            menuVisible: false
        });
    }
    render() {
        const {menuVisible} = this.state;
        const menuStyle = {
            display: menuVisible? '': 'none'
        };
        return (
            <div className='contact-container' onMouseOver={this.showMenu} onMouseOut={this.hideMenu}>
                <Button tooltip='联系站长' shape='circle' size='large' onClick={this.showMenu}>
                    <span className='contact-icon'>
                        <Icon type='phone' antd theme='filled' />
                    </span>
                </Button>
                <div className='contact-menu-container' style={menuStyle}>
                    <div className='contact-menu'>
                        <div>
                            <a>
                                <Icon type='wechat' antd className='contact-menu-item-icon' />
                                <span className='contact-menu-item'>微信联系</span>
                                <span className='contact-menu-item-comment'>查看站长微信二维码</span>
                            </a>
                            <a href='http://wpa.qq.com/msgrd?v=3&uin=574290057&site=qq&menu=yes' target='_blank'>
                                <Icon type='qq' antd className='contact-menu-item-icon' />
                                <span className='contact-menu-item'>QQ联系</span>
                                <span className='contact-menu-item-comment'>打开QQ临时通讯</span>
                            </a>
                            <a>
                                <Icon type='highlight' antd className='contact-menu-item-icon' />
                                <span className='contact-menu-item'>站内留言</span>
                                <span className='contact-menu-item-comment'>在本站添加留言</span>
                            </a>
                        </div>
                        <Icon type='close' antd className='contact-menu-close' onClick={this.hideMenu} />
                    </div>
                </div>
            </div>
        );
    }
}
