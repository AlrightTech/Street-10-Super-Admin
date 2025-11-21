import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { SidebarProvider } from '../../contexts/SidebarContext'

/**
 * Main layout component combining sidebar, top bar, and outlet for nested routes
 */
export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-[#F5F5F5]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex flex-1 flex-col w-full md:ml-64 min-w-0">
          {/* Top Bar */}
          <TopBar />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#F5F5F5] p-2 sm:p-3 md:p-4 lg:p-6 min-w-0">
            <div className="w-full max-w-full mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

