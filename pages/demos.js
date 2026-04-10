import Layout from '../components/Layout';

export default function Demos() {
  const DEMOS = [
    {href:'/demo/bella',   bg:'linear-gradient(135deg,#FFEAE8,#FFD0CB)', img:'/images/img_1.webp', alt:'Salon de beauté',   vertical:'Beauté',              name:'Salon de beauté',         desc:'Coupe, couleur, nail, soins. Roue de fidélité et offres flash.',                             live:true},
    {href:'/demo/barber',  bg:'linear-gradient(135deg,#E8E4F0,#CFC8E8)', img:'/images/img_2.webp', alt:'Barber shop',       vertical:'Homme',               name:'Barber shop',             desc:'Coupe homme, barbe, soins. Interface moderne et masculine.'},
    {href:'/demo/spa',     bg:'linear-gradient(135deg,#E0F4F0,#B8E8E0)', img:'/images/img_3.webp', alt:'Spa',               vertical:'Bien-être',           name:'Spa & Massage',           desc:'Massages, soins corps. Carte de fidélité et roue intégrées.'},
    {href:'/demo/resto',   bg:'linear-gradient(135deg,#FFF5DC,#FFE8A0)', img:'/images/img_4.webp', alt:'Restaurant',        vertical:'Restauration',        name:'Restaurant & Café',       desc:'Menu, offres spéciales, fidélité pour les habitués.'},
    {href:'/demo/gym',     bg:'linear-gradient(135deg,#E8F5E0,#C8E8B0)', img:'/images/img_5.webp', alt:'Gym',               vertical:'Sport',               name:'Salle de sport & Yoga',   desc:'Cours, abonnements, promos. Fidélisez vos membres.'},
    {href:'/demo/paw',     bg:'linear-gradient(135deg,#FFF0DC,#FFE0A8)', img:'/images/img_6.webp', alt:'Pet care',          vertical:'Animaux',             name:'Grooming & Pet care',     desc:'Bain, coupe, soins. Restez en contact avec vos clients.',      imgPos:'50% 15%'},
    {href:'/demo/karaoke', bg:'linear-gradient(135deg,#F0E8FF,#D8C8F0)', img:'/images/img_7.webp', alt:'Karaoke',           vertical:'Divertissement',      name:'Karaoké & Billiards',     desc:'Réservez une salle, fidélisez vos habitués.'},
    {href:'/demo/fashion', bg:'linear-gradient(135deg,#FAE8EF,#F0C8D8)', img:'/images/img_8.webp', alt:'Boutique',          vertical:'Boutique & Commerce', name:'Votre boutique sur Zalo', desc:'Vêtements, accessoires, cosmétiques. Présentez vos produits et gardez le contact.'},
  ];
  return (
    <Layout title="Démos — VietMini">

      <div style={{background:'var(--cream)',padding:'80px 48px 48px',textAlign:'center'}}>
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',marginBottom:'20px'}}>
            <span style={{display:'block',width:'24px',height:'2px',background:'var(--red)'}}></span>
            <span style={{fontSize:'11px',fontWeight:800,color:'var(--red)',textTransform:'uppercase',letterSpacing:'1.5px'}}>Démos</span>
          </div>
          <h1 style={{fontSize:'clamp(32px,4vw,52px)',fontWeight:900,lineHeight:1.1,letterSpacing:'-1px',marginBottom:'20px',color:'#1A0A00'}}>Votre commerce,<br />votre page Zalo.</h1>
          <p style={{fontSize:'17px',color:'var(--mid)',lineHeight:1.7,maxWidth:'560px',margin:'0 auto'}}>Cliquez sur un exemple — c&rsquo;est exactement ce que voient vos clients quand ils ouvrent votre page Zalo.</p>
        </div>
      </div>

      <section style={{padding:'48px',background:'var(--cream-2)'}}>
        <div className="section-inner">
          <div className="demos-grid">
            {DEMOS.map((d,i) => (
              <a key={i} href={d.href} className="demo-card">
                <div className="demo-thumb" style={{background:d.bg,padding:0,overflow:'hidden'}}>
                  <img src={d.img} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:d.imgPos||'center'}} alt={d.alt} />
                </div>
                <div className="demo-body">
                  <div className="demo-vertical">{d.vertical}</div>
                  <div className="demo-name">{d.name}</div>
                  <div className="demo-desc">{d.desc}</div>
                  <div className="demo-footer">
                    <span className="demo-link">Voir l&rsquo;exemple</span>
                    {d.live && <span className="demo-live">En ligne</span>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <div style={{background:'linear-gradient(135deg,#2D1200 0%,#4A1800 100%)',padding:'100px 48px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle, rgba(245,166,35,0.07) 1.5px, transparent 1.5px)',backgroundSize:'32px 32px',pointerEvents:'none'}}></div>
        <div style={{position:'relative'}}>
          <h2 style={{color:'white',marginBottom:'16px',fontSize:'clamp(28px,3.5vw,48px)',fontWeight:900,letterSpacing:'-1px',lineHeight:1.1}}>Un de ces exemples vous correspond ?</h2>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.45)',marginBottom:'44px'}}>Votre page Zalo peut être prête en moins de 5 minutes.</p>
          <a href="/register" className="btn-hero" style={{display:'inline-block'}}>Créer mon compte gratuitement &rarr;</a>
        </div>
      </div>

    </Layout>
  );
}