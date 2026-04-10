import Layout from '../components/Layout';

export default function CommentCaMarche() {
  return (
    <Layout title="Comment ça marche — VietMini">

      <div style={{background:'var(--cream)',padding:'80px 48px 48px',textAlign:'center'}}>
        <div style={{maxWidth:'700px',margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:'8px',marginBottom:'20px'}}>
            <span style={{display:'block',width:'24px',height:'2px',background:'var(--red)'}}></span>
            <span style={{fontSize:'11px',fontWeight:800,color:'var(--red)',textTransform:'uppercase',letterSpacing:'1.5px'}}>Comment ça marche</span>
          </div>
          <h1 style={{fontSize:'clamp(32px,4vw,52px)',fontWeight:900,lineHeight:1.1,letterSpacing:'-1px',marginBottom:'20px',color:'#1A0A00'}}>Votre page Zalo<br />est prête le jour même.</h1>
          <p style={{fontSize:'17px',color:'var(--mid)',lineHeight:1.7,maxWidth:'560px',margin:'0 auto'}}>Pas besoin de savoir comment Zalo fonctionne. Pas besoin de compétences techniques. On s&rsquo;occupe de tout.</p>
        </div>
      </div>

      <section className="how" style={{padding:'80px 48px'}}>
        <div className="section-inner">
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <h3>Vous créez votre compte</h3>
              <p>Vous choisissez votre type de commerce, vous ajoutez votre nom, votre logo, vos services. C&rsquo;est tout.</p>
              <div className="step-arrow">&rarr;</div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>Vos clients rejoignent votre liste en un geste</h3>
              <p>Dès qu&rsquo;un client passe dans votre commerce, il peut vous suivre sur Zalo en quelques secondes. Votre liste de contacts grandit automatiquement, sans effort de votre part.</p>
              <div className="step-arrow">&rarr;</div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>Vous gérez depuis votre téléphone</h3>
              <p>Envoyez une promo, activez une offre flash, regardez qui a rejoint — tout depuis votre tableau de bord, aussi simple que WhatsApp.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{background:'#1A0A00',padding:'80px 48px'}}>
        <div style={{maxWidth:'1200px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'16px'}}>
            <span style={{display:'block',width:'24px',height:'2px',background:'#F5A623'}}></span>
            <span style={{fontSize:'11px',fontWeight:800,color:'#F5A623',textTransform:'uppercase',letterSpacing:'1.5px'}}>Pourquoi Zalo</span>
          </div>
          <h2 style={{fontSize:'clamp(28px,3.5vw,46px)',fontWeight:900,color:'#fff',lineHeight:1.1,letterSpacing:'-1px',marginBottom:'20px'}}>Le seul canal où vous parlez<br />vraiment à vos clients.</h2>
          <p style={{fontSize:'16px',color:'rgba(255,255,255,0.5)',maxWidth:'620px',lineHeight:1.7,marginBottom:'48px'}}>Au Vietnam, Zalo c&rsquo;est la messagerie de tout le monde — famille, amis, collègues. Quand vous envoyez un message, il arrive dans la même appli qu&rsquo;ils utilisent toute la journée.</p>
          <div style={{display:'flex',gap:'48px',marginBottom:'48px',padding:'32px 40px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'20px',flexWrap:'wrap'}}>
            {[['74M','Vietnamiens utilisent Zalo chaque jour'],['#1','Application de messagerie au Vietnam'],['~80%','des messages envoyés sont lus par les clients']].map(([n,l],i) => (
              <div key={i} style={{flex:1,minWidth:'140px'}}>
                <div style={{fontSize:'38px',fontWeight:900,color:'#F5A623',letterSpacing:'-1.5px',lineHeight:1,marginBottom:'8px'}}>{n}</div>
                <div style={{fontSize:'13px',color:'rgba(255,255,255,0.45)',lineHeight:1.5,fontWeight:500}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{background:'rgba(245,166,35,0.1)',border:'1px solid rgba(245,166,35,0.25)',borderRadius:'16px',padding:'28px 36px',display:'flex',gap:'20px',alignItems:'flex-start'}}>
            <span style={{fontSize:'28px',flexShrink:0}}>💬</span>
            <div>
              <p style={{color:'#fff',fontWeight:700,fontSize:'16px',marginBottom:'8px'}}>Zalo arrive directement dans la boîte de messages de votre client.</p>
              <p style={{color:'rgba(255,255,255,0.5)',fontSize:'14px',lineHeight:1.7,margin:0}}>Pas dans un fil d&rsquo;actualité. Pas dans les spams. Dans la même conversation que sa famille et ses amis.</p>
            </div>
          </div>
        </div>
      </section>

      <div style={{background:'linear-gradient(135deg,#2D1200 0%,#4A1800 100%)',padding:'100px 48px',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle, rgba(245,166,35,0.07) 1.5px, transparent 1.5px)',backgroundSize:'32px 32px',pointerEvents:'none'}}></div>
        <div style={{position:'relative'}}>
          <h2 style={{color:'white',marginBottom:'16px',fontSize:'clamp(28px,3.5vw,48px)',fontWeight:900,letterSpacing:'-1px',lineHeight:1.1}}>Prêt à démarrer ?</h2>
          <p style={{fontSize:'18px',color:'rgba(255,255,255,0.45)',marginBottom:'44px'}}>Votre page Zalo est opérationnelle en moins de 5 minutes.</p>
          <a href="/register" className="btn-hero" style={{display:'inline-block'}}>Créer mon compte gratuitement &rarr;</a>
        </div>
      </div>

    </Layout>
  );
}