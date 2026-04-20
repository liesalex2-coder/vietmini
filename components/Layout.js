import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, title = 'VietMini — Cửa hàng của bạn trên Zalo', description = 'VietMini đưa cửa hàng của bạn lên Zalo chỉ trong vài phút.' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>
      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --red:      #D0021B;
          --red-2:    #E8173A;
          --gold:     #F5A623;
          --orange:   #F26522;
          --cream:    #FDF6EE;
          --cream-2:  #FFF9F2;
          --warm:     #F7EFE4;
          --dark:     #1A0A00;
          --dark-2:   #2D1200;
          --mid:      #7A4A2A;
          --light-txt:#B07050;
          --white:    #FFFFFF;
          --border:   #E8D5C0;
          --font:     'Be Vietnam Pro', sans-serif;
          --radius:   16px;
          --shadow:   0 4px 20px rgba(160,60,0,0.10);
          --shadow-lg:0 12px 48px rgba(160,60,0,0.16);
        }
        html { scroll-behavior: smooth; }
        body { font-family: var(--font); color: var(--dark); background: var(--cream); line-height: 1.6; -webkit-font-smoothing: antialiased; }

        nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px; height: 68px;
          background: rgba(253,246,238,0.95); backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo { font-size: 22px; font-weight: 900; color: var(--dark); text-decoration: none; }
        .nav-logo span { color: var(--red); }
        .nav-links { display: flex; gap: 32px; }
        .nav-links a { font-size: 14px; font-weight: 500; color: var(--mid); text-decoration: none; transition: color .2s; }
        .nav-links a:hover { color: var(--dark); }
        .nav-actions { display: flex; align-items: center; gap: 12px; }
        .btn-ghost { padding: 9px 22px; font-family: var(--font); font-size: 14px; font-weight: 600; color: var(--dark); background: none; border: 1.5px solid var(--border); border-radius: 10px; cursor: pointer; text-decoration: none; transition: all .2s; }
        .btn-ghost:hover { border-color: var(--red); color: var(--red); }
        .btn-primary { padding: 9px 22px; font-family: var(--font); font-size: 14px; font-weight: 700; color: var(--white); background: var(--red); border: none; border-radius: 10px; cursor: pointer; text-decoration: none; transition: background .2s, transform .15s; }
        .btn-primary:hover { background: var(--red-2); transform: translateY(-1px); }

        /* HERO */
        .hero {
          min-height: calc(100vh - 68px);
          display: flex; align-items: center;
          padding: 60px 48px;
          background: var(--dark);
          position: relative; overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 600px 500px at 90% 60%, rgba(245,166,35,0.10) 0%, transparent 70%),
            radial-gradient(ellipse 400px 400px at 5% 90%, rgba(208,2,27,0.12) 0%, transparent 60%);
        }
        .hero-pattern {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 32px 32px; pointer-events: none;
        }
        .hero-inner { max-width: 1200px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; position: relative; z-index: 1; }

        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(245,166,35,0.15); color: var(--gold);
          font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 999px;
          margin-bottom: 32px; border: 1px solid rgba(245,166,35,0.3);
        }
        h1 { font-size: clamp(38px, 4.5vw, 60px); font-weight: 900; line-height: 1.1; letter-spacing: -2px; color: var(--white); margin-bottom: 28px; }
        h1 em { font-style: normal; color: var(--gold); }
        .hero-sub { font-size: 18px; color: rgba(255,255,255,0.55); line-height: 1.8; margin-bottom: 12px; max-width: 500px; }
        .hero-sub strong { color: rgba(255,255,255,0.9); font-weight: 700; }
        .hero-insight {
          display: flex; align-items: flex-start; gap: 14px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; padding: 18px 20px; margin: 28px 0 40px; max-width: 500px;
        }
        .hero-insight-icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
        .hero-insight p { font-size: 15px; color: rgba(255,255,255,0.7); line-height: 1.65; }
        .hero-insight p strong { color: var(--gold); font-weight: 700; }
        .hero-cta { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .btn-hero {
          padding: 15px 36px; font-family: var(--font); font-size: 16px; font-weight: 800;
          color: var(--white); background: linear-gradient(135deg, var(--red), var(--orange));
          border: none; border-radius: 12px; cursor: pointer; text-decoration: none;
          box-shadow: 0 6px 28px rgba(208,2,27,0.4); transition: transform .2s, box-shadow .2s;
        }
        .btn-hero:hover { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(208,2,27,0.55); }
        .hero-link { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.4); text-decoration: none; transition: color .2s; }
        .hero-link:hover { color: rgba(255,255,255,0.8); }

        /* Phone mockup */
        .hero-visual { position: relative; display: flex; justify-content: center; align-items: center; }
        .phone-wrap { position: relative; }
        .phone-frame {
          width: 272px; height: 540px;
          background: #0D0D0D; border-radius: 44px;
          padding: 0;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08);
          overflow: hidden;
        }
        .phone-notch { width: 88px; height: 24px; background: #000; border-radius: 16px; margin: 0 auto 14px; display: block; }
        .phone-screen { width: 100%; height: calc(100% - 38px); background: #F9F5F0; border-radius: 30px; overflow: hidden; }
        .phone-header { background: linear-gradient(135deg, var(--red), #A80015); padding: 14px 16px 12px; display: flex; align-items: center; gap: 10px; }
        .phone-avatar { width: 36px; height: 36px; background: rgba(255,255,255,0.25); border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.4); }
        .phone-biz { color: white; font-size: 11px; font-weight: 800; line-height: 1.3; }
        .phone-biz small { font-weight: 500; opacity: 0.8; display: block; font-size: 9px; }
        .phone-hero-img { background: linear-gradient(160deg, #FCEAEA 0%, #F5D0D0 100%); height: 96px; display: flex; align-items: center; justify-content: center; font-size: 38px; }
        .phone-promo { margin: 10px 10px 0; background: linear-gradient(135deg, #FFF3E0, #FFE8C8); border-radius: 10px; padding: 10px 12px; border-left: 3px solid var(--gold); }
        .phone-promo-label { font-size: 8px; font-weight: 800; color: var(--orange); text-transform: uppercase; letter-spacing: 0.5px; }
        .phone-promo-text { font-size: 10px; font-weight: 700; color: var(--dark); margin-top: 2px; }
        .phone-service-row { display: flex; gap: 6px; padding: 10px 10px 0; }
        .phone-svc { flex: 1; background: white; border-radius: 10px; padding: 9px 6px; text-align: center; box-shadow: 0 2px 8px rgba(160,60,0,0.08); }
        .phone-svc-icon { font-size: 18px; display: block; margin-bottom: 3px; }
        .phone-svc-name { font-size: 7.5px; color: var(--mid); font-weight: 700; }
        .phone-contact { margin: 10px 10px 0; background: linear-gradient(135deg, var(--red), var(--orange)); border-radius: 10px; padding: 11px 12px; color: white; font-size: 10px; font-weight: 800; text-align: center; }
        .phone-bubble {
          position: absolute; background: var(--white); border-radius: 14px; padding: 10px 14px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25); font-size: 12px; font-weight: 700; color: var(--dark); white-space: nowrap;
        }
        .phone-bubble small { display: block; font-size: 10px; font-weight: 500; color: var(--light-txt); margin-top: 1px; }
        .phone-bubble-1 { top: -14px; right: -36px; }
        .phone-bubble-2 { bottom: 28px; left: -48px; }
        .dot-green { width: 8px; height: 8px; background: #22C55E; border-radius: 50%; display: inline-block; margin-right: 5px; vertical-align: middle; }

        /* SECTIONS */
        section { padding: 96px 48px; }
        .section-inner { max-width: 1200px; margin: 0 auto; }
        .section-tag {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 800; color: var(--red);
          text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px;
        }
        .section-tag::before { content: ''; width: 24px; height: 2px; background: var(--red); border-radius: 2px; display: inline-block; }
        h2 { font-size: clamp(30px, 3vw, 44px); font-weight: 900; letter-spacing: -1px; margin-bottom: 16px; line-height: 1.15; }
        .section-sub { font-size: 17px; color: var(--mid); max-width: 580px; line-height: 1.75; }

        /* FICHIER CLIENTS */
        .fichier-clients { background: var(--white); padding: 96px 48px; }
        .fichier-clients .section-tag { color: var(--red); }
        .fichier-clients .section-tag::before { background: var(--red); }
        .fichier-clients h2 { color: var(--dark); }
        .fichier-clients .section-sub { color: var(--mid); }
        .fichier-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 56px; }
        .fichier-card { border-radius: 20px; padding: 36px 32px; background: var(--cream-2); border: 1.5px solid var(--border); transition: transform .2s, box-shadow .2s; }
        .fichier-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
        .fichier-icon { font-size: 40px; margin-bottom: 20px; display: block; }
        .fichier-img { width: 100%; height: 200px; border-radius: 12px; overflow: hidden; margin-bottom: 20px; }
        .fichier-img img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
        .fichier-card h3 { font-size: 19px; font-weight: 800; color: var(--dark); margin-bottom: 12px; }
        .fichier-card p { font-size: 15px; color: var(--mid); line-height: 1.75; }

        /* CE QUE CA FAIT */
        .features { background: var(--white); }
        .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 56px; }
        .feature-card {
          padding: 36px; background: var(--cream-2); border-radius: 20px;
          border: 1.5px solid var(--border); transition: transform .2s, box-shadow .2s;
        }
        .feature-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
        .feature-card.big { grid-column: span 2; display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: center; background: linear-gradient(135deg, #FFF5F5, #FFF0E8); border-color: rgba(208,2,27,0.2); }
        .feature-icon { font-size: 40px; margin-bottom: 20px; }
        .feature-card h3 { font-size: 20px; font-weight: 800; margin-bottom: 10px; }
        .feature-card p { font-size: 15px; color: var(--mid); line-height: 1.7; }
        .feature-visual { background: var(--white); border-radius: 16px; padding: 20px; box-shadow: var(--shadow); }

        /* COMMENT */
        .how { background: var(--cream); }
        .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 56px; }
        .step { padding: 40px 36px; background: var(--white); position: relative; transition: background .2s; }
        .step:first-child { border-radius: 20px 0 0 20px; }
        .step:last-child { border-radius: 0 20px 20px 0; }
        .step:hover { background: var(--warm); }
        .step-num { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, var(--red), var(--orange)); color: white; font-size: 22px; font-weight: 900; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 4px 16px rgba(208,2,27,0.3); }
        .step h3 { font-size: 19px; font-weight: 800; margin-bottom: 12px; }
        .step p { font-size: 15px; color: var(--mid); line-height: 1.75; }
        .step-arrow { position: absolute; top: 50px; right: -18px; width: 36px; height: 36px; background: var(--cream); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; color: var(--red); z-index: 2; box-shadow: 0 2px 8px rgba(160,60,0,0.12); }

        /* DÉMOS */
        .demos { background: var(--white); }
        .demos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 56px; }
        .demo-card { background: var(--cream-2); border-radius: 18px; overflow: hidden; text-decoration: none; color: var(--dark); border: 1.5px solid var(--border); transition: transform .25s, box-shadow .25s; display: block; box-shadow: var(--shadow); }
        .demo-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
        .demo-thumb { height: 160px; display: flex; align-items: center; justify-content: center; font-size: 58px; }
        .demo-body { padding: 20px; }
        .demo-vertical { font-size: 11px; font-weight: 800; color: var(--red); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; }
        .demo-name { font-size: 17px; font-weight: 800; margin-bottom: 6px; }
        .demo-desc { font-size: 13px; color: var(--mid); line-height: 1.6; }
        .demo-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border); }
        .demo-link { font-size: 13px; font-weight: 700; color: var(--red); }
        .demo-link::after { content: ' →'; }
        .demo-live { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: #16A34A; background: #F0FDF4; padding: 4px 10px; border-radius: 999px; }
        .demo-live::before { content: ''; width: 6px; height: 6px; background: #22C55E; border-radius: 50%; }

        /* PRICING */
        .pricing { background: var(--cream); }
        .plan { padding: 44px 40px; border-radius: 20px; border: 2px solid var(--border); position: relative; background: var(--white); transition: box-shadow .25s; }
        .plan:hover { box-shadow: var(--shadow-lg); }
        .plan-popular { border-color: var(--red); background: linear-gradient(160deg, #FFF9F2, #FFF2EC); }
        .plan-name { font-size: 13px; font-weight: 800; color: var(--light-txt); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px; }
        .plan-price { display: flex; align-items: baseline; gap: 2px; margin-bottom: 8px; justify-content: center; }
        .plan-price .num { font-size: 42px; font-weight: 900; letter-spacing: -2px; color: var(--dark); line-height: 1; }
        .plan-desc { font-size: 14px; color: var(--mid); margin-bottom: 28px; line-height: 1.6; }
        .plan-features { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 36px; }
        .plan-features li { font-size: 14px; display: flex; align-items: flex-start; gap: 10px; font-weight: 500; }
        .plan-features li::before { content: ''; min-width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; margin-top: 1px; background: #FEF3C7 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M2 6l3 3 5-5' stroke='%23D0021B' stroke-width='1.8' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center/10px no-repeat; }
        .plan-cta { display: block; text-align: center; width: 100%; padding: 15px; font-family: var(--font); font-size: 15px; font-weight: 800; border-radius: 12px; text-decoration: none; transition: .2s; cursor: pointer; border: none; }
        .plan-cta-solid { background: linear-gradient(135deg, var(--red), var(--orange)); color: white; box-shadow: 0 6px 24px rgba(208,2,27,0.3); }
        .plan-cta-solid:hover { box-shadow: 0 10px 32px rgba(208,2,27,0.4); transform: translateY(-1px); }

        /* POURQUOI ZALO */
        .why-zalo { background: var(--dark); padding: 96px 48px; }
        .why-zalo .section-tag { color: var(--gold); }
        .why-zalo .section-tag::before { background: var(--gold); }
        .why-zalo h2 { color: var(--white); }
        .why-zalo .section-sub { color: rgba(255,255,255,0.5); max-width: 620px; }
        .zalo-stats { display: flex; gap: 48px; margin: 48px 0 64px; padding: 32px 40px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; flex-wrap: wrap; }
        .zalo-stat { flex: 1; min-width: 140px; }
        .zalo-stat-num { font-size: 38px; font-weight: 900; color: var(--gold); letter-spacing: -1.5px; line-height: 1; margin-bottom: 8px; }
        .zalo-stat-label { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.5; font-weight: 500; }

        /* CTA FINAL */
        .cta-final { background: linear-gradient(135deg, var(--dark-2) 0%, #4A1800 100%); padding: 100px 48px; text-align: center; position: relative; overflow: hidden; }
        .cta-final::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(circle, rgba(245,166,35,0.07) 1.5px, transparent 1.5px); background-size: 32px 32px; pointer-events: none; }
        .cta-final h2 { color: white; margin-bottom: 16px; position: relative; }
        .cta-final p { font-size: 18px; color: rgba(255,255,255,0.45); margin-bottom: 44px; position: relative; }

        footer { background: var(--dark); padding: 44px 48px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .footer-logo { font-size: 18px; font-weight: 900; color: white; }
        .footer-logo span { color: var(--gold); }
        .footer-copy { font-size: 13px; color: rgba(255,255,255,0.35); }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        .fade-up   { animation: fadeUp .7s ease both; }
        .fade-up-2 { animation: fadeUp .7s .12s ease both; }
        .fade-up-3 { animation: fadeUp .7s .24s ease both; }

        /* DASHBOARD */
        .dashboard { background: var(--cream); }
        .dashboard-layout { display: grid; grid-template-columns: 1fr 1.5fr; gap: 80px; align-items: center; margin-top: 64px; }
        .dashboard-pitch { display: flex; flex-direction: column; gap: 28px; }
        .dash-feature { display: flex; align-items: flex-start; gap: 16px; padding: 20px; border-radius: 16px; background: var(--white); border: 1.5px solid var(--border); transition: border-color .2s, box-shadow .2s; }
        .dash-feature:hover { border-color: var(--red); box-shadow: var(--shadow); }
        .dash-feat-icon { font-size: 26px; flex-shrink: 0; margin-top: 2px; }
        .dash-feat-text h4 { font-size: 15px; font-weight: 800; margin-bottom: 4px; }
        .dash-feat-text p { font-size: 13px; color: var(--mid); line-height: 1.6; }
        .browser-wrap { background: var(--white); border-radius: 20px; box-shadow: 0 24px 80px rgba(160,60,0,0.14); border: 1.5px solid var(--border); overflow: hidden; }
        .browser-bar { background: var(--warm); padding: 12px 16px; display: flex; align-items: center; gap: 10px; border-bottom: 1.5px solid var(--border); }
        .browser-dots { display: flex; gap: 6px; }
        .browser-dot { width: 11px; height: 11px; border-radius: 50%; }
        .browser-dot-r { background: #FF5F57; }
        .browser-dot-y { background: #FFBD2E; }
        .browser-dot-g { background: #28C840; }
        .browser-url { flex: 1; background: var(--white); border-radius: 6px; padding: 5px 12px; font-size: 11px; color: var(--mid); font-weight: 500; border: 1px solid var(--border); display: flex; align-items: center; gap: 6px; }
        .browser-body { background: #F4F0EC; padding: 16px; }
        .dash-inner { background: var(--white); border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(160,60,0,0.07); }
        .dash-topbar { background: var(--dark); padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; }
        .dash-topbar-logo { font-size: 13px; font-weight: 900; color: white; }
        .dash-topbar-logo span { color: var(--gold); }
        .dash-topbar-biz { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; }
        .dash-topbar-pill { background: rgba(245,166,35,0.15); color: var(--gold); font-size: 10px; font-weight: 700; padding: 4px 12px; border-radius: 999px; border: 1px solid rgba(245,166,35,0.3); }
        .dash-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 14px; }
        .dash-card { background: var(--cream-2); border-radius: 10px; border: 1.5px solid var(--border); padding: 14px 12px; transition: transform .15s; }
        .dash-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
        .dash-card-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .dash-card-icon { font-size: 20px; }
        .dash-toggle { width: 30px; height: 16px; border-radius: 999px; background: #DDD; position: relative; cursor: pointer; transition: background .2s; }
        .dash-toggle.on { background: linear-gradient(135deg, var(--red), var(--orange)); }
        .dash-toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 12px; height: 12px; border-radius: 50%; background: white; transition: left .2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
        .dash-toggle.on::after { left: 16px; }
        .dash-card-name { font-size: 10px; font-weight: 800; color: var(--dark); margin-bottom: 2px; }
        .dash-card-desc { font-size: 9px; color: var(--mid); line-height: 1.4; }
        .dash-card-btn { margin-top: 10px; display: block; width: 100%; padding: 6px; text-align: center; font-size: 9px; font-weight: 700; border-radius: 6px; border: 1.5px solid var(--border); color: var(--mid); background: none; cursor: pointer; transition: .2s; }
        .dash-card-btn:hover { border-color: var(--red); color: var(--red); }
        .dash-card.active { border-color: rgba(208,2,27,0.25); background: #FFF5F5; }
        .dash-footer-bar { padding: 10px 14px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--cream-2); }
        .dash-footer-txt { font-size: 10px; color: var(--mid); }
        .dash-footer-btn { padding: 6px 14px; font-size: 10px; font-weight: 700; background: linear-gradient(135deg, var(--red), var(--orange)); color: white; border: none; border-radius: 6px; cursor: pointer; }

        /* Responsive déplacé dans styles/globals.css pour fiabilité
           (évite edge cases styled-jsx avec @media globales) */
      `}</style>
      <Header />
      {children}
      <Footer />
    </>
  );
}