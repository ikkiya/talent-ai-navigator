import React from 'react';
import Layout from '@/components/Layout';
import { api } from '@/backend/services/api';

const TalentPool = () => {
  return (
    <Layout>
      <div>
        <h1>Talent Pool</h1>
        <p>This page will display the talent pool data.</p>
      </div>
    </Layout>
  );
};

export default TalentPool;
