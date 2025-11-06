'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, ShoppingCart, ChevronDown, User, LogOut, Package, Activity, History, LayoutDashboard, Users } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { useUserStore } from '@/lib/store/user';
import SearchBox from './SearchBox';
import PreHeader from './PreHeader';
import PostHeader from './PostHeader';

interface HeaderProps {
  setSidebarIsOpen?: (open: boolean) => void;
}

export default function Header({ setSidebarIsOpen }: HeaderProps) {
  const { cartItems } = useCartStore();
  const { userInfo, signout } = useUserStore();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  const signoutHandler = () => {
    signout();
    setShowUserDropdown(false);
  };

  return (
    <>
      {/* Blue bar */}
      <div className="h-1 bg-blue-600" />

      <PreHeader />

      {/* Main Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Left section: Sidebar button + Brand + Search */}
            <div className="flex items-center gap-4 flex-1">
              {/* Sidebar toggle button */}
              {setSidebarIsOpen && (
                <button
                  type="button"
                  onClick={() => setSidebarIsOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Apri menu"
                >
                  <Menu size={24} />
                </button>
              )}

              {/* Brand */}
              <Link
                href="/"
                className="text-2xl font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap"
              >
                Pagine Azzurre
              </Link>

              {/* Search Box */}
              <div className="hidden md:block flex-1 max-w-xl">
                <SearchBox />
              </div>
            </div>

            {/* Right section: Navigation links */}
            <div className="flex items-center gap-4">
              {/* Tutti Noi link */}
              <Link
                href="/tutti-noi"
                className="text-gray-700 hover:text-blue-600 font-medium hidden sm:block"
              >
                Tutti Noi
              </Link>

              {/* Cart (only if logged in) */}
              {userInfo && (
                <Link
                  href="/cart"
                  className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Carrello"
                >
                  <ShoppingCart size={24} className="text-gray-700" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
              )}

              {/* Register button (only if not logged in) */}
              {!userInfo && (
                <Link
                  href="/register"
                  className="text-gray-700 hover:text-blue-600 font-medium hidden sm:block"
                >
                  Registrati
                </Link>
              )}

              {/* User dropdown (if logged in) */}
              {userInfo ? (
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserDropdown(!showUserDropdown);
                      setShowAdminDropdown(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <User size={20} />
                    <span className="hidden sm:inline font-medium">{userInfo.username}</span>
                    <ChevronDown size={16} />
                  </button>

                  {showUserDropdown && (
                    <>
                      {/* Overlay to close dropdown */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserDropdown(false)}
                      />

                      {/* Dropdown menu */}
                      <ul className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                        <li>
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <User size={18} />
                            Personale
                          </Link>
                        </li>

                        {/* Seller menu items */}
                        {userInfo.verified && userInfo.isSeller && (
                          <>
                            <li className="border-t border-gray-100">
                              <Link
                                href="/productlist/seller"
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowUserDropdown(false)}
                              >
                                <Package size={18} />
                                Crea Annuncio
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/productlist/seller"
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowUserDropdown(false)}
                              >
                                <Package size={18} />
                                Modifica Annuncio
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/orderlist/seller"
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowUserDropdown(false)}
                              >
                                <Activity size={18} />
                                Attività
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/orderhistory"
                                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowUserDropdown(false)}
                              >
                                <History size={18} />
                                Storico
                              </Link>
                            </li>
                          </>
                        )}

                        <li className="border-t border-gray-100">
                          <button
                            onClick={signoutHandler}
                            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-red-600"
                          >
                            <LogOut size={18} />
                            Esci
                          </button>
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/signin"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Accedi
                </Link>
              )}

              {/* Admin dropdown (if admin) */}
              {userInfo && userInfo.isAdmin && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowAdminDropdown(!showAdminDropdown);
                      setShowUserDropdown(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <span className="font-medium">Admin</span>
                    <ChevronDown size={16} />
                  </button>

                  {showAdminDropdown && (
                    <>
                      {/* Overlay to close dropdown */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowAdminDropdown(false)}
                      />

                      {/* Dropdown menu */}
                      <ul className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                        <li>
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <LayoutDashboard size={18} />
                            Pannello di controllo
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/productlist"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <Package size={18} />
                            Prodotti
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/orderlist"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <Activity size={18} />
                            Ordini
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/userlist"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <Users size={18} />
                            Utenti
                          </Link>
                        </li>
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile search bar */}
          <div className="md:hidden pb-4">
            <SearchBox />
          </div>
        </div>
      </header>

      <PostHeader />
    </>
  );
}
