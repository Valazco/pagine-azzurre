'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, ShoppingCart, ChevronDown, User, LogOut, Package, Activity, History, LayoutDashboard, Users } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { Button } from '@/components/ui/Button';
import SearchBox from '../SearchBox';
import PreHeader from '../PreHeader';
import PostHeader from '../PostHeader';
import {
  HeaderContainer,
  HeaderContent,
  HeaderRow,
  LeftSection,
  SidebarButton,
  BrandLink,
  BrandText,
  BrandAccent,
  SearchWrapper,
  MobileSearchWrapper,
  RightSection,
  NavLink,
  CartLink,
  CartBadge,
  DropdownContainer,
  DropdownButton,
  DropdownUsername,
  ChevronIcon,
  DropdownOverlay,
  DropdownMenu,
  DropdownItem,
  DropdownLink,
  DropdownLogoutButton,
  HeaderBorder,
} from './Header.styles';

interface HeaderProps {
  setSidebarIsOpen?: (open: boolean) => void;
}

export function Header({ setSidebarIsOpen }: HeaderProps) {
  const router = useRouter();
  const { cartItems } = useCartStore();
  const { data: session } = useSession();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  // Map session to userInfo-like object for compatibility
  const userInfo = session?.user ? {
    username: session.user.name,
    isAdmin: session.user.isAdmin,
    isSeller: session.user.isSeller,
    verified: true, // If they have a session, they're verified
  } : null;

  const signoutHandler = () => {
    signOut({ callbackUrl: '/' });
    setShowUserDropdown(false);
  };

  return (
    <>
      <PreHeader />

      <HeaderContainer>
        <HeaderContent>
          <HeaderRow>
            {/* Left section: Sidebar button + Brand + Search */}
            <LeftSection>
              {setSidebarIsOpen && (
                <SidebarButton
                  type="button"
                  onClick={() => setSidebarIsOpen(true)}
                  aria-label="Apri menu"
                >
                  <Menu size={22} />
                </SidebarButton>
              )}

              <BrandLink href="/">
                <BrandText>Pagine</BrandText>
                <BrandAccent> Azzurre</BrandAccent>
              </BrandLink>

              <SearchWrapper>
                <SearchBox />
              </SearchWrapper>
            </LeftSection>

            {/* Right section: Navigation links */}
            <RightSection>
              <NavLink href="/tutti-noi">
                Tutti Noi
              </NavLink>

              {/* Cart (only if logged in) */}
              {userInfo && (
                <CartLink href="/cart" aria-label="Carrello">
                  <ShoppingCart size={22} />
                  {cartItems.length > 0 && (
                    <CartBadge>{cartItems.length}</CartBadge>
                  )}
                </CartLink>
              )}

              {/* Register button (only if not logged in) */}
              {!userInfo && (
                <NavLink href="/register">
                  Registrati
                </NavLink>
              )}

              {/* User dropdown (if logged in) */}
              {userInfo ? (
                <DropdownContainer>
                  <DropdownButton
                    onClick={() => {
                      setShowUserDropdown(!showUserDropdown);
                      setShowAdminDropdown(false);
                    }}
                  >
                    <User size={18} />
                    <DropdownUsername>{userInfo.username}</DropdownUsername>
                    <ChevronIcon $isOpen={showUserDropdown}>
                      <ChevronDown size={14} />
                    </ChevronIcon>
                  </DropdownButton>

                  {showUserDropdown && (
                    <>
                      <DropdownOverlay onClick={() => setShowUserDropdown(false)} />
                      <DropdownMenu>
                        <DropdownItem>
                          <DropdownLink
                            href="/profile"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <User size={16} />
                            Profilo
                          </DropdownLink>
                        </DropdownItem>
                        <DropdownItem>
                          <DropdownLink
                            href="/productlist/seller"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <Package size={16} />
                            Annunci
                          </DropdownLink>
                        </DropdownItem>
                        <DropdownItem>
                          <DropdownLink
                            href="/orderlist/seller"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <Activity size={16} />
                            Attività
                          </DropdownLink>
                        </DropdownItem>
                        <DropdownItem>
                          <DropdownLink
                            href="/orderhistory"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <History size={16} />
                            Storico
                          </DropdownLink>
                        </DropdownItem>
                        <DropdownItem $hasBorder>
                          <DropdownLogoutButton onClick={signoutHandler}>
                            <LogOut size={16} />
                            Esci
                          </DropdownLogoutButton>
                        </DropdownItem>
                      </DropdownMenu>
                    </>
                  )}
                </DropdownContainer>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => router.push('/signin')}
                >
                  Accedi
                </Button>
              )}

              {/* Admin dropdown (if admin) */}
              {userInfo && userInfo.isAdmin && (
                <DropdownContainer>
                  <DropdownButton
                    $variant="admin"
                    onClick={() => {
                      setShowAdminDropdown(!showAdminDropdown);
                      setShowUserDropdown(false);
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>Admin</span>
                    <ChevronIcon $isOpen={showAdminDropdown}>
                      <ChevronDown size={14} />
                    </ChevronIcon>
                  </DropdownButton>

                  {showAdminDropdown && (
                    <>
                      <DropdownOverlay onClick={() => setShowAdminDropdown(false)} />
                      <DropdownMenu>
                        <DropdownItem>
                          <DropdownLink
                            href="/dashboard"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <LayoutDashboard size={16} />
                            Pannello di controllo
                          </DropdownLink>
                        </DropdownItem>
                        <DropdownItem>
                          <DropdownLink
                            href="/productlist"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <Package size={16} />
                            Prodotti
                          </DropdownLink>
                        </DropdownItem>
                        <DropdownItem>
                          <DropdownLink
                            href="/orderlist"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <Activity size={16} />
                            Ordini
                          </DropdownLink>
                        </DropdownItem>
                        <DropdownItem>
                          <DropdownLink
                            href="/userlist"
                            onClick={() => setShowAdminDropdown(false)}
                          >
                            <Users size={16} />
                            Utenti
                          </DropdownLink>
                        </DropdownItem>
                      </DropdownMenu>
                    </>
                  )}
                </DropdownContainer>
              )}
            </RightSection>
          </HeaderRow>

          {/* Mobile search bar */}
          <MobileSearchWrapper>
            <SearchBox />
          </MobileSearchWrapper>
        </HeaderContent>

        <HeaderBorder />
      </HeaderContainer>

      <PostHeader />
    </>
  );
}

export default Header;
