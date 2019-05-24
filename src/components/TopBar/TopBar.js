import React, { Component } from 'react';
import { Breadcrumb, Row, Col } from 'antd';
import { Link } from 'dva/router';
import Icon from '../Icon';
import cx from 'classnames';
import CSSAnimate from '../CSSAnimate';
import Mask from '../Mask';
import './style/index.less';

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRoute: this.getRouteLevel(props.location.pathname) || []
    };
  }

  componentWillReceiveProps(nextProps) {
    const currentRoute = this.getRouteLevel(nextProps.location.pathname);

    this.setState({
      currentRoute
    });
  }

  getRouteLevel = pathName => {
    const orderPaths = [];
    pathName.split('/').reduce((prev, next) => {
      const path = [prev, next].join('/');
      orderPaths.push(path);
      return path;
    });

    return orderPaths
      .map(item => window.dva_router_pathMap[item])
      .filter(item => !!item);
  };

  render() {
    const { currentRoute } = this.state;

    return (
      <div className='topbar'>
        <header className="topbar-content">
          {currentRoute.length ? (
            <Breadcrumb>
              <Breadcrumb.Item className="first">
                {currentRoute[currentRoute.length - 1].title}
              </Breadcrumb.Item>
              <Breadcrumb.Item className="icon">
                <Icon type="home" />
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/">主页</Link>
              </Breadcrumb.Item>
              {currentRoute.map((item, index) => (
                <Breadcrumb.Item key={index}>
                  {index === currentRoute.length - 1 ? (
                    item.title
                  ) : (
                    <Link to={item.path}>{item.title}</Link>
                  )}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          ) : null}
        </header>
      </div>
    );
  }
}

export default TopBar;
