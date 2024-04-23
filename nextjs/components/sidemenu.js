// components/sidemenu.js

import React, { useState } from 'react';
import Link from 'next/link';
import { ViewColumnsIcon, Cog6ToothIcon, DocumentTextIcon, PresentationChartLineIcon,
  UserGroupIcon, QuestionMarkCircleIcon, CalendarIcon, UserIcon, EllipsisHorizontalIcon, Bars3Icon, XMarkIcon
 } from '@heroicons/react/24/outline'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// Navigation array updated based on provided list of available pages.
const navigation = [
  { name: 'Browse Spaces', href: '/browse_spaces', icon: DocumentTextIcon, current: false },
  { name: 'My Bookings', href: '/my_bookings', icon: CalendarIcon, current: false },
  // Do not remove existing 'Settings' and 'More' items.
  { name: 'More', href: '/more-actions', icon: EllipsisHorizontalIcon, current: false },
]

// Navigation array for admin.
const navigationAdm = [
  { name: 'Dashboard', href: '/dashboard', icon: ViewColumnsIcon, current: false },
  { name: 'Create Space', href: '/create_space', icon: DocumentTextIcon, current: false },
  { name: 'Admin Bookings List', href: '/adminBookingsList', icon: PresentationChartLineIcon, current: false },
  { name: 'Admin Rental List', href: '/admin_rental_list', icon: UserIcon, current: false },
  { name: 'Payment History', href: '/payment_history', icon: DocumentTextIcon, current: false },
]

const SideMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  return (
    <>
      {/* Menu toggle button for mobile view */}
      <button
        className="fixed top-5 left-5 z-50"
        onClick={() => {console.log("Menu toggle clicked");setIsMenuOpen(!isMenuOpen)}}
      >
      <Bars3Icon className="h-6 w-6 text-gray-900" aria-hidden="true" />
      </button>
      <div className={`${isMenuOpen ? 'fixed inset-0 z-50 flex' : 'hidden'} lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col bg-indigo-600`}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=white"
                alt="Your Company"
              />
              <button
                      className="lg:hidden text-white"
                      onClick={() => {console.log("Menu toggle clicked");setIsMenuOpen(!isMenuOpen)}}
              ><XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" /></button>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-indigo-700 text-white'
                              : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-indigo-200">Admin</div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {navigationAdm.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-indigo-700 text-white'
                              : 'text-indigo-200 hover:text-white hover:bg-indigo-700',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                    </ul>
                </li>
                <li className="mt-auto">
                  
                  <Link
                    href="/more-actions"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                  >
                    <EllipsisHorizontalIcon
                      className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                      aria-hidden="true"
                    />
                    More
                  </Link>
                  <Link
                    href="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                  >
                    <Cog6ToothIcon
                      className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                      aria-hidden="true"
                    />
                    Settings
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
    </>
  );
};

export default SideMenu;

