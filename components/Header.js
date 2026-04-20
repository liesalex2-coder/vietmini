import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const NAV = [
  { label: 'Cách hoạt động', href: '/comment-ca-marche' },
  { label: 'Demo', href: '/demos' },
  { label: 'Bảng giá', href: '/tarifs' },
  { label: 'Liên hệ', href: '/contact' },
  { label: 'Đăng nhập', href: '/login' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [router.asPath]);

  const isActive = (href) => {
    if (href === '/#features') return router.pathname === '/';
    return router.pathname === href;
  };

  return (
    <>
      <header className={scrolled ? 'scrolled' : ''}>
        <div className="inner">

          {/* Logo */}
          <Link href="/" className="logo">
            <span className="logo-mark">V</span>
            <span className="logo-text">VietMini</span>
          </Link>

          {/* Nav desktop */}
          <nav className="nav-desktop">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${isActive(item.href) ? ' active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="actions">
            <Link href="/register" className="cta-btn">Tạo tài khoản</Link>
            <button
              className={`hamburger${open ? ' open' : ''}`}
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Nav mobile */}
        <div className={`nav-mobile${open ? ' open' : ''}`}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-link${isActive(item.href) ? ' active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/login" className="mobile-link">Đăng nhập</Link>
          <Link href="/register" className="mobile-cta">Tạo tài khoản</Link>
        </div>
      </header>

      <style jsx>{`
        header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #FDF6EE;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        header.scrolled {
          border-color: rgba(122, 74, 42, 0.12);
          box-shadow: 0 2px 16px rgba(26, 10, 0, 0.06);
        }

        .inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 32px;
        }

        /* Logo */
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-mark {
          width: 32px;
          height: 32px;
          background: #D0021B;
          color: #FDF6EE;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-weight: 800;
          font-size: 18px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .logo-text {
          font-family: 'Be Vietnam Pro', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #1A0A00;
          letter-spacing: -0.3px;
        }

        /* Nav desktop */
        .nav-desktop {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
        }
        .nav-link {
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #7A4A2A;
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 8px;
          transition: color 0.15s, background 0.15s;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: #1A0A00;
          background: rgba(122, 74, 42, 0.07);
        }
        .nav-link.active {
          color: #D0021B;
          font-weight: 600;
        }

        /* Actions */
        .actions {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }
        .cta-btn {
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #FDF6EE;
          background: #D0021B;
          text-decoration: none;
          padding: 8px 18px;
          border-radius: 10px;
          transition: opacity 0.15s, transform 0.15s;
          white-space: nowrap;
        }
        .cta-btn:hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px;
          height: 36px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 8px;
        }
        .hamburger:hover {
          background: rgba(122, 74, 42, 0.07);
        }
        .hamburger span {
          display: block;
          height: 2px;
          background: #1A0A00;
          border-radius: 2px;
          transition: transform 0.22s, opacity 0.22s;
          transform-origin: center;
        }
        .hamburger.open span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }
        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }
        .hamburger.open span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* Nav mobile */
        .nav-mobile {
          display: none;
          flex-direction: column;
          background: #FDF6EE;
          border-top: 1px solid rgba(122, 74, 42, 0.12);
          padding: 8px 16px 16px;
          gap: 2px;
        }
        .nav-mobile.open {
          display: flex;
        }
        .mobile-link {
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #7A4A2A;
          text-decoration: none;
          padding: 11px 12px;
          border-radius: 10px;
          transition: background 0.15s, color 0.15s;
        }
        .mobile-link:hover {
          background: rgba(122, 74, 42, 0.07);
          color: #1A0A00;
        }
        .mobile-link.active {
          color: #D0021B;
          font-weight: 600;
        }
        .mobile-cta {
          display: block;
          font-family: 'Be Vietnam Pro', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #FDF6EE;
          background: #D0021B;
          text-decoration: none;
          padding: 12px;
          border-radius: 10px;
          text-align: center;
          margin-top: 8px;
          transition: opacity 0.15s;
        }
        .mobile-cta:hover {
          opacity: 0.88;
        }

        /* Responsive */
        @media (max-width: 860px) {
          .nav-desktop { display: none; }
          .hamburger { display: flex; }
          .cta-btn { display: none; }
        }
        @media (max-width: 480px) {
          .inner { padding: 0 16px; }
        }
      `}</style>
    </>
  );
}