import React from 'react';
import { motion } from 'framer-motion';
import AdminSidebarLayout from '../components/AdminSidebarLayout';
import AddQuestionForm from '../components/AddQuestionForm';

const AddQuestionFormPage = () => {
  return (
    <AdminSidebarLayout>
      <div className="flex items-center justify-center p-6 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl font-bold text-center text-gray-800 mb-8"
          >
            Add Question
          </motion.h1>

          <AddQuestionForm />
        </motion.div>
      </div>
    </AdminSidebarLayout>
  );
};

export default AddQuestionFormPage;
