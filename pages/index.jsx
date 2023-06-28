import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout title="Aditya Vaidyam" description="Aditya Vaidyam">
      <section style={{ display: "flex", alignItems: "center", padding: "2rem 0", width: "100%" }}>
        <div className="container">
          <div className="row">
            <div className={clsx('col col--4')}>
              <div className="text--center">
                <img src={require('./assets/photo.jpg').default} style={{ borderRadius: 10 }} />
              </div>
            </div>
            <div className={clsx('col')}>
              <div className="padding-horiz--md">
                <h1 className={clsx('hero__title', styles.playfair)}>Aditya Vaidyam, MS</h1>
                <p className={clsx('hero__subtitle', styles.playfair)}>Aditya is currently a medical student at the Carle Illinois College of Medicine.</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Link
                    className="button button--secondary button--lg margin--xs"
                    to="mailto:aditya@vaidyam.me">
                    Send an Email
                  </Link>
                  <Link
                    className="button button--secondary button--lg margin--xs"
                    to="https://aditya.vaidyam.me/meet">
                    Schedule a Meeting
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
