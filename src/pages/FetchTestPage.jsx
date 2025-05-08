import React from 'react';
import { motion } from 'framer-motion';
import AdminSidebarLayout from '../components/AdminSidebarLayout';
import FetchTest from '../components/FetchTest';

const FetchTestPage = () => {
  return (
    <AdminSidebarLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-10 max-w-5xl mx-auto p-10"
      >
        <FetchTest />
      </motion.div>
    </AdminSidebarLayout>
  );
};

export default FetchTestPage;
