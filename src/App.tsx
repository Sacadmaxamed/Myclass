/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ClassList from './pages/ClassList';
import AddClass from './pages/AddClass';
import StudentList from './pages/StudentList';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Backup from './pages/Backup';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/classes" element={<ClassList />} />
          <Route path="/add-class" element={<AddClass />} />
          <Route path="/classes/:classId" element={<StudentList />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/attendance/:classId" element={<Attendance markMode={true} />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:classId" element={<Reports detailMode={true} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/backup" element={<Backup />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
