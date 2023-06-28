import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function Meet() {
  return (
    <Layout title="Aditya Vaidyam" description="Aditya Vaidyam">
      <section style={{ display: "flex", alignItems: "center", padding: "2rem 0", width: "100%" }}>
        <iframe src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1llbLe11GwGN2S_HB2Y1Qv_LW5rgxBUdUAvdgCTPRpVD6xX8BnGkAAM4GE3bCLXKlst-5f4cGE?gv=true" style="border: 0" width="100%" height="600" frameborder="0"></iframe>
      </section>
    </Layout>
  );
}
