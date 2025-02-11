// src/App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './assets/LoginForm/LoginForm';
import UserForm from './assets/UserForm/UserForm';
import RegisterForm from './assets/RegisterForm/RegisterForm';
import HomePage from './pages/HomePage/HomePage';
import HealthPage from './pages/HealthPage/HealthPage';
import GroupPage from './pages/GroupPage/GroupPage';
import PostsPage from './pages/PostsPage/PostsPage';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/user" element={<UserForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/groups" element={<GroupPage />} />
          <Route path="/groups/:groupId/posts" element={<PostsPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
