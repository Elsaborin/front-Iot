import React, { useState } from 'react';
import { HomeIcon} from 'lucide-react';

interface SidebarProps {
  open: boolean;
}

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  current: boolean;
  children?: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name) 
        : [...prev, name]
    );
  };

  const navigation: NavItem[] = [
    { name: 'Dashboard', icon: <HomeIcon className="h-5 w-5" />, href: '#', current: true },
   
    
  ];

  const renderNavItem = (item: NavItem) => {
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;
    
    return (
      <li key={item.name}>
        <a
          href={item.href}
          onClick={hasChildren ? (e) => {
            e.preventDefault();
            toggleExpand(item.name);
          } : undefined}
          className={`
            flex items-center px-4 py-2 text-sm font-medium rounded-md group
            ${item.current 
              ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-600 dark:text-cyan-400' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
          `}
        >
          <span className={`mr-3 ${item.current ? 'text-cyan-500' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
            {item.icon}
          </span>
          <span className={`${open ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
            {item.name}
          </span>
          {hasChildren && open && (
            <svg
              className={`ml-auto h-5 w-5 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </a>
        
        {hasChildren && isExpanded && open && (
          <ul className="mt-1 ml-8 space-y-1">
            {item.children!.map((child) => (
              <li key={child.name}>
                <a
                  href={child.href}
                  className={`
                    flex items-center px-4 py-2 text-sm font-medium rounded-md
                    ${child.current 
                      ? 'text-cyan-600 dark:text-cyan-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
                  `}
                >
                  <span className={`mr-3 ${child.current ? 'text-cyan-500' : 'text-gray-500 dark:text-gray-400'}`}>
                    {child.icon}
                  </span>
                  {child.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out
        ${open ? 'w-64' : 'w-20'}
      `}
    >
      <div className="h-0 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"></div>
      
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            <ul className="space-y-1">
              {navigation.map(renderNavItem)}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;