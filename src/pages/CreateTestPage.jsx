import React from 'react';
import { motion } from 'framer-motion';
import AdminSidebarLayout from '../components/AdminSidebarLayout';
import CreateTest from '../components/CreateTest';

const CreateTestPage = () => {
  return (
    <AdminSidebarLayout>
      <div className="flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-10 bg-white rounded-2xl border-l border-gray-400 shadow hover:shadow-xl w-full max-w-2xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold text-gray-800 mb-8"
          >
            Create a New Test
          </motion.h1>

          <CreateTest />
        </motion.div>
      </div>
    </AdminSidebarLayout>
  );
};

export default CreateTestPage;
