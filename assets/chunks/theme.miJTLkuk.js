const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/chunks/VPLocalSearchBox.bbpZViL2.js","assets/chunks/framework.CaksihXG.js"])))=>i.map(i=>d[i]);
import{d as Ee,c as K,r as V,n as it,o as I,a as ri,t as Qe,b as ve,w as z,T as ar,e as Se,_ as Oe,u as Zs,i as Ym,f as jm,g as Sa,h as Ae,j as ee,k as L,l as qi,m as No,p as Ve,q as on,s as Ma,v as qt,x as hi,y as ic,z as Zd,A as Km,F as ct,B as zt,C as wi,D as ba,E as ye,G as Dt,H as Zt,I as Jd,J as Ts,K as wn,L as or,M as Zm,N as ra,O as Oo,P as Qd,Q as ef,R as Ea,S as Jm,U as Qm,V as eg,W as tf,X as Ta,Y as tg,Z as ng,$ as Aa,a0 as ig,a1 as nf,a2 as sg,a3 as rg,a4 as $i,a5 as tu,a6 as nu,a7 as iu,a8 as ag,a9 as og,aa as lg,ab as cg,ac as ug,ad as hg,ae as dg,af as sf,ag as fg,ah as pg}from"./framework.CaksihXG.js";const mg=Ee({__name:"VPBadge",props:{text:{},type:{default:"tip"}},setup(n){return(e,t)=>(I(),K("span",{class:it(["VPBadge",n.type])},[V(e.$slots,"default",{},()=>[ri(Qe(n.text),1)])],2))}}),gg={key:0,class:"VPBackdrop"},vg=Ee({__name:"VPBackdrop",props:{show:{type:Boolean}},setup(n){return(e,t)=>(I(),ve(ar,{name:"fade"},{default:z(()=>[n.show?(I(),K("div",gg)):Se("",!0)]),_:1}))}}),rf=Oe(vg,[["__scopeId","data-v-c79a1216"]]),Ke=Zs;function _g(n,e){let t,i=!1;return()=>{t&&clearTimeout(t),i?t=setTimeout(n,e):(n(),(i=!0)&&setTimeout(()=>i=!1,e))}}function Bo(n){return n.startsWith("/")?n:`/${n}`}function sc(n){const{pathname:e,search:t,hash:i,protocol:s}=new URL(n,"http://a.com");if(Ym(n)||n.startsWith("#")||!s.startsWith("http")||!jm(e))return n;const{site:r}=Ke(),a=e.endsWith("/")||e.endsWith(".html")?n:n.replace(/(?:(^\.+)\/)?.*$/,`$1${e.replace(/(\.md)?$/,r.value.cleanUrls?"":".html")}${t}${i}`);return Sa(a)}function lr({correspondingLink:n=!1}={}){const{site:e,localeIndex:t,page:i,theme:s,hash:r}=Ke(),a=Ae(()=>{var l,c;return{label:(l=e.value.locales[t.value])==null?void 0:l.label,link:((c=e.value.locales[t.value])==null?void 0:c.link)||(t.value==="root"?"/":`/${t.value}/`)}});return{localeLinks:Ae(()=>Object.entries(e.value.locales).flatMap(([l,c])=>a.value.label===c.label?[]:{text:c.label,link:xg(c.link||(l==="root"?"/":`/${l}/`),s.value.i18nRouting!==!1&&n,i.value.relativePath.slice(a.value.link.length-1),!e.value.cleanUrls)+r.value})),currentLang:a}}function xg(n,e,t,i){return e?n.replace(/\/$/,"")+Bo(t.replace(/(^|\/)index\.md$/,"$1").replace(/\.md$/,i?".html":"")):n}const yg={class:"NotFound"},Sg={class:"code"},Mg={class:"title"},bg={class:"quote"},Eg={class:"action"},Tg=["href","aria-label"],Ag=Ee({__name:"NotFound",setup(n){const{theme:e}=Ke(),{currentLang:t}=lr();return(i,s)=>{var r,a,o,l,c;return I(),K("div",yg,[ee("p",Sg,Qe(((r=L(e).notFound)==null?void 0:r.code)??"404"),1),ee("h1",Mg,Qe(((a=L(e).notFound)==null?void 0:a.title)??"PAGE NOT FOUND"),1),s[0]||(s[0]=ee("div",{class:"divider"},null,-1)),ee("blockquote",bg,Qe(((o=L(e).notFound)==null?void 0:o.quote)??"But if you don't change your direction, and if you keep looking, you may end up where you are heading."),1),ee("div",Eg,[ee("a",{class:"link",href:L(Sa)(L(t).link),"aria-label":((l=L(e).notFound)==null?void 0:l.linkLabel)??"go to home"},Qe(((c=L(e).notFound)==null?void 0:c.linkText)??"Take me home"),9,Tg)])])}}}),af=Oe(Ag,[["__scopeId","data-v-d6be1790"]]);function of(n,e){if(Array.isArray(n))return jr(n);if(n==null)return[];e=Bo(e);const t=Object.keys(n).sort((s,r)=>r.split("/").length-s.split("/").length).find(s=>e.startsWith(Bo(s))),i=t?n[t]:[];return Array.isArray(i)?jr(i):jr(i.items,i.base)}function wg(n){const e=[];let t=0;for(const i in n){const s=n[i];if(s.items){t=e.push(s);continue}e[t]||e.push({items:[]}),e[t].items.push(s)}return e}function Cg(n){const e=[];function t(i){for(const s of i)s.text&&s.link&&e.push({text:s.text,link:s.link,docFooterText:s.docFooterText}),s.items&&t(s.items)}return t(n),e}function Vo(n,e){return Array.isArray(e)?e.some(t=>Vo(n,t)):qi(n,e.link)?!0:e.items?Vo(n,e.items):!1}function jr(n,e){return[...n].map(t=>{const i={...t},s=i.base||e;return s&&i.link&&(i.link=s+i.link),i.items&&(i.items=jr(i.items,s)),i})}function Pn(){const{frontmatter:n,page:e,theme:t}=Ke(),i=No("(min-width: 960px)"),s=Ve(!1),r=Ae(()=>{const v=t.value.sidebar,m=e.value.relativePath;return v?of(v,m):[]}),a=Ve(r.value);on(r,(v,m)=>{JSON.stringify(v)!==JSON.stringify(m)&&(a.value=r.value)});const o=Ae(()=>n.value.sidebar!==!1&&a.value.length>0&&n.value.layout!=="home"),l=Ae(()=>c?n.value.aside==null?t.value.aside==="left":n.value.aside==="left":!1),c=Ae(()=>n.value.layout==="home"?!1:n.value.aside!=null?!!n.value.aside:t.value.aside!==!1),u=Ae(()=>o.value&&i.value),h=Ae(()=>o.value?wg(a.value):[]);function d(){s.value=!0}function f(){s.value=!1}function g(){s.value?f():d()}return{isOpen:s,sidebar:a,sidebarGroups:h,hasSidebar:o,hasAside:c,leftAside:l,isSidebarEnabled:u,open:d,close:f,toggle:g}}function lf(n,e){let t;Ma(()=>{t=n.value?document.activeElement:void 0}),qt(()=>{window.addEventListener("keyup",i)}),hi(()=>{window.removeEventListener("keyup",i)});function i(s){s.key==="Escape"&&n.value&&(e(),t==null||t.focus())}}function Rg(n){const{page:e,hash:t}=Ke(),i=Ve(!1),s=Ae(()=>n.value.collapsed!=null),r=Ae(()=>!!n.value.link),a=Ve(!1),o=()=>{a.value=qi(e.value.relativePath,n.value.link)};on([e,n,t],o),qt(o);const l=Ae(()=>a.value?!0:n.value.items?Vo(e.value.relativePath,n.value.items):!1),c=Ae(()=>!!(n.value.items&&n.value.items.length));Ma(()=>{i.value=!!(s.value&&n.value.collapsed)}),ic(()=>{(a.value||l.value)&&(i.value=!1)});function u(){s.value&&(i.value=!i.value)}return{collapsed:i,collapsible:s,isLink:r,isActiveLink:a,hasActiveLink:l,hasChildren:c,toggle:u}}function Pg(){const{hasSidebar:n}=Pn(),e=No("(min-width: 960px)"),t=No("(min-width: 1280px)");return{isAsideEnabled:Ae(()=>!t.value&&!e.value?!1:n.value?t.value:e.value)}}const Lg=/\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/,ko=[];function cf(n){return typeof n.outline=="object"&&!Array.isArray(n.outline)&&n.outline.label||n.outlineTitle||"On this page"}function rc(n){const e=[...document.querySelectorAll(".VPDoc :where(h1,h2,h3,h4,h5,h6)")].filter(t=>t.id&&t.hasChildNodes()).map(t=>{const i=Number(t.tagName[1]);return{element:t,title:Dg(t),link:"#"+t.id,level:i}});return Ig(e,n)}function Dg(n){let e="";for(const t of n.childNodes)if(t.nodeType===1){if(Lg.test(t.className))continue;e+=t.textContent}else t.nodeType===3&&(e+=t.textContent);return e.trim()}function Ig(n,e){if(e===!1)return[];const t=(typeof e=="object"&&!Array.isArray(e)?e.level:e)||2,[i,s]=typeof t=="number"?[t,t]:t==="deep"?[2,6]:t;return Ng(n,i,s)}function Fg(n,e){const{isAsideEnabled:t}=Pg(),i=_g(r,100);let s=null;qt(()=>{requestAnimationFrame(r),window.addEventListener("scroll",i)}),Zd(()=>{a(location.hash)}),hi(()=>{window.removeEventListener("scroll",i)});function r(){if(!t.value)return;const o=window.scrollY,l=window.innerHeight,c=document.body.offsetHeight,u=Math.abs(o+l-c)<1,h=ko.map(({element:f,link:g})=>({link:g,top:Ug(f)})).filter(({top:f})=>!Number.isNaN(f)).sort((f,g)=>f.top-g.top);if(!h.length){a(null);return}if(o<1){a(null);return}if(u){a(h[h.length-1].link);return}let d=null;for(const{link:f,top:g}of h){if(g>o+Km()+4)break;d=f}a(d)}function a(o){s&&s.classList.remove("active"),o==null?s=null:s=n.value.querySelector(`a[href="${decodeURIComponent(o)}"]`);const l=s;l?(l.classList.add("active"),e.value.style.top=l.offsetTop+39+"px",e.value.style.opacity="1"):(e.value.style.top="33px",e.value.style.opacity="0")}}function Ug(n){let e=0;for(;n!==document.body;){if(n===null)return NaN;e+=n.offsetTop,n=n.offsetParent}return e}function Ng(n,e,t){ko.length=0;const i=[],s=[];return n.forEach(r=>{const a={...r,children:[]};let o=s[s.length-1];for(;o&&o.level>=a.level;)s.pop(),o=s[s.length-1];if(a.element.classList.contains("ignore-header")||o&&"shouldIgnore"in o){s.push({level:a.level,shouldIgnore:!0});return}a.level>t||a.level<e||(ko.push({element:a.element,link:a.link}),o?o.children.push(a):i.push(a),s.push(a))}),i}const Og=["href","title"],Bg=Ee({__name:"VPDocOutlineItem",props:{headers:{},root:{type:Boolean}},setup(n){function e({target:t}){const i=t.href.split("#")[1],s=document.getElementById(decodeURIComponent(i));s==null||s.focus({preventScroll:!0})}return(t,i)=>{const s=wi("VPDocOutlineItem",!0);return I(),K("ul",{class:it(["VPDocOutlineItem",n.root?"root":"nested"])},[(I(!0),K(ct,null,zt(n.headers,({children:r,link:a,title:o})=>(I(),K("li",null,[ee("a",{class:"outline-link",href:a,onClick:e,title:o},Qe(o),9,Og),r!=null&&r.length?(I(),ve(s,{key:0,headers:r},null,8,["headers"])):Se("",!0)]))),256))],2)}}}),uf=Oe(Bg,[["__scopeId","data-v-b933a997"]]),Vg={class:"content"},kg={"aria-level":"2",class:"outline-title",id:"doc-outline-aria-label",role:"heading"},zg=Ee({__name:"VPDocAsideOutline",setup(n){const{frontmatter:e,theme:t}=Ke(),i=Dt([]);ba(()=>{i.value=rc(e.value.outline??t.value.outline)});const s=Ve(),r=Ve();return Fg(s,r),(a,o)=>(I(),K("nav",{"aria-labelledby":"doc-outline-aria-label",class:it(["VPDocAsideOutline",{"has-outline":i.value.length>0}]),ref_key:"container",ref:s},[ee("div",Vg,[ee("div",{class:"outline-marker",ref_key:"marker",ref:r},null,512),ee("div",kg,Qe(L(cf)(L(t))),1),ye(uf,{headers:i.value,root:!0},null,8,["headers"])])],2))}}),Gg=Oe(zg,[["__scopeId","data-v-a5bbad30"]]),Hg={class:"VPDocAsideCarbonAds"},Wg=Ee({__name:"VPDocAsideCarbonAds",props:{carbonAds:{}},setup(n){const e=()=>null;return(t,i)=>(I(),K("div",Hg,[ye(L(e),{"carbon-ads":n.carbonAds},null,8,["carbon-ads"])]))}}),$g={class:"VPDocAside"},Xg=Ee({__name:"VPDocAside",setup(n){const{theme:e}=Ke();return(t,i)=>(I(),K("div",$g,[V(t.$slots,"aside-top",{},void 0,!0),V(t.$slots,"aside-outline-before",{},void 0,!0),ye(Gg),V(t.$slots,"aside-outline-after",{},void 0,!0),i[0]||(i[0]=ee("div",{class:"spacer"},null,-1)),V(t.$slots,"aside-ads-before",{},void 0,!0),L(e).carbonAds?(I(),ve(Wg,{key:0,"carbon-ads":L(e).carbonAds},null,8,["carbon-ads"])):Se("",!0),V(t.$slots,"aside-ads-after",{},void 0,!0),V(t.$slots,"aside-bottom",{},void 0,!0)]))}}),qg=Oe(Xg,[["__scopeId","data-v-3f215769"]]);function Yg(){const{theme:n,page:e}=Ke();return Ae(()=>{const{text:t="Edit this page",pattern:i=""}=n.value.editLink||{};let s;return typeof i=="function"?s=i(e.value):s=i.replace(/:path/g,e.value.filePath),{url:s,text:t}})}function jg(){const{page:n,theme:e,frontmatter:t}=Ke();return Ae(()=>{var c,u,h,d,f,g,v,m;const i=of(e.value.sidebar,n.value.relativePath),s=Cg(i),r=Kg(s,p=>p.link.replace(/[?#].*$/,"")),a=r.findIndex(p=>qi(n.value.relativePath,p.link)),o=((c=e.value.docFooter)==null?void 0:c.prev)===!1&&!t.value.prev||t.value.prev===!1,l=((u=e.value.docFooter)==null?void 0:u.next)===!1&&!t.value.next||t.value.next===!1;return{prev:o?void 0:{text:(typeof t.value.prev=="string"?t.value.prev:typeof t.value.prev=="object"?t.value.prev.text:void 0)??((h=r[a-1])==null?void 0:h.docFooterText)??((d=r[a-1])==null?void 0:d.text),link:(typeof t.value.prev=="object"?t.value.prev.link:void 0)??((f=r[a-1])==null?void 0:f.link)},next:l?void 0:{text:(typeof t.value.next=="string"?t.value.next:typeof t.value.next=="object"?t.value.next.text:void 0)??((g=r[a+1])==null?void 0:g.docFooterText)??((v=r[a+1])==null?void 0:v.text),link:(typeof t.value.next=="object"?t.value.next.link:void 0)??((m=r[a+1])==null?void 0:m.link)}}})}function Kg(n,e){const t=new Set;return n.filter(i=>{const s=e(i);return t.has(s)?!1:t.add(s)})}const kn=Ee({__name:"VPLink",props:{tag:{},href:{},noIcon:{type:Boolean},target:{},rel:{}},setup(n){const e=n,t=Ae(()=>e.tag??(e.href?"a":"span")),i=Ae(()=>e.href&&Jd.test(e.href)||e.target==="_blank");return(s,r)=>(I(),ve(Zt(t.value),{class:it(["VPLink",{link:n.href,"vp-external-link-icon":i.value,"no-icon":n.noIcon}]),href:n.href?L(sc)(n.href):void 0,target:n.target??(i.value?"_blank":void 0),rel:n.rel??(i.value?"noreferrer":void 0)},{default:z(()=>[V(s.$slots,"default")]),_:3},8,["class","href","target","rel"]))}}),Zg={class:"VPLastUpdated"},Jg=["datetime"],Qg=Ee({__name:"VPDocFooterLastUpdated",setup(n){const{theme:e,page:t,lang:i}=Ke(),s=Ae(()=>new Date(t.value.lastUpdated)),r=Ae(()=>s.value.toISOString()),a=Ve("");return qt(()=>{Ma(()=>{var o,l,c;a.value=new Intl.DateTimeFormat((l=(o=e.value.lastUpdated)==null?void 0:o.formatOptions)!=null&&l.forceLocale?i.value:void 0,((c=e.value.lastUpdated)==null?void 0:c.formatOptions)??{dateStyle:"short",timeStyle:"short"}).format(s.value)})}),(o,l)=>{var c;return I(),K("p",Zg,[ri(Qe(((c=L(e).lastUpdated)==null?void 0:c.text)||L(e).lastUpdatedText||"Last updated")+": ",1),ee("time",{datetime:r.value},Qe(a.value),9,Jg)])}}}),ev=Oe(Qg,[["__scopeId","data-v-e98dd255"]]),tv={key:0,class:"VPDocFooter"},nv={key:0,class:"edit-info"},iv={key:0,class:"edit-link"},sv={key:1,class:"last-updated"},rv={key:1,class:"prev-next","aria-labelledby":"doc-footer-aria-label"},av={class:"pager"},ov=["innerHTML"],lv=["innerHTML"],cv={class:"pager"},uv=["innerHTML"],hv=["innerHTML"],dv=Ee({__name:"VPDocFooter",setup(n){const{theme:e,page:t,frontmatter:i}=Ke(),s=Yg(),r=jg(),a=Ae(()=>e.value.editLink&&i.value.editLink!==!1),o=Ae(()=>t.value.lastUpdated),l=Ae(()=>a.value||o.value||r.value.prev||r.value.next);return(c,u)=>{var h,d,f,g;return l.value?(I(),K("footer",tv,[V(c.$slots,"doc-footer-before",{},void 0,!0),a.value||o.value?(I(),K("div",nv,[a.value?(I(),K("div",iv,[ye(kn,{class:"edit-link-button",href:L(s).url,"no-icon":!0},{default:z(()=>[u[0]||(u[0]=ee("span",{class:"vpi-square-pen edit-link-icon"},null,-1)),ri(" "+Qe(L(s).text),1)]),_:1},8,["href"])])):Se("",!0),o.value?(I(),K("div",sv,[ye(ev)])):Se("",!0)])):Se("",!0),(h=L(r).prev)!=null&&h.link||(d=L(r).next)!=null&&d.link?(I(),K("nav",rv,[u[1]||(u[1]=ee("span",{class:"visually-hidden",id:"doc-footer-aria-label"},"Pager",-1)),ee("div",av,[(f=L(r).prev)!=null&&f.link?(I(),ve(kn,{key:0,class:"pager-link prev",href:L(r).prev.link},{default:z(()=>{var v;return[ee("span",{class:"desc",innerHTML:((v=L(e).docFooter)==null?void 0:v.prev)||"Previous page"},null,8,ov),ee("span",{class:"title",innerHTML:L(r).prev.text},null,8,lv)]}),_:1},8,["href"])):Se("",!0)]),ee("div",cv,[(g=L(r).next)!=null&&g.link?(I(),ve(kn,{key:0,class:"pager-link next",href:L(r).next.link},{default:z(()=>{var v;return[ee("span",{class:"desc",innerHTML:((v=L(e).docFooter)==null?void 0:v.next)||"Next page"},null,8,uv),ee("span",{class:"title",innerHTML:L(r).next.text},null,8,hv)]}),_:1},8,["href"])):Se("",!0)])])):Se("",!0)])):Se("",!0)}}}),fv=Oe(dv,[["__scopeId","data-v-e257564d"]]),pv={class:"container"},mv={class:"aside-container"},gv={class:"aside-content"},vv={class:"content"},_v={class:"content-container"},xv={class:"main"},yv=Ee({__name:"VPDoc",setup(n){const{theme:e}=Ke(),t=Ts(),{hasSidebar:i,hasAside:s,leftAside:r}=Pn(),a=Ae(()=>t.path.replace(/[./]+/g,"_").replace(/_html$/,""));return(o,l)=>{const c=wi("Content");return I(),K("div",{class:it(["VPDoc",{"has-sidebar":L(i),"has-aside":L(s)}])},[V(o.$slots,"doc-top",{},void 0,!0),ee("div",pv,[L(s)?(I(),K("div",{key:0,class:it(["aside",{"left-aside":L(r)}])},[l[0]||(l[0]=ee("div",{class:"aside-curtain"},null,-1)),ee("div",mv,[ee("div",gv,[ye(qg,null,{"aside-top":z(()=>[V(o.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":z(()=>[V(o.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":z(()=>[V(o.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":z(()=>[V(o.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":z(()=>[V(o.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":z(()=>[V(o.$slots,"aside-ads-after",{},void 0,!0)]),_:3})])])],2)):Se("",!0),ee("div",vv,[ee("div",_v,[V(o.$slots,"doc-before",{},void 0,!0),ee("main",xv,[ye(c,{class:it(["vp-doc",[a.value,L(e).externalLinkIcon&&"external-link-icon-enabled"]])},null,8,["class"])]),ye(fv,null,{"doc-footer-before":z(()=>[V(o.$slots,"doc-footer-before",{},void 0,!0)]),_:3}),V(o.$slots,"doc-after",{},void 0,!0)])])]),V(o.$slots,"doc-bottom",{},void 0,!0)],2)}}}),hf=Oe(yv,[["__scopeId","data-v-39a288b8"]]),Sv=Ee({__name:"VPButton",props:{tag:{},size:{default:"medium"},theme:{default:"brand"},text:{},href:{},target:{},rel:{}},setup(n){const e=n,t=Ae(()=>e.href&&Jd.test(e.href)),i=Ae(()=>e.tag||(e.href?"a":"button"));return(s,r)=>(I(),ve(Zt(i.value),{class:it(["VPButton",[n.size,n.theme]]),href:n.href?L(sc)(n.href):void 0,target:e.target??(t.value?"_blank":void 0),rel:e.rel??(t.value?"noreferrer":void 0)},{default:z(()=>[ri(Qe(n.text),1)]),_:1},8,["class","href","target","rel"]))}}),Mv=Oe(Sv,[["__scopeId","data-v-fa7799d5"]]),bv=["src","alt"],Ev=Ee({inheritAttrs:!1,__name:"VPImage",props:{image:{},alt:{}},setup(n){return(e,t)=>{const i=wi("VPImage",!0);return n.image?(I(),K(ct,{key:0},[typeof n.image=="string"||"src"in n.image?(I(),K("img",wn({key:0,class:"VPImage"},typeof n.image=="string"?e.$attrs:{...n.image,...e.$attrs},{src:L(Sa)(typeof n.image=="string"?n.image:n.image.src),alt:n.alt??(typeof n.image=="string"?"":n.image.alt||"")}),null,16,bv)):(I(),K(ct,{key:1},[ye(i,wn({class:"dark",image:n.image.dark,alt:n.image.alt},e.$attrs),null,16,["image","alt"]),ye(i,wn({class:"light",image:n.image.light,alt:n.image.alt},e.$attrs),null,16,["image","alt"])],64))],64)):Se("",!0)}}}),aa=Oe(Ev,[["__scopeId","data-v-8426fc1a"]]),Tv={class:"container"},Av={class:"main"},wv={class:"heading"},Cv=["innerHTML"],Rv=["innerHTML"],Pv=["innerHTML"],Lv={key:0,class:"actions"},Dv={key:0,class:"image"},Iv={class:"image-container"},Fv=Ee({__name:"VPHero",props:{name:{},text:{},tagline:{},image:{},actions:{}},setup(n){const e=or("hero-image-slot-exists");return(t,i)=>(I(),K("div",{class:it(["VPHero",{"has-image":n.image||L(e)}])},[ee("div",Tv,[ee("div",Av,[V(t.$slots,"home-hero-info-before",{},void 0,!0),V(t.$slots,"home-hero-info",{},()=>[ee("h1",wv,[n.name?(I(),K("span",{key:0,innerHTML:n.name,class:"name clip"},null,8,Cv)):Se("",!0),n.text?(I(),K("span",{key:1,innerHTML:n.text,class:"text"},null,8,Rv)):Se("",!0)]),n.tagline?(I(),K("p",{key:0,innerHTML:n.tagline,class:"tagline"},null,8,Pv)):Se("",!0)],!0),V(t.$slots,"home-hero-info-after",{},void 0,!0),n.actions?(I(),K("div",Lv,[(I(!0),K(ct,null,zt(n.actions,s=>(I(),K("div",{key:s.link,class:"action"},[ye(Mv,{tag:"a",size:"medium",theme:s.theme,text:s.text,href:s.link,target:s.target,rel:s.rel},null,8,["theme","text","href","target","rel"])]))),128))])):Se("",!0),V(t.$slots,"home-hero-actions-after",{},void 0,!0)]),n.image||L(e)?(I(),K("div",Dv,[ee("div",Iv,[i[0]||(i[0]=ee("div",{class:"image-bg"},null,-1)),V(t.$slots,"home-hero-image",{},()=>[n.image?(I(),ve(aa,{key:0,class:"image-src",image:n.image},null,8,["image"])):Se("",!0)],!0)])])):Se("",!0)])],2))}}),Uv=Oe(Fv,[["__scopeId","data-v-4f9c455b"]]),Nv=Ee({__name:"VPHomeHero",setup(n){const{frontmatter:e}=Ke();return(t,i)=>L(e).hero?(I(),ve(Uv,{key:0,class:"VPHomeHero",name:L(e).hero.name,text:L(e).hero.text,tagline:L(e).hero.tagline,image:L(e).hero.image,actions:L(e).hero.actions},{"home-hero-info-before":z(()=>[V(t.$slots,"home-hero-info-before")]),"home-hero-info":z(()=>[V(t.$slots,"home-hero-info")]),"home-hero-info-after":z(()=>[V(t.$slots,"home-hero-info-after")]),"home-hero-actions-after":z(()=>[V(t.$slots,"home-hero-actions-after")]),"home-hero-image":z(()=>[V(t.$slots,"home-hero-image")]),_:3},8,["name","text","tagline","image","actions"])):Se("",!0)}}),Ov={class:"box"},Bv={key:0,class:"icon"},Vv=["innerHTML"],kv=["innerHTML"],zv=["innerHTML"],Gv={key:4,class:"link-text"},Hv={class:"link-text-value"},Wv=Ee({__name:"VPFeature",props:{icon:{},title:{},details:{},link:{},linkText:{},rel:{},target:{}},setup(n){return(e,t)=>(I(),ve(kn,{class:"VPFeature",href:n.link,rel:n.rel,target:n.target,"no-icon":!0,tag:n.link?"a":"div"},{default:z(()=>[ee("article",Ov,[typeof n.icon=="object"&&n.icon.wrap?(I(),K("div",Bv,[ye(aa,{image:n.icon,alt:n.icon.alt,height:n.icon.height||48,width:n.icon.width||48},null,8,["image","alt","height","width"])])):typeof n.icon=="object"?(I(),ve(aa,{key:1,image:n.icon,alt:n.icon.alt,height:n.icon.height||48,width:n.icon.width||48},null,8,["image","alt","height","width"])):n.icon?(I(),K("div",{key:2,class:"icon",innerHTML:n.icon},null,8,Vv)):Se("",!0),ee("h2",{class:"title",innerHTML:n.title},null,8,kv),n.details?(I(),K("p",{key:3,class:"details",innerHTML:n.details},null,8,zv)):Se("",!0),n.linkText?(I(),K("div",Gv,[ee("p",Hv,[ri(Qe(n.linkText)+" ",1),t[0]||(t[0]=ee("span",{class:"vpi-arrow-right link-text-icon"},null,-1))])])):Se("",!0)])]),_:1},8,["href","rel","target","tag"]))}}),$v=Oe(Wv,[["__scopeId","data-v-a3976bdc"]]),Xv={key:0,class:"VPFeatures"},qv={class:"container"},Yv={class:"items"},jv=Ee({__name:"VPFeatures",props:{features:{}},setup(n){const e=n,t=Ae(()=>{const i=e.features.length;if(i){if(i===2)return"grid-2";if(i===3)return"grid-3";if(i%3===0)return"grid-6";if(i>3)return"grid-4"}else return});return(i,s)=>n.features?(I(),K("div",Xv,[ee("div",qv,[ee("div",Yv,[(I(!0),K(ct,null,zt(n.features,r=>(I(),K("div",{key:r.title,class:it(["item",[t.value]])},[ye($v,{icon:r.icon,title:r.title,details:r.details,link:r.link,"link-text":r.linkText,rel:r.rel,target:r.target},null,8,["icon","title","details","link","link-text","rel","target"])],2))),128))])])])):Se("",!0)}}),Kv=Oe(jv,[["__scopeId","data-v-a6181336"]]),Zv=Ee({__name:"VPHomeFeatures",setup(n){const{frontmatter:e}=Ke();return(t,i)=>L(e).features?(I(),ve(Kv,{key:0,class:"VPHomeFeatures",features:L(e).features},null,8,["features"])):Se("",!0)}}),Jv=Ee({__name:"VPHomeContent",setup(n){const{width:e}=Zm({initialWidth:0,includeScrollbar:!1});return(t,i)=>(I(),K("div",{class:"vp-doc container",style:ra(L(e)?{"--vp-offset":`calc(50% - ${L(e)/2}px)`}:{})},[V(t.$slots,"default",{},void 0,!0)],4))}}),Qv=Oe(Jv,[["__scopeId","data-v-8e2d4988"]]),e0=Ee({__name:"VPHome",setup(n){const{frontmatter:e,theme:t}=Ke();return(i,s)=>{const r=wi("Content");return I(),K("div",{class:it(["VPHome",{"external-link-icon-enabled":L(t).externalLinkIcon}])},[V(i.$slots,"home-hero-before",{},void 0,!0),ye(Nv,null,{"home-hero-info-before":z(()=>[V(i.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":z(()=>[V(i.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":z(()=>[V(i.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":z(()=>[V(i.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":z(()=>[V(i.$slots,"home-hero-image",{},void 0,!0)]),_:3}),V(i.$slots,"home-hero-after",{},void 0,!0),V(i.$slots,"home-features-before",{},void 0,!0),ye(Zv),V(i.$slots,"home-features-after",{},void 0,!0),L(e).markdownStyles!==!1?(I(),ve(Qv,{key:0},{default:z(()=>[ye(r)]),_:1})):(I(),ve(r,{key:1}))],2)}}}),t0=Oe(e0,[["__scopeId","data-v-8b561e3d"]]),n0={},i0={class:"VPPage"};function s0(n,e){const t=wi("Content");return I(),K("div",i0,[V(n.$slots,"page-top"),ye(t),V(n.$slots,"page-bottom")])}const df=Oe(n0,[["render",s0]]),r0=Ee({__name:"VPContent",setup(n){const{page:e,frontmatter:t}=Ke(),{hasSidebar:i}=Pn();return(s,r)=>(I(),K("div",{class:it(["VPContent",{"has-sidebar":L(i),"is-home":L(t).layout==="home"}]),id:"VPContent"},[L(e).isNotFound?V(s.$slots,"not-found",{key:0},()=>[ye(af)],!0):L(t).layout==="page"?(I(),ve(df,{key:1},{"page-top":z(()=>[V(s.$slots,"page-top",{},void 0,!0)]),"page-bottom":z(()=>[V(s.$slots,"page-bottom",{},void 0,!0)]),_:3})):L(t).layout==="home"?(I(),ve(t0,{key:2},{"home-hero-before":z(()=>[V(s.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":z(()=>[V(s.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":z(()=>[V(s.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":z(()=>[V(s.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":z(()=>[V(s.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":z(()=>[V(s.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":z(()=>[V(s.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":z(()=>[V(s.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":z(()=>[V(s.$slots,"home-features-after",{},void 0,!0)]),_:3})):L(t).layout&&L(t).layout!=="doc"?(I(),ve(Zt(L(t).layout),{key:3})):(I(),ve(hf,{key:4},{"doc-top":z(()=>[V(s.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":z(()=>[V(s.$slots,"doc-bottom",{},void 0,!0)]),"doc-footer-before":z(()=>[V(s.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":z(()=>[V(s.$slots,"doc-before",{},void 0,!0)]),"doc-after":z(()=>[V(s.$slots,"doc-after",{},void 0,!0)]),"aside-top":z(()=>[V(s.$slots,"aside-top",{},void 0,!0)]),"aside-outline-before":z(()=>[V(s.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":z(()=>[V(s.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":z(()=>[V(s.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":z(()=>[V(s.$slots,"aside-ads-after",{},void 0,!0)]),"aside-bottom":z(()=>[V(s.$slots,"aside-bottom",{},void 0,!0)]),_:3}))],2))}}),a0=Oe(r0,[["__scopeId","data-v-1428d186"]]),o0={class:"container"},l0=["innerHTML"],c0=["innerHTML"],u0=Ee({__name:"VPFooter",setup(n){const{theme:e,frontmatter:t}=Ke(),{hasSidebar:i}=Pn();return(s,r)=>L(e).footer&&L(t).footer!==!1?(I(),K("footer",{key:0,class:it(["VPFooter",{"has-sidebar":L(i)}])},[ee("div",o0,[L(e).footer.message?(I(),K("p",{key:0,class:"message",innerHTML:L(e).footer.message},null,8,l0)):Se("",!0),L(e).footer.copyright?(I(),K("p",{key:1,class:"copyright",innerHTML:L(e).footer.copyright},null,8,c0)):Se("",!0)])],2)):Se("",!0)}}),ff=Oe(u0,[["__scopeId","data-v-e315a0ad"]]);function h0(){const{theme:n,frontmatter:e}=Ke(),t=Dt([]),i=Ae(()=>t.value.length>0);return ba(()=>{t.value=rc(e.value.outline??n.value.outline)}),{headers:t,hasLocalNav:i}}const d0={class:"menu-text"},f0={class:"header"},p0={class:"outline"},m0=Ee({__name:"VPLocalNavOutlineDropdown",props:{headers:{},navHeight:{}},setup(n){const e=n,{theme:t}=Ke(),i=Ve(!1),s=Ve(0),r=Ve(),a=Ve();function o(h){var d;(d=r.value)!=null&&d.contains(h.target)||(i.value=!1)}on(i,h=>{if(h){document.addEventListener("click",o);return}document.removeEventListener("click",o)}),Oo("Escape",()=>{i.value=!1}),ba(()=>{i.value=!1});function l(){i.value=!i.value,s.value=window.innerHeight+Math.min(window.scrollY-e.navHeight,0)}function c(h){h.target.classList.contains("outline-link")&&(a.value&&(a.value.style.transition="none"),Qd(()=>{i.value=!1}))}function u(){i.value=!1,window.scrollTo({top:0,left:0,behavior:"smooth"})}return(h,d)=>(I(),K("div",{class:"VPLocalNavOutlineDropdown",style:ra({"--vp-vh":s.value+"px"}),ref_key:"main",ref:r},[n.headers.length>0?(I(),K("button",{key:0,onClick:l,class:it({open:i.value})},[ee("span",d0,Qe(L(cf)(L(t))),1),d[0]||(d[0]=ee("span",{class:"vpi-chevron-right icon"},null,-1))],2)):(I(),K("button",{key:1,onClick:u},Qe(L(t).returnToTopLabel||"Return to top"),1)),ye(ar,{name:"flyout"},{default:z(()=>[i.value?(I(),K("div",{key:0,ref_key:"items",ref:a,class:"items",onClick:c},[ee("div",f0,[ee("a",{class:"top-link",href:"#",onClick:u},Qe(L(t).returnToTopLabel||"Return to top"),1)]),ee("div",p0,[ye(uf,{headers:n.headers},null,8,["headers"])])],512)):Se("",!0)]),_:1})],4))}}),g0=Oe(m0,[["__scopeId","data-v-8a42e2b4"]]),v0={class:"container"},_0=["aria-expanded"],x0={class:"menu-text"},y0=Ee({__name:"VPLocalNav",props:{open:{type:Boolean}},emits:["open-menu"],setup(n){const{theme:e,frontmatter:t}=Ke(),{hasSidebar:i}=Pn(),{headers:s}=h0(),{y:r}=ef(),a=Ve(0);qt(()=>{a.value=parseInt(getComputedStyle(document.documentElement).getPropertyValue("--vp-nav-height"))}),ba(()=>{s.value=rc(t.value.outline??e.value.outline)});const o=Ae(()=>s.value.length===0),l=Ae(()=>o.value&&!i.value),c=Ae(()=>({VPLocalNav:!0,"has-sidebar":i.value,empty:o.value,fixed:l.value}));return(u,h)=>L(t).layout!=="home"&&(!l.value||L(r)>=a.value)?(I(),K("div",{key:0,class:it(c.value)},[ee("div",v0,[L(i)?(I(),K("button",{key:0,class:"menu","aria-expanded":n.open,"aria-controls":"VPSidebarNav",onClick:h[0]||(h[0]=d=>u.$emit("open-menu"))},[h[1]||(h[1]=ee("span",{class:"vpi-align-left menu-icon"},null,-1)),ee("span",x0,Qe(L(e).sidebarMenuLabel||"Menu"),1)],8,_0)):Se("",!0),ye(g0,{headers:L(s),navHeight:a.value},null,8,["headers","navHeight"])])],2)):Se("",!0)}}),pf=Oe(y0,[["__scopeId","data-v-a6f0e41e"]]);function S0(){const n=Ve(!1);function e(){n.value=!0,window.addEventListener("resize",s)}function t(){n.value=!1,window.removeEventListener("resize",s)}function i(){n.value?t():e()}function s(){window.outerWidth>=768&&t()}const r=Ts();return on(()=>r.path,t),{isScreenOpen:n,openScreen:e,closeScreen:t,toggleScreen:i}}const M0={},b0={class:"VPSwitch",type:"button",role:"switch"},E0={class:"check"},T0={key:0,class:"icon"};function A0(n,e){return I(),K("button",b0,[ee("span",E0,[n.$slots.default?(I(),K("span",T0,[V(n.$slots,"default",{},void 0,!0)])):Se("",!0)])])}const w0=Oe(M0,[["render",A0],["__scopeId","data-v-1d5665e3"]]),C0=Ee({__name:"VPSwitchAppearance",setup(n){const{isDark:e,theme:t}=Ke(),i=or("toggle-appearance",()=>{e.value=!e.value}),s=Ve("");return ic(()=>{s.value=e.value?t.value.lightModeSwitchTitle||"Switch to light theme":t.value.darkModeSwitchTitle||"Switch to dark theme"}),(r,a)=>(I(),ve(w0,{title:s.value,class:"VPSwitchAppearance","aria-checked":L(e),onClick:L(i)},{default:z(()=>[...a[0]||(a[0]=[ee("span",{class:"vpi-sun sun"},null,-1),ee("span",{class:"vpi-moon moon"},null,-1)])]),_:1},8,["title","aria-checked","onClick"]))}}),ac=Oe(C0,[["__scopeId","data-v-5337faa4"]]),R0={key:0,class:"VPNavBarAppearance"},P0=Ee({__name:"VPNavBarAppearance",setup(n){const{site:e}=Ke();return(t,i)=>L(e).appearance&&L(e).appearance!=="force-dark"&&L(e).appearance!=="force-auto"?(I(),K("div",R0,[ye(ac)])):Se("",!0)}}),L0=Oe(P0,[["__scopeId","data-v-6c893767"]]),oc=Ve();let mf=!1,Na=0;function D0(n){const e=Ve(!1);if(Ea){!mf&&I0(),Na++;const t=on(oc,i=>{var s,r,a;i===n.el.value||(s=n.el.value)!=null&&s.contains(i)?(e.value=!0,(r=n.onFocus)==null||r.call(n)):(e.value=!1,(a=n.onBlur)==null||a.call(n))});hi(()=>{t(),Na--,Na||F0()})}return Jm(e)}function I0(){document.addEventListener("focusin",gf),mf=!0,oc.value=document.activeElement}function F0(){document.removeEventListener("focusin",gf)}function gf(){oc.value=document.activeElement}const U0={class:"VPMenuLink"},N0=["innerHTML"],O0=Ee({__name:"VPMenuLink",props:{item:{}},setup(n){const{page:e}=Ke();return(t,i)=>(I(),K("div",U0,[ye(kn,{class:it({active:L(qi)(L(e).relativePath,n.item.activeMatch||n.item.link,!!n.item.activeMatch)}),href:n.item.link,target:n.item.target,rel:n.item.rel,"no-icon":n.item.noIcon},{default:z(()=>[ee("span",{innerHTML:n.item.text},null,8,N0)]),_:1},8,["class","href","target","rel","no-icon"])]))}}),wa=Oe(O0,[["__scopeId","data-v-35975db6"]]),B0={class:"VPMenuGroup"},V0={key:0,class:"title"},k0=Ee({__name:"VPMenuGroup",props:{text:{},items:{}},setup(n){return(e,t)=>(I(),K("div",B0,[n.text?(I(),K("p",V0,Qe(n.text),1)):Se("",!0),(I(!0),K(ct,null,zt(n.items,i=>(I(),K(ct,null,["link"in i?(I(),ve(wa,{key:0,item:i},null,8,["item"])):Se("",!0)],64))),256))]))}}),z0=Oe(k0,[["__scopeId","data-v-69e747b5"]]),G0={class:"VPMenu"},H0={key:0,class:"items"},W0=Ee({__name:"VPMenu",props:{items:{}},setup(n){return(e,t)=>(I(),K("div",G0,[n.items?(I(),K("div",H0,[(I(!0),K(ct,null,zt(n.items,i=>(I(),K(ct,{key:JSON.stringify(i)},["link"in i?(I(),ve(wa,{key:0,item:i},null,8,["item"])):"component"in i?(I(),ve(Zt(i.component),wn({key:1,ref_for:!0},i.props),null,16)):(I(),ve(z0,{key:2,text:i.text,items:i.items},null,8,["text","items"]))],64))),128))])):Se("",!0),V(e.$slots,"default",{},void 0,!0)]))}}),$0=Oe(W0,[["__scopeId","data-v-b98bc113"]]),X0=["aria-expanded","aria-label"],q0={key:0,class:"text"},Y0=["innerHTML"],j0={key:1,class:"vpi-more-horizontal icon"},K0={class:"menu"},Z0=Ee({__name:"VPFlyout",props:{icon:{},button:{},label:{},items:{}},setup(n){const e=Ve(!1),t=Ve();D0({el:t,onBlur:i});function i(){e.value=!1}return(s,r)=>(I(),K("div",{class:"VPFlyout",ref_key:"el",ref:t,onMouseenter:r[1]||(r[1]=a=>e.value=!0),onMouseleave:r[2]||(r[2]=a=>e.value=!1)},[ee("button",{type:"button",class:"button","aria-haspopup":"true","aria-expanded":e.value,"aria-label":n.label,onClick:r[0]||(r[0]=a=>e.value=!e.value)},[n.button||n.icon?(I(),K("span",q0,[n.icon?(I(),K("span",{key:0,class:it([n.icon,"option-icon"])},null,2)):Se("",!0),n.button?(I(),K("span",{key:1,innerHTML:n.button},null,8,Y0)):Se("",!0),r[3]||(r[3]=ee("span",{class:"vpi-chevron-down text-icon"},null,-1))])):(I(),K("span",j0))],8,X0),ee("div",K0,[ye($0,{items:n.items},{default:z(()=>[V(s.$slots,"default",{},void 0,!0)]),_:3},8,["items"])])],544))}}),lc=Oe(Z0,[["__scopeId","data-v-cf11d7a2"]]),J0=["href","aria-label","innerHTML"],Q0=Ee({__name:"VPSocialLink",props:{icon:{},link:{},ariaLabel:{}},setup(n){const e=n,t=Ve();qt(async()=>{var r;await Qd();const s=(r=t.value)==null?void 0:r.children[0];s instanceof HTMLElement&&s.className.startsWith("vpi-social-")&&(getComputedStyle(s).maskImage||getComputedStyle(s).webkitMaskImage)==="none"&&s.style.setProperty("--icon",`url('https://api.iconify.design/simple-icons/${e.icon}.svg')`)});const i=Ae(()=>typeof e.icon=="object"?e.icon.svg:`<span class="vpi-social-${e.icon}"></span>`);return(s,r)=>(I(),K("a",{ref_key:"el",ref:t,class:"VPSocialLink no-icon",href:n.link,"aria-label":n.ariaLabel??(typeof n.icon=="string"?n.icon:""),target:"_blank",rel:"noopener",innerHTML:i.value},null,8,J0))}}),e_=Oe(Q0,[["__scopeId","data-v-bd121fe5"]]),t_={class:"VPSocialLinks"},n_=Ee({__name:"VPSocialLinks",props:{links:{}},setup(n){return(e,t)=>(I(),K("div",t_,[(I(!0),K(ct,null,zt(n.links,({link:i,icon:s,ariaLabel:r})=>(I(),ve(e_,{key:i,icon:s,link:i,ariaLabel:r},null,8,["icon","link","ariaLabel"]))),128))]))}}),cc=Oe(n_,[["__scopeId","data-v-7bc22406"]]),i_={key:0,class:"group translations"},s_={class:"trans-title"},r_={key:1,class:"group"},a_={class:"item appearance"},o_={class:"label"},l_={class:"appearance-action"},c_={key:2,class:"group"},u_={class:"item social-links"},h_=Ee({__name:"VPNavBarExtra",setup(n){const{site:e,theme:t}=Ke(),{localeLinks:i,currentLang:s}=lr({correspondingLink:!0}),r=Ae(()=>i.value.length&&s.value.label||e.value.appearance||t.value.socialLinks);return(a,o)=>r.value?(I(),ve(lc,{key:0,class:"VPNavBarExtra",label:"extra navigation"},{default:z(()=>[L(i).length&&L(s).label?(I(),K("div",i_,[ee("p",s_,Qe(L(s).label),1),(I(!0),K(ct,null,zt(L(i),l=>(I(),ve(wa,{key:l.link,item:l},null,8,["item"]))),128))])):Se("",!0),L(e).appearance&&L(e).appearance!=="force-dark"&&L(e).appearance!=="force-auto"?(I(),K("div",r_,[ee("div",a_,[ee("p",o_,Qe(L(t).darkModeSwitchLabel||"Appearance"),1),ee("div",l_,[ye(ac)])])])):Se("",!0),L(t).socialLinks?(I(),K("div",c_,[ee("div",u_,[ye(cc,{class:"social-links-list",links:L(t).socialLinks},null,8,["links"])])])):Se("",!0)]),_:1})):Se("",!0)}}),d_=Oe(h_,[["__scopeId","data-v-bb2aa2f0"]]),f_=["aria-expanded"],p_=Ee({__name:"VPNavBarHamburger",props:{active:{type:Boolean}},emits:["click"],setup(n){return(e,t)=>(I(),K("button",{type:"button",class:it(["VPNavBarHamburger",{active:n.active}]),"aria-label":"mobile navigation","aria-expanded":n.active,"aria-controls":"VPNavScreen",onClick:t[0]||(t[0]=i=>e.$emit("click"))},[...t[1]||(t[1]=[ee("span",{class:"container"},[ee("span",{class:"top"}),ee("span",{class:"middle"}),ee("span",{class:"bottom"})],-1)])],10,f_))}}),m_=Oe(p_,[["__scopeId","data-v-e5dd9c1c"]]),g_=["innerHTML"],v_=Ee({__name:"VPNavBarMenuLink",props:{item:{}},setup(n){const{page:e}=Ke();return(t,i)=>(I(),ve(kn,{class:it({VPNavBarMenuLink:!0,active:L(qi)(L(e).relativePath,n.item.activeMatch||n.item.link,!!n.item.activeMatch)}),href:n.item.link,target:n.item.target,rel:n.item.rel,"no-icon":n.item.noIcon,tabindex:"0"},{default:z(()=>[ee("span",{innerHTML:n.item.text},null,8,g_)]),_:1},8,["class","href","target","rel","no-icon"]))}}),__=Oe(v_,[["__scopeId","data-v-e56f3d57"]]),x_=Ee({__name:"VPNavBarMenuGroup",props:{item:{}},setup(n){const e=n,{page:t}=Ke(),i=r=>"component"in r?!1:"link"in r?qi(t.value.relativePath,r.link,!!e.item.activeMatch):r.items.some(i),s=Ae(()=>i(e.item));return(r,a)=>(I(),ve(lc,{class:it({VPNavBarMenuGroup:!0,active:L(qi)(L(t).relativePath,n.item.activeMatch,!!n.item.activeMatch)||s.value}),button:n.item.text,items:n.item.items},null,8,["class","button","items"]))}}),y_={key:0,"aria-labelledby":"main-nav-aria-label",class:"VPNavBarMenu"},S_=Ee({__name:"VPNavBarMenu",setup(n){const{theme:e}=Ke();return(t,i)=>L(e).nav?(I(),K("nav",y_,[i[0]||(i[0]=ee("span",{id:"main-nav-aria-label",class:"visually-hidden"}," Main Navigation ",-1)),(I(!0),K(ct,null,zt(L(e).nav,s=>(I(),K(ct,{key:JSON.stringify(s)},["link"in s?(I(),ve(__,{key:0,item:s},null,8,["item"])):"component"in s?(I(),ve(Zt(s.component),wn({key:1,ref_for:!0},s.props),null,16)):(I(),ve(x_,{key:2,item:s},null,8,["item"]))],64))),128))])):Se("",!0)}}),M_=Oe(S_,[["__scopeId","data-v-dc692963"]]);function b_(n){const{localeIndex:e,theme:t}=Ke();function i(s){var g,v,m;const r=s.split("."),a=(g=t.value.search)==null?void 0:g.options,o=a&&typeof a=="object",l=o&&((m=(v=a.locales)==null?void 0:v[e.value])==null?void 0:m.translations)||null,c=o&&a.translations||null;let u=l,h=c,d=n;const f=r.pop();for(const p of r){let M=null;const y=d==null?void 0:d[p];y&&(M=d=y);const S=h==null?void 0:h[p];S&&(M=h=S);const E=u==null?void 0:u[p];E&&(M=u=E),y||(d=M),S||(h=M),E||(u=M)}return(u==null?void 0:u[f])??(h==null?void 0:h[f])??(d==null?void 0:d[f])??""}return i}const E_=["aria-label"],T_={class:"DocSearch-Button-Container"},A_={class:"DocSearch-Button-Placeholder"},su=Ee({__name:"VPNavBarSearchButton",setup(n){const t=b_({button:{buttonText:"Search",buttonAriaLabel:"Search"}});return(i,s)=>(I(),K("button",{type:"button",class:"DocSearch DocSearch-Button","aria-label":L(t)("button.buttonAriaLabel")},[ee("span",T_,[s[0]||(s[0]=ee("span",{class:"vp-icon DocSearch-Search-Icon"},null,-1)),ee("span",A_,Qe(L(t)("button.buttonText")),1)]),s[1]||(s[1]=ee("span",{class:"DocSearch-Button-Keys"},[ee("kbd",{class:"DocSearch-Button-Key"}),ee("kbd",{class:"DocSearch-Button-Key"},"K")],-1))],8,E_))}}),w_={class:"VPNavBarSearch"},C_={id:"local-search"},R_={key:1,id:"docsearch"},P_=Ee({__name:"VPNavBarSearch",setup(n){const e=Qm(()=>eg(()=>import("./VPLocalSearchBox.bbpZViL2.js"),__vite__mapDeps([0,1]))),t=()=>null,{theme:i}=Ke(),s=Ve(!1),r=Ve(!1);qt(()=>{});function a(){s.value||(s.value=!0,setTimeout(o,16))}function o(){const h=new Event("keydown");h.key="k",h.metaKey=!0,window.dispatchEvent(h),setTimeout(()=>{document.querySelector(".DocSearch-Modal")||o()},16)}function l(h){const d=h.target,f=d.tagName;return d.isContentEditable||f==="INPUT"||f==="SELECT"||f==="TEXTAREA"}const c=Ve(!1);Oo("k",h=>{(h.ctrlKey||h.metaKey)&&(h.preventDefault(),c.value=!0)}),Oo("/",h=>{l(h)||(h.preventDefault(),c.value=!0)});const u="local";return(h,d)=>{var f;return I(),K("div",w_,[L(u)==="local"?(I(),K(ct,{key:0},[c.value?(I(),ve(L(e),{key:0,onClose:d[0]||(d[0]=g=>c.value=!1)})):Se("",!0),ee("div",C_,[ye(su,{onClick:d[1]||(d[1]=g=>c.value=!0)})])],64)):L(u)==="algolia"?(I(),K(ct,{key:1},[s.value?(I(),ve(L(t),{key:0,algolia:((f=L(i).search)==null?void 0:f.options)??L(i).algolia,onVnodeBeforeMount:d[2]||(d[2]=g=>r.value=!0)},null,8,["algolia"])):Se("",!0),r.value?Se("",!0):(I(),K("div",R_,[ye(su,{onClick:a})]))],64)):Se("",!0)])}}}),L_=Ee({__name:"VPNavBarSocialLinks",setup(n){const{theme:e}=Ke();return(t,i)=>L(e).socialLinks?(I(),ve(cc,{key:0,class:"VPNavBarSocialLinks",links:L(e).socialLinks},null,8,["links"])):Se("",!0)}}),D_=Oe(L_,[["__scopeId","data-v-0394ad82"]]),I_=["href","rel","target"],F_=["innerHTML"],U_={key:2},N_=Ee({__name:"VPNavBarTitle",setup(n){const{site:e,theme:t}=Ke(),{hasSidebar:i}=Pn(),{currentLang:s}=lr(),r=Ae(()=>{var l;return typeof t.value.logoLink=="string"?t.value.logoLink:(l=t.value.logoLink)==null?void 0:l.link}),a=Ae(()=>{var l;return typeof t.value.logoLink=="string"||(l=t.value.logoLink)==null?void 0:l.rel}),o=Ae(()=>{var l;return typeof t.value.logoLink=="string"||(l=t.value.logoLink)==null?void 0:l.target});return(l,c)=>(I(),K("div",{class:it(["VPNavBarTitle",{"has-sidebar":L(i)}])},[ee("a",{class:"title",href:r.value??L(sc)(L(s).link),rel:a.value,target:o.value},[V(l.$slots,"nav-bar-title-before",{},void 0,!0),L(t).logo?(I(),ve(aa,{key:0,class:"logo",image:L(t).logo},null,8,["image"])):Se("",!0),L(t).siteTitle?(I(),K("span",{key:1,innerHTML:L(t).siteTitle},null,8,F_)):L(t).siteTitle===void 0?(I(),K("span",U_,Qe(L(e).title),1)):Se("",!0),V(l.$slots,"nav-bar-title-after",{},void 0,!0)],8,I_)],2))}}),O_=Oe(N_,[["__scopeId","data-v-1168a8e4"]]),B_={class:"items"},V_={class:"title"},k_=Ee({__name:"VPNavBarTranslations",setup(n){const{theme:e}=Ke(),{localeLinks:t,currentLang:i}=lr({correspondingLink:!0});return(s,r)=>L(t).length&&L(i).label?(I(),ve(lc,{key:0,class:"VPNavBarTranslations",icon:"vpi-languages",label:L(e).langMenuLabel||"Change language"},{default:z(()=>[ee("div",B_,[ee("p",V_,Qe(L(i).label),1),(I(!0),K(ct,null,zt(L(t),a=>(I(),ve(wa,{key:a.link,item:a},null,8,["item"]))),128))])]),_:1},8,["label"])):Se("",!0)}}),z_=Oe(k_,[["__scopeId","data-v-88af2de4"]]),G_={class:"wrapper"},H_={class:"container"},W_={class:"title"},$_={class:"content"},X_={class:"content-body"},q_=Ee({__name:"VPNavBar",props:{isScreenOpen:{type:Boolean}},emits:["toggle-screen"],setup(n){const e=n,{y:t}=ef(),{hasSidebar:i}=Pn(),{frontmatter:s}=Ke(),r=Ve({});return ic(()=>{r.value={"has-sidebar":i.value,home:s.value.layout==="home",top:t.value===0,"screen-open":e.isScreenOpen}}),(a,o)=>(I(),K("div",{class:it(["VPNavBar",r.value])},[ee("div",G_,[ee("div",H_,[ee("div",W_,[ye(O_,null,{"nav-bar-title-before":z(()=>[V(a.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":z(()=>[V(a.$slots,"nav-bar-title-after",{},void 0,!0)]),_:3})]),ee("div",$_,[ee("div",X_,[V(a.$slots,"nav-bar-content-before",{},void 0,!0),ye(P_,{class:"search"}),ye(M_,{class:"menu"}),ye(z_,{class:"translations"}),ye(L0,{class:"appearance"}),ye(D_,{class:"social-links"}),ye(d_,{class:"extra"}),V(a.$slots,"nav-bar-content-after",{},void 0,!0),ye(m_,{class:"hamburger",active:n.isScreenOpen,onClick:o[0]||(o[0]=l=>a.$emit("toggle-screen"))},null,8,["active"])])])])]),o[1]||(o[1]=ee("div",{class:"divider"},[ee("div",{class:"divider-line"})],-1))],2))}}),Y_=Oe(q_,[["__scopeId","data-v-6aa21345"]]),j_={key:0,class:"VPNavScreenAppearance"},K_={class:"text"},Z_=Ee({__name:"VPNavScreenAppearance",setup(n){const{site:e,theme:t}=Ke();return(i,s)=>L(e).appearance&&L(e).appearance!=="force-dark"&&L(e).appearance!=="force-auto"?(I(),K("div",j_,[ee("p",K_,Qe(L(t).darkModeSwitchLabel||"Appearance"),1),ye(ac)])):Se("",!0)}}),J_=Oe(Z_,[["__scopeId","data-v-b44890b2"]]),Q_=["innerHTML"],ex=Ee({__name:"VPNavScreenMenuLink",props:{item:{}},setup(n){const e=or("close-screen");return(t,i)=>(I(),ve(kn,{class:"VPNavScreenMenuLink",href:n.item.link,target:n.item.target,rel:n.item.rel,"no-icon":n.item.noIcon,onClick:L(e)},{default:z(()=>[ee("span",{innerHTML:n.item.text},null,8,Q_)]),_:1},8,["href","target","rel","no-icon","onClick"]))}}),tx=Oe(ex,[["__scopeId","data-v-df37e6dd"]]),nx=["innerHTML"],ix=Ee({__name:"VPNavScreenMenuGroupLink",props:{item:{}},setup(n){const e=or("close-screen");return(t,i)=>(I(),ve(kn,{class:"VPNavScreenMenuGroupLink",href:n.item.link,target:n.item.target,rel:n.item.rel,"no-icon":n.item.noIcon,onClick:L(e)},{default:z(()=>[ee("span",{innerHTML:n.item.text},null,8,nx)]),_:1},8,["href","target","rel","no-icon","onClick"]))}}),vf=Oe(ix,[["__scopeId","data-v-3e9c20e4"]]),sx={class:"VPNavScreenMenuGroupSection"},rx={key:0,class:"title"},ax=Ee({__name:"VPNavScreenMenuGroupSection",props:{text:{},items:{}},setup(n){return(e,t)=>(I(),K("div",sx,[n.text?(I(),K("p",rx,Qe(n.text),1)):Se("",!0),(I(!0),K(ct,null,zt(n.items,i=>(I(),ve(vf,{key:i.text,item:i},null,8,["item"]))),128))]))}}),ox=Oe(ax,[["__scopeId","data-v-8133b170"]]),lx=["aria-controls","aria-expanded"],cx=["innerHTML"],ux=["id"],hx={key:0,class:"item"},dx={key:1,class:"item"},fx={key:2,class:"group"},px=Ee({__name:"VPNavScreenMenuGroup",props:{text:{},items:{}},setup(n){const e=n,t=Ve(!1),i=Ae(()=>`NavScreenGroup-${e.text.replace(" ","-").toLowerCase()}`);function s(){t.value=!t.value}return(r,a)=>(I(),K("div",{class:it(["VPNavScreenMenuGroup",{open:t.value}])},[ee("button",{class:"button","aria-controls":i.value,"aria-expanded":t.value,onClick:s},[ee("span",{class:"button-text",innerHTML:n.text},null,8,cx),a[0]||(a[0]=ee("span",{class:"vpi-plus button-icon"},null,-1))],8,lx),ee("div",{id:i.value,class:"items"},[(I(!0),K(ct,null,zt(n.items,o=>(I(),K(ct,{key:JSON.stringify(o)},["link"in o?(I(),K("div",hx,[ye(vf,{item:o},null,8,["item"])])):"component"in o?(I(),K("div",dx,[(I(),ve(Zt(o.component),wn({ref_for:!0},o.props,{"screen-menu":""}),null,16))])):(I(),K("div",fx,[ye(ox,{text:o.text,items:o.items},null,8,["text","items"])]))],64))),128))],8,ux)],2))}}),mx=Oe(px,[["__scopeId","data-v-b9ab8c58"]]),gx={key:0,class:"VPNavScreenMenu"},vx=Ee({__name:"VPNavScreenMenu",setup(n){const{theme:e}=Ke();return(t,i)=>L(e).nav?(I(),K("nav",gx,[(I(!0),K(ct,null,zt(L(e).nav,s=>(I(),K(ct,{key:JSON.stringify(s)},["link"in s?(I(),ve(tx,{key:0,item:s},null,8,["item"])):"component"in s?(I(),ve(Zt(s.component),wn({key:1,ref_for:!0},s.props,{"screen-menu":""}),null,16)):(I(),ve(mx,{key:2,text:s.text||"",items:s.items},null,8,["text","items"]))],64))),128))])):Se("",!0)}}),_x=Ee({__name:"VPNavScreenSocialLinks",setup(n){const{theme:e}=Ke();return(t,i)=>L(e).socialLinks?(I(),ve(cc,{key:0,class:"VPNavScreenSocialLinks",links:L(e).socialLinks},null,8,["links"])):Se("",!0)}}),xx={class:"list"},yx=Ee({__name:"VPNavScreenTranslations",setup(n){const{localeLinks:e,currentLang:t}=lr({correspondingLink:!0}),i=Ve(!1);function s(){i.value=!i.value}return(r,a)=>L(e).length&&L(t).label?(I(),K("div",{key:0,class:it(["VPNavScreenTranslations",{open:i.value}])},[ee("button",{class:"title",onClick:s},[a[0]||(a[0]=ee("span",{class:"vpi-languages icon lang"},null,-1)),ri(" "+Qe(L(t).label)+" ",1),a[1]||(a[1]=ee("span",{class:"vpi-chevron-down icon chevron"},null,-1))]),ee("ul",xx,[(I(!0),K(ct,null,zt(L(e),o=>(I(),K("li",{key:o.link,class:"item"},[ye(kn,{class:"link",href:o.link},{default:z(()=>[ri(Qe(o.text),1)]),_:2},1032,["href"])]))),128))])],2)):Se("",!0)}}),Sx=Oe(yx,[["__scopeId","data-v-858fe1a4"]]),Mx={class:"container"},bx=Ee({__name:"VPNavScreen",props:{open:{type:Boolean}},setup(n){const e=Ve(null),t=tf(Ea?document.body:null);return(i,s)=>(I(),ve(ar,{name:"fade",onEnter:s[0]||(s[0]=r=>t.value=!0),onAfterLeave:s[1]||(s[1]=r=>t.value=!1)},{default:z(()=>[n.open?(I(),K("div",{key:0,class:"VPNavScreen",ref_key:"screen",ref:e,id:"VPNavScreen"},[ee("div",Mx,[V(i.$slots,"nav-screen-content-before",{},void 0,!0),ye(vx,{class:"menu"}),ye(Sx,{class:"translations"}),ye(J_,{class:"appearance"}),ye(_x,{class:"social-links"}),V(i.$slots,"nav-screen-content-after",{},void 0,!0)])],512)):Se("",!0)]),_:3}))}}),Ex=Oe(bx,[["__scopeId","data-v-f2779853"]]),Tx={key:0,class:"VPNav"},Ax=Ee({__name:"VPNav",setup(n){const{isScreenOpen:e,closeScreen:t,toggleScreen:i}=S0(),{frontmatter:s}=Ke(),r=Ae(()=>s.value.navbar!==!1);return Ta("close-screen",t),Ma(()=>{Ea&&document.documentElement.classList.toggle("hide-nav",!r.value)}),(a,o)=>r.value?(I(),K("header",Tx,[ye(Y_,{"is-screen-open":L(e),onToggleScreen:L(i)},{"nav-bar-title-before":z(()=>[V(a.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":z(()=>[V(a.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":z(()=>[V(a.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":z(()=>[V(a.$slots,"nav-bar-content-after",{},void 0,!0)]),_:3},8,["is-screen-open","onToggleScreen"]),ye(Ex,{open:L(e)},{"nav-screen-content-before":z(()=>[V(a.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":z(()=>[V(a.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3},8,["open"])])):Se("",!0)}}),_f=Oe(Ax,[["__scopeId","data-v-ae24b3ad"]]),wx=["role","tabindex"],Cx={key:1,class:"items"},Rx=Ee({__name:"VPSidebarItem",props:{item:{},depth:{}},setup(n){const e=n,{collapsed:t,collapsible:i,isLink:s,isActiveLink:r,hasActiveLink:a,hasChildren:o,toggle:l}=Rg(Ae(()=>e.item)),c=Ae(()=>o.value?"section":"div"),u=Ae(()=>s.value?"a":"div"),h=Ae(()=>o.value?e.depth+2===7?"p":`h${e.depth+2}`:"p"),d=Ae(()=>s.value?void 0:"button"),f=Ae(()=>[[`level-${e.depth}`],{collapsible:i.value},{collapsed:t.value},{"is-link":s.value},{"is-active":r.value},{"has-active":a.value}]);function g(m){"key"in m&&m.key!=="Enter"||!e.item.link&&l()}function v(){e.item.link&&l()}return(m,p)=>{const M=wi("VPSidebarItem",!0);return I(),ve(Zt(c.value),{class:it(["VPSidebarItem",f.value])},{default:z(()=>[n.item.text?(I(),K("div",wn({key:0,class:"item",role:d.value},tg(n.item.items?{click:g,keydown:g}:{},!0),{tabindex:n.item.items&&0}),[p[1]||(p[1]=ee("div",{class:"indicator"},null,-1)),n.item.link?(I(),ve(kn,{key:0,tag:u.value,class:"link",href:n.item.link,rel:n.item.rel,target:n.item.target},{default:z(()=>[(I(),ve(Zt(h.value),{class:"text",innerHTML:n.item.text},null,8,["innerHTML"]))]),_:1},8,["tag","href","rel","target"])):(I(),ve(Zt(h.value),{key:1,class:"text",innerHTML:n.item.text},null,8,["innerHTML"])),n.item.collapsed!=null&&n.item.items&&n.item.items.length?(I(),K("div",{key:2,class:"caret",role:"button","aria-label":"toggle section",onClick:v,onKeydown:ng(v,["enter"]),tabindex:"0"},[...p[0]||(p[0]=[ee("span",{class:"vpi-chevron-right caret-icon"},null,-1)])],32)):Se("",!0)],16,wx)):Se("",!0),n.item.items&&n.item.items.length?(I(),K("div",Cx,[n.depth<5?(I(!0),K(ct,{key:0},zt(n.item.items,y=>(I(),ve(M,{key:y.text,item:y,depth:n.depth+1},null,8,["item","depth"]))),128)):Se("",!0)])):Se("",!0)]),_:1},8,["class"])}}}),Px=Oe(Rx,[["__scopeId","data-v-b3fd67f8"]]),Lx=Ee({__name:"VPSidebarGroup",props:{items:{}},setup(n){const e=Ve(!0);let t=null;return qt(()=>{t=setTimeout(()=>{t=null,e.value=!1},300)}),Aa(()=>{t!=null&&(clearTimeout(t),t=null)}),(i,s)=>(I(!0),K(ct,null,zt(n.items,r=>(I(),K("div",{key:r.text,class:it(["group",{"no-transition":e.value}])},[ye(Px,{item:r,depth:0},null,8,["item"])],2))),128))}}),Dx=Oe(Lx,[["__scopeId","data-v-c40bc020"]]),Ix={class:"nav",id:"VPSidebarNav","aria-labelledby":"sidebar-aria-label",tabindex:"-1"},Fx=Ee({__name:"VPSidebar",props:{open:{type:Boolean}},setup(n){const{sidebarGroups:e,hasSidebar:t}=Pn(),i=n,s=Ve(null),r=tf(Ea?document.body:null);on([i,s],()=>{var o;i.open?(r.value=!0,(o=s.value)==null||o.focus()):r.value=!1},{immediate:!0,flush:"post"});const a=Ve(0);return on(e,()=>{a.value+=1},{deep:!0}),(o,l)=>L(t)?(I(),K("aside",{key:0,class:it(["VPSidebar",{open:n.open}]),ref_key:"navEl",ref:s,onClick:l[0]||(l[0]=ig(()=>{},["stop"]))},[l[2]||(l[2]=ee("div",{class:"curtain"},null,-1)),ee("nav",Ix,[l[1]||(l[1]=ee("span",{class:"visually-hidden",id:"sidebar-aria-label"}," Sidebar Navigation ",-1)),V(o.$slots,"sidebar-nav-before",{},void 0,!0),(I(),ve(Dx,{items:L(e),key:a.value},null,8,["items"])),V(o.$slots,"sidebar-nav-after",{},void 0,!0)])],2)):Se("",!0)}}),xf=Oe(Fx,[["__scopeId","data-v-319d5ca6"]]),Ux=Ee({__name:"VPSkipLink",setup(n){const{theme:e}=Ke(),t=Ts(),i=Ve();on(()=>t.path,()=>i.value.focus());function s({target:r}){const a=document.getElementById(decodeURIComponent(r.hash).slice(1));if(a){const o=()=>{a.removeAttribute("tabindex"),a.removeEventListener("blur",o)};a.setAttribute("tabindex","-1"),a.addEventListener("blur",o),a.focus(),window.scrollTo(0,0)}}return(r,a)=>(I(),K(ct,null,[ee("span",{ref_key:"backToTop",ref:i,tabindex:"-1"},null,512),ee("a",{href:"#VPContent",class:"VPSkipLink visually-hidden",onClick:s},Qe(L(e).skipToContentLabel||"Skip to content"),1)],64))}}),yf=Oe(Ux,[["__scopeId","data-v-0b0ada53"]]),Nx=Ee({__name:"Layout",setup(n){const{isOpen:e,open:t,close:i}=Pn(),s=Ts();on(()=>s.path,i),lf(e,i);const{frontmatter:r}=Ke(),a=nf(),o=Ae(()=>!!a["home-hero-image"]);return Ta("hero-image-slot-exists",o),(l,c)=>{const u=wi("Content");return L(r).layout!==!1?(I(),K("div",{key:0,class:it(["Layout",L(r).pageClass])},[V(l.$slots,"layout-top",{},void 0,!0),ye(yf),ye(rf,{class:"backdrop",show:L(e),onClick:L(i)},null,8,["show","onClick"]),ye(_f,null,{"nav-bar-title-before":z(()=>[V(l.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":z(()=>[V(l.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":z(()=>[V(l.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":z(()=>[V(l.$slots,"nav-bar-content-after",{},void 0,!0)]),"nav-screen-content-before":z(()=>[V(l.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":z(()=>[V(l.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3}),ye(pf,{open:L(e),onOpenMenu:L(t)},null,8,["open","onOpenMenu"]),ye(xf,{open:L(e)},{"sidebar-nav-before":z(()=>[V(l.$slots,"sidebar-nav-before",{},void 0,!0)]),"sidebar-nav-after":z(()=>[V(l.$slots,"sidebar-nav-after",{},void 0,!0)]),_:3},8,["open"]),ye(a0,null,{"page-top":z(()=>[V(l.$slots,"page-top",{},void 0,!0)]),"page-bottom":z(()=>[V(l.$slots,"page-bottom",{},void 0,!0)]),"not-found":z(()=>[V(l.$slots,"not-found",{},void 0,!0)]),"home-hero-before":z(()=>[V(l.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":z(()=>[V(l.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":z(()=>[V(l.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":z(()=>[V(l.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":z(()=>[V(l.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":z(()=>[V(l.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":z(()=>[V(l.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":z(()=>[V(l.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":z(()=>[V(l.$slots,"home-features-after",{},void 0,!0)]),"doc-footer-before":z(()=>[V(l.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":z(()=>[V(l.$slots,"doc-before",{},void 0,!0)]),"doc-after":z(()=>[V(l.$slots,"doc-after",{},void 0,!0)]),"doc-top":z(()=>[V(l.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":z(()=>[V(l.$slots,"doc-bottom",{},void 0,!0)]),"aside-top":z(()=>[V(l.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":z(()=>[V(l.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":z(()=>[V(l.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":z(()=>[V(l.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":z(()=>[V(l.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":z(()=>[V(l.$slots,"aside-ads-after",{},void 0,!0)]),_:3}),ye(ff),V(l.$slots,"layout-bottom",{},void 0,!0)],2)):(I(),ve(u,{key:1}))}}}),Ox=Oe(Nx,[["__scopeId","data-v-5d98c3a5"]]),Bx={Layout:Ox,enhanceApp:({app:n})=>{n.component("Badge",mg)}};function Sf(n){let e=!1,t;const i=sg(!0);return(...s)=>(e||(t=i.run(()=>n(...s)),e=!0),t)}const Vx=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const oa=n=>typeof n<"u",kx=Object.prototype.toString,zx=n=>kx.call(n)==="[object Object]",zo=()=>{};function Gx(n,e){function t(...i){return new Promise((s,r)=>{Promise.resolve(n(()=>e.apply(this,i),{fn:e,thisArg:this,args:i})).then(s).catch(r)})}return t}function Hx(...n){let e=0,t,i=!0,s=zo,r,a,o,l,c;!rg(n[0])&&typeof n[0]=="object"?{delay:a,trailing:o=!0,leading:l=!0,rejectOnCancel:c=!1}=n[0]:[a,o=!0,l=!0,c=!1]=n;const u=()=>{t&&(clearTimeout(t),t=void 0,s(),s=zo)};return d=>{const f=$i(a),g=Date.now()-e,v=()=>r=d();return u(),f<=0?(e=Date.now(),v()):(g>f?(e=Date.now(),(l||!i)&&v()):o&&(r=new Promise((m,p)=>{s=c?p:m,t=setTimeout(()=>{e=Date.now(),i=!0,m(v()),u()},Math.max(0,f-g))})),!l&&!t&&(t=setTimeout(()=>i=!0,f)),i=!1,r)}}function Oa(n){return Array.isArray(n)?n:[n]}function Wx(n,e=200,t=!1,i=!0,s=!1){return Gx(Hx(e,t,i,s),n)}function $x(n,e,t){return on(n,e,{...t,immediate:!0})}const Mf=Vx?window:void 0;function Xx(n){var e;const t=$i(n);return(e=t==null?void 0:t.$el)!==null&&e!==void 0?e:t}function Sr(...n){const e=(i,s,r,a)=>(i.addEventListener(s,r,a),()=>i.removeEventListener(s,r,a)),t=Ae(()=>{const i=Oa($i(n[0])).filter(s=>s!=null);return i.every(s=>typeof s!="string")?i:void 0});return $x(()=>{var i,s;return[(i=(s=t.value)===null||s===void 0?void 0:s.map(r=>Xx(r)))!==null&&i!==void 0?i:[Mf].filter(r=>r!=null),Oa($i(t.value?n[1]:n[0])),Oa(L(t.value?n[2]:n[1])),$i(t.value?n[3]:n[2])]},([i,s,r,a],o,l)=>{if(!(i!=null&&i.length)||!(s!=null&&s.length)||!(r!=null&&r.length))return;const c=zx(a)?{...a}:a,u=i.flatMap(h=>s.flatMap(d=>r.map(f=>e(h,d,f,c))));l(()=>{u.forEach(h=>h())})},{flush:"post"})}const qx={ctrl:"control",command:"meta",cmd:"meta",option:"alt",up:"arrowup",down:"arrowdown",left:"arrowleft",right:"arrowright"};function Yx(n={}){const{reactive:e=!1,target:t=Mf,aliasMap:i=qx,passive:s=!0,onEventFired:r=zo}=n,a=tu(new Set),o={toJSON(){return{}},current:a},l=e?tu(o):o,c=new Set,u=new Map([["Meta",c],["Shift",new Set],["Alt",new Set]]),h=new Set;function d(M,y){M in l&&(e?l[M]=y:l[M].value=y)}function f(){a.clear();for(const M of h)d(M,!1)}function g(M,y,S){if(!(!M||typeof y.getModifierState!="function")){for(const[E,T]of u)if(y.getModifierState(E)){S.forEach(w=>T.add(w));break}}}function v(M,y){if(M)return;const S=`${y[0].toUpperCase()}${y.slice(1)}`,E=u.get(S);if(!["shift","alt"].includes(y)||!E)return;const T=Array.from(E),w=T.indexOf(y);T.forEach((R,_)=>{_>=w&&(a.delete(R),d(R,!1))}),E.clear()}function m(M,y){var S,E;const T=(S=M.key)===null||S===void 0?void 0:S.toLowerCase(),w=[(E=M.code)===null||E===void 0?void 0:E.toLowerCase(),T].filter(Boolean);if(T){T&&(y?a.add(T):a.delete(T));for(const R of w)h.add(R),d(R,y);g(y,M,[...a,...w]),v(y,T),T==="meta"&&!y&&(c.forEach(R=>{a.delete(R),d(R,!1)}),c.clear())}}Sr(t,"keydown",M=>(m(M,!0),r(M)),{passive:s}),Sr(t,"keyup",M=>(m(M,!1),r(M)),{passive:s}),Sr("blur",f,{passive:s}),Sr("focus",f,{passive:s});const p=new Proxy(l,{get(M,y,S){if(typeof y!="string")return Reflect.get(M,y,S);if(y=y.toLowerCase(),y in i&&(y=i[y]),!(y in l))if(/[+_-]/.test(y)){const T=y.split(/[+_-]/g).map(w=>w.trim());l[y]=Ae(()=>T.map(w=>$i(p[w])).every(Boolean))}else l[y]=Dt(!1);const E=Reflect.get(M,y,S);return e?$i(E):E}});return p}var jx=Object.defineProperty,Kx=(n,e,t)=>e in n?jx(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t,In=(n,e,t)=>Kx(n,typeof e!="symbol"?e+"":e,t);const Et=class{};In(Et,"remove",(n,e)=>{if(!n||e===void 0)return;const[t]=n.splice(e,1);return t}),In(Et,"insert",(n,e,t)=>{!n||e===void 0||n.splice(e,0,t)}),In(Et,"move",(n,e,t,i)=>{if(!n||!t||e===void 0||i===void 0)return;const s=Et.remove(n,e);Et.insert(t,i,s)}),In(Et,"swap",(n,e,t,i)=>{if(!n||!t||e===void 0||i===void 0)return;const s=n[e],r=t[i];n[e]=r,t[i]=s}),In(Et,"copy",(n,e,t,i)=>{if(!n||e===void 0||!t||i===void 0)return;const s=n[e];Et.insert(t,i,s)}),In(Et,"applyTransfer",n=>{var e,t,i,s,r,a,o;const l=n.hovered.element.value,c=n.hovered.zone.value;if(l){const u=(t=(e=n.elementsMap.value.get(l))==null?void 0:e.data)==null?void 0:t.source,h=(s=(i=n.elementsMap.value.get(l))==null?void 0:i.data)==null?void 0:s.index,d=n.draggingElements.value.values().next().value,f=(r=d==null?void 0:d.data)==null?void 0:r.index,g=f!==void 0&&h!==void 0&&f>h?1:-1;Array.from(n.draggingElements.value.values()).sort((v,m)=>{var p,M;return g*((((p=v.data)==null?void 0:p.index)||0)-(((M=m.data)==null?void 0:M.index)||0))}).forEach(v=>{var m,p;return Et.move((m=v.data)==null?void 0:m.source,(p=v.data)==null?void 0:p.index,u,h)})}else if(c){const u=(o=(a=n.zonesMap.value.get(c))==null?void 0:a.data)==null?void 0:o.source,h=u==null?void 0:u.length;Array.from(n.draggingElements.value.values()).sort((d,f)=>{var g,v;return(((g=f.data)==null?void 0:g.index)||0)-(((v=d.data)==null?void 0:v.index)||0)}).forEach(d=>{var f,g;return Et.move((f=d.data)==null?void 0:f.source,(g=d.data)==null?void 0:g.index,u,h)})}}),In(Et,"applyCopy",n=>{var e,t,i,s,r,a;const o=n.hovered.element.value,l=n.hovered.zone.value;if(o){const c=(t=(e=n.elementsMap.value.get(o))==null?void 0:e.data)==null?void 0:t.source,u=(s=(i=n.elementsMap.value.get(o))==null?void 0:i.data)==null?void 0:s.index;Array.from(n.draggingElements.value.values()).sort((h,d)=>{var f,g;return(((f=d.data)==null?void 0:f.index)||0)-(((g=h.data)==null?void 0:g.index)||0)}).forEach(h=>{var d,f;return Et.copy((d=h.data)==null?void 0:d.source,(f=h.data)==null?void 0:f.index,c,u)})}else if(l){const c=(a=(r=n.zonesMap.value.get(l))==null?void 0:r.data)==null?void 0:a.source,u=c==null?void 0:c.length;Array.from(n.draggingElements.value.values()).sort((h,d)=>{var f,g;return(((f=d.data)==null?void 0:f.index)||0)-(((g=h.data)==null?void 0:g.index)||0)}).forEach(h=>{var d,f;return Et.copy((d=h.data)==null?void 0:d.source,(f=h.data)==null?void 0:f.index,c,u)})}}),In(Et,"applySwap",n=>{var e,t,i,s,r,a,o,l;const c=n.hovered.element.value,u=n.hovered.zone.value;if(c&&n.draggingElements.value.size===1){const h=n.draggingElements.value.values().next().value;Et.swap((e=h==null?void 0:h.data)==null?void 0:e.source,(t=h==null?void 0:h.data)==null?void 0:t.index,(s=(i=n.elementsMap.value.get(c))==null?void 0:i.data)==null?void 0:s.source,(a=(r=n.elementsMap.value.get(c))==null?void 0:r.data)==null?void 0:a.index)}else if(u){const h=(l=(o=n.zonesMap.value.get(u))==null?void 0:o.data)==null?void 0:l.source,d=h==null?void 0:h.length;Array.from(n.draggingElements.value.values()).sort((f,g)=>{var v,m;return(((v=g.data)==null?void 0:v.index)||0)-(((m=f.data)==null?void 0:m.index)||0)}).forEach(f=>{var g,v;return Et.move((g=f.data)==null?void 0:g.source,(v=f.data)==null?void 0:v.index,h,d)})}}),In(Et,"applyRemove",n=>{Array.from(n.draggingElements.value.values()).sort((e,t)=>{var i,s;return(((i=t.data)==null?void 0:i.index)||0)-(((s=e.data)==null?void 0:s.index)||0)}).forEach(e=>{var t,i;(t=e.data)!=null&&t.source&&((i=e.data)==null?void 0:i.index)!==void 0&&Et.remove(e.data.source,e.data.index)})}),In(Et,"applyInsert",(n,e)=>{var t,i,s,r,a,o;const l=n.hovered.element.value,c=n.hovered.zone.value;if(l&&e.length>0){const u=(i=(t=n.elementsMap.value.get(l))==null?void 0:t.data)==null?void 0:i.source,h=(r=(s=n.elementsMap.value.get(l))==null?void 0:s.data)==null?void 0:r.index;e.forEach(d=>{Et.insert(u,h,d)})}else if(c){const u=(o=(a=n.zonesMap.value.get(c))==null?void 0:a.data)==null?void 0:o.source,h=u==null?void 0:u.length;e.forEach(d=>{Et.insert(u,h,d)})}});let N3=Et;const Ln=Sf(()=>{const n=Dt(!1),e=Ve(new Map),t=Ae(()=>e.value.size>0),i={component:Ve(null),ref:Dt(null),options:Dt(null),props:Dt(null),animating:{enter:Dt(!1),leave:Dt(!1),appear:Dt(!1)}},s=Ve(new Map),r=Ve(new Set),a=Ve(new Map),o=Dt(new Set),l=Dt(new Set),c=typeof window<"u"&&"IntersectionObserver"in window,u=c?new IntersectionObserver(R=>{R.forEach(_=>l.value[_.isIntersecting?"add":"delete"](_.target))}):null,h=c?new IntersectionObserver(R=>{R.forEach(_=>o.value[_.isIntersecting?"add":"delete"](_.target))}):null,d=(R,_)=>{u&&(R==="add"?u.observe(_):(u.unobserve(_),l.value.delete(_)))},f=(R,_)=>{h&&(R==="add"?h.observe(_):(h.unobserve(_),o.value.delete(_)))},g={start:Dt(null),current:Dt(null),offset:{percent:Dt(null),pixel:Dt(null)}},{KeyW:v,KeyS:m,KeyA:p,KeyD:M,ctrl:y,shift:S,alt:E,meta:T}=Yx(),w={zone:Dt(null),element:Dt(null)};return{draggingElements:e,isDragging:t,activeContainer:i,elementsMap:s,selectedElements:r,zonesMap:a,visibleZones:o,visibleElements:l,pointerPosition:g,keyboard:{w:v,s:m,a:p,d:M,ctrl:y,shift:S,alt:E,meta:T},hovered:w,isPending:n,handleDragElementIntersection:d,handleDropZoneIntersection:f}}),Zx=n=>{const e=Ve(null),{draggingElements:t,pointerPosition:i,isDragging:s,activeContainer:r}=Ln();return qt(()=>{r.ref=e,r.options.value=n??null}),hi(()=>{r.ref.value=null,r.options.value=null}),{elementRef:e,draggingElements:t,pointerPosition:i,isDragging:s,animating:r.animating}},Jx=["innerHTML"],Qx=Ee({__name:"DefaultOverlay",props:{styles:{}},setup(n){const{elementRef:e,pointerPosition:t,isDragging:i,draggingElements:s}=Zx(),r=Ae(()=>{var a,o,l,c;return{transform:`translate3d(${(((a=t.current.value)==null?void 0:a.x)??0)-(((o=t.offset.pixel.value)==null?void 0:o.x)??0)}px, ${(((l=t.current.value)==null?void 0:l.y)??0)-(((c=t.offset.pixel.value)==null?void 0:c.y)??0)}px, 0)`,zIndex:1e3,position:"fixed",top:0,left:0,transition:"0.3s cubic-bezier(0.165, 0.84, 0.44, 1)",...n.styles}});return(a,o)=>L(i)?(I(),K("div",{key:0,ref_key:"elementRef",ref:e,style:ra(r.value)},[(I(!0),K(ct,null,zt(L(s),([l,c])=>{var u,h;return I(),K(ct,{key:c.id},[c.layer?(I(),ve(Zt(c.layer),{key:0,node:l,data:c.data,id:c.id,groups:c.groups},null,8,["node","data","id","groups"])):(I(),K("div",{key:1,innerHTML:c.initialHTML,style:ra({width:`${(u=c.initialRect)==null?void 0:u.width}px`,height:`${(h=c.initialRect)==null?void 0:h.height}px`})},null,12,Jx))],64)}),128))],4)):Se("",!0)}}),ru=Ee({__name:"DragOverlay",props:{styles:{}},setup(n){const e=n,{activeContainer:t}=Ln(),i=Ae(()=>({component:t.component.value??Qx,props:{...e,...t.props.value}}));return(s,r)=>L(t).options.value?(I(),ve(ar,{key:0,name:L(t).options.value.name,duration:L(t).options.value.duration,"enter-from-class":L(t).options.value.enterFromClass,"enter-to-class":L(t).options.value.enterToClass,"enter-active-class":L(t).options.value.enterActiveClass,"leave-from-class":L(t).options.value.leaveFromClass,"leave-to-class":L(t).options.value.leaveToClass,"leave-active-class":L(t).options.value.leaveActiveClass,"appear-active-class":L(t).options.value.appearActiveClass,"appear-from-class":L(t).options.value.appearFromClass,"appear-to-class":L(t).options.value.appearToClass,mode:L(t).options.value.mode,type:L(t).options.value.type,css:L(t).options.value.css,appear:!0,persisted:L(t).options.value.persisted,onEnter:L(t).options.value.onEnter,onLeave:L(t).options.value.onLeave,onBeforeEnter:L(t).options.value.onBeforeEnter,onBeforeLeave:L(t).options.value.onBeforeLeave,onBeforeAppear:L(t).options.value.onBeforeAppear,onAfterEnter:L(t).options.value.onAfterEnter,onAfterLeave:L(t).options.value.onAfterLeave,onAfterAppear:L(t).options.value.onAfterAppear},{default:z(()=>[(I(),ve(Zt(i.value.component||i.value),iu(ag(i.value.props||{})),null,16))]),_:1},8,["name","duration","enter-from-class","enter-to-class","enter-active-class","leave-from-class","leave-to-class","leave-active-class","appear-active-class","appear-from-class","appear-to-class","mode","type","css","persisted","onEnter","onLeave","onBeforeEnter","onBeforeLeave","onBeforeAppear","onAfterEnter","onAfterLeave","onAfterAppear"])):(I(),ve(Zt(i.value.component||i.value),iu(wn({key:1},i.value.props||{})),null,16))}}),ey={install(n,e){n.component("DragOverlay",ru);const t=n.mount;n.mount=function(s){var r,a,o,l,c,u,h;const d=t.call(this,s),f=typeof s=="string"?document.querySelector(s):s;if(f&&f instanceof Element&&!f.querySelector("#vue-dnd-kit-overlay")){const g=document.createElement("div");g.id="vue-dnd-kit-overlay",g.style.pointerEvents="none",(r=e==null?void 0:e.overlayPosition)!=null&&r.zIndex&&(g.style.zIndex=e.overlayPosition.zIndex.toString()),(a=e==null?void 0:e.overlayPosition)!=null&&a.className&&(g.className=e.overlayPosition.className);const v=((o=e==null?void 0:e.overlayPosition)==null?void 0:o.method)||"append",m=(l=e==null?void 0:e.overlayPosition)!=null&&l.target?typeof e.overlayPosition.target=="string"?document.querySelector(e.overlayPosition.target):e.overlayPosition.target:f;if(m&&m instanceof Element)switch(v){case"prepend":m.insertBefore(g,m.firstChild);break;case"after":(c=m.parentNode)==null||c.insertBefore(g,m.nextSibling);break;case"before":(u=m.parentNode)==null||u.insertBefore(g,m);break;case"append":default:m.appendChild(g);break}else f.appendChild(g);const p=ye(ru,{styles:(h=e==null?void 0:e.defaultOverlay)==null?void 0:h.styles});nu(p,g),n.__VUE_DND_KIT_OVERLAY__={container:g,vnode:p,options:(e==null?void 0:e.defaultOverlay)||{}};const M=Ln();n.__VUE_DND_KIT_STORE__=M}return d};const i=n.unmount;n.unmount=function(){return n.__VUE_DND_KIT_OVERLAY__&&(nu(null,n.__VUE_DND_KIT_OVERLAY__.container),delete n.__VUE_DND_KIT_OVERLAY__),i.call(this)}}},au=(n,e)=>n.x<e.x+e.width&&n.x+n.width>e.x&&n.y<e.y+e.height&&n.y+n.height>e.y,Bi=n=>{if(!n)return{x:0,y:0,width:0,height:0,bottom:0,left:0,right:0,top:0};const e=n.getBoundingClientRect();return{bottom:e.bottom,left:e.left,right:e.right,top:e.top,x:e.x,y:e.y,width:e.width,height:e.height}},Ba=n=>({x:n.x+n.width/2,y:n.y+n.height/2}),ty=(n,e)=>{const t=Bi(n);return{pixel:{x:e.x-t.x,y:e.y-t.y},percent:{x:(e.x-t.x)/t.width*100,y:(e.y-t.y)/t.height*100}}},ou=(n,e)=>{const t=e.x-n.x,i=e.y-n.y;return Math.sqrt(t*t+i*i)},lu=(n,e)=>{const t=Math.max(0,Math.min(n.x+n.width,e.x+e.width)-Math.max(n.x,e.x)),i=Math.max(0,Math.min(n.y+n.height,e.y+e.height)-Math.max(n.y,e.y)),s=t*i,r=n.width*n.height,a=e.width*e.height;return(s/r*100+s/a*100)/2},cu="data-vue-dnd-kit-draggable",dn=n=>{n.preventDefault()},pi=n=>({items:Array.from(n.draggingElements.value.values())}),ny=n=>{const{elementsMap:e,draggingElements:t,hovered:i,selectedElements:s,isDragging:r,visibleElements:a,handleDragElementIntersection:o}=Ln(),l=Ve(null),c=Ae(()=>i.element.value===l.value),u=Dt((n==null?void 0:n.id)||og()),h=Dt((n==null?void 0:n.disabled)??!1),d=Ae(()=>h.value||!l.value||!e.value.has(l.value)?!1:t.value.has(l.value)),f=Ae(()=>{if(h.value||!l.value||!r.value||!a.value.has(l.value))return!1;const v=e.value.get(l.value);return v!=null&&v.groups.length?!Array.from(t.value.entries()).some(([m,p])=>p.groups.length?!p.groups.some(M=>v.groups.includes(M)):!1):!0}),g=Ae(()=>{if(h.value||!l.value||!r.value||!a.value.has(l.value)||i.element.value!==l.value)return!1;const v=e.value.get(l.value);return v!=null&&v.groups.length?!Array.from(t.value.entries()).some(([m,p])=>p.groups.length?!p.groups.some(M=>v.groups.includes(M)):!1):!0});return{elementRef:l,registerElement:()=>{if(!l.value)throw new Error("ElementRef is not set");e.value.set(l.value,{node:l.value,groups:(n==null?void 0:n.groups)??[],layer:(n==null?void 0:n.layer)??null,defaultLayer:(n==null?void 0:n.layer)??null,events:(n==null?void 0:n.events)??{},data:(n==null?void 0:n.data)??null,id:u.value,disabled:h??!1}),o("add",l.value),l.value.addEventListener("dragstart",dn),l.value.addEventListener("drag",dn),l.value.setAttribute(cu,"true"),l.value.setAttribute("draggable","false")},unregisterElement:()=>{l.value&&(e.value.delete(l.value),s.value.delete(l.value),l.value.removeEventListener("dragstart",dn),l.value.removeEventListener("drag",dn),l.value.removeAttribute(cu),l.value.removeAttribute("draggable"))},isDragging:d,isOvered:c,isAllowed:f,isLazyAllowed:g,id:u}},sn=(n,e)=>n?e.contains(n):!1,iy=n=>{var e,t;const i=Bi(n.activeContainer.ref.value),s=Ba(i),r=((e=n.pointerPosition.current.value)==null?void 0:e.x)??0,a=((t=n.pointerPosition.current.value)==null?void 0:t.y)??0,o=!(i&&r>=i.x&&r<=i.x+i.width&&a>=i.y&&a<=i.y+i.height),l=Array.from(n.draggingElements.value.keys()),c=Array.from(n.visibleElements.value.entries()).filter(([h,d])=>{if(!h)return!1;const f=Bi(h);return f&&i&&au(f,i)}).map(([h,d])=>{const f=Bi(h),g=Ba(f),v=r>=f.x&&r<=f.x+f.width&&a>=f.y&&a<=f.y+f.height,m=lu(f,i),p=ou(s,g);let M=0;for(const[y,S]of n.visibleElements.value.entries())y!==h&&y&&h&&sn(h,y)&&M++;return{element:d,node:h,isPointerInElement:v,overlapPercent:m,depth:M,centerDistance:p}}).sort((h,d)=>{if(!o){if(h.isPointerInElement&&d.isPointerInElement)return d.depth-h.depth;if(h.isPointerInElement!==d.isPointerInElement)return h.isPointerInElement?-1:1}return Math.abs(h.overlapPercent-d.overlapPercent)<=1?h.centerDistance-d.centerDistance:d.overlapPercent-h.overlapPercent}),u=Array.from(n.visibleZones.value.entries()).filter(([h,d])=>{if(!h||l.some(g=>g&&sn(h,g)))return!1;const f=Bi(h);return f&&i&&au(f,i)}).map(([h,d])=>{const f=Bi(h),g=Ba(f),v=r>=f.x&&r<=f.x+f.width&&a>=f.y&&a<=f.y+f.height,m=lu(f,i),p=ou(s,g);let M=0;for(const[y,S]of n.visibleZones.value.entries())y!==h&&y&&h&&sn(h,y)&&M++;return{zone:d,node:h,isPointerInElement:v,overlapPercent:m,depth:M,centerDistance:p}}).sort((h,d)=>{if(!o){if(h.isPointerInElement&&d.isPointerInElement)return d.depth-h.depth;if(h.isPointerInElement!==d.isPointerInElement)return h.isPointerInElement?-1:1}return Math.abs(h.overlapPercent-d.overlapPercent)<=1?h.centerDistance-d.centerDistance:d.overlapPercent-h.overlapPercent});return[...c.map(h=>h.node),...u.map(h=>h.node)]},sy=(n,e)=>{const{pointerPosition:t,keyboard:i}=Ln(),s=(e==null?void 0:e.moveStep)||10;return{onKeyboardStart:r=>{var a;dn(r);const o=Bi(n.value);(a=n.value)==null||a.blur();const l=o.x+o.width/2,c=o.y+o.height/2;t.start.value={x:l,y:c},t.current.value={x:l,y:c},t.offset.pixel.value={x:o.width/2,y:o.height/2},t.offset.percent.value={x:50,y:50}},onKeyboardMove:()=>{if(!t.current.value)return;const r=t.current.value.x,a=t.current.value.y;let o=r,l=a;i.w.value&&(l-=s),i.s.value&&(l+=s),i.a.value&&(o-=s),i.d.value&&(o+=s),t.current.value={x:o,y:l}},onKeyboardEnd:()=>{t.current.value=null,t.start.value=null,t.offset.pixel.value=null,t.offset.percent.value=null}}},ry=n=>{const e=Ln();return{onPointerStart:t=>{e.pointerPosition.start.value={x:t.clientX,y:t.clientY},e.pointerPosition.current.value={x:t.clientX,y:t.clientY};const{pixel:i,percent:s}=ty(n.value,{x:t.clientX,y:t.clientY});e.pointerPosition.offset.pixel.value=i,e.pointerPosition.offset.percent.value=s},onPointerMove:t=>{e.isPending.value||(e.pointerPosition.current.value={x:t.clientX,y:t.clientY})},onPointerEnd:()=>{e.pointerPosition.current.value=null,e.pointerPosition.start.value=null,e.pointerPosition.offset.pixel.value=null,e.pointerPosition.offset.percent.value=null}}},ay=(n,e)=>{var t,i;const s=Ln(),{onPointerStart:r,onPointerMove:a,onPointerEnd:o}=ry(n),{onKeyboardStart:l,onKeyboardMove:c,onKeyboardEnd:u}=sy(n,e==null?void 0:e.keyboard);let h=null;const d=S=>{var E,T;if(!S)return new Map;const w=s.selectedElements.value.has(S);if(s.selectedElements.value.size>0&&w){const b=new Map;return s.selectedElements.value.forEach(P=>{var k,B;const N=s.elementsMap.value.get(P);N&&b.set(P,{...N,initialHTML:((k=N.node)==null?void 0:k.outerHTML)??"",initialRect:(B=N.node)==null?void 0:B.getBoundingClientRect()})}),b}s.selectedElements.value.clear();const R=s.elementsMap.value.get(S);if(!R)return new Map;const _=new Map;return _.set(S,{...R,initialHTML:((E=R.node)==null?void 0:E.outerHTML)??"",initialRect:(T=R.node)==null?void 0:T.getBoundingClientRect()}),_},f=S=>{if(!S)return{element:null,zone:null};const E=Array.isArray(S)?S:[S],T=Array.from(s.draggingElements.value.keys()),w=Array.from(s.zonesMap.value.entries()).flatMap(([b,P])=>P.disabled?[b]:[]),R=Array.from(s.elementsMap.value.entries()).flatMap(([b,P])=>P.disabled?[b]:[]),_=E.find(b=>{if(!s.visibleZones.value.has(b))return!1;const P=s.zonesMap.value.get(b);return!(!P||P.disabled||w.some(k=>b===k||sn(b,k))||T.some(k=>k&&(k===P.node||sn(P.node,k)))||P.groups.length&&Array.from(s.draggingElements.value.values()).some(k=>k.groups.length?!k.groups.some(B=>P.groups.includes(B)):!1))});return _?{element:E.filter(b=>{if(!s.visibleElements.value.has(b)||!s.elementsMap.value.has(b))return!1;const P=s.elementsMap.value.get(b);if(P!=null&&P.disabled)return!1;const k=w.some(N=>b===N||sn(b,N)),B=R.some(N=>b===N||sn(b,N));return k||B?!1:!Array.from(s.draggingElements.value.values()).some(N=>N.groups.length?!N.groups.some(j=>{var q;return(q=s.elementsMap.value.get(b))==null?void 0:q.groups.includes(j)}):!1)}).find(b=>T.some(P=>P&&(P===b||sn(b,P)||sn(P,b)))?!1:b===_||sn(b,_))||null,zone:_}:{element:null,zone:null}},g=((t=e==null?void 0:e.sensor)==null?void 0:t.setup)||iy,v=S=>{var E,T,w,R,_,b,P,k,B,N,j,q;const X=s.hovered.element.value,Q=s.hovered.zone.value,ce=S.element,oe=S.zone;s.hovered.element.value=ce,s.hovered.zone.value=oe,X!==ce&&(X&&((w=(T=(E=s.elementsMap.value.get(X))==null?void 0:E.events)==null?void 0:T.onLeave)==null||w.call(T,s,pi(s))),ce&&((b=(_=(R=s.elementsMap.value.get(ce))==null?void 0:R.events)==null?void 0:_.onHover)==null||b.call(_,s,pi(s)))),Q!==oe&&(Q&&((B=(k=(P=s.zonesMap.value.get(Q))==null?void 0:P.events)==null?void 0:k.onLeave)==null||B.call(k,s,pi(s))),oe&&((q=(j=(N=s.zonesMap.value.get(oe))==null?void 0:N.events)==null?void 0:j.onHover)==null||q.call(j,s,pi(s))))},m=Wx(()=>{const S=g(s),E=f(S);v(E)},((i=e==null?void 0:e.sensor)==null?void 0:i.throttle)??0),p=()=>{m(),h=requestAnimationFrame(p)},M=()=>p(),y=()=>{h!==null&&(o(),u(),cancelAnimationFrame(h),h=null)};return{activate:S=>{s.draggingElements.value=d(n.value),s.draggingElements.value.forEach(E=>{var T,w;return(w=(T=E.events).onStart)==null?void 0:w.call(T,s,pi(s))}),S instanceof PointerEvent?r(S):l(S),M()},track:S=>{s.draggingElements.value.forEach(E=>{var T,w;return(w=(T=E.events).onMove)==null?void 0:w.call(T,s,pi(s))}),S instanceof KeyboardEvent?c():a(S)},deactivate:async(S=!0)=>{var E,T;if(s.hovered.zone.value){const w=s.zonesMap.value.get(s.hovered.zone.value),R=(T=w==null?void 0:(E=w.events).onDrop)==null?void 0:T.call(E,s,pi(s));if(R instanceof Promise)try{s.isPending.value=!0;const _=await R;return _&&(S&&s.selectedElements.value.clear(),s.draggingElements.value.clear(),s.hovered.zone.value=null,s.hovered.element.value=null,y()),_}catch{return!1}finally{s.isPending.value=!1}else S&&s.selectedElements.value.clear(),s.draggingElements.value.clear(),s.hovered.zone.value=null,s.hovered.element.value=null,y()}else s.draggingElements.value.forEach(w=>{var R,_;return(_=(R=w.events).onEnd)==null?void 0:_.call(R,s,pi(s))}),S&&s.selectedElements.value.clear(),s.draggingElements.value.clear(),s.hovered.zone.value=null,s.hovered.element.value=null,y()}}},oy=Sf(()=>{let n="",e="",t="",i=null,s=null,r=null,a=null,o=null;const{activeContainer:l,isPending:c,elementsMap:u}=Ln(),h=()=>{const g=document.body;n=g.style.userSelect,g.style.userSelect="none",window.addEventListener("contextmenu",dn),window.addEventListener("selectstart",dn),window.addEventListener("touchstart",dn),window.addEventListener("touchmove",dn)},d=()=>{const g=document.body;g.style.userSelect=n,g.style.touchAction=e,g.style.overscrollBehavior=t,window.removeEventListener("contextmenu",dn),window.removeEventListener("selectstart",dn),window.removeEventListener("touchstart",dn),window.removeEventListener("touchmove",dn)},f=()=>{i&&(document.removeEventListener("pointermove",i),i=null),s&&(document.removeEventListener("pointerup",s),s=null),r&&(r=null),a&&(document.removeEventListener("wheel",a),a=null),o&&(document.removeEventListener("keydown",o),document.removeEventListener("keypress",o),document.removeEventListener("keyup",o),o=null)};return{handleDragStart:(g,v,m)=>{if(!v.value||c.value)return;const p=u.value.get(v.value);if(p!=null&&p.disabled)return;f(),g.target.blur(),m!=null&&m.container&&(l.component.value=m.container),m!=null&&m.containerProps&&(l.props.value=m.containerProps);const{activate:M,track:y,deactivate:S}=ay(v,m);s=()=>{S(!0).then(E=>{E!==!1&&(l.component.value=null,d(),S(!0),f())})},r=()=>{l.component.value=null,d(),S(!1),f()},i=E=>y(E),a=E=>y(E),o=E=>{E.type==="keyup"&&(E.code==="Escape"&&(r==null||r()),E.code==="Enter"&&(s==null||s())),y(E)},h(),M(g),document.addEventListener("pointermove",i),document.addEventListener("pointerup",s),document.addEventListener("wheel",a),document.addEventListener("keydown",o),document.addEventListener("keypress",o),document.addEventListener("keyup",o)}}}),O3=n=>{const{id:e,elementRef:t,isDragging:i,isOvered:s,isAllowed:r,isLazyAllowed:a,registerElement:o,unregisterElement:l}=ny(n),{pointerPosition:c}=Ln(),{handleDragStart:u}=oy(),h=d=>u(d,t,n);return qt(o),Aa(l),{pointerPosition:c,elementRef:t,isDragging:i,isOvered:s,isAllowed:r,isLazyAllowed:a,handleDragStart:h,id:e}},ly=n=>{const{zonesMap:e,hovered:t,draggingElements:i,isDragging:s,handleDropZoneIntersection:r}=Ln(),a=Ve(null),o=Ae(()=>t.zone.value===a.value),l=Ae(()=>{if(!a.value||!s.value)return!1;const u=e.value.get(a.value);return u!=null&&u.groups.length?!Array.from(i.value.values()).some(h=>h.groups.length?!h.groups.some(d=>u.groups.includes(d)):!1):!0}),c=Ae(()=>{if(!a.value||!s.value||t.zone.value!==a.value)return!1;const u=e.value.get(a.value);return u!=null&&u.groups.length?!Array.from(i.value.values()).some(h=>!h.groups.some(d=>u.groups.includes(d))):!0});return{elementRef:a,registerZone:()=>{if(!a.value)throw new Error("elementRef is not set");r("add",a.value),e.value.set(a.value,{node:a.value,groups:(n==null?void 0:n.groups)??[],events:(n==null?void 0:n.events)??{},data:(n==null?void 0:n.data)??void 0,disabled:(n==null?void 0:n.disabled)??!1}),a.value.setAttribute("data-dnd-droppable","true")},unregisterZone:()=>{a.value&&(r("remove",a.value),e.value.delete(a.value))},isOvered:o,isAllowed:l,isLazyAllowed:c}},B3=n=>{const{elementRef:e,registerZone:t,unregisterZone:i,isOvered:s,isAllowed:r,isLazyAllowed:a}=ly(n);return qt(t),Aa(i),{elementRef:e,isOvered:s,isAllowed:r,isLazyAllowed:a}},V3=n=>{const{selectedElements:e,elementsMap:t}=Ln(),i=Ae(()=>n.value?e.value.has(n.value):!1),s=Ae(()=>{if(!n.value)return!1;for(const l of e.value)if(l&&sn(l,n.value))return!0;return!1}),r=Ae(()=>{if(!n.value)return!1;for(const l of e.value)if(l&&sn(n.value,l))return!0;return!1}),a=()=>{n.value&&e.value.delete(n.value)},o=()=>{if(!(!n.value||!t.value.get(n.value))){if(s.value)for(const l of e.value)l&&sn(l,n.value)&&e.value.delete(l);if(r.value)for(const l of e.value)l&&sn(n.value,l)&&e.value.delete(l);e.value.add(n.value)}};return{handleUnselect:a,handleSelect:o,handleToggleSelect:()=>{n.value&&(e.value.has(n.value)?a():o())},isSelected:i,isParentOfSelected:s}},Mr=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function cy(n,e){let t=new Set,i=new Set,s=!1,r=!1;const a=new WeakSet;let o={delta:0,timestamp:0,isProcessing:!1};function l(u){a.has(u)&&(c.schedule(u),n()),u(o)}const c={schedule:(u,h=!1,d=!1)=>{const g=d&&s?t:i;return h&&a.add(u),g.has(u)||g.add(u),u},cancel:u=>{i.delete(u),a.delete(u)},process:u=>{if(o=u,s){r=!0;return}s=!0,[t,i]=[i,t],t.forEach(l),t.clear(),s=!1,r&&(r=!1,c.process(u))}};return c}const ai={},uy=40;function bf(n,e){let t=!1,i=!0;const s={delta:0,timestamp:0,isProcessing:!1},r=()=>t=!0,a=Mr.reduce((y,S)=>(y[S]=cy(r),y),{}),{setup:o,read:l,resolveKeyframes:c,preUpdate:u,update:h,preRender:d,render:f,postRender:g}=a,v=()=>{const y=ai.useManualTiming?s.timestamp:performance.now();t=!1,ai.useManualTiming||(s.delta=i?1e3/60:Math.max(Math.min(y-s.timestamp,uy),1)),s.timestamp=y,s.isProcessing=!0,o.process(s),l.process(s),c.process(s),u.process(s),h.process(s),d.process(s),f.process(s),g.process(s),s.isProcessing=!1,t&&e&&(i=!1,n(v))},m=()=>{t=!0,i=!0,s.isProcessing||n(v)};return{schedule:Mr.reduce((y,S)=>{const E=a[S];return y[S]=(T,w=!1,R=!1)=>(t||m(),E.schedule(T,w,R)),y},{}),cancel:y=>{for(let S=0;S<Mr.length;S++)a[Mr[S]].cancel(y)},state:s,steps:a}}const rn=n=>n,{schedule:_t,cancel:oi,state:Gt,steps:Va}=bf(typeof requestAnimationFrame<"u"?requestAnimationFrame:rn,!0);let Kr;function hy(){Kr=void 0}const Kt={now:()=>(Kr===void 0&&Kt.set(Gt.isProcessing||ai.useManualTiming?Gt.timestamp:performance.now()),Kr),set:n=>{Kr=n,queueMicrotask(hy)}},Cn=n=>n*1e3,_n=n=>n/1e3;function dy(n,e){const t=Kt.now(),i=({timestamp:s})=>{const r=s-t;r>=e&&(oi(i),n(r-e))};return _t.setup(i,!0),()=>oi(i)}const cr=n=>({test:e=>typeof e=="string"&&e.endsWith(n)&&e.split(" ").length===1,parse:parseFloat,transform:e=>`${e}${n}`}),Si=cr("deg"),zn=cr("%"),xe=cr("px"),fy=cr("vh"),py=cr("vw"),uu={...zn,parse:n=>zn.parse(n)/100,transform:n=>zn.transform(n*100)};function hu(n,e){return e.max===e.min?0:n/(e.max-e.min)*100}const On={correct:(n,e)=>{if(!e.target)return n;if(typeof n=="string")if(xe.test(n))n=parseFloat(n);else return n;const t=hu(n,e.target.x),i=hu(n,e.target.y);return`${t}% ${i}%`}},$n=(n,e,t)=>t>e?e:t<n?n:t,As={test:n=>typeof n=="number",parse:parseFloat,transform:n=>n},Js={...As,transform:n=>$n(0,1,n)},br={...As,default:1},$s=n=>Math.round(n*1e5)/1e5,uc=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function my(n){return n==null}const gy=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,hc=(n,e)=>t=>!!(typeof t=="string"&&gy.test(t)&&t.startsWith(n)||e&&!my(t)&&Object.prototype.hasOwnProperty.call(t,e)),Ef=(n,e,t)=>i=>{if(typeof i!="string")return i;const[s,r,a,o]=i.match(uc);return{[n]:parseFloat(s),[e]:parseFloat(r),[t]:parseFloat(a),alpha:o!==void 0?parseFloat(o):1}},vy=n=>$n(0,255,n),ka={...As,transform:n=>Math.round(vy(n))},zi={test:hc("rgb","red"),parse:Ef("red","green","blue"),transform:({red:n,green:e,blue:t,alpha:i=1})=>"rgba("+ka.transform(n)+", "+ka.transform(e)+", "+ka.transform(t)+", "+$s(Js.transform(i))+")"};function _y(n){let e="",t="",i="",s="";return n.length>5?(e=n.substring(1,3),t=n.substring(3,5),i=n.substring(5,7),s=n.substring(7,9)):(e=n.substring(1,2),t=n.substring(2,3),i=n.substring(3,4),s=n.substring(4,5),e+=e,t+=t,i+=i,s+=s),{red:parseInt(e,16),green:parseInt(t,16),blue:parseInt(i,16),alpha:s?parseInt(s,16)/255:1}}const Go={test:hc("#"),parse:_y,transform:zi.transform},fs={test:hc("hsl","hue"),parse:Ef("hue","saturation","lightness"),transform:({hue:n,saturation:e,lightness:t,alpha:i=1})=>"hsla("+Math.round(n)+", "+zn.transform($s(e))+", "+zn.transform($s(t))+", "+$s(Js.transform(i))+")"},It={test:n=>zi.test(n)||Go.test(n)||fs.test(n),parse:n=>zi.test(n)?zi.parse(n):fs.test(n)?fs.parse(n):Go.parse(n),transform:n=>typeof n=="string"?n:n.hasOwnProperty("red")?zi.transform(n):fs.transform(n),getAnimatableNone:n=>{const e=It.parse(n);return e.alpha=0,It.transform(e)}},xy=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function yy(n){var e,t;return isNaN(n)&&typeof n=="string"&&(((e=n.match(uc))==null?void 0:e.length)||0)+(((t=n.match(xy))==null?void 0:t.length)||0)>0}const Tf="number",Af="color",Sy="var",My="var(",du="${}",by=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function Qs(n){const e=n.toString(),t=[],i={color:[],number:[],var:[]},s=[];let r=0;const o=e.replace(by,l=>(It.test(l)?(i.color.push(r),s.push(Af),t.push(It.parse(l))):l.startsWith(My)?(i.var.push(r),s.push(Sy),t.push(l)):(i.number.push(r),s.push(Tf),t.push(parseFloat(l))),++r,du)).split(du);return{values:t,split:o,indexes:i,types:s}}function wf(n){return Qs(n).values}function Cf(n){const{split:e,types:t}=Qs(n),i=e.length;return s=>{let r="";for(let a=0;a<i;a++)if(r+=e[a],s[a]!==void 0){const o=t[a];o===Tf?r+=$s(s[a]):o===Af?r+=It.transform(s[a]):r+=s[a]}return r}}const Ey=n=>typeof n=="number"?0:It.test(n)?It.getAnimatableNone(n):n;function Ty(n){const e=wf(n);return Cf(n)(e.map(Ey))}const Ti={test:yy,parse:wf,createTransformer:Cf,getAnimatableNone:Ty},bt=(n,e,t)=>n+(e-n)*t,Rf={correct:(n,{treeScale:e,projectionDelta:t})=>{const i=n,s=Ti.parse(n);if(s.length>5)return i;const r=Ti.createTransformer(n),a=typeof s[0]!="number"?1:0,o=t.x.scale*e.x,l=t.y.scale*e.y;s[0+a]/=o,s[1+a]/=l;const c=bt(o,l,.5);return typeof s[2+a]=="number"&&(s[2+a]/=c),typeof s[3+a]=="number"&&(s[3+a]/=c),r(s)}},Pf=n=>e=>typeof e=="string"&&e.startsWith(n),dc=Pf("--"),Ay=Pf("var(--"),fc=n=>Ay(n)?wy.test(n.split("/*")[0].trim()):!1,wy=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function fu(n){return typeof n!="string"?!1:n.split("/*")[0].includes("var(--")}const er={borderRadius:{...On,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:On,borderTopRightRadius:On,borderBottomLeftRadius:On,borderBottomRightRadius:On,boxShadow:Rf};function Lf(n){for(const e in n)er[e]=n[e],dc(e)&&(er[e].isCSSVariable=!0)}function ur(n,e){const t=typeof n=="string"&&!e?`${n}Context`:e,i=Symbol(t);return[a=>{const o=or(i,a);if(o===void 0)throw new Error(`Injection \`${i.toString()}\` not found. Component must be used within ${Array.isArray(n)?`one of the following components: ${n.join(", ")}`:`\`${n}\``}`);return o},a=>(Ta(i,a),a)]}const[Cy,Ry]=ur("Motion"),[Py]=ur("LayoutGroup");function pu(n){return n!==null&&typeof n=="object"&&typeof n.start=="function"}class di{constructor(e){this.state=e}beforeMount(){}mount(){}unmount(){}update(){}beforeUpdate(e){}beforeUnmount(){}}function Xs(n,e,t){if(Array.isArray(n))return n.reduce((i,s)=>{const r=Xs(s,e,t);return r?{...i,...r}:i},{});if(typeof n=="object")return n;if(n&&e){const i=e[n];return typeof i=="function"?i(t):i}}function Ly(n,e){return typeof n!=typeof e?!0:Array.isArray(n)&&Array.isArray(e)?!Dy(n,e):n!==e}function Dy(n,e){const t=e.length;if(t!==n.length)return!1;for(let i=0;i<t;i++)if(e[i]!==n[i])return!1;return!0}function mu(n){return n==null?void 0:n.startsWith("--")}const Iy=n=>n;function Fy(n){return typeof n=="number"}const Uy=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","svg","switch","symbol","text","tspan","use","view","clipPath","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","foreignObject","linearGradient","radialGradient","textPath"],Ny=new Set(Uy);function Df(n){return Ny.has(n)}class Oy{constructor(e){this.features=[];const{features:t=[],lazyMotionContext:i}=e.options,s=t.concat(i.features.value);this.features=s.map(a=>new a(e));const r=this.features;on(i.features,a=>{a.forEach(o=>{if(!s.includes(o)){s.push(o);const l=new o(e);r.push(l),e.isMounted()&&(l.beforeMount(),l.mount())}})},{flush:"pre"})}mount(){this.features.forEach(e=>e.mount())}beforeMount(){this.features.forEach(e=>{var t;return(t=e.beforeMount)==null?void 0:t.call(e)})}unmount(){this.features.forEach(e=>e.unmount())}update(){this.features.forEach(e=>{var t;return(t=e.update)==null?void 0:t.call(e)})}beforeUpdate(e){this.features.forEach(t=>{var i;return(i=t.beforeUpdate)==null?void 0:i.call(t,e)})}beforeUnmount(){this.features.forEach(e=>e.beforeUnmount())}}function By(n){return typeof n=="string"||n===!1||Array.isArray(n)}const la=new WeakMap;let Vy=0;class ky{constructor(e,t){var i;this.element=null,this.isExiting=!1,this.presenceContainer=null,this.children=new Set,this.activeStates={initial:!0,animate:!0},this.currentProcess=null,this._context=null,this.animateUpdates=rn,this.id=`motion-state-${Vy++}`,this.options=e,this.parent=t,(i=t==null?void 0:t.children)==null||i.add(this);const r=(e.initial===void 0&&e.variants?this.context.initial:e.initial)===!1?["initial","animate"]:["initial"];this.initTarget(r),this.featureManager=new Oy(this),this.type=Df(this.options.as)?"svg":"html"}get context(){if(!this._context){const e={get:(t,i)=>{var s;return By(this.options[i])?this.options[i]:(s=this.parent)==null?void 0:s.context[i]}};this._context=new Proxy({},e)}return this._context}initTarget(e){var t;const i=this.options.custom??((t=this.options.animatePresenceContext)==null?void 0:t.custom);this.baseTarget=e.reduce((s,r)=>({...s,...Xs(this.options[r]||this.context[r],this.options.variants,i)}),{}),this.target={}}updateOptions(e){var t;this.options=e,(t=this.visualElement)==null||t.update({...this.options,whileTap:this.options.whilePress},null)}beforeMount(){this.featureManager.beforeMount()}mount(e,t,i=!1){var s;this.element=e,this.updateOptions(t),this.featureManager.mount(),!i&&this.options.animate&&((s=this.startAnimation)==null||s.call(this))}clearAnimation(){var e,t;this.currentProcess&&oi(this.currentProcess),this.currentProcess=null,(t=(e=this.visualElement)==null?void 0:e.variantChildren)==null||t.forEach(i=>{i.state.clearAnimation()})}startAnimation(){this.clearAnimation(),this.currentProcess=_t.render(()=>{this.currentProcess=null,this.animateUpdates()})}beforeUnmount(){this.featureManager.beforeUnmount()}unmount(){var e,t,i;(t=(e=this.parent)==null?void 0:e.children)==null||t.delete(this),la.delete(this.element),this.featureManager.unmount(),(i=this.visualElement)==null||i.unmount(),this.clearAnimation()}beforeUpdate(e){this.featureManager.beforeUpdate(e)}update(e){this.updateOptions(e),this.featureManager.update(),this.startAnimation()}setActive(e,t,i=!0){var s;!this.element||this.activeStates[e]===t||(this.activeStates[e]=t,(s=this.visualElement.variantChildren)==null||s.forEach(r=>{r.state.setActive(e,t,!1)}),i&&this.animateUpdates({isExit:e==="exit"&&this.activeStates.exit}))}isMounted(){return!!this.element}getSnapshot(e,t){}didUpdate(e){}}const Yi=new WeakMap;function gu(n,e,t){return new CustomEvent(n,{detail:{target:e,isExit:t}})}const vu={syntax:"<angle>",initialValue:"0deg",toDefaultUnit:n=>`${n}deg`},zy={translate:{syntax:"<length-percentage>",initialValue:"0px",toDefaultUnit:n=>`${n}px`},rotate:vu,scale:{syntax:"<number>",initialValue:1,toDefaultUnit:Iy},skew:vu},Gy=["translate","scale","rotate","skew"],Hy=["","X","Y","Z"],pc=new Map,ca=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"];Gy.forEach(n=>{Hy.forEach(e=>{ca.push(n+e),pc.set(n+e,zy[n])})});const Wy=new Set(ca),$y=n=>Wy.has(n),_u={x:"translateX",y:"translateY",z:"translateZ"};function Xy([n],[e]){return ca.indexOf(n)-ca.indexOf(e)}function qy(n,[e,t]){return`${n} ${e}(${t})`}function Yy(n){return n.sort(Xy).reduce(qy,"").trim()}const xu={translate:[0,0],rotate:0,scale:1,skew:0,x:0,y:0,z:0},Ft=n=>!!(n&&n.getVelocity),jy={get:(n,e)=>{let t=mu(e)?n.style.getPropertyValue(e):getComputedStyle(n)[e];if(!t&&t!=="0"){const i=pc.get(e);i&&(t=i.initialValue)}return t},set:(n,e,t)=>{mu(e)?n.style.setProperty(e,t):n.style[e]=t}};function Ky(n){var e;const t={},i=[];for(let s in n){let r=n[s];r=Ft(r)?r.get():r,$y(s)&&s in _u&&(s=_u[s]);let a=Array.isArray(r)?r[0]:r;const o=pc.get(s);o?(a=Fy(r)?(e=o.toDefaultUnit)==null?void 0:e.call(o,r):r,i.push([s,a])):t[s]=a}return i.length&&(t.transform=Yy(i)),Object.keys(t).length===0?null:t}const Zy={fill:!0,stroke:!0,opacity:!0,"stroke-width":!0,"fill-opacity":!0,"stroke-opacity":!0,"stroke-linecap":!0,"stroke-linejoin":!0,"stroke-dasharray":!0,"stroke-dashoffset":!0,cx:!0,cy:!0,r:!0,d:!0,x1:!0,y1:!0,x2:!0,y2:!0,points:!0,"path-length":!0,viewBox:!0,width:!0,height:!0,"preserve-aspect-ratio":!0,"clip-path":!0,filter:!0,mask:!0,"stop-color":!0,"stop-opacity":!0,"gradient-transform":!0,"gradient-units":!0,"spread-method":!0,"marker-end":!0,"marker-mid":!0,"marker-start":!0,"text-anchor":!0,"dominant-baseline":!0,"font-family":!0,"font-size":!0,"font-weight":!0,"letter-spacing":!0,"vector-effect":!0};function Jy(n){return n.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}function Qy(n,e,t=1,i=0){n.pathLength=1,delete n["path-length"],n["stroke-dashoffset"]=xe.transform(-i);const s=xe.transform(e),r=xe.transform(t);n["stroke-dasharray"]=`${s} ${r}`}function eS(n){const e={},t={};for(const i in n){const s=Jy(i);if(s in Zy){const r=n[i];e[s]=Ft(r)?r.get():r}else t[i]=n[i]}return e["path-length"]!==void 0&&Qy(e,e["path-length"],e["path-spacing"],e["path-offset"]),{attrs:e,style:t}}function tS({top:n,left:e,right:t,bottom:i}){return{x:{min:e,max:t},y:{min:n,max:i}}}function nS(n,e){if(!e)return n;const t=e({x:n.left,y:n.top}),i=e({x:n.right,y:n.bottom});return{top:t.y,left:t.x,bottom:i.y,right:i.x}}function iS(n,e){return tS(nS(n.getBoundingClientRect(),e))}const yu={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]},Ho={};for(const n in yu)Ho[n]={isEnabled:e=>yu[n].some(t=>!!e[t])};const Su=()=>({translate:0,scale:1,origin:0,originPoint:0}),ps=()=>({x:Su(),y:Su()}),Mu=()=>({min:0,max:0}),Nt=()=>({x:Mu(),y:Mu()}),sS=typeof window<"u",ua={current:null},If={current:!1};function rS(){if(If.current=!0,!!sS)if(window.matchMedia){const n=window.matchMedia("(prefers-reduced-motion)"),e=()=>ua.current=n.matches;n.addEventListener("change",e),e()}else ua.current=!1}function aS(n){return n!==null&&typeof n=="object"&&typeof n.start=="function"}function oS(n){return typeof n=="string"||Array.isArray(n)}const lS=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],cS=["initial",...lS];function Ff(n){return aS(n.animate)||cS.some(e=>oS(n[e]))}function uS(n){return!!(Ff(n)||n.variants)}function bu(n,e){return e?`${n}. For more information and steps for solving, visit https://motion.dev/troubleshooting/${e}`:n}function mc(n,e){n.indexOf(e)===-1&&n.push(e)}function Ca(n,e){const t=n.indexOf(e);t>-1&&n.splice(t,1)}class gc{constructor(){this.subscriptions=[]}add(e){return mc(this.subscriptions,e),()=>Ca(this.subscriptions,e)}notify(e,t,i){const s=this.subscriptions.length;if(s)if(s===1)this.subscriptions[0](e,t,i);else for(let r=0;r<s;r++){const a=this.subscriptions[r];a&&a(e,t,i)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}function Uf(n,e){return e?n*(1e3/e):0}const Eu=30,hS=n=>!isNaN(parseFloat(n));class dS{constructor(e,t={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=i=>{var s;const r=Kt.now();if(this.updatedAt!==r&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(i),this.current!==this.prev&&((s=this.events.change)==null||s.notify(this.current),this.dependents))for(const a of this.dependents)a.dirty()},this.hasAnimated=!1,this.setCurrent(e),this.owner=t.owner}setCurrent(e){this.current=e,this.updatedAt=Kt.now(),this.canTrackVelocity===null&&e!==void 0&&(this.canTrackVelocity=hS(this.current))}setPrevFrameValue(e=this.current){this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt}onChange(e){return this.on("change",e)}on(e,t){this.events[e]||(this.events[e]=new gc);const i=this.events[e].add(t);return e==="change"?()=>{i(),_t.read(()=>{this.events.change.getSize()||this.stop()})}:i}clearListeners(){for(const e in this.events)this.events[e].clear()}attach(e,t){this.passiveEffect=e,this.stopPassiveEffect=t}set(e){this.passiveEffect?this.passiveEffect(e,this.updateAndNotify):this.updateAndNotify(e)}setWithVelocity(e,t,i){this.set(t),this.prev=void 0,this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt-i}jump(e,t=!0){this.updateAndNotify(e),this.prev=e,this.prevUpdatedAt=this.prevFrameValue=void 0,t&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){var e;(e=this.events.change)==null||e.notify(this.current)}addDependent(e){this.dependents||(this.dependents=new Set),this.dependents.add(e)}removeDependent(e){this.dependents&&this.dependents.delete(e)}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const e=Kt.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||e-this.updatedAt>Eu)return 0;const t=Math.min(this.updatedAt-this.prevUpdatedAt,Eu);return Uf(parseFloat(this.current)-parseFloat(this.prevFrameValue),t)}start(e){return this.stop(),new Promise(t=>{this.hasAnimated=!0,this.animation=e(t),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){var e,t;(e=this.dependents)==null||e.clear(),(t=this.events.destroy)==null||t.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function _s(n,e){return new dS(n,e)}function fS(n,e,t){for(const i in e){const s=e[i],r=t[i];if(Ft(s))n.addValue(i,s);else if(Ft(r))n.addValue(i,_s(s,{owner:n}));else if(r!==s)if(n.hasValue(i)){const a=n.getValue(i);a.liveStyle===!0?a.jump(s):a.hasAnimated||a.set(s)}else{const a=n.getStaticValue(i);n.addValue(i,_s(a!==void 0?a:s,{owner:n}))}}for(const i in t)e[i]===void 0&&n.removeValue(i);return e}function Tu(n){const e=[{},{}];return n==null||n.values.forEach((t,i)=>{e[0][i]=t.get(),e[1][i]=t.getVelocity()}),e}function Nf(n,e,t,i){if(typeof e=="function"){const[s,r]=Tu(i);e=e(t!==void 0?t:n.custom,s,r)}if(typeof e=="string"&&(e=n.variants&&n.variants[e]),typeof e=="function"){const[s,r]=Tu(i);e=e(t!==void 0?t:n.custom,s,r)}return e}function pS(n){for(let e=1;e<n.length;e++)n[e]??(n[e]=n[e-1])}const Gi=n=>n*180/Math.PI,Wo=n=>{const e=Gi(Math.atan2(n[1],n[0]));return $o(e)},mS={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:n=>(Math.abs(n[0])+Math.abs(n[3]))/2,rotate:Wo,rotateZ:Wo,skewX:n=>Gi(Math.atan(n[1])),skewY:n=>Gi(Math.atan(n[2])),skew:n=>(Math.abs(n[1])+Math.abs(n[2]))/2},$o=n=>(n=n%360,n<0&&(n+=360),n),Au=Wo,wu=n=>Math.sqrt(n[0]*n[0]+n[1]*n[1]),Cu=n=>Math.sqrt(n[4]*n[4]+n[5]*n[5]),gS={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:wu,scaleY:Cu,scale:n=>(wu(n)+Cu(n))/2,rotateX:n=>$o(Gi(Math.atan2(n[6],n[5]))),rotateY:n=>$o(Gi(Math.atan2(-n[2],n[0]))),rotateZ:Au,rotate:Au,skewX:n=>Gi(Math.atan(n[4])),skewY:n=>Gi(Math.atan(n[1])),skew:n=>(Math.abs(n[1])+Math.abs(n[4]))/2};function Xo(n){return n.includes("scale")?1:0}function qo(n,e){if(!n||n==="none")return Xo(e);const t=n.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let i,s;if(t)i=gS,s=t;else{const o=n.match(/^matrix\(([-\d.e\s,]+)\)$/u);i=mS,s=o}if(!s)return Xo(e);const r=i[e],a=s[1].split(",").map(_S);return typeof r=="function"?r(a):a[r]}const vS=(n,e)=>{const{transform:t="none"}=getComputedStyle(n);return qo(t,e)};function _S(n){return parseFloat(n.trim())}const ws=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],Cs=new Set(ws),Ru=n=>n===As||n===xe,xS=new Set(["x","y","z"]),yS=ws.filter(n=>!xS.has(n));function SS(n){const e=[];return yS.forEach(t=>{const i=n.getValue(t);i!==void 0&&(e.push([t,i.get()]),i.set(t.startsWith("scale")?1:0))}),e}const bi={width:({x:n},{paddingLeft:e="0",paddingRight:t="0"})=>n.max-n.min-parseFloat(e)-parseFloat(t),height:({y:n},{paddingTop:e="0",paddingBottom:t="0"})=>n.max-n.min-parseFloat(e)-parseFloat(t),top:(n,{top:e})=>parseFloat(e),left:(n,{left:e})=>parseFloat(e),bottom:({y:n},{top:e})=>parseFloat(e)+(n.max-n.min),right:({x:n},{left:e})=>parseFloat(e)+(n.max-n.min),x:(n,{transform:e})=>qo(e,"x"),y:(n,{transform:e})=>qo(e,"y")};bi.translateX=bi.x;bi.translateY=bi.y;const Xi=new Set;let Yo=!1,jo=!1,Ko=!1;function Of(){if(jo){const n=Array.from(Xi).filter(i=>i.needsMeasurement),e=new Set(n.map(i=>i.element)),t=new Map;e.forEach(i=>{const s=SS(i);s.length&&(t.set(i,s),i.render())}),n.forEach(i=>i.measureInitialState()),e.forEach(i=>{i.render();const s=t.get(i);s&&s.forEach(([r,a])=>{var o;(o=i.getValue(r))==null||o.set(a)})}),n.forEach(i=>i.measureEndState()),n.forEach(i=>{i.suspendedScrollY!==void 0&&window.scrollTo(0,i.suspendedScrollY)})}jo=!1,Yo=!1,Xi.forEach(n=>n.complete(Ko)),Xi.clear()}function Bf(){Xi.forEach(n=>{n.readKeyframes(),n.needsMeasurement&&(jo=!0)})}function MS(){Ko=!0,Bf(),Of(),Ko=!1}class vc{constructor(e,t,i,s,r,a=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...e],this.onComplete=t,this.name=i,this.motionValue=s,this.element=r,this.isAsync=a}scheduleResolve(){this.state="scheduled",this.isAsync?(Xi.add(this),Yo||(Yo=!0,_t.read(Bf),_t.resolveKeyframes(Of))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:e,name:t,element:i,motionValue:s}=this;if(e[0]===null){const r=s==null?void 0:s.get(),a=e[e.length-1];if(r!==void 0)e[0]=r;else if(i&&t){const o=i.readValue(t,a);o!=null&&(e[0]=o)}e[0]===void 0&&(e[0]=a),s&&r===void 0&&s.set(e[0])}pS(e)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(e=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,e),Xi.delete(this)}cancel(){this.state==="scheduled"&&(Xi.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const Vf=n=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(n),kf=n=>/^0[^.\s]+$/u.test(n),bS={test:n=>n==="auto",parse:n=>n},zf=n=>e=>e.test(n),Gf=[As,xe,zn,Si,py,fy,bS],Pu=n=>Gf.find(zf(n)),ES=[...Gf,It,Ti],TS=n=>ES.find(zf(n)),AS=new Set(["brightness","contrast","saturate","opacity"]);function wS(n){const[e,t]=n.slice(0,-1).split("(");if(e==="drop-shadow")return n;const[i]=t.match(uc)||[];if(!i)return n;const s=t.replace(i,"");let r=AS.has(e)?1:0;return i!==t&&(r*=100),e+"("+r+s+")"}const CS=/\b([a-z-]*)\(.*?\)/gu,Zo={...Ti,getAnimatableNone:n=>{const e=n.match(CS);return e?e.map(wS).join(" "):n}},Lu={...As,transform:Math.round},RS={rotate:Si,rotateX:Si,rotateY:Si,rotateZ:Si,scale:br,scaleX:br,scaleY:br,scaleZ:br,skew:Si,skewX:Si,skewY:Si,distance:xe,translateX:xe,translateY:xe,translateZ:xe,x:xe,y:xe,z:xe,perspective:xe,transformPerspective:xe,opacity:Js,originX:uu,originY:uu,originZ:xe},_c={borderWidth:xe,borderTopWidth:xe,borderRightWidth:xe,borderBottomWidth:xe,borderLeftWidth:xe,borderRadius:xe,radius:xe,borderTopLeftRadius:xe,borderTopRightRadius:xe,borderBottomRightRadius:xe,borderBottomLeftRadius:xe,width:xe,maxWidth:xe,height:xe,maxHeight:xe,top:xe,right:xe,bottom:xe,left:xe,inset:xe,insetBlock:xe,insetBlockStart:xe,insetBlockEnd:xe,insetInline:xe,insetInlineStart:xe,insetInlineEnd:xe,padding:xe,paddingTop:xe,paddingRight:xe,paddingBottom:xe,paddingLeft:xe,paddingBlock:xe,paddingBlockStart:xe,paddingBlockEnd:xe,paddingInline:xe,paddingInlineStart:xe,paddingInlineEnd:xe,margin:xe,marginTop:xe,marginRight:xe,marginBottom:xe,marginLeft:xe,marginBlock:xe,marginBlockStart:xe,marginBlockEnd:xe,marginInline:xe,marginInlineStart:xe,marginInlineEnd:xe,backgroundPositionX:xe,backgroundPositionY:xe,...RS,zIndex:Lu,fillOpacity:Js,strokeOpacity:Js,numOctaves:Lu},PS={..._c,color:It,backgroundColor:It,outlineColor:It,fill:It,stroke:It,borderColor:It,borderTopColor:It,borderRightColor:It,borderBottomColor:It,borderLeftColor:It,filter:Zo,WebkitFilter:Zo},Hf=n=>PS[n];function Wf(n,e){let t=Hf(n);return t!==Zo&&(t=Ti),t.getAnimatableNone?t.getAnimatableNone(e):void 0}const{schedule:$f}=bf(queueMicrotask,!0),Du=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];class Xf{scrapeMotionValuesFromProps(e,t,i){return{}}constructor({parent:e,props:t,presenceContext:i,reducedMotionConfig:s,blockInitialAnimation:r,visualState:a},o={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.values=new Map,this.KeyframeResolver=vc,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const d=Kt.now();this.renderScheduledAt<d&&(this.renderScheduledAt=d,_t.render(this.render,!1,!0))};const{latestValues:l,renderState:c}=a;this.latestValues=l,this.baseTarget={...l},this.initialValues=t.initial?{...l}:{},this.renderState=c,this.parent=e,this.props=t,this.presenceContext=i,this.depth=e?e.depth+1:0,this.reducedMotionConfig=s,this.options=o,this.blockInitialAnimation=!!r,this.isControllingVariants=Ff(t),this.isVariantNode=uS(t),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(e&&e.current);const{willChange:u,...h}=this.scrapeMotionValuesFromProps(t,{},this);for(const d in h){const f=h[d];l[d]!==void 0&&Ft(f)&&f.set(l[d])}}mount(e){var t;this.current=e,Yi.set(e,this),this.projection&&!this.projection.instance&&this.projection.mount(e),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((i,s)=>this.bindToMotionValue(s,i)),this.reducedMotionConfig==="never"?this.shouldReduceMotion=!1:this.reducedMotionConfig==="always"?this.shouldReduceMotion=!0:(If.current||rS(),this.shouldReduceMotion=ua.current),(t=this.parent)==null||t.addChild(this),this.update(this.props,this.presenceContext)}unmount(){var e;this.projection&&this.projection.unmount(),oi(this.notifyUpdate),oi(this.render),this.valueSubscriptions.forEach(t=>t()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),(e=this.parent)==null||e.removeChild(this);for(const t in this.events)this.events[t].clear();for(const t in this.features){const i=this.features[t];i&&(i.unmount(),i.isMounted=!1)}this.current=null}addChild(e){this.children.add(e),this.enteringChildren??(this.enteringChildren=new Set),this.enteringChildren.add(e)}removeChild(e){this.children.delete(e),this.enteringChildren&&this.enteringChildren.delete(e)}bindToMotionValue(e,t){this.valueSubscriptions.has(e)&&this.valueSubscriptions.get(e)();const i=Cs.has(e);i&&this.onBindTransform&&this.onBindTransform();const s=t.on("change",a=>{this.latestValues[e]=a,this.props.onUpdate&&_t.preRender(this.notifyUpdate),i&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()});let r;window.MotionCheckAppearSync&&(r=window.MotionCheckAppearSync(this,e,t)),this.valueSubscriptions.set(e,()=>{s(),r&&r(),t.owner&&t.stop()})}sortNodePosition(e){return!this.current||!this.sortInstanceNodePosition||this.type!==e.type?0:this.sortInstanceNodePosition(this.current,e.current)}updateFeatures(){let e="animation";for(e in Ho){const t=Ho[e];if(!t)continue;const{isEnabled:i,Feature:s}=t;if(!this.features[e]&&s&&i(this.props)&&(this.features[e]=new s(this)),this.features[e]){const r=this.features[e];r.isMounted?r.update():(r.mount(),r.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):Nt()}getStaticValue(e){return this.latestValues[e]}setStaticValue(e,t){this.latestValues[e]=t}update(e,t){(e.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=e,this.prevPresenceContext=this.presenceContext,this.presenceContext=t;for(let i=0;i<Du.length;i++){const s=Du[i];this.propEventSubscriptions[s]&&(this.propEventSubscriptions[s](),delete this.propEventSubscriptions[s]);const r="on"+s,a=e[r];a&&(this.propEventSubscriptions[s]=this.on(s,a))}this.prevMotionValues=fS(this,this.scrapeMotionValuesFromProps(e,this.prevProps,this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(e){return this.props.variants?this.props.variants[e]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(e){const t=this.getClosestVariantNode();if(t)return t.variantChildren&&t.variantChildren.add(e),()=>t.variantChildren.delete(e)}addValue(e,t){const i=this.values.get(e);t!==i&&(i&&this.removeValue(e),this.bindToMotionValue(e,t),this.values.set(e,t),this.latestValues[e]=t.get())}removeValue(e){this.values.delete(e);const t=this.valueSubscriptions.get(e);t&&(t(),this.valueSubscriptions.delete(e)),delete this.latestValues[e],this.removeValueFromRenderState(e,this.renderState)}hasValue(e){return this.values.has(e)}getValue(e,t){if(this.props.values&&this.props.values[e])return this.props.values[e];let i=this.values.get(e);return i===void 0&&t!==void 0&&(i=_s(t===null?void 0:t,{owner:this}),this.addValue(e,i)),i}readValue(e,t){let i=this.latestValues[e]!==void 0||!this.current?this.latestValues[e]:this.getBaseTargetFromProps(this.props,e)??this.readValueFromInstance(this.current,e,this.options);return i!=null&&(typeof i=="string"&&(Vf(i)||kf(i))?i=parseFloat(i):!TS(i)&&Ti.test(t)&&(i=Wf(e,t)),this.setBaseTarget(e,Ft(i)?i.get():i)),Ft(i)?i.get():i}setBaseTarget(e,t){this.baseTarget[e]=t}getBaseTarget(e){var t;const{initial:i}=this.props;let s;if(typeof i=="string"||typeof i=="object"){const a=Nf(this.props,i,(t=this.presenceContext)==null?void 0:t.custom);a&&(s=a[e])}if(i&&s!==void 0)return s;const r=this.getBaseTargetFromProps(this.props,e);return r!==void 0&&!Ft(r)?r:this.initialValues[e]!==void 0&&s===void 0?void 0:this.baseTarget[e]}on(e,t){return this.events[e]||(this.events[e]=new gc),this.events[e].add(t)}notify(e,...t){this.events[e]&&this.events[e].notify(...t)}scheduleRenderMicrotask(){$f.render(this.render)}}const qf=new Set(["width","height","top","left","right","bottom",...ws]);var LS={},Iu;let hr=()=>{},li=()=>{};typeof process<"u"&&((Iu=LS)==null?void 0:Iu.NODE_ENV)!=="production"&&(hr=(n,e,t)=>{!n&&typeof console<"u"&&console.warn(bu(e,t))},li=(n,e,t)=>{if(!n)throw new Error(bu(e,t))});const DS=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function IS(n){const e=DS.exec(n);if(!e)return[,];const[,t,i,s]=e;return[`--${t??i}`,s]}const FS=4;function Yf(n,e,t=1){li(t<=FS,`Max CSS variable fallback depth detected in property "${n}". This may indicate a circular fallback dependency.`,"max-css-var-depth");const[i,s]=IS(n);if(!i)return;const r=window.getComputedStyle(e).getPropertyValue(i);if(r){const a=r.trim();return Vf(a)?parseFloat(a):a}return fc(s)?Yf(s,e,t+1):s}function US(n){return typeof n=="number"?n===0:n!==null?n==="none"||n==="0"||kf(n):!0}const NS=new Set(["auto","none","0"]);function OS(n,e,t){let i=0,s;for(;i<n.length&&!s;){const r=n[i];typeof r=="string"&&!NS.has(r)&&Qs(r).values.length&&(s=n[i]),i++}if(s&&t)for(const r of e)n[r]=Wf(t,s)}class BS extends vc{constructor(e,t,i,s,r){super(e,t,i,s,r,!0)}readKeyframes(){const{unresolvedKeyframes:e,element:t,name:i}=this;if(!t||!t.current)return;super.readKeyframes();for(let u=0;u<e.length;u++){let h=e[u];if(typeof h=="string"&&(h=h.trim(),fc(h))){const d=Yf(h,t.current);d!==void 0&&(e[u]=d),u===e.length-1&&(this.finalKeyframe=h)}}if(this.resolveNoneKeyframes(),!qf.has(i)||e.length!==2)return;const[s,r]=e,a=Pu(s),o=Pu(r),l=fu(s),c=fu(r);if(l!==c&&bi[i]){this.needsMeasurement=!0;return}if(a!==o)if(Ru(a)&&Ru(o))for(let u=0;u<e.length;u++){const h=e[u];typeof h=="string"&&(e[u]=parseFloat(h))}else bi[i]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:e,name:t}=this,i=[];for(let s=0;s<e.length;s++)(e[s]===null||US(e[s]))&&i.push(s);i.length&&OS(e,i,t)}measureInitialState(){const{element:e,unresolvedKeyframes:t,name:i}=this;if(!e||!e.current)return;i==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=bi[i](e.measureViewportBox(),window.getComputedStyle(e.current)),t[0]=this.measuredOrigin;const s=t[t.length-1];s!==void 0&&e.getValue(i,s).jump(s,!1)}measureEndState(){var e;const{element:t,name:i,unresolvedKeyframes:s}=this;if(!t||!t.current)return;const r=t.getValue(i);r&&r.jump(this.measuredOrigin,!1);const a=s.length-1,o=s[a];s[a]=bi[i](t.measureViewportBox(),window.getComputedStyle(t.current)),o!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=o),(e=this.removedTransforms)!=null&&e.length&&this.removedTransforms.forEach(([l,c])=>{t.getValue(l).set(c)}),this.resolveNoneKeyframes()}}class jf extends Xf{constructor(){super(...arguments),this.KeyframeResolver=BS}sortInstanceNodePosition(e,t){return e.compareDocumentPosition(t)&2?1:-1}getBaseTargetFromProps(e,t){return e.style?e.style[t]:void 0}removeValueFromRenderState(e,{vars:t,style:i}){delete t[e],delete i[e]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:e}=this.props;Ft(e)&&(this.childSubscription=e.on("change",t=>{this.current&&(this.current.textContent=`${t}`)}))}}const Kf=(n,e)=>e&&typeof n=="number"?e.transform(n):n,VS={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},kS=ws.length;function zS(n,e,t){let i="",s=!0;for(let r=0;r<kS;r++){const a=ws[r],o=n[a];if(o===void 0)continue;let l=!0;if(typeof o=="number"?l=o===(a.startsWith("scale")?1:0):l=parseFloat(o)===0,!l||t){const c=Kf(o,_c[a]);if(!l){s=!1;const u=VS[a]||a;i+=`${u}(${c}) `}t&&(e[a]=c)}}return i=i.trim(),t?i=t(e,s?"":i):s&&(i="none"),i}function Zf(n,e,t){const{style:i,vars:s,transformOrigin:r}=n;let a=!1,o=!1;for(const l in e){const c=e[l];if(Cs.has(l)){a=!0;continue}else if(dc(l)){s[l]=c;continue}else{const u=Kf(c,_c[l]);l.startsWith("origin")?(o=!0,r[l]=u):i[l]=u}}if(e.transform||(a||t?i.transform=zS(e,n.transform,t):i.transform&&(i.transform="none")),o){const{originX:l="50%",originY:c="50%",originZ:u=0}=r;i.transformOrigin=`${l} ${c} ${u}`}}function Jf(n,{style:e,vars:t},i,s){const r=n.style;let a;for(a in e)r[a]=e[a];s==null||s.applyProjectionStyles(r,i);for(a in t)r.setProperty(a,t[a])}function GS(n,{layout:e,layoutId:t}){return Cs.has(n)||n.startsWith("origin")||(e||t!==void 0)&&(!!er[n]||n==="opacity")}function Qf(n,e,t){var i;const{style:s}=n,r={};for(const a in s)(Ft(s[a])||e.style&&Ft(e.style[a])||GS(a,n)||((i=t==null?void 0:t.getValue(a))==null?void 0:i.liveStyle)!==void 0)&&(r[a]=s[a]);return r}function HS(n){return window.getComputedStyle(n)}class ep extends jf{constructor(){super(...arguments),this.type="html",this.renderInstance=Jf}readValueFromInstance(e,t){var i;if(Cs.has(t))return(i=this.projection)!=null&&i.isProjecting?Xo(t):vS(e,t);{const s=HS(e),r=(dc(t)?s.getPropertyValue(t):s[t])||0;return typeof r=="string"?r.trim():r}}measureInstanceViewportBox(e,{transformPagePoint:t}){return iS(e,t)}build(e,t,i){Zf(e,t,i.transformTemplate)}scrapeMotionValuesFromProps(e,t,i){return Qf(e,t,i)}}const xc=n=>n.replace(/([a-z])([A-Z])/gu,"$1-$2").toLowerCase(),WS={offset:"stroke-dashoffset",array:"stroke-dasharray"},$S={offset:"strokeDashoffset",array:"strokeDasharray"};function XS(n,e,t=1,i=0,s=!0){n.pathLength=1;const r=s?WS:$S;n[r.offset]=xe.transform(-i);const a=xe.transform(e),o=xe.transform(t);n[r.array]=`${a} ${o}`}const qS=["offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function YS(n,{attrX:e,attrY:t,attrScale:i,pathLength:s,pathSpacing:r=1,pathOffset:a=0,...o},l,c,u){if(Zf(n,o,c),l){n.style.viewBox&&(n.attrs.viewBox=n.style.viewBox);return}n.attrs=n.style,n.style={};const{attrs:h,style:d}=n;h.transform&&(d.transform=h.transform,delete h.transform),(d.transform||h.transformOrigin)&&(d.transformOrigin=h.transformOrigin??"50% 50%",delete h.transformOrigin),d.transform&&(d.transformBox=(u==null?void 0:u.transformBox)??"fill-box",delete h.transformBox);for(const f of qS)h[f]!==void 0&&(d[f]=h[f],delete h[f]);e!==void 0&&(h.x=e),t!==void 0&&(h.y=t),i!==void 0&&(h.scale=i),s!==void 0&&XS(h,s,r,a,!1)}const tp=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]),jS=n=>typeof n=="string"&&n.toLowerCase()==="svg";function KS(n,e,t,i){Jf(n,e,void 0,i);for(const s in e.attrs)n.setAttribute(tp.has(s)?s:xc(s),e.attrs[s])}function ZS(n,e,t){const i=Qf(n,e,t);for(const s in n)if(Ft(n[s])||Ft(e[s])){const r=ws.indexOf(s)!==-1?"attr"+s.charAt(0).toUpperCase()+s.substring(1):s;i[r]=n[s]}return i}class np extends jf{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=Nt}getBaseTargetFromProps(e,t){return e[t]}readValueFromInstance(e,t){if(Cs.has(t)){const i=Hf(t);return i&&i.default||0}return t=tp.has(t)?t:xc(t),e.getAttribute(t)}scrapeMotionValuesFromProps(e,t,i){return ZS(e,t,i)}build(e,t,i){YS(e,t,this.isSVGTag,i.transformTemplate,i.style)}renderInstance(e,t,i,s){KS(e,t,i,s)}mount(e){this.isSVGTag=jS(e.tagName),super.mount(e)}}function JS(n,e){return Df(n)?new np(e):new ep(e)}function QS(n,e,t,i=0,s=1){const r=Array.from(n),a=r.indexOf(e),o=n.size,l=(o-1)*i,c=typeof t=="function";return a===r.length-1&&(e.parent.enteringChildren=void 0),c?t(a,o):s===1?a*i:l-a*i}function yc(n){return typeof n=="object"&&!Array.isArray(n)}function Sc(n,e,t){if(n instanceof EventTarget)return[n];if(typeof n=="string"){let i=document;const s=(t==null?void 0:t[n])??i.querySelectorAll(n);return s?Array.from(s):[]}return Array.from(n)}function ip(n,e,t,i){return typeof n=="string"&&yc(e)?Sc(n,t,i):n instanceof NodeList?Array.from(n):Array.isArray(n)?n:[n]}function eM(n,e,t){return n*(e+1)}function Fu(n,e,t,i){return typeof e=="number"?e:e.startsWith("-")||e.startsWith("+")?Math.max(0,n+parseFloat(e)):e==="<"?t:e.startsWith("<")?Math.max(0,t+parseFloat(e.slice(1))):i.get(e)??n}const tM=(n,e,t)=>{const i=e-n;return((t-n)%i+i)%i+n},sp=n=>Array.isArray(n)&&typeof n[0]!="number";function rp(n,e){return sp(n)?n[tM(0,n.length,e)]:n}function nM(n,e,t){for(let i=0;i<n.length;i++){const s=n[i];s.at>e&&s.at<t&&(Ca(n,s),i--)}}function iM(n,e,t,i,s,r){nM(n,s,r);for(let a=0;a<e.length;a++)n.push({value:e[a],at:bt(s,r,i[a]),easing:rp(t,a)})}function sM(n,e){for(let t=0;t<n.length;t++)n[t]=n[t]/(e+1)}function rM(n,e){return n.at===e.at?n.value===null?1:e.value===null?-1:0:n.at-e.at}const xs=(n,e,t)=>{const i=e-n;return i===0?1:(t-n)/i};function ap(n,e){const t=n[n.length-1];for(let i=1;i<=e;i++){const s=xs(0,e,i);n.push(bt(t,1,s))}}function op(n){const e=[0];return ap(e,n.length-1),e}const ha=2e4;function Mc(n){let e=0;const t=50;let i=n.next(e);for(;!i.done&&e<ha;)e+=t,i=n.next(e);return e>=ha?1/0:e}function lp(n,e=100,t){const i=t({...n,keyframes:[0,e]}),s=Math.min(Mc(i),ha);return{type:"keyframes",ease:r=>i.next(s*r).value/e,duration:_n(s)}}function bc(n){return typeof n=="function"&&"applyToOptions"in n}const aM="easeInOut",oM=20;function lM(n,{defaultTransition:e={},...t}={},i,s){const r=e.duration||.3,a=new Map,o=new Map,l={},c=new Map;let u=0,h=0,d=0;for(let f=0;f<n.length;f++){const g=n[f];if(typeof g=="string"){c.set(g,h);continue}else if(!Array.isArray(g)){c.set(g.name,Fu(h,g.at,u,c));continue}let[v,m,p={}]=g;p.at!==void 0&&(h=Fu(h,p.at,u,c));let M=0;const y=(S,E,T,w=0,R=0)=>{const _=cM(S),{delay:b=0,times:P=op(_),type:k="keyframes",repeat:B,repeatType:N,repeatDelay:j=0,...q}=E;let{ease:X=e.ease||"easeOut",duration:Q}=E;const ce=typeof b=="function"?b(w,R):b,oe=_.length,_e=bc(k)?k:s==null?void 0:s[k||"keyframes"];if(oe<=2&&_e){let ot=100;if(oe===2&&dM(_)){const Me=_[1]-_[0];ot=Math.abs(Me)}const J={...q};Q!==void 0&&(J.duration=Cn(Q));const ie=lp(J,ot,_e);X=ie.ease,Q=ie.duration}Q??(Q=r);const $e=h+ce;P.length===1&&P[0]===0&&(P[1]=1);const We=P.length-_.length;if(We>0&&ap(P,We),_.length===1&&_.unshift(null),B){li(B<oM,"Repeat count too high, must be less than 20","repeat-count-high"),Q=eM(Q,B);const ot=[..._],J=[...P];X=Array.isArray(X)?[...X]:[X];const ie=[...X];for(let Me=0;Me<B;Me++){_.push(...ot);for(let ke=0;ke<ot.length;ke++)P.push(J[ke]+(Me+1)),X.push(ke===0?"linear":rp(ie,ke-1))}sM(P,B)}const xt=$e+Q;iM(T,_,X,P,$e,xt),M=Math.max(ce+Q,M),d=Math.max(xt,d)};if(Ft(v)){const S=Uu(v,o);y(m,p,Nu("default",S))}else{const S=ip(v,m,i,l),E=S.length;for(let T=0;T<E;T++){m=m,p=p;const w=S[T],R=Uu(w,o);for(const _ in m)y(m[_],uM(p,_),Nu(_,R),T,E)}}u=h,h+=M}return o.forEach((f,g)=>{for(const v in f){const m=f[v];m.sort(rM);const p=[],M=[],y=[];for(let E=0;E<m.length;E++){const{at:T,value:w,easing:R}=m[E];p.push(w),M.push(xs(0,d,T)),y.push(R||"easeOut")}M[0]!==0&&(M.unshift(0),p.unshift(p[0]),y.unshift(aM)),M[M.length-1]!==1&&(M.push(1),p.push(null)),a.has(g)||a.set(g,{keyframes:{},transition:{}});const S=a.get(g);S.keyframes[v]=p,S.transition[v]={...e,duration:d,ease:y,times:M,...t}}}),a}function Uu(n,e){return!e.has(n)&&e.set(n,{}),e.get(n)}function Nu(n,e){return e[n]||(e[n]=[]),e[n]}function cM(n){return Array.isArray(n)?n:[n]}function uM(n,e){return n&&n[e]?{...n,...n[e]}:{...n}}const hM=n=>typeof n=="number",dM=n=>n.every(hM),fM=n=>Array.isArray(n);function pM(n,e,t){const i=n.getProps();return Nf(i,e,i.custom,n)}function mM(n,e,t){n.hasValue(e)?n.getValue(e).set(t):n.addValue(e,_s(t))}function gM(n){return fM(n)?n[n.length-1]||0:n}function vM(n,e){const t=pM(n,e);let{transitionEnd:i={},transition:s={},...r}=t||{};r={...r,...i};for(const a in r){const o=gM(r[a]);mM(n,a,o)}}function _M(n){return!!(Ft(n)&&n.add)}function xM(n,e){const t=n.getValue("willChange");if(_M(t))return t.add(e);if(!t&&ai.WillChange){const i=new ai.WillChange("auto");n.addValue("willChange",i),i.add(e)}}const yM="framerAppearId",SM="data-"+xc(yM);function cp(n){return n.props[SM]}const MM=n=>n!==null;function bM(n,{repeat:e,repeatType:t="loop"},i){const s=n.filter(MM),r=e&&t!=="loop"&&e%2===1?0:s.length-1;return s[r]}const EM={type:"spring",stiffness:500,damping:25,restSpeed:10},TM=n=>({type:"spring",stiffness:550,damping:n===0?2*Math.sqrt(550):30,restSpeed:10}),AM={type:"keyframes",duration:.8},wM={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},CM=(n,{keyframes:e})=>e.length>2?AM:Cs.has(n)?n.startsWith("scale")?TM(e[1]):EM:wM;function RM({when:n,delay:e,delayChildren:t,staggerChildren:i,staggerDirection:s,repeat:r,repeatType:a,repeatDelay:o,from:l,elapsed:c,...u}){return!!Object.keys(u).length}function Ec(n,e){return(n==null?void 0:n[e])??(n==null?void 0:n.default)??n}function Jo(n){n.duration=0,n.type="keyframes"}function za(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*(2/3-t)*6:n}function PM({hue:n,saturation:e,lightness:t,alpha:i}){n/=360,e/=100,t/=100;let s=0,r=0,a=0;if(!e)s=r=a=t;else{const o=t<.5?t*(1+e):t+e-t*e,l=2*t-o;s=za(l,o,n+1/3),r=za(l,o,n),a=za(l,o,n-1/3)}return{red:Math.round(s*255),green:Math.round(r*255),blue:Math.round(a*255),alpha:i}}function da(n,e){return t=>t>0?e:n}const Ga=(n,e,t)=>{const i=n*n,s=t*(e*e-i)+i;return s<0?0:Math.sqrt(s)},LM=[Go,zi,fs],DM=n=>LM.find(e=>e.test(n));function Ou(n){const e=DM(n);if(hr(!!e,`'${n}' is not an animatable color. Use the equivalent color code instead.`,"color-not-animatable"),!e)return!1;let t=e.parse(n);return e===fs&&(t=PM(t)),t}const Bu=(n,e)=>{const t=Ou(n),i=Ou(e);if(!t||!i)return da(n,e);const s={...t};return r=>(s.red=Ga(t.red,i.red,r),s.green=Ga(t.green,i.green,r),s.blue=Ga(t.blue,i.blue,r),s.alpha=bt(t.alpha,i.alpha,r),zi.transform(s))},Qo=new Set(["none","hidden"]);function IM(n,e){return Qo.has(n)?t=>t<=0?n:e:t=>t>=1?e:n}const FM=(n,e)=>t=>e(n(t)),dr=(...n)=>n.reduce(FM);function UM(n,e){return t=>bt(n,e,t)}function Tc(n){return typeof n=="number"?UM:typeof n=="string"?fc(n)?da:It.test(n)?Bu:BM:Array.isArray(n)?up:typeof n=="object"?It.test(n)?Bu:NM:da}function up(n,e){const t=[...n],i=t.length,s=n.map((r,a)=>Tc(r)(r,e[a]));return r=>{for(let a=0;a<i;a++)t[a]=s[a](r);return t}}function NM(n,e){const t={...n,...e},i={};for(const s in t)n[s]!==void 0&&e[s]!==void 0&&(i[s]=Tc(n[s])(n[s],e[s]));return s=>{for(const r in i)t[r]=i[r](s);return t}}function OM(n,e){const t=[],i={color:0,var:0,number:0};for(let s=0;s<e.values.length;s++){const r=e.types[s],a=n.indexes[r][i[r]],o=n.values[a]??0;t[s]=o,i[r]++}return t}const BM=(n,e)=>{const t=Ti.createTransformer(e),i=Qs(n),s=Qs(e);return i.indexes.var.length===s.indexes.var.length&&i.indexes.color.length===s.indexes.color.length&&i.indexes.number.length>=s.indexes.number.length?Qo.has(n)&&!s.values.length||Qo.has(e)&&!i.values.length?IM(n,e):dr(up(OM(i,s),s.values),t):(hr(!0,`Complex values '${n}' and '${e}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`,"complex-values-different"),da(n,e))};function hp(n,e,t){return typeof n=="number"&&typeof e=="number"&&typeof t=="number"?bt(n,e,t):Tc(n)(n,e)}const VM=n=>{const e=({timestamp:t})=>n(t);return{start:(t=!0)=>_t.update(e,t),stop:()=>oi(e),now:()=>Gt.isProcessing?Gt.timestamp:Kt.now()}},dp=(n,e,t=10)=>{let i="";const s=Math.max(Math.round(e/t),2);for(let r=0;r<s;r++)i+=Math.round(n(r/(s-1))*1e4)/1e4+", ";return`linear(${i.substring(0,i.length-2)})`},kM=5;function fp(n,e,t){const i=Math.max(e-kM,0);return Uf(t-n(i),e-i)}const Tt={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1},Ha=.001;function zM({duration:n=Tt.duration,bounce:e=Tt.bounce,velocity:t=Tt.velocity,mass:i=Tt.mass}){let s,r;hr(n<=Cn(Tt.maxDuration),"Spring duration must be 10 seconds or less","spring-duration-limit");let a=1-e;a=$n(Tt.minDamping,Tt.maxDamping,a),n=$n(Tt.minDuration,Tt.maxDuration,_n(n)),a<1?(s=c=>{const u=c*a,h=u*n,d=u-t,f=el(c,a),g=Math.exp(-h);return Ha-d/f*g},r=c=>{const h=c*a*n,d=h*t+t,f=Math.pow(a,2)*Math.pow(c,2)*n,g=Math.exp(-h),v=el(Math.pow(c,2),a);return(-s(c)+Ha>0?-1:1)*((d-f)*g)/v}):(s=c=>{const u=Math.exp(-c*n),h=(c-t)*n+1;return-Ha+u*h},r=c=>{const u=Math.exp(-c*n),h=(t-c)*(n*n);return u*h});const o=5/n,l=HM(s,r,o);if(n=Cn(n),isNaN(l))return{stiffness:Tt.stiffness,damping:Tt.damping,duration:n};{const c=Math.pow(l,2)*i;return{stiffness:c,damping:a*2*Math.sqrt(i*c),duration:n}}}const GM=12;function HM(n,e,t){let i=t;for(let s=1;s<GM;s++)i=i-n(i)/e(i);return i}function el(n,e){return n*Math.sqrt(1-e*e)}const WM=["duration","bounce"],$M=["stiffness","damping","mass"];function Vu(n,e){return e.some(t=>n[t]!==void 0)}function XM(n){let e={velocity:Tt.velocity,stiffness:Tt.stiffness,damping:Tt.damping,mass:Tt.mass,isResolvedFromDuration:!1,...n};if(!Vu(n,$M)&&Vu(n,WM))if(n.visualDuration){const t=n.visualDuration,i=2*Math.PI/(t*1.2),s=i*i,r=2*$n(.05,1,1-(n.bounce||0))*Math.sqrt(s);e={...e,mass:Tt.mass,stiffness:s,damping:r}}else{const t=zM(n);e={...e,...t,mass:Tt.mass},e.isResolvedFromDuration=!0}return e}function tr(n=Tt.visualDuration,e=Tt.bounce){const t=typeof n!="object"?{visualDuration:n,keyframes:[0,1],bounce:e}:n;let{restSpeed:i,restDelta:s}=t;const r=t.keyframes[0],a=t.keyframes[t.keyframes.length-1],o={done:!1,value:r},{stiffness:l,damping:c,mass:u,duration:h,velocity:d,isResolvedFromDuration:f}=XM({...t,velocity:-_n(t.velocity||0)}),g=d||0,v=c/(2*Math.sqrt(l*u)),m=a-r,p=_n(Math.sqrt(l/u)),M=Math.abs(m)<5;i||(i=M?Tt.restSpeed.granular:Tt.restSpeed.default),s||(s=M?Tt.restDelta.granular:Tt.restDelta.default);let y;if(v<1){const E=el(p,v);y=T=>{const w=Math.exp(-v*p*T);return a-w*((g+v*p*m)/E*Math.sin(E*T)+m*Math.cos(E*T))}}else if(v===1)y=E=>a-Math.exp(-p*E)*(m+(g+p*m)*E);else{const E=p*Math.sqrt(v*v-1);y=T=>{const w=Math.exp(-v*p*T),R=Math.min(E*T,300);return a-w*((g+v*p*m)*Math.sinh(R)+E*m*Math.cosh(R))/E}}const S={calculatedDuration:f&&h||null,next:E=>{const T=y(E);if(f)o.done=E>=h;else{let w=E===0?g:0;v<1&&(w=E===0?Cn(g):fp(y,E,T));const R=Math.abs(w)<=i,_=Math.abs(a-T)<=s;o.done=R&&_}return o.value=o.done?a:T,o},toString:()=>{const E=Math.min(Mc(S),ha),T=dp(w=>S.next(E*w).value,E,30);return E+"ms "+T},toTransition:()=>{}};return S}tr.applyToOptions=n=>{const e=lp(n,100,tr);return n.ease=e.ease,n.duration=Cn(e.duration),n.type="keyframes",n};function tl({keyframes:n,velocity:e=0,power:t=.8,timeConstant:i=325,bounceDamping:s=10,bounceStiffness:r=500,modifyTarget:a,min:o,max:l,restDelta:c=.5,restSpeed:u}){const h=n[0],d={done:!1,value:h},f=R=>o!==void 0&&R<o||l!==void 0&&R>l,g=R=>o===void 0?l:l===void 0||Math.abs(o-R)<Math.abs(l-R)?o:l;let v=t*e;const m=h+v,p=a===void 0?m:a(m);p!==m&&(v=p-h);const M=R=>-v*Math.exp(-R/i),y=R=>p+M(R),S=R=>{const _=M(R),b=y(R);d.done=Math.abs(_)<=c,d.value=d.done?p:b};let E,T;const w=R=>{f(d.value)&&(E=R,T=tr({keyframes:[d.value,g(d.value)],velocity:fp(y,R,d.value),damping:s,stiffness:r,restDelta:c,restSpeed:u}))};return w(0),{calculatedDuration:null,next:R=>{let _=!1;return!T&&E===void 0&&(_=!0,S(R),w(R)),E!==void 0&&R>=E?T.next(R-E):(!_&&S(R),d)}}}function qM(n,e,t){const i=[],s=t||ai.mix||hp,r=n.length-1;for(let a=0;a<r;a++){let o=s(n[a],n[a+1]);if(e){const l=Array.isArray(e)?e[a]||rn:e;o=dr(l,o)}i.push(o)}return i}function YM(n,e,{clamp:t=!0,ease:i,mixer:s}={}){const r=n.length;if(li(r===e.length,"Both input and output ranges must be the same length","range-length"),r===1)return()=>e[0];if(r===2&&e[0]===e[1])return()=>e[1];const a=n[0]===n[1];n[0]>n[r-1]&&(n=[...n].reverse(),e=[...e].reverse());const o=qM(e,i,s),l=o.length,c=u=>{if(a&&u<n[0])return e[0];let h=0;if(l>1)for(;h<n.length-2&&!(u<n[h+1]);h++);const d=xs(n[h],n[h+1],u);return o[h](d)};return t?u=>c($n(n[0],n[r-1],u)):c}function jM(n,e){return n.map(t=>t*e)}const pp=(n,e,t)=>(((1-3*t+3*e)*n+(3*t-6*e))*n+3*e)*n,KM=1e-7,ZM=12;function JM(n,e,t,i,s){let r,a,o=0;do a=e+(t-e)/2,r=pp(a,i,s)-n,r>0?t=a:e=a;while(Math.abs(r)>KM&&++o<ZM);return a}function fr(n,e,t,i){if(n===e&&t===i)return rn;const s=r=>JM(r,0,1,n,t);return r=>r===0||r===1?r:pp(s(r),e,i)}const QM=fr(.42,0,1,1),eb=fr(0,0,.58,1),mp=fr(.42,0,.58,1),gp=n=>e=>e<=.5?n(2*e)/2:(2-n(2*(1-e)))/2,vp=n=>e=>1-n(1-e),_p=fr(.33,1.53,.69,.99),Ac=vp(_p),xp=gp(Ac),yp=n=>(n*=2)<1?.5*Ac(n):.5*(2-Math.pow(2,-10*(n-1))),wc=n=>1-Math.sin(Math.acos(n)),Sp=vp(wc),Mp=gp(wc),bp=n=>Array.isArray(n)&&typeof n[0]=="number",ku={linear:rn,easeIn:QM,easeInOut:mp,easeOut:eb,circIn:wc,circInOut:Mp,circOut:Sp,backIn:Ac,backInOut:xp,backOut:_p,anticipate:yp},tb=n=>typeof n=="string",zu=n=>{if(bp(n)){li(n.length===4,"Cubic bezier arrays must contain four numerical values.","cubic-bezier-length");const[e,t,i,s]=n;return fr(e,t,i,s)}else if(tb(n))return li(ku[n]!==void 0,`Invalid easing type '${n}'`,"invalid-easing-type"),ku[n];return n};function nb(n,e){return n.map(()=>e||mp).splice(0,n.length-1)}function qs({duration:n=300,keyframes:e,times:t,ease:i="easeInOut"}){const s=sp(i)?i.map(zu):zu(i),r={done:!1,value:e[0]},a=jM(t&&t.length===e.length?t:op(e),n),o=YM(a,e,{ease:Array.isArray(s)?s:nb(e,s)});return{calculatedDuration:n,next:l=>(r.value=o(l),r.done=l>=n,r)}}const ib=n=>n!==null;function Cc(n,{repeat:e,repeatType:t="loop"},i,s=1){const r=n.filter(ib),o=s<0||e&&t!=="loop"&&e%2===1?0:r.length-1;return!o||i===void 0?r[o]:i}const sb={decay:tl,inertia:tl,tween:qs,keyframes:qs,spring:tr};function Ep(n){typeof n.type=="string"&&(n.type=sb[n.type])}class Rc{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(e=>{this.resolve=e})}notifyFinished(){this.resolve()}then(e,t){return this.finished.then(e,t)}}const rb=n=>n/100;class Pc extends Rc{constructor(e){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.stop=()=>{var t,i;const{motionValue:s}=this.options;s&&s.updatedAt!==Kt.now()&&this.tick(Kt.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),(i=(t=this.options).onStop)==null||i.call(t))},this.options=e,this.initAnimation(),this.play(),e.autoplay===!1&&this.pause()}initAnimation(){const{options:e}=this;Ep(e);const{type:t=qs,repeat:i=0,repeatDelay:s=0,repeatType:r,velocity:a=0}=e;let{keyframes:o}=e;const l=t||qs;l!==qs&&typeof o[0]!="number"&&(this.mixKeyframes=dr(rb,hp(o[0],o[1])),o=[0,100]);const c=l({...e,keyframes:o});r==="mirror"&&(this.mirroredGenerator=l({...e,keyframes:[...o].reverse(),velocity:-a})),c.calculatedDuration===null&&(c.calculatedDuration=Mc(c));const{calculatedDuration:u}=c;this.calculatedDuration=u,this.resolvedDuration=u+s,this.totalDuration=this.resolvedDuration*(i+1)-s,this.generator=c}updateTime(e){const t=Math.round(e-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=t}tick(e,t=!1){const{generator:i,totalDuration:s,mixKeyframes:r,mirroredGenerator:a,resolvedDuration:o,calculatedDuration:l}=this;if(this.startTime===null)return i.next(0);const{delay:c=0,keyframes:u,repeat:h,repeatType:d,repeatDelay:f,type:g,onUpdate:v,finalKeyframe:m}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,e):this.speed<0&&(this.startTime=Math.min(e-s/this.speed,this.startTime)),t?this.currentTime=e:this.updateTime(e);const p=this.currentTime-c*(this.playbackSpeed>=0?1:-1),M=this.playbackSpeed>=0?p<0:p>s;this.currentTime=Math.max(p,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=s);let y=this.currentTime,S=i;if(h){const R=Math.min(this.currentTime,s)/o;let _=Math.floor(R),b=R%1;!b&&R>=1&&(b=1),b===1&&_--,_=Math.min(_,h+1),!!(_%2)&&(d==="reverse"?(b=1-b,f&&(b-=f/o)):d==="mirror"&&(S=a)),y=$n(0,1,b)*o}const E=M?{done:!1,value:u[0]}:S.next(y);r&&(E.value=r(E.value));let{done:T}=E;!M&&l!==null&&(T=this.playbackSpeed>=0?this.currentTime>=s:this.currentTime<=0);const w=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&T);return w&&g!==tl&&(E.value=Cc(u,this.options,m,this.speed)),v&&v(E.value),w&&this.finish(),E}then(e,t){return this.finished.then(e,t)}get duration(){return _n(this.calculatedDuration)}get iterationDuration(){const{delay:e=0}=this.options||{};return this.duration+_n(e)}get time(){return _n(this.currentTime)}set time(e){var t;e=Cn(e),this.currentTime=e,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=e:this.driver&&(this.startTime=this.driver.now()-e/this.playbackSpeed),(t=this.driver)==null||t.start(!1)}get speed(){return this.playbackSpeed}set speed(e){this.updateTime(Kt.now());const t=this.playbackSpeed!==e;this.playbackSpeed=e,t&&(this.time=_n(this.currentTime))}play(){var e,t;if(this.isStopped)return;const{driver:i=VM,startTime:s}=this.options;this.driver||(this.driver=i(a=>this.tick(a))),(t=(e=this.options).onPlay)==null||t.call(e);const r=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=r):this.holdTime!==null?this.startTime=r-this.holdTime:this.startTime||(this.startTime=s??r),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(Kt.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){var e,t;this.notifyFinished(),this.teardown(),this.state="finished",(t=(e=this.options).onComplete)==null||t.call(e)}cancel(){var e,t;this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),(t=(e=this.options).onCancel)==null||t.call(e)}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(e){return this.startTime=0,this.tick(e,!0)}attachTimeline(e){var t;return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),(t=this.driver)==null||t.stop(),e.observe(this)}}const ab=n=>n.startsWith("--");function ob(n,e,t){ab(e)?n.style.setProperty(e,t):n.style[e]=t}function Lc(n){let e;return()=>(e===void 0&&(e=n()),e)}const lb=Lc(()=>window.ScrollTimeline!==void 0),cb={};function ub(n,e){const t=Lc(n);return()=>cb[e]??t()}const Tp=ub(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),zs=([n,e,t,i])=>`cubic-bezier(${n}, ${e}, ${t}, ${i})`,Gu={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:zs([0,.65,.55,1]),circOut:zs([.55,0,1,.45]),backIn:zs([.31,.01,.66,-.59]),backOut:zs([.33,1.53,.69,.99])};function Ap(n,e){if(n)return typeof n=="function"?Tp()?dp(n,e):"ease-out":bp(n)?zs(n):Array.isArray(n)?n.map(t=>Ap(t,e)||Gu.easeOut):Gu[n]}function hb(n,e,t,{delay:i=0,duration:s=300,repeat:r=0,repeatType:a="loop",ease:o="easeOut",times:l}={},c=void 0){const u={[e]:t};l&&(u.offset=l);const h=Ap(o,s);Array.isArray(h)&&(u.easing=h);const d={delay:i,duration:s,easing:Array.isArray(h)?"linear":h,fill:"both",iterations:r+1,direction:a==="reverse"?"alternate":"normal"};return c&&(d.pseudoElement=c),n.animate(u,d)}function db({type:n,...e}){return bc(n)&&Tp()?n.applyToOptions(e):(e.duration??(e.duration=300),e.ease??(e.ease="easeOut"),e)}class fb extends Rc{constructor(e){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!e)return;const{element:t,name:i,keyframes:s,pseudoElement:r,allowFlatten:a=!1,finalKeyframe:o,onComplete:l}=e;this.isPseudoElement=!!r,this.allowFlatten=a,this.options=e,li(typeof e.type!="string",`Mini animate() doesn't support "type" as a string.`,"mini-spring");const c=db(e);this.animation=hb(t,i,s,c,r),c.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!r){const u=Cc(s,this.options,o,this.speed);this.updateMotionValue?this.updateMotionValue(u):ob(t,i,u),this.animation.cancel()}l==null||l(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){var e,t;(t=(e=this.animation).finish)==null||t.call(e)}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:e}=this;e==="idle"||e==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){var e,t;this.isPseudoElement||(t=(e=this.animation).commitStyles)==null||t.call(e)}get duration(){var e,t;const i=((t=(e=this.animation.effect)==null?void 0:e.getComputedTiming)==null?void 0:t.call(e).duration)||0;return _n(Number(i))}get iterationDuration(){const{delay:e=0}=this.options||{};return this.duration+_n(e)}get time(){return _n(Number(this.animation.currentTime)||0)}set time(e){this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=Cn(e)}get speed(){return this.animation.playbackRate}set speed(e){e<0&&(this.finishedTime=null),this.animation.playbackRate=e}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(e){this.manualStartTime=this.animation.startTime=e}attachTimeline({timeline:e,observe:t}){var i;return this.allowFlatten&&((i=this.animation.effect)==null||i.updateTiming({easing:"linear"})),this.animation.onfinish=null,e&&lb()?(this.animation.timeline=e,rn):t(this)}}const wp={anticipate:yp,backInOut:xp,circInOut:Mp};function pb(n){return n in wp}function mb(n){typeof n.ease=="string"&&pb(n.ease)&&(n.ease=wp[n.ease])}const Wa=10;class gb extends fb{constructor(e){mb(e),Ep(e),super(e),e.startTime!==void 0&&(this.startTime=e.startTime),this.options=e}updateMotionValue(e){const{motionValue:t,onUpdate:i,onComplete:s,element:r,...a}=this.options;if(!t)return;if(e!==void 0){t.set(e);return}const o=new Pc({...a,autoplay:!1}),l=Math.max(Wa,Kt.now()-this.startTime),c=$n(0,Wa,l-Wa);t.setWithVelocity(o.sample(Math.max(0,l-c)).value,o.sample(l).value,c),o.stop()}}const Hu=(n,e)=>e==="zIndex"?!1:!!(typeof n=="number"||Array.isArray(n)||typeof n=="string"&&(Ti.test(n)||n==="0")&&!n.startsWith("url("));function vb(n){const e=n[0];if(n.length===1)return!0;for(let t=0;t<n.length;t++)if(n[t]!==e)return!0}function _b(n,e,t,i){const s=n[0];if(s===null)return!1;if(e==="display"||e==="visibility")return!0;const r=n[n.length-1],a=Hu(s,e),o=Hu(r,e);return hr(a===o,`You are trying to animate ${e} from "${s}" to "${r}". "${a?r:s}" is not an animatable value.`,"value-not-animatable"),!a||!o?!1:vb(n)||(t==="spring"||bc(t))&&i}const xb=new Set(["opacity","clipPath","filter","transform"]),yb=Lc(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function Sb(n){var e;const{motionValue:t,name:i,repeatDelay:s,repeatType:r,damping:a,type:o}=n;if(!(((e=t==null?void 0:t.owner)==null?void 0:e.current)instanceof HTMLElement))return!1;const{onUpdate:c,transformTemplate:u}=t.owner.getProps();return yb()&&i&&xb.has(i)&&(i!=="transform"||!u)&&!c&&!s&&r!=="mirror"&&a!==0&&o!=="inertia"}const Mb=40;class bb extends Rc{constructor({autoplay:e=!0,delay:t=0,type:i="keyframes",repeat:s=0,repeatDelay:r=0,repeatType:a="loop",keyframes:o,name:l,motionValue:c,element:u,...h}){var d;super(),this.stop=()=>{var v,m;this._animation&&(this._animation.stop(),(v=this.stopTimeline)==null||v.call(this)),(m=this.keyframeResolver)==null||m.cancel()},this.createdAt=Kt.now();const f={autoplay:e,delay:t,type:i,repeat:s,repeatDelay:r,repeatType:a,name:l,motionValue:c,element:u,...h},g=(u==null?void 0:u.KeyframeResolver)||vc;this.keyframeResolver=new g(o,(v,m,p)=>this.onKeyframesResolved(v,m,f,!p),l,c,u),(d=this.keyframeResolver)==null||d.scheduleResolve()}onKeyframesResolved(e,t,i,s){this.keyframeResolver=void 0;const{name:r,type:a,velocity:o,delay:l,isHandoff:c,onUpdate:u}=i;this.resolvedAt=Kt.now(),_b(e,r,a,o)||((ai.instantAnimations||!l)&&(u==null||u(Cc(e,i,t))),e[0]=e[e.length-1],Jo(i),i.repeat=0);const d={startTime:s?this.resolvedAt?this.resolvedAt-this.createdAt>Mb?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:t,...i,keyframes:e},f=!c&&Sb(d)?new gb({...d,element:d.motionValue.owner.current}):new Pc(d);f.finished.then(()=>this.notifyFinished()).catch(rn),this.pendingTimeline&&(this.stopTimeline=f.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=f}get finished(){return this._animation?this.animation.finished:this._finished}then(e,t){return this.finished.finally(e).then(()=>{})}get animation(){var e;return this._animation||((e=this.keyframeResolver)==null||e.resume(),MS()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(e){this.animation.time=e}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(e){this.animation.speed=e}get startTime(){return this.animation.startTime}attachTimeline(e){return this._animation?this.stopTimeline=this.animation.attachTimeline(e):this.pendingTimeline=e,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){var e;this._animation&&this.animation.cancel(),(e=this.keyframeResolver)==null||e.cancel()}}const Dc=(n,e,t,i={},s,r)=>a=>{const o=Ec(i,n)||{},l=o.delay||i.delay||0;let{elapsed:c=0}=i;c=c-Cn(l);const u={keyframes:Array.isArray(t)?t:[null,t],ease:"easeOut",velocity:e.getVelocity(),...o,delay:-c,onUpdate:d=>{e.set(d),o.onUpdate&&o.onUpdate(d)},onComplete:()=>{a(),o.onComplete&&o.onComplete()},name:n,motionValue:e,element:r?void 0:s};RM(o)||Object.assign(u,CM(n,u)),u.duration&&(u.duration=Cn(u.duration)),u.repeatDelay&&(u.repeatDelay=Cn(u.repeatDelay)),u.from!==void 0&&(u.keyframes[0]=u.from);let h=!1;if((u.type===!1||u.duration===0&&!u.repeatDelay)&&(Jo(u),u.delay===0&&(h=!0)),(ai.instantAnimations||ai.skipAnimations)&&(h=!0,Jo(u),u.delay=0),u.allowFlatten=!o.type&&!o.ease,h&&!r&&e.get()!==void 0){const d=bM(u.keyframes,o);if(d!==void 0){_t.update(()=>{u.onUpdate(d),u.onComplete()});return}}return o.isSync?new Pc(u):new bb(u)};function Eb({protectedKeys:n,needsAnimating:e},t){const i=n.hasOwnProperty(t)&&e[t]!==!0;return e[t]=!1,i}function Tb(n,e,{delay:t=0,transitionOverride:i,type:s}={}){let{transition:r=n.getDefaultTransition(),transitionEnd:a,...o}=e;i&&(r=i);const l=[],c=s&&n.animationState&&n.animationState.getState()[s];for(const u in o){const h=n.getValue(u,n.latestValues[u]??null),d=o[u];if(d===void 0||c&&Eb(c,u))continue;const f={delay:t,...Ec(r||{},u)},g=h.get();if(g!==void 0&&!h.isAnimating&&!Array.isArray(d)&&d===g&&!f.velocity)continue;let v=!1;if(window.MotionHandoffAnimation){const p=cp(n);if(p){const M=window.MotionHandoffAnimation(p,u,_t);M!==null&&(f.startTime=M,v=!0)}}xM(n,u),h.start(Dc(u,h,d,n.shouldReduceMotion&&qf.has(u)?{type:!1}:f,n,v));const m=h.animation;m&&l.push(m)}return a&&Promise.all(l).then(()=>{_t.update(()=>{a&&vM(n,a)})}),l}function Ab(n,e){return n in e}class wb extends Xf{constructor(){super(...arguments),this.type="object"}readValueFromInstance(e,t){if(Ab(t,e)){const i=e[t];if(typeof i=="string"||typeof i=="number")return i}}getBaseTargetFromProps(){}removeValueFromRenderState(e,t){delete t.output[e]}measureInstanceViewportBox(){return Nt()}build(e,t){Object.assign(e.output,t)}renderInstance(e,{output:t}){Object.assign(e,t)}sortInstanceNodePosition(){return 0}}function Cp(n){return typeof n=="object"&&n!==null}function Ic(n){return Cp(n)&&"ownerSVGElement"in n}function Rp(n){return Ic(n)&&n.tagName==="svg"}function Cb(n){const e={presenceContext:null,props:{},visualState:{renderState:{transform:{},transformOrigin:{},style:{},vars:{},attrs:{}},latestValues:{}}},t=Ic(n)&&!Rp(n)?new np(e):new ep(e);t.mount(n),Yi.set(n,t)}function Rb(n){const e={presenceContext:null,props:{},visualState:{renderState:{output:{}},latestValues:{}}},t=new wb(e);t.mount(n),Yi.set(n,t)}function Pp(n,e,t){const i=Ft(n)?n:_s(n);return i.start(Dc("",i,e,t)),i.animation}function Pb(n,e){return Ft(n)||typeof n=="number"||typeof n=="string"&&!yc(e)}function Lp(n,e,t,i){const s=[];if(Pb(n,e))s.push(Pp(n,yc(e)&&e.default||e,t&&(t.default||t)));else{const r=ip(n,e,i),a=r.length;li(!!a,"No valid elements provided.","no-valid-elements");for(let o=0;o<a;o++){const l=r[o];li(l!==null,"You're trying to perform an animation on null. Ensure that selectors are correctly finding elements and refs are correctly hydrated.","animate-null");const c=l instanceof Element?Cb:Rb;Yi.has(l)||c(l);const u=Yi.get(l),h={...t};"delay"in h&&typeof h.delay=="function"&&(h.delay=h.delay(o,a)),s.push(...Tb(u,{...e,transition:h},{}))}}return s}function Lb(n,e,t){const i=[];return lM(n,e,t,{spring:tr}).forEach(({keyframes:r,transition:a},o)=>{i.push(...Lp(o,r,a))}),i}class Db{constructor(e){this.stop=()=>this.runAll("stop"),this.animations=e.filter(Boolean)}get finished(){return Promise.all(this.animations.map(e=>e.finished))}getAll(e){return this.animations[0][e]}setAll(e,t){for(let i=0;i<this.animations.length;i++)this.animations[i][e]=t}attachTimeline(e){const t=this.animations.map(i=>i.attachTimeline(e));return()=>{t.forEach((i,s)=>{i&&i(),this.animations[s].stop()})}}get time(){return this.getAll("time")}set time(e){this.setAll("time",e)}get speed(){return this.getAll("speed")}set speed(e){this.setAll("speed",e)}get state(){return this.getAll("state")}get startTime(){return this.getAll("startTime")}get duration(){return Wu(this.animations,"duration")}get iterationDuration(){return Wu(this.animations,"iterationDuration")}runAll(e){this.animations.forEach(t=>t[e]())}play(){this.runAll("play")}pause(){this.runAll("pause")}cancel(){this.runAll("cancel")}complete(){this.runAll("complete")}}function Wu(n,e){let t=0;for(let i=0;i<n.length;i++){const s=n[i][e];s!==null&&s>t&&(t=s)}return t}class Ib extends Db{then(e,t){return this.finished.finally(e).then(()=>{})}}function Fb(n){return Array.isArray(n)&&n.some(Array.isArray)}function Ub(n){function e(t,i,s){let r=[],a;if(Fb(t))r=Lb(t,i,n);else{const{onComplete:l,...c}=s||{};typeof l=="function"&&(a=l),r=Lp(t,i,c,n)}const o=new Ib(r);return a&&o.finished.then(a),o}return e}const Nb=Ub(),Ob=["initial","animate","whileInView","whileHover","whilePress","whileDrag","whileFocus","exit"];class Bb extends di{constructor(e){var t,i;super(e),this.animateUpdates=({controlActiveState:s,directAnimate:r,directTransition:a,controlDelay:o=0,isExit:l}={})=>{const{reducedMotion:c}=this.state.options.motionConfig;this.state.visualElement.shouldReduceMotion=c==="always"||c==="user"&&!!ua.current;const u=this.state.target;this.state.target={...this.state.baseTarget};let h={};h=this.resolveStateAnimation({controlActiveState:s,directAnimate:r,directTransition:a}),this.state.finalTransition=h;const d=this.createAnimationFactories(u,h,o),{getChildAnimations:f}=this.setupChildAnimations(h,this.state.activeStates);return this.executeAnimations({factories:d,getChildAnimations:f,transition:h,controlActiveState:s,isExit:l})},this.state.visualElement=JS(this.state.options.as,{presenceContext:null,parent:(t=this.state.parent)==null?void 0:t.visualElement,props:{...this.state.options,whileTap:this.state.options.whilePress},visualState:{renderState:{transform:{},transformOrigin:{},style:{},vars:{},attrs:{}},latestValues:{...this.state.baseTarget}},reducedMotionConfig:this.state.options.motionConfig.reducedMotion}),(i=this.state.visualElement.parent)==null||i.addChild(this.state.visualElement),this.state.animateUpdates=this.animateUpdates,this.state.isMounted()&&this.state.startAnimation()}updateAnimationControlsSubscription(){const{animate:e}=this.state.options;pu(e)&&(this.unmountControls=e.subscribe(this.state))}executeAnimations({factories:e,getChildAnimations:t,transition:i,controlActiveState:s,isExit:r=!1}){const a=()=>Promise.all(e.map(h=>h()).filter(Boolean)),o={...this.state.target},l=this.state.element,c=h=>{var d,f;r&&(this.state.isExiting=!0),l.dispatchEvent(gu("motionstart",o)),(f=(d=this.state.options).onAnimationStart)==null||f.call(d,o),h.then(()=>{var g,v,m,p;if(r){this.state.isExiting=!1;const M=this.state.options.animatePresenceContext;if(M!=null&&M.onMotionExitComplete&&this.state.presenceContainer){const y=this.state,S=y.visualElement.projection;(g=y.options)!=null&&g.layoutId&&((v=S.currentAnimation)==null?void 0:v.state)==="running"&&!y.options.exit||M.onMotionExitComplete(y.presenceContainer,y)}}l.dispatchEvent(gu("motioncomplete",o,r)),(p=(m=this.state.options).onAnimationComplete)==null||p.call(m,o)}).catch(rn)},u=()=>{const h=i!=null&&i.when?(i.when==="beforeChildren"?a():t()).then(()=>i.when==="beforeChildren"?t():a()):Promise.all([a(),t()]);return c(h),h};return s?u:u()}setupChildAnimations(e,t){var i;const s=this.state.visualElement;if(!((i=s.variantChildren)!=null&&i.size)||!t)return{getChildAnimations:()=>Promise.resolve()};const{staggerChildren:r=0,staggerDirection:a=1,delayChildren:o=0}=e||{},l=s.variantChildren.size,c=(l-1)*r,u=typeof o=="function",h=u?f=>o(f,l):a===1?(f=0)=>f*r:(f=0)=>c-f*r,d=Array.from(s.variantChildren).map((f,g)=>f.state.animateUpdates({controlActiveState:t,controlDelay:(u?0:o)+h(g)}));return{getChildAnimations:()=>Promise.all(d.map(f=>f()))}}createAnimationFactories(e,t,i){const s=[];return Object.keys(this.state.target).forEach(r=>{var a;if(!Ly(e[r],this.state.target[r]))return;(a=this.state.baseTarget)[r]??(a[r]=jy.get(this.state.element,r));const o=this.state.target[r]==="none"&&oa(xu[r])?xu[r]:this.state.target[r];s.push(()=>{var l;return Nb(this.state.element,{[r]:o},{...(t==null?void 0:t[r])||t,delay:(((l=t==null?void 0:t[r])==null?void 0:l.delay)||(t==null?void 0:t.delay)||0)+i})})}),s}resolveStateAnimation({controlActiveState:e,directAnimate:t,directTransition:i}){let s=this.state.options.transition,r={};const{variants:a,custom:o,transition:l,animatePresenceContext:c}=this.state.options,u=o??(c==null?void 0:c.custom);return this.state.activeStates={...this.state.activeStates,...e},Ob.forEach(h=>{if(!this.state.activeStates[h]||pu(this.state.options[h]))return;const d=this.state.options[h];let f=oa(d)?Xs(d,a,u):void 0;if(this.state.visualElement.isVariantNode){const g=Xs(this.state.context[h],a,u);f=Object.assign(g?g||{}:r,f)}f&&(h!=="initial"&&(s=f.transition||this.state.options.transition||{}),r=Object.assign(r,f))}),t&&(r=Xs(t,a,u),s=r.transition||i||l),Object.entries(r).forEach(([h,d])=>{h!=="transition"&&(this.state.target[h]=d)}),s}mount(){var e,t;const{element:i}=this.state;la.set(i,this.state),Yi.get(i)||(this.state.visualElement.mount(i),Yi.set(i,this.state.visualElement)),this.state.visualElement.state=this.state,this.updateAnimationControlsSubscription();const s=this.state.visualElement,r=s.parent;if(s.enteringChildren=void 0,(e=this.state.parent)!=null&&e.isMounted()&&!s.isControllingVariants&&((t=r==null?void 0:r.enteringChildren)!=null&&t.has(s))){const{delayChildren:a}=this.state.parent.finalTransition||{};this.animateUpdates({controlActiveState:this.state.parent.activeStates,controlDelay:QS(r.enteringChildren,s,a)})()}}update(){const{animate:e}=this.state.options,{animate:t}=this.state.visualElement.prevProps||{};e!==t&&this.updateAnimationControlsSubscription()}unmount(){var e;(e=this.unmountControls)==null||e.call(this)}}function Vb(n){return Cp(n)&&"offsetHeight"in n}const kb={y:!1};function zb(){return kb.y}const Dp=(n,e)=>e?n===e?!0:Dp(n,e.parentElement):!1,Gb=n=>n.pointerType==="mouse"?typeof n.button!="number"||n.button<=0:n.isPrimary!==!1;function Ip(n,e){const t=Sc(n),i=new AbortController,s={passive:!0,...e,signal:i.signal};return[t,s,()=>i.abort()]}const Hb=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function Wb(n){return Hb.has(n.tagName)||n.isContentEditable===!0}const Zr=new WeakSet;function $u(n){return e=>{e.key==="Enter"&&n(e)}}function $a(n,e){n.dispatchEvent(new PointerEvent("pointer"+e,{isPrimary:!0,bubbles:!0}))}const $b=(n,e)=>{const t=n.currentTarget;if(!t)return;const i=$u(()=>{if(Zr.has(t))return;$a(t,"down");const s=$u(()=>{$a(t,"up")}),r=()=>$a(t,"cancel");t.addEventListener("keyup",s,e),t.addEventListener("blur",r,e)});t.addEventListener("keydown",i,e),t.addEventListener("blur",()=>t.removeEventListener("keydown",i),e)};function Xu(n){return Gb(n)&&!0}function Xb(n,e,t={}){const[i,s,r]=Ip(n,t),a=o=>{const l=o.currentTarget;if(!Xu(o))return;Zr.add(l);const c=e(l,o),u=(f,g)=>{window.removeEventListener("pointerup",h),window.removeEventListener("pointercancel",d),Zr.has(l)&&Zr.delete(l),Xu(f)&&typeof c=="function"&&c(f,{success:g})},h=f=>{u(f,l===window||l===document||t.useGlobalTarget||Dp(l,f.target))},d=f=>{u(f,!1)};window.addEventListener("pointerup",h,s),window.addEventListener("pointercancel",d,s)};return i.forEach(o=>{(t.useGlobalTarget?window:o).addEventListener("pointerdown",a,s),Vb(o)&&(o.addEventListener("focus",c=>$b(c,s)),!Wb(o)&&!o.hasAttribute("tabindex")&&(o.tabIndex=0))}),r}function Fp(n){return{point:{x:n.pageX,y:n.pageY}}}function qu(n,e,t){const i=n.options;i.whilePress&&n.setActive("whilePress",t==="Start");const s=`onPress${t==="End"?"":t}`,r=i[s];r&&_t.postRender(()=>r(e,Fp(e)))}class qb extends di{isActive(){const{whilePress:e,onPress:t,onPressCancel:i,onPressStart:s}=this.state.options;return!!(e||t||i||s)}constructor(e){super(e)}mount(){this.register()}update(){const{whilePress:e,onPress:t,onPressCancel:i,onPressStart:s}=this.state.options;e||t||i||s||this.register()}register(){const e=this.state.element;!e||!this.isActive()||(this.unmount(),this.unmount=Xb(e,(t,i)=>(qu(this.state,i,"Start"),(s,{success:r})=>qu(this.state,s,r?"End":"Cancel")),{useGlobalTarget:this.state.options.globalPressTarget}))}}function Yu(n){return!(n.pointerType==="touch"||zb())}function Yb(n,e,t={}){const[i,s,r]=Ip(n,t),a=o=>{if(!Yu(o))return;const{target:l}=o,c=e(l,o);if(typeof c!="function"||!l)return;const u=h=>{Yu(h)&&(c(h),l.removeEventListener("pointerleave",u))};l.addEventListener("pointerleave",u,s)};return i.forEach(o=>{o.addEventListener("pointerenter",a,s)}),r}function ju(n,e,t){const i=n.options;i.whileHover&&n.setActive("whileHover",t==="Start");const s=`onHover${t}`,r=i[s];r&&_t.postRender(()=>r(e,Fp(e)))}class jb extends di{isActive(){const{whileHover:e,onHoverStart:t,onHoverEnd:i}=this.state.options;return!!(e||t||i)}constructor(e){super(e)}mount(){this.register()}update(){const{whileHover:e,onHoverStart:t,onHoverEnd:i}=this.state.visualElement.prevProps;e||t||i||this.register()}register(){const e=this.state.element;!e||!this.isActive()||(this.unmount(),this.unmount=Yb(e,(t,i)=>(ju(this.state,i,"Start"),s=>{ju(this.state,s,"End")})))}}const Kb={some:0,all:1};function Zb(n,e,{root:t,margin:i,amount:s="some"}={}){const r=Sc(n),a=new WeakMap,o=c=>{c.forEach(u=>{const h=a.get(u.target);if(u.isIntersecting!==!!h)if(u.isIntersecting){const d=e(u.target,u);typeof d=="function"?a.set(u.target,d):l.unobserve(u.target)}else typeof h=="function"&&(h(u),a.delete(u.target))})},l=new IntersectionObserver(o,{root:t,rootMargin:i,threshold:typeof s=="number"?s:Kb[s]});return r.forEach(c=>l.observe(c)),()=>l.disconnect()}function Ku(n,e,t){const i=n.options;i.whileInView&&n.setActive("whileInView",t==="Enter");const s=`onViewport${t}`,r=i[s];r&&_t.postRender(()=>r(e))}class Jb extends di{isActive(){const{whileInView:e,onViewportEnter:t,onViewportLeave:i}=this.state.options;return!!(e||t||i)}constructor(e){super(e)}startObserver(){const e=this.state.element;if(!e||!this.isActive())return;this.unmount();const{once:t,...i}=this.state.options.inViewOptions||{};this.unmount=Zb(e,(s,r)=>{if(Ku(this.state,r,"Enter"),!t)return a=>{Ku(this.state,r,"Leave")}},i)}mount(){this.startObserver()}update(){const{props:e,prevProps:t}=this.state.visualElement;["amount","margin","root"].some(Qb(e,t))&&this.startObserver()}}function Qb({inViewOptions:n={}},{inViewOptions:e={}}={}){return t=>n[t]!==e[t]}function fa(n,e,t,i={passive:!0}){return n.addEventListener(e,t,i),()=>n.removeEventListener(e,t)}class eE extends di{constructor(){super(...arguments),this.isActive=!1}onFocus(){let e=!1;try{e=this.state.element.matches(":focus-visible")}catch{e=!0}e&&(this.state.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){this.isActive&&(this.state.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=dr(fa(this.state.element,"focus",()=>this.onFocus()),fa(this.state.element,"blur",()=>this.onBlur()))}}const tE=(n,e)=>n.depth-e.depth;class nE{constructor(){this.children=[],this.isDirty=!1}add(e){mc(this.children,e),this.isDirty=!0}remove(e){Ca(this.children,e),this.isDirty=!0}forEach(e){this.isDirty&&this.children.sort(tE),this.isDirty=!1,this.children.forEach(e)}}function Xa(n){return Ft(n)?n.get():n}const Up=["TopLeft","TopRight","BottomLeft","BottomRight"],iE=Up.length,Zu=n=>typeof n=="string"?parseFloat(n):n,Ju=n=>typeof n=="number"||xe.test(n);function sE(n,e,t,i,s,r){s?(n.opacity=bt(0,t.opacity??1,rE(i)),n.opacityExit=bt(e.opacity??1,0,aE(i))):r&&(n.opacity=bt(e.opacity??1,t.opacity??1,i));for(let a=0;a<iE;a++){const o=`border${Up[a]}Radius`;let l=Qu(e,o),c=Qu(t,o);if(l===void 0&&c===void 0)continue;l||(l=0),c||(c=0),l===0||c===0||Ju(l)===Ju(c)?(n[o]=Math.max(bt(Zu(l),Zu(c),i),0),(zn.test(c)||zn.test(l))&&(n[o]+="%")):n[o]=c}(e.rotate||t.rotate)&&(n.rotate=bt(e.rotate||0,t.rotate||0,i))}function Qu(n,e){return n[e]!==void 0?n[e]:n.borderRadius}const rE=Np(0,.5,Sp),aE=Np(.5,.95,rn);function Np(n,e,t){return i=>i<n?0:i>e?1:t(xs(n,e,i))}function eh(n,e){n.min=e.min,n.max=e.max}function yn(n,e){eh(n.x,e.x),eh(n.y,e.y)}function th(n,e){n.translate=e.translate,n.scale=e.scale,n.originPoint=e.originPoint,n.origin=e.origin}function qa(n){return n===void 0||n===1}function nl({scale:n,scaleX:e,scaleY:t}){return!qa(n)||!qa(e)||!qa(t)}function Ni(n){return nl(n)||Op(n)||n.z||n.rotate||n.rotateX||n.rotateY||n.skewX||n.skewY}function Op(n){return nh(n.x)||nh(n.y)}function nh(n){return n&&n!=="0%"}function pa(n,e,t){const i=n-t,s=e*i;return t+s}function ih(n,e,t,i,s){return s!==void 0&&(n=pa(n,s,i)),pa(n,t,i)+e}function il(n,e=0,t=1,i,s){n.min=ih(n.min,e,t,i,s),n.max=ih(n.max,e,t,i,s)}function Bp(n,{x:e,y:t}){il(n.x,e.translate,e.scale,e.originPoint),il(n.y,t.translate,t.scale,t.originPoint)}const sh=.999999999999,rh=1.0000000000001;function oE(n,e,t,i=!1){const s=t.length;if(!s)return;e.x=e.y=1;let r,a;for(let o=0;o<s;o++){r=t[o],a=r.projectionDelta;const{visualElement:l}=r.options;l&&l.props.style&&l.props.style.display==="contents"||(i&&r.options.layoutScroll&&r.scroll&&r!==r.root&&ms(n,{x:-r.scroll.offset.x,y:-r.scroll.offset.y}),a&&(e.x*=a.x.scale,e.y*=a.y.scale,Bp(n,a)),i&&Ni(r.latestValues)&&ms(n,r.latestValues))}e.x<rh&&e.x>sh&&(e.x=1),e.y<rh&&e.y>sh&&(e.y=1)}function Er(n,e){n.min=n.min+e,n.max=n.max+e}function ah(n,e,t,i,s=.5){const r=bt(n.min,n.max,s);il(n,e,t,r,i)}function ms(n,e){ah(n.x,e.x,e.scaleX,e.scale,e.originX),ah(n.y,e.y,e.scaleY,e.scale,e.originY)}const Vp=1e-4,lE=1-Vp,cE=1+Vp,kp=.01,uE=0-kp,hE=0+kp;function xn(n){return n.max-n.min}function dE(n,e,t){return Math.abs(n-e)<=t}function oh(n,e,t,i=.5){n.origin=i,n.originPoint=bt(e.min,e.max,n.origin),n.scale=xn(t)/xn(e),n.translate=bt(t.min,t.max,n.origin)-n.originPoint,(n.scale>=lE&&n.scale<=cE||isNaN(n.scale))&&(n.scale=1),(n.translate>=uE&&n.translate<=hE||isNaN(n.translate))&&(n.translate=0)}function Ys(n,e,t,i){oh(n.x,e.x,t.x,i?i.originX:void 0),oh(n.y,e.y,t.y,i?i.originY:void 0)}function lh(n,e,t){n.min=t.min+e.min,n.max=n.min+xn(e)}function fE(n,e,t){lh(n.x,e.x,t.x),lh(n.y,e.y,t.y)}function ch(n,e,t){n.min=e.min-t.min,n.max=n.min+xn(e)}function ma(n,e,t){ch(n.x,e.x,t.x),ch(n.y,e.y,t.y)}function uh(n,e,t,i,s){return n-=e,n=pa(n,1/t,i),s!==void 0&&(n=pa(n,1/s,i)),n}function pE(n,e=0,t=1,i=.5,s,r=n,a=n){if(zn.test(e)&&(e=parseFloat(e),e=bt(a.min,a.max,e/100)-a.min),typeof e!="number")return;let o=bt(r.min,r.max,i);n===r&&(o-=e),n.min=uh(n.min,e,t,o,s),n.max=uh(n.max,e,t,o,s)}function hh(n,e,[t,i,s],r,a){pE(n,e[t],e[i],e[s],e.scale,r,a)}const mE=["x","scaleX","originX"],gE=["y","scaleY","originY"];function dh(n,e,t,i){hh(n.x,e,mE,t?t.x:void 0,i?i.x:void 0),hh(n.y,e,gE,t?t.y:void 0,i?i.y:void 0)}function fh(n){return n.translate===0&&n.scale===1}function zp(n){return fh(n.x)&&fh(n.y)}function ph(n,e){return n.min===e.min&&n.max===e.max}function vE(n,e){return ph(n.x,e.x)&&ph(n.y,e.y)}function mh(n,e){return Math.round(n.min)===Math.round(e.min)&&Math.round(n.max)===Math.round(e.max)}function Gp(n,e){return mh(n.x,e.x)&&mh(n.y,e.y)}function gh(n){return xn(n.x)/xn(n.y)}function vh(n,e){return n.translate===e.translate&&n.scale===e.scale&&n.originPoint===e.originPoint}class _E{constructor(){this.members=[]}add(e){mc(this.members,e),e.scheduleRender()}remove(e){if(Ca(this.members,e),e===this.prevLead&&(this.prevLead=void 0),e===this.lead){const t=this.members[this.members.length-1];t&&this.promote(t)}}relegate(e){const t=this.members.findIndex(s=>e===s);if(t===0)return!1;let i;for(let s=t;s>=0;s--){const r=this.members[s];if(r.isPresent!==!1){i=r;break}}return i?(this.promote(i),!0):!1}promote(e,t){const i=this.lead;if(e!==i&&(this.prevLead=i,this.lead=e,e.show(),i)){i.instance&&i.scheduleRender(),e.scheduleRender(),e.resumeFrom=i,t&&(e.resumeFrom.preserveOpacity=!0),i.snapshot&&(e.snapshot=i.snapshot,e.snapshot.latestValues=i.animationValues||i.latestValues),e.root&&e.root.isUpdating&&(e.isLayoutDirty=!0);const{crossfade:s}=e.options;s===!1&&i.hide()}}exitAnimationComplete(){this.members.forEach(e=>{const{options:t,resumingFrom:i}=e;t.onExitComplete&&t.onExitComplete(),i&&i.options.onExitComplete&&i.options.onExitComplete()})}scheduleRender(){this.members.forEach(e=>{e.instance&&e.scheduleRender(!1)})}removeLeadSnapshot(){this.lead&&this.lead.snapshot&&(this.lead.snapshot=void 0)}}function xE(n,e,t){let i="";const s=n.x.translate/e.x,r=n.y.translate/e.y,a=(t==null?void 0:t.z)||0;if((s||r||a)&&(i=`translate3d(${s}px, ${r}px, ${a}px) `),(e.x!==1||e.y!==1)&&(i+=`scale(${1/e.x}, ${1/e.y}) `),t){const{transformPerspective:c,rotate:u,rotateX:h,rotateY:d,skewX:f,skewY:g}=t;c&&(i=`perspective(${c}px) ${i}`),u&&(i+=`rotate(${u}deg) `),h&&(i+=`rotateX(${h}deg) `),d&&(i+=`rotateY(${d}deg) `),f&&(i+=`skewX(${f}deg) `),g&&(i+=`skewY(${g}deg) `)}const o=n.x.scale*e.x,l=n.y.scale*e.y;return(o!==1||l!==1)&&(i+=`scale(${o}, ${l})`),i||"none"}function _h(n){return[n("x"),n("y")]}const Jr={hasAnimatedSinceResize:!0,hasEverUpdated:!1},Ya=["","X","Y","Z"],yE=1e3;let SE=0;function ja(n,e,t,i){const{latestValues:s}=e;s[n]&&(t[n]=s[n],e.setStaticValue(n,0),i&&(i[n]=0))}function Hp(n){if(n.hasCheckedOptimisedAppear=!0,n.root===n)return;const{visualElement:e}=n.options;if(!e)return;const t=cp(e);if(window.MotionHasOptimisedAnimation(t,"transform")){const{layout:s,layoutId:r}=n.options;window.MotionCancelOptimisedAnimation(t,"transform",_t,!(s||r))}const{parent:i}=n;i&&!i.hasCheckedOptimisedAppear&&Hp(i)}function Wp({attachResizeListener:n,defaultParent:e,measureScroll:t,checkIsScrollRoot:i,resetTransform:s}){return class{constructor(a={},o=e==null?void 0:e()){this.id=SE++,this.animationId=0,this.animationCommitId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.layoutVersion=0,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(EE),this.nodes.forEach(CE),this.nodes.forEach(RE),this.nodes.forEach(TE)},this.resolvedRelativeTargetAt=0,this.linkedParentVersion=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=a,this.root=o?o.root||o:this,this.path=o?[...o.path,o]:[],this.parent=o,this.depth=o?o.depth+1:0;for(let l=0;l<this.path.length;l++)this.path[l].shouldResetTransform=!0;this.root===this&&(this.nodes=new nE)}addEventListener(a,o){return this.eventHandlers.has(a)||this.eventHandlers.set(a,new gc),this.eventHandlers.get(a).add(o)}notifyListeners(a,...o){const l=this.eventHandlers.get(a);l&&l.notify(...o)}hasListeners(a){return this.eventHandlers.has(a)}mount(a){if(this.instance)return;this.isSVG=Ic(a)&&!Rp(a),this.instance=a;const{layoutId:o,layout:l,visualElement:c}=this.options;if(c&&!c.current&&c.mount(a),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),this.root.hasTreeAnimated&&(l||o)&&(this.isLayoutDirty=!0),n){let u,h=0;const d=()=>this.root.updateBlockedByResize=!1;_t.read(()=>{h=window.innerWidth}),n(a,()=>{const f=window.innerWidth;f!==h&&(h=f,this.root.updateBlockedByResize=!0,u&&u(),u=dy(d,250),Jr.hasAnimatedSinceResize&&(Jr.hasAnimatedSinceResize=!1,this.nodes.forEach(Sh)))})}o&&this.root.registerSharedNode(o,this),this.options.animate!==!1&&c&&(o||l)&&this.addEventListener("didUpdate",({delta:u,hasLayoutChanged:h,hasRelativeLayoutChanged:d,layout:f})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const g=this.options.transition||c.getDefaultTransition()||FE,{onLayoutAnimationStart:v,onLayoutAnimationComplete:m}=c.getProps(),p=!this.targetLayout||!Gp(this.targetLayout,f),M=!h&&d;if(this.options.layoutRoot||this.resumeFrom||M||h&&(p||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0);const y={...Ec(g,"layout"),onPlay:v,onComplete:m};(c.shouldReduceMotion||this.options.layoutRoot)&&(y.delay=0,y.type=!1),this.startAnimation(y),this.setAnimationOrigin(u,M)}else h||Sh(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=f})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const a=this.getStack();a&&a.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,this.eventHandlers.clear(),oi(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(PE),this.animationId++)}getTransformTemplate(){const{visualElement:a}=this.options;return a&&a.getProps().transformTemplate}willUpdate(a=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&Hp(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let u=0;u<this.path.length;u++){const h=this.path[u];h.shouldResetTransform=!0,h.updateScroll("snapshot"),h.options.layoutRoot&&h.willUpdate(!1)}const{layoutId:o,layout:l}=this.options;if(o===void 0&&!l)return;const c=this.getTransformTemplate();this.prevTransformTemplateValue=c?c(this.latestValues,""):void 0,this.updateSnapshot(),a&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){this.unblockUpdate(),this.clearAllSnapshots(),this.nodes.forEach(xh);return}if(this.animationId<=this.animationCommitId){this.nodes.forEach(yh);return}this.animationCommitId=this.animationId,this.isUpdating?(this.isUpdating=!1,this.nodes.forEach(wE),this.nodes.forEach(ME),this.nodes.forEach(bE)):this.nodes.forEach(yh),this.clearAllSnapshots();const o=Kt.now();Gt.delta=$n(0,1e3/60,o-Gt.timestamp),Gt.timestamp=o,Gt.isProcessing=!0,Va.update.process(Gt),Va.preRender.process(Gt),Va.render.process(Gt),Gt.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,$f.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(AE),this.sharedNodes.forEach(LE)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,_t.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){_t.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!xn(this.snapshot.measuredBox.x)&&!xn(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let l=0;l<this.path.length;l++)this.path[l].updateScroll();const a=this.layout;this.layout=this.measure(!1),this.layoutVersion++,this.layoutCorrected=Nt(),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:o}=this.options;o&&o.notify("LayoutMeasure",this.layout.layoutBox,a?a.layoutBox:void 0)}updateScroll(a="measure"){let o=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===a&&(o=!1),o&&this.instance){const l=i(this.instance);this.scroll={animationId:this.root.animationId,phase:a,isRoot:l,offset:t(this.instance),wasRoot:this.scroll?this.scroll.isRoot:l}}}resetTransform(){if(!s)return;const a=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,o=this.projectionDelta&&!zp(this.projectionDelta),l=this.getTransformTemplate(),c=l?l(this.latestValues,""):void 0,u=c!==this.prevTransformTemplateValue;a&&this.instance&&(o||Ni(this.latestValues)||u)&&(s(this.instance,c),this.shouldResetTransform=!1,this.scheduleRender())}measure(a=!0){const o=this.measurePageBox();let l=this.removeElementScroll(o);return a&&(l=this.removeTransform(l)),UE(l),{animationId:this.root.animationId,measuredBox:o,layoutBox:l,latestValues:{},source:this.id}}measurePageBox(){var a;const{visualElement:o}=this.options;if(!o)return Nt();const l=o.measureViewportBox();if(!(((a=this.scroll)==null?void 0:a.wasRoot)||this.path.some(NE))){const{scroll:u}=this.root;u&&(Er(l.x,u.offset.x),Er(l.y,u.offset.y))}return l}removeElementScroll(a){var o;const l=Nt();if(yn(l,a),(o=this.scroll)!=null&&o.wasRoot)return l;for(let c=0;c<this.path.length;c++){const u=this.path[c],{scroll:h,options:d}=u;u!==this.root&&h&&d.layoutScroll&&(h.wasRoot&&yn(l,a),Er(l.x,h.offset.x),Er(l.y,h.offset.y))}return l}applyTransform(a,o=!1){const l=Nt();yn(l,a);for(let c=0;c<this.path.length;c++){const u=this.path[c];!o&&u.options.layoutScroll&&u.scroll&&u!==u.root&&ms(l,{x:-u.scroll.offset.x,y:-u.scroll.offset.y}),Ni(u.latestValues)&&ms(l,u.latestValues)}return Ni(this.latestValues)&&ms(l,this.latestValues),l}removeTransform(a){const o=Nt();yn(o,a);for(let l=0;l<this.path.length;l++){const c=this.path[l];if(!c.instance||!Ni(c.latestValues))continue;nl(c.latestValues)&&c.updateSnapshot();const u=Nt(),h=c.measurePageBox();yn(u,h),dh(o,c.latestValues,c.snapshot?c.snapshot.layoutBox:void 0,u)}return Ni(this.latestValues)&&dh(o,this.latestValues),o}setTargetDelta(a){this.targetDelta=a,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(a){this.options={...this.options,...a,crossfade:a.crossfade!==void 0?a.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==Gt.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(a=!1){var o;const l=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=l.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=l.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=l.isSharedProjectionDirty);const c=!!this.resumingFrom||this!==l;if(!(a||c&&this.isSharedProjectionDirty||this.isProjectionDirty||(o=this.parent)!=null&&o.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:h,layoutId:d}=this.options;if(!this.layout||!(h||d))return;this.resolvedRelativeTargetAt=Gt.timestamp;const f=this.getClosestProjectingParent();f&&this.linkedParentVersion!==f.layoutVersion&&!f.options.layoutRoot&&this.removeRelativeTarget(),!this.targetDelta&&!this.relativeTarget&&(f&&f.layout?this.createRelativeTarget(f,this.layout.layoutBox,f.layout.layoutBox):this.removeRelativeTarget()),!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=Nt(),this.targetWithTransforms=Nt()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),fE(this.target,this.relativeTarget,this.relativeParent.target)):this.targetDelta?(this.resumingFrom?this.target=this.applyTransform(this.layout.layoutBox):yn(this.target,this.layout.layoutBox),Bp(this.target,this.targetDelta)):yn(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget&&(this.attemptToResolveRelativeTarget=!1,f&&!!f.resumingFrom==!!this.resumingFrom&&!f.options.layoutScroll&&f.target&&this.animationProgress!==1?this.createRelativeTarget(f,this.target,f.target):this.relativeParent=this.relativeTarget=void 0))}getClosestProjectingParent(){if(!(!this.parent||nl(this.parent.latestValues)||Op(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}createRelativeTarget(a,o,l){this.relativeParent=a,this.linkedParentVersion=a.layoutVersion,this.forceRelativeParentToResolveTarget(),this.relativeTarget=Nt(),this.relativeTargetOrigin=Nt(),ma(this.relativeTargetOrigin,o,l),yn(this.relativeTarget,this.relativeTargetOrigin)}removeRelativeTarget(){this.relativeParent=this.relativeTarget=void 0}calcProjection(){var a;const o=this.getLead(),l=!!this.resumingFrom||this!==o;let c=!0;if((this.isProjectionDirty||(a=this.parent)!=null&&a.isProjectionDirty)&&(c=!1),l&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(c=!1),this.resolvedRelativeTargetAt===Gt.timestamp&&(c=!1),c)return;const{layout:u,layoutId:h}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(u||h))return;yn(this.layoutCorrected,this.layout.layoutBox);const d=this.treeScale.x,f=this.treeScale.y;oE(this.layoutCorrected,this.treeScale,this.path,l),o.layout&&!o.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(o.target=o.layout.layoutBox,o.targetWithTransforms=Nt());const{target:g}=o;if(!g){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(th(this.prevProjectionDelta.x,this.projectionDelta.x),th(this.prevProjectionDelta.y,this.projectionDelta.y)),Ys(this.projectionDelta,this.layoutCorrected,g,this.latestValues),(this.treeScale.x!==d||this.treeScale.y!==f||!vh(this.projectionDelta.x,this.prevProjectionDelta.x)||!vh(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",g))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(a=!0){var o;if((o=this.options.visualElement)==null||o.scheduleRender(),a){const l=this.getStack();l&&l.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=ps(),this.projectionDelta=ps(),this.projectionDeltaWithTransform=ps()}setAnimationOrigin(a,o=!1){const l=this.snapshot,c=l?l.latestValues:{},u={...this.latestValues},h=ps();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!o;const d=Nt(),f=l?l.source:void 0,g=this.layout?this.layout.source:void 0,v=f!==g,m=this.getStack(),p=!m||m.members.length<=1,M=!!(v&&!p&&this.options.crossfade===!0&&!this.path.some(IE));this.animationProgress=0;let y;this.mixTargetDelta=S=>{const E=S/1e3;Mh(h.x,a.x,E),Mh(h.y,a.y,E),this.setTargetDelta(h),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(ma(d,this.layout.layoutBox,this.relativeParent.layout.layoutBox),DE(this.relativeTarget,this.relativeTargetOrigin,d,E),y&&vE(this.relativeTarget,y)&&(this.isProjectionDirty=!1),y||(y=Nt()),yn(y,this.relativeTarget)),v&&(this.animationValues=u,sE(u,c,this.latestValues,E,M,p)),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=E},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(a){var o,l,c;this.notifyListeners("animationStart"),(o=this.currentAnimation)==null||o.stop(),(c=(l=this.resumingFrom)==null?void 0:l.currentAnimation)==null||c.stop(),this.pendingAnimation&&(oi(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=_t.update(()=>{Jr.hasAnimatedSinceResize=!0,this.motionValue||(this.motionValue=_s(0)),this.currentAnimation=Pp(this.motionValue,[0,1e3],{...a,velocity:0,isSync:!0,onUpdate:u=>{this.mixTargetDelta(u),a.onUpdate&&a.onUpdate(u)},onStop:()=>{},onComplete:()=>{a.onComplete&&a.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const a=this.getStack();a&&a.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(yE),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const a=this.getLead();let{targetWithTransforms:o,target:l,layout:c,latestValues:u}=a;if(!(!o||!l||!c)){if(this!==a&&this.layout&&c&&$p(this.options.animationType,this.layout.layoutBox,c.layoutBox)){l=this.target||Nt();const h=xn(this.layout.layoutBox.x);l.x.min=a.target.x.min,l.x.max=l.x.min+h;const d=xn(this.layout.layoutBox.y);l.y.min=a.target.y.min,l.y.max=l.y.min+d}yn(o,l),ms(o,u),Ys(this.projectionDeltaWithTransform,this.layoutCorrected,o,u)}}registerSharedNode(a,o){this.sharedNodes.has(a)||this.sharedNodes.set(a,new _E),this.sharedNodes.get(a).add(o);const c=o.options.initialPromotionConfig;o.promote({transition:c?c.transition:void 0,preserveFollowOpacity:c&&c.shouldPreserveFollowOpacity?c.shouldPreserveFollowOpacity(o):void 0})}isLead(){const a=this.getStack();return a?a.lead===this:!0}getLead(){var a;const{layoutId:o}=this.options;return o?((a=this.getStack())==null?void 0:a.lead)||this:this}getPrevLead(){var a;const{layoutId:o}=this.options;return o?(a=this.getStack())==null?void 0:a.prevLead:void 0}getStack(){const{layoutId:a}=this.options;if(a)return this.root.sharedNodes.get(a)}promote({needsReset:a,transition:o,preserveFollowOpacity:l}={}){const c=this.getStack();c&&c.promote(this,l),a&&(this.projectionDelta=void 0,this.needsReset=!0),o&&this.setOptions({transition:o})}relegate(){const a=this.getStack();return a?a.relegate(this):!1}resetSkewAndRotation(){const{visualElement:a}=this.options;if(!a)return;let o=!1;const{latestValues:l}=a;if((l.z||l.rotate||l.rotateX||l.rotateY||l.rotateZ||l.skewX||l.skewY)&&(o=!0),!o)return;const c={};l.z&&ja("z",a,c,this.animationValues);for(let u=0;u<Ya.length;u++)ja(`rotate${Ya[u]}`,a,c,this.animationValues),ja(`skew${Ya[u]}`,a,c,this.animationValues);a.render();for(const u in c)a.setStaticValue(u,c[u]),this.animationValues&&(this.animationValues[u]=c[u]);a.scheduleRender()}applyProjectionStyles(a,o){if(!this.instance||this.isSVG)return;if(!this.isVisible){a.visibility="hidden";return}const l=this.getTransformTemplate();if(this.needsReset){this.needsReset=!1,a.visibility="",a.opacity="",a.pointerEvents=Xa(o==null?void 0:o.pointerEvents)||"",a.transform=l?l(this.latestValues,""):"none";return}const c=this.getLead();if(!this.projectionDelta||!this.layout||!c.target){this.options.layoutId&&(a.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,a.pointerEvents=Xa(o==null?void 0:o.pointerEvents)||""),this.hasProjected&&!Ni(this.latestValues)&&(a.transform=l?l({},""):"none",this.hasProjected=!1);return}a.visibility="";const u=c.animationValues||c.latestValues;this.applyTransformsToTarget();let h=xE(this.projectionDeltaWithTransform,this.treeScale,u);l&&(h=l(u,h)),a.transform=h;const{x:d,y:f}=this.projectionDelta;a.transformOrigin=`${d.origin*100}% ${f.origin*100}% 0`,c.animationValues?a.opacity=c===this?u.opacity??this.latestValues.opacity??1:this.preserveOpacity?this.latestValues.opacity:u.opacityExit:a.opacity=c===this?u.opacity!==void 0?u.opacity:"":u.opacityExit!==void 0?u.opacityExit:0;for(const g in er){if(u[g]===void 0)continue;const{correct:v,applyTo:m,isCSSVariable:p}=er[g],M=h==="none"?u[g]:v(u[g],c);if(m){const y=m.length;for(let S=0;S<y;S++)a[m[S]]=M}else p?this.options.visualElement.renderState.vars[g]=M:a[g]=M}this.options.layoutId&&(a.pointerEvents=c===this?Xa(o==null?void 0:o.pointerEvents)||"":"none")}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(a=>{var o;return(o=a.currentAnimation)==null?void 0:o.stop()}),this.root.nodes.forEach(xh),this.root.sharedNodes.clear()}}}function ME(n){n.updateLayout()}function bE(n){var e;const t=((e=n.resumeFrom)==null?void 0:e.snapshot)||n.snapshot;if(n.isLead()&&n.layout&&t&&n.hasListeners("didUpdate")){const{layoutBox:i,measuredBox:s}=n.layout,{animationType:r}=n.options,a=t.source!==n.layout.source;r==="size"?_h(h=>{const d=a?t.measuredBox[h]:t.layoutBox[h],f=xn(d);d.min=i[h].min,d.max=d.min+f}):$p(r,t.layoutBox,i)&&_h(h=>{const d=a?t.measuredBox[h]:t.layoutBox[h],f=xn(i[h]);d.max=d.min+f,n.relativeTarget&&!n.currentAnimation&&(n.isProjectionDirty=!0,n.relativeTarget[h].max=n.relativeTarget[h].min+f)});const o=ps();Ys(o,i,t.layoutBox);const l=ps();a?Ys(l,n.applyTransform(s,!0),t.measuredBox):Ys(l,i,t.layoutBox);const c=!zp(o);let u=!1;if(!n.resumeFrom){const h=n.getClosestProjectingParent();if(h&&!h.resumeFrom){const{snapshot:d,layout:f}=h;if(d&&f){const g=Nt();ma(g,t.layoutBox,d.layoutBox);const v=Nt();ma(v,i,f.layoutBox),Gp(g,v)||(u=!0),h.options.layoutRoot&&(n.relativeTarget=v,n.relativeTargetOrigin=g,n.relativeParent=h)}}}n.notifyListeners("didUpdate",{layout:i,snapshot:t,delta:l,layoutDelta:o,hasLayoutChanged:c,hasRelativeLayoutChanged:u})}else if(n.isLead()){const{onExitComplete:i}=n.options;i&&i()}n.options.transition=void 0}function EE(n){n.parent&&(n.isProjecting()||(n.isProjectionDirty=n.parent.isProjectionDirty),n.isSharedProjectionDirty||(n.isSharedProjectionDirty=!!(n.isProjectionDirty||n.parent.isProjectionDirty||n.parent.isSharedProjectionDirty)),n.isTransformDirty||(n.isTransformDirty=n.parent.isTransformDirty))}function TE(n){n.isProjectionDirty=n.isSharedProjectionDirty=n.isTransformDirty=!1}function AE(n){n.clearSnapshot()}function xh(n){n.clearMeasurements()}function yh(n){n.isLayoutDirty=!1}function wE(n){const{visualElement:e}=n.options;e&&e.getProps().onBeforeLayoutMeasure&&e.notify("BeforeLayoutMeasure"),n.resetTransform()}function Sh(n){n.finishAnimation(),n.targetDelta=n.relativeTarget=n.target=void 0,n.isProjectionDirty=!0}function CE(n){n.resolveTargetDelta()}function RE(n){n.calcProjection()}function PE(n){n.resetSkewAndRotation()}function LE(n){n.removeLeadSnapshot()}function Mh(n,e,t){n.translate=bt(e.translate,0,t),n.scale=bt(e.scale,1,t),n.origin=e.origin,n.originPoint=e.originPoint}function bh(n,e,t,i){n.min=bt(e.min,t.min,i),n.max=bt(e.max,t.max,i)}function DE(n,e,t,i){bh(n.x,e.x,t.x,i),bh(n.y,e.y,t.y,i)}function IE(n){return n.animationValues&&n.animationValues.opacityExit!==void 0}const FE={duration:.45,ease:[.4,0,.1,1]},Eh=n=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(n),Th=Eh("applewebkit/")&&!Eh("chrome/")?Math.round:rn;function Ah(n){n.min=Th(n.min),n.max=Th(n.max)}function UE(n){Ah(n.x),Ah(n.y)}function $p(n,e,t){return n==="position"||n==="preserve-aspect"&&!dE(gh(e),gh(t),.2)}function NE(n){var e;return n!==n.root&&((e=n.scroll)==null?void 0:e.wasRoot)}function OE(n,e,t,i={passive:!0}){return n.addEventListener(e,t,i),()=>n.removeEventListener(e,t)}const BE=Wp({attachResizeListener:(n,e)=>OE(n,"resize",e),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}),checkIsScrollRoot:()=>!0}),Ka={current:void 0},VE=Wp({measureScroll:n=>({x:n.scrollLeft,y:n.scrollTop}),defaultParent:()=>{if(!Ka.current){const n=new BE({});n.mount(window),n.setOptions({layoutScroll:!0}),Ka.current=n}return Ka.current},resetTransform:(n,e)=>{n.style.transform=e!==void 0?e:"none"},checkIsScrollRoot:n=>window.getComputedStyle(n).position==="fixed"});function Xp(n){if(n)return n.options.allowProjection!==!1?n.projection:Xp(n.parent)}const qp={borderRadius:{...On,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:On,borderTopRightRadius:On,borderBottomLeftRadius:On,borderBottomRightRadius:On,boxShadow:Rf};function Gs(n){return typeof n=="object"&&n!==null&&"nodeType"in n}class kE extends di{constructor(e){super(e),Lf(qp)}initProjection(){const e=this.state.options;this.state.visualElement.projection=new VE(this.state.visualElement.latestValues,e["data-framer-portal-id"]?void 0:Xp(this.state.visualElement.parent)),this.state.visualElement.projection.isPresent=!0,this.setOptions()}beforeMount(){this.initProjection()}setOptions(){const e=this.state.options,{layoutId:t,layout:i,drag:s=!1,dragConstraints:r=!1}=e;this.state.visualElement.projection.setOptions({layout:i,layoutId:t,alwaysMeasureLayout:!!t||!!s||r&&Gs(r),visualElement:this.state.visualElement,animationType:typeof e.layout=="string"?e.layout:"both",layoutRoot:e.layoutRoot,layoutScroll:e.layoutScroll,crossfade:e.crossfade,onExitComplete:()=>{var a,o;!((a=this.state.visualElement.projection)!=null&&a.isPresent)&&this.state.options.layoutId&&!this.state.isExiting&&((o=this.state.options.animatePresenceContext)==null||o.onMotionExitComplete(this.state.presenceContainer,this.state))}})}update(){this.setOptions()}mount(){var e;(e=this.state.visualElement.projection)==null||e.mount(this.state.element)}}function Yp(n){return n.pointerType==="mouse"?typeof n.button!="number"||n.button<=0:n.isPrimary!==!1}function Fc(n,e="page"){return{point:{x:n[`${e}X`],y:n[`${e}Y`]}}}function zE(n){return e=>Yp(e)&&n(e,Fc(e))}function js(n,e,t,i){return fa(n,e,zE(t),i)}function jp(n){let e=null;return()=>{const t=()=>{e=null};return e===null?(e=n,t):!1}}const wh=jp("dragHorizontal"),Ch=jp("dragVertical");function GE(n){let e=!1;if(n==="y")e=Ch();else if(n==="x")e=wh();else{const t=wh(),i=Ch();t&&i?e=()=>{t(),i()}:(t&&t(),i&&i())}return e}function sl(n){return n.max-n.min}function HE(n,{min:e,max:t},i){return e!==void 0&&n<e?n=i?bt(e,n,i.min):Math.max(n,e):t!==void 0&&n>t&&(n=i?bt(t,n,i.max):Math.min(n,t)),n}const rl=.35;function WE(n,{top:e,left:t,bottom:i,right:s}){return{x:Rh(n.x,t,s),y:Rh(n.y,e,i)}}function Rh(n,e,t){return{min:e!==void 0?n.min+e:void 0,max:t!==void 0?n.max+t-(n.max-n.min):void 0}}function $E(n=rl){return n===!1?n=0:n===!0&&(n=rl),{x:Ph(n,"left","right"),y:Ph(n,"top","bottom")}}function Ph(n,e,t){return{min:Lh(n,e),max:Lh(n,t)}}function Lh(n,e){return typeof n=="number"?n:n[e]||0}function XE(n,e){const t={};return e.min!==void 0&&(t.min=e.min-n.min),e.max!==void 0&&(t.max=e.max-n.min),t}function qE(n,e){return{x:Dh(n.x,e.x),y:Dh(n.y,e.y)}}function Dh(n,e){let t=e.min-n.min,i=e.max-n.max;return e.max-e.min<n.max-n.min&&([t,i]=[i,t]),{min:t,max:i}}function YE(n,e){let t=.5;const i=sl(n),s=sl(e);return s>i?t=xs(e.min,e.max-i,n.min):i>s&&(t=xs(n.min,n.max-s,e.min)),$n(0,1,t)}const Ih=(n,e)=>Math.abs(n-e);function jE(n,e){const t=Ih(n.x,e.x),i=Ih(n.y,e.y);return Math.sqrt(t**2+i**2)}const Fh=new Set(["auto","scroll"]);class Kp{constructor(e,t,{transformPagePoint:i,contextWindow:s,dragSnapToOrigin:r=!1,element:a}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.scrollPositions=new Map,this.onElementScroll=d=>{this.handleScroll(d.target)},this.onWindowScroll=()=>{this.handleScroll(window)},this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const d=Ja(this.lastMoveEventInfo,this.history),f=this.startEvent!==null,g=jE(d.offset,{x:0,y:0})>=3;if(!f&&!g)return;const{point:v}=d,{timestamp:m}=Gt;this.history.push({...v,timestamp:m});const{onStart:p,onMove:M}=this.handlers;f||(p&&p(this.lastMoveEvent,d),this.startEvent=this.lastMoveEvent),M&&M(this.lastMoveEvent,d)},this.handlePointerMove=(d,f)=>{this.lastMoveEvent=d,this.lastMoveEventInfo=Za(f,this.transformPagePoint),_t.update(this.updatePoint,!0)},this.handlePointerUp=(d,f)=>{this.end();const{onEnd:g,onSessionEnd:v,resumeAnimation:m}=this.handlers;if((this.dragSnapToOrigin||!this.startEvent)&&m&&m(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const p=Ja(d.type==="pointercancel"?this.lastMoveEventInfo:Za(f,this.transformPagePoint),this.history);this.startEvent&&g&&g(d,p),v&&v(d,p)},!Yp(e))return;this.dragSnapToOrigin=r,this.handlers=t,this.transformPagePoint=i,this.contextWindow=s||window;const o=Fc(e),l=Za(o,this.transformPagePoint),{point:c}=l,{timestamp:u}=Gt;this.history=[{...c,timestamp:u}];const{onSessionStart:h}=t;h&&h(e,Ja(l,this.history)),this.removeListeners=dr(js(this.contextWindow,"pointermove",this.handlePointerMove),js(this.contextWindow,"pointerup",this.handlePointerUp),js(this.contextWindow,"pointercancel",this.handlePointerUp)),a&&this.startScrollTracking(a)}isScrollable(e){const t=window.getComputedStyle(e);return t.overflow==="auto"||t.overflow==="scroll"||t.overflowX==="auto"||t.overflowX==="scroll"||t.overflowY==="auto"||t.overflowY==="scroll"}startScrollTracking(e){let t=e.parentElement;for(;t;){const i=getComputedStyle(t);(Fh.has(i.overflowX)||Fh.has(i.overflowY))&&this.scrollPositions.set(t,{x:t.scrollLeft,y:t.scrollTop}),t=t.parentElement}this.scrollPositions.set(window,{x:window.scrollX,y:window.scrollY}),window.addEventListener("scroll",this.onElementScroll,{capture:!0,passive:!0}),window.addEventListener("scroll",this.onWindowScroll,{passive:!0}),this.removeScrollListeners=()=>{window.removeEventListener("scroll",this.onElementScroll,{capture:!0}),window.removeEventListener("scroll",this.onWindowScroll)}}handleScroll(e){const t=this.scrollPositions.get(e);if(!t)return;const i=e===window,s=i?{x:window.scrollX,y:window.scrollY}:{x:e.scrollLeft,y:e.scrollTop},r={x:s.x-t.x,y:s.y-t.y};r.x===0&&r.y===0||(i?this.lastMoveEventInfo&&(this.lastMoveEventInfo.point.x+=r.x,this.lastMoveEventInfo.point.y+=r.y):this.history.length>0&&(this.history[0].x-=r.x,this.history[0].y-=r.y),this.scrollPositions.set(e,s),_t.update(this.updatePoint,!0))}updateHandlers(e){this.handlers=e}end(){var e;this.removeListeners&&this.removeListeners(),(e=this.removeScrollListeners)==null||e.call(this),this.scrollPositions.clear(),oi(this.updatePoint)}}function Za(n,e){return e?{point:e(n.point)}:n}function Uh(n,e){return{x:n.x-e.x,y:n.y-e.y}}function Ja({point:n},e){return{point:n,delta:Uh(n,Zp(e)),offset:Uh(n,KE(e)),velocity:ZE(e,.1)}}function KE(n){return n[0]}function Zp(n){return n[n.length-1]}function ZE(n,e){if(n.length<2)return{x:0,y:0};let t=n.length-1,i=null;const s=Zp(n);for(;t>=0&&(i=n[t],!(s.timestamp-i.timestamp>Cn(e)));)t--;if(!i)return{x:0,y:0};const r=_n(s.timestamp-i.timestamp);if(r===0)return{x:0,y:0};const a={x:(s.x-i.x)/r,y:(s.y-i.y)/r};return a.x===1/0&&(a.x=0),a.y===1/0&&(a.y=0),a}const Nh=()=>({min:0,max:0});function JE(){return{x:Nh(),y:Nh()}}function Fn(n){return[n("x"),n("y")]}function QE(n){return!!(Ft(n)&&n.add)}function Oh(n,e){const t=n.getValue("willChange");if(QE(t))return t.add(e)}function Jp({top:n,left:e,right:t,bottom:i}){return{x:{min:e,max:t},y:{min:n,max:i}}}function e1(n,e){if(!e)return n;const t=e({x:n.left,y:n.top}),i=e({x:n.right,y:n.bottom});return{top:t.y,left:t.x,bottom:i.y,right:i.x}}function t1({x:n,y:e}){return{top:e.min,right:n.max,bottom:e.max,left:n.min}}function Bh(n,e){n.min=n.min+e,n.max=n.max+e}function n1(n,e){return Jp(e1(n.getBoundingClientRect(),e))}function i1(n,e,t){const i=n1(n,t),{scroll:s}=e;return s&&(Bh(i.x,s.offset.x),Bh(i.y,s.offset.y)),i}function s1(n){var e;return(e=n.projection)==null?void 0:e.isPresent}function Qp({current:n}){return n?n.ownerDocument.defaultView:null}const r1=new WeakMap;class a1{constructor(e){this.openGlobalLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=JE(),this.visualElement=e}start(e,{snapToCursor:t=!1}={}){const i=c=>{t?this.stopAnimation():this.pauseAnimation(),t&&this.snapToCursor(Fc(c,"page").point)},s=(c,u)=>{this.stopAnimation();const{drag:h,dragPropagation:d,onDragStart:f}=this.getProps();if(h&&!d&&(this.openGlobalLock&&this.openGlobalLock(),this.openGlobalLock=GE(h),!this.openGlobalLock))return;this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),Fn(v=>{let m=this.getAxisMotionValue(v).get()||0;if(zn.test(m)){const{projection:p}=this.visualElement;if(p&&p.layout){const M=p.layout.layoutBox[v];M&&(m=sl(M)*(parseFloat(m)/100))}}this.originPoint[v]=m}),f&&_t.postRender(()=>f(c,u)),Oh(this.visualElement,"transform"),this.visualElement.state.setActive("whileDrag",!0)},r=(c,u)=>{const{dragPropagation:h,dragDirectionLock:d,onDirectionLock:f,onDrag:g}=this.getProps();if(!h&&!this.openGlobalLock)return;const{offset:v}=u;if(d&&this.currentDirection===null){this.currentDirection=o1(v),this.currentDirection!==null&&f&&f(this.currentDirection);return}this.updateAxis("x",u.point,v),this.updateAxis("y",u.point,v),this.visualElement.render(),g&&g(c,u)},a=(c,u)=>this.stop(c,u),o=()=>Fn(c=>{var u;return this.getAnimationState(c)==="paused"&&((u=this.getAxisMotionValue(c).animation)==null?void 0:u.play())}),{dragSnapToOrigin:l}=this.getProps();this.panSession=new Kp(e,{onSessionStart:i,onStart:s,onMove:r,onSessionEnd:a,resumeAnimation:o},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:l,contextWindow:Qp(this.visualElement),element:this.visualElement.current})}stop(e,t){const i=this.isDragging;if(this.cancel(),!i)return;const{velocity:s}=t;this.startAnimation(s);const{onDragEnd:r}=this.getProps();r&&_t.postRender(()=>r(e,t))}cancel(){this.isDragging=!1;const{projection:e,animationState:t}=this.visualElement;e&&(e.isAnimationBlocked=!1),this.panSession&&this.panSession.end(),this.panSession=void 0;const{dragPropagation:i}=this.getProps();!i&&this.openGlobalLock&&(this.openGlobalLock(),this.openGlobalLock=null),this.visualElement.state.setActive("whileDrag",!1)}updateAxis(e,t,i){const{drag:s}=this.getProps();if(!i||!Tr(e,s,this.currentDirection))return;const r=this.getAxisMotionValue(e);let a=this.originPoint[e]+i[e];this.constraints&&this.constraints[e]&&(a=HE(a,this.constraints[e],this.elastic[e])),r.set(a)}resolveConstraints(){var e;const{dragConstraints:t,dragElastic:i}=this.getProps(),s=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(e=this.visualElement.projection)==null?void 0:e.layout,r=this.constraints;t&&Gs(t)?this.constraints||(this.constraints=this.resolveRefConstraints()):t&&s?this.constraints=WE(s.layoutBox,t):this.constraints=!1,this.elastic=$E(i),r!==this.constraints&&s&&this.constraints&&!this.hasMutatedConstraints&&Fn(a=>{this.constraints!==!1&&this.getAxisMotionValue(a)&&(this.constraints[a]=XE(s.layoutBox[a],this.constraints[a]))})}resolveRefConstraints(){const{dragConstraints:e,onMeasureDragConstraints:t}=this.getProps();if(!e||!Gs(e))return!1;const i=e,{projection:s}=this.visualElement;if(!s||!s.layout)return!1;const r=i1(i,s.root,this.visualElement.getTransformPagePoint());let a=qE(s.layout.layoutBox,r);if(t){const o=t(t1(a));this.hasMutatedConstraints=!!o,o&&(a=Jp(o))}return a}startAnimation(e){const{drag:t,dragMomentum:i,dragElastic:s,dragTransition:r,dragSnapToOrigin:a,onDragTransitionEnd:o}=this.getProps(),l=this.constraints||{},c=Fn(u=>{if(!Tr(u,t,this.currentDirection))return;let h=l&&l[u]||{};a&&(h={min:0,max:0});const d=s?200:1e6,f=s?40:1e7,g={type:"inertia",velocity:i?e[u]:0,bounceStiffness:d,bounceDamping:f,timeConstant:750,restDelta:1,restSpeed:10,...r,...h};return this.startAxisValueAnimation(u,g)});return Promise.all(c).then(o)}startAxisValueAnimation(e,t){const i=this.getAxisMotionValue(e);return Oh(this.visualElement,e),i.start(Dc(e,i,0,t,this.visualElement,!1))}stopAnimation(){s1(this.visualElement)&&Fn(e=>this.getAxisMotionValue(e).stop())}pauseAnimation(){Fn(e=>{var t;return(t=this.getAxisMotionValue(e).animation)==null?void 0:t.pause()})}getAnimationState(e){var t;return(t=this.getAxisMotionValue(e).animation)==null?void 0:t.state}getAxisMotionValue(e){const t=`_drag${e.toUpperCase()}`,i=this.visualElement.getProps();return i[t]||this.visualElement.getValue(e,(i.initial?i.initial[e]:void 0)||0)}snapToCursor(e){Fn(t=>{const{drag:i}=this.getProps();if(!Tr(t,i,this.currentDirection))return;const{projection:s}=this.visualElement,r=this.getAxisMotionValue(t);if(s&&s.layout){const{min:a,max:o}=s.layout.layoutBox[t];r.set(e[t]-bt(a,o,.5))}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:e,dragConstraints:t}=this.getProps(),{projection:i}=this.visualElement;if(!Gs(t)||!i||!this.constraints)return;this.stopAnimation();const s={x:0,y:0};Fn(a=>{const o=this.getAxisMotionValue(a);if(o&&this.constraints!==!1){const l=o.get();s[a]=YE({min:l,max:l},this.constraints[a])}});const{transformTemplate:r}=this.visualElement.getProps();this.visualElement.current.style.transform=r?r({},""):"none",i.root&&i.root.updateScroll(),i.updateLayout(),this.resolveConstraints(),Fn(a=>{if(!Tr(a,e,null))return;const o=this.getAxisMotionValue(a),{min:l,max:c}=this.constraints[a];o.set(bt(l,c,s[a]))})}addListeners(){if(!this.visualElement.current)return;r1.set(this.visualElement,this);const e=this.visualElement.current,t=js(e,"pointerdown",l=>{const{drag:c,dragListener:u=!0}=this.getProps();c&&u&&this.start(l)}),i=()=>{const{dragConstraints:l}=this.getProps();Gs(l)&&(this.constraints=this.resolveRefConstraints())},{projection:s}=this.visualElement,r=s.addEventListener("measure",i);s&&!s.layout&&(s.root&&s.root.updateScroll(),s.updateLayout()),_t.read(i);const a=fa(window,"resize",()=>this.scalePositionWithinConstraints()),o=s.addEventListener("didUpdate",({delta:l,hasLayoutChanged:c})=>{this.isDragging&&c&&(Fn(u=>{const h=this.getAxisMotionValue(u);h&&(this.originPoint[u]+=l[u].translate,h.set(h.get()+l[u].translate))}),this.visualElement.render())});return()=>{a(),t(),r(),o&&o()}}getProps(){const e=this.visualElement.getProps(),{drag:t=!1,dragDirectionLock:i=!1,dragPropagation:s=!1,dragConstraints:r=!1,dragElastic:a=rl,dragMomentum:o=!0}=e;return{...e,drag:t,dragDirectionLock:i,dragPropagation:s,dragConstraints:r,dragElastic:a,dragMomentum:o}}}function Tr(n,e,t){return(e===!0||e===n)&&(t===null||t===n)}function o1(n,e=10){let t=null;return Math.abs(n.y)>e?t="y":Math.abs(n.x)>e&&(t="x"),t}class l1 extends di{constructor(e){super(e),this.removeGroupControls=rn,this.removeListeners=rn,this.controls=new a1(e.visualElement)}mount(){const{dragControls:e}=this.state.options;e&&(this.removeGroupControls=e.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||rn}unmount(){this.removeGroupControls(),this.removeListeners()}}let Ds=!1;class c1 extends di{constructor(e){super(e),Lf(qp),e.getSnapshot=this.getSnapshot.bind(this),e.didUpdate=this.didUpdate.bind(this)}beforeUpdate(e){this.getSnapshot(e,void 0)}update(){this.didUpdate()}didUpdate(){var e,t;Ds&&(this.state.options.layout||this.state.options.layoutId||this.state.options.drag)&&(Ds=!1,(t=(e=this.state.visualElement.projection)==null?void 0:e.root)==null||t.didUpdate())}mount(){var e;const t=this.state.options,i=this.state.options.layoutGroup;if(t.layout||t.layoutId){const s=this.state.visualElement.projection;if(s){s.promote();const r=s.getStack();r!=null&&r.prevLead&&!r.prevLead.snapshot&&(r.prevLead.willUpdate(),Ds=!0),(e=i==null?void 0:i.group)==null||e.add(s)}Jr.hasEverUpdated=!0}this.didUpdate()}beforeUnmount(){this.getSnapshot(this.state.options,!1)}unmount(){const e=this.state.options.layoutGroup,t=this.state.visualElement.projection;t&&(e!=null&&e.group&&(this.state.options.layout||this.state.options.layoutId)&&e.group.remove(t),this.state.options.layoutId&&(Ds=!0),this.didUpdate())}getSnapshot(e,t){const i=this.state.visualElement.projection,{drag:s,layoutDependency:r,layout:a,layoutId:o}=e;if(!i||!a&&!o&&!s)return;Ds=!0;const l=this.state.options;(s||l.layoutDependency!==r||r===void 0||oa(t)&&i.isPresent!==t)&&i.willUpdate(),oa(t)&&t!==i.isPresent&&(i.isPresent=t,t?i.promote():i.relegate())}}function Vh(n){return(e,t)=>{n&&_t.postRender(()=>n(e,t))}}class u1 extends di{constructor(){super(...arguments),this.removePointerDownListener=rn}onPointerDown(e){this.session=new Kp(e,this.createPanHandlers(),{transformPagePoint:this.state.visualElement.getTransformPagePoint(),contextWindow:Qp(this.state.visualElement)})}createPanHandlers(){return{onSessionStart:Vh((e,t)=>{const{onPanSessionStart:i}=this.state.options;i&&i(e,t)}),onStart:Vh((e,t)=>{const{onPanStart:i}=this.state.options;i&&i(e,t)}),onMove:(e,t)=>{const{onPan:i}=this.state.options;i&&i(e,t)},onEnd:(e,t)=>{const{onPanEnd:i}=this.state.options;delete this.session,i&&_t.postRender(()=>i(e,t))}}}mount(){this.removePointerDownListener=js(this.state.element,"pointerdown",this.onPointerDown.bind(this))}update(){}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}const h1=[Bb,qb,jb,Jb,eE,kE,u1,l1,c1],d1={reducedMotion:"never",transition:void 0,nonce:void 0},[f1]=ur("MotionConfig");function em(){return f1(Ae(()=>d1))}let p1=0;function m1(n){const e=new WeakMap,t=em();function i(r){if(n.mode!=="popLayout")return;const a=r.offsetParent,o=a instanceof HTMLElement&&a.offsetWidth||0,l={height:r.offsetHeight||0,width:r.offsetWidth||0,top:r.offsetTop,left:r.offsetLeft,right:0};l.right=o-l.width-l.left;const c=n.anchorX==="left"?`left: ${l.left}px`:`right: ${l.right}px`,u=`pop-${p1++}`;r.dataset.motionPopId=u;const h=document.createElement("style");t.value.nonce&&(h.nonce=t.value.nonce),e.set(r,h),document.head.appendChild(h),h.sheet&&h.sheet.insertRule(`
    [data-motion-pop-id="${u}"] {
      position: absolute !important;
      width: ${l.width}px !important;
      height: ${l.height}px !important;
      top: ${l.top}px !important;
      ${c} !important;
      }
      `)}function s(r){const a=e.get(r);a&&(e.delete(r),_t.render(()=>{document.head.removeChild(a)}))}return{addPopStyle:i,removePopStyle:s}}const al="data-ap-child",[g1,v1]=ur("AnimatePresenceContext");function _1(n){const e=new Map,t=new Set,{addPopStyle:i,removePopStyle:s}=m1(n);function r(g,v){let m=e.get(g);m||(m={motions:new Set,exitingMotions:new Set,el:g},e.set(g,m)),m.motions.add(v)}function a(g,v){const m=e.get(g);m&&(m.exitingMotions.delete(v),m.exitingMotions.size===0&&m.done&&h(m))}function o(g){t.add(g)}function l(g){t.delete(g)}const c={initial:n.initial,custom:n.custom,register:r,onMotionExitComplete:a,registerPending:o,unregisterPending:l};on(()=>n.custom,g=>{c.custom=g},{flush:"pre"}),v1(c),qt(()=>{c.initial=void 0});function u(g){if(g instanceof HTMLElement&&!g.hasAttribute(al)){g.setAttribute(al,"");const v=la.get(g);v&&!v.presenceContainer&&(v.presenceContainer=g,r(g,v))}}function h(g){var v,m,p,M,y;s(g.el),g.motions.forEach(S=>{S.getSnapshot(S.options,!1)}),(v=g.done)==null||v.call(g),g.done=void 0,(m=g.el)!=null&&m.isConnected?(M=(p=g.motions.values().next())==null?void 0:p.value)==null||M.didUpdate():(g.motions.forEach(S=>{S.unmount()}),g.motions.clear()),(y=n.onExitComplete)==null||y.call(n)}function d(g,v){u(g);const m=e.get(g);m&&(m.exitingMotions.clear(),m.motions.forEach(p=>{p.setActive("exit",!1),p.getSnapshot(p.options,!0)})),v()}function f(g,v){var m,p,M;const y=g;u(y),t.forEach(T=>{T.element&&y.contains(T.element)&&(T.presenceContainer=y,r(y,T),t.delete(T))});const S=e.get(y),E=la.get(y);if((!S||S.motions.size===0)&&!E){v(),(m=n.onExitComplete)==null||m.call(n);return}S.done=v,i(y),S.motions.forEach(T=>{S.exitingMotions.add(T),T.setActive("exit",!0),T.getSnapshot(T.options,!1)}),(M=(p=S.motions.values().next())==null?void 0:p.value)==null||M.didUpdate()}return hi(()=>{e.forEach(g=>{g.motions.forEach(v=>{v.unmount()})}),e.clear()}),{enter:d,exit:f}}const x1=Ee({name:"AnimatePresence",inheritAttrs:!0,__name:"AnimatePresence",props:{mode:{default:"sync"},initial:{type:Boolean,default:!0},as:{},custom:{},onExitComplete:{},anchorX:{default:"left"}},setup(n){const e=n,{enter:t,exit:i}=_1(e),s=Ae(()=>e.mode!=="wait"?{tag:e.as}:{mode:e.mode==="wait"?"out-in":void 0});return(r,a)=>(I(),ve(Zt(r.mode==="wait"?ar:lg),wn(s.value,{appear:"",onLeave:L(i),onEnter:L(t)}),{default:z(()=>[V(r.$slots,"default")]),_:3},16,["onLeave","onEnter"]))}});function ga(n){if(n)return n.nodeType===3||n.nodeType===8?ga(n.nextSibling):n}const[y1]=ur("LazyMotionContext");function S1(n){const e=Cy(null),t=Py({}),i=em(),s=g1({}),r=y1({features:Ve([]),strict:!1}),a=cg();function o(){return t.id&&n.layoutId?`${t.id}-${n.layoutId}`:n.layoutId||void 0}function l(){return{...n,lazyMotionContext:r,layoutId:o(),transition:n.transition??i.value.transition,layoutGroup:t,motionConfig:i.value,inViewOptions:n.inViewOptions??i.value.inViewOptions,animatePresenceContext:s,initial:s.initial===!1?s.initial:n.initial===!0?void 0:n.initial}}function c(){return{...a,...l()}}const u=new ky(c(),e);Ry(u);function h(){var f;const g=u.type==="svg",v={...a};Object.keys(a).forEach(M=>{Ft(a[M])&&(v[M]=a[M].get())});let m={...n.style,...g?{}:((f=u.visualElement)==null?void 0:f.latestValues)||u.baseTarget};if(g){const{attrs:M,style:y}=eS({...u.isMounted()?u.target:u.baseTarget,...m});(y.transform||M.transformOrigin)&&(y.transformOrigin=M.transformOrigin??"50% 50%",delete M.transformOrigin),y.transform&&(y.transformBox=y.transformBox??"fill-box",delete M.transformBox),Object.assign(v,M),m=y}n.drag&&n.dragListener!==!1&&Object.assign(m,{userSelect:"none",WebkitUserSelect:"none",WebkitTouchCallout:"none",touchAction:n.drag===!0?"none":`pan-${n.drag==="x"?"y":"x"}`});const p=Ky(m);return p&&(v.style=p),v}const d=ug().proxy;return hg(()=>{u.beforeMount()}),qt(()=>{if(u.mount(ga(d.$el),c(),b1(d)),s.register&&u.element){const f=u.element.closest(`[${al}]`);f?(u.presenceContainer=f,s.register(f,u)):s.registerPending&&s.registerPending(u)}}),Aa(()=>u.beforeUnmount()),hi(()=>{s.unregisterPending&&s.unregisterPending(u);const f=ga(d.$el);f!=null&&f.isConnected||u.unmount()}),dg(()=>{u.beforeUpdate(c())}),Zd(()=>{u.update(c())}),{getProps:l,getAttrs:h,layoutGroup:t,state:u}}const M1={ignoreStrict:{type:Boolean},forwardMotionProps:{type:Boolean,default:!1},asChild:{type:Boolean,default:!1},hover:{type:[String,Array,Object]},press:{type:[String,Array,Object]},inView:{type:[String,Array,Object]},focus:{type:[String,Array,Object]},whileDrag:{type:[String,Array,Object]},whileHover:{type:[String,Array,Object],default:({hover:n})=>n},whilePress:{type:[String,Array,Object],default:({press:n})=>n},whileInView:{type:[String,Array,Object],default:({inView:n})=>n},whileFocus:{type:[String,Array,Object],default:({focus:n})=>n},custom:{type:[String,Number,Object,Array]},initial:{type:[String,Array,Object,Boolean],default:void 0},animate:{type:[String,Array,Object],default:void 0},exit:{type:[String,Array,Object]},variants:{type:Object},inherit:{type:Boolean},style:{type:Object},transformTemplate:{type:Function},transition:{type:Object},layoutGroup:{type:Object},motionConfig:{type:Object},onAnimationComplete:{type:Function},onUpdate:{type:Function},layout:{type:[Boolean,String],default:!1},layoutId:{type:String,default:void 0},layoutScroll:{type:Boolean,default:!1},layoutRoot:{type:Boolean,default:!1},"data-framer-portal-id":{type:String},crossfade:{type:Boolean,default:!0},layoutDependency:{type:null,default:void 0},onBeforeLayoutMeasure:{type:Function},onLayoutMeasure:{type:Function},onLayoutAnimationStart:{type:Function},onLayoutAnimationComplete:{type:Function},globalPressTarget:{type:Boolean},onPressStart:{type:Function},onPress:{type:Function},onPressCancel:{type:Function},onHoverStart:{type:Function},onHoverEnd:{type:Function},inViewOptions:{type:Object},onViewportEnter:{type:Function},onViewportLeave:{type:Function},drag:{type:[Boolean,String]},dragSnapToOrigin:{type:Boolean},dragDirectionLock:{type:Boolean},dragPropagation:{type:Boolean},dragConstraints:{type:[Boolean,Object]},dragElastic:{type:[Boolean,Number,Object],default:.5},dragMomentum:{type:Boolean,default:!0},dragTransition:{type:Object},dragListener:{type:Boolean,default:!0},dragControls:{type:Object},onDragStart:{type:Function},onDragEnd:{type:Function},onDrag:{type:Function},onDirectionLock:{type:Function},onDragTransitionEnd:{type:Function},onMeasureDragConstraints:{type:Function},onPanSessionStart:{type:Function},onPanStart:{type:Function},onPan:{type:Function},onPanEnd:{type:Function}};function b1(n){var e;const t=((e=ga(n.$el))==null?void 0:e.style.display)==="none";return n.$.vnode.transition&&t}const E1=new Map,T1=new Map;function A1(n){if(!Array.isArray(n))return[n];const e=[];for(const t of n)Array.isArray(t)?e.push(...t):e.push(t);return e}const w1=["area","img","input"];function C1(n,e,t){var i,s;if(typeof n=="string"&&w1.includes(n))return sf(n,e);if(n==="template"){if(!t.default)return null;const r=A1(t.default()),a=r.findIndex(u=>u.type!==fg);if(a===-1)return r;const o=r[a];(i=o.props)==null||delete i.ref;const l=o.props?wn(e,o.props):e;e.class&&((s=o.props)!=null&&s.class)&&delete o.props.class;const c=pg(o,l);for(const u in l)u.startsWith("on")&&(c.props||(c.props={}),c.props[u]=l[u]);return r.length===1?c:(r[a]=c,r)}return null}function kh(n,e={}){var t;const i=typeof n=="string",s=i?n:n.name||"",r=((t=e.features)==null?void 0:t.length)>0?E1:T1;if(i&&(r!=null&&r.has(n)))return r.get(n);const a=Ee({inheritAttrs:!1,props:{...M1,features:{type:Object,default:()=>e.features||[]},as:{type:[String,Object],default:n||"div"}},name:s?`motion.${s}`:"Motion",setup(o,{slots:l}){const{getProps:c,getAttrs:u,state:h}=S1(o);function d(){const f=h.element;if((!(typeof o.as=="object")||o.asChild)&&f){const{style:v}=u();if(v)for(const[m,p]of Object.entries(v))f.style[m]=p}}return()=>{const f=c(),g=u(),v=o.asChild?"template":o.as,m={...e.forwardMotionProps||o.forwardMotionProps?f:{},...g,onVnodeUpdated:d},p=C1(v,m,l);return p!==null?p:sf(v,{...m},l)}}});return i&&(r==null||r.set(n,a)),a}function R1(n=[]){return new Proxy({},{get(e,t){return t==="create"?(i,s)=>kh(i,{...s,features:n}):kh(t,{features:n})}})}const nn=R1(h1);nn.create("div");const P1=`#define MAX_COLORS 8
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer; // in NDC [-1,1]
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform float uOpacity;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

    vec3 col = vec3(0.0);
    float a = 1.0;

    if (uColorCount > 0) {
      vec2 s = q;
      vec3 sumCol = vec3(0.0);
      float cover = 0.0;
      for (int i = 0; i < MAX_COLORS; ++i) {
            if (i >= uColorCount) break;
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float m = mix(m0, m1, kMix);
            float w = 1.0 - exp(-6.0 / exp(6.0 * m));
            sumCol += uColors[i] * w;
            cover = max(cover, w);
      }
      col = clamp(sumCol, 0.0, 1.0);
      a = uTransparent > 0 ? cover : 1.0;
    } else {
        vec2 s = q;
        for (int k = 0; k < 3; ++k) {
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float m = mix(m0, m1, kMix);
            col[k] = 1.0 - exp(-6.0 / exp(6.0 * m));
        }
        a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
    }

    if (uNoise > 0.0001) {
      float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
      col += (n - 0.5) * uNoise;
      col = clamp(col, 0.0, 1.0);
    }

    float alpha = a * uOpacity;
    vec3 rgb = (uTransparent > 0) ? col * alpha : col;
    gl_FragColor = vec4(rgb, alpha);
}
`,L1=`varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Uc="182",D1=0,zh=1,I1=2,Qr=1,F1=2,Hs=3,Ai=0,an=1,ei=2,ni=0,gs=1,Gh=2,Hh=3,Wh=4,U1=5,Vi=100,N1=101,O1=102,B1=103,V1=104,k1=200,z1=201,G1=202,H1=203,ol=204,ll=205,W1=206,$1=207,X1=208,q1=209,Y1=210,j1=211,K1=212,Z1=213,J1=214,cl=0,ul=1,hl=2,ys=3,dl=4,fl=5,pl=6,ml=7,tm=0,Q1=1,eT=2,Gn=0,nm=1,im=2,sm=3,rm=4,am=5,om=6,lm=7,cm=300,ji=301,Ss=302,gl=303,vl=304,Ra=306,_l=1e3,ti=1001,xl=1002,Ht=1003,tT=1004,Ar=1005,Xt=1006,Qa=1007,Hi=1008,vn=1009,um=1010,hm=1011,nr=1012,Nc=1013,Xn=1014,Bn=1015,ci=1016,Oc=1017,Bc=1018,ir=1020,dm=35902,fm=35899,pm=1021,mm=1022,Tn=1023,ui=1026,Wi=1027,gm=1028,Vc=1029,Ms=1030,kc=1031,zc=1033,ea=33776,ta=33777,na=33778,ia=33779,yl=35840,Sl=35841,Ml=35842,bl=35843,El=36196,Tl=37492,Al=37496,wl=37488,Cl=37489,Rl=37490,Pl=37491,Ll=37808,Dl=37809,Il=37810,Fl=37811,Ul=37812,Nl=37813,Ol=37814,Bl=37815,Vl=37816,kl=37817,zl=37818,Gl=37819,Hl=37820,Wl=37821,$l=36492,Xl=36494,ql=36495,Yl=36283,jl=36284,Kl=36285,Zl=36286,nT=3200,iT=0,sT=1,Mi="",fn="srgb",bs="srgb-linear",va="linear",ft="srgb",Ji=7680,$h=519,rT=512,aT=513,oT=514,Gc=515,lT=516,cT=517,Hc=518,uT=519,Xh=35044,qh="300 es",Vn=2e3,_a=2001;function vm(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function xa(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function hT(){const n=xa("canvas");return n.style.display="block",n}const Yh={};function jh(...n){const e="THREE."+n.shift();console.log(e,...n)}function He(...n){const e="THREE."+n.shift();console.warn(e,...n)}function at(...n){const e="THREE."+n.shift();console.error(e,...n)}function sr(...n){const e=n.join(" ");e in Yh||(Yh[e]=!0,He(...n))}function dT(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}class Rs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],eo=Math.PI/180,Jl=180/Math.PI;function pr(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Wt[n&255]+Wt[n>>8&255]+Wt[n>>16&255]+Wt[n>>24&255]+"-"+Wt[e&255]+Wt[e>>8&255]+"-"+Wt[e>>16&15|64]+Wt[e>>24&255]+"-"+Wt[t&63|128]+Wt[t>>8&255]+"-"+Wt[t>>16&255]+Wt[t>>24&255]+Wt[i&255]+Wt[i>>8&255]+Wt[i>>16&255]+Wt[i>>24&255]).toLowerCase()}function Je(n,e,t){return Math.max(e,Math.min(t,n))}function fT(n,e){return(n%e+e)%e}function to(n,e,t){return(1-t)*n+t*e}function Is(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function tn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class nt{constructor(e=0,t=0){nt.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class mr{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],u=i[s+2],h=i[s+3],d=r[a+0],f=r[a+1],g=r[a+2],v=r[a+3];if(o<=0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(o>=1){e[t+0]=d,e[t+1]=f,e[t+2]=g,e[t+3]=v;return}if(h!==v||l!==d||c!==f||u!==g){let m=l*d+c*f+u*g+h*v;m<0&&(d=-d,f=-f,g=-g,v=-v,m=-m);let p=1-o;if(m<.9995){const M=Math.acos(m),y=Math.sin(M);p=Math.sin(p*M)/y,o=Math.sin(o*M)/y,l=l*p+d*o,c=c*p+f*o,u=u*p+g*o,h=h*p+v*o}else{l=l*p+d*o,c=c*p+f*o,u=u*p+g*o,h=h*p+v*o;const M=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=M,c*=M,u*=M,h*=M}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],u=i[s+3],h=r[a],d=r[a+1],f=r[a+2],g=r[a+3];return e[t]=o*g+u*h+l*f-c*d,e[t+1]=l*g+u*d+c*h-o*f,e[t+2]=c*g+u*f+o*d-l*h,e[t+3]=u*g-o*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(s/2),h=o(r/2),d=l(i/2),f=l(s/2),g=l(r/2);switch(a){case"XYZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"YXZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"ZXY":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"ZYX":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"YZX":this._x=d*u*h+c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h-d*f*g;break;case"XZY":this._x=d*u*h-c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h+d*f*g;break;default:He("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=i+o+h;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(r-c)*f,this._z=(a-s)*f}else if(i>o&&i>h){const f=2*Math.sqrt(1+i-o-h);this._w=(u-l)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(r+c)/f}else if(o>h){const f=2*Math.sqrt(1+o-i-h);this._w=(r-c)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(l+u)/f}else{const f=2*Math.sqrt(1+h-i-o);this._w=(a-s)/f,this._x=(r+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Je(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+a*o+s*c-r*l,this._y=s*u+a*l+r*o-i*c,this._z=r*u+a*c+i*l-s*o,this._w=a*u-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let i=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{constructor(e=0,t=0,i=0){H.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Kh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Kh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),u=2*(o*t-r*s),h=2*(r*i-a*t);return this.x=t+l*c+a*h-o*u,this.y=i+l*u+o*c-r*h,this.z=s+l*h+r*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return no.copy(this).projectOnVector(e),this.sub(no)}reflect(e){return this.sub(no.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const no=new H,Kh=new mr;class Xe{constructor(e,t,i,s,r,a,o,l,c){Xe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=o,u[3]=t,u[4]=r,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],f=i[5],g=i[8],v=s[0],m=s[3],p=s[6],M=s[1],y=s[4],S=s[7],E=s[2],T=s[5],w=s[8];return r[0]=a*v+o*M+l*E,r[3]=a*m+o*y+l*T,r[6]=a*p+o*S+l*w,r[1]=c*v+u*M+h*E,r[4]=c*m+u*y+h*T,r[7]=c*p+u*S+h*w,r[2]=d*v+f*M+g*E,r[5]=d*m+f*y+g*T,r[8]=d*p+f*S+g*w,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return t*a*u-t*o*c-i*r*u+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,d=o*l-u*r,f=c*r-a*l,g=t*h+i*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=h*v,e[1]=(s*c-u*i)*v,e[2]=(o*i-s*a)*v,e[3]=d*v,e[4]=(u*t-s*l)*v,e[5]=(s*r-o*t)*v,e[6]=f*v,e[7]=(i*l-c*t)*v,e[8]=(a*t-i*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(io.makeScale(e,t)),this}rotate(e){return this.premultiply(io.makeRotation(-e)),this}translate(e,t){return this.premultiply(io.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const io=new Xe,Zh=new Xe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Jh=new Xe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function pT(){const n={enabled:!0,workingColorSpace:bs,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ft&&(s.r=ii(s.r),s.g=ii(s.g),s.b=ii(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ft&&(s.r=vs(s.r),s.g=vs(s.g),s.b=vs(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Mi?va:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return sr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return sr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[bs]:{primaries:e,whitePoint:i,transfer:va,toXYZ:Zh,fromXYZ:Jh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:fn},outputColorSpaceConfig:{drawingBufferColorSpace:fn}},[fn]:{primaries:e,whitePoint:i,transfer:ft,toXYZ:Zh,fromXYZ:Jh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:fn}}}),n}const tt=pT();function ii(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function vs(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Qi;class mT{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Qi===void 0&&(Qi=xa("canvas")),Qi.width=e.width,Qi.height=e.height;const s=Qi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Qi}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=xa("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ii(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(ii(t[i]/255)*255):t[i]=ii(t[i]);return{data:t,width:e.width,height:e.height}}else return He("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let gT=0;class Wc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:gT++}),this.uuid=pr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(so(s[a].image)):r.push(so(s[a]))}else r=so(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function so(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?mT.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(He("Texture: Unable to serialize Texture."),{})}let vT=0;const ro=new H;class Jt extends Rs{constructor(e=Jt.DEFAULT_IMAGE,t=Jt.DEFAULT_MAPPING,i=ti,s=ti,r=Xt,a=Hi,o=Tn,l=vn,c=Jt.DEFAULT_ANISOTROPY,u=Mi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:vT++}),this.uuid=pr(),this.name="",this.source=new Wc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new nt(0,0),this.repeat=new nt(1,1),this.center=new nt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ro).x}get height(){return this.source.getSize(ro).y}get depth(){return this.source.getSize(ro).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){He(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){He(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==cm)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case _l:e.x=e.x-Math.floor(e.x);break;case ti:e.x=e.x<0?0:1;break;case xl:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case _l:e.y=e.y-Math.floor(e.y);break;case ti:e.y=e.y<0?0:1;break;case xl:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Jt.DEFAULT_IMAGE=null;Jt.DEFAULT_MAPPING=cm;Jt.DEFAULT_ANISOTROPY=1;class Ct{constructor(e=0,t=0,i=0,s=1){Ct.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],g=l[9],v=l[2],m=l[6],p=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(c+1)/2,S=(f+1)/2,E=(p+1)/2,T=(u+d)/4,w=(h+v)/4,R=(g+m)/4;return y>S&&y>E?y<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(y),s=T/i,r=w/i):S>E?S<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),i=T/s,r=R/s):E<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),i=w/r,s=R/r),this.set(i,s,r,t),this}let M=Math.sqrt((m-g)*(m-g)+(h-v)*(h-v)+(d-u)*(d-u));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(h-v)/M,this.z=(d-u)/M,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Je(this.x,e.x,t.x),this.y=Je(this.y,e.y,t.y),this.z=Je(this.z,e.z,t.z),this.w=Je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Je(this.x,e,t),this.y=Je(this.y,e,t),this.z=Je(this.z,e,t),this.w=Je(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class _T extends Rs{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Xt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Ct(0,0,e,t),this.scissorTest=!1,this.viewport=new Ct(0,0,e,t);const s={width:e,height:t,depth:i.depth},r=new Jt(s);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Xt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Wc(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Hn extends _T{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class _m extends Jt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class xT extends Jt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=Ht,this.minFilter=Ht,this.wrapR=ti,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class gr{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Sn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Sn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Sn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Sn):Sn.fromBufferAttribute(r,a),Sn.applyMatrix4(e.matrixWorld),this.expandByPoint(Sn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wr.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),wr.copy(i.boundingBox)),wr.applyMatrix4(e.matrixWorld),this.union(wr)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Sn),Sn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Fs),Cr.subVectors(this.max,Fs),es.subVectors(e.a,Fs),ts.subVectors(e.b,Fs),ns.subVectors(e.c,Fs),mi.subVectors(ts,es),gi.subVectors(ns,ts),Pi.subVectors(es,ns);let t=[0,-mi.z,mi.y,0,-gi.z,gi.y,0,-Pi.z,Pi.y,mi.z,0,-mi.x,gi.z,0,-gi.x,Pi.z,0,-Pi.x,-mi.y,mi.x,0,-gi.y,gi.x,0,-Pi.y,Pi.x,0];return!ao(t,es,ts,ns,Cr)||(t=[1,0,0,0,1,0,0,0,1],!ao(t,es,ts,ns,Cr))?!1:(Rr.crossVectors(mi,gi),t=[Rr.x,Rr.y,Rr.z],ao(t,es,ts,ns,Cr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Sn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Sn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(jn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),jn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),jn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),jn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),jn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),jn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),jn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),jn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(jn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const jn=[new H,new H,new H,new H,new H,new H,new H,new H],Sn=new H,wr=new gr,es=new H,ts=new H,ns=new H,mi=new H,gi=new H,Pi=new H,Fs=new H,Cr=new H,Rr=new H,Li=new H;function ao(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){Li.fromArray(n,r);const o=s.x*Math.abs(Li.x)+s.y*Math.abs(Li.y)+s.z*Math.abs(Li.z),l=e.dot(Li),c=t.dot(Li),u=i.dot(Li);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const yT=new gr,Us=new H,oo=new H;class $c{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):yT.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Us.subVectors(e,this.center);const t=Us.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(Us,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(oo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Us.copy(e.center).add(oo)),this.expandByPoint(Us.copy(e.center).sub(oo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Kn=new H,lo=new H,Pr=new H,vi=new H,co=new H,Lr=new H,uo=new H;class ST{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Kn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Kn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Kn.copy(this.origin).addScaledVector(this.direction,t),Kn.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){lo.copy(e).add(t).multiplyScalar(.5),Pr.copy(t).sub(e).normalize(),vi.copy(this.origin).sub(lo);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Pr),o=vi.dot(this.direction),l=-vi.dot(Pr),c=vi.lengthSq(),u=Math.abs(1-a*a);let h,d,f,g;if(u>0)if(h=a*l-o,d=a*o-l,g=r*u,h>=0)if(d>=-g)if(d<=g){const v=1/u;h*=v,d*=v,f=h*(h+a*d+2*o)+d*(a*h+d+2*l)+c}else d=r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-a*r+o)),d=h>0?-r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(h=Math.max(0,-(a*r+o)),d=h>0?r:Math.min(Math.max(-r,-l),r),f=-h*h+d*(d+2*l)+c);else d=a>0?-r:r,h=Math.max(0,-(a*d+o)),f=-h*h+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(lo).addScaledVector(Pr,d),f}intersectSphere(e,t){Kn.subVectors(e.center,this.origin);const i=Kn.dot(this.direction),s=Kn.dot(Kn)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),u>=0?(r=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),h>=0?(o=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(o=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Kn)!==null}intersectTriangle(e,t,i,s,r){co.subVectors(t,e),Lr.subVectors(i,e),uo.crossVectors(co,Lr);let a=this.direction.dot(uo),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;vi.subVectors(this.origin,e);const l=o*this.direction.dot(Lr.crossVectors(vi,Lr));if(l<0)return null;const c=o*this.direction.dot(co.cross(vi));if(c<0||l+c>a)return null;const u=-o*vi.dot(uo);return u<0?null:this.at(u/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ut{constructor(e,t,i,s,r,a,o,l,c,u,h,d,f,g,v,m){Ut.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,u,h,d,f,g,v,m)}set(e,t,i,s,r,a,o,l,c,u,h,d,f,g,v,m){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=u,p[10]=h,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ut().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinant()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const t=this.elements,i=e.elements,s=1/is.setFromMatrixColumn(e,0).length(),r=1/is.setFromMatrixColumn(e,1).length(),a=1/is.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const d=a*u,f=a*h,g=o*u,v=o*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=f+g*c,t[5]=d-v*c,t[9]=-o*l,t[2]=v-d*c,t[6]=g+f*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*u,f=l*h,g=c*u,v=c*h;t[0]=d+v*o,t[4]=g*o-f,t[8]=a*c,t[1]=a*h,t[5]=a*u,t[9]=-o,t[2]=f*o-g,t[6]=v+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*u,f=l*h,g=c*u,v=c*h;t[0]=d-v*o,t[4]=-a*h,t[8]=g+f*o,t[1]=f+g*o,t[5]=a*u,t[9]=v-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*u,f=a*h,g=o*u,v=o*h;t[0]=l*u,t[4]=g*c-f,t[8]=d*c+v,t[1]=l*h,t[5]=v*c+d,t[9]=f*c-g,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,f=a*c,g=o*l,v=o*c;t[0]=l*u,t[4]=v-d*h,t[8]=g*h+f,t[1]=h,t[5]=a*u,t[9]=-o*u,t[2]=-c*u,t[6]=f*h+g,t[10]=d-v*h}else if(e.order==="XZY"){const d=a*l,f=a*c,g=o*l,v=o*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+v,t[5]=a*u,t[9]=f*h-g,t[2]=g*h-f,t[6]=o*u,t[10]=v*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(MT,e,bT)}lookAt(e,t,i){const s=this.elements;return un.subVectors(e,t),un.lengthSq()===0&&(un.z=1),un.normalize(),_i.crossVectors(i,un),_i.lengthSq()===0&&(Math.abs(i.z)===1?un.x+=1e-4:un.z+=1e-4,un.normalize(),_i.crossVectors(i,un)),_i.normalize(),Dr.crossVectors(un,_i),s[0]=_i.x,s[4]=Dr.x,s[8]=un.x,s[1]=_i.y,s[5]=Dr.y,s[9]=un.y,s[2]=_i.z,s[6]=Dr.z,s[10]=un.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],f=i[13],g=i[2],v=i[6],m=i[10],p=i[14],M=i[3],y=i[7],S=i[11],E=i[15],T=s[0],w=s[4],R=s[8],_=s[12],b=s[1],P=s[5],k=s[9],B=s[13],N=s[2],j=s[6],q=s[10],X=s[14],Q=s[3],ce=s[7],oe=s[11],_e=s[15];return r[0]=a*T+o*b+l*N+c*Q,r[4]=a*w+o*P+l*j+c*ce,r[8]=a*R+o*k+l*q+c*oe,r[12]=a*_+o*B+l*X+c*_e,r[1]=u*T+h*b+d*N+f*Q,r[5]=u*w+h*P+d*j+f*ce,r[9]=u*R+h*k+d*q+f*oe,r[13]=u*_+h*B+d*X+f*_e,r[2]=g*T+v*b+m*N+p*Q,r[6]=g*w+v*P+m*j+p*ce,r[10]=g*R+v*k+m*q+p*oe,r[14]=g*_+v*B+m*X+p*_e,r[3]=M*T+y*b+S*N+E*Q,r[7]=M*w+y*P+S*j+E*ce,r[11]=M*R+y*k+S*q+E*oe,r[15]=M*_+y*B+S*X+E*_e,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],g=e[3],v=e[7],m=e[11],p=e[15],M=l*f-c*d,y=o*f-c*h,S=o*d-l*h,E=a*f-c*u,T=a*d-l*u,w=a*h-o*u;return t*(v*M-m*y+p*S)-i*(g*M-m*E+p*T)+s*(g*y-v*E+p*w)-r*(g*S-v*T+m*w)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],g=e[12],v=e[13],m=e[14],p=e[15],M=h*m*c-v*d*c+v*l*f-o*m*f-h*l*p+o*d*p,y=g*d*c-u*m*c-g*l*f+a*m*f+u*l*p-a*d*p,S=u*v*c-g*h*c+g*o*f-a*v*f-u*o*p+a*h*p,E=g*h*l-u*v*l-g*o*d+a*v*d+u*o*m-a*h*m,T=t*M+i*y+s*S+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/T;return e[0]=M*w,e[1]=(v*d*r-h*m*r-v*s*f+i*m*f+h*s*p-i*d*p)*w,e[2]=(o*m*r-v*l*r+v*s*c-i*m*c-o*s*p+i*l*p)*w,e[3]=(h*l*r-o*d*r-h*s*c+i*d*c+o*s*f-i*l*f)*w,e[4]=y*w,e[5]=(u*m*r-g*d*r+g*s*f-t*m*f-u*s*p+t*d*p)*w,e[6]=(g*l*r-a*m*r-g*s*c+t*m*c+a*s*p-t*l*p)*w,e[7]=(a*d*r-u*l*r+u*s*c-t*d*c-a*s*f+t*l*f)*w,e[8]=S*w,e[9]=(g*h*r-u*v*r-g*i*f+t*v*f+u*i*p-t*h*p)*w,e[10]=(a*v*r-g*o*r+g*i*c-t*v*c-a*i*p+t*o*p)*w,e[11]=(u*o*r-a*h*r-u*i*c+t*h*c+a*i*f-t*o*f)*w,e[12]=E*w,e[13]=(u*v*s-g*h*s+g*i*d-t*v*d-u*i*m+t*h*m)*w,e[14]=(g*o*s-a*v*s-g*i*l+t*v*l+a*i*m-t*o*m)*w,e[15]=(a*h*s-u*o*s+u*i*l-t*h*l-a*i*d+t*o*d)*w,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,u=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,u*o+i,u*l-s*a,0,c*l-s*o,u*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,u=a+a,h=o+o,d=r*c,f=r*u,g=r*h,v=a*u,m=a*h,p=o*h,M=l*c,y=l*u,S=l*h,E=i.x,T=i.y,w=i.z;return s[0]=(1-(v+p))*E,s[1]=(f+S)*E,s[2]=(g-y)*E,s[3]=0,s[4]=(f-S)*T,s[5]=(1-(d+p))*T,s[6]=(m+M)*T,s[7]=0,s[8]=(g+y)*w,s[9]=(m-M)*w,s[10]=(1-(d+v))*w,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;if(e.x=s[12],e.y=s[13],e.z=s[14],this.determinant()===0)return i.set(1,1,1),t.identity(),this;let r=is.set(s[0],s[1],s[2]).length();const a=is.set(s[4],s[5],s[6]).length(),o=is.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),Mn.copy(this);const c=1/r,u=1/a,h=1/o;return Mn.elements[0]*=c,Mn.elements[1]*=c,Mn.elements[2]*=c,Mn.elements[4]*=u,Mn.elements[5]*=u,Mn.elements[6]*=u,Mn.elements[8]*=h,Mn.elements[9]*=h,Mn.elements[10]*=h,t.setFromRotationMatrix(Mn),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=Vn,l=!1){const c=this.elements,u=2*r/(t-e),h=2*r/(i-s),d=(t+e)/(t-e),f=(i+s)/(i-s);let g,v;if(l)g=r/(a-r),v=a*r/(a-r);else if(o===Vn)g=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===_a)g=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=Vn,l=!1){const c=this.elements,u=2/(t-e),h=2/(i-s),d=-(t+e)/(t-e),f=-(i+s)/(i-s);let g,v;if(l)g=1/(a-r),v=a/(a-r);else if(o===Vn)g=-2/(a-r),v=-(a+r)/(a-r);else if(o===_a)g=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const is=new H,Mn=new Ut,MT=new H(0,0,0),bT=new H(1,1,1),_i=new H,Dr=new H,un=new H,Qh=new Ut,ed=new mr;let Ki=class xm{constructor(e=0,t=0,i=0,s=xm.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],u=s[9],h=s[2],d=s[6],f=s[10];switch(t){case"XYZ":this._y=Math.asin(Je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Je(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Je(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Je(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Je(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,f),this._y=0);break;default:He("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Qh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Qh,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ed.setFromEuler(this),this.setFromQuaternion(ed,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ki.DEFAULT_ORDER="XYZ";class ym{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let ET=0;const td=new H,ss=new mr,Zn=new Ut,Ir=new H,Ns=new H,TT=new H,AT=new mr,nd=new H(1,0,0),id=new H(0,1,0),sd=new H(0,0,1),rd={type:"added"},wT={type:"removed"},rs={type:"childadded",child:null},ho={type:"childremoved",child:null};class pn extends Rs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ET++}),this.uuid=pr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=pn.DEFAULT_UP.clone();const e=new H,t=new Ki,i=new mr,s=new H(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ut},normalMatrix:{value:new Xe}}),this.matrix=new Ut,this.matrixWorld=new Ut,this.matrixAutoUpdate=pn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=pn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ym,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ss.setFromAxisAngle(e,t),this.quaternion.multiply(ss),this}rotateOnWorldAxis(e,t){return ss.setFromAxisAngle(e,t),this.quaternion.premultiply(ss),this}rotateX(e){return this.rotateOnAxis(nd,e)}rotateY(e){return this.rotateOnAxis(id,e)}rotateZ(e){return this.rotateOnAxis(sd,e)}translateOnAxis(e,t){return td.copy(e).applyQuaternion(this.quaternion),this.position.add(td.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(nd,e)}translateY(e){return this.translateOnAxis(id,e)}translateZ(e){return this.translateOnAxis(sd,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Zn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ir.copy(e):Ir.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),Ns.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Zn.lookAt(Ns,Ir,this.up):Zn.lookAt(Ir,Ns,this.up),this.quaternion.setFromRotationMatrix(Zn),s&&(Zn.extractRotation(s.matrixWorld),ss.setFromRotationMatrix(Zn),this.quaternion.premultiply(ss.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(at("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(rd),rs.child=e,this.dispatchEvent(rs),rs.child=null):at("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(wT),ho.child=e,this.dispatchEvent(ho),ho.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Zn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Zn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Zn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(rd),rs.child=e,this.dispatchEvent(rs),rs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ns,e,TT),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ns,AT,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),h=a(e.shapes),d=a(e.skeletons),f=a(e.animations),g=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}pn.DEFAULT_UP=new H(0,1,0);pn.DEFAULT_MATRIX_AUTO_UPDATE=!0;pn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const bn=new H,Jn=new H,fo=new H,Qn=new H,as=new H,os=new H,ad=new H,po=new H,mo=new H,go=new H,vo=new Ct,_o=new Ct,xo=new Ct;let Os=class ds{constructor(e=new H,t=new H,i=new H){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),bn.subVectors(e,t),s.cross(bn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){bn.subVectors(s,t),Jn.subVectors(i,t),fo.subVectors(e,t);const a=bn.dot(bn),o=bn.dot(Jn),l=bn.dot(fo),c=Jn.dot(Jn),u=Jn.dot(fo),h=a*c-o*o;if(h===0)return r.set(0,0,0),null;const d=1/h,f=(c*l-o*u)*d,g=(a*u-o*l)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Qn)===null?!1:Qn.x>=0&&Qn.y>=0&&Qn.x+Qn.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,Qn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Qn.x),l.addScaledVector(a,Qn.y),l.addScaledVector(o,Qn.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return vo.setScalar(0),_o.setScalar(0),xo.setScalar(0),vo.fromBufferAttribute(e,t),_o.fromBufferAttribute(e,i),xo.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(vo,r.x),a.addScaledVector(_o,r.y),a.addScaledVector(xo,r.z),a}static isFrontFacing(e,t,i,s){return bn.subVectors(i,t),Jn.subVectors(e,t),bn.cross(Jn).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return bn.subVectors(this.c,this.b),Jn.subVectors(this.a,this.b),bn.cross(Jn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return ds.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return ds.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return ds.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return ds.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return ds.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;as.subVectors(s,i),os.subVectors(r,i),po.subVectors(e,i);const l=as.dot(po),c=os.dot(po);if(l<=0&&c<=0)return t.copy(i);mo.subVectors(e,s);const u=as.dot(mo),h=os.dot(mo);if(u>=0&&h<=u)return t.copy(s);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),t.copy(i).addScaledVector(as,a);go.subVectors(e,r);const f=as.dot(go),g=os.dot(go);if(g>=0&&f<=g)return t.copy(r);const v=f*c-l*g;if(v<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(i).addScaledVector(os,o);const m=u*g-f*h;if(m<=0&&h-u>=0&&f-g>=0)return ad.subVectors(r,s),o=(h-u)/(h-u+(f-g)),t.copy(s).addScaledVector(ad,o);const p=1/(m+v+d);return a=v*p,o=d*p,t.copy(i).addScaledVector(as,a).addScaledVector(os,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}};const Sm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},xi={h:0,s:0,l:0},Fr={h:0,s:0,l:0};function yo(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class mt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=fn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=i,tt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=tt.workingColorSpace){if(e=fT(e,1),t=Je(t,0,1),i=Je(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=yo(a,r,e+1/3),this.g=yo(a,r,e),this.b=yo(a,r,e-1/3)}return tt.colorSpaceToWorking(this,s),this}setStyle(e,t=fn){function i(r){r!==void 0&&parseFloat(r)<1&&He("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:He("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);He("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=fn){const i=Sm[e.toLowerCase()];return i!==void 0?this.setHex(i,t):He("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ii(e.r),this.g=ii(e.g),this.b=ii(e.b),this}copyLinearToSRGB(e){return this.r=vs(e.r),this.g=vs(e.g),this.b=vs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=fn){return tt.workingToColorSpace($t.copy(this),e),Math.round(Je($t.r*255,0,255))*65536+Math.round(Je($t.g*255,0,255))*256+Math.round(Je($t.b*255,0,255))}getHexString(e=fn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace($t.copy(this),t);const i=$t.r,s=$t.g,r=$t.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case i:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-i)/h+2;break;case r:l=(i-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace($t.copy(this),t),e.r=$t.r,e.g=$t.g,e.b=$t.b,e}getStyle(e=fn){tt.workingToColorSpace($t.copy(this),e);const t=$t.r,i=$t.g,s=$t.b;return e!==fn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(xi),this.setHSL(xi.h+e,xi.s+t,xi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(xi),e.getHSL(Fr);const i=to(xi.h,Fr.h,t),s=to(xi.s,Fr.s,t),r=to(xi.l,Fr.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const $t=new mt;mt.NAMES=Sm;let CT=0;class Pa extends Rs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:CT++}),this.uuid=pr(),this.name="",this.type="Material",this.blending=gs,this.side=Ai,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ol,this.blendDst=ll,this.blendEquation=Vi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new mt(0,0,0),this.blendAlpha=0,this.depthFunc=ys,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=$h,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ji,this.stencilZFail=Ji,this.stencilZPass=Ji,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){He(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){He(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==gs&&(i.blending=this.blending),this.side!==Ai&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ol&&(i.blendSrc=this.blendSrc),this.blendDst!==ll&&(i.blendDst=this.blendDst),this.blendEquation!==Vi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ys&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==$h&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ji&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ji&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ji&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Mm extends Pa{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new mt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ki,this.combine=tm,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Lt=new H,Ur=new nt;let RT=0;class Wn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:RT++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Xh,this.updateRanges=[],this.gpuType=Bn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Ur.fromBufferAttribute(this,t),Ur.applyMatrix3(e),this.setXY(t,Ur.x,Ur.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Lt.fromBufferAttribute(this,t),Lt.applyMatrix3(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Lt.fromBufferAttribute(this,t),Lt.applyMatrix4(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Lt.fromBufferAttribute(this,t),Lt.applyNormalMatrix(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Lt.fromBufferAttribute(this,t),Lt.transformDirection(e),this.setXYZ(t,Lt.x,Lt.y,Lt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Is(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=tn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Is(t,this.array)),t}setX(e,t){return this.normalized&&(t=tn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Is(t,this.array)),t}setY(e,t){return this.normalized&&(t=tn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Is(t,this.array)),t}setZ(e,t){return this.normalized&&(t=tn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Is(t,this.array)),t}setW(e,t){return this.normalized&&(t=tn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=tn(t,this.array),i=tn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=tn(t,this.array),i=tn(i,this.array),s=tn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=tn(t,this.array),i=tn(i,this.array),s=tn(s,this.array),r=tn(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Xh&&(e.usage=this.usage),e}}class bm extends Wn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Em extends Wn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class si extends Wn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let PT=0;const gn=new Ut,So=new pn,ls=new H,hn=new gr,Bs=new gr,kt=new H;class fi extends Rs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:PT++}),this.uuid=pr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(vm(e)?Em:bm)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new Xe().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return gn.makeRotationFromQuaternion(e),this.applyMatrix4(gn),this}rotateX(e){return gn.makeRotationX(e),this.applyMatrix4(gn),this}rotateY(e){return gn.makeRotationY(e),this.applyMatrix4(gn),this}rotateZ(e){return gn.makeRotationZ(e),this.applyMatrix4(gn),this}translate(e,t,i){return gn.makeTranslation(e,t,i),this.applyMatrix4(gn),this}scale(e,t,i){return gn.makeScale(e,t,i),this.applyMatrix4(gn),this}lookAt(e){return So.lookAt(e),So.updateMatrix(),this.applyMatrix4(So.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ls).negate(),this.translate(ls.x,ls.y,ls.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new si(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&He("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new gr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){at("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];hn.setFromBufferAttribute(r),this.morphTargetsRelative?(kt.addVectors(this.boundingBox.min,hn.min),this.boundingBox.expandByPoint(kt),kt.addVectors(this.boundingBox.max,hn.max),this.boundingBox.expandByPoint(kt)):(this.boundingBox.expandByPoint(hn.min),this.boundingBox.expandByPoint(hn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&at('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $c);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){at("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(e){const i=this.boundingSphere.center;if(hn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Bs.setFromBufferAttribute(o),this.morphTargetsRelative?(kt.addVectors(hn.min,Bs.min),hn.expandByPoint(kt),kt.addVectors(hn.max,Bs.max),hn.expandByPoint(kt)):(hn.expandByPoint(Bs.min),hn.expandByPoint(Bs.max))}hn.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)kt.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(kt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)kt.fromBufferAttribute(o,c),l&&(ls.fromBufferAttribute(e,c),kt.add(ls)),s=Math.max(s,i.distanceToSquared(kt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&at('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){at("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Wn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let R=0;R<i.count;R++)o[R]=new H,l[R]=new H;const c=new H,u=new H,h=new H,d=new nt,f=new nt,g=new nt,v=new H,m=new H;function p(R,_,b){c.fromBufferAttribute(i,R),u.fromBufferAttribute(i,_),h.fromBufferAttribute(i,b),d.fromBufferAttribute(r,R),f.fromBufferAttribute(r,_),g.fromBufferAttribute(r,b),u.sub(c),h.sub(c),f.sub(d),g.sub(d);const P=1/(f.x*g.y-g.x*f.y);isFinite(P)&&(v.copy(u).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(P),m.copy(h).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(P),o[R].add(v),o[_].add(v),o[b].add(v),l[R].add(m),l[_].add(m),l[b].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let R=0,_=M.length;R<_;++R){const b=M[R],P=b.start,k=b.count;for(let B=P,N=P+k;B<N;B+=3)p(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const y=new H,S=new H,E=new H,T=new H;function w(R){E.fromBufferAttribute(s,R),T.copy(E);const _=o[R];y.copy(_),y.sub(E.multiplyScalar(E.dot(_))).normalize(),S.crossVectors(T,_);const P=S.dot(l[R])<0?-1:1;a.setXYZW(R,y.x,y.y,y.z,P)}for(let R=0,_=M.length;R<_;++R){const b=M[R],P=b.start,k=b.count;for(let B=P,N=P+k;B<N;B+=3)w(e.getX(B+0)),w(e.getX(B+1)),w(e.getX(B+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Wn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new H,r=new H,a=new H,o=new H,l=new H,c=new H,u=new H,h=new H;if(e)for(let d=0,f=e.count;d<f;d+=3){const g=e.getX(d+0),v=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,m),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),o.fromBufferAttribute(i,g),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,m),o.add(u),l.add(u),c.add(u),i.setXYZ(g,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),u.subVectors(a,r),h.subVectors(s,r),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)kt.fromBufferAttribute(e,t),kt.normalize(),e.setXYZ(t,kt.x,kt.y,kt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u);let f=0,g=0;for(let v=0,m=l.length;v<m;v++){o.isInterleavedBufferAttribute?f=l[v]*o.data.stride+o.offset:f=l[v]*u;for(let p=0;p<u;p++)d[g++]=c[f++]}return new Wn(d,u,h)}if(this.index===null)return He("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new fi,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,h=c.length;u<h;u++){const d=c[u],f=e(d,i);l.push(f)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],h=r[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const od=new Ut,Di=new ST,Nr=new $c,ld=new H,Or=new H,Br=new H,Vr=new H,Mo=new H,kr=new H,cd=new H,zr=new H;let qn=class extends pn{constructor(e=new fi,t=new Mm){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){kr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],h=r[l];u!==0&&(Mo.fromBufferAttribute(h,e),a?kr.addScaledVector(Mo,u):kr.addScaledVector(Mo.sub(t),u))}t.add(kr)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Nr.copy(i.boundingSphere),Nr.applyMatrix4(r),Di.copy(e.ray).recast(e.near),!(Nr.containsPoint(Di.origin)===!1&&(Di.intersectSphere(Nr,ld)===null||Di.origin.distanceToSquared(ld)>(e.far-e.near)**2))&&(od.copy(r).invert(),Di.copy(e.ray).applyMatrix4(od),!(i.boundingBox!==null&&Di.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Di)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,f=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=a[m.materialIndex],M=Math.max(m.start,f.start),y=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let S=M,E=y;S<E;S+=3){const T=o.getX(S),w=o.getX(S+1),R=o.getX(S+2);s=Gr(this,p,e,i,c,u,h,T,w,R),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(o.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const M=o.getX(m),y=o.getX(m+1),S=o.getX(m+2);s=Gr(this,a,e,i,c,u,h,M,y,S),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=a[m.materialIndex],M=Math.max(m.start,f.start),y=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let S=M,E=y;S<E;S+=3){const T=S,w=S+1,R=S+2;s=Gr(this,p,e,i,c,u,h,T,w,R),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(l.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const M=m,y=m+1,S=m+2;s=Gr(this,a,e,i,c,u,h,M,y,S),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}};function LT(n,e,t,i,s,r,a,o){let l;if(e.side===an?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===Ai,o),l===null)return null;zr.copy(o),zr.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(zr);return c<t.near||c>t.far?null:{distance:c,point:zr.clone(),object:n}}function Gr(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,Or),n.getVertexPosition(l,Br),n.getVertexPosition(c,Vr);const u=LT(n,e,t,i,Or,Br,Vr,cd);if(u){const h=new H;Os.getBarycoord(cd,Or,Br,Vr,h),s&&(u.uv=Os.getInterpolatedAttribute(s,o,l,c,h,new nt)),r&&(u.uv1=Os.getInterpolatedAttribute(r,o,l,c,h,new nt)),a&&(u.normal=Os.getInterpolatedAttribute(a,o,l,c,h,new H),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new H,materialIndex:0};Os.getNormal(Or,Br,Vr,d.normal),u.face=d,u.barycoord=h}return u}class vr extends fi{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],h=[];let d=0,f=0;g("z","y","x",-1,-1,i,t,e,a,r,0),g("z","y","x",1,-1,i,t,-e,a,r,1),g("x","z","y",1,1,e,i,t,s,a,2),g("x","z","y",1,-1,e,i,-t,s,a,3),g("x","y","z",1,-1,e,t,i,s,r,4),g("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new si(c,3)),this.setAttribute("normal",new si(u,3)),this.setAttribute("uv",new si(h,2));function g(v,m,p,M,y,S,E,T,w,R,_){const b=S/w,P=E/R,k=S/2,B=E/2,N=T/2,j=w+1,q=R+1;let X=0,Q=0;const ce=new H;for(let oe=0;oe<q;oe++){const _e=oe*P-B;for(let $e=0;$e<j;$e++){const We=$e*b-k;ce[v]=We*M,ce[m]=_e*y,ce[p]=N,c.push(ce.x,ce.y,ce.z),ce[v]=0,ce[m]=0,ce[p]=T>0?1:-1,u.push(ce.x,ce.y,ce.z),h.push($e/w),h.push(1-oe/R),X+=1}}for(let oe=0;oe<R;oe++)for(let _e=0;_e<w;_e++){const $e=d+_e+j*oe,We=d+_e+j*(oe+1),xt=d+(_e+1)+j*(oe+1),ot=d+(_e+1)+j*oe;l.push($e,We,ot),l.push(We,xt,ot),Q+=6}o.addGroup(f,Q,_),f+=Q,d+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new vr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Es(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(He("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function jt(n){const e={};for(let t=0;t<n.length;t++){const i=Es(n[t]);for(const s in i)e[s]=i[s]}return e}function DT(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Tm(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}const IT={clone:Es,merge:jt};var FT=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,UT=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Rn extends Pa{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=FT,this.fragmentShader=UT,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Es(e.uniforms),this.uniformsGroups=DT(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Am extends pn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ut,this.projectionMatrix=new Ut,this.projectionMatrixInverse=new Ut,this.coordinateSystem=Vn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const yi=new H,ud=new nt,hd=new nt;class En extends Am{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Jl*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(eo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Jl*2*Math.atan(Math.tan(eo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){yi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(yi.x,yi.y).multiplyScalar(-e/yi.z),yi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(yi.x,yi.y).multiplyScalar(-e/yi.z)}getViewSize(e,t){return this.getViewBounds(e,ud,hd),t.subVectors(hd,ud)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(eo*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const cs=-90,us=1;class NT extends pn{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new En(cs,us,e,t);s.layers=this.layers,this.add(s);const r=new En(cs,us,e,t);r.layers=this.layers,this.add(r);const a=new En(cs,us,e,t);a.layers=this.layers,this.add(a);const o=new En(cs,us,e,t);o.layers=this.layers,this.add(o);const l=new En(cs,us,e,t);l.layers=this.layers,this.add(l);const c=new En(cs,us,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Vn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===_a)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,s),e.render(t,u),e.setRenderTarget(h,d,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class wm extends Jt{constructor(e=[],t=ji,i,s,r,a,o,l,c,u){super(e,t,i,s,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Cm extends Hn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new wm(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new vr(5,5,5),r=new Rn({name:"CubemapFromEquirect",uniforms:Es(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:an,blending:ni});r.uniforms.tEquirect.value=t;const a=new qn(s,r),o=t.minFilter;return t.minFilter===Hi&&(t.minFilter=Xt),new NT(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}class Hr extends pn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const OT={type:"move"};class bo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Hr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Hr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Hr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,i),p=this._getHandJoint(c,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(OT)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Hr;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class BT extends pn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ki,this.environmentIntensity=1,this.environmentRotation=new Ki,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class VT extends Jt{constructor(e=null,t=1,i=1,s,r,a,o,l,c=Ht,u=Ht,h,d){super(null,a,o,l,c,u,s,r,h,d),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Eo=new H,kT=new H,zT=new Xe;class Oi{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=Eo.subVectors(i,t).cross(kT.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Eo),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||zT.getNormalMatrix(e),s=this.coplanarPoint(Eo).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ii=new $c,GT=new nt(.5,.5),Wr=new H;class Rm{constructor(e=new Oi,t=new Oi,i=new Oi,s=new Oi,r=new Oi,a=new Oi){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Vn,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],h=r[5],d=r[6],f=r[7],g=r[8],v=r[9],m=r[10],p=r[11],M=r[12],y=r[13],S=r[14],E=r[15];if(s[0].setComponents(c-a,f-u,p-g,E-M).normalize(),s[1].setComponents(c+a,f+u,p+g,E+M).normalize(),s[2].setComponents(c+o,f+h,p+v,E+y).normalize(),s[3].setComponents(c-o,f-h,p-v,E-y).normalize(),i)s[4].setComponents(l,d,m,S).normalize(),s[5].setComponents(c-l,f-d,p-m,E-S).normalize();else if(s[4].setComponents(c-l,f-d,p-m,E-S).normalize(),t===Vn)s[5].setComponents(c+l,f+d,p+m,E+S).normalize();else if(t===_a)s[5].setComponents(l,d,m,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ii.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Ii.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ii)}intersectsSprite(e){Ii.center.set(0,0,0);const t=GT.distanceTo(e.center);return Ii.radius=.7071067811865476+t,Ii.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ii)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(Wr.x=s.normal.x>0?e.max.x:e.min.x,Wr.y=s.normal.y>0?e.max.y:e.min.y,Wr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Wr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class rr extends Jt{constructor(e,t,i=Xn,s,r,a,o=Ht,l=Ht,c,u=ui,h=1){if(u!==ui&&u!==Wi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:t,depth:h};super(d,s,r,a,o,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Wc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class HT extends rr{constructor(e,t=Xn,i=ji,s,r,a=Ht,o=Ht,l,c=ui){const u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,t,i,s,r,a,o,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Pm extends Jt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class _r extends fi{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,u=l+1,h=e/o,d=t/l,f=[],g=[],v=[],m=[];for(let p=0;p<u;p++){const M=p*d-a;for(let y=0;y<c;y++){const S=y*h-r;g.push(S,-M,0),v.push(0,0,1),m.push(y/o),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<o;M++){const y=M+c*p,S=M+c*(p+1),E=M+1+c*(p+1),T=M+1+c*p;f.push(y,S,T),f.push(S,E,T)}this.setIndex(f),this.setAttribute("position",new si(g,3)),this.setAttribute("normal",new si(v,3)),this.setAttribute("uv",new si(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _r(e.width,e.height,e.widthSegments,e.heightSegments)}}class WT extends Rn{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class $T extends Pa{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=nT,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class XT extends Pa{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Xc extends Am{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class qT extends En{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class YT{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function dd(n,e,t,i){const s=jT(i);switch(t){case pm:return n*e;case gm:return n*e/s.components*s.byteLength;case Vc:return n*e/s.components*s.byteLength;case Ms:return n*e*2/s.components*s.byteLength;case kc:return n*e*2/s.components*s.byteLength;case mm:return n*e*3/s.components*s.byteLength;case Tn:return n*e*4/s.components*s.byteLength;case zc:return n*e*4/s.components*s.byteLength;case ea:case ta:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case na:case ia:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Sl:case bl:return Math.max(n,16)*Math.max(e,8)/4;case yl:case Ml:return Math.max(n,8)*Math.max(e,8)/2;case El:case Tl:case wl:case Cl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Al:case Rl:case Pl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ll:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Dl:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Il:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Fl:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ul:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Nl:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Ol:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Bl:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Vl:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case kl:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case zl:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Gl:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Hl:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Wl:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case $l:case Xl:case ql:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Yl:case jl:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Kl:case Zl:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function jT(n){switch(n){case vn:case um:return{byteLength:1,components:1};case nr:case hm:case ci:return{byteLength:2,components:1};case Oc:case Bc:return{byteLength:2,components:4};case Xn:case Nc:case Bn:return{byteLength:4,components:1};case dm:case fm:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Uc}}));typeof window<"u"&&(window.__THREE__?He("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Uc);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Lm(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function KT(n){const e=new WeakMap;function t(o,l){const c=o.array,u=o.usage,h=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,u),o.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,l,c){const u=l.array,h=l.updateRanges;if(n.bindBuffer(c,o),h.length===0)n.bufferSubData(c,0,u);else{h.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<h.length;f++){const g=h[d],v=h[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,h[d]=v)}h.length=d+1;for(let f=0,g=h.length;f<g;f++){const v=h[f];n.bufferSubData(c,v.start*u.BYTES_PER_ELEMENT,u,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var ZT=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,JT=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,QT=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,eA=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tA=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,nA=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,iA=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,sA=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,rA=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,aA=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,oA=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,lA=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,cA=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,uA=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,hA=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,dA=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,fA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,pA=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,mA=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,gA=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,vA=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,_A=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,xA=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,yA=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,SA=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,MA=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,bA=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,EA=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,TA=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,AA=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,wA="gl_FragColor = linearToOutputTexel( gl_FragColor );",CA=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,RA=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,PA=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,LA=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,DA=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,IA=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,FA=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,UA=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,NA=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,OA=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,BA=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,VA=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,kA=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,zA=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,GA=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,HA=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,WA=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,$A=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,XA=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,qA=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,YA=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,jA=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return v;
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( vec3( 1.0 ) - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,KA=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ZA=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,JA=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,QA=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ew=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tw=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,nw=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,iw=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,sw=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,rw=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,aw=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ow=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,lw=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,cw=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,uw=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,hw=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,dw=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,fw=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,pw=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,mw=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,gw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vw=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_w=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,xw=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,yw=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Sw=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Mw=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,bw=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ew=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Tw=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Aw=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,ww=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Cw=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Rw=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Pw=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Lw=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Dw=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * 6.28318530718;
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 0, 5, phi ).x + bitangent * vogelDiskSample( 0, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 1, 5, phi ).x + bitangent * vogelDiskSample( 1, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 2, 5, phi ).x + bitangent * vogelDiskSample( 2, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 3, 5, phi ).x + bitangent * vogelDiskSample( 3, 5, phi ).y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * vogelDiskSample( 4, 5, phi ).x + bitangent * vogelDiskSample( 4, 5, phi ).y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadow = step( depth, dp );
			#else
				shadow = step( dp, depth );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Iw=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Fw=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Uw=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Nw=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ow=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Bw=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Vw=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,kw=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,zw=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Gw=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Hw=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ww=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,$w=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Xw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,qw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Yw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,jw=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Kw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Zw=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Jw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Qw=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,eC=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,tC=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nC=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,iC=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,sC=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,rC=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,aC=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,oC=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lC=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,cC=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,uC=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,hC=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dC=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fC=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pC=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,mC=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gC=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,vC=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,_C=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xC=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yC=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,SC=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,MC=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,bC=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,EC=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,TC=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,AC=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wC=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,CC=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,RC=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qe={alphahash_fragment:ZT,alphahash_pars_fragment:JT,alphamap_fragment:QT,alphamap_pars_fragment:eA,alphatest_fragment:tA,alphatest_pars_fragment:nA,aomap_fragment:iA,aomap_pars_fragment:sA,batching_pars_vertex:rA,batching_vertex:aA,begin_vertex:oA,beginnormal_vertex:lA,bsdfs:cA,iridescence_fragment:uA,bumpmap_pars_fragment:hA,clipping_planes_fragment:dA,clipping_planes_pars_fragment:fA,clipping_planes_pars_vertex:pA,clipping_planes_vertex:mA,color_fragment:gA,color_pars_fragment:vA,color_pars_vertex:_A,color_vertex:xA,common:yA,cube_uv_reflection_fragment:SA,defaultnormal_vertex:MA,displacementmap_pars_vertex:bA,displacementmap_vertex:EA,emissivemap_fragment:TA,emissivemap_pars_fragment:AA,colorspace_fragment:wA,colorspace_pars_fragment:CA,envmap_fragment:RA,envmap_common_pars_fragment:PA,envmap_pars_fragment:LA,envmap_pars_vertex:DA,envmap_physical_pars_fragment:HA,envmap_vertex:IA,fog_vertex:FA,fog_pars_vertex:UA,fog_fragment:NA,fog_pars_fragment:OA,gradientmap_pars_fragment:BA,lightmap_pars_fragment:VA,lights_lambert_fragment:kA,lights_lambert_pars_fragment:zA,lights_pars_begin:GA,lights_toon_fragment:WA,lights_toon_pars_fragment:$A,lights_phong_fragment:XA,lights_phong_pars_fragment:qA,lights_physical_fragment:YA,lights_physical_pars_fragment:jA,lights_fragment_begin:KA,lights_fragment_maps:ZA,lights_fragment_end:JA,logdepthbuf_fragment:QA,logdepthbuf_pars_fragment:ew,logdepthbuf_pars_vertex:tw,logdepthbuf_vertex:nw,map_fragment:iw,map_pars_fragment:sw,map_particle_fragment:rw,map_particle_pars_fragment:aw,metalnessmap_fragment:ow,metalnessmap_pars_fragment:lw,morphinstance_vertex:cw,morphcolor_vertex:uw,morphnormal_vertex:hw,morphtarget_pars_vertex:dw,morphtarget_vertex:fw,normal_fragment_begin:pw,normal_fragment_maps:mw,normal_pars_fragment:gw,normal_pars_vertex:vw,normal_vertex:_w,normalmap_pars_fragment:xw,clearcoat_normal_fragment_begin:yw,clearcoat_normal_fragment_maps:Sw,clearcoat_pars_fragment:Mw,iridescence_pars_fragment:bw,opaque_fragment:Ew,packing:Tw,premultiplied_alpha_fragment:Aw,project_vertex:ww,dithering_fragment:Cw,dithering_pars_fragment:Rw,roughnessmap_fragment:Pw,roughnessmap_pars_fragment:Lw,shadowmap_pars_fragment:Dw,shadowmap_pars_vertex:Iw,shadowmap_vertex:Fw,shadowmask_pars_fragment:Uw,skinbase_vertex:Nw,skinning_pars_vertex:Ow,skinning_vertex:Bw,skinnormal_vertex:Vw,specularmap_fragment:kw,specularmap_pars_fragment:zw,tonemapping_fragment:Gw,tonemapping_pars_fragment:Hw,transmission_fragment:Ww,transmission_pars_fragment:$w,uv_pars_fragment:Xw,uv_pars_vertex:qw,uv_vertex:Yw,worldpos_vertex:jw,background_vert:Kw,background_frag:Zw,backgroundCube_vert:Jw,backgroundCube_frag:Qw,cube_vert:eC,cube_frag:tC,depth_vert:nC,depth_frag:iC,distance_vert:sC,distance_frag:rC,equirect_vert:aC,equirect_frag:oC,linedashed_vert:lC,linedashed_frag:cC,meshbasic_vert:uC,meshbasic_frag:hC,meshlambert_vert:dC,meshlambert_frag:fC,meshmatcap_vert:pC,meshmatcap_frag:mC,meshnormal_vert:gC,meshnormal_frag:vC,meshphong_vert:_C,meshphong_frag:xC,meshphysical_vert:yC,meshphysical_frag:SC,meshtoon_vert:MC,meshtoon_frag:bC,points_vert:EC,points_frag:TC,shadow_vert:AC,shadow_frag:wC,sprite_vert:CC,sprite_frag:RC},pe={common:{diffuse:{value:new mt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xe}},envmap:{envMap:{value:null},envMapRotation:{value:new Xe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xe},normalScale:{value:new nt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new mt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new mt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0},uvTransform:{value:new Xe}},sprite:{diffuse:{value:new mt(16777215)},opacity:{value:1},center:{value:new nt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xe},alphaMap:{value:null},alphaMapTransform:{value:new Xe},alphaTest:{value:0}}},Nn={basic:{uniforms:jt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:jt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new mt(0)}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:jt([pe.common,pe.specularmap,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,pe.lights,{emissive:{value:new mt(0)},specular:{value:new mt(1118481)},shininess:{value:30}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:jt([pe.common,pe.envmap,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.roughnessmap,pe.metalnessmap,pe.fog,pe.lights,{emissive:{value:new mt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:jt([pe.common,pe.aomap,pe.lightmap,pe.emissivemap,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.gradientmap,pe.fog,pe.lights,{emissive:{value:new mt(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:jt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,pe.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:jt([pe.points,pe.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:jt([pe.common,pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:jt([pe.common,pe.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:jt([pe.common,pe.bumpmap,pe.normalmap,pe.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:jt([pe.sprite,pe.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new Xe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Xe}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distance:{uniforms:jt([pe.common,pe.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distance_vert,fragmentShader:qe.distance_frag},shadow:{uniforms:jt([pe.lights,pe.fog,{color:{value:new mt(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};Nn.physical={uniforms:jt([Nn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xe},clearcoatNormalScale:{value:new nt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xe},sheen:{value:0},sheenColor:{value:new mt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xe},transmissionSamplerSize:{value:new nt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xe},attenuationDistance:{value:0},attenuationColor:{value:new mt(0)},specularColor:{value:new mt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xe},anisotropyVector:{value:new nt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xe}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};const $r={r:0,b:0,g:0},Fi=new Ki,PC=new Ut;function LC(n,e,t,i,s,r,a){const o=new mt(0);let l=r===!0?0:1,c,u,h=null,d=0,f=null;function g(y){let S=y.isScene===!0?y.background:null;return S&&S.isTexture&&(S=(y.backgroundBlurriness>0?t:e).get(S)),S}function v(y){let S=!1;const E=g(y);E===null?p(o,l):E&&E.isColor&&(p(E,1),S=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||S)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(y,S){const E=g(S);E&&(E.isCubeTexture||E.mapping===Ra)?(u===void 0&&(u=new qn(new vr(1,1,1),new Rn({name:"BackgroundCubeMaterial",uniforms:Es(Nn.backgroundCube.uniforms),vertexShader:Nn.backgroundCube.vertexShader,fragmentShader:Nn.backgroundCube.fragmentShader,side:an,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(T,w,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Fi.copy(S.backgroundRotation),Fi.x*=-1,Fi.y*=-1,Fi.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Fi.y*=-1,Fi.z*=-1),u.material.uniforms.envMap.value=E,u.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(PC.makeRotationFromEuler(Fi)),u.material.toneMapped=tt.getTransfer(E.colorSpace)!==ft,(h!==E||d!==E.version||f!==n.toneMapping)&&(u.material.needsUpdate=!0,h=E,d=E.version,f=n.toneMapping),u.layers.enableAll(),y.unshift(u,u.geometry,u.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new qn(new _r(2,2),new Rn({name:"BackgroundMaterial",uniforms:Es(Nn.background.uniforms),vertexShader:Nn.background.vertexShader,fragmentShader:Nn.background.fragmentShader,side:Ai,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=tt.getTransfer(E.colorSpace)!==ft,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(h!==E||d!==E.version||f!==n.toneMapping)&&(c.material.needsUpdate=!0,h=E,d=E.version,f=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function p(y,S){y.getRGB($r,Tm(n)),i.buffers.color.setClear($r.r,$r.g,$r.b,S,a)}function M(){u!==void 0&&(u.geometry.dispose(),u.material.dispose(),u=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,S=1){o.set(y),l=S,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,p(o,l)},render:v,addToRenderList:m,dispose:M}}function DC(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let r=s,a=!1;function o(b,P,k,B,N){let j=!1;const q=h(B,k,P);r!==q&&(r=q,c(r.object)),j=f(b,B,k,N),j&&g(b,B,k,N),N!==null&&e.update(N,n.ELEMENT_ARRAY_BUFFER),(j||a)&&(a=!1,S(b,P,k,B),N!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(N).buffer))}function l(){return n.createVertexArray()}function c(b){return n.bindVertexArray(b)}function u(b){return n.deleteVertexArray(b)}function h(b,P,k){const B=k.wireframe===!0;let N=i[b.id];N===void 0&&(N={},i[b.id]=N);let j=N[P.id];j===void 0&&(j={},N[P.id]=j);let q=j[B];return q===void 0&&(q=d(l()),j[B]=q),q}function d(b){const P=[],k=[],B=[];for(let N=0;N<t;N++)P[N]=0,k[N]=0,B[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:k,attributeDivisors:B,object:b,attributes:{},index:null}}function f(b,P,k,B){const N=r.attributes,j=P.attributes;let q=0;const X=k.getAttributes();for(const Q in X)if(X[Q].location>=0){const oe=N[Q];let _e=j[Q];if(_e===void 0&&(Q==="instanceMatrix"&&b.instanceMatrix&&(_e=b.instanceMatrix),Q==="instanceColor"&&b.instanceColor&&(_e=b.instanceColor)),oe===void 0||oe.attribute!==_e||_e&&oe.data!==_e.data)return!0;q++}return r.attributesNum!==q||r.index!==B}function g(b,P,k,B){const N={},j=P.attributes;let q=0;const X=k.getAttributes();for(const Q in X)if(X[Q].location>=0){let oe=j[Q];oe===void 0&&(Q==="instanceMatrix"&&b.instanceMatrix&&(oe=b.instanceMatrix),Q==="instanceColor"&&b.instanceColor&&(oe=b.instanceColor));const _e={};_e.attribute=oe,oe&&oe.data&&(_e.data=oe.data),N[Q]=_e,q++}r.attributes=N,r.attributesNum=q,r.index=B}function v(){const b=r.newAttributes;for(let P=0,k=b.length;P<k;P++)b[P]=0}function m(b){p(b,0)}function p(b,P){const k=r.newAttributes,B=r.enabledAttributes,N=r.attributeDivisors;k[b]=1,B[b]===0&&(n.enableVertexAttribArray(b),B[b]=1),N[b]!==P&&(n.vertexAttribDivisor(b,P),N[b]=P)}function M(){const b=r.newAttributes,P=r.enabledAttributes;for(let k=0,B=P.length;k<B;k++)P[k]!==b[k]&&(n.disableVertexAttribArray(k),P[k]=0)}function y(b,P,k,B,N,j,q){q===!0?n.vertexAttribIPointer(b,P,k,N,j):n.vertexAttribPointer(b,P,k,B,N,j)}function S(b,P,k,B){v();const N=B.attributes,j=k.getAttributes(),q=P.defaultAttributeValues;for(const X in j){const Q=j[X];if(Q.location>=0){let ce=N[X];if(ce===void 0&&(X==="instanceMatrix"&&b.instanceMatrix&&(ce=b.instanceMatrix),X==="instanceColor"&&b.instanceColor&&(ce=b.instanceColor)),ce!==void 0){const oe=ce.normalized,_e=ce.itemSize,$e=e.get(ce);if($e===void 0)continue;const We=$e.buffer,xt=$e.type,ot=$e.bytesPerElement,J=xt===n.INT||xt===n.UNSIGNED_INT||ce.gpuType===Nc;if(ce.isInterleavedBufferAttribute){const ie=ce.data,Me=ie.stride,ke=ce.offset;if(ie.isInstancedInterleavedBuffer){for(let Re=0;Re<Q.locationSize;Re++)p(Q.location+Re,ie.meshPerAttribute);b.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let Re=0;Re<Q.locationSize;Re++)m(Q.location+Re);n.bindBuffer(n.ARRAY_BUFFER,We);for(let Re=0;Re<Q.locationSize;Re++)y(Q.location+Re,_e/Q.locationSize,xt,oe,Me*ot,(ke+_e/Q.locationSize*Re)*ot,J)}else{if(ce.isInstancedBufferAttribute){for(let ie=0;ie<Q.locationSize;ie++)p(Q.location+ie,ce.meshPerAttribute);b.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let ie=0;ie<Q.locationSize;ie++)m(Q.location+ie);n.bindBuffer(n.ARRAY_BUFFER,We);for(let ie=0;ie<Q.locationSize;ie++)y(Q.location+ie,_e/Q.locationSize,xt,oe,_e*ot,_e/Q.locationSize*ie*ot,J)}}else if(q!==void 0){const oe=q[X];if(oe!==void 0)switch(oe.length){case 2:n.vertexAttrib2fv(Q.location,oe);break;case 3:n.vertexAttrib3fv(Q.location,oe);break;case 4:n.vertexAttrib4fv(Q.location,oe);break;default:n.vertexAttrib1fv(Q.location,oe)}}}}M()}function E(){R();for(const b in i){const P=i[b];for(const k in P){const B=P[k];for(const N in B)u(B[N].object),delete B[N];delete P[k]}delete i[b]}}function T(b){if(i[b.id]===void 0)return;const P=i[b.id];for(const k in P){const B=P[k];for(const N in B)u(B[N].object),delete B[N];delete P[k]}delete i[b.id]}function w(b){for(const P in i){const k=i[P];if(k[b.id]===void 0)continue;const B=k[b.id];for(const N in B)u(B[N].object),delete B[N];delete k[b.id]}}function R(){_(),a=!0,r!==s&&(r=s,c(r.object))}function _(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:R,resetDefaultState:_,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:w,initAttributes:v,enableAttribute:m,disableUnusedAttributes:M}}function IC(n,e,t){let i;function s(c){i=c}function r(c,u){n.drawArrays(i,c,u),t.update(u,i,1)}function a(c,u,h){h!==0&&(n.drawArraysInstanced(i,c,u,h),t.update(u,i,h))}function o(c,u,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let f=0;for(let g=0;g<h;g++)f+=u[g];t.update(f,i,1)}function l(c,u,h,d){if(h===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<c.length;g++)a(c[g],u[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(i,c,0,u,0,d,0,h);let g=0;for(let v=0;v<h;v++)g+=u[v]*d[v];t.update(g,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function FC(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(w){return!(w!==Tn&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){const R=w===ci&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==vn&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==Bn&&!R)}function l(w){if(w==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(He("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),M=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),y=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=n.getParameter(n.MAX_SAMPLES),T=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:y,maxFragmentUniforms:S,maxSamples:E,samples:T}}function UC(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new Oi,o=new Xe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const f=h.length!==0||d||i!==0||s;return s=d,i=h.length,f},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,f){const g=h.clippingPlanes,v=h.clipIntersection,m=h.clipShadows,p=n.get(h);if(!s||g===null||g.length===0||r&&!m)r?u(null):c();else{const M=r?0:i,y=M*4;let S=p.clippingState||null;l.value=S,S=u(g,d,y,f);for(let E=0;E!==y;++E)S[E]=t[E];p.clippingState=S,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,f,g){const v=h!==null?h.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const p=f+v*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let y=0,S=f;y!==v;++y,S+=4)a.copy(h[y]).applyMatrix4(M,o),a.normal.toArray(m,S),m[S+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function NC(n){let e=new WeakMap;function t(a,o){return o===gl?a.mapping=ji:o===vl&&(a.mapping=Ss),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===gl||o===vl)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Cm(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}const Ei=4,fd=[.125,.215,.35,.446,.526,.582],ki=20,OC=256,Vs=new Xc,pd=new mt;let To=null,Ao=0,wo=0,Co=!1;const BC=new H;class md{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=BC}=r;To=this._renderer.getRenderTarget(),Ao=this._renderer.getActiveCubeFace(),wo=this._renderer.getActiveMipmapLevel(),Co=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_d(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=vd(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(To,Ao,wo),this._renderer.xr.enabled=Co,e.scissorTest=!1,hs(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ji||e.mapping===Ss?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),To=this._renderer.getRenderTarget(),Ao=this._renderer.getActiveCubeFace(),wo=this._renderer.getActiveMipmapLevel(),Co=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Xt,minFilter:Xt,generateMipmaps:!1,type:ci,format:Tn,colorSpace:bs,depthBuffer:!1},s=gd(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=gd(e,t,i);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=VC(r)),this._blurMaterial=zC(r,e,t),this._ggxMaterial=kC(r,e,t)}return s}_compileMaterial(e){const t=new qn(new fi,e);this._renderer.compile(t,Vs)}_sceneToCubeUV(e,t,i,s,r){const l=new En(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(pd),h.toneMapping=Gn,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(s),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new qn(new vr,new Mm({name:"PMREM.Background",side:an,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,m=v.material;let p=!1;const M=e.background;M?M.isColor&&(m.color.copy(M),e.background=null,p=!0):(m.color.copy(pd),p=!0);for(let y=0;y<6;y++){const S=y%3;S===0?(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+u[y],r.y,r.z)):S===1?(l.up.set(0,0,c[y]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+u[y],r.z)):(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+u[y]));const E=this._cubeSize;hs(s,S*E,y>2?E:0,E,E),h.setRenderTarget(s),p&&h.render(v,l),h.render(e,l)}h.toneMapping=f,h.autoClear=d,e.background=M}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===ji||e.mapping===Ss;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=_d()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=vd());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;hs(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Vs)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=i}_applyGGXFilter(e,t,i){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),h=Math.sqrt(c*c-u*u),d=0+c*1.25,f=h*d,{_lodMax:g}=this,v=this._sizeLods[i],m=3*v*(i>g-Ei?i-g+Ei:0),p=4*(this._cubeSize-v);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=g-t,hs(r,m,p,3*v,2*v),s.setRenderTarget(r),s.render(o,Vs),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-i,hs(e,m,p,3*v,2*v),s.setRenderTarget(e),s.render(o,Vs)}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&at("blur direction must be either latitudinal or longitudinal!");const u=3,h=this._lodMeshes[s];h.material=c;const d=c.uniforms,f=this._sizeLods[i]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*ki-1),v=r/g,m=isFinite(r)?1+Math.floor(u*v):ki;m>ki&&He(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ki}`);const p=[];let M=0;for(let w=0;w<ki;++w){const R=w/v,_=Math.exp(-R*R/2);p.push(_),w===0?M+=_:w<m&&(M+=2*_)}for(let w=0;w<p.length;w++)p[w]=p[w]/M;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:y}=this;d.dTheta.value=g,d.mipInt.value=y-i;const S=this._sizeLods[s],E=3*S*(s>y-Ei?s-y+Ei:0),T=4*(this._cubeSize-S);hs(t,E,T,3*S,2*S),l.setRenderTarget(t),l.render(h,Vs)}}function VC(n){const e=[],t=[],i=[];let s=n;const r=n-Ei+1+fd.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>n-Ei?l=fd[a-n+Ei-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],f=6,g=6,v=3,m=2,p=1,M=new Float32Array(v*g*f),y=new Float32Array(m*g*f),S=new Float32Array(p*g*f);for(let T=0;T<f;T++){const w=T%3*2/3-1,R=T>2?0:-1,_=[w,R,0,w+2/3,R,0,w+2/3,R+1,0,w,R,0,w+2/3,R+1,0,w,R+1,0];M.set(_,v*g*T),y.set(d,m*g*T);const b=[T,T,T,T,T,T];S.set(b,p*g*T)}const E=new fi;E.setAttribute("position",new Wn(M,v)),E.setAttribute("uv",new Wn(y,m)),E.setAttribute("faceIndex",new Wn(S,p)),i.push(new qn(E,null)),s>Ei&&s--}return{lodMeshes:i,sizeLods:e,sigmas:t}}function gd(n,e,t){const i=new Hn(n,e,t);return i.texture.mapping=Ra,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function hs(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function kC(n,e,t){return new Rn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:OC,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:La(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function zC(n,e,t){const i=new Float32Array(ki),s=new H(0,1,0);return new Rn({name:"SphericalGaussianBlur",defines:{n:ki,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:La(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function vd(){return new Rn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:La(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function _d(){return new Rn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:La(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ni,depthTest:!1,depthWrite:!1})}function La(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function GC(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===gl||l===vl,u=l===ji||l===Ss;if(c||u){let h=e.get(o);const d=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return t===null&&(t=new md(n)),h=c?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const f=o.image;return c&&f&&f.height>0||u&&f&&s(f)?(t===null&&(t=new md(n)),h=c?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function s(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function HC(n){const e={};function t(i){if(e[i]!==void 0)return e[i];const s=n.getExtension(i);return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&sr("WebGLRenderer: "+i+" extension not supported."),s}}}function WC(n,e,t,i){const s={},r=new WeakMap;function a(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete s[d.id];const f=r.get(d);f&&(e.remove(f),r.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(h,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,t.memory.geometries++),d}function l(h){const d=h.attributes;for(const f in d)e.update(d[f],n.ARRAY_BUFFER)}function c(h){const d=[],f=h.index,g=h.attributes.position;let v=0;if(f!==null){const M=f.array;v=f.version;for(let y=0,S=M.length;y<S;y+=3){const E=M[y+0],T=M[y+1],w=M[y+2];d.push(E,T,T,w,w,E)}}else if(g!==void 0){const M=g.array;v=g.version;for(let y=0,S=M.length/3-1;y<S;y+=3){const E=y+0,T=y+1,w=y+2;d.push(E,T,T,w,w,E)}}else return;const m=new(vm(d)?Em:bm)(d,1);m.version=v;const p=r.get(h);p&&e.remove(p),r.set(h,m)}function u(h){const d=r.get(h);if(d){const f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return r.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function $C(n,e,t){let i;function s(d){i=d}let r,a;function o(d){r=d.type,a=d.bytesPerElement}function l(d,f){n.drawElements(i,f,r,d*a),t.update(f,i,1)}function c(d,f,g){g!==0&&(n.drawElementsInstanced(i,f,r,d*a,g),t.update(f,i,g))}function u(d,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,i,1)}function h(d,f,g,v){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)c(d[p]/a,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,r,d,0,v,0,g);let p=0;for(let M=0;M<g;M++)p+=f[M]*v[M];t.update(p,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function XC(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:at("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function qC(n,e,t){const i=new WeakMap,s=new Ct;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(o);if(d===void 0||d.count!==h){let _=function(){w.dispose(),i.delete(o),o.removeEventListener("dispose",_)};d!==void 0&&d.texture.dispose();const f=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],p=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let y=0;f===!0&&(y=1),g===!0&&(y=2),v===!0&&(y=3);let S=o.attributes.position.count*y,E=1;S>e.maxTextureSize&&(E=Math.ceil(S/e.maxTextureSize),S=e.maxTextureSize);const T=new Float32Array(S*E*4*h),w=new _m(T,S,E,h);w.type=Bn,w.needsUpdate=!0;const R=y*4;for(let b=0;b<h;b++){const P=m[b],k=p[b],B=M[b],N=S*E*4*b;for(let j=0;j<P.count;j++){const q=j*R;f===!0&&(s.fromBufferAttribute(P,j),T[N+q+0]=s.x,T[N+q+1]=s.y,T[N+q+2]=s.z,T[N+q+3]=0),g===!0&&(s.fromBufferAttribute(k,j),T[N+q+4]=s.x,T[N+q+5]=s.y,T[N+q+6]=s.z,T[N+q+7]=0),v===!0&&(s.fromBufferAttribute(B,j),T[N+q+8]=s.x,T[N+q+9]=s.y,T[N+q+10]=s.z,T[N+q+11]=B.itemSize===4?s.w:1)}}d={count:h,texture:w,size:new nt(S,E)},i.set(o,d),o.addEventListener("dispose",_)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let f=0;for(let v=0;v<c.length;v++)f+=c[v];const g=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:r}}function YC(n,e,t,i){let s=new WeakMap;function r(l){const c=i.render.frame,u=l.geometry,h=e.get(l,u);if(s.get(h)!==c&&(e.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return h}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const jC={[nm]:"LINEAR_TONE_MAPPING",[im]:"REINHARD_TONE_MAPPING",[sm]:"CINEON_TONE_MAPPING",[rm]:"ACES_FILMIC_TONE_MAPPING",[om]:"AGX_TONE_MAPPING",[lm]:"NEUTRAL_TONE_MAPPING",[am]:"CUSTOM_TONE_MAPPING"};function KC(n,e,t,i,s){const r=new Hn(e,t,{type:n,depthBuffer:i,stencilBuffer:s}),a=new Hn(e,t,{type:ci,depthBuffer:!1,stencilBuffer:!1}),o=new fi;o.setAttribute("position",new si([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new si([0,2,0,0,2,0],2));const l=new WT({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new qn(o,l),u=new Xc(-1,1,1,-1,0,1);let h=null,d=null,f=!1,g,v=null,m=[],p=!1;this.setSize=function(M,y){r.setSize(M,y),a.setSize(M,y);for(let S=0;S<m.length;S++){const E=m[S];E.setSize&&E.setSize(M,y)}},this.setEffects=function(M){m=M,p=m.length>0&&m[0].isRenderPass===!0;const y=r.width,S=r.height;for(let E=0;E<m.length;E++){const T=m[E];T.setSize&&T.setSize(y,S)}},this.begin=function(M,y){if(f||M.toneMapping===Gn&&m.length===0)return!1;if(v=y,y!==null){const S=y.width,E=y.height;(r.width!==S||r.height!==E)&&this.setSize(S,E)}return p===!1&&M.setRenderTarget(r),g=M.toneMapping,M.toneMapping=Gn,!0},this.hasRenderPass=function(){return p},this.end=function(M,y){M.toneMapping=g,f=!0;let S=r,E=a;for(let T=0;T<m.length;T++){const w=m[T];if(w.enabled!==!1&&(w.render(M,E,S,y),w.needsSwap!==!1)){const R=S;S=E,E=R}}if(h!==M.outputColorSpace||d!==M.toneMapping){h=M.outputColorSpace,d=M.toneMapping,l.defines={},tt.getTransfer(h)===ft&&(l.defines.SRGB_TRANSFER="");const T=jC[d];T&&(l.defines[T]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=S.texture,M.setRenderTarget(v),M.render(c,u),v=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){r.dispose(),a.dispose(),o.dispose(),l.dispose()}}const Dm=new Jt,Ql=new rr(1,1),Im=new _m,Fm=new xT,Um=new wm,xd=[],yd=[],Sd=new Float32Array(16),Md=new Float32Array(9),bd=new Float32Array(4);function Ps(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=xd[s];if(r===void 0&&(r=new Float32Array(s),xd[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function Ot(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Bt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Da(n,e){let t=yd[e];t===void 0&&(t=new Int32Array(e),yd[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function ZC(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function JC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ot(t,e))return;n.uniform2fv(this.addr,e),Bt(t,e)}}function QC(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ot(t,e))return;n.uniform3fv(this.addr,e),Bt(t,e)}}function eR(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ot(t,e))return;n.uniform4fv(this.addr,e),Bt(t,e)}}function tR(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ot(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Bt(t,e)}else{if(Ot(t,i))return;bd.set(i),n.uniformMatrix2fv(this.addr,!1,bd),Bt(t,i)}}function nR(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ot(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Bt(t,e)}else{if(Ot(t,i))return;Md.set(i),n.uniformMatrix3fv(this.addr,!1,Md),Bt(t,i)}}function iR(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ot(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Bt(t,e)}else{if(Ot(t,i))return;Sd.set(i),n.uniformMatrix4fv(this.addr,!1,Sd),Bt(t,i)}}function sR(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function rR(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ot(t,e))return;n.uniform2iv(this.addr,e),Bt(t,e)}}function aR(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ot(t,e))return;n.uniform3iv(this.addr,e),Bt(t,e)}}function oR(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ot(t,e))return;n.uniform4iv(this.addr,e),Bt(t,e)}}function lR(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function cR(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ot(t,e))return;n.uniform2uiv(this.addr,e),Bt(t,e)}}function uR(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ot(t,e))return;n.uniform3uiv(this.addr,e),Bt(t,e)}}function hR(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ot(t,e))return;n.uniform4uiv(this.addr,e),Bt(t,e)}}function dR(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Ql.compareFunction=t.isReversedDepthBuffer()?Hc:Gc,r=Ql):r=Dm,t.setTexture2D(e||r,s)}function fR(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||Fm,s)}function pR(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||Um,s)}function mR(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||Im,s)}function gR(n){switch(n){case 5126:return ZC;case 35664:return JC;case 35665:return QC;case 35666:return eR;case 35674:return tR;case 35675:return nR;case 35676:return iR;case 5124:case 35670:return sR;case 35667:case 35671:return rR;case 35668:case 35672:return aR;case 35669:case 35673:return oR;case 5125:return lR;case 36294:return cR;case 36295:return uR;case 36296:return hR;case 35678:case 36198:case 36298:case 36306:case 35682:return dR;case 35679:case 36299:case 36307:return fR;case 35680:case 36300:case 36308:case 36293:return pR;case 36289:case 36303:case 36311:case 36292:return mR}}function vR(n,e){n.uniform1fv(this.addr,e)}function _R(n,e){const t=Ps(e,this.size,2);n.uniform2fv(this.addr,t)}function xR(n,e){const t=Ps(e,this.size,3);n.uniform3fv(this.addr,t)}function yR(n,e){const t=Ps(e,this.size,4);n.uniform4fv(this.addr,t)}function SR(n,e){const t=Ps(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function MR(n,e){const t=Ps(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function bR(n,e){const t=Ps(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function ER(n,e){n.uniform1iv(this.addr,e)}function TR(n,e){n.uniform2iv(this.addr,e)}function AR(n,e){n.uniform3iv(this.addr,e)}function wR(n,e){n.uniform4iv(this.addr,e)}function CR(n,e){n.uniform1uiv(this.addr,e)}function RR(n,e){n.uniform2uiv(this.addr,e)}function PR(n,e){n.uniform3uiv(this.addr,e)}function LR(n,e){n.uniform4uiv(this.addr,e)}function DR(n,e,t){const i=this.cache,s=e.length,r=Da(t,s);Ot(i,r)||(n.uniform1iv(this.addr,r),Bt(i,r));let a;this.type===n.SAMPLER_2D_SHADOW?a=Ql:a=Dm;for(let o=0;o!==s;++o)t.setTexture2D(e[o]||a,r[o])}function IR(n,e,t){const i=this.cache,s=e.length,r=Da(t,s);Ot(i,r)||(n.uniform1iv(this.addr,r),Bt(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||Fm,r[a])}function FR(n,e,t){const i=this.cache,s=e.length,r=Da(t,s);Ot(i,r)||(n.uniform1iv(this.addr,r),Bt(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||Um,r[a])}function UR(n,e,t){const i=this.cache,s=e.length,r=Da(t,s);Ot(i,r)||(n.uniform1iv(this.addr,r),Bt(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Im,r[a])}function NR(n){switch(n){case 5126:return vR;case 35664:return _R;case 35665:return xR;case 35666:return yR;case 35674:return SR;case 35675:return MR;case 35676:return bR;case 5124:case 35670:return ER;case 35667:case 35671:return TR;case 35668:case 35672:return AR;case 35669:case 35673:return wR;case 5125:return CR;case 36294:return RR;case 36295:return PR;case 36296:return LR;case 35678:case 36198:case 36298:case 36306:case 35682:return DR;case 35679:case 36299:case 36307:return IR;case 35680:case 36300:case 36308:case 36293:return FR;case 36289:case 36303:case 36311:case 36292:return UR}}class OR{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=gR(t.type)}}class BR{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=NR(t.type)}}class VR{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const Ro=/(\w+)(\])?(\[|\.)?/g;function Ed(n,e){n.seq.push(e),n.map[e.id]=e}function kR(n,e,t){const i=n.name,s=i.length;for(Ro.lastIndex=0;;){const r=Ro.exec(i),a=Ro.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Ed(t,c===void 0?new OR(o,n,e):new BR(o,n,e));break}else{let h=t.map[o];h===void 0&&(h=new VR(o),Ed(t,h)),t=h}}}class sa{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);kR(o,l,this)}const s=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(a):r.push(a);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function Td(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const zR=37297;let GR=0;function HR(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Ad=new Xe;function WR(n){tt._getMatrix(Ad,tt.workingColorSpace,n);const e=`mat3( ${Ad.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(n)){case va:return[e,"LinearTransferOETF"];case ft:return[e,"sRGBTransferOETF"];default:return He("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function wd(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+HR(n.getShaderSource(e),o)}else return r}function $R(n,e){const t=WR(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const XR={[nm]:"Linear",[im]:"Reinhard",[sm]:"Cineon",[rm]:"ACESFilmic",[om]:"AgX",[lm]:"Neutral",[am]:"Custom"};function qR(n,e){const t=XR[e];return t===void 0?(He("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Xr=new H;function YR(){tt.getLuminanceCoefficients(Xr);const n=Xr.x.toFixed(4),e=Xr.y.toFixed(4),t=Xr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function jR(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ws).join(`
`)}function KR(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function ZR(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function Ws(n){return n!==""}function Cd(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Rd(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const JR=/^[ \t]*#include +<([\w\d./]+)>/gm;function ec(n){return n.replace(JR,eP)}const QR=new Map;function eP(n,e){let t=qe[e];if(t===void 0){const i=QR.get(e);if(i!==void 0)t=qe[i],He('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return ec(t)}const tP=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Pd(n){return n.replace(tP,nP)}function nP(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Ld(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const iP={[Qr]:"SHADOWMAP_TYPE_PCF",[Hs]:"SHADOWMAP_TYPE_VSM"};function sP(n){return iP[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const rP={[ji]:"ENVMAP_TYPE_CUBE",[Ss]:"ENVMAP_TYPE_CUBE",[Ra]:"ENVMAP_TYPE_CUBE_UV"};function aP(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":rP[n.envMapMode]||"ENVMAP_TYPE_CUBE"}const oP={[Ss]:"ENVMAP_MODE_REFRACTION"};function lP(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":oP[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}const cP={[tm]:"ENVMAP_BLENDING_MULTIPLY",[Q1]:"ENVMAP_BLENDING_MIX",[eT]:"ENVMAP_BLENDING_ADD"};function uP(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":cP[n.combine]||"ENVMAP_BLENDING_NONE"}function hP(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function dP(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=sP(t),c=aP(t),u=lP(t),h=uP(t),d=hP(t),f=jR(t),g=KR(r),v=s.createProgram();let m,p,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ws).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Ws).join(`
`),p.length>0&&(p+=`
`)):(m=[Ld(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ws).join(`
`),p=[Ld(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Gn?"#define TONE_MAPPING":"",t.toneMapping!==Gn?qe.tonemapping_pars_fragment:"",t.toneMapping!==Gn?qR("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,$R("linearToOutputTexel",t.outputColorSpace),YR(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ws).join(`
`)),a=ec(a),a=Cd(a,t),a=Rd(a,t),o=ec(o),o=Cd(o,t),o=Rd(o,t),a=Pd(a),o=Pd(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===qh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===qh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const y=M+m+a,S=M+p+o,E=Td(s,s.VERTEX_SHADER,y),T=Td(s,s.FRAGMENT_SHADER,S);s.attachShader(v,E),s.attachShader(v,T),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function w(P){if(n.debug.checkShaderErrors){const k=s.getProgramInfoLog(v)||"",B=s.getShaderInfoLog(E)||"",N=s.getShaderInfoLog(T)||"",j=k.trim(),q=B.trim(),X=N.trim();let Q=!0,ce=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(Q=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,E,T);else{const oe=wd(s,E,"vertex"),_e=wd(s,T,"fragment");at("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+j+`
`+oe+`
`+_e)}else j!==""?He("WebGLProgram: Program Info Log:",j):(q===""||X==="")&&(ce=!1);ce&&(P.diagnostics={runnable:Q,programLog:j,vertexShader:{log:q,prefix:m},fragmentShader:{log:X,prefix:p}})}s.deleteShader(E),s.deleteShader(T),R=new sa(s,v),_=ZR(s,v)}let R;this.getUniforms=function(){return R===void 0&&w(this),R};let _;this.getAttributes=function(){return _===void 0&&w(this),_};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(v,zR)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=GR++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=T,this}let fP=0;class pP{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new mP(e),t.set(e,i)),i}}class mP{constructor(e){this.id=fP++,this.code=e,this.usedTimes=0}}function gP(n,e,t,i,s,r,a){const o=new ym,l=new pP,c=new Set,u=[],h=new Map,d=s.logarithmicDepthBuffer;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(_){return c.add(_),_===0?"uv":`uv${_}`}function m(_,b,P,k,B){const N=k.fog,j=B.geometry,q=_.isMeshStandardMaterial?k.environment:null,X=(_.isMeshStandardMaterial?t:e).get(_.envMap||q),Q=X&&X.mapping===Ra?X.image.height:null,ce=g[_.type];_.precision!==null&&(f=s.getMaxPrecision(_.precision),f!==_.precision&&He("WebGLProgram.getParameters:",_.precision,"not supported, using",f,"instead."));const oe=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,_e=oe!==void 0?oe.length:0;let $e=0;j.morphAttributes.position!==void 0&&($e=1),j.morphAttributes.normal!==void 0&&($e=2),j.morphAttributes.color!==void 0&&($e=3);let We,xt,ot,J;if(ce){const ht=Nn[ce];We=ht.vertexShader,xt=ht.fragmentShader}else We=_.vertexShader,xt=_.fragmentShader,l.update(_),ot=l.getVertexShaderID(_),J=l.getFragmentShaderID(_);const ie=n.getRenderTarget(),Me=n.state.buffers.depth.getReversed(),ke=B.isInstancedMesh===!0,Re=B.isBatchedMesh===!0,st=!!_.map,Vt=!!_.matcap,et=!!X,ut=!!_.aoMap,gt=!!_.lightMap,Ye=!!_.bumpMap,Rt=!!_.normalMap,D=!!_.displacementMap,Pt=!!_.emissiveMap,lt=!!_.metalnessMap,yt=!!_.roughnessMap,Le=_.anisotropy>0,C=_.clearcoat>0,x=_.dispersion>0,U=_.iridescence>0,Z=_.sheen>0,ne=_.transmission>0,Y=Le&&!!_.anisotropyMap,Ie=C&&!!_.clearcoatMap,ue=C&&!!_.clearcoatNormalMap,Pe=C&&!!_.clearcoatRoughnessMap,ze=U&&!!_.iridescenceMap,re=U&&!!_.iridescenceThicknessMap,de=Z&&!!_.sheenColorMap,Ce=Z&&!!_.sheenRoughnessMap,De=!!_.specularMap,he=!!_.specularColorMap,je=!!_.specularIntensityMap,F=ne&&!!_.transmissionMap,ge=ne&&!!_.thicknessMap,ae=!!_.gradientMap,be=!!_.alphaMap,se=_.alphaTest>0,te=!!_.alphaHash,le=!!_.extensions;let Ge=Gn;_.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(Ge=n.toneMapping);const St={shaderID:ce,shaderType:_.type,shaderName:_.name,vertexShader:We,fragmentShader:xt,defines:_.defines,customVertexShaderID:ot,customFragmentShaderID:J,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:f,batching:Re,batchingColor:Re&&B._colorsTexture!==null,instancing:ke,instancingColor:ke&&B.instanceColor!==null,instancingMorph:ke&&B.morphTexture!==null,outputColorSpace:ie===null?n.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:bs,alphaToCoverage:!!_.alphaToCoverage,map:st,matcap:Vt,envMap:et,envMapMode:et&&X.mapping,envMapCubeUVHeight:Q,aoMap:ut,lightMap:gt,bumpMap:Ye,normalMap:Rt,displacementMap:D,emissiveMap:Pt,normalMapObjectSpace:Rt&&_.normalMapType===sT,normalMapTangentSpace:Rt&&_.normalMapType===iT,metalnessMap:lt,roughnessMap:yt,anisotropy:Le,anisotropyMap:Y,clearcoat:C,clearcoatMap:Ie,clearcoatNormalMap:ue,clearcoatRoughnessMap:Pe,dispersion:x,iridescence:U,iridescenceMap:ze,iridescenceThicknessMap:re,sheen:Z,sheenColorMap:de,sheenRoughnessMap:Ce,specularMap:De,specularColorMap:he,specularIntensityMap:je,transmission:ne,transmissionMap:F,thicknessMap:ge,gradientMap:ae,opaque:_.transparent===!1&&_.blending===gs&&_.alphaToCoverage===!1,alphaMap:be,alphaTest:se,alphaHash:te,combine:_.combine,mapUv:st&&v(_.map.channel),aoMapUv:ut&&v(_.aoMap.channel),lightMapUv:gt&&v(_.lightMap.channel),bumpMapUv:Ye&&v(_.bumpMap.channel),normalMapUv:Rt&&v(_.normalMap.channel),displacementMapUv:D&&v(_.displacementMap.channel),emissiveMapUv:Pt&&v(_.emissiveMap.channel),metalnessMapUv:lt&&v(_.metalnessMap.channel),roughnessMapUv:yt&&v(_.roughnessMap.channel),anisotropyMapUv:Y&&v(_.anisotropyMap.channel),clearcoatMapUv:Ie&&v(_.clearcoatMap.channel),clearcoatNormalMapUv:ue&&v(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Pe&&v(_.clearcoatRoughnessMap.channel),iridescenceMapUv:ze&&v(_.iridescenceMap.channel),iridescenceThicknessMapUv:re&&v(_.iridescenceThicknessMap.channel),sheenColorMapUv:de&&v(_.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&v(_.sheenRoughnessMap.channel),specularMapUv:De&&v(_.specularMap.channel),specularColorMapUv:he&&v(_.specularColorMap.channel),specularIntensityMapUv:je&&v(_.specularIntensityMap.channel),transmissionMapUv:F&&v(_.transmissionMap.channel),thicknessMapUv:ge&&v(_.thicknessMap.channel),alphaMapUv:be&&v(_.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(Rt||Le),vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!j.attributes.uv&&(st||be),fog:!!N,useFog:_.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:_.flatShading===!0&&_.wireframe===!1,sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Me,skinning:B.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:_e,morphTextureStride:$e,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:_.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ge,decodeVideoTexture:st&&_.map.isVideoTexture===!0&&tt.getTransfer(_.map.colorSpace)===ft,decodeVideoTextureEmissive:Pt&&_.emissiveMap.isVideoTexture===!0&&tt.getTransfer(_.emissiveMap.colorSpace)===ft,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===ei,flipSided:_.side===an,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:le&&_.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(le&&_.extensions.multiDraw===!0||Re)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return St.vertexUv1s=c.has(1),St.vertexUv2s=c.has(2),St.vertexUv3s=c.has(3),c.clear(),St}function p(_){const b=[];if(_.shaderID?b.push(_.shaderID):(b.push(_.customVertexShaderID),b.push(_.customFragmentShaderID)),_.defines!==void 0)for(const P in _.defines)b.push(P),b.push(_.defines[P]);return _.isRawShaderMaterial===!1&&(M(b,_),y(b,_),b.push(n.outputColorSpace)),b.push(_.customProgramCacheKey),b.join()}function M(_,b){_.push(b.precision),_.push(b.outputColorSpace),_.push(b.envMapMode),_.push(b.envMapCubeUVHeight),_.push(b.mapUv),_.push(b.alphaMapUv),_.push(b.lightMapUv),_.push(b.aoMapUv),_.push(b.bumpMapUv),_.push(b.normalMapUv),_.push(b.displacementMapUv),_.push(b.emissiveMapUv),_.push(b.metalnessMapUv),_.push(b.roughnessMapUv),_.push(b.anisotropyMapUv),_.push(b.clearcoatMapUv),_.push(b.clearcoatNormalMapUv),_.push(b.clearcoatRoughnessMapUv),_.push(b.iridescenceMapUv),_.push(b.iridescenceThicknessMapUv),_.push(b.sheenColorMapUv),_.push(b.sheenRoughnessMapUv),_.push(b.specularMapUv),_.push(b.specularColorMapUv),_.push(b.specularIntensityMapUv),_.push(b.transmissionMapUv),_.push(b.thicknessMapUv),_.push(b.combine),_.push(b.fogExp2),_.push(b.sizeAttenuation),_.push(b.morphTargetsCount),_.push(b.morphAttributeCount),_.push(b.numDirLights),_.push(b.numPointLights),_.push(b.numSpotLights),_.push(b.numSpotLightMaps),_.push(b.numHemiLights),_.push(b.numRectAreaLights),_.push(b.numDirLightShadows),_.push(b.numPointLightShadows),_.push(b.numSpotLightShadows),_.push(b.numSpotLightShadowsWithMaps),_.push(b.numLightProbes),_.push(b.shadowMapType),_.push(b.toneMapping),_.push(b.numClippingPlanes),_.push(b.numClipIntersection),_.push(b.depthPacking)}function y(_,b){o.disableAll(),b.instancing&&o.enable(0),b.instancingColor&&o.enable(1),b.instancingMorph&&o.enable(2),b.matcap&&o.enable(3),b.envMap&&o.enable(4),b.normalMapObjectSpace&&o.enable(5),b.normalMapTangentSpace&&o.enable(6),b.clearcoat&&o.enable(7),b.iridescence&&o.enable(8),b.alphaTest&&o.enable(9),b.vertexColors&&o.enable(10),b.vertexAlphas&&o.enable(11),b.vertexUv1s&&o.enable(12),b.vertexUv2s&&o.enable(13),b.vertexUv3s&&o.enable(14),b.vertexTangents&&o.enable(15),b.anisotropy&&o.enable(16),b.alphaHash&&o.enable(17),b.batching&&o.enable(18),b.dispersion&&o.enable(19),b.batchingColor&&o.enable(20),b.gradientMap&&o.enable(21),_.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),_.push(o.mask)}function S(_){const b=g[_.type];let P;if(b){const k=Nn[b];P=IT.clone(k.uniforms)}else P=_.uniforms;return P}function E(_,b){let P=h.get(b);return P!==void 0?++P.usedTimes:(P=new dP(n,b,_,r),u.push(P),h.set(b,P)),P}function T(_){if(--_.usedTimes===0){const b=u.indexOf(_);u[b]=u[u.length-1],u.pop(),h.delete(_.cacheKey),_.destroy()}}function w(_){l.remove(_)}function R(){l.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:S,acquireProgram:E,releaseProgram:T,releaseShaderCache:w,programs:u,dispose:R}}function vP(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function _P(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Dd(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Id(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(h,d,f,g,v,m){let p=n[e];return p===void 0?(p={id:h.id,object:h,geometry:d,material:f,groupOrder:g,renderOrder:h.renderOrder,z:v,group:m},n[e]=p):(p.id=h.id,p.object=h,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=h.renderOrder,p.z=v,p.group=m),e++,p}function o(h,d,f,g,v,m){const p=a(h,d,f,g,v,m);f.transmission>0?i.push(p):f.transparent===!0?s.push(p):t.push(p)}function l(h,d,f,g,v,m){const p=a(h,d,f,g,v,m);f.transmission>0?i.unshift(p):f.transparent===!0?s.unshift(p):t.unshift(p)}function c(h,d){t.length>1&&t.sort(h||_P),i.length>1&&i.sort(d||Dd),s.length>1&&s.sort(d||Dd)}function u(){for(let h=e,d=n.length;h<d;h++){const f=n[h];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:l,finish:u,sort:c}}function xP(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new Id,n.set(i,[a])):s>=r.length?(a=new Id,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function yP(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new H,color:new mt};break;case"SpotLight":t={position:new H,direction:new H,color:new mt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new H,color:new mt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new H,skyColor:new mt,groundColor:new mt};break;case"RectAreaLight":t={color:new mt,position:new H,halfWidth:new H,halfHeight:new H};break}return n[e.id]=t,t}}}function SP(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let MP=0;function bP(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function EP(n){const e=new yP,t=SP(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new H);const s=new H,r=new Ut,a=new Ut;function o(c){let u=0,h=0,d=0;for(let _=0;_<9;_++)i.probe[_].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,M=0,y=0,S=0,E=0,T=0,w=0;c.sort(bP);for(let _=0,b=c.length;_<b;_++){const P=c[_],k=P.color,B=P.intensity,N=P.distance;let j=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===Ms?j=P.shadow.map.texture:j=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)u+=k.r*B,h+=k.g*B,d+=k.b*B;else if(P.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(P.sh.coefficients[q],B);w++}else if(P.isDirectionalLight){const q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const X=P.shadow,Q=t.get(P);Q.shadowIntensity=X.intensity,Q.shadowBias=X.bias,Q.shadowNormalBias=X.normalBias,Q.shadowRadius=X.radius,Q.shadowMapSize=X.mapSize,i.directionalShadow[f]=Q,i.directionalShadowMap[f]=j,i.directionalShadowMatrix[f]=P.shadow.matrix,M++}i.directional[f]=q,f++}else if(P.isSpotLight){const q=e.get(P);q.position.setFromMatrixPosition(P.matrixWorld),q.color.copy(k).multiplyScalar(B),q.distance=N,q.coneCos=Math.cos(P.angle),q.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),q.decay=P.decay,i.spot[v]=q;const X=P.shadow;if(P.map&&(i.spotLightMap[E]=P.map,E++,X.updateMatrices(P),P.castShadow&&T++),i.spotLightMatrix[v]=X.matrix,P.castShadow){const Q=t.get(P);Q.shadowIntensity=X.intensity,Q.shadowBias=X.bias,Q.shadowNormalBias=X.normalBias,Q.shadowRadius=X.radius,Q.shadowMapSize=X.mapSize,i.spotShadow[v]=Q,i.spotShadowMap[v]=j,S++}v++}else if(P.isRectAreaLight){const q=e.get(P);q.color.copy(k).multiplyScalar(B),q.halfWidth.set(P.width*.5,0,0),q.halfHeight.set(0,P.height*.5,0),i.rectArea[m]=q,m++}else if(P.isPointLight){const q=e.get(P);if(q.color.copy(P.color).multiplyScalar(P.intensity),q.distance=P.distance,q.decay=P.decay,P.castShadow){const X=P.shadow,Q=t.get(P);Q.shadowIntensity=X.intensity,Q.shadowBias=X.bias,Q.shadowNormalBias=X.normalBias,Q.shadowRadius=X.radius,Q.shadowMapSize=X.mapSize,Q.shadowCameraNear=X.camera.near,Q.shadowCameraFar=X.camera.far,i.pointShadow[g]=Q,i.pointShadowMap[g]=j,i.pointShadowMatrix[g]=P.shadow.matrix,y++}i.point[g]=q,g++}else if(P.isHemisphereLight){const q=e.get(P);q.skyColor.copy(P.color).multiplyScalar(B),q.groundColor.copy(P.groundColor).multiplyScalar(B),i.hemi[p]=q,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=pe.LTC_FLOAT_1,i.rectAreaLTC2=pe.LTC_FLOAT_2):(i.rectAreaLTC1=pe.LTC_HALF_1,i.rectAreaLTC2=pe.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const R=i.hash;(R.directionalLength!==f||R.pointLength!==g||R.spotLength!==v||R.rectAreaLength!==m||R.hemiLength!==p||R.numDirectionalShadows!==M||R.numPointShadows!==y||R.numSpotShadows!==S||R.numSpotMaps!==E||R.numLightProbes!==w)&&(i.directional.length=f,i.spot.length=v,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=S+E-T,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=w,R.directionalLength=f,R.pointLength=g,R.spotLength=v,R.rectAreaLength=m,R.hemiLength=p,R.numDirectionalShadows=M,R.numPointShadows=y,R.numSpotShadows=S,R.numSpotMaps=E,R.numLightProbes=w,i.version=MP++)}function l(c,u){let h=0,d=0,f=0,g=0,v=0;const m=u.matrixWorldInverse;for(let p=0,M=c.length;p<M;p++){const y=c[p];if(y.isDirectionalLight){const S=i.directional[h];S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),h++}else if(y.isSpotLight){const S=i.spot[f];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),f++}else if(y.isRectAreaLight){const S=i.rectArea[g];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(m),a.identity(),r.copy(y.matrixWorld),r.premultiply(m),a.extractRotation(r),S.halfWidth.set(y.width*.5,0,0),S.halfHeight.set(0,y.height*.5,0),S.halfWidth.applyMatrix4(a),S.halfHeight.applyMatrix4(a),g++}else if(y.isPointLight){const S=i.point[d];S.position.setFromMatrixPosition(y.matrixWorld),S.position.applyMatrix4(m),d++}else if(y.isHemisphereLight){const S=i.hemi[v];S.direction.setFromMatrixPosition(y.matrixWorld),S.direction.transformDirection(m),v++}}}return{setup:o,setupView:l,state:i}}function Fd(n){const e=new EP(n),t=[],i=[];function s(u){c.camera=u,t.length=0,i.length=0}function r(u){t.push(u)}function a(u){i.push(u)}function o(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function TP(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Fd(n),e.set(s,[o])):r>=a.length?(o=new Fd(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const AP=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,wP=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,CP=[new H(1,0,0),new H(-1,0,0),new H(0,1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1)],RP=[new H(0,-1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1),new H(0,-1,0),new H(0,-1,0)],Ud=new Ut,ks=new H,Po=new H;function PP(n,e,t){let i=new Rm;const s=new nt,r=new nt,a=new Ct,o=new $T,l=new XT,c={},u=t.maxTextureSize,h={[Ai]:an,[an]:Ai,[ei]:ei},d=new Rn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new nt},radius:{value:4}},vertexShader:AP,fragmentShader:wP}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new fi;g.setAttribute("position",new Wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new qn(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Qr;let p=this.type;this.render=function(T,w,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;T.type===F1&&(He("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),T.type=Qr);const _=n.getRenderTarget(),b=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),k=n.state;k.setBlending(ni),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const B=p!==this.type;B&&w.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(j=>j.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,j=T.length;N<j;N++){const q=T[N],X=q.shadow;if(X===void 0){He("WebGLShadowMap:",q,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);const Q=X.getFrameExtents();if(s.multiply(Q),r.copy(X.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/Q.x),s.x=r.x*Q.x,X.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/Q.y),s.y=r.y*Q.y,X.mapSize.y=r.y)),X.map===null||B===!0){if(X.map!==null&&(X.map.depthTexture!==null&&(X.map.depthTexture.dispose(),X.map.depthTexture=null),X.map.dispose()),this.type===Hs){if(q.isPointLight){He("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}X.map=new Hn(s.x,s.y,{format:Ms,type:ci,minFilter:Xt,magFilter:Xt,generateMipmaps:!1}),X.map.texture.name=q.name+".shadowMap",X.map.depthTexture=new rr(s.x,s.y,Bn),X.map.depthTexture.name=q.name+".shadowMapDepth",X.map.depthTexture.format=ui,X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=Ht,X.map.depthTexture.magFilter=Ht}else{q.isPointLight?(X.map=new Cm(s.x),X.map.depthTexture=new HT(s.x,Xn)):(X.map=new Hn(s.x,s.y),X.map.depthTexture=new rr(s.x,s.y,Xn)),X.map.depthTexture.name=q.name+".shadowMap",X.map.depthTexture.format=ui;const oe=n.state.buffers.depth.getReversed();this.type===Qr?(X.map.depthTexture.compareFunction=oe?Hc:Gc,X.map.depthTexture.minFilter=Xt,X.map.depthTexture.magFilter=Xt):(X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=Ht,X.map.depthTexture.magFilter=Ht)}X.camera.updateProjectionMatrix()}const ce=X.map.isWebGLCubeRenderTarget?6:1;for(let oe=0;oe<ce;oe++){if(X.map.isWebGLCubeRenderTarget)n.setRenderTarget(X.map,oe),n.clear();else{oe===0&&(n.setRenderTarget(X.map),n.clear());const _e=X.getViewport(oe);a.set(r.x*_e.x,r.y*_e.y,r.x*_e.z,r.y*_e.w),k.viewport(a)}if(q.isPointLight){const _e=X.camera,$e=X.matrix,We=q.distance||_e.far;We!==_e.far&&(_e.far=We,_e.updateProjectionMatrix()),ks.setFromMatrixPosition(q.matrixWorld),_e.position.copy(ks),Po.copy(_e.position),Po.add(CP[oe]),_e.up.copy(RP[oe]),_e.lookAt(Po),_e.updateMatrixWorld(),$e.makeTranslation(-ks.x,-ks.y,-ks.z),Ud.multiplyMatrices(_e.projectionMatrix,_e.matrixWorldInverse),X._frustum.setFromProjectionMatrix(Ud,_e.coordinateSystem,_e.reversedDepth)}else X.updateMatrices(q);i=X.getFrustum(),S(w,R,X.camera,q,this.type)}X.isPointLightShadow!==!0&&this.type===Hs&&M(X,R),X.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(_,b,P)};function M(T,w){const R=e.update(v);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Hn(s.x,s.y,{format:Ms,type:ci})),d.uniforms.shadow_pass.value=T.map.depthTexture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(w,null,R,d,v,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(w,null,R,f,v,null)}function y(T,w,R,_){let b=null;const P=R.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(P!==void 0)b=P;else if(b=R.isPointLight===!0?l:o,n.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){const k=b.uuid,B=w.uuid;let N=c[k];N===void 0&&(N={},c[k]=N);let j=N[B];j===void 0&&(j=b.clone(),N[B]=j,w.addEventListener("dispose",E)),b=j}if(b.visible=w.visible,b.wireframe=w.wireframe,_===Hs?b.side=w.shadowSide!==null?w.shadowSide:w.side:b.side=w.shadowSide!==null?w.shadowSide:h[w.side],b.alphaMap=w.alphaMap,b.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,b.map=w.map,b.clipShadows=w.clipShadows,b.clippingPlanes=w.clippingPlanes,b.clipIntersection=w.clipIntersection,b.displacementMap=w.displacementMap,b.displacementScale=w.displacementScale,b.displacementBias=w.displacementBias,b.wireframeLinewidth=w.wireframeLinewidth,b.linewidth=w.linewidth,R.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const k=n.properties.get(b);k.light=R}return b}function S(T,w,R,_,b){if(T.visible===!1)return;if(T.layers.test(w.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===Hs)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,T.matrixWorld);const B=e.update(T),N=T.material;if(Array.isArray(N)){const j=B.groups;for(let q=0,X=j.length;q<X;q++){const Q=j[q],ce=N[Q.materialIndex];if(ce&&ce.visible){const oe=y(T,ce,_,b);T.onBeforeShadow(n,T,w,R,B,oe,Q),n.renderBufferDirect(R,null,B,oe,T,Q),T.onAfterShadow(n,T,w,R,B,oe,Q)}}}else if(N.visible){const j=y(T,N,_,b);T.onBeforeShadow(n,T,w,R,B,j,null),n.renderBufferDirect(R,null,B,j,T,null),T.onAfterShadow(n,T,w,R,B,j,null)}}const k=T.children;for(let B=0,N=k.length;B<N;B++)S(k[B],w,R,_,b)}function E(T){T.target.removeEventListener("dispose",E);for(const R in c){const _=c[R],b=T.target.uuid;b in _&&(_[b].dispose(),delete _[b])}}}const LP={[cl]:ul,[hl]:pl,[dl]:ml,[ys]:fl,[ul]:cl,[pl]:hl,[ml]:dl,[fl]:ys};function DP(n,e){function t(){let F=!1;const ge=new Ct;let ae=null;const be=new Ct(0,0,0,0);return{setMask:function(se){ae!==se&&!F&&(n.colorMask(se,se,se,se),ae=se)},setLocked:function(se){F=se},setClear:function(se,te,le,Ge,St){St===!0&&(se*=Ge,te*=Ge,le*=Ge),ge.set(se,te,le,Ge),be.equals(ge)===!1&&(n.clearColor(se,te,le,Ge),be.copy(ge))},reset:function(){F=!1,ae=null,be.set(-1,0,0,0)}}}function i(){let F=!1,ge=!1,ae=null,be=null,se=null;return{setReversed:function(te){if(ge!==te){const le=e.get("EXT_clip_control");te?le.clipControlEXT(le.LOWER_LEFT_EXT,le.ZERO_TO_ONE_EXT):le.clipControlEXT(le.LOWER_LEFT_EXT,le.NEGATIVE_ONE_TO_ONE_EXT),ge=te;const Ge=se;se=null,this.setClear(Ge)}},getReversed:function(){return ge},setTest:function(te){te?ie(n.DEPTH_TEST):Me(n.DEPTH_TEST)},setMask:function(te){ae!==te&&!F&&(n.depthMask(te),ae=te)},setFunc:function(te){if(ge&&(te=LP[te]),be!==te){switch(te){case cl:n.depthFunc(n.NEVER);break;case ul:n.depthFunc(n.ALWAYS);break;case hl:n.depthFunc(n.LESS);break;case ys:n.depthFunc(n.LEQUAL);break;case dl:n.depthFunc(n.EQUAL);break;case fl:n.depthFunc(n.GEQUAL);break;case pl:n.depthFunc(n.GREATER);break;case ml:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}be=te}},setLocked:function(te){F=te},setClear:function(te){se!==te&&(ge&&(te=1-te),n.clearDepth(te),se=te)},reset:function(){F=!1,ae=null,be=null,se=null,ge=!1}}}function s(){let F=!1,ge=null,ae=null,be=null,se=null,te=null,le=null,Ge=null,St=null;return{setTest:function(ht){F||(ht?ie(n.STENCIL_TEST):Me(n.STENCIL_TEST))},setMask:function(ht){ge!==ht&&!F&&(n.stencilMask(ht),ge=ht)},setFunc:function(ht,Dn,Yn){(ae!==ht||be!==Dn||se!==Yn)&&(n.stencilFunc(ht,Dn,Yn),ae=ht,be=Dn,se=Yn)},setOp:function(ht,Dn,Yn){(te!==ht||le!==Dn||Ge!==Yn)&&(n.stencilOp(ht,Dn,Yn),te=ht,le=Dn,Ge=Yn)},setLocked:function(ht){F=ht},setClear:function(ht){St!==ht&&(n.clearStencil(ht),St=ht)},reset:function(){F=!1,ge=null,ae=null,be=null,se=null,te=null,le=null,Ge=null,St=null}}}const r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap;let u={},h={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,M=null,y=null,S=null,E=null,T=null,w=new mt(0,0,0),R=0,_=!1,b=null,P=null,k=null,B=null,N=null;const j=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,X=0;const Q=n.getParameter(n.VERSION);Q.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(Q)[1]),q=X>=1):Q.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),q=X>=2);let ce=null,oe={};const _e=n.getParameter(n.SCISSOR_BOX),$e=n.getParameter(n.VIEWPORT),We=new Ct().fromArray(_e),xt=new Ct().fromArray($e);function ot(F,ge,ae,be){const se=new Uint8Array(4),te=n.createTexture();n.bindTexture(F,te),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let le=0;le<ae;le++)F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY?n.texImage3D(ge,0,n.RGBA,1,1,be,0,n.RGBA,n.UNSIGNED_BYTE,se):n.texImage2D(ge+le,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,se);return te}const J={};J[n.TEXTURE_2D]=ot(n.TEXTURE_2D,n.TEXTURE_2D,1),J[n.TEXTURE_CUBE_MAP]=ot(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[n.TEXTURE_2D_ARRAY]=ot(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),J[n.TEXTURE_3D]=ot(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ie(n.DEPTH_TEST),a.setFunc(ys),Ye(!1),Rt(zh),ie(n.CULL_FACE),ut(ni);function ie(F){u[F]!==!0&&(n.enable(F),u[F]=!0)}function Me(F){u[F]!==!1&&(n.disable(F),u[F]=!1)}function ke(F,ge){return h[F]!==ge?(n.bindFramebuffer(F,ge),h[F]=ge,F===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=ge),F===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=ge),!0):!1}function Re(F,ge){let ae=f,be=!1;if(F){ae=d.get(ge),ae===void 0&&(ae=[],d.set(ge,ae));const se=F.textures;if(ae.length!==se.length||ae[0]!==n.COLOR_ATTACHMENT0){for(let te=0,le=se.length;te<le;te++)ae[te]=n.COLOR_ATTACHMENT0+te;ae.length=se.length,be=!0}}else ae[0]!==n.BACK&&(ae[0]=n.BACK,be=!0);be&&n.drawBuffers(ae)}function st(F){return g!==F?(n.useProgram(F),g=F,!0):!1}const Vt={[Vi]:n.FUNC_ADD,[N1]:n.FUNC_SUBTRACT,[O1]:n.FUNC_REVERSE_SUBTRACT};Vt[B1]=n.MIN,Vt[V1]=n.MAX;const et={[k1]:n.ZERO,[z1]:n.ONE,[G1]:n.SRC_COLOR,[ol]:n.SRC_ALPHA,[Y1]:n.SRC_ALPHA_SATURATE,[X1]:n.DST_COLOR,[W1]:n.DST_ALPHA,[H1]:n.ONE_MINUS_SRC_COLOR,[ll]:n.ONE_MINUS_SRC_ALPHA,[q1]:n.ONE_MINUS_DST_COLOR,[$1]:n.ONE_MINUS_DST_ALPHA,[j1]:n.CONSTANT_COLOR,[K1]:n.ONE_MINUS_CONSTANT_COLOR,[Z1]:n.CONSTANT_ALPHA,[J1]:n.ONE_MINUS_CONSTANT_ALPHA};function ut(F,ge,ae,be,se,te,le,Ge,St,ht){if(F===ni){v===!0&&(Me(n.BLEND),v=!1);return}if(v===!1&&(ie(n.BLEND),v=!0),F!==U1){if(F!==m||ht!==_){if((p!==Vi||S!==Vi)&&(n.blendEquation(n.FUNC_ADD),p=Vi,S=Vi),ht)switch(F){case gs:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Gh:n.blendFunc(n.ONE,n.ONE);break;case Hh:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Wh:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:at("WebGLState: Invalid blending: ",F);break}else switch(F){case gs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Gh:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Hh:at("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Wh:at("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:at("WebGLState: Invalid blending: ",F);break}M=null,y=null,E=null,T=null,w.set(0,0,0),R=0,m=F,_=ht}return}se=se||ge,te=te||ae,le=le||be,(ge!==p||se!==S)&&(n.blendEquationSeparate(Vt[ge],Vt[se]),p=ge,S=se),(ae!==M||be!==y||te!==E||le!==T)&&(n.blendFuncSeparate(et[ae],et[be],et[te],et[le]),M=ae,y=be,E=te,T=le),(Ge.equals(w)===!1||St!==R)&&(n.blendColor(Ge.r,Ge.g,Ge.b,St),w.copy(Ge),R=St),m=F,_=!1}function gt(F,ge){F.side===ei?Me(n.CULL_FACE):ie(n.CULL_FACE);let ae=F.side===an;ge&&(ae=!ae),Ye(ae),F.blending===gs&&F.transparent===!1?ut(ni):ut(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);const be=F.stencilWrite;o.setTest(be),be&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Pt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?ie(n.SAMPLE_ALPHA_TO_COVERAGE):Me(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ye(F){b!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),b=F)}function Rt(F){F!==D1?(ie(n.CULL_FACE),F!==P&&(F===zh?n.cullFace(n.BACK):F===I1?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Me(n.CULL_FACE),P=F}function D(F){F!==k&&(q&&n.lineWidth(F),k=F)}function Pt(F,ge,ae){F?(ie(n.POLYGON_OFFSET_FILL),(B!==ge||N!==ae)&&(n.polygonOffset(ge,ae),B=ge,N=ae)):Me(n.POLYGON_OFFSET_FILL)}function lt(F){F?ie(n.SCISSOR_TEST):Me(n.SCISSOR_TEST)}function yt(F){F===void 0&&(F=n.TEXTURE0+j-1),ce!==F&&(n.activeTexture(F),ce=F)}function Le(F,ge,ae){ae===void 0&&(ce===null?ae=n.TEXTURE0+j-1:ae=ce);let be=oe[ae];be===void 0&&(be={type:void 0,texture:void 0},oe[ae]=be),(be.type!==F||be.texture!==ge)&&(ce!==ae&&(n.activeTexture(ae),ce=ae),n.bindTexture(F,ge||J[F]),be.type=F,be.texture=ge)}function C(){const F=oe[ce];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function x(){try{n.compressedTexImage2D(...arguments)}catch(F){at("WebGLState:",F)}}function U(){try{n.compressedTexImage3D(...arguments)}catch(F){at("WebGLState:",F)}}function Z(){try{n.texSubImage2D(...arguments)}catch(F){at("WebGLState:",F)}}function ne(){try{n.texSubImage3D(...arguments)}catch(F){at("WebGLState:",F)}}function Y(){try{n.compressedTexSubImage2D(...arguments)}catch(F){at("WebGLState:",F)}}function Ie(){try{n.compressedTexSubImage3D(...arguments)}catch(F){at("WebGLState:",F)}}function ue(){try{n.texStorage2D(...arguments)}catch(F){at("WebGLState:",F)}}function Pe(){try{n.texStorage3D(...arguments)}catch(F){at("WebGLState:",F)}}function ze(){try{n.texImage2D(...arguments)}catch(F){at("WebGLState:",F)}}function re(){try{n.texImage3D(...arguments)}catch(F){at("WebGLState:",F)}}function de(F){We.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),We.copy(F))}function Ce(F){xt.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),xt.copy(F))}function De(F,ge){let ae=c.get(ge);ae===void 0&&(ae=new WeakMap,c.set(ge,ae));let be=ae.get(F);be===void 0&&(be=n.getUniformBlockIndex(ge,F.name),ae.set(F,be))}function he(F,ge){const be=c.get(ge).get(F);l.get(ge)!==be&&(n.uniformBlockBinding(ge,be,F.__bindingPointIndex),l.set(ge,be))}function je(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},ce=null,oe={},h={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,M=null,y=null,S=null,E=null,T=null,w=new mt(0,0,0),R=0,_=!1,b=null,P=null,k=null,B=null,N=null,We.set(0,0,n.canvas.width,n.canvas.height),xt.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ie,disable:Me,bindFramebuffer:ke,drawBuffers:Re,useProgram:st,setBlending:ut,setMaterial:gt,setFlipSided:Ye,setCullFace:Rt,setLineWidth:D,setPolygonOffset:Pt,setScissorTest:lt,activeTexture:yt,bindTexture:Le,unbindTexture:C,compressedTexImage2D:x,compressedTexImage3D:U,texImage2D:ze,texImage3D:re,updateUBOMapping:De,uniformBlockBinding:he,texStorage2D:ue,texStorage3D:Pe,texSubImage2D:Z,texSubImage3D:ne,compressedTexSubImage2D:Y,compressedTexSubImage3D:Ie,scissor:de,viewport:Ce,reset:je}}function IP(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new nt,u=new WeakMap;let h;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,x){return f?new OffscreenCanvas(C,x):xa("canvas")}function v(C,x,U){let Z=1;const ne=Le(C);if((ne.width>U||ne.height>U)&&(Z=U/Math.max(ne.width,ne.height)),Z<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const Y=Math.floor(Z*ne.width),Ie=Math.floor(Z*ne.height);h===void 0&&(h=g(Y,Ie));const ue=x?g(Y,Ie):h;return ue.width=Y,ue.height=Ie,ue.getContext("2d").drawImage(C,0,0,Y,Ie),He("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+Y+"x"+Ie+")."),ue}else return"data"in C&&He("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),C;return C}function m(C){return C.generateMipmaps}function p(C){n.generateMipmap(C)}function M(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(C,x,U,Z,ne=!1){if(C!==null){if(n[C]!==void 0)return n[C];He("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let Y=x;if(x===n.RED&&(U===n.FLOAT&&(Y=n.R32F),U===n.HALF_FLOAT&&(Y=n.R16F),U===n.UNSIGNED_BYTE&&(Y=n.R8)),x===n.RED_INTEGER&&(U===n.UNSIGNED_BYTE&&(Y=n.R8UI),U===n.UNSIGNED_SHORT&&(Y=n.R16UI),U===n.UNSIGNED_INT&&(Y=n.R32UI),U===n.BYTE&&(Y=n.R8I),U===n.SHORT&&(Y=n.R16I),U===n.INT&&(Y=n.R32I)),x===n.RG&&(U===n.FLOAT&&(Y=n.RG32F),U===n.HALF_FLOAT&&(Y=n.RG16F),U===n.UNSIGNED_BYTE&&(Y=n.RG8)),x===n.RG_INTEGER&&(U===n.UNSIGNED_BYTE&&(Y=n.RG8UI),U===n.UNSIGNED_SHORT&&(Y=n.RG16UI),U===n.UNSIGNED_INT&&(Y=n.RG32UI),U===n.BYTE&&(Y=n.RG8I),U===n.SHORT&&(Y=n.RG16I),U===n.INT&&(Y=n.RG32I)),x===n.RGB_INTEGER&&(U===n.UNSIGNED_BYTE&&(Y=n.RGB8UI),U===n.UNSIGNED_SHORT&&(Y=n.RGB16UI),U===n.UNSIGNED_INT&&(Y=n.RGB32UI),U===n.BYTE&&(Y=n.RGB8I),U===n.SHORT&&(Y=n.RGB16I),U===n.INT&&(Y=n.RGB32I)),x===n.RGBA_INTEGER&&(U===n.UNSIGNED_BYTE&&(Y=n.RGBA8UI),U===n.UNSIGNED_SHORT&&(Y=n.RGBA16UI),U===n.UNSIGNED_INT&&(Y=n.RGBA32UI),U===n.BYTE&&(Y=n.RGBA8I),U===n.SHORT&&(Y=n.RGBA16I),U===n.INT&&(Y=n.RGBA32I)),x===n.RGB&&(U===n.UNSIGNED_INT_5_9_9_9_REV&&(Y=n.RGB9_E5),U===n.UNSIGNED_INT_10F_11F_11F_REV&&(Y=n.R11F_G11F_B10F)),x===n.RGBA){const Ie=ne?va:tt.getTransfer(Z);U===n.FLOAT&&(Y=n.RGBA32F),U===n.HALF_FLOAT&&(Y=n.RGBA16F),U===n.UNSIGNED_BYTE&&(Y=Ie===ft?n.SRGB8_ALPHA8:n.RGBA8),U===n.UNSIGNED_SHORT_4_4_4_4&&(Y=n.RGBA4),U===n.UNSIGNED_SHORT_5_5_5_1&&(Y=n.RGB5_A1)}return(Y===n.R16F||Y===n.R32F||Y===n.RG16F||Y===n.RG32F||Y===n.RGBA16F||Y===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Y}function S(C,x){let U;return C?x===null||x===Xn||x===ir?U=n.DEPTH24_STENCIL8:x===Bn?U=n.DEPTH32F_STENCIL8:x===nr&&(U=n.DEPTH24_STENCIL8,He("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===Xn||x===ir?U=n.DEPTH_COMPONENT24:x===Bn?U=n.DEPTH_COMPONENT32F:x===nr&&(U=n.DEPTH_COMPONENT16),U}function E(C,x){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Ht&&C.minFilter!==Xt?Math.log2(Math.max(x.width,x.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?x.mipmaps.length:1}function T(C){const x=C.target;x.removeEventListener("dispose",T),R(x),x.isVideoTexture&&u.delete(x)}function w(C){const x=C.target;x.removeEventListener("dispose",w),b(x)}function R(C){const x=i.get(C);if(x.__webglInit===void 0)return;const U=C.source,Z=d.get(U);if(Z){const ne=Z[x.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&_(C),Object.keys(Z).length===0&&d.delete(U)}i.remove(C)}function _(C){const x=i.get(C);n.deleteTexture(x.__webglTexture);const U=C.source,Z=d.get(U);delete Z[x.__cacheKey],a.memory.textures--}function b(C){const x=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let Z=0;Z<6;Z++){if(Array.isArray(x.__webglFramebuffer[Z]))for(let ne=0;ne<x.__webglFramebuffer[Z].length;ne++)n.deleteFramebuffer(x.__webglFramebuffer[Z][ne]);else n.deleteFramebuffer(x.__webglFramebuffer[Z]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[Z])}else{if(Array.isArray(x.__webglFramebuffer))for(let Z=0;Z<x.__webglFramebuffer.length;Z++)n.deleteFramebuffer(x.__webglFramebuffer[Z]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let Z=0;Z<x.__webglColorRenderbuffer.length;Z++)x.__webglColorRenderbuffer[Z]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[Z]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const U=C.textures;for(let Z=0,ne=U.length;Z<ne;Z++){const Y=i.get(U[Z]);Y.__webglTexture&&(n.deleteTexture(Y.__webglTexture),a.memory.textures--),i.remove(U[Z])}i.remove(C)}let P=0;function k(){P=0}function B(){const C=P;return C>=s.maxTextures&&He("WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),P+=1,C}function N(C){const x=[];return x.push(C.wrapS),x.push(C.wrapT),x.push(C.wrapR||0),x.push(C.magFilter),x.push(C.minFilter),x.push(C.anisotropy),x.push(C.internalFormat),x.push(C.format),x.push(C.type),x.push(C.generateMipmaps),x.push(C.premultiplyAlpha),x.push(C.flipY),x.push(C.unpackAlignment),x.push(C.colorSpace),x.join()}function j(C,x){const U=i.get(C);if(C.isVideoTexture&&lt(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&U.__version!==C.version){const Z=C.image;if(Z===null)He("WebGLRenderer: Texture marked for update but no image data found.");else if(Z.complete===!1)He("WebGLRenderer: Texture marked for update but image is incomplete");else{J(U,C,x);return}}else C.isExternalTexture&&(U.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,U.__webglTexture,n.TEXTURE0+x)}function q(C,x){const U=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&U.__version!==C.version){J(U,C,x);return}else C.isExternalTexture&&(U.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,U.__webglTexture,n.TEXTURE0+x)}function X(C,x){const U=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&U.__version!==C.version){J(U,C,x);return}t.bindTexture(n.TEXTURE_3D,U.__webglTexture,n.TEXTURE0+x)}function Q(C,x){const U=i.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&U.__version!==C.version){ie(U,C,x);return}t.bindTexture(n.TEXTURE_CUBE_MAP,U.__webglTexture,n.TEXTURE0+x)}const ce={[_l]:n.REPEAT,[ti]:n.CLAMP_TO_EDGE,[xl]:n.MIRRORED_REPEAT},oe={[Ht]:n.NEAREST,[tT]:n.NEAREST_MIPMAP_NEAREST,[Ar]:n.NEAREST_MIPMAP_LINEAR,[Xt]:n.LINEAR,[Qa]:n.LINEAR_MIPMAP_NEAREST,[Hi]:n.LINEAR_MIPMAP_LINEAR},_e={[rT]:n.NEVER,[uT]:n.ALWAYS,[aT]:n.LESS,[Gc]:n.LEQUAL,[oT]:n.EQUAL,[Hc]:n.GEQUAL,[lT]:n.GREATER,[cT]:n.NOTEQUAL};function $e(C,x){if(x.type===Bn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===Xt||x.magFilter===Qa||x.magFilter===Ar||x.magFilter===Hi||x.minFilter===Xt||x.minFilter===Qa||x.minFilter===Ar||x.minFilter===Hi)&&He("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,ce[x.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,ce[x.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,ce[x.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,oe[x.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,oe[x.minFilter]),x.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,_e[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Ht||x.minFilter!==Ar&&x.minFilter!==Hi||x.type===Bn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const U=e.get("EXT_texture_filter_anisotropic");n.texParameterf(C,U.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function We(C,x){let U=!1;C.__webglInit===void 0&&(C.__webglInit=!0,x.addEventListener("dispose",T));const Z=x.source;let ne=d.get(Z);ne===void 0&&(ne={},d.set(Z,ne));const Y=N(x);if(Y!==C.__cacheKey){ne[Y]===void 0&&(ne[Y]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,U=!0),ne[Y].usedTimes++;const Ie=ne[C.__cacheKey];Ie!==void 0&&(ne[C.__cacheKey].usedTimes--,Ie.usedTimes===0&&_(x)),C.__cacheKey=Y,C.__webglTexture=ne[Y].texture}return U}function xt(C,x,U){return Math.floor(Math.floor(C/U)/x)}function ot(C,x,U,Z){const Y=C.updateRanges;if(Y.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,U,Z,x.data);else{Y.sort((re,de)=>re.start-de.start);let Ie=0;for(let re=1;re<Y.length;re++){const de=Y[Ie],Ce=Y[re],De=de.start+de.count,he=xt(Ce.start,x.width,4),je=xt(de.start,x.width,4);Ce.start<=De+1&&he===je&&xt(Ce.start+Ce.count-1,x.width,4)===he?de.count=Math.max(de.count,Ce.start+Ce.count-de.start):(++Ie,Y[Ie]=Ce)}Y.length=Ie+1;const ue=n.getParameter(n.UNPACK_ROW_LENGTH),Pe=n.getParameter(n.UNPACK_SKIP_PIXELS),ze=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let re=0,de=Y.length;re<de;re++){const Ce=Y[re],De=Math.floor(Ce.start/4),he=Math.ceil(Ce.count/4),je=De%x.width,F=Math.floor(De/x.width),ge=he,ae=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,je),n.pixelStorei(n.UNPACK_SKIP_ROWS,F),t.texSubImage2D(n.TEXTURE_2D,0,je,F,ge,ae,U,Z,x.data)}C.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,ue),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Pe),n.pixelStorei(n.UNPACK_SKIP_ROWS,ze)}}function J(C,x,U){let Z=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(Z=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(Z=n.TEXTURE_3D);const ne=We(C,x),Y=x.source;t.bindTexture(Z,C.__webglTexture,n.TEXTURE0+U);const Ie=i.get(Y);if(Y.version!==Ie.__version||ne===!0){t.activeTexture(n.TEXTURE0+U);const ue=tt.getPrimaries(tt.workingColorSpace),Pe=x.colorSpace===Mi?null:tt.getPrimaries(x.colorSpace),ze=x.colorSpace===Mi||ue===Pe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ze);let re=v(x.image,!1,s.maxTextureSize);re=yt(x,re);const de=r.convert(x.format,x.colorSpace),Ce=r.convert(x.type);let De=y(x.internalFormat,de,Ce,x.colorSpace,x.isVideoTexture);$e(Z,x);let he;const je=x.mipmaps,F=x.isVideoTexture!==!0,ge=Ie.__version===void 0||ne===!0,ae=Y.dataReady,be=E(x,re);if(x.isDepthTexture)De=S(x.format===Wi,x.type),ge&&(F?t.texStorage2D(n.TEXTURE_2D,1,De,re.width,re.height):t.texImage2D(n.TEXTURE_2D,0,De,re.width,re.height,0,de,Ce,null));else if(x.isDataTexture)if(je.length>0){F&&ge&&t.texStorage2D(n.TEXTURE_2D,be,De,je[0].width,je[0].height);for(let se=0,te=je.length;se<te;se++)he=je[se],F?ae&&t.texSubImage2D(n.TEXTURE_2D,se,0,0,he.width,he.height,de,Ce,he.data):t.texImage2D(n.TEXTURE_2D,se,De,he.width,he.height,0,de,Ce,he.data);x.generateMipmaps=!1}else F?(ge&&t.texStorage2D(n.TEXTURE_2D,be,De,re.width,re.height),ae&&ot(x,re,de,Ce)):t.texImage2D(n.TEXTURE_2D,0,De,re.width,re.height,0,de,Ce,re.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){F&&ge&&t.texStorage3D(n.TEXTURE_2D_ARRAY,be,De,je[0].width,je[0].height,re.depth);for(let se=0,te=je.length;se<te;se++)if(he=je[se],x.format!==Tn)if(de!==null)if(F){if(ae)if(x.layerUpdates.size>0){const le=dd(he.width,he.height,x.format,x.type);for(const Ge of x.layerUpdates){const St=he.data.subarray(Ge*le/he.data.BYTES_PER_ELEMENT,(Ge+1)*le/he.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,se,0,0,Ge,he.width,he.height,1,de,St)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,se,0,0,0,he.width,he.height,re.depth,de,he.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,se,De,he.width,he.height,re.depth,0,he.data,0,0);else He("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else F?ae&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,se,0,0,0,he.width,he.height,re.depth,de,Ce,he.data):t.texImage3D(n.TEXTURE_2D_ARRAY,se,De,he.width,he.height,re.depth,0,de,Ce,he.data)}else{F&&ge&&t.texStorage2D(n.TEXTURE_2D,be,De,je[0].width,je[0].height);for(let se=0,te=je.length;se<te;se++)he=je[se],x.format!==Tn?de!==null?F?ae&&t.compressedTexSubImage2D(n.TEXTURE_2D,se,0,0,he.width,he.height,de,he.data):t.compressedTexImage2D(n.TEXTURE_2D,se,De,he.width,he.height,0,he.data):He("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):F?ae&&t.texSubImage2D(n.TEXTURE_2D,se,0,0,he.width,he.height,de,Ce,he.data):t.texImage2D(n.TEXTURE_2D,se,De,he.width,he.height,0,de,Ce,he.data)}else if(x.isDataArrayTexture)if(F){if(ge&&t.texStorage3D(n.TEXTURE_2D_ARRAY,be,De,re.width,re.height,re.depth),ae)if(x.layerUpdates.size>0){const se=dd(re.width,re.height,x.format,x.type);for(const te of x.layerUpdates){const le=re.data.subarray(te*se/re.data.BYTES_PER_ELEMENT,(te+1)*se/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,te,re.width,re.height,1,de,Ce,le)}x.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,de,Ce,re.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,De,re.width,re.height,re.depth,0,de,Ce,re.data);else if(x.isData3DTexture)F?(ge&&t.texStorage3D(n.TEXTURE_3D,be,De,re.width,re.height,re.depth),ae&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,de,Ce,re.data)):t.texImage3D(n.TEXTURE_3D,0,De,re.width,re.height,re.depth,0,de,Ce,re.data);else if(x.isFramebufferTexture){if(ge)if(F)t.texStorage2D(n.TEXTURE_2D,be,De,re.width,re.height);else{let se=re.width,te=re.height;for(let le=0;le<be;le++)t.texImage2D(n.TEXTURE_2D,le,De,se,te,0,de,Ce,null),se>>=1,te>>=1}}else if(je.length>0){if(F&&ge){const se=Le(je[0]);t.texStorage2D(n.TEXTURE_2D,be,De,se.width,se.height)}for(let se=0,te=je.length;se<te;se++)he=je[se],F?ae&&t.texSubImage2D(n.TEXTURE_2D,se,0,0,de,Ce,he):t.texImage2D(n.TEXTURE_2D,se,De,de,Ce,he);x.generateMipmaps=!1}else if(F){if(ge){const se=Le(re);t.texStorage2D(n.TEXTURE_2D,be,De,se.width,se.height)}ae&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,de,Ce,re)}else t.texImage2D(n.TEXTURE_2D,0,De,de,Ce,re);m(x)&&p(Z),Ie.__version=Y.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function ie(C,x,U){if(x.image.length!==6)return;const Z=We(C,x),ne=x.source;t.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+U);const Y=i.get(ne);if(ne.version!==Y.__version||Z===!0){t.activeTexture(n.TEXTURE0+U);const Ie=tt.getPrimaries(tt.workingColorSpace),ue=x.colorSpace===Mi?null:tt.getPrimaries(x.colorSpace),Pe=x.colorSpace===Mi||Ie===ue?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pe);const ze=x.isCompressedTexture||x.image[0].isCompressedTexture,re=x.image[0]&&x.image[0].isDataTexture,de=[];for(let te=0;te<6;te++)!ze&&!re?de[te]=v(x.image[te],!0,s.maxCubemapSize):de[te]=re?x.image[te].image:x.image[te],de[te]=yt(x,de[te]);const Ce=de[0],De=r.convert(x.format,x.colorSpace),he=r.convert(x.type),je=y(x.internalFormat,De,he,x.colorSpace),F=x.isVideoTexture!==!0,ge=Y.__version===void 0||Z===!0,ae=ne.dataReady;let be=E(x,Ce);$e(n.TEXTURE_CUBE_MAP,x);let se;if(ze){F&&ge&&t.texStorage2D(n.TEXTURE_CUBE_MAP,be,je,Ce.width,Ce.height);for(let te=0;te<6;te++){se=de[te].mipmaps;for(let le=0;le<se.length;le++){const Ge=se[le];x.format!==Tn?De!==null?F?ae&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,le,0,0,Ge.width,Ge.height,De,Ge.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,le,je,Ge.width,Ge.height,0,Ge.data):He("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,le,0,0,Ge.width,Ge.height,De,he,Ge.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,le,je,Ge.width,Ge.height,0,De,he,Ge.data)}}}else{if(se=x.mipmaps,F&&ge){se.length>0&&be++;const te=Le(de[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,be,je,te.width,te.height)}for(let te=0;te<6;te++)if(re){F?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,de[te].width,de[te].height,De,he,de[te].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,je,de[te].width,de[te].height,0,De,he,de[te].data);for(let le=0;le<se.length;le++){const St=se[le].image[te].image;F?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,le+1,0,0,St.width,St.height,De,he,St.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,le+1,je,St.width,St.height,0,De,he,St.data)}}else{F?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,De,he,de[te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,je,De,he,de[te]);for(let le=0;le<se.length;le++){const Ge=se[le];F?ae&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,le+1,0,0,De,he,Ge.image[te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,le+1,je,De,he,Ge.image[te])}}}m(x)&&p(n.TEXTURE_CUBE_MAP),Y.__version=ne.version,x.onUpdate&&x.onUpdate(x)}C.__version=x.version}function Me(C,x,U,Z,ne,Y){const Ie=r.convert(U.format,U.colorSpace),ue=r.convert(U.type),Pe=y(U.internalFormat,Ie,ue,U.colorSpace),ze=i.get(x),re=i.get(U);if(re.__renderTarget=x,!ze.__hasExternalTextures){const de=Math.max(1,x.width>>Y),Ce=Math.max(1,x.height>>Y);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,Y,Pe,de,Ce,x.depth,0,Ie,ue,null):t.texImage2D(ne,Y,Pe,de,Ce,0,Ie,ue,null)}t.bindFramebuffer(n.FRAMEBUFFER,C),Pt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Z,ne,re.__webglTexture,0,D(x)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Z,ne,re.__webglTexture,Y),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ke(C,x,U){if(n.bindRenderbuffer(n.RENDERBUFFER,C),x.depthBuffer){const Z=x.depthTexture,ne=Z&&Z.isDepthTexture?Z.type:null,Y=S(x.stencilBuffer,ne),Ie=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Pt(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,D(x),Y,x.width,x.height):U?n.renderbufferStorageMultisample(n.RENDERBUFFER,D(x),Y,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,Y,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ie,n.RENDERBUFFER,C)}else{const Z=x.textures;for(let ne=0;ne<Z.length;ne++){const Y=Z[ne],Ie=r.convert(Y.format,Y.colorSpace),ue=r.convert(Y.type),Pe=y(Y.internalFormat,Ie,ue,Y.colorSpace);Pt(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,D(x),Pe,x.width,x.height):U?n.renderbufferStorageMultisample(n.RENDERBUFFER,D(x),Pe,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,Pe,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Re(C,x,U){const Z=x.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,C),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ne=i.get(x.depthTexture);if(ne.__renderTarget=x,(!ne.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),Z){if(ne.__webglInit===void 0&&(ne.__webglInit=!0,x.depthTexture.addEventListener("dispose",T)),ne.__webglTexture===void 0){ne.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,ne.__webglTexture),$e(n.TEXTURE_CUBE_MAP,x.depthTexture);const ze=r.convert(x.depthTexture.format),re=r.convert(x.depthTexture.type);let de;x.depthTexture.format===ui?de=n.DEPTH_COMPONENT24:x.depthTexture.format===Wi&&(de=n.DEPTH24_STENCIL8);for(let Ce=0;Ce<6;Ce++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,0,de,x.width,x.height,0,ze,re,null)}}else j(x.depthTexture,0);const Y=ne.__webglTexture,Ie=D(x),ue=Z?n.TEXTURE_CUBE_MAP_POSITIVE_X+U:n.TEXTURE_2D,Pe=x.depthTexture.format===Wi?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(x.depthTexture.format===ui)Pt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Pe,ue,Y,0,Ie):n.framebufferTexture2D(n.FRAMEBUFFER,Pe,ue,Y,0);else if(x.depthTexture.format===Wi)Pt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Pe,ue,Y,0,Ie):n.framebufferTexture2D(n.FRAMEBUFFER,Pe,ue,Y,0);else throw new Error("Unknown depthTexture format")}function st(C){const x=i.get(C),U=C.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==C.depthTexture){const Z=C.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),Z){const ne=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,Z.removeEventListener("dispose",ne)};Z.addEventListener("dispose",ne),x.__depthDisposeCallback=ne}x.__boundDepthTexture=Z}if(C.depthTexture&&!x.__autoAllocateDepthBuffer)if(U)for(let Z=0;Z<6;Z++)Re(x.__webglFramebuffer[Z],C,Z);else{const Z=C.texture.mipmaps;Z&&Z.length>0?Re(x.__webglFramebuffer[0],C,0):Re(x.__webglFramebuffer,C,0)}else if(U){x.__webglDepthbuffer=[];for(let Z=0;Z<6;Z++)if(t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[Z]),x.__webglDepthbuffer[Z]===void 0)x.__webglDepthbuffer[Z]=n.createRenderbuffer(),ke(x.__webglDepthbuffer[Z],C,!1);else{const ne=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Y=x.__webglDepthbuffer[Z];n.bindRenderbuffer(n.RENDERBUFFER,Y),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,Y)}}else{const Z=C.texture.mipmaps;if(Z&&Z.length>0?t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),ke(x.__webglDepthbuffer,C,!1);else{const ne=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Y=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,Y),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,Y)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Vt(C,x,U){const Z=i.get(C);x!==void 0&&Me(Z.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),U!==void 0&&st(C)}function et(C){const x=C.texture,U=i.get(C),Z=i.get(x);C.addEventListener("dispose",w);const ne=C.textures,Y=C.isWebGLCubeRenderTarget===!0,Ie=ne.length>1;if(Ie||(Z.__webglTexture===void 0&&(Z.__webglTexture=n.createTexture()),Z.__version=x.version,a.memory.textures++),Y){U.__webglFramebuffer=[];for(let ue=0;ue<6;ue++)if(x.mipmaps&&x.mipmaps.length>0){U.__webglFramebuffer[ue]=[];for(let Pe=0;Pe<x.mipmaps.length;Pe++)U.__webglFramebuffer[ue][Pe]=n.createFramebuffer()}else U.__webglFramebuffer[ue]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){U.__webglFramebuffer=[];for(let ue=0;ue<x.mipmaps.length;ue++)U.__webglFramebuffer[ue]=n.createFramebuffer()}else U.__webglFramebuffer=n.createFramebuffer();if(Ie)for(let ue=0,Pe=ne.length;ue<Pe;ue++){const ze=i.get(ne[ue]);ze.__webglTexture===void 0&&(ze.__webglTexture=n.createTexture(),a.memory.textures++)}if(C.samples>0&&Pt(C)===!1){U.__webglMultisampledFramebuffer=n.createFramebuffer(),U.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,U.__webglMultisampledFramebuffer);for(let ue=0;ue<ne.length;ue++){const Pe=ne[ue];U.__webglColorRenderbuffer[ue]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,U.__webglColorRenderbuffer[ue]);const ze=r.convert(Pe.format,Pe.colorSpace),re=r.convert(Pe.type),de=y(Pe.internalFormat,ze,re,Pe.colorSpace,C.isXRRenderTarget===!0),Ce=D(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ce,de,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ue,n.RENDERBUFFER,U.__webglColorRenderbuffer[ue])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(U.__webglDepthRenderbuffer=n.createRenderbuffer(),ke(U.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Y){t.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture),$e(n.TEXTURE_CUBE_MAP,x);for(let ue=0;ue<6;ue++)if(x.mipmaps&&x.mipmaps.length>0)for(let Pe=0;Pe<x.mipmaps.length;Pe++)Me(U.__webglFramebuffer[ue][Pe],C,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,Pe);else Me(U.__webglFramebuffer[ue],C,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0);m(x)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ie){for(let ue=0,Pe=ne.length;ue<Pe;ue++){const ze=ne[ue],re=i.get(ze);let de=n.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(de=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(de,re.__webglTexture),$e(de,ze),Me(U.__webglFramebuffer,C,ze,n.COLOR_ATTACHMENT0+ue,de,0),m(ze)&&p(de)}t.unbindTexture()}else{let ue=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ue=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ue,Z.__webglTexture),$e(ue,x),x.mipmaps&&x.mipmaps.length>0)for(let Pe=0;Pe<x.mipmaps.length;Pe++)Me(U.__webglFramebuffer[Pe],C,x,n.COLOR_ATTACHMENT0,ue,Pe);else Me(U.__webglFramebuffer,C,x,n.COLOR_ATTACHMENT0,ue,0);m(x)&&p(ue),t.unbindTexture()}C.depthBuffer&&st(C)}function ut(C){const x=C.textures;for(let U=0,Z=x.length;U<Z;U++){const ne=x[U];if(m(ne)){const Y=M(C),Ie=i.get(ne).__webglTexture;t.bindTexture(Y,Ie),p(Y),t.unbindTexture()}}}const gt=[],Ye=[];function Rt(C){if(C.samples>0){if(Pt(C)===!1){const x=C.textures,U=C.width,Z=C.height;let ne=n.COLOR_BUFFER_BIT;const Y=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ie=i.get(C),ue=x.length>1;if(ue)for(let ze=0;ze<x.length;ze++)t.bindFramebuffer(n.FRAMEBUFFER,Ie.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ze,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Ie.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ze,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Ie.__webglMultisampledFramebuffer);const Pe=C.texture.mipmaps;Pe&&Pe.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ie.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ie.__webglFramebuffer);for(let ze=0;ze<x.length;ze++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),ue){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ie.__webglColorRenderbuffer[ze]);const re=i.get(x[ze]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,re,0)}n.blitFramebuffer(0,0,U,Z,0,0,U,Z,ne,n.NEAREST),l===!0&&(gt.length=0,Ye.length=0,gt.push(n.COLOR_ATTACHMENT0+ze),C.depthBuffer&&C.resolveDepthBuffer===!1&&(gt.push(Y),Ye.push(Y),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Ye)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,gt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ue)for(let ze=0;ze<x.length;ze++){t.bindFramebuffer(n.FRAMEBUFFER,Ie.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ze,n.RENDERBUFFER,Ie.__webglColorRenderbuffer[ze]);const re=i.get(x[ze]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Ie.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ze,n.TEXTURE_2D,re,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ie.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const x=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function D(C){return Math.min(s.maxSamples,C.samples)}function Pt(C){const x=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function lt(C){const x=a.render.frame;u.get(C)!==x&&(u.set(C,x),C.update())}function yt(C,x){const U=C.colorSpace,Z=C.format,ne=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||U!==bs&&U!==Mi&&(tt.getTransfer(U)===ft?(Z!==Tn||ne!==vn)&&He("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):at("WebGLTextures: Unsupported texture color space:",U)),x}function Le(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=k,this.setTexture2D=j,this.setTexture2DArray=q,this.setTexture3D=X,this.setTextureCube=Q,this.rebindTextures=Vt,this.setupRenderTarget=et,this.updateRenderTargetMipmap=ut,this.updateMultisampleRenderTarget=Rt,this.setupDepthRenderbuffer=st,this.setupFrameBufferTexture=Me,this.useMultisampledRTT=Pt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function FP(n,e){function t(i,s=Mi){let r;const a=tt.getTransfer(s);if(i===vn)return n.UNSIGNED_BYTE;if(i===Oc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Bc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===dm)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===fm)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===um)return n.BYTE;if(i===hm)return n.SHORT;if(i===nr)return n.UNSIGNED_SHORT;if(i===Nc)return n.INT;if(i===Xn)return n.UNSIGNED_INT;if(i===Bn)return n.FLOAT;if(i===ci)return n.HALF_FLOAT;if(i===pm)return n.ALPHA;if(i===mm)return n.RGB;if(i===Tn)return n.RGBA;if(i===ui)return n.DEPTH_COMPONENT;if(i===Wi)return n.DEPTH_STENCIL;if(i===gm)return n.RED;if(i===Vc)return n.RED_INTEGER;if(i===Ms)return n.RG;if(i===kc)return n.RG_INTEGER;if(i===zc)return n.RGBA_INTEGER;if(i===ea||i===ta||i===na||i===ia)if(a===ft)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===ea)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ta)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===na)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ia)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===ea)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ta)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===na)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ia)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===yl||i===Sl||i===Ml||i===bl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===yl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Sl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ml)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===bl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===El||i===Tl||i===Al||i===wl||i===Cl||i===Rl||i===Pl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===El||i===Tl)return a===ft?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Al)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===wl)return r.COMPRESSED_R11_EAC;if(i===Cl)return r.COMPRESSED_SIGNED_R11_EAC;if(i===Rl)return r.COMPRESSED_RG11_EAC;if(i===Pl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Ll||i===Dl||i===Il||i===Fl||i===Ul||i===Nl||i===Ol||i===Bl||i===Vl||i===kl||i===zl||i===Gl||i===Hl||i===Wl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Ll)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Dl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Il)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Fl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ul)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Nl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ol)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Bl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Vl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===kl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===zl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Gl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Hl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Wl)return a===ft?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===$l||i===Xl||i===ql)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===$l)return a===ft?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Xl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ql)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Yl||i===jl||i===Kl||i===Zl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===Yl)return r.COMPRESSED_RED_RGTC1_EXT;if(i===jl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Kl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Zl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===ir?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const UP=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,NP=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class OP{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Pm(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Rn({vertexShader:UP,fragmentShader:NP,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new qn(new _r(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class BP extends Rs{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,g=null;const v=typeof XRWebGLBinding<"u",m=new OP,p={},M=t.getContextAttributes();let y=null,S=null;const E=[],T=[],w=new nt;let R=null;const _=new En;_.viewport=new Ct;const b=new En;b.viewport=new Ct;const P=[_,b],k=new qT;let B=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let ie=E[J];return ie===void 0&&(ie=new bo,E[J]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(J){let ie=E[J];return ie===void 0&&(ie=new bo,E[J]=ie),ie.getGripSpace()},this.getHand=function(J){let ie=E[J];return ie===void 0&&(ie=new bo,E[J]=ie),ie.getHandSpace()};function j(J){const ie=T.indexOf(J.inputSource);if(ie===-1)return;const Me=E[ie];Me!==void 0&&(Me.update(J.inputSource,J.frame,c||a),Me.dispatchEvent({type:J.type,data:J.inputSource}))}function q(){s.removeEventListener("select",j),s.removeEventListener("selectstart",j),s.removeEventListener("selectend",j),s.removeEventListener("squeeze",j),s.removeEventListener("squeezestart",j),s.removeEventListener("squeezeend",j),s.removeEventListener("end",q),s.removeEventListener("inputsourceschange",X);for(let J=0;J<E.length;J++){const ie=T[J];ie!==null&&(T[J]=null,E[J].disconnect(ie))}B=null,N=null,m.reset();for(const J in p)delete p[J];e.setRenderTarget(y),f=null,d=null,h=null,s=null,S=null,ot.stop(),i.isPresenting=!1,e.setPixelRatio(R),e.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){r=J,i.isPresenting===!0&&He("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,i.isPresenting===!0&&He("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&v&&(h=new XRWebGLBinding(s,t)),h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(y=e.getRenderTarget(),s.addEventListener("select",j),s.addEventListener("selectstart",j),s.addEventListener("selectend",j),s.addEventListener("squeeze",j),s.addEventListener("squeezestart",j),s.addEventListener("squeezeend",j),s.addEventListener("end",q),s.addEventListener("inputsourceschange",X),M.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(w),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let Me=null,ke=null,Re=null;M.depth&&(Re=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Me=M.stencil?Wi:ui,ke=M.stencil?ir:Xn);const st={colorFormat:t.RGBA8,depthFormat:Re,scaleFactor:r};h=this.getBinding(),d=h.createProjectionLayer(st),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),S=new Hn(d.textureWidth,d.textureHeight,{format:Tn,type:vn,depthTexture:new rr(d.textureWidth,d.textureHeight,ke,void 0,void 0,void 0,void 0,void 0,void 0,Me),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Me={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,t,Me),s.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new Hn(f.framebufferWidth,f.framebufferHeight,{format:Tn,type:vn,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),ot.setContext(s),ot.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function X(J){for(let ie=0;ie<J.removed.length;ie++){const Me=J.removed[ie],ke=T.indexOf(Me);ke>=0&&(T[ke]=null,E[ke].disconnect(Me))}for(let ie=0;ie<J.added.length;ie++){const Me=J.added[ie];let ke=T.indexOf(Me);if(ke===-1){for(let st=0;st<E.length;st++)if(st>=T.length){T.push(Me),ke=st;break}else if(T[st]===null){T[st]=Me,ke=st;break}if(ke===-1)break}const Re=E[ke];Re&&Re.connect(Me)}}const Q=new H,ce=new H;function oe(J,ie,Me){Q.setFromMatrixPosition(ie.matrixWorld),ce.setFromMatrixPosition(Me.matrixWorld);const ke=Q.distanceTo(ce),Re=ie.projectionMatrix.elements,st=Me.projectionMatrix.elements,Vt=Re[14]/(Re[10]-1),et=Re[14]/(Re[10]+1),ut=(Re[9]+1)/Re[5],gt=(Re[9]-1)/Re[5],Ye=(Re[8]-1)/Re[0],Rt=(st[8]+1)/st[0],D=Vt*Ye,Pt=Vt*Rt,lt=ke/(-Ye+Rt),yt=lt*-Ye;if(ie.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(yt),J.translateZ(lt),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Re[10]===-1)J.projectionMatrix.copy(ie.projectionMatrix),J.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{const Le=Vt+lt,C=et+lt,x=D-yt,U=Pt+(ke-yt),Z=ut*et/C*Le,ne=gt*et/C*Le;J.projectionMatrix.makePerspective(x,U,Z,ne,Le,C),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function _e(J,ie){ie===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(ie.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let ie=J.near,Me=J.far;m.texture!==null&&(m.depthNear>0&&(ie=m.depthNear),m.depthFar>0&&(Me=m.depthFar)),k.near=b.near=_.near=ie,k.far=b.far=_.far=Me,(B!==k.near||N!==k.far)&&(s.updateRenderState({depthNear:k.near,depthFar:k.far}),B=k.near,N=k.far),k.layers.mask=J.layers.mask|6,_.layers.mask=k.layers.mask&3,b.layers.mask=k.layers.mask&5;const ke=J.parent,Re=k.cameras;_e(k,ke);for(let st=0;st<Re.length;st++)_e(Re[st],ke);Re.length===2?oe(k,_,b):k.projectionMatrix.copy(_.projectionMatrix),$e(J,k,ke)};function $e(J,ie,Me){Me===null?J.matrix.copy(ie.matrixWorld):(J.matrix.copy(Me.matrixWorld),J.matrix.invert(),J.matrix.multiply(ie.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(ie.projectionMatrix),J.projectionMatrixInverse.copy(ie.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Jl*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(J){l=J,d!==null&&(d.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(k)},this.getCameraTexture=function(J){return p[J]};let We=null;function xt(J,ie){if(u=ie.getViewerPose(c||a),g=ie,u!==null){const Me=u.views;f!==null&&(e.setRenderTargetFramebuffer(S,f.framebuffer),e.setRenderTarget(S));let ke=!1;Me.length!==k.cameras.length&&(k.cameras.length=0,ke=!0);for(let et=0;et<Me.length;et++){const ut=Me[et];let gt=null;if(f!==null)gt=f.getViewport(ut);else{const Rt=h.getViewSubImage(d,ut);gt=Rt.viewport,et===0&&(e.setRenderTargetTextures(S,Rt.colorTexture,Rt.depthStencilTexture),e.setRenderTarget(S))}let Ye=P[et];Ye===void 0&&(Ye=new En,Ye.layers.enable(et),Ye.viewport=new Ct,P[et]=Ye),Ye.matrix.fromArray(ut.transform.matrix),Ye.matrix.decompose(Ye.position,Ye.quaternion,Ye.scale),Ye.projectionMatrix.fromArray(ut.projectionMatrix),Ye.projectionMatrixInverse.copy(Ye.projectionMatrix).invert(),Ye.viewport.set(gt.x,gt.y,gt.width,gt.height),et===0&&(k.matrix.copy(Ye.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),ke===!0&&k.cameras.push(Ye)}const Re=s.enabledFeatures;if(Re&&Re.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){h=i.getBinding();const et=h.getDepthInformation(Me[0]);et&&et.isValid&&et.texture&&m.init(et,s.renderState)}if(Re&&Re.includes("camera-access")&&v){e.state.unbindTexture(),h=i.getBinding();for(let et=0;et<Me.length;et++){const ut=Me[et].camera;if(ut){let gt=p[ut];gt||(gt=new Pm,p[ut]=gt);const Ye=h.getCameraImage(ut);gt.sourceTexture=Ye}}}}for(let Me=0;Me<E.length;Me++){const ke=T[Me],Re=E[Me];ke!==null&&Re!==void 0&&Re.update(ke,ie,c||a)}We&&We(J,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),g=null}const ot=new Lm;ot.setAnimationLoop(xt),this.setAnimationLoop=function(J){We=J},this.dispose=function(){}}}const Ui=new Ki,VP=new Ut;function kP(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Tm(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,M,y,S){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),h(m,p)):p.isMeshPhongMaterial?(r(m,p),u(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,S)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&o(m,p)):p.isPointsMaterial?l(m,p,M,y):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===an&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===an&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const M=e.get(p),y=M.envMap,S=M.envMapRotation;y&&(m.envMap.value=y,Ui.copy(S),Ui.x*=-1,Ui.y*=-1,Ui.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(Ui.y*=-1,Ui.z*=-1),m.envMapRotation.value.setFromMatrix4(VP.makeRotationFromEuler(Ui)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function o(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,M,y){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=y*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function h(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===an&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const M=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function zP(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,y){const S=y.program;i.uniformBlockBinding(M,S)}function c(M,y){let S=s[M.id];S===void 0&&(g(M),S=u(M),s[M.id]=S,M.addEventListener("dispose",m));const E=y.program;i.updateUBOMapping(M,E);const T=e.render.frame;r[M.id]!==T&&(d(M),r[M.id]=T)}function u(M){const y=h();M.__bindingPointIndex=y;const S=n.createBuffer(),E=M.__size,T=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,S),n.bufferData(n.UNIFORM_BUFFER,E,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,y,S),S}function h(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return at("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const y=s[M.id],S=M.uniforms,E=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,y);for(let T=0,w=S.length;T<w;T++){const R=Array.isArray(S[T])?S[T]:[S[T]];for(let _=0,b=R.length;_<b;_++){const P=R[_];if(f(P,T,_,E)===!0){const k=P.__offset,B=Array.isArray(P.value)?P.value:[P.value];let N=0;for(let j=0;j<B.length;j++){const q=B[j],X=v(q);typeof q=="number"||typeof q=="boolean"?(P.__data[0]=q,n.bufferSubData(n.UNIFORM_BUFFER,k+N,P.__data)):q.isMatrix3?(P.__data[0]=q.elements[0],P.__data[1]=q.elements[1],P.__data[2]=q.elements[2],P.__data[3]=0,P.__data[4]=q.elements[3],P.__data[5]=q.elements[4],P.__data[6]=q.elements[5],P.__data[7]=0,P.__data[8]=q.elements[6],P.__data[9]=q.elements[7],P.__data[10]=q.elements[8],P.__data[11]=0):(q.toArray(P.__data,N),N+=X.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,k,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(M,y,S,E){const T=M.value,w=y+"_"+S;if(E[w]===void 0)return typeof T=="number"||typeof T=="boolean"?E[w]=T:E[w]=T.clone(),!0;{const R=E[w];if(typeof T=="number"||typeof T=="boolean"){if(R!==T)return E[w]=T,!0}else if(R.equals(T)===!1)return R.copy(T),!0}return!1}function g(M){const y=M.uniforms;let S=0;const E=16;for(let w=0,R=y.length;w<R;w++){const _=Array.isArray(y[w])?y[w]:[y[w]];for(let b=0,P=_.length;b<P;b++){const k=_[b],B=Array.isArray(k.value)?k.value:[k.value];for(let N=0,j=B.length;N<j;N++){const q=B[N],X=v(q),Q=S%E,ce=Q%X.boundary,oe=Q+ce;S+=ce,oe!==0&&E-oe<X.storage&&(S+=E-oe),k.__data=new Float32Array(X.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=S,S+=X.storage}}}const T=S%E;return T>0&&(S+=E-T),M.__size=S,M.__cache={},this}function v(M){const y={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(y.boundary=4,y.storage=4):M.isVector2?(y.boundary=8,y.storage=8):M.isVector3||M.isColor?(y.boundary=16,y.storage=12):M.isVector4?(y.boundary=16,y.storage=16):M.isMatrix3?(y.boundary=48,y.storage=48):M.isMatrix4?(y.boundary=64,y.storage=64):M.isTexture?He("WebGLRenderer: Texture samplers can not be part of an uniforms group."):He("WebGLRenderer: Unsupported uniform value type.",M),y}function m(M){const y=M.target;y.removeEventListener("dispose",m);const S=a.indexOf(y.__bindingPointIndex);a.splice(S,1),n.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function p(){for(const M in s)n.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:l,update:c,dispose:p}}const GP=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Un=null;function HP(){return Un===null&&(Un=new VT(GP,16,16,Ms,ci),Un.name="DFG_LUT",Un.minFilter=Xt,Un.magFilter=Xt,Un.wrapS=ti,Un.wrapT=ti,Un.generateMipmaps=!1,Un.needsUpdate=!0),Un}class WP{constructor(e={}){const{canvas:t=hT(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:f=vn}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=a;const v=f,m=new Set([zc,kc,Vc]),p=new Set([vn,Xn,nr,ir,Oc,Bc]),M=new Uint32Array(4),y=new Int32Array(4);let S=null,E=null;const T=[],w=[];let R=null;this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Gn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let b=!1;this._outputColorSpace=fn;let P=0,k=0,B=null,N=-1,j=null;const q=new Ct,X=new Ct;let Q=null;const ce=new mt(0);let oe=0,_e=t.width,$e=t.height,We=1,xt=null,ot=null;const J=new Ct(0,0,_e,$e),ie=new Ct(0,0,_e,$e);let Me=!1;const ke=new Rm;let Re=!1,st=!1;const Vt=new Ut,et=new H,ut=new Ct,gt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ye=!1;function Rt(){return B===null?We:1}let D=i;function Pt(A,O){return t.getContext(A,O)}try{const A={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Uc}`),t.addEventListener("webglcontextlost",Ge,!1),t.addEventListener("webglcontextrestored",St,!1),t.addEventListener("webglcontextcreationerror",ht,!1),D===null){const O="webgl2";if(D=Pt(O,A),D===null)throw Pt(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw at("WebGLRenderer: "+A.message),A}let lt,yt,Le,C,x,U,Z,ne,Y,Ie,ue,Pe,ze,re,de,Ce,De,he,je,F,ge,ae,be,se;function te(){lt=new HC(D),lt.init(),ae=new FP(D,lt),yt=new FC(D,lt,e,ae),Le=new DP(D,lt),yt.reversedDepthBuffer&&d&&Le.buffers.depth.setReversed(!0),C=new XC(D),x=new vP,U=new IP(D,lt,Le,x,yt,ae,C),Z=new NC(_),ne=new GC(_),Y=new KT(D),be=new DC(D,Y),Ie=new WC(D,Y,C,be),ue=new YC(D,Ie,Y,C),je=new qC(D,yt,U),Ce=new UC(x),Pe=new gP(_,Z,ne,lt,yt,be,Ce),ze=new kP(_,x),re=new xP,de=new TP(lt),he=new LC(_,Z,ne,Le,ue,g,l),De=new PP(_,ue,yt),se=new zP(D,C,yt,Le),F=new IC(D,lt,C),ge=new $C(D,lt,C),C.programs=Pe.programs,_.capabilities=yt,_.extensions=lt,_.properties=x,_.renderLists=re,_.shadowMap=De,_.state=Le,_.info=C}te(),v!==vn&&(R=new KC(v,t.width,t.height,s,r));const le=new BP(_,D);this.xr=le,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const A=lt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=lt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return We},this.setPixelRatio=function(A){A!==void 0&&(We=A,this.setSize(_e,$e,!1))},this.getSize=function(A){return A.set(_e,$e)},this.setSize=function(A,O,$=!0){if(le.isPresenting){He("WebGLRenderer: Can't change size while VR device is presenting.");return}_e=A,$e=O,t.width=Math.floor(A*We),t.height=Math.floor(O*We),$===!0&&(t.style.width=A+"px",t.style.height=O+"px"),R!==null&&R.setSize(t.width,t.height),this.setViewport(0,0,A,O)},this.getDrawingBufferSize=function(A){return A.set(_e*We,$e*We).floor()},this.setDrawingBufferSize=function(A,O,$){_e=A,$e=O,We=$,t.width=Math.floor(A*$),t.height=Math.floor(O*$),this.setViewport(0,0,A,O)},this.setEffects=function(A){if(v===vn){console.error("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let O=0;O<A.length;O++)if(A[O].isOutputPass===!0){console.warn("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}R.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(q)},this.getViewport=function(A){return A.copy(J)},this.setViewport=function(A,O,$,W){A.isVector4?J.set(A.x,A.y,A.z,A.w):J.set(A,O,$,W),Le.viewport(q.copy(J).multiplyScalar(We).round())},this.getScissor=function(A){return A.copy(ie)},this.setScissor=function(A,O,$,W){A.isVector4?ie.set(A.x,A.y,A.z,A.w):ie.set(A,O,$,W),Le.scissor(X.copy(ie).multiplyScalar(We).round())},this.getScissorTest=function(){return Me},this.setScissorTest=function(A){Le.setScissorTest(Me=A)},this.setOpaqueSort=function(A){xt=A},this.setTransparentSort=function(A){ot=A},this.getClearColor=function(A){return A.copy(he.getClearColor())},this.setClearColor=function(){he.setClearColor(...arguments)},this.getClearAlpha=function(){return he.getClearAlpha()},this.setClearAlpha=function(){he.setClearAlpha(...arguments)},this.clear=function(A=!0,O=!0,$=!0){let W=0;if(A){let G=!1;if(B!==null){const fe=B.texture.format;G=m.has(fe)}if(G){const fe=B.texture.type,Te=p.has(fe),me=he.getClearColor(),we=he.getClearAlpha(),Fe=me.r,Be=me.g,Ue=me.b;Te?(M[0]=Fe,M[1]=Be,M[2]=Ue,M[3]=we,D.clearBufferuiv(D.COLOR,0,M)):(y[0]=Fe,y[1]=Be,y[2]=Ue,y[3]=we,D.clearBufferiv(D.COLOR,0,y))}else W|=D.COLOR_BUFFER_BIT}O&&(W|=D.DEPTH_BUFFER_BIT),$&&(W|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Ge,!1),t.removeEventListener("webglcontextrestored",St,!1),t.removeEventListener("webglcontextcreationerror",ht,!1),he.dispose(),re.dispose(),de.dispose(),x.dispose(),Z.dispose(),ne.dispose(),ue.dispose(),be.dispose(),se.dispose(),Pe.dispose(),le.dispose(),le.removeEventListener("sessionstart",Yc),le.removeEventListener("sessionend",jc),Ci.stop()};function Ge(A){A.preventDefault(),jh("WebGLRenderer: Context Lost."),b=!0}function St(){jh("WebGLRenderer: Context Restored."),b=!1;const A=C.autoReset,O=De.enabled,$=De.autoUpdate,W=De.needsUpdate,G=De.type;te(),C.autoReset=A,De.enabled=O,De.autoUpdate=$,De.needsUpdate=W,De.type=G}function ht(A){at("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Dn(A){const O=A.target;O.removeEventListener("dispose",Dn),Yn(O)}function Yn(A){km(A),x.remove(A)}function km(A){const O=x.get(A).programs;O!==void 0&&(O.forEach(function($){Pe.releaseProgram($)}),A.isShaderMaterial&&Pe.releaseShaderCache(A))}this.renderBufferDirect=function(A,O,$,W,G,fe){O===null&&(O=gt);const Te=G.isMesh&&G.matrixWorld.determinant()<0,me=Gm(A,O,$,W,G);Le.setMaterial(W,Te);let we=$.index,Fe=1;if(W.wireframe===!0){if(we=Ie.getWireframeAttribute($),we===void 0)return;Fe=2}const Be=$.drawRange,Ue=$.attributes.position;let Ze=Be.start*Fe,pt=(Be.start+Be.count)*Fe;fe!==null&&(Ze=Math.max(Ze,fe.start*Fe),pt=Math.min(pt,(fe.start+fe.count)*Fe)),we!==null?(Ze=Math.max(Ze,0),pt=Math.min(pt,we.count)):Ue!=null&&(Ze=Math.max(Ze,0),pt=Math.min(pt,Ue.count));const At=pt-Ze;if(At<0||At===1/0)return;be.setup(G,W,me,$,we);let wt,vt=F;if(we!==null&&(wt=Y.get(we),vt=ge,vt.setIndex(wt)),G.isMesh)W.wireframe===!0?(Le.setLineWidth(W.wireframeLinewidth*Rt()),vt.setMode(D.LINES)):vt.setMode(D.TRIANGLES);else if(G.isLine){let Ne=W.linewidth;Ne===void 0&&(Ne=1),Le.setLineWidth(Ne*Rt()),G.isLineSegments?vt.setMode(D.LINES):G.isLineLoop?vt.setMode(D.LINE_LOOP):vt.setMode(D.LINE_STRIP)}else G.isPoints?vt.setMode(D.POINTS):G.isSprite&&vt.setMode(D.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)sr("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),vt.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(lt.get("WEBGL_multi_draw"))vt.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Ne=G._multiDrawStarts,dt=G._multiDrawCounts,rt=G._multiDrawCount,ln=we?Y.get(we).bytesPerElement:1,Zi=x.get(W).currentProgram.getUniforms();for(let cn=0;cn<rt;cn++)Zi.setValue(D,"_gl_DrawID",cn),vt.render(Ne[cn]/ln,dt[cn])}else if(G.isInstancedMesh)vt.renderInstances(Ze,At,G.count);else if($.isInstancedBufferGeometry){const Ne=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,dt=Math.min($.instanceCount,Ne);vt.renderInstances(Ze,At,dt)}else vt.render(Ze,At)};function qc(A,O,$){A.transparent===!0&&A.side===ei&&A.forceSinglePass===!1?(A.side=an,A.needsUpdate=!0,yr(A,O,$),A.side=Ai,A.needsUpdate=!0,yr(A,O,$),A.side=ei):yr(A,O,$)}this.compile=function(A,O,$=null){$===null&&($=A),E=de.get($),E.init(O),w.push(E),$.traverseVisible(function(G){G.isLight&&G.layers.test(O.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),A!==$&&A.traverseVisible(function(G){G.isLight&&G.layers.test(O.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),E.setupLights();const W=new Set;return A.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const fe=G.material;if(fe)if(Array.isArray(fe))for(let Te=0;Te<fe.length;Te++){const me=fe[Te];qc(me,$,G),W.add(me)}else qc(fe,$,G),W.add(fe)}),E=w.pop(),W},this.compileAsync=function(A,O,$=null){const W=this.compile(A,O,$);return new Promise(G=>{function fe(){if(W.forEach(function(Te){x.get(Te).currentProgram.isReady()&&W.delete(Te)}),W.size===0){G(A);return}setTimeout(fe,10)}lt.get("KHR_parallel_shader_compile")!==null?fe():setTimeout(fe,10)})};let Ia=null;function zm(A){Ia&&Ia(A)}function Yc(){Ci.stop()}function jc(){Ci.start()}const Ci=new Lm;Ci.setAnimationLoop(zm),typeof self<"u"&&Ci.setContext(self),this.setAnimationLoop=function(A){Ia=A,le.setAnimationLoop(A),A===null?Ci.stop():Ci.start()},le.addEventListener("sessionstart",Yc),le.addEventListener("sessionend",jc),this.render=function(A,O){if(O!==void 0&&O.isCamera!==!0){at("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;const $=le.enabled===!0&&le.isPresenting===!0,W=R!==null&&(B===null||$)&&R.begin(_,B);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),le.enabled===!0&&le.isPresenting===!0&&(R===null||R.isCompositing()===!1)&&(le.cameraAutoUpdate===!0&&le.updateCamera(O),O=le.getCamera()),A.isScene===!0&&A.onBeforeRender(_,A,O,B),E=de.get(A,w.length),E.init(O),w.push(E),Vt.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),ke.setFromProjectionMatrix(Vt,Vn,O.reversedDepth),st=this.localClippingEnabled,Re=Ce.init(this.clippingPlanes,st),S=re.get(A,T.length),S.init(),T.push(S),le.enabled===!0&&le.isPresenting===!0){const Te=_.xr.getDepthSensingMesh();Te!==null&&Fa(Te,O,-1/0,_.sortObjects)}Fa(A,O,0,_.sortObjects),S.finish(),_.sortObjects===!0&&S.sort(xt,ot),Ye=le.enabled===!1||le.isPresenting===!1||le.hasDepthSensing()===!1,Ye&&he.addToRenderList(S,A),this.info.render.frame++,Re===!0&&Ce.beginShadows();const G=E.state.shadowsArray;if(De.render(G,A,O),Re===!0&&Ce.endShadows(),this.info.autoReset===!0&&this.info.reset(),(W&&R.hasRenderPass())===!1){const Te=S.opaque,me=S.transmissive;if(E.setupLights(),O.isArrayCamera){const we=O.cameras;if(me.length>0)for(let Fe=0,Be=we.length;Fe<Be;Fe++){const Ue=we[Fe];Zc(Te,me,A,Ue)}Ye&&he.render(A);for(let Fe=0,Be=we.length;Fe<Be;Fe++){const Ue=we[Fe];Kc(S,A,Ue,Ue.viewport)}}else me.length>0&&Zc(Te,me,A,O),Ye&&he.render(A),Kc(S,A,O)}B!==null&&k===0&&(U.updateMultisampleRenderTarget(B),U.updateRenderTargetMipmap(B)),W&&R.end(_),A.isScene===!0&&A.onAfterRender(_,A,O),be.resetDefaultState(),N=-1,j=null,w.pop(),w.length>0?(E=w[w.length-1],Re===!0&&Ce.setGlobalState(_.clippingPlanes,E.state.camera)):E=null,T.pop(),T.length>0?S=T[T.length-1]:S=null};function Fa(A,O,$,W){if(A.visible===!1)return;if(A.layers.test(O.layers)){if(A.isGroup)$=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(O);else if(A.isLight)E.pushLight(A),A.castShadow&&E.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||ke.intersectsSprite(A)){W&&ut.setFromMatrixPosition(A.matrixWorld).applyMatrix4(Vt);const Te=ue.update(A),me=A.material;me.visible&&S.push(A,Te,me,$,ut.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||ke.intersectsObject(A))){const Te=ue.update(A),me=A.material;if(W&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),ut.copy(A.boundingSphere.center)):(Te.boundingSphere===null&&Te.computeBoundingSphere(),ut.copy(Te.boundingSphere.center)),ut.applyMatrix4(A.matrixWorld).applyMatrix4(Vt)),Array.isArray(me)){const we=Te.groups;for(let Fe=0,Be=we.length;Fe<Be;Fe++){const Ue=we[Fe],Ze=me[Ue.materialIndex];Ze&&Ze.visible&&S.push(A,Te,Ze,$,ut.z,Ue)}}else me.visible&&S.push(A,Te,me,$,ut.z,null)}}const fe=A.children;for(let Te=0,me=fe.length;Te<me;Te++)Fa(fe[Te],O,$,W)}function Kc(A,O,$,W){const{opaque:G,transmissive:fe,transparent:Te}=A;E.setupLightsView($),Re===!0&&Ce.setGlobalState(_.clippingPlanes,$),W&&Le.viewport(q.copy(W)),G.length>0&&xr(G,O,$),fe.length>0&&xr(fe,O,$),Te.length>0&&xr(Te,O,$),Le.buffers.depth.setTest(!0),Le.buffers.depth.setMask(!0),Le.buffers.color.setMask(!0),Le.setPolygonOffset(!1)}function Zc(A,O,$,W){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[W.id]===void 0){const Ze=lt.has("EXT_color_buffer_half_float")||lt.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[W.id]=new Hn(1,1,{generateMipmaps:!0,type:Ze?ci:vn,minFilter:Hi,samples:yt.samples,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace})}const fe=E.state.transmissionRenderTarget[W.id],Te=W.viewport||q;fe.setSize(Te.z*_.transmissionResolutionScale,Te.w*_.transmissionResolutionScale);const me=_.getRenderTarget(),we=_.getActiveCubeFace(),Fe=_.getActiveMipmapLevel();_.setRenderTarget(fe),_.getClearColor(ce),oe=_.getClearAlpha(),oe<1&&_.setClearColor(16777215,.5),_.clear(),Ye&&he.render($);const Be=_.toneMapping;_.toneMapping=Gn;const Ue=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),E.setupLightsView(W),Re===!0&&Ce.setGlobalState(_.clippingPlanes,W),xr(A,$,W),U.updateMultisampleRenderTarget(fe),U.updateRenderTargetMipmap(fe),lt.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let pt=0,At=O.length;pt<At;pt++){const wt=O[pt],{object:vt,geometry:Ne,material:dt,group:rt}=wt;if(dt.side===ei&&vt.layers.test(W.layers)){const ln=dt.side;dt.side=an,dt.needsUpdate=!0,Jc(vt,$,W,Ne,dt,rt),dt.side=ln,dt.needsUpdate=!0,Ze=!0}}Ze===!0&&(U.updateMultisampleRenderTarget(fe),U.updateRenderTargetMipmap(fe))}_.setRenderTarget(me,we,Fe),_.setClearColor(ce,oe),Ue!==void 0&&(W.viewport=Ue),_.toneMapping=Be}function xr(A,O,$){const W=O.isScene===!0?O.overrideMaterial:null;for(let G=0,fe=A.length;G<fe;G++){const Te=A[G],{object:me,geometry:we,group:Fe}=Te;let Be=Te.material;Be.allowOverride===!0&&W!==null&&(Be=W),me.layers.test($.layers)&&Jc(me,O,$,we,Be,Fe)}}function Jc(A,O,$,W,G,fe){A.onBeforeRender(_,O,$,W,G,fe),A.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),G.onBeforeRender(_,O,$,W,A,fe),G.transparent===!0&&G.side===ei&&G.forceSinglePass===!1?(G.side=an,G.needsUpdate=!0,_.renderBufferDirect($,O,W,G,A,fe),G.side=Ai,G.needsUpdate=!0,_.renderBufferDirect($,O,W,G,A,fe),G.side=ei):_.renderBufferDirect($,O,W,G,A,fe),A.onAfterRender(_,O,$,W,G,fe)}function yr(A,O,$){O.isScene!==!0&&(O=gt);const W=x.get(A),G=E.state.lights,fe=E.state.shadowsArray,Te=G.state.version,me=Pe.getParameters(A,G.state,fe,O,$),we=Pe.getProgramCacheKey(me);let Fe=W.programs;W.environment=A.isMeshStandardMaterial?O.environment:null,W.fog=O.fog,W.envMap=(A.isMeshStandardMaterial?ne:Z).get(A.envMap||W.environment),W.envMapRotation=W.environment!==null&&A.envMap===null?O.environmentRotation:A.envMapRotation,Fe===void 0&&(A.addEventListener("dispose",Dn),Fe=new Map,W.programs=Fe);let Be=Fe.get(we);if(Be!==void 0){if(W.currentProgram===Be&&W.lightsStateVersion===Te)return eu(A,me),Be}else me.uniforms=Pe.getUniforms(A),A.onBeforeCompile(me,_),Be=Pe.acquireProgram(me,we),Fe.set(we,Be),W.uniforms=me.uniforms;const Ue=W.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ue.clippingPlanes=Ce.uniform),eu(A,me),W.needsLights=Wm(A),W.lightsStateVersion=Te,W.needsLights&&(Ue.ambientLightColor.value=G.state.ambient,Ue.lightProbe.value=G.state.probe,Ue.directionalLights.value=G.state.directional,Ue.directionalLightShadows.value=G.state.directionalShadow,Ue.spotLights.value=G.state.spot,Ue.spotLightShadows.value=G.state.spotShadow,Ue.rectAreaLights.value=G.state.rectArea,Ue.ltc_1.value=G.state.rectAreaLTC1,Ue.ltc_2.value=G.state.rectAreaLTC2,Ue.pointLights.value=G.state.point,Ue.pointLightShadows.value=G.state.pointShadow,Ue.hemisphereLights.value=G.state.hemi,Ue.directionalShadowMap.value=G.state.directionalShadowMap,Ue.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ue.spotShadowMap.value=G.state.spotShadowMap,Ue.spotLightMatrix.value=G.state.spotLightMatrix,Ue.spotLightMap.value=G.state.spotLightMap,Ue.pointShadowMap.value=G.state.pointShadowMap,Ue.pointShadowMatrix.value=G.state.pointShadowMatrix),W.currentProgram=Be,W.uniformsList=null,Be}function Qc(A){if(A.uniformsList===null){const O=A.currentProgram.getUniforms();A.uniformsList=sa.seqWithValue(O.seq,A.uniforms)}return A.uniformsList}function eu(A,O){const $=x.get(A);$.outputColorSpace=O.outputColorSpace,$.batching=O.batching,$.batchingColor=O.batchingColor,$.instancing=O.instancing,$.instancingColor=O.instancingColor,$.instancingMorph=O.instancingMorph,$.skinning=O.skinning,$.morphTargets=O.morphTargets,$.morphNormals=O.morphNormals,$.morphColors=O.morphColors,$.morphTargetsCount=O.morphTargetsCount,$.numClippingPlanes=O.numClippingPlanes,$.numIntersection=O.numClipIntersection,$.vertexAlphas=O.vertexAlphas,$.vertexTangents=O.vertexTangents,$.toneMapping=O.toneMapping}function Gm(A,O,$,W,G){O.isScene!==!0&&(O=gt),U.resetTextureUnits();const fe=O.fog,Te=W.isMeshStandardMaterial?O.environment:null,me=B===null?_.outputColorSpace:B.isXRRenderTarget===!0?B.texture.colorSpace:bs,we=(W.isMeshStandardMaterial?ne:Z).get(W.envMap||Te),Fe=W.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,Be=!!$.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ue=!!$.morphAttributes.position,Ze=!!$.morphAttributes.normal,pt=!!$.morphAttributes.color;let At=Gn;W.toneMapped&&(B===null||B.isXRRenderTarget===!0)&&(At=_.toneMapping);const wt=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,vt=wt!==void 0?wt.length:0,Ne=x.get(W),dt=E.state.lights;if(Re===!0&&(st===!0||A!==j)){const Yt=A===j&&W.id===N;Ce.setState(W,A,Yt)}let rt=!1;W.version===Ne.__version?(Ne.needsLights&&Ne.lightsStateVersion!==dt.state.version||Ne.outputColorSpace!==me||G.isBatchedMesh&&Ne.batching===!1||!G.isBatchedMesh&&Ne.batching===!0||G.isBatchedMesh&&Ne.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Ne.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Ne.instancing===!1||!G.isInstancedMesh&&Ne.instancing===!0||G.isSkinnedMesh&&Ne.skinning===!1||!G.isSkinnedMesh&&Ne.skinning===!0||G.isInstancedMesh&&Ne.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ne.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ne.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ne.instancingMorph===!1&&G.morphTexture!==null||Ne.envMap!==we||W.fog===!0&&Ne.fog!==fe||Ne.numClippingPlanes!==void 0&&(Ne.numClippingPlanes!==Ce.numPlanes||Ne.numIntersection!==Ce.numIntersection)||Ne.vertexAlphas!==Fe||Ne.vertexTangents!==Be||Ne.morphTargets!==Ue||Ne.morphNormals!==Ze||Ne.morphColors!==pt||Ne.toneMapping!==At||Ne.morphTargetsCount!==vt)&&(rt=!0):(rt=!0,Ne.__version=W.version);let ln=Ne.currentProgram;rt===!0&&(ln=yr(W,O,G));let Zi=!1,cn=!1,Ls=!1;const Mt=ln.getUniforms(),Qt=Ne.uniforms;if(Le.useProgram(ln.program)&&(Zi=!0,cn=!0,Ls=!0),W.id!==N&&(N=W.id,cn=!0),Zi||j!==A){Le.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),Mt.setValue(D,"projectionMatrix",A.projectionMatrix),Mt.setValue(D,"viewMatrix",A.matrixWorldInverse);const en=Mt.map.cameraPosition;en!==void 0&&en.setValue(D,et.setFromMatrixPosition(A.matrixWorld)),yt.logarithmicDepthBuffer&&Mt.setValue(D,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&Mt.setValue(D,"isOrthographic",A.isOrthographicCamera===!0),j!==A&&(j=A,cn=!0,Ls=!0)}if(Ne.needsLights&&(dt.state.directionalShadowMap.length>0&&Mt.setValue(D,"directionalShadowMap",dt.state.directionalShadowMap,U),dt.state.spotShadowMap.length>0&&Mt.setValue(D,"spotShadowMap",dt.state.spotShadowMap,U),dt.state.pointShadowMap.length>0&&Mt.setValue(D,"pointShadowMap",dt.state.pointShadowMap,U)),G.isSkinnedMesh){Mt.setOptional(D,G,"bindMatrix"),Mt.setOptional(D,G,"bindMatrixInverse");const Yt=G.skeleton;Yt&&(Yt.boneTexture===null&&Yt.computeBoneTexture(),Mt.setValue(D,"boneTexture",Yt.boneTexture,U))}G.isBatchedMesh&&(Mt.setOptional(D,G,"batchingTexture"),Mt.setValue(D,"batchingTexture",G._matricesTexture,U),Mt.setOptional(D,G,"batchingIdTexture"),Mt.setValue(D,"batchingIdTexture",G._indirectTexture,U),Mt.setOptional(D,G,"batchingColorTexture"),G._colorsTexture!==null&&Mt.setValue(D,"batchingColorTexture",G._colorsTexture,U));const mn=$.morphAttributes;if((mn.position!==void 0||mn.normal!==void 0||mn.color!==void 0)&&je.update(G,$,ln),(cn||Ne.receiveShadow!==G.receiveShadow)&&(Ne.receiveShadow=G.receiveShadow,Mt.setValue(D,"receiveShadow",G.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Qt.envMap.value=we,Qt.flipEnvMap.value=we.isCubeTexture&&we.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&O.environment!==null&&(Qt.envMapIntensity.value=O.environmentIntensity),Qt.dfgLUT!==void 0&&(Qt.dfgLUT.value=HP()),cn&&(Mt.setValue(D,"toneMappingExposure",_.toneMappingExposure),Ne.needsLights&&Hm(Qt,Ls),fe&&W.fog===!0&&ze.refreshFogUniforms(Qt,fe),ze.refreshMaterialUniforms(Qt,W,We,$e,E.state.transmissionRenderTarget[A.id]),sa.upload(D,Qc(Ne),Qt,U)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(sa.upload(D,Qc(Ne),Qt,U),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&Mt.setValue(D,"center",G.center),Mt.setValue(D,"modelViewMatrix",G.modelViewMatrix),Mt.setValue(D,"normalMatrix",G.normalMatrix),Mt.setValue(D,"modelMatrix",G.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const Yt=W.uniformsGroups;for(let en=0,Ua=Yt.length;en<Ua;en++){const Ri=Yt[en];se.update(Ri,ln),se.bind(Ri,ln)}}return ln}function Hm(A,O){A.ambientLightColor.needsUpdate=O,A.lightProbe.needsUpdate=O,A.directionalLights.needsUpdate=O,A.directionalLightShadows.needsUpdate=O,A.pointLights.needsUpdate=O,A.pointLightShadows.needsUpdate=O,A.spotLights.needsUpdate=O,A.spotLightShadows.needsUpdate=O,A.rectAreaLights.needsUpdate=O,A.hemisphereLights.needsUpdate=O}function Wm(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return B},this.setRenderTargetTextures=function(A,O,$){const W=x.get(A);W.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),x.get(A.texture).__webglTexture=O,x.get(A.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:$,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,O){const $=x.get(A);$.__webglFramebuffer=O,$.__useDefaultFramebuffer=O===void 0};const $m=D.createFramebuffer();this.setRenderTarget=function(A,O=0,$=0){B=A,P=O,k=$;let W=null,G=!1,fe=!1;if(A){const me=x.get(A);if(me.__useDefaultFramebuffer!==void 0){Le.bindFramebuffer(D.FRAMEBUFFER,me.__webglFramebuffer),q.copy(A.viewport),X.copy(A.scissor),Q=A.scissorTest,Le.viewport(q),Le.scissor(X),Le.setScissorTest(Q),N=-1;return}else if(me.__webglFramebuffer===void 0)U.setupRenderTarget(A);else if(me.__hasExternalTextures)U.rebindTextures(A,x.get(A.texture).__webglTexture,x.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Be=A.depthTexture;if(me.__boundDepthTexture!==Be){if(Be!==null&&x.has(Be)&&(A.width!==Be.image.width||A.height!==Be.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");U.setupDepthRenderbuffer(A)}}const we=A.texture;(we.isData3DTexture||we.isDataArrayTexture||we.isCompressedArrayTexture)&&(fe=!0);const Fe=x.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Fe[O])?W=Fe[O][$]:W=Fe[O],G=!0):A.samples>0&&U.useMultisampledRTT(A)===!1?W=x.get(A).__webglMultisampledFramebuffer:Array.isArray(Fe)?W=Fe[$]:W=Fe,q.copy(A.viewport),X.copy(A.scissor),Q=A.scissorTest}else q.copy(J).multiplyScalar(We).floor(),X.copy(ie).multiplyScalar(We).floor(),Q=Me;if($!==0&&(W=$m),Le.bindFramebuffer(D.FRAMEBUFFER,W)&&Le.drawBuffers(A,W),Le.viewport(q),Le.scissor(X),Le.setScissorTest(Q),G){const me=x.get(A.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+O,me.__webglTexture,$)}else if(fe){const me=O;for(let we=0;we<A.textures.length;we++){const Fe=x.get(A.textures[we]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+we,Fe.__webglTexture,$,me)}}else if(A!==null&&$!==0){const me=x.get(A.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,me.__webglTexture,$)}N=-1},this.readRenderTargetPixels=function(A,O,$,W,G,fe,Te,me=0){if(!(A&&A.isWebGLRenderTarget)){at("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=x.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Te!==void 0&&(we=we[Te]),we){Le.bindFramebuffer(D.FRAMEBUFFER,we);try{const Fe=A.textures[me],Be=Fe.format,Ue=Fe.type;if(!yt.textureFormatReadable(Be)){at("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!yt.textureTypeReadable(Ue)){at("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=A.width-W&&$>=0&&$<=A.height-G&&(A.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+me),D.readPixels(O,$,W,G,ae.convert(Be),ae.convert(Ue),fe))}finally{const Fe=B!==null?x.get(B).__webglFramebuffer:null;Le.bindFramebuffer(D.FRAMEBUFFER,Fe)}}},this.readRenderTargetPixelsAsync=async function(A,O,$,W,G,fe,Te,me=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=x.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Te!==void 0&&(we=we[Te]),we)if(O>=0&&O<=A.width-W&&$>=0&&$<=A.height-G){Le.bindFramebuffer(D.FRAMEBUFFER,we);const Fe=A.textures[me],Be=Fe.format,Ue=Fe.type;if(!yt.textureFormatReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!yt.textureTypeReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ze=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Ze),D.bufferData(D.PIXEL_PACK_BUFFER,fe.byteLength,D.STREAM_READ),A.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+me),D.readPixels(O,$,W,G,ae.convert(Be),ae.convert(Ue),0);const pt=B!==null?x.get(B).__webglFramebuffer:null;Le.bindFramebuffer(D.FRAMEBUFFER,pt);const At=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await dT(D,At,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Ze),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,fe),D.deleteBuffer(Ze),D.deleteSync(At),fe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,O=null,$=0){const W=Math.pow(2,-$),G=Math.floor(A.image.width*W),fe=Math.floor(A.image.height*W),Te=O!==null?O.x:0,me=O!==null?O.y:0;U.setTexture2D(A,0),D.copyTexSubImage2D(D.TEXTURE_2D,$,0,0,Te,me,G,fe),Le.unbindTexture()};const Xm=D.createFramebuffer(),qm=D.createFramebuffer();this.copyTextureToTexture=function(A,O,$=null,W=null,G=0,fe=null){fe===null&&(G!==0?(sr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),fe=G,G=0):fe=0);let Te,me,we,Fe,Be,Ue,Ze,pt,At;const wt=A.isCompressedTexture?A.mipmaps[fe]:A.image;if($!==null)Te=$.max.x-$.min.x,me=$.max.y-$.min.y,we=$.isBox3?$.max.z-$.min.z:1,Fe=$.min.x,Be=$.min.y,Ue=$.isBox3?$.min.z:0;else{const mn=Math.pow(2,-G);Te=Math.floor(wt.width*mn),me=Math.floor(wt.height*mn),A.isDataArrayTexture?we=wt.depth:A.isData3DTexture?we=Math.floor(wt.depth*mn):we=1,Fe=0,Be=0,Ue=0}W!==null?(Ze=W.x,pt=W.y,At=W.z):(Ze=0,pt=0,At=0);const vt=ae.convert(O.format),Ne=ae.convert(O.type);let dt;O.isData3DTexture?(U.setTexture3D(O,0),dt=D.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(U.setTexture2DArray(O,0),dt=D.TEXTURE_2D_ARRAY):(U.setTexture2D(O,0),dt=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,O.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,O.unpackAlignment);const rt=D.getParameter(D.UNPACK_ROW_LENGTH),ln=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Zi=D.getParameter(D.UNPACK_SKIP_PIXELS),cn=D.getParameter(D.UNPACK_SKIP_ROWS),Ls=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,wt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,wt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Fe),D.pixelStorei(D.UNPACK_SKIP_ROWS,Be),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ue);const Mt=A.isDataArrayTexture||A.isData3DTexture,Qt=O.isDataArrayTexture||O.isData3DTexture;if(A.isDepthTexture){const mn=x.get(A),Yt=x.get(O),en=x.get(mn.__renderTarget),Ua=x.get(Yt.__renderTarget);Le.bindFramebuffer(D.READ_FRAMEBUFFER,en.__webglFramebuffer),Le.bindFramebuffer(D.DRAW_FRAMEBUFFER,Ua.__webglFramebuffer);for(let Ri=0;Ri<we;Ri++)Mt&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,x.get(A).__webglTexture,G,Ue+Ri),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,x.get(O).__webglTexture,fe,At+Ri)),D.blitFramebuffer(Fe,Be,Te,me,Ze,pt,Te,me,D.DEPTH_BUFFER_BIT,D.NEAREST);Le.bindFramebuffer(D.READ_FRAMEBUFFER,null),Le.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(G!==0||A.isRenderTargetTexture||x.has(A)){const mn=x.get(A),Yt=x.get(O);Le.bindFramebuffer(D.READ_FRAMEBUFFER,Xm),Le.bindFramebuffer(D.DRAW_FRAMEBUFFER,qm);for(let en=0;en<we;en++)Mt?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,mn.__webglTexture,G,Ue+en):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,mn.__webglTexture,G),Qt?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Yt.__webglTexture,fe,At+en):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Yt.__webglTexture,fe),G!==0?D.blitFramebuffer(Fe,Be,Te,me,Ze,pt,Te,me,D.COLOR_BUFFER_BIT,D.NEAREST):Qt?D.copyTexSubImage3D(dt,fe,Ze,pt,At+en,Fe,Be,Te,me):D.copyTexSubImage2D(dt,fe,Ze,pt,Fe,Be,Te,me);Le.bindFramebuffer(D.READ_FRAMEBUFFER,null),Le.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else Qt?A.isDataTexture||A.isData3DTexture?D.texSubImage3D(dt,fe,Ze,pt,At,Te,me,we,vt,Ne,wt.data):O.isCompressedArrayTexture?D.compressedTexSubImage3D(dt,fe,Ze,pt,At,Te,me,we,vt,wt.data):D.texSubImage3D(dt,fe,Ze,pt,At,Te,me,we,vt,Ne,wt):A.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,fe,Ze,pt,Te,me,vt,Ne,wt.data):A.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,fe,Ze,pt,wt.width,wt.height,vt,wt.data):D.texSubImage2D(D.TEXTURE_2D,fe,Ze,pt,Te,me,vt,Ne,wt);D.pixelStorei(D.UNPACK_ROW_LENGTH,rt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,ln),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Zi),D.pixelStorei(D.UNPACK_SKIP_ROWS,cn),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ls),fe===0&&O.generateMipmaps&&D.generateMipmap(dt),Le.unbindTexture()},this.initRenderTarget=function(A){x.get(A).__webglFramebuffer===void 0&&U.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?U.setTextureCube(A,0):A.isData3DTexture?U.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?U.setTexture2DArray(A,0):U.setTexture2D(A,0),Le.unbindTexture()},this.resetState=function(){P=0,k=0,B=null,Le.reset(),be.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}}const qr=8,$P=Ee({__name:"BackgroundLens",setup(n){const e=["#42b883","#5ab8c8","#9080d0","#e0a058"],t=Ve(null),i=Ve(null),s=Ve(null),r=Ve(45),a=Ve(0),o=Ve(new nt(0,0)),l=Ve(new nt(0,0)),c=Ve(8);let u=null,h=null,d=null,f=null,g=null,v=null,m=null;const p=()=>{const w=document.documentElement,R=getComputedStyle(w),_=[];for(let b=1;b<=qr;b++){const P=R.getPropertyValue(`--bg-lens-${b}`).trim();P&&_.push(P)}return _.length>0?_:e},M=w=>{const R=w.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);if(R)return new H(parseInt(R[1],10)/255,parseInt(R[2],10)/255,parseInt(R[3],10)/255);const _=w.replace("#","").trim();return _.length===3?new H(parseInt(_[0]+_[0],16)/255,parseInt(_[1]+_[1],16)/255,parseInt(_[2]+_[2],16)/255):_.length>=6?new H(parseInt(_.slice(0,2),16)/255,parseInt(_.slice(2,4),16)/255,parseInt(_.slice(4,6),16)/255):new H(0,0,0)},y=()=>{if(!s.value)return;const w=s.value,R=p().filter(Boolean).slice(0,qr).map(M),_=w.uniforms.uColors.value;for(let b=0;b<qr;b++)b<R.length?_[b].copy(R[b]):_[b].set(0,0,0);w.uniforms.uColorCount.value=R.length,w.uniforms.uTransparent.value=1,i.value&&i.value.setClearColor(0,0)},S=()=>{if(!t.value||!i.value||!s.value)return;const w=t.value.clientWidth||1,R=t.value.clientHeight||1;i.value.setSize(w,R,!1),s.value.uniforms.uCanvas.value.set(w,R)},E=w=>{if(!t.value)return;const R=t.value.getBoundingClientRect(),_=(w.clientX-R.left)/(R.width||1)*2-1,b=-((w.clientY-R.top)/(R.height||1)*2-1);o.value.set(_,b)},T=()=>{if(!s.value||!f||!g||!i.value||!d)return;const w=d.getDelta(),R=d.elapsedTime;s.value.uniforms.uTime.value=R;const b=(r.value%360+a.value*R)*Math.PI/180,P=Math.cos(b),k=Math.sin(b);s.value.uniforms.uRot.value.set(P,k);const B=l.value,N=o.value,j=Math.min(1,w*c.value);B.lerp(N,j),s.value.uniforms.uPointer.value.copy(B),i.value.render(f,g),u=requestAnimationFrame(T)};return qt(()=>{if(!t.value)return;f=new BT,g=new Xc(-1,1,1,-1,0,1);const w=new _r(2,2),R=Array.from({length:qr},()=>new H(0,0,0)),_=new Rn({vertexShader:L1,fragmentShader:P1,uniforms:{uCanvas:{value:new nt(1,1)},uTime:{value:1},uSpeed:{value:.5},uRot:{value:new nt(1,0)},uColorCount:{value:0},uColors:{value:R},uTransparent:{value:1},uScale:{value:1},uFrequency:{value:1},uWarpStrength:{value:1},uPointer:{value:new nt(0,0)},uMouseInfluence:{value:1},uParallax:{value:.5},uNoise:{value:.1},uOpacity:{value:.75}},premultipliedAlpha:!0,transparent:!0});s.value=_,v=new qn(w,_),f.add(v);const b=new WP({antialias:!1,powerPreference:"high-performance",alpha:!0});i.value=b,b.outputColorSpace=fn,b.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),b.setClearColor(0,0),b.domElement.style.width="100%",b.domElement.style.height="100%",b.domElement.style.display="block",t.value.appendChild(b.domElement),d=new YT,S(),y(),m=new MutationObserver(()=>{y()}),m.observe(document.documentElement,{attributes:!0,attributeFilter:["class"]}),"ResizeObserver"in window?(h=new ResizeObserver(S),h.observe(t.value)):window.addEventListener("resize",S),t.value.addEventListener("pointermove",E),u=requestAnimationFrame(T)}),hi(()=>{var w;u!==null&&cancelAnimationFrame(u),m==null||m.disconnect(),m=null,h?h.disconnect():window.removeEventListener("resize",S),t.value&&t.value.removeEventListener("pointermove",E),v&&v.geometry.dispose(),s.value&&s.value.dispose(),i.value&&(i.value.dispose(),i.value.domElement&&((w=t.value)!=null&&w.contains(i.value.domElement))&&t.value.removeChild(i.value.domElement))}),(w,R)=>(I(),K("div",{ref_key:"containerRef",ref:t,class:it(["w-full h-full relative overflow-hidden pointer-events-none!",w.$attrs.class])},null,2))}}),XP={class:"VDndHome__hero-inner"},qP={class:"VDndHome__hero-layout"},YP={class:"VDndHome__hero-text"},jP={key:0,class:"accent"},KP={key:1},ZP=["href"],JP={class:"VDndHome__feature-icon","aria-hidden":"true"},QP={class:"VDndHome__feature-title"},e2={class:"VDndHome__feature-desc"},t2="https://raw.githubusercontent.com/ZiZIGY/vue-dnd-kit/refs/heads/v2/public/logo-v2.svg",Lo=.08,n2=Ee({__name:"CustomHome",setup(n){const{frontmatter:e,theme:t}=Zs(),i=l=>l.startsWith("http")?l:Sa(l),s=e.value.hero??{},r=s.actions??[],a=e.value.features??[],o={type:"spring",stiffness:120,damping:24};return(l,c)=>(I(),ve(L(nn).div,{class:"VDndHome relative",initial:{opacity:0},animate:{opacity:1},transition:{duration:.4}},{default:z(()=>[ye(L($P),{class:"fixed! inset-0 -z-20"}),ye(L(nn).main,{class:"container mx-auto",initial:{opacity:0},animate:{opacity:1},transition:{duration:.5,delay:.1}},{default:z(()=>[ye(L(nn).section,{class:"VDndHome__hero glass-card rounded-4xl",initial:{opacity:0,y:24},animate:{opacity:1,y:0},transition:{...o,delay:.15}},{default:z(()=>[ee("div",XP,[ee("div",qP,[ee("header",YP,[ye(L(nn).h1,{class:"VDndHome__title",initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{...o,delay:.25}},{default:z(()=>[L(s).name?(I(),K("span",jP,Qe(L(s).name),1)):Se("",!0),L(s).text?(I(),K("span",KP," — "+Qe(L(s).text),1)):Se("",!0)]),_:1},8,["transition"]),L(s).tagline?(I(),ve(L(nn).p,{key:0,class:"VDndHome__tagline",initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{...o,delay:.25+Lo}},{default:z(()=>[ri(Qe(L(s).tagline),1)]),_:1},8,["transition"])):Se("",!0),L(s).sub?(I(),ve(L(nn).p,{key:1,class:"VDndHome__sub",initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{...o,delay:.25+Lo*2}},{default:z(()=>[ri(Qe(L(s).sub),1)]),_:1},8,["transition"])):Se("",!0),L(r).length?(I(),ve(L(nn).nav,{key:2,class:"VDndHome__actions","aria-label":"Main",initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{...o,delay:.25+Lo*3}},{default:z(()=>[(I(!0),K(ct,null,zt(L(r),u=>(I(),K("a",{key:u.link,href:i(u.link),class:it(["glass-btn",u.theme==="brand"?"glass-btn--primary":""])},Qe(u.text),11,ZP))),128))]),_:1},8,["transition"])):Se("",!0)]),ye(L(nn).div,{class:"VDndHome__hero-logo","aria-hidden":"true",initial:{opacity:0,scale:.96},animate:{opacity:1,scale:1},transition:{...o,delay:.35}},{default:z(()=>[c[0]||(c[0]=ee("div",{class:"VDndHome__logo-glow"},null,-1)),ee("img",{src:t2,alt:"Vue DnD Kit",class:"VDndHome__logo-img"})]),_:1},8,["transition"])])])]),_:1},8,["transition"]),L(a).length?(I(),ve(L(nn).section,{key:0,class:"VDndHome__features","aria-label":"Features"},{default:z(()=>[(I(!0),K(ct,null,zt(L(a),(u,h)=>(I(),ve(L(nn).article,{key:h,class:"VDndHome__feature-card glass-card rounded-4xl",initial:{opacity:0,y:20},"while-in-view":{opacity:1,y:0},transition:{type:"spring",stiffness:100,damping:20,delay:Number(h)*.08},"in-view-options":{once:!0,margin:"-40px"}},{default:z(()=>[ee("span",JP,Qe(u.icon),1),ee("h3",QP,Qe(u.title),1),ee("p",e2,Qe(u.description),1)]),_:2},1032,["transition"]))),128))]),_:1})):Se("",!0)]),_:1})]),_:1}))}});function Ks(n){let e=n[0],t=n[1],i=n[2];return Math.sqrt(e*e+t*t+i*i)}function tc(n,e){return n[0]=e[0],n[1]=e[1],n[2]=e[2],n}function i2(n,e,t,i){return n[0]=e,n[1]=t,n[2]=i,n}function Nd(n,e,t){return n[0]=e[0]+t[0],n[1]=e[1]+t[1],n[2]=e[2]+t[2],n}function Od(n,e,t){return n[0]=e[0]-t[0],n[1]=e[1]-t[1],n[2]=e[2]-t[2],n}function s2(n,e,t){return n[0]=e[0]*t[0],n[1]=e[1]*t[1],n[2]=e[2]*t[2],n}function r2(n,e,t){return n[0]=e[0]/t[0],n[1]=e[1]/t[1],n[2]=e[2]/t[2],n}function Do(n,e,t){return n[0]=e[0]*t,n[1]=e[1]*t,n[2]=e[2]*t,n}function a2(n,e){let t=e[0]-n[0],i=e[1]-n[1],s=e[2]-n[2];return Math.sqrt(t*t+i*i+s*s)}function o2(n,e){let t=e[0]-n[0],i=e[1]-n[1],s=e[2]-n[2];return t*t+i*i+s*s}function Bd(n){let e=n[0],t=n[1],i=n[2];return e*e+t*t+i*i}function l2(n,e){return n[0]=-e[0],n[1]=-e[1],n[2]=-e[2],n}function c2(n,e){return n[0]=1/e[0],n[1]=1/e[1],n[2]=1/e[2],n}function nc(n,e){let t=e[0],i=e[1],s=e[2],r=t*t+i*i+s*s;return r>0&&(r=1/Math.sqrt(r)),n[0]=e[0]*r,n[1]=e[1]*r,n[2]=e[2]*r,n}function Nm(n,e){return n[0]*e[0]+n[1]*e[1]+n[2]*e[2]}function Vd(n,e,t){let i=e[0],s=e[1],r=e[2],a=t[0],o=t[1],l=t[2];return n[0]=s*l-r*o,n[1]=r*a-i*l,n[2]=i*o-s*a,n}function u2(n,e,t,i){let s=e[0],r=e[1],a=e[2];return n[0]=s+i*(t[0]-s),n[1]=r+i*(t[1]-r),n[2]=a+i*(t[2]-a),n}function h2(n,e,t,i,s){const r=Math.exp(-i*s);let a=e[0],o=e[1],l=e[2];return n[0]=t[0]+(a-t[0])*r,n[1]=t[1]+(o-t[1])*r,n[2]=t[2]+(l-t[2])*r,n}function d2(n,e,t){let i=e[0],s=e[1],r=e[2],a=t[3]*i+t[7]*s+t[11]*r+t[15];return a=a||1,n[0]=(t[0]*i+t[4]*s+t[8]*r+t[12])/a,n[1]=(t[1]*i+t[5]*s+t[9]*r+t[13])/a,n[2]=(t[2]*i+t[6]*s+t[10]*r+t[14])/a,n}function f2(n,e,t){let i=e[0],s=e[1],r=e[2],a=t[3]*i+t[7]*s+t[11]*r+t[15];return a=a||1,n[0]=(t[0]*i+t[4]*s+t[8]*r)/a,n[1]=(t[1]*i+t[5]*s+t[9]*r)/a,n[2]=(t[2]*i+t[6]*s+t[10]*r)/a,n}function p2(n,e,t){let i=e[0],s=e[1],r=e[2];return n[0]=i*t[0]+s*t[3]+r*t[6],n[1]=i*t[1]+s*t[4]+r*t[7],n[2]=i*t[2]+s*t[5]+r*t[8],n}function m2(n,e,t){let i=e[0],s=e[1],r=e[2],a=t[0],o=t[1],l=t[2],c=t[3],u=o*r-l*s,h=l*i-a*r,d=a*s-o*i,f=o*d-l*h,g=l*u-a*d,v=a*h-o*u,m=c*2;return u*=m,h*=m,d*=m,f*=2,g*=2,v*=2,n[0]=i+u+f,n[1]=s+h+g,n[2]=r+d+v,n}const g2=function(){const n=[0,0,0],e=[0,0,0];return function(t,i){tc(n,t),tc(e,i),nc(n,n),nc(e,e);let s=Nm(n,e);return s>1?0:s<-1?Math.PI:Math.acos(s)}}();function v2(n,e){return n[0]===e[0]&&n[1]===e[1]&&n[2]===e[2]}class An extends Array{constructor(e=0,t=e,i=e){return super(e,t,i),this}get x(){return this[0]}get y(){return this[1]}get z(){return this[2]}set x(e){this[0]=e}set y(e){this[1]=e}set z(e){this[2]=e}set(e,t=e,i=e){return e.length?this.copy(e):(i2(this,e,t,i),this)}copy(e){return tc(this,e),this}add(e,t){return t?Nd(this,e,t):Nd(this,this,e),this}sub(e,t){return t?Od(this,e,t):Od(this,this,e),this}multiply(e){return e.length?s2(this,this,e):Do(this,this,e),this}divide(e){return e.length?r2(this,this,e):Do(this,this,1/e),this}inverse(e=this){return c2(this,e),this}len(){return Ks(this)}distance(e){return e?a2(this,e):Ks(this)}squaredLen(){return Bd(this)}squaredDistance(e){return e?o2(this,e):Bd(this)}negate(e=this){return l2(this,e),this}cross(e,t){return t?Vd(this,e,t):Vd(this,this,e),this}scale(e){return Do(this,this,e),this}normalize(){return nc(this,this),this}dot(e){return Nm(this,e)}equals(e){return v2(this,e)}applyMatrix3(e){return p2(this,this,e),this}applyMatrix4(e){return d2(this,this,e),this}scaleRotateMatrix4(e){return f2(this,this,e),this}applyQuaternion(e){return m2(this,this,e),this}angle(e){return g2(this,e)}lerp(e,t){return u2(this,this,e,t),this}smoothLerp(e,t,i){return h2(this,this,e,t,i),this}clone(){return new An(this[0],this[1],this[2])}fromArray(e,t=0){return this[0]=e[t],this[1]=e[t+1],this[2]=e[t+2],this}toArray(e=[],t=0){return e[t]=this[0],e[t+1]=this[1],e[t+2]=this[2],e}transformDirection(e){const t=this[0],i=this[1],s=this[2];return this[0]=e[0]*t+e[4]*i+e[8]*s,this[1]=e[1]*t+e[5]*i+e[9]*s,this[2]=e[2]*t+e[6]*i+e[10]*s,this.normalize()}}const kd=new An;let _2=1,x2=1,zd=!1;class y2{constructor(e,t={}){e.canvas||console.error("gl not passed as first argument to Geometry"),this.gl=e,this.attributes=t,this.id=_2++,this.VAOs={},this.drawRange={start:0,count:0},this.instancedCount=0,this.gl.renderer.bindVertexArray(null),this.gl.renderer.currentGeometry=null,this.glState=this.gl.renderer.state;for(let i in t)this.addAttribute(i,t[i])}addAttribute(e,t){if(this.attributes[e]=t,t.id=x2++,t.size=t.size||1,t.type=t.type||(t.data.constructor===Float32Array?this.gl.FLOAT:t.data.constructor===Uint16Array?this.gl.UNSIGNED_SHORT:this.gl.UNSIGNED_INT),t.target=e==="index"?this.gl.ELEMENT_ARRAY_BUFFER:this.gl.ARRAY_BUFFER,t.normalized=t.normalized||!1,t.stride=t.stride||0,t.offset=t.offset||0,t.count=t.count||(t.stride?t.data.byteLength/t.stride:t.data.length/t.size),t.divisor=t.instanced||0,t.needsUpdate=!1,t.usage=t.usage||this.gl.STATIC_DRAW,t.buffer||this.updateAttribute(t),t.divisor){if(this.isInstanced=!0,this.instancedCount&&this.instancedCount!==t.count*t.divisor)return console.warn("geometry has multiple instanced buffers of different length"),this.instancedCount=Math.min(this.instancedCount,t.count*t.divisor);this.instancedCount=t.count*t.divisor}else e==="index"?this.drawRange.count=t.count:this.attributes.index||(this.drawRange.count=Math.max(this.drawRange.count,t.count))}updateAttribute(e){const t=!e.buffer;t&&(e.buffer=this.gl.createBuffer()),this.glState.boundBuffer!==e.buffer&&(this.gl.bindBuffer(e.target,e.buffer),this.glState.boundBuffer=e.buffer),t?this.gl.bufferData(e.target,e.data,e.usage):this.gl.bufferSubData(e.target,0,e.data),e.needsUpdate=!1}setIndex(e){this.addAttribute("index",e)}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}setInstancedCount(e){this.instancedCount=e}createVAO(e){this.VAOs[e.attributeOrder]=this.gl.renderer.createVertexArray(),this.gl.renderer.bindVertexArray(this.VAOs[e.attributeOrder]),this.bindAttributes(e)}bindAttributes(e){e.attributeLocations.forEach((t,{name:i,type:s})=>{if(!this.attributes[i]){console.warn(`active attribute ${i} not being supplied`);return}const r=this.attributes[i];this.gl.bindBuffer(r.target,r.buffer),this.glState.boundBuffer=r.buffer;let a=1;s===35674&&(a=2),s===35675&&(a=3),s===35676&&(a=4);const o=r.size/a,l=a===1?0:a*a*4,c=a===1?0:a*4;for(let u=0;u<a;u++)this.gl.vertexAttribPointer(t+u,o,r.type,r.normalized,r.stride+l,r.offset+u*c),this.gl.enableVertexAttribArray(t+u),this.gl.renderer.vertexAttribDivisor(t+u,r.divisor)}),this.attributes.index&&this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this.attributes.index.buffer)}draw({program:e,mode:t=this.gl.TRIANGLES}){var s;this.gl.renderer.currentGeometry!==`${this.id}_${e.attributeOrder}`&&(this.VAOs[e.attributeOrder]||this.createVAO(e),this.gl.renderer.bindVertexArray(this.VAOs[e.attributeOrder]),this.gl.renderer.currentGeometry=`${this.id}_${e.attributeOrder}`),e.attributeLocations.forEach((r,{name:a})=>{const o=this.attributes[a];o.needsUpdate&&this.updateAttribute(o)});let i=2;((s=this.attributes.index)==null?void 0:s.type)===this.gl.UNSIGNED_INT&&(i=4),this.isInstanced?this.attributes.index?this.gl.renderer.drawElementsInstanced(t,this.drawRange.count,this.attributes.index.type,this.attributes.index.offset+this.drawRange.start*i,this.instancedCount):this.gl.renderer.drawArraysInstanced(t,this.drawRange.start,this.drawRange.count,this.instancedCount):this.attributes.index?this.gl.drawElements(t,this.drawRange.count,this.attributes.index.type,this.attributes.index.offset+this.drawRange.start*i):this.gl.drawArrays(t,this.drawRange.start,this.drawRange.count)}getPosition(){const e=this.attributes.position;if(e.data)return e;if(!zd)return console.warn("No position buffer data found to compute bounds"),zd=!0}computeBoundingBox(e){e||(e=this.getPosition());const t=e.data,i=e.size;this.bounds||(this.bounds={min:new An,max:new An,center:new An,scale:new An,radius:1/0});const s=this.bounds.min,r=this.bounds.max,a=this.bounds.center,o=this.bounds.scale;s.set(1/0),r.set(-1/0);for(let l=0,c=t.length;l<c;l+=i){const u=t[l],h=t[l+1],d=t[l+2];s.x=Math.min(u,s.x),s.y=Math.min(h,s.y),s.z=Math.min(d,s.z),r.x=Math.max(u,r.x),r.y=Math.max(h,r.y),r.z=Math.max(d,r.z)}o.sub(r,s),a.add(s,r).divide(2)}computeBoundingSphere(e){e||(e=this.getPosition());const t=e.data,i=e.size;this.bounds||this.computeBoundingBox(e);let s=0;for(let r=0,a=t.length;r<a;r+=i)kd.fromArray(t,r),s=Math.max(s,this.bounds.center.squaredDistance(kd));this.bounds.radius=Math.sqrt(s)}remove(){for(let e in this.VAOs)this.gl.renderer.deleteVertexArray(this.VAOs[e]),delete this.VAOs[e];for(let e in this.attributes)this.gl.deleteBuffer(this.attributes[e].buffer),delete this.attributes[e]}}let S2=1;const Gd={};class M2{constructor(e,{vertex:t,fragment:i,uniforms:s={},transparent:r=!1,cullFace:a=e.BACK,frontFace:o=e.CCW,depthTest:l=!0,depthWrite:c=!0,depthFunc:u=e.LEQUAL}={}){e.canvas||console.error("gl not passed as first argument to Program"),this.gl=e,this.uniforms=s,this.id=S2++,t||console.warn("vertex shader not supplied"),i||console.warn("fragment shader not supplied"),this.transparent=r,this.cullFace=a,this.frontFace=o,this.depthTest=l,this.depthWrite=c,this.depthFunc=u,this.blendFunc={},this.blendEquation={},this.stencilFunc={},this.stencilOp={},this.transparent&&!this.blendFunc.src&&(this.gl.renderer.premultipliedAlpha?this.setBlendFunc(this.gl.ONE,this.gl.ONE_MINUS_SRC_ALPHA):this.setBlendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA)),this.vertexShader=e.createShader(e.VERTEX_SHADER),this.fragmentShader=e.createShader(e.FRAGMENT_SHADER),this.program=e.createProgram(),e.attachShader(this.program,this.vertexShader),e.attachShader(this.program,this.fragmentShader),this.setShaders({vertex:t,fragment:i})}setShaders({vertex:e,fragment:t}){if(e&&(this.gl.shaderSource(this.vertexShader,e),this.gl.compileShader(this.vertexShader),this.gl.getShaderInfoLog(this.vertexShader)!==""&&console.warn(`${this.gl.getShaderInfoLog(this.vertexShader)}
Vertex Shader
${Hd(e)}`)),t&&(this.gl.shaderSource(this.fragmentShader,t),this.gl.compileShader(this.fragmentShader),this.gl.getShaderInfoLog(this.fragmentShader)!==""&&console.warn(`${this.gl.getShaderInfoLog(this.fragmentShader)}
Fragment Shader
${Hd(t)}`)),this.gl.linkProgram(this.program),!this.gl.getProgramParameter(this.program,this.gl.LINK_STATUS))return console.warn(this.gl.getProgramInfoLog(this.program));this.uniformLocations=new Map;let i=this.gl.getProgramParameter(this.program,this.gl.ACTIVE_UNIFORMS);for(let a=0;a<i;a++){let o=this.gl.getActiveUniform(this.program,a);this.uniformLocations.set(o,this.gl.getUniformLocation(this.program,o.name));const l=o.name.match(/(\w+)/g);o.uniformName=l[0],o.nameComponents=l.slice(1)}this.attributeLocations=new Map;const s=[],r=this.gl.getProgramParameter(this.program,this.gl.ACTIVE_ATTRIBUTES);for(let a=0;a<r;a++){const o=this.gl.getActiveAttrib(this.program,a),l=this.gl.getAttribLocation(this.program,o.name);l!==-1&&(s[l]=o.name,this.attributeLocations.set(o,l))}this.attributeOrder=s.join("")}setBlendFunc(e,t,i,s){this.blendFunc.src=e,this.blendFunc.dst=t,this.blendFunc.srcAlpha=i,this.blendFunc.dstAlpha=s,e&&(this.transparent=!0)}setBlendEquation(e,t){this.blendEquation.modeRGB=e,this.blendEquation.modeAlpha=t}setStencilFunc(e,t,i){this.stencilRef=t,this.stencilFunc.func=e,this.stencilFunc.ref=t,this.stencilFunc.mask=i}setStencilOp(e,t,i){this.stencilOp.stencilFail=e,this.stencilOp.depthFail=t,this.stencilOp.depthPass=i}applyState(){this.depthTest?this.gl.renderer.enable(this.gl.DEPTH_TEST):this.gl.renderer.disable(this.gl.DEPTH_TEST),this.cullFace?this.gl.renderer.enable(this.gl.CULL_FACE):this.gl.renderer.disable(this.gl.CULL_FACE),this.blendFunc.src?this.gl.renderer.enable(this.gl.BLEND):this.gl.renderer.disable(this.gl.BLEND),this.cullFace&&this.gl.renderer.setCullFace(this.cullFace),this.gl.renderer.setFrontFace(this.frontFace),this.gl.renderer.setDepthMask(this.depthWrite),this.gl.renderer.setDepthFunc(this.depthFunc),this.blendFunc.src&&this.gl.renderer.setBlendFunc(this.blendFunc.src,this.blendFunc.dst,this.blendFunc.srcAlpha,this.blendFunc.dstAlpha),this.gl.renderer.setBlendEquation(this.blendEquation.modeRGB,this.blendEquation.modeAlpha),this.stencilFunc.func||this.stencilOp.stencilFail?this.gl.renderer.enable(this.gl.STENCIL_TEST):this.gl.renderer.disable(this.gl.STENCIL_TEST),this.gl.renderer.setStencilFunc(this.stencilFunc.func,this.stencilFunc.ref,this.stencilFunc.mask),this.gl.renderer.setStencilOp(this.stencilOp.stencilFail,this.stencilOp.depthFail,this.stencilOp.depthPass)}use({flipFaces:e=!1}={}){let t=-1;this.gl.renderer.state.currentProgram===this.id||(this.gl.useProgram(this.program),this.gl.renderer.state.currentProgram=this.id),this.uniformLocations.forEach((s,r)=>{let a=this.uniforms[r.uniformName];for(const o of r.nameComponents){if(!a)break;if(o in a)a=a[o];else{if(Array.isArray(a.value))break;a=void 0;break}}if(!a)return Wd(`Active uniform ${r.name} has not been supplied`);if(a&&a.value===void 0)return Wd(`${r.name} uniform is missing a value parameter`);if(a.value.texture)return t=t+1,a.value.update(t),Io(this.gl,r.type,s,t);if(a.value.length&&a.value[0].texture){const o=[];return a.value.forEach(l=>{t=t+1,l.update(t),o.push(t)}),Io(this.gl,r.type,s,o)}Io(this.gl,r.type,s,a.value)}),this.applyState(),e&&this.gl.renderer.setFrontFace(this.frontFace===this.gl.CCW?this.gl.CW:this.gl.CCW)}remove(){this.gl.deleteProgram(this.program)}}function Io(n,e,t,i){i=i.length?b2(i):i;const s=n.renderer.state.uniformLocations.get(t);if(i.length)if(s===void 0||s.length!==i.length)n.renderer.state.uniformLocations.set(t,i.slice(0));else{if(E2(s,i))return;s.set?s.set(i):T2(s,i),n.renderer.state.uniformLocations.set(t,s)}else{if(s===i)return;n.renderer.state.uniformLocations.set(t,i)}switch(e){case 5126:return i.length?n.uniform1fv(t,i):n.uniform1f(t,i);case 35664:return n.uniform2fv(t,i);case 35665:return n.uniform3fv(t,i);case 35666:return n.uniform4fv(t,i);case 35670:case 5124:case 35678:case 36306:case 35680:case 36289:return i.length?n.uniform1iv(t,i):n.uniform1i(t,i);case 35671:case 35667:return n.uniform2iv(t,i);case 35672:case 35668:return n.uniform3iv(t,i);case 35673:case 35669:return n.uniform4iv(t,i);case 35674:return n.uniformMatrix2fv(t,!1,i);case 35675:return n.uniformMatrix3fv(t,!1,i);case 35676:return n.uniformMatrix4fv(t,!1,i)}}function Hd(n){let e=n.split(`
`);for(let t=0;t<e.length;t++)e[t]=t+1+": "+e[t];return e.join(`
`)}function b2(n){const e=n.length,t=n[0].length;if(t===void 0)return n;const i=e*t;let s=Gd[i];s||(Gd[i]=s=new Float32Array(i));for(let r=0;r<e;r++)s.set(n[r],r*t);return s}function E2(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function T2(n,e){for(let t=0,i=n.length;t<i;t++)n[t]=e[t]}let Fo=0;function Wd(n){Fo>100||(console.warn(n),Fo++,Fo>100&&console.warn("More than 100 program warnings - stopping logs."))}const Uo=new An;let A2=1;class w2{constructor({canvas:e=document.createElement("canvas"),width:t=300,height:i=150,dpr:s=1,alpha:r=!1,depth:a=!0,stencil:o=!1,antialias:l=!1,premultipliedAlpha:c=!1,preserveDrawingBuffer:u=!1,powerPreference:h="default",autoClear:d=!0,webgl:f=2}={}){const g={alpha:r,depth:a,stencil:o,antialias:l,premultipliedAlpha:c,preserveDrawingBuffer:u,powerPreference:h};this.dpr=s,this.alpha=r,this.color=!0,this.depth=a,this.stencil=o,this.premultipliedAlpha=c,this.autoClear=d,this.id=A2++,f===2&&(this.gl=e.getContext("webgl2",g)),this.isWebgl2=!!this.gl,this.gl||(this.gl=e.getContext("webgl",g)),this.gl||console.error("unable to create webgl context"),this.gl.renderer=this,this.setSize(t,i),this.state={},this.state.blendFunc={src:this.gl.ONE,dst:this.gl.ZERO},this.state.blendEquation={modeRGB:this.gl.FUNC_ADD},this.state.cullFace=!1,this.state.frontFace=this.gl.CCW,this.state.depthMask=!0,this.state.depthFunc=this.gl.LEQUAL,this.state.premultiplyAlpha=!1,this.state.flipY=!1,this.state.unpackAlignment=4,this.state.framebuffer=null,this.state.viewport={x:0,y:0,width:null,height:null},this.state.textureUnits=[],this.state.activeTextureUnit=0,this.state.boundBuffer=null,this.state.uniformLocations=new Map,this.state.currentProgram=null,this.extensions={},this.isWebgl2?(this.getExtension("EXT_color_buffer_float"),this.getExtension("OES_texture_float_linear")):(this.getExtension("OES_texture_float"),this.getExtension("OES_texture_float_linear"),this.getExtension("OES_texture_half_float"),this.getExtension("OES_texture_half_float_linear"),this.getExtension("OES_element_index_uint"),this.getExtension("OES_standard_derivatives"),this.getExtension("EXT_sRGB"),this.getExtension("WEBGL_depth_texture"),this.getExtension("WEBGL_draw_buffers")),this.getExtension("WEBGL_compressed_texture_astc"),this.getExtension("EXT_texture_compression_bptc"),this.getExtension("WEBGL_compressed_texture_s3tc"),this.getExtension("WEBGL_compressed_texture_etc1"),this.getExtension("WEBGL_compressed_texture_pvrtc"),this.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),this.vertexAttribDivisor=this.getExtension("ANGLE_instanced_arrays","vertexAttribDivisor","vertexAttribDivisorANGLE"),this.drawArraysInstanced=this.getExtension("ANGLE_instanced_arrays","drawArraysInstanced","drawArraysInstancedANGLE"),this.drawElementsInstanced=this.getExtension("ANGLE_instanced_arrays","drawElementsInstanced","drawElementsInstancedANGLE"),this.createVertexArray=this.getExtension("OES_vertex_array_object","createVertexArray","createVertexArrayOES"),this.bindVertexArray=this.getExtension("OES_vertex_array_object","bindVertexArray","bindVertexArrayOES"),this.deleteVertexArray=this.getExtension("OES_vertex_array_object","deleteVertexArray","deleteVertexArrayOES"),this.drawBuffers=this.getExtension("WEBGL_draw_buffers","drawBuffers","drawBuffersWEBGL"),this.parameters={},this.parameters.maxTextureUnits=this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS),this.parameters.maxAnisotropy=this.getExtension("EXT_texture_filter_anisotropic")?this.gl.getParameter(this.getExtension("EXT_texture_filter_anisotropic").MAX_TEXTURE_MAX_ANISOTROPY_EXT):0}setSize(e,t){this.width=e,this.height=t,this.gl.canvas.width=e*this.dpr,this.gl.canvas.height=t*this.dpr,this.gl.canvas.style&&Object.assign(this.gl.canvas.style,{width:e+"px",height:t+"px"})}setViewport(e,t,i=0,s=0){this.state.viewport.width===e&&this.state.viewport.height===t||(this.state.viewport.width=e,this.state.viewport.height=t,this.state.viewport.x=i,this.state.viewport.y=s,this.gl.viewport(i,s,e,t))}setScissor(e,t,i=0,s=0){this.gl.scissor(i,s,e,t)}enable(e){this.state[e]!==!0&&(this.gl.enable(e),this.state[e]=!0)}disable(e){this.state[e]!==!1&&(this.gl.disable(e),this.state[e]=!1)}setBlendFunc(e,t,i,s){this.state.blendFunc.src===e&&this.state.blendFunc.dst===t&&this.state.blendFunc.srcAlpha===i&&this.state.blendFunc.dstAlpha===s||(this.state.blendFunc.src=e,this.state.blendFunc.dst=t,this.state.blendFunc.srcAlpha=i,this.state.blendFunc.dstAlpha=s,i!==void 0?this.gl.blendFuncSeparate(e,t,i,s):this.gl.blendFunc(e,t))}setBlendEquation(e,t){e=e||this.gl.FUNC_ADD,!(this.state.blendEquation.modeRGB===e&&this.state.blendEquation.modeAlpha===t)&&(this.state.blendEquation.modeRGB=e,this.state.blendEquation.modeAlpha=t,t!==void 0?this.gl.blendEquationSeparate(e,t):this.gl.blendEquation(e))}setCullFace(e){this.state.cullFace!==e&&(this.state.cullFace=e,this.gl.cullFace(e))}setFrontFace(e){this.state.frontFace!==e&&(this.state.frontFace=e,this.gl.frontFace(e))}setDepthMask(e){this.state.depthMask!==e&&(this.state.depthMask=e,this.gl.depthMask(e))}setDepthFunc(e){this.state.depthFunc!==e&&(this.state.depthFunc=e,this.gl.depthFunc(e))}setStencilMask(e){this.state.stencilMask!==e&&(this.state.stencilMask=e,this.gl.stencilMask(e))}setStencilFunc(e,t,i){this.state.stencilFunc===e&&this.state.stencilRef===t&&this.state.stencilFuncMask===i||(this.state.stencilFunc=e||this.gl.ALWAYS,this.state.stencilRef=t||0,this.state.stencilFuncMask=i||0,this.gl.stencilFunc(e||this.gl.ALWAYS,t||0,i||0))}setStencilOp(e,t,i){this.state.stencilFail===e&&this.state.stencilDepthFail===t&&this.state.stencilDepthPass===i||(this.state.stencilFail=e,this.state.stencilDepthFail=t,this.state.stencilDepthPass=i,this.gl.stencilOp(e,t,i))}activeTexture(e){this.state.activeTextureUnit!==e&&(this.state.activeTextureUnit=e,this.gl.activeTexture(this.gl.TEXTURE0+e))}bindFramebuffer({target:e=this.gl.FRAMEBUFFER,buffer:t=null}={}){this.state.framebuffer!==t&&(this.state.framebuffer=t,this.gl.bindFramebuffer(e,t))}getExtension(e,t,i){return t&&this.gl[t]?this.gl[t].bind(this.gl):(this.extensions[e]||(this.extensions[e]=this.gl.getExtension(e)),t?this.extensions[e]?this.extensions[e][i].bind(this.extensions[e]):null:this.extensions[e])}sortOpaque(e,t){return e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.program.id!==t.program.id?e.program.id-t.program.id:e.zDepth!==t.zDepth?e.zDepth-t.zDepth:t.id-e.id}sortTransparent(e,t){return e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.zDepth!==t.zDepth?t.zDepth-e.zDepth:t.id-e.id}sortUI(e,t){return e.renderOrder!==t.renderOrder?e.renderOrder-t.renderOrder:e.program.id!==t.program.id?e.program.id-t.program.id:t.id-e.id}getRenderList({scene:e,camera:t,frustumCull:i,sort:s}){let r=[];if(t&&i&&t.updateFrustum(),e.traverse(a=>{if(!a.visible)return!0;a.draw&&(i&&a.frustumCulled&&t&&!t.frustumIntersectsMesh(a)||r.push(a))}),s){const a=[],o=[],l=[];r.forEach(c=>{c.program.transparent?c.program.depthTest?o.push(c):l.push(c):a.push(c),c.zDepth=0,!(c.renderOrder!==0||!c.program.depthTest||!t)&&(c.worldMatrix.getTranslation(Uo),Uo.applyMatrix4(t.projectionViewMatrix),c.zDepth=Uo.z)}),a.sort(this.sortOpaque),o.sort(this.sortTransparent),l.sort(this.sortUI),r=a.concat(o,l)}return r}render({scene:e,camera:t,target:i=null,update:s=!0,sort:r=!0,frustumCull:a=!0,clear:o}){i===null?(this.bindFramebuffer(),this.setViewport(this.width*this.dpr,this.height*this.dpr)):(this.bindFramebuffer(i),this.setViewport(i.width,i.height)),(o||this.autoClear&&o!==!1)&&(this.depth&&(!i||i.depth)&&(this.enable(this.gl.DEPTH_TEST),this.setDepthMask(!0)),(this.stencil||!i||i.stencil)&&(this.enable(this.gl.STENCIL_TEST),this.setStencilMask(255)),this.gl.clear((this.color?this.gl.COLOR_BUFFER_BIT:0)|(this.depth?this.gl.DEPTH_BUFFER_BIT:0)|(this.stencil?this.gl.STENCIL_BUFFER_BIT:0))),s&&e.updateMatrixWorld(),t&&t.updateMatrixWorld(),this.getRenderList({scene:e,camera:t,frustumCull:a,sort:r}).forEach(c=>{c.draw({camera:t})})}}function C2(n,e){return n[0]=e[0],n[1]=e[1],n[2]=e[2],n[3]=e[3],n}function R2(n,e,t,i,s){return n[0]=e,n[1]=t,n[2]=i,n[3]=s,n}function P2(n,e){let t=e[0],i=e[1],s=e[2],r=e[3],a=t*t+i*i+s*s+r*r;return a>0&&(a=1/Math.sqrt(a)),n[0]=t*a,n[1]=i*a,n[2]=s*a,n[3]=r*a,n}function L2(n,e){return n[0]*e[0]+n[1]*e[1]+n[2]*e[2]+n[3]*e[3]}function D2(n){return n[0]=0,n[1]=0,n[2]=0,n[3]=1,n}function I2(n,e,t){t=t*.5;let i=Math.sin(t);return n[0]=i*e[0],n[1]=i*e[1],n[2]=i*e[2],n[3]=Math.cos(t),n}function $d(n,e,t){let i=e[0],s=e[1],r=e[2],a=e[3],o=t[0],l=t[1],c=t[2],u=t[3];return n[0]=i*u+a*o+s*c-r*l,n[1]=s*u+a*l+r*o-i*c,n[2]=r*u+a*c+i*l-s*o,n[3]=a*u-i*o-s*l-r*c,n}function F2(n,e,t){t*=.5;let i=e[0],s=e[1],r=e[2],a=e[3],o=Math.sin(t),l=Math.cos(t);return n[0]=i*l+a*o,n[1]=s*l+r*o,n[2]=r*l-s*o,n[3]=a*l-i*o,n}function U2(n,e,t){t*=.5;let i=e[0],s=e[1],r=e[2],a=e[3],o=Math.sin(t),l=Math.cos(t);return n[0]=i*l-r*o,n[1]=s*l+a*o,n[2]=r*l+i*o,n[3]=a*l-s*o,n}function N2(n,e,t){t*=.5;let i=e[0],s=e[1],r=e[2],a=e[3],o=Math.sin(t),l=Math.cos(t);return n[0]=i*l+s*o,n[1]=s*l-i*o,n[2]=r*l+a*o,n[3]=a*l-r*o,n}function O2(n,e,t,i){let s=e[0],r=e[1],a=e[2],o=e[3],l=t[0],c=t[1],u=t[2],h=t[3],d,f,g,v,m;return f=s*l+r*c+a*u+o*h,f<0&&(f=-f,l=-l,c=-c,u=-u,h=-h),1-f>1e-6?(d=Math.acos(f),g=Math.sin(d),v=Math.sin((1-i)*d)/g,m=Math.sin(i*d)/g):(v=1-i,m=i),n[0]=v*s+m*l,n[1]=v*r+m*c,n[2]=v*a+m*u,n[3]=v*o+m*h,n}function B2(n,e){let t=e[0],i=e[1],s=e[2],r=e[3],a=t*t+i*i+s*s+r*r,o=a?1/a:0;return n[0]=-t*o,n[1]=-i*o,n[2]=-s*o,n[3]=r*o,n}function V2(n,e){return n[0]=-e[0],n[1]=-e[1],n[2]=-e[2],n[3]=e[3],n}function k2(n,e){let t=e[0]+e[4]+e[8],i;if(t>0)i=Math.sqrt(t+1),n[3]=.5*i,i=.5/i,n[0]=(e[5]-e[7])*i,n[1]=(e[6]-e[2])*i,n[2]=(e[1]-e[3])*i;else{let s=0;e[4]>e[0]&&(s=1),e[8]>e[s*3+s]&&(s=2);let r=(s+1)%3,a=(s+2)%3;i=Math.sqrt(e[s*3+s]-e[r*3+r]-e[a*3+a]+1),n[s]=.5*i,i=.5/i,n[3]=(e[r*3+a]-e[a*3+r])*i,n[r]=(e[r*3+s]+e[s*3+r])*i,n[a]=(e[a*3+s]+e[s*3+a])*i}return n}function z2(n,e,t="YXZ"){let i=Math.sin(e[0]*.5),s=Math.cos(e[0]*.5),r=Math.sin(e[1]*.5),a=Math.cos(e[1]*.5),o=Math.sin(e[2]*.5),l=Math.cos(e[2]*.5);return t==="XYZ"?(n[0]=i*a*l+s*r*o,n[1]=s*r*l-i*a*o,n[2]=s*a*o+i*r*l,n[3]=s*a*l-i*r*o):t==="YXZ"?(n[0]=i*a*l+s*r*o,n[1]=s*r*l-i*a*o,n[2]=s*a*o-i*r*l,n[3]=s*a*l+i*r*o):t==="ZXY"?(n[0]=i*a*l-s*r*o,n[1]=s*r*l+i*a*o,n[2]=s*a*o+i*r*l,n[3]=s*a*l-i*r*o):t==="ZYX"?(n[0]=i*a*l-s*r*o,n[1]=s*r*l+i*a*o,n[2]=s*a*o-i*r*l,n[3]=s*a*l+i*r*o):t==="YZX"?(n[0]=i*a*l+s*r*o,n[1]=s*r*l+i*a*o,n[2]=s*a*o-i*r*l,n[3]=s*a*l-i*r*o):t==="XZY"&&(n[0]=i*a*l-s*r*o,n[1]=s*r*l-i*a*o,n[2]=s*a*o+i*r*l,n[3]=s*a*l+i*r*o),n}const G2=C2,H2=R2,W2=L2,$2=P2;class X2 extends Array{constructor(e=0,t=0,i=0,s=1){super(e,t,i,s),this.onChange=()=>{},this._target=this;const r=["0","1","2","3"];return new Proxy(this,{set(a,o){const l=Reflect.set(...arguments);return l&&r.includes(o)&&a.onChange(),l}})}get x(){return this[0]}get y(){return this[1]}get z(){return this[2]}get w(){return this[3]}set x(e){this._target[0]=e,this.onChange()}set y(e){this._target[1]=e,this.onChange()}set z(e){this._target[2]=e,this.onChange()}set w(e){this._target[3]=e,this.onChange()}identity(){return D2(this._target),this.onChange(),this}set(e,t,i,s){return e.length?this.copy(e):(H2(this._target,e,t,i,s),this.onChange(),this)}rotateX(e){return F2(this._target,this._target,e),this.onChange(),this}rotateY(e){return U2(this._target,this._target,e),this.onChange(),this}rotateZ(e){return N2(this._target,this._target,e),this.onChange(),this}inverse(e=this._target){return B2(this._target,e),this.onChange(),this}conjugate(e=this._target){return V2(this._target,e),this.onChange(),this}copy(e){return G2(this._target,e),this.onChange(),this}normalize(e=this._target){return $2(this._target,e),this.onChange(),this}multiply(e,t){return t?$d(this._target,e,t):$d(this._target,this._target,e),this.onChange(),this}dot(e){return W2(this._target,e)}fromMatrix3(e){return k2(this._target,e),this.onChange(),this}fromEuler(e,t){return z2(this._target,e,e.order),t||this.onChange(),this}fromAxisAngle(e,t){return I2(this._target,e,t),this.onChange(),this}slerp(e,t){return O2(this._target,this._target,e,t),this.onChange(),this}fromArray(e,t=0){return this._target[0]=e[t],this._target[1]=e[t+1],this._target[2]=e[t+2],this._target[3]=e[t+3],this.onChange(),this}toArray(e=[],t=0){return e[t]=this[0],e[t+1]=this[1],e[t+2]=this[2],e[t+3]=this[3],e}}const q2=1e-6;function Y2(n,e){return n[0]=e[0],n[1]=e[1],n[2]=e[2],n[3]=e[3],n[4]=e[4],n[5]=e[5],n[6]=e[6],n[7]=e[7],n[8]=e[8],n[9]=e[9],n[10]=e[10],n[11]=e[11],n[12]=e[12],n[13]=e[13],n[14]=e[14],n[15]=e[15],n}function j2(n,e,t,i,s,r,a,o,l,c,u,h,d,f,g,v,m){return n[0]=e,n[1]=t,n[2]=i,n[3]=s,n[4]=r,n[5]=a,n[6]=o,n[7]=l,n[8]=c,n[9]=u,n[10]=h,n[11]=d,n[12]=f,n[13]=g,n[14]=v,n[15]=m,n}function K2(n){return n[0]=1,n[1]=0,n[2]=0,n[3]=0,n[4]=0,n[5]=1,n[6]=0,n[7]=0,n[8]=0,n[9]=0,n[10]=1,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,n}function Z2(n,e){let t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],g=e[12],v=e[13],m=e[14],p=e[15],M=t*o-i*a,y=t*l-s*a,S=t*c-r*a,E=i*l-s*o,T=i*c-r*o,w=s*c-r*l,R=u*v-h*g,_=u*m-d*g,b=u*p-f*g,P=h*m-d*v,k=h*p-f*v,B=d*p-f*m,N=M*B-y*k+S*P+E*b-T*_+w*R;return N?(N=1/N,n[0]=(o*B-l*k+c*P)*N,n[1]=(s*k-i*B-r*P)*N,n[2]=(v*w-m*T+p*E)*N,n[3]=(d*T-h*w-f*E)*N,n[4]=(l*b-a*B-c*_)*N,n[5]=(t*B-s*b+r*_)*N,n[6]=(m*S-g*w-p*y)*N,n[7]=(u*w-d*S+f*y)*N,n[8]=(a*k-o*b+c*R)*N,n[9]=(i*b-t*k-r*R)*N,n[10]=(g*T-v*S+p*M)*N,n[11]=(h*S-u*T-f*M)*N,n[12]=(o*_-a*P-l*R)*N,n[13]=(t*P-i*_+s*R)*N,n[14]=(v*y-g*E-m*M)*N,n[15]=(u*E-h*y+d*M)*N,n):null}function Om(n){let e=n[0],t=n[1],i=n[2],s=n[3],r=n[4],a=n[5],o=n[6],l=n[7],c=n[8],u=n[9],h=n[10],d=n[11],f=n[12],g=n[13],v=n[14],m=n[15],p=e*a-t*r,M=e*o-i*r,y=e*l-s*r,S=t*o-i*a,E=t*l-s*a,T=i*l-s*o,w=c*g-u*f,R=c*v-h*f,_=c*m-d*f,b=u*v-h*g,P=u*m-d*g,k=h*m-d*v;return p*k-M*P+y*b+S*_-E*R+T*w}function Xd(n,e,t){let i=e[0],s=e[1],r=e[2],a=e[3],o=e[4],l=e[5],c=e[6],u=e[7],h=e[8],d=e[9],f=e[10],g=e[11],v=e[12],m=e[13],p=e[14],M=e[15],y=t[0],S=t[1],E=t[2],T=t[3];return n[0]=y*i+S*o+E*h+T*v,n[1]=y*s+S*l+E*d+T*m,n[2]=y*r+S*c+E*f+T*p,n[3]=y*a+S*u+E*g+T*M,y=t[4],S=t[5],E=t[6],T=t[7],n[4]=y*i+S*o+E*h+T*v,n[5]=y*s+S*l+E*d+T*m,n[6]=y*r+S*c+E*f+T*p,n[7]=y*a+S*u+E*g+T*M,y=t[8],S=t[9],E=t[10],T=t[11],n[8]=y*i+S*o+E*h+T*v,n[9]=y*s+S*l+E*d+T*m,n[10]=y*r+S*c+E*f+T*p,n[11]=y*a+S*u+E*g+T*M,y=t[12],S=t[13],E=t[14],T=t[15],n[12]=y*i+S*o+E*h+T*v,n[13]=y*s+S*l+E*d+T*m,n[14]=y*r+S*c+E*f+T*p,n[15]=y*a+S*u+E*g+T*M,n}function J2(n,e,t){let i=t[0],s=t[1],r=t[2],a,o,l,c,u,h,d,f,g,v,m,p;return e===n?(n[12]=e[0]*i+e[4]*s+e[8]*r+e[12],n[13]=e[1]*i+e[5]*s+e[9]*r+e[13],n[14]=e[2]*i+e[6]*s+e[10]*r+e[14],n[15]=e[3]*i+e[7]*s+e[11]*r+e[15]):(a=e[0],o=e[1],l=e[2],c=e[3],u=e[4],h=e[5],d=e[6],f=e[7],g=e[8],v=e[9],m=e[10],p=e[11],n[0]=a,n[1]=o,n[2]=l,n[3]=c,n[4]=u,n[5]=h,n[6]=d,n[7]=f,n[8]=g,n[9]=v,n[10]=m,n[11]=p,n[12]=a*i+u*s+g*r+e[12],n[13]=o*i+h*s+v*r+e[13],n[14]=l*i+d*s+m*r+e[14],n[15]=c*i+f*s+p*r+e[15]),n}function Q2(n,e,t){let i=t[0],s=t[1],r=t[2];return n[0]=e[0]*i,n[1]=e[1]*i,n[2]=e[2]*i,n[3]=e[3]*i,n[4]=e[4]*s,n[5]=e[5]*s,n[6]=e[6]*s,n[7]=e[7]*s,n[8]=e[8]*r,n[9]=e[9]*r,n[10]=e[10]*r,n[11]=e[11]*r,n[12]=e[12],n[13]=e[13],n[14]=e[14],n[15]=e[15],n}function e3(n,e,t,i){let s=i[0],r=i[1],a=i[2],o=Math.hypot(s,r,a),l,c,u,h,d,f,g,v,m,p,M,y,S,E,T,w,R,_,b,P,k,B,N,j;return Math.abs(o)<q2?null:(o=1/o,s*=o,r*=o,a*=o,l=Math.sin(t),c=Math.cos(t),u=1-c,h=e[0],d=e[1],f=e[2],g=e[3],v=e[4],m=e[5],p=e[6],M=e[7],y=e[8],S=e[9],E=e[10],T=e[11],w=s*s*u+c,R=r*s*u+a*l,_=a*s*u-r*l,b=s*r*u-a*l,P=r*r*u+c,k=a*r*u+s*l,B=s*a*u+r*l,N=r*a*u-s*l,j=a*a*u+c,n[0]=h*w+v*R+y*_,n[1]=d*w+m*R+S*_,n[2]=f*w+p*R+E*_,n[3]=g*w+M*R+T*_,n[4]=h*b+v*P+y*k,n[5]=d*b+m*P+S*k,n[6]=f*b+p*P+E*k,n[7]=g*b+M*P+T*k,n[8]=h*B+v*N+y*j,n[9]=d*B+m*N+S*j,n[10]=f*B+p*N+E*j,n[11]=g*B+M*N+T*j,e!==n&&(n[12]=e[12],n[13]=e[13],n[14]=e[14],n[15]=e[15]),n)}function t3(n,e){return n[0]=e[12],n[1]=e[13],n[2]=e[14],n}function Bm(n,e){let t=e[0],i=e[1],s=e[2],r=e[4],a=e[5],o=e[6],l=e[8],c=e[9],u=e[10];return n[0]=Math.hypot(t,i,s),n[1]=Math.hypot(r,a,o),n[2]=Math.hypot(l,c,u),n}function n3(n){let e=n[0],t=n[1],i=n[2],s=n[4],r=n[5],a=n[6],o=n[8],l=n[9],c=n[10];const u=e*e+t*t+i*i,h=s*s+r*r+a*a,d=o*o+l*l+c*c;return Math.sqrt(Math.max(u,h,d))}const Vm=function(){const n=[1,1,1];return function(e,t){let i=n;Bm(i,t);let s=1/i[0],r=1/i[1],a=1/i[2],o=t[0]*s,l=t[1]*r,c=t[2]*a,u=t[4]*s,h=t[5]*r,d=t[6]*a,f=t[8]*s,g=t[9]*r,v=t[10]*a,m=o+h+v,p=0;return m>0?(p=Math.sqrt(m+1)*2,e[3]=.25*p,e[0]=(d-g)/p,e[1]=(f-c)/p,e[2]=(l-u)/p):o>h&&o>v?(p=Math.sqrt(1+o-h-v)*2,e[3]=(d-g)/p,e[0]=.25*p,e[1]=(l+u)/p,e[2]=(f+c)/p):h>v?(p=Math.sqrt(1+h-o-v)*2,e[3]=(f-c)/p,e[0]=(l+u)/p,e[1]=.25*p,e[2]=(d+g)/p):(p=Math.sqrt(1+v-o-h)*2,e[3]=(l-u)/p,e[0]=(f+c)/p,e[1]=(d+g)/p,e[2]=.25*p),e}}();function i3(n,e,t,i){let s=Ks([n[0],n[1],n[2]]);const r=Ks([n[4],n[5],n[6]]),a=Ks([n[8],n[9],n[10]]);Om(n)<0&&(s=-s),t[0]=n[12],t[1]=n[13],t[2]=n[14];const l=n.slice(),c=1/s,u=1/r,h=1/a;l[0]*=c,l[1]*=c,l[2]*=c,l[4]*=u,l[5]*=u,l[6]*=u,l[8]*=h,l[9]*=h,l[10]*=h,Vm(e,l),i[0]=s,i[1]=r,i[2]=a}function s3(n,e,t,i){const s=n,r=e[0],a=e[1],o=e[2],l=e[3],c=r+r,u=a+a,h=o+o,d=r*c,f=r*u,g=r*h,v=a*u,m=a*h,p=o*h,M=l*c,y=l*u,S=l*h,E=i[0],T=i[1],w=i[2];return s[0]=(1-(v+p))*E,s[1]=(f+S)*E,s[2]=(g-y)*E,s[3]=0,s[4]=(f-S)*T,s[5]=(1-(d+p))*T,s[6]=(m+M)*T,s[7]=0,s[8]=(g+y)*w,s[9]=(m-M)*w,s[10]=(1-(d+v))*w,s[11]=0,s[12]=t[0],s[13]=t[1],s[14]=t[2],s[15]=1,s}function r3(n,e){let t=e[0],i=e[1],s=e[2],r=e[3],a=t+t,o=i+i,l=s+s,c=t*a,u=i*a,h=i*o,d=s*a,f=s*o,g=s*l,v=r*a,m=r*o,p=r*l;return n[0]=1-h-g,n[1]=u+p,n[2]=d-m,n[3]=0,n[4]=u-p,n[5]=1-c-g,n[6]=f+v,n[7]=0,n[8]=d+m,n[9]=f-v,n[10]=1-c-h,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,n}function a3(n,e,t,i,s){let r=1/Math.tan(e/2),a=1/(i-s);return n[0]=r/t,n[1]=0,n[2]=0,n[3]=0,n[4]=0,n[5]=r,n[6]=0,n[7]=0,n[8]=0,n[9]=0,n[10]=(s+i)*a,n[11]=-1,n[12]=0,n[13]=0,n[14]=2*s*i*a,n[15]=0,n}function o3(n,e,t,i,s,r,a){let o=1/(e-t),l=1/(i-s),c=1/(r-a);return n[0]=-2*o,n[1]=0,n[2]=0,n[3]=0,n[4]=0,n[5]=-2*l,n[6]=0,n[7]=0,n[8]=0,n[9]=0,n[10]=2*c,n[11]=0,n[12]=(e+t)*o,n[13]=(s+i)*l,n[14]=(a+r)*c,n[15]=1,n}function l3(n,e,t,i){let s=e[0],r=e[1],a=e[2],o=i[0],l=i[1],c=i[2],u=s-t[0],h=r-t[1],d=a-t[2],f=u*u+h*h+d*d;f===0?d=1:(f=1/Math.sqrt(f),u*=f,h*=f,d*=f);let g=l*d-c*h,v=c*u-o*d,m=o*h-l*u;return f=g*g+v*v+m*m,f===0&&(c?o+=1e-6:l?c+=1e-6:l+=1e-6,g=l*d-c*h,v=c*u-o*d,m=o*h-l*u,f=g*g+v*v+m*m),f=1/Math.sqrt(f),g*=f,v*=f,m*=f,n[0]=g,n[1]=v,n[2]=m,n[3]=0,n[4]=h*m-d*v,n[5]=d*g-u*m,n[6]=u*v-h*g,n[7]=0,n[8]=u,n[9]=h,n[10]=d,n[11]=0,n[12]=s,n[13]=r,n[14]=a,n[15]=1,n}function qd(n,e,t){return n[0]=e[0]+t[0],n[1]=e[1]+t[1],n[2]=e[2]+t[2],n[3]=e[3]+t[3],n[4]=e[4]+t[4],n[5]=e[5]+t[5],n[6]=e[6]+t[6],n[7]=e[7]+t[7],n[8]=e[8]+t[8],n[9]=e[9]+t[9],n[10]=e[10]+t[10],n[11]=e[11]+t[11],n[12]=e[12]+t[12],n[13]=e[13]+t[13],n[14]=e[14]+t[14],n[15]=e[15]+t[15],n}function Yd(n,e,t){return n[0]=e[0]-t[0],n[1]=e[1]-t[1],n[2]=e[2]-t[2],n[3]=e[3]-t[3],n[4]=e[4]-t[4],n[5]=e[5]-t[5],n[6]=e[6]-t[6],n[7]=e[7]-t[7],n[8]=e[8]-t[8],n[9]=e[9]-t[9],n[10]=e[10]-t[10],n[11]=e[11]-t[11],n[12]=e[12]-t[12],n[13]=e[13]-t[13],n[14]=e[14]-t[14],n[15]=e[15]-t[15],n}function c3(n,e,t){return n[0]=e[0]*t,n[1]=e[1]*t,n[2]=e[2]*t,n[3]=e[3]*t,n[4]=e[4]*t,n[5]=e[5]*t,n[6]=e[6]*t,n[7]=e[7]*t,n[8]=e[8]*t,n[9]=e[9]*t,n[10]=e[10]*t,n[11]=e[11]*t,n[12]=e[12]*t,n[13]=e[13]*t,n[14]=e[14]*t,n[15]=e[15]*t,n}class ya extends Array{constructor(e=1,t=0,i=0,s=0,r=0,a=1,o=0,l=0,c=0,u=0,h=1,d=0,f=0,g=0,v=0,m=1){return super(e,t,i,s,r,a,o,l,c,u,h,d,f,g,v,m),this}get x(){return this[12]}get y(){return this[13]}get z(){return this[14]}get w(){return this[15]}set x(e){this[12]=e}set y(e){this[13]=e}set z(e){this[14]=e}set w(e){this[15]=e}set(e,t,i,s,r,a,o,l,c,u,h,d,f,g,v,m){return e.length?this.copy(e):(j2(this,e,t,i,s,r,a,o,l,c,u,h,d,f,g,v,m),this)}translate(e,t=this){return J2(this,t,e),this}rotate(e,t,i=this){return e3(this,i,e,t),this}scale(e,t=this){return Q2(this,t,typeof e=="number"?[e,e,e]:e),this}add(e,t){return t?qd(this,e,t):qd(this,this,e),this}sub(e,t){return t?Yd(this,e,t):Yd(this,this,e),this}multiply(e,t){return e.length?t?Xd(this,e,t):Xd(this,this,e):c3(this,this,e),this}identity(){return K2(this),this}copy(e){return Y2(this,e),this}fromPerspective({fov:e,aspect:t,near:i,far:s}={}){return a3(this,e,t,i,s),this}fromOrthogonal({left:e,right:t,bottom:i,top:s,near:r,far:a}){return o3(this,e,t,i,s,r,a),this}fromQuaternion(e){return r3(this,e),this}setPosition(e){return this.x=e[0],this.y=e[1],this.z=e[2],this}inverse(e=this){return Z2(this,e),this}compose(e,t,i){return s3(this,e,t,i),this}decompose(e,t,i){return i3(this,e,t,i),this}getRotation(e){return Vm(e,this),this}getTranslation(e){return t3(e,this),this}getScaling(e){return Bm(e,this),this}getMaxScaleOnAxis(){return n3(this)}lookAt(e,t,i){return l3(this,e,t,i),this}determinant(){return Om(this)}fromArray(e,t=0){return this[0]=e[t],this[1]=e[t+1],this[2]=e[t+2],this[3]=e[t+3],this[4]=e[t+4],this[5]=e[t+5],this[6]=e[t+6],this[7]=e[t+7],this[8]=e[t+8],this[9]=e[t+9],this[10]=e[t+10],this[11]=e[t+11],this[12]=e[t+12],this[13]=e[t+13],this[14]=e[t+14],this[15]=e[t+15],this}toArray(e=[],t=0){return e[t]=this[0],e[t+1]=this[1],e[t+2]=this[2],e[t+3]=this[3],e[t+4]=this[4],e[t+5]=this[5],e[t+6]=this[6],e[t+7]=this[7],e[t+8]=this[8],e[t+9]=this[9],e[t+10]=this[10],e[t+11]=this[11],e[t+12]=this[12],e[t+13]=this[13],e[t+14]=this[14],e[t+15]=this[15],e}}function u3(n,e,t="YXZ"){return t==="XYZ"?(n[1]=Math.asin(Math.min(Math.max(e[8],-1),1)),Math.abs(e[8])<.99999?(n[0]=Math.atan2(-e[9],e[10]),n[2]=Math.atan2(-e[4],e[0])):(n[0]=Math.atan2(e[6],e[5]),n[2]=0)):t==="YXZ"?(n[0]=Math.asin(-Math.min(Math.max(e[9],-1),1)),Math.abs(e[9])<.99999?(n[1]=Math.atan2(e[8],e[10]),n[2]=Math.atan2(e[1],e[5])):(n[1]=Math.atan2(-e[2],e[0]),n[2]=0)):t==="ZXY"?(n[0]=Math.asin(Math.min(Math.max(e[6],-1),1)),Math.abs(e[6])<.99999?(n[1]=Math.atan2(-e[2],e[10]),n[2]=Math.atan2(-e[4],e[5])):(n[1]=0,n[2]=Math.atan2(e[1],e[0]))):t==="ZYX"?(n[1]=Math.asin(-Math.min(Math.max(e[2],-1),1)),Math.abs(e[2])<.99999?(n[0]=Math.atan2(e[6],e[10]),n[2]=Math.atan2(e[1],e[0])):(n[0]=0,n[2]=Math.atan2(-e[4],e[5]))):t==="YZX"?(n[2]=Math.asin(Math.min(Math.max(e[1],-1),1)),Math.abs(e[1])<.99999?(n[0]=Math.atan2(-e[9],e[5]),n[1]=Math.atan2(-e[2],e[0])):(n[0]=0,n[1]=Math.atan2(e[8],e[10]))):t==="XZY"&&(n[2]=Math.asin(-Math.min(Math.max(e[4],-1),1)),Math.abs(e[4])<.99999?(n[0]=Math.atan2(e[6],e[5]),n[1]=Math.atan2(e[8],e[0])):(n[0]=Math.atan2(-e[9],e[10]),n[1]=0)),n}const jd=new ya;class h3 extends Array{constructor(e=0,t=e,i=e,s="YXZ"){super(e,t,i),this.order=s,this.onChange=()=>{},this._target=this;const r=["0","1","2"];return new Proxy(this,{set(a,o){const l=Reflect.set(...arguments);return l&&r.includes(o)&&a.onChange(),l}})}get x(){return this[0]}get y(){return this[1]}get z(){return this[2]}set x(e){this._target[0]=e,this.onChange()}set y(e){this._target[1]=e,this.onChange()}set z(e){this._target[2]=e,this.onChange()}set(e,t=e,i=e){return e.length?this.copy(e):(this._target[0]=e,this._target[1]=t,this._target[2]=i,this.onChange(),this)}copy(e){return this._target[0]=e[0],this._target[1]=e[1],this._target[2]=e[2],this.onChange(),this}reorder(e){return this._target.order=e,this.onChange(),this}fromRotationMatrix(e,t=this.order){return u3(this._target,e,t),this.onChange(),this}fromQuaternion(e,t=this.order,i){return jd.fromQuaternion(e),this._target.fromRotationMatrix(jd,t),i||this.onChange(),this}fromArray(e,t=0){return this._target[0]=e[t],this._target[1]=e[t+1],this._target[2]=e[t+2],this}toArray(e=[],t=0){return e[t]=this[0],e[t+1]=this[1],e[t+2]=this[2],e}}class d3{constructor(){this.parent=null,this.children=[],this.visible=!0,this.matrix=new ya,this.worldMatrix=new ya,this.matrixAutoUpdate=!0,this.worldMatrixNeedsUpdate=!1,this.position=new An,this.quaternion=new X2,this.scale=new An(1),this.rotation=new h3,this.up=new An(0,1,0),this.rotation._target.onChange=()=>this.quaternion.fromEuler(this.rotation,!0),this.quaternion._target.onChange=()=>this.rotation.fromQuaternion(this.quaternion,void 0,!0)}setParent(e,t=!0){this.parent&&e!==this.parent&&this.parent.removeChild(this,!1),this.parent=e,t&&e&&e.addChild(this,!1)}addChild(e,t=!0){~this.children.indexOf(e)||this.children.push(e),t&&e.setParent(this,!1)}removeChild(e,t=!0){~this.children.indexOf(e)&&this.children.splice(this.children.indexOf(e),1),t&&e.setParent(null,!1)}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.worldMatrixNeedsUpdate||e)&&(this.parent===null?this.worldMatrix.copy(this.matrix):this.worldMatrix.multiply(this.parent.worldMatrix,this.matrix),this.worldMatrixNeedsUpdate=!1,e=!0);for(let t=0,i=this.children.length;t<i;t++)this.children[t].updateMatrixWorld(e)}updateMatrix(){this.matrix.compose(this.quaternion,this.position,this.scale),this.worldMatrixNeedsUpdate=!0}traverse(e){if(!e(this))for(let t=0,i=this.children.length;t<i;t++)this.children[t].traverse(e)}decompose(){this.matrix.decompose(this.quaternion._target,this.position,this.scale),this.rotation.fromQuaternion(this.quaternion)}lookAt(e,t=!1){t?this.matrix.lookAt(this.position,e,this.up):this.matrix.lookAt(e,this.position,this.up),this.matrix.getRotation(this.quaternion._target),this.rotation.fromQuaternion(this.quaternion)}}function f3(n,e){return n[0]=e[0],n[1]=e[1],n[2]=e[2],n[3]=e[4],n[4]=e[5],n[5]=e[6],n[6]=e[8],n[7]=e[9],n[8]=e[10],n}function p3(n,e){let t=e[0],i=e[1],s=e[2],r=e[3],a=t+t,o=i+i,l=s+s,c=t*a,u=i*a,h=i*o,d=s*a,f=s*o,g=s*l,v=r*a,m=r*o,p=r*l;return n[0]=1-h-g,n[3]=u-p,n[6]=d+m,n[1]=u+p,n[4]=1-c-g,n[7]=f-v,n[2]=d-m,n[5]=f+v,n[8]=1-c-h,n}function m3(n,e){return n[0]=e[0],n[1]=e[1],n[2]=e[2],n[3]=e[3],n[4]=e[4],n[5]=e[5],n[6]=e[6],n[7]=e[7],n[8]=e[8],n}function g3(n,e,t,i,s,r,a,o,l,c){return n[0]=e,n[1]=t,n[2]=i,n[3]=s,n[4]=r,n[5]=a,n[6]=o,n[7]=l,n[8]=c,n}function v3(n){return n[0]=1,n[1]=0,n[2]=0,n[3]=0,n[4]=1,n[5]=0,n[6]=0,n[7]=0,n[8]=1,n}function _3(n,e){let t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=u*a-o*c,d=-u*r+o*l,f=c*r-a*l,g=t*h+i*d+s*f;return g?(g=1/g,n[0]=h*g,n[1]=(-u*i+s*c)*g,n[2]=(o*i-s*a)*g,n[3]=d*g,n[4]=(u*t-s*l)*g,n[5]=(-o*t+s*r)*g,n[6]=f*g,n[7]=(-c*t+i*l)*g,n[8]=(a*t-i*r)*g,n):null}function Kd(n,e,t){let i=e[0],s=e[1],r=e[2],a=e[3],o=e[4],l=e[5],c=e[6],u=e[7],h=e[8],d=t[0],f=t[1],g=t[2],v=t[3],m=t[4],p=t[5],M=t[6],y=t[7],S=t[8];return n[0]=d*i+f*a+g*c,n[1]=d*s+f*o+g*u,n[2]=d*r+f*l+g*h,n[3]=v*i+m*a+p*c,n[4]=v*s+m*o+p*u,n[5]=v*r+m*l+p*h,n[6]=M*i+y*a+S*c,n[7]=M*s+y*o+S*u,n[8]=M*r+y*l+S*h,n}function x3(n,e,t){let i=e[0],s=e[1],r=e[2],a=e[3],o=e[4],l=e[5],c=e[6],u=e[7],h=e[8],d=t[0],f=t[1];return n[0]=i,n[1]=s,n[2]=r,n[3]=a,n[4]=o,n[5]=l,n[6]=d*i+f*a+c,n[7]=d*s+f*o+u,n[8]=d*r+f*l+h,n}function y3(n,e,t){let i=e[0],s=e[1],r=e[2],a=e[3],o=e[4],l=e[5],c=e[6],u=e[7],h=e[8],d=Math.sin(t),f=Math.cos(t);return n[0]=f*i+d*a,n[1]=f*s+d*o,n[2]=f*r+d*l,n[3]=f*a-d*i,n[4]=f*o-d*s,n[5]=f*l-d*r,n[6]=c,n[7]=u,n[8]=h,n}function S3(n,e,t){let i=t[0],s=t[1];return n[0]=i*e[0],n[1]=i*e[1],n[2]=i*e[2],n[3]=s*e[3],n[4]=s*e[4],n[5]=s*e[5],n[6]=e[6],n[7]=e[7],n[8]=e[8],n}function M3(n,e){let t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],g=e[12],v=e[13],m=e[14],p=e[15],M=t*o-i*a,y=t*l-s*a,S=t*c-r*a,E=i*l-s*o,T=i*c-r*o,w=s*c-r*l,R=u*v-h*g,_=u*m-d*g,b=u*p-f*g,P=h*m-d*v,k=h*p-f*v,B=d*p-f*m,N=M*B-y*k+S*P+E*b-T*_+w*R;return N?(N=1/N,n[0]=(o*B-l*k+c*P)*N,n[1]=(l*b-a*B-c*_)*N,n[2]=(a*k-o*b+c*R)*N,n[3]=(s*k-i*B-r*P)*N,n[4]=(t*B-s*b+r*_)*N,n[5]=(i*b-t*k-r*R)*N,n[6]=(v*w-m*T+p*E)*N,n[7]=(m*S-g*w-p*y)*N,n[8]=(g*T-v*S+p*M)*N,n):null}class b3 extends Array{constructor(e=1,t=0,i=0,s=0,r=1,a=0,o=0,l=0,c=1){return super(e,t,i,s,r,a,o,l,c),this}set(e,t,i,s,r,a,o,l,c){return e.length?this.copy(e):(g3(this,e,t,i,s,r,a,o,l,c),this)}translate(e,t=this){return x3(this,t,e),this}rotate(e,t=this){return y3(this,t,e),this}scale(e,t=this){return S3(this,t,e),this}multiply(e,t){return t?Kd(this,e,t):Kd(this,this,e),this}identity(){return v3(this),this}copy(e){return m3(this,e),this}fromMatrix4(e){return f3(this,e),this}fromQuaternion(e){return p3(this,e),this}fromBasis(e,t,i){return this.set(e[0],e[1],e[2],t[0],t[1],t[2],i[0],i[1],i[2]),this}inverse(e=this){return _3(this,e),this}getNormalMatrix(e){return M3(this,e),this}}let E3=0;class T3 extends d3{constructor(e,{geometry:t,program:i,mode:s=e.TRIANGLES,frustumCulled:r=!0,renderOrder:a=0}={}){super(),e.canvas||console.error("gl not passed as first argument to Mesh"),this.gl=e,this.id=E3++,this.geometry=t,this.program=i,this.mode=s,this.frustumCulled=r,this.renderOrder=a,this.modelViewMatrix=new ya,this.normalMatrix=new b3,this.beforeRenderCallbacks=[],this.afterRenderCallbacks=[]}onBeforeRender(e){return this.beforeRenderCallbacks.push(e),this}onAfterRender(e){return this.afterRenderCallbacks.push(e),this}draw({camera:e}={}){e&&(this.program.uniforms.modelMatrix||Object.assign(this.program.uniforms,{modelMatrix:{value:null},viewMatrix:{value:null},modelViewMatrix:{value:null},normalMatrix:{value:null},projectionMatrix:{value:null},cameraPosition:{value:null}}),this.program.uniforms.projectionMatrix.value=e.projectionMatrix,this.program.uniforms.cameraPosition.value=e.worldPosition,this.program.uniforms.viewMatrix.value=e.viewMatrix,this.modelViewMatrix.multiply(e.viewMatrix,this.worldMatrix),this.normalMatrix.getNormalMatrix(this.modelViewMatrix),this.program.uniforms.modelMatrix.value=this.worldMatrix,this.program.uniforms.modelViewMatrix.value=this.modelViewMatrix,this.program.uniforms.normalMatrix.value=this.normalMatrix),this.beforeRenderCallbacks.forEach(i=>i&&i({mesh:this,camera:e}));let t=this.program.cullFace&&this.worldMatrix.determinant()<0;this.program.use({flipFaces:t}),this.geometry.draw({mode:this.mode,program:this.program}),this.afterRenderCallbacks.forEach(i=>i&&i({mesh:this,camera:e}))}}class A3 extends y2{constructor(e,{attributes:t={}}={}){Object.assign(t,{position:{size:2,data:new Float32Array([-1,-1,3,-1,-1,3])},uv:{size:2,data:new Float32Array([0,0,2,0,0,2])}}),super(e,t)}}const w3=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,C3=`#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColorBg;
uniform float uAccentStrength;
uniform float uDarken;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}
void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);
  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;
  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);
  vec3 colDark=uColorBg;
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float phase=0.5+0.5*sin(blendX*2.5+t*0.4);
  float phase2=0.5+0.5*sin(blendX*2.5+t*0.35+1.5);
  vec3 colLav=mix(uColor1,uColor2,phase);
  vec3 colOrg=mix(uColor3,uColor4,phase2);
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));
  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;
  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);
  col=mix(colDark,col,uAccentStrength);
  col*=uDarken;
  col=clamp(col,0.0,1.0);
  o=vec4(col,1.0);
}
void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  fragColor=o;
}
`,R3=Ee({__name:"LiquidBackground",props:{class:{}},setup(n){const e=n,t=Ve(null),i=d=>{const f=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(d);return f?[parseInt(f[1],16)/255,parseInt(f[2],16)/255,parseInt(f[3],16)/255]:[1,1,1]};function s(){const d=document.documentElement,f=getComputedStyle(d),g=f.getPropertyValue("--vp-c-bg").trim()||"#f8f9fa",v=f.getPropertyValue("--bg-lens-1").trim()||"#42b883",m=f.getPropertyValue("--bg-lens-2").trim()||"#5ab8c8",p=f.getPropertyValue("--bg-lens-3").trim()||"#9080d0",M=f.getPropertyValue("--bg-lens-4").trim()||"#e0a058";return{bg:g,color1:v,color2:m,color3:p,color4:M}}let r=0,a=null,o=null,l=null,c=null,u=0;function h(){if(!l)return;const d=s(),f=l.uniforms;f.uColor1.value.set(i(d.color1)),f.uColor2.value.set(i(d.color2)),f.uColor3.value.set(i(d.color3)),f.uColor4.value.set(i(d.color4)),f.uColorBg.value.set(i(d.bg))}return qt(()=>{const d=t.value;if(!d)return;const f={webgl:2,alpha:!0,antialias:!1,dpr:Math.min(window.devicePixelRatio||1,2)};a=new w2(f);const g=a.gl,v=g.canvas;v.style.width="100%",v.style.height="100%",v.style.display="block",d.appendChild(v);const m=s(),p=new A3(g);l=new M2(g,{vertex:w3,fragment:C3,uniforms:{iTime:{value:0},iResolution:{value:new Float32Array([1,1])},uTimeSpeed:{value:1},uColorBalance:{value:0},uWarpStrength:{value:1},uWarpFrequency:{value:5},uWarpSpeed:{value:8},uWarpAmplitude:{value:50},uBlendAngle:{value:0},uBlendSoftness:{value:.05},uRotationAmount:{value:500},uNoiseScale:{value:2},uGrainAmount:{value:.08},uGrainScale:{value:2},uGrainAnimated:{value:0},uContrast:{value:1.5},uGamma:{value:1},uSaturation:{value:1},uCenterOffset:{value:new Float32Array([0,0])},uZoom:{value:.9},uColor1:{value:new Float32Array(i(m.color1))},uColor2:{value:new Float32Array(i(m.color2))},uColor3:{value:new Float32Array(i(m.color3))},uColor4:{value:new Float32Array(i(m.color4))},uColorBg:{value:new Float32Array(i(m.bg))},uAccentStrength:{value:.28},uDarken:{value:.85}}}),o=new T3(g,{geometry:p,program:l});const M=()=>{if(!d||!a)return;const E=d.getBoundingClientRect(),T=Math.max(1,Math.floor(E.width)),w=Math.max(1,Math.floor(E.height));if(a.setSize(T,w),l){const R=l.uniforms.iResolution.value;R[0]=g.drawingBufferWidth,R[1]=g.drawingBufferHeight}};new ResizeObserver(M).observe(d),M(),u=performance.now();const S=E=>{r=requestAnimationFrame(S),l&&o&&a&&(l.uniforms.iTime.value=(E-u)*.001,a.render({scene:o}))};r=requestAnimationFrame(S),c=new MutationObserver(h),c.observe(document.documentElement,{attributes:!0,attributeFilter:["class"]})}),hi(()=>{var f;r&&cancelAnimationFrame(r),r=0,c==null||c.disconnect(),c=null;const d=t.value;if(d&&((f=a==null?void 0:a.gl)!=null&&f.canvas))try{d.removeChild(a.gl.canvas)}catch{}a=null,o=null,l=null}),(d,f)=>(I(),K("div",{ref_key:"containerRef",ref:t,class:it(["relative size-full overflow-hidden block",[e==null?void 0:e.class]])},null,2))}}),Yr="vdnd-doc-page",P3=Ee({__name:"CustomVPContent",setup(n){const{page:e,frontmatter:t}=Zs(),i=Ts(),{hasSidebar:s}=Pn(),r={type:"spring",stiffness:260,damping:30},a=Ae(()=>t.value.layout!=="home");return on(a,o=>{o?document.documentElement.classList.add(Yr):document.documentElement.classList.remove(Yr)},{immediate:!0}),qt(()=>{a.value&&document.documentElement.classList.add(Yr)}),hi(()=>{document.documentElement.classList.remove(Yr)}),(o,l)=>(I(),K(ct,null,[a.value?(I(),ve(L(nn).div,{key:0,class:"fixed inset-0 -z-20 pointer-events-none",initial:{opacity:0},animate:{opacity:1},transition:{duration:.6}},{default:z(()=>[ye(L(R3),{class:"absolute inset-0"})]),_:1})):Se("",!0),ye(L(x1),{mode:"wait"},{default:z(()=>[(I(),ve(L(nn).div,{key:L(i).path,class:it(["VPContent VDndContent",{"has-sidebar":L(s),"is-home":L(t).layout==="home","is-doc":a.value}]),id:"VPContent",initial:{opacity:0,y:8},animate:{opacity:1,y:0},exit:{opacity:0,y:-8},transition:r},{default:z(()=>[L(e).isNotFound?V(o.$slots,"not-found",{key:0},()=>[ye(af)],!0):L(t).layout==="page"?(I(),ve(df,{key:1},{"page-top":z(()=>[V(o.$slots,"page-top",{},void 0,!0)]),"page-bottom":z(()=>[V(o.$slots,"page-bottom",{},void 0,!0)]),_:3})):L(t).layout==="home"?(I(),ve(n2,{key:2},{"home-hero-before":z(()=>[V(o.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":z(()=>[V(o.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":z(()=>[V(o.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":z(()=>[V(o.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":z(()=>[V(o.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":z(()=>[V(o.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":z(()=>[V(o.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":z(()=>[V(o.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":z(()=>[V(o.$slots,"home-features-after",{},void 0,!0)]),_:3})):L(t).layout&&L(t).layout!=="doc"?(I(),ve(Zt(L(t).layout),{key:3})):(I(),ve(hf,{key:4,class:"VDndDoc"},{"doc-top":z(()=>[V(o.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":z(()=>[V(o.$slots,"doc-bottom",{},void 0,!0)]),"doc-footer-before":z(()=>[V(o.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":z(()=>[V(o.$slots,"doc-before",{},void 0,!0)]),"doc-after":z(()=>[V(o.$slots,"doc-after",{},void 0,!0)]),"aside-top":z(()=>[V(o.$slots,"aside-top",{},void 0,!0)]),"aside-outline-before":z(()=>[V(o.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":z(()=>[V(o.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":z(()=>[V(o.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":z(()=>[V(o.$slots,"aside-ads-after",{},void 0,!0)]),"aside-bottom":z(()=>[V(o.$slots,"aside-bottom",{},void 0,!0)]),_:3}))]),_:3},8,["class"]))]),_:3})],64))}}),L3=Oe(P3,[["__scopeId","data-v-2d8f0543"]]),D3=Ee({__name:"Layout",setup(n){const e=Ae(()=>{var u;return((u=Zs().frontmatter.value)==null?void 0:u.layout)==="home"}),{isOpen:t,open:i,close:s}=Pn(),r=Ts();on(()=>r.path,s),lf(t,s);const{frontmatter:a}=Zs(),o={duration:.35},l=nf(),c=Ae(()=>!!l["home-hero-image"]);return Ta("hero-image-slot-exists",c),(u,h)=>{const d=wi("Content");return L(a).layout!==!1?(I(),ve(L(nn).div,{key:0,class:it(["Layout",L(a).pageClass]),initial:e.value?{opacity:0}:void 0,animate:{opacity:1},transition:o},{default:z(()=>[V(u.$slots,"layout-top",{},void 0,!0),ye(yf),ye(rf,{class:"backdrop",show:L(t),onClick:L(s)},null,8,["show","onClick"]),ye(_f,{class:"glass-nav"},{"nav-bar-title-before":z(()=>[V(u.$slots,"nav-bar-title-before",{},void 0,!0)]),"nav-bar-title-after":z(()=>[V(u.$slots,"nav-bar-title-after",{},void 0,!0)]),"nav-bar-content-before":z(()=>[V(u.$slots,"nav-bar-content-before",{},void 0,!0)]),"nav-bar-content-after":z(()=>[V(u.$slots,"nav-bar-content-after",{},void 0,!0)]),"nav-screen-content-before":z(()=>[V(u.$slots,"nav-screen-content-before",{},void 0,!0)]),"nav-screen-content-after":z(()=>[V(u.$slots,"nav-screen-content-after",{},void 0,!0)]),_:3}),ye(pf,{open:L(t),onOpenMenu:L(i)},null,8,["open","onOpenMenu"]),ye(xf,{open:L(t)},{"sidebar-nav-before":z(()=>[V(u.$slots,"sidebar-nav-before",{},void 0,!0)]),"sidebar-nav-after":z(()=>[V(u.$slots,"sidebar-nav-after",{},void 0,!0)]),_:3},8,["open"]),ye(L3,null,{"page-top":z(()=>[V(u.$slots,"page-top",{},void 0,!0)]),"page-bottom":z(()=>[V(u.$slots,"page-bottom",{},void 0,!0)]),"not-found":z(()=>[V(u.$slots,"not-found",{},void 0,!0)]),"home-hero-before":z(()=>[V(u.$slots,"home-hero-before",{},void 0,!0)]),"home-hero-info-before":z(()=>[V(u.$slots,"home-hero-info-before",{},void 0,!0)]),"home-hero-info":z(()=>[V(u.$slots,"home-hero-info",{},void 0,!0)]),"home-hero-info-after":z(()=>[V(u.$slots,"home-hero-info-after",{},void 0,!0)]),"home-hero-actions-after":z(()=>[V(u.$slots,"home-hero-actions-after",{},void 0,!0)]),"home-hero-image":z(()=>[V(u.$slots,"home-hero-image",{},void 0,!0)]),"home-hero-after":z(()=>[V(u.$slots,"home-hero-after",{},void 0,!0)]),"home-features-before":z(()=>[V(u.$slots,"home-features-before",{},void 0,!0)]),"home-features-after":z(()=>[V(u.$slots,"home-features-after",{},void 0,!0)]),"doc-footer-before":z(()=>[V(u.$slots,"doc-footer-before",{},void 0,!0)]),"doc-before":z(()=>[V(u.$slots,"doc-before",{},void 0,!0)]),"doc-after":z(()=>[V(u.$slots,"doc-after",{},void 0,!0)]),"doc-top":z(()=>[V(u.$slots,"doc-top",{},void 0,!0)]),"doc-bottom":z(()=>[V(u.$slots,"doc-bottom",{},void 0,!0)]),"aside-top":z(()=>[V(u.$slots,"aside-top",{},void 0,!0)]),"aside-bottom":z(()=>[V(u.$slots,"aside-bottom",{},void 0,!0)]),"aside-outline-before":z(()=>[V(u.$slots,"aside-outline-before",{},void 0,!0)]),"aside-outline-after":z(()=>[V(u.$slots,"aside-outline-after",{},void 0,!0)]),"aside-ads-before":z(()=>[V(u.$slots,"aside-ads-before",{},void 0,!0)]),"aside-ads-after":z(()=>[V(u.$slots,"aside-ads-after",{},void 0,!0)]),_:3}),ye(ff),V(u.$slots,"layout-bottom",{},void 0,!0)]),_:3},8,["class","initial"])):(I(),ve(d,{key:1}))}}}),I3=Oe(D3,[["__scopeId","data-v-51c9906b"]]),G3={...Bx,Layout:I3,enhanceApp({app:n}){n.use(ey)}};export{Zx as C,B3 as F,G3 as R,V3 as X,Ln as Y,x1 as _,O3 as a,b_ as c,nn as m,N3 as o,Ke as u};
