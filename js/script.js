/* Grime Goddess Co. — shared behavior */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* EDIT: set EMAIL to receive booking requests by email. Left blank, requests are sent as a text message to PHONE. */
const CONFIG={phone:'15203392001',email:''};

/* EDIT: placeholder pricing used by the instant quote calculator */
const PRICE={
  base:{standard:120,deep:200,move:220,airbnb:100},
  perBed:15,perBath:25,
  sqft:[['Under 700 sq ft',.85],['700 to 1,200 sq ft',1],['1,200 to 1,800 sq ft',1.2],['1,800 to 2,500 sq ft',1.4],['2,500 to 3,500 sq ft',1.65],['3,500+ sq ft',1.9]],
  freq:{once:0,weekly:.15,biweekly:.10,monthly:.05},
  labels:{standard:'Standard / maintenance clean',deep:'Deep clean',move:'Move-in / move-out clean',airbnb:'Airbnb turnover'}
};

/* header, promo, menus */
const hd=$('header.top');addEventListener('scroll',()=>hd.classList.toggle('scrolled',scrollY>8),{passive:true});
$('.burger')?.addEventListener('click',e=>{const o=$('#nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)});
$('.dd>button')?.addEventListener('click',e=>{const d=e.currentTarget.parentElement;d.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',d.classList.contains('open'))});
$('.promo button')?.addEventListener('click',()=>$('.promo').remove());
$$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());

/* hero headline words rise in */
$$('[data-split]').forEach(el=>{let i=0;const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t.trim()){f.append(t);return}const o=document.createElement('span');o.className='w';o.innerHTML=`<span style="--i:${i++}">${t}</span>`;f.append(o)});c.replaceWith(f)}else walk(c)})};walk(el)});

/* counters + scroll reveal */
function count(el){const to=parseFloat(el.dataset.to),d=el.dataset.dec|0,t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1400),e=1-Math.pow(1-k,3);el.textContent=(to*e).toFixed(d)+(el.dataset.suf||'');if(k<1)requestAnimationFrame(f)})(t0)}
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('show');if(x.target.dataset.to)count(x.target);io.unobserve(x.target)}}),{threshold:.2});
$$('.rv,[data-to]').forEach(e=>io.observe(e));

/* magnetic buttons */
if(!reduce&&matchMedia('(hover:hover)').matches)$$('.btn').forEach(b=>{
  b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.28}px)`});
  b.addEventListener('pointerleave',()=>b.style.transform='')});

/* hero: iridescent bubbles that dodge the cursor and pop into sparkles on click, plus twinkling stars */
const cv=$('#fx');
if(cv&&!reduce){
  const c=cv.getContext('2d');let W,H,bub=[],spk=[],stars=[],mx=-999,my=-999,on=true,last=0;const dpr=Math.min(devicePixelRatio||1,2);
  const cols=[[242,166,192],[79,192,143],[216,176,74],[255,255,255]];
  const mk=(init)=>({x:Math.random()*W,y:init?Math.random()*H:H+40,r:8+Math.random()*34,v:.25+Math.random()*.7,p:Math.random()*6.28,c:cols[Math.random()*4|0]});
  function size(){const r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;c.setTransform(dpr,0,0,dpr,0,0);
    bub=Array.from({length:Math.round(W/(W<700?30:22))},()=>mk(true));stars=Array.from({length:Math.round(W/40)},()=>({x:Math.random()*W,y:Math.random()*H,s:2+Math.random()*5,p:Math.random()*6.28}))}
  size();addEventListener('resize',size);
  const host=cv.parentElement;
  host.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;const s=$('.sun');if(s)s.style.transform=`translate(${(mx/W-.5)*-50}px,${(my/H-.5)*-40}px)`});
  host.addEventListener('pointerleave',()=>mx=my=-999);
  function pop(b){for(let i=0;i<10;i++){const a=Math.random()*6.28,s=1+Math.random()*3;spk.push({x:b.x,y:b.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,c:b.c})}b.y=H+40;b.x=Math.random()*W}
  host.addEventListener('pointerdown',e=>{if(e.target.closest('a,button,input,select,.card'))return;const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;bub.forEach(b=>{if(Math.hypot(b.x-x,b.y-y)<b.r+10)pop(b)})});
  new IntersectionObserver(e=>on=e[0].isIntersecting).observe(cv);
  function star(x,y,s,a){c.save();c.translate(x,y);c.fillStyle=`rgba(255,244,200,${a})`;c.beginPath();for(let i=0;i<8;i++){const r=i%2?s*.25:s;c.lineTo(Math.cos(i*Math.PI/4)*r,Math.sin(i*Math.PI/4)*r)}c.closePath();c.fill();c.restore()}
  (function frame(t){requestAnimationFrame(frame);if(!on||t-last<16)return;last=t;c.clearRect(0,0,W,H);const T=t/1000;
    for(const s of stars)star(s.x,s.y,s.s,Math.max(0,Math.sin(T*1.6+s.p))*.9);
    for(const b of bub){b.y-=b.v;b.x+=Math.sin(T+b.p)*.5;const dx=b.x-mx,dy=b.y-my,d=Math.hypot(dx,dy);if(d<120){b.x+=dx/d*(120-d)*.06;b.y+=dy/d*(120-d)*.06}
      if(b.y<-50)Object.assign(b,mk(false));const [r,g,bl]=b.c,gr=c.createRadialGradient(b.x-b.r*.35,b.y-b.r*.35,b.r*.1,b.x,b.y,b.r);
      gr.addColorStop(0,'rgba(255,255,255,.55)');gr.addColorStop(.6,`rgba(${r},${g},${bl},.10)`);gr.addColorStop(1,`rgba(${r},${g},${bl},.35)`);
      c.fillStyle=gr;c.beginPath();c.arc(b.x,b.y,b.r,0,6.3);c.fill();c.strokeStyle=`rgba(${r},${g},${bl},.55)`;c.lineWidth=1.2;c.stroke()}
    spk=spk.filter(p=>p.l>0);for(const p of spk){p.x+=p.vx;p.y+=p.vy;p.vy+=.05;p.l-=.025;star(p.x,p.y,4*p.l+1,p.l)}
  })(0)}

/* instant quote calculator */
const cs=$('#q-svc');
if(cs){
  let freq='once';const bed=$('#q-bed'),bath=$('#q-bath'),sq=$('#q-sq'),out=$('#q-price'),go=$('#q-go');
  cs.innerHTML=Object.entries(PRICE.labels).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')+'<option value="commercial">Commercial / office (custom)</option>';
  sq.innerHTML=PRICE.sqft.map((s,i)=>`<option value="${i}"${i==2?' selected':''}>${s[0]}</option>`).join('');
  function calc(){const k=cs.value;$('#q-bv').textContent=bed.value;$('#q-bav').textContent=bath.value;
    if(k==='commercial'){out.textContent='Custom quote';go.href='book.html?svc=Commercial#form';return}
    const raw=(PRICE.base[k]+bed.value*PRICE.perBed+bath.value*PRICE.perBath)*PRICE.sqft[sq.value][1]*(1-PRICE.freq[freq]);
    const lo=Math.round(raw*.95/5)*5,hi=Math.round(raw*1.15/5)*5;out.textContent=`$${lo} – $${hi}`;
    go.href=`book.html?svc=${encodeURIComponent(PRICE.labels[k])}&bed=${bed.value}&bath=${bath.value}&freq=${freq}#form`}
  [cs,bed,bath,sq].forEach(e=>e.addEventListener('input',calc));
  $$('#q-freq button').forEach(b=>b.onclick=()=>{freq=b.dataset.f;$$('#q-freq button').forEach(x=>x.classList.toggle('on',x===b));calc()});calc()}

/* before / after slider */
$$('.ba').forEach(b=>{const i=$('input',b);i.oninput=()=>b.style.setProperty('--p',i.value+'%')});

/* booking form: prefill from calculator, send by email if set, else by text */
const form=$('#form');
if(form){const p=new URLSearchParams(location.search);
  if(p.get('svc')){const s=p.get('svc').toLowerCase();[...$('#f-s').options].forEach(o=>{if(s.includes(o.value.split(' ')[0].toLowerCase()))$('#f-s').value=o.value});if(p.get('bed'))$('#f-bed').value=p.get('bed');if(p.get('bath'))$('#f-bath').value=p.get('bath');if(p.get('freq'))$('#f-f').value=p.get('freq')}
  form.onsubmit=e=>{e.preventDefault();const g=i=>$('#'+i).value;
    const body=`Booking request\nName: ${g('f-n')}\nPhone: ${g('f-p')}\nCity: ${g('f-c')}\nService: ${g('f-s')}\nBedrooms: ${g('f-bed')}  Bathrooms: ${g('f-bath')}\nFrequency: ${g('f-f')}\nPreferred date: ${g('f-d')}\nPets: ${g('f-pets')}\nNotes: ${g('f-m')}`;
    location.href=CONFIG.email?`mailto:${CONFIG.email}?subject=${encodeURIComponent('Booking request: '+g('f-s'))}&body=${encodeURIComponent(body)}`:`sms:+${CONFIG.phone}?&body=${encodeURIComponent(body)}`}}

/* area checker */
$('#area')?.addEventListener('submit',e=>{e.preventDefault();location.href=`sms:+${CONFIG.phone}?&body=${encodeURIComponent('Hi Grime Goddess Co., do you serve '+$('#area-c').value+'?')}`});

/* printable checklist */
$$('[data-print]').forEach(b=>b.onclick=()=>print());

/* welcome offer popup: once per visit, after 25s or on exit intent */
const md=$('#pop');
if(md&&!sessionStorage.getItem('popSeen')){
  const show=()=>{if(sessionStorage.getItem('popSeen'))return;sessionStorage.setItem('popSeen','1');md.classList.add('open');$('.x',md).focus()};
  setTimeout(show,25000);document.addEventListener('mouseout',e=>{if(e.clientY<=0&&e.relatedTarget===null)show()});
  md.addEventListener('click',e=>{if(e.target===md||e.target.classList.contains('x')||e.target.dataset.close!==undefined)md.classList.remove('open')});
  addEventListener('keydown',e=>{if(e.key==='Escape')md.classList.remove('open')})}
