import React, { useContext } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard.jsx'
import Login from './pages/Auth/Login.jsx'
import SignUp from './pages/Auth/SignUp.jsx'
import ManageTasks from './pages/Admin/ManageTasks.jsx'
import CreateTask from './pages/Admin/CreateTask.jsx'
import ManageUsers from './pages/Admin/ManageUsers.jsx'
import UserDashboard from './pages/User/UserDashboard.jsx'
import MyTasks from './pages/User/MyTasks.jsx'
import ViewTaskDetails from './pages/User/ViewTaskDetails.jsx'
import PrivateRoute from './routes/PrivateRoute.jsx'
import UserProvider, { UserContext } from './context/userContext.jsx'
import { Toaster } from 'react-hot-toast'
import ProfileSettings from './pages/Profile/ProfileSettings.jsx'
import GroupChat from './pages/Chat/GroupChat.jsx'


const App = () => {
  return (
    <UserProvider>
      <div className=' '>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/signUp' element={<SignUp />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={['admin']} />} >
              <Route path='/admin/dashboard' element={<Dashboard />} />
              <Route path='/admin/tasks' element={<ManageTasks />} />
              <Route path='/admin/create-task' element={<CreateTask />} />
              <Route path='/admin/users' element={<ManageUsers />} />
              <Route path='/admin/chat' element={<GroupChat />} />
            </Route>

            {/* user Routes */}
            <Route element={<PrivateRoute allowedRoles={['member']} />} >
              <Route path='/user/dashboard' element={<UserDashboard />} />
              <Route path='/user/my-tasks' element={<MyTasks />} />
              <Route path='/user/task-details/:id' element={<ViewTaskDetails />} />
              <Route path='/user/chat' element={<GroupChat />} />
            </Route>

            {/* Shared Routes (admin + member) */}
            <Route element={<PrivateRoute allowedRoles={['admin', 'member']} />} >
              <Route path='/profile' element={<ProfileSettings />} />
            </Route>

            {/* default route */}
            <Route path='/' element={<Root />} />
          </Routes>
        </BrowserRouter>
      </div>

      <Toaster
        toastOptions={{
          className: '',
          style: {
            border: '1px solid #713f12',
            padding: '16px',
            color: '#713f12',
          },
        }}
      />
    </UserProvider>
  )
}

export default App

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />

  if (!user) {
    return <Navigate to='/login' />
  }

  return user.role === "admin" ? (
    <Navigate to='/admin/dashboard' />
  ) : (
    <Navigate to='/user/dashboard' />
  )

}

