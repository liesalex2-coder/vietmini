import Layout from '../components/Layout';
import { useState } from 'react';

export default function Tarifs() {
  const [openFaq, setOpenFaq] = useState(null);
  const FAQS = [
    ["Est-ce que mes clients ont besoin de télécharger une application ?", "Non. Vos clients accèdent à votre page directement depuis Zalo, qu'ils utilisent déjà tous les jours. Aucun téléchargement, aucune inscription supplémentaire."],
    ["Combien de temps pour être en ligne ?", "Moins de 5 minutes si vous avez vos informations prêtes. Nom, logo, liste de services — et c'est parti."],
    ["Que se passe-t-il à la fin de l'abonnement ?", "Votre page reste accessible jusqu'à la date d'expiration. Passé ce délai, elle est désactivée. Vous pouvez renouveler à tout moment pour la réactiver."],
    ["Que se passe-t-il si je change de type de commerce ?", "On met à jour votre page. Contactez-nous et on s'en occupe."],
  ];
  return (
    <Layout title="Tarifs — VietMini">

      <div style={{background:'var(--cream)',padding:'80px 48px 48px',textAlign:'center'}}>
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',marginBottom:'20px'}}>
            <span style={{display:'block',width:'24px',height:'2px',background:'var(--red)'}}></span>
            <span style={{fontSize:'11px',fontWeight:800,color:'var(--red)',textTransform:'uppercase',letterSpacing:'1.5px'}}>Tarifs</span>
          </div>
          <h1 style={{fontSize:'clamp(32px,4vw,52px)',fontWeight:900,lineHeight:1.1,letterSpacing:'-1px',marginBottom:'20px',color:'#1A0A00'}}>Un prix.<br />Tout inclus.</h1>
          <p style={{fontSize:'17px',color:'var(--mid)',lineHeight:1.7,maxWidth:'500px',margin:'0 auto'}}>Un abonnement annuel unique. Toutes les fonctionnalités, sans limitation, sans surprise.</p>
        </div>
      </div>

      <section style={{padding:'64px 48px 96px',background:'var(--cream-2)'}}>
        <div style={{maxWidth:'520px',margin:'0 auto'}}>
          <div className="plan plan-popular" style={{textAlign:'center'}}>
            <div className="plan-name">Abonnement annuel</div>
            <div className="plan-price"><span className="num">2.000.000 ₫ HT</span></div>
            <div style={{fontSize:'14px',color:'var(--light-txt)',marginTop:'4px',marginBottom:'16px'}}>par an — soit moins de 170.000 ₫ HT par mois</div>
            <p className="plan-desc">Votre présence complète sur Zalo, toute l&rsquo;année.</p>
            <ul className="plan-features" style={{textAlign:'left'}}>
              <li>Votre vitrine sur Zalo, à votre image</li>
              <li>Envoyez une promo quand vous voulez</li>
              <li>La roue : vos clients jouent et gagnent des réductions</li>
              <li>Offres flash avec compte à rebours</li>
              <li>Carte de points pour faire revenir les habitués</li>
              <li>Vos plus belles photos mises en avant</li>
              <li>Gérez tout depuis votre téléphone</li>
            </ul>
            <a href="/register" className="plan-cta plan-cta-solid">Démarrer maintenant</a>
          </div>

          <div style={{marginTop:'48px'}}>
            <h2 style={{fontSize:'22px',fontWeight:800,marginBottom:'24px',color:'var(--dark)'}}>Questions fréquentes</h2>
            {FAQS.map(([q,a],i) => (
              <div key={i} style={{borderBottom:'1px solid var(--border)',paddingBottom:'16px',marginBottom:'16px'}}>
                <button onClick={() => setOpenFaq(openFaq===i?null:i)} style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',background:'none',border:'none',cursor:'pointer',textAlign:'left',padding:'8px 0',fontFamily:'var(--font)'}}>
                  <span style={{fontWeight:700,fontSize:'15px',color:'var(--dark)'}}>{q}</span>
                  <span style={{fontSize:'20px',color:'var(--red)',flexShrink:0,marginLeft:'12px'}}>{openFaq===i?'−':'+'}</span>
                </button>
                {openFaq===i && <p style={{fontSize:'14px',color:'var(--mid)',lineHeight:1.7,marginTop:'8px',margin:0}}>{a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{background:'linear-gradient(135deg,#2D1200 0%,#4A1800 100%)',padding:'100px 48px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle, rgba(245,166,35,0.07) 1.5px, transparent 1.5px)',backgroundSize:'32px 32px',pointerEvents:'none'}}></div>
        <div style={{position:'relative'}}>
          <h2 style={{color:'white',marginBottom:'16px',fontSize:'clamp(28px,3.5vw,48px)',fontWeight:900,letterSpacing:'-1px',lineHeight:1.1}}>Vos clients sont sur Zalo. Rejoignez-les.</h2>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.45)',marginBottom:'44px'}}>Votre page Zalo est opérationnelle en moins de 5 minutes.</p>
          <a href="/register" className="btn-hero" style={{display:'inline-block'}}>Créer mon compte gratuitement &rarr;</a>
        </div>
      </div>

    </Layout>
  );
}