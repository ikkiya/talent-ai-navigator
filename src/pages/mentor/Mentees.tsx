import React from 'react';
import Layout from '@/components/Layout';
import { api } from '@/backend/services/api';

const Mentees = () => {
  return (
    <Layout>
      <div>
        <h1>My Mentees</h1>
        <p>This page will display a list of your mentees.</p>
      </div>
    </Layout>
  );
};

export default Mentees;
