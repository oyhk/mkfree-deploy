import React, {Component, PropTypes} from 'react';
import {Button} from 'antd';
import {connect} from 'dva';
import {Link} from 'dva/router';

import styles from './IndexPage.css';

function IndexPage() {
    return (
        <div className={styles.normal}>
            <h1 className={styles.title}>Yay! Welcome to dva!</h1>
            <div className={styles.welcome}/>
            <ul className={styles.list}>
                <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
                <li><a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md" target="_blank">Getting
                    Started</a></li>
                <li><Button type="primary">Primary</Button>
                    <Button>Default</Button>
                    <Button type="ghost">Ghost</Button>
                    <Button type="dashed">Dashed</Button></li>
            </ul>
        </div>
    );
}

IndexPage.propTypes = {};

export default connect()(IndexPage);
