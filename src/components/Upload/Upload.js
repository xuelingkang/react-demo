import React from 'react';
import {Upload} from 'antd';
import {getAuth} from '@/utils/authentication';

/**
 * 使Upload携带token
 */
export default class extends React.PureComponent {
    render() {
        const {headers, ...otherProps} = this.props;
        let newheaders = {...headers};
        const uploadProps = {...otherProps};
        const {token} = getAuth();
        if (token) {
            newheaders = {token, ...newheaders};
            uploadProps.headers = newheaders;
        }
        return <Upload {...uploadProps} />;
    }
}
