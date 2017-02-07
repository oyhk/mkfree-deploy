import React from 'react';
import styles from './MainLayout.css';
import Header from './Header';

function MainLayout({children, location}) {
    return (
      <div className={styles.page_wrapper}>
        <div className={styles.logo}>
          <h1>mkfree-deploy</h1>
        </div>
        <div className={styles.normal}>
          <Header location={location} className={styles.header}/>
          <div className={styles.content}>
            <div className={styles.main}>
              {children}
            </div>
          </div>
        </div>
      </div>
        
    );
}

export default MainLayout;
