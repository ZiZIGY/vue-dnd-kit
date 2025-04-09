"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const o=require("vue");function Y(e){let t=!1,n;const s=o.effectScope(!0);return(...u)=>(t||(n=s.run(()=>e(...u)),t=!0),n)}typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const z=()=>{};function F(e,t){function n(...s){return new Promise((u,l)=>{Promise.resolve(e(()=>t.apply(this,s),{fn:t,thisArg:this,args:s})).then(u).catch(l)})}return n}function N(...e){let t=0,n,s=!0,u=z,l,a,v,f,E;!o.isRef(e[0])&&typeof e[0]=="object"?{delay:a,trailing:v=!0,leading:f=!0,rejectOnCancel:E=!1}=e[0]:[a,v=!0,f=!0,E=!1]=e;const c=()=>{n&&(clearTimeout(n),n=void 0,u(),u=z)};return r=>{const i=o.toValue(a),m=Date.now()-t,p=()=>l=r();return c(),i<=0?(t=Date.now(),p()):(m>i&&(f||!s)?(t=Date.now(),p()):v&&(l=new Promise((w,x)=>{u=E?x:w,n=setTimeout(()=>{t=Date.now(),s=!0,w(p()),c()},Math.max(0,i-m))})),!f&&!n&&(n=setTimeout(()=>s=!0,i)),s=!1,l)}}function Z(e,t=200,n=!1,s=!0,u=!1){return F(N(t,n,s,u),e)}const M=Y(()=>{const e=o.ref([]),t=o.computed(()=>e.value.length>0),n={component:o.ref(null),ref:o.ref(null)},s=o.ref([]),u=o.ref([]),l=o.ref([]),a={zone:o.ref(null),element:o.ref(null)},v={current:o.ref(null),start:o.ref(null),offset:{percent:o.ref(null),pixel:o.ref(null)}};return{isDragging:t,activeContainer:n,elements:s,draggingElements:e,selectedElements:u,zones:l,hovered:a,pointerPosition:v}}),B=()=>{const e=o.ref(null),{draggingElements:t,pointerPosition:n,isDragging:s,activeContainer:u}=M();return o.onMounted(()=>{u.ref=e}),o.onBeforeUnmount(()=>{u.ref.value=null}),{elementRef:e,draggingElements:t,pointerPosition:n,isDragging:s}},q=["innerHTML"],K=o.defineComponent({__name:"DefaultOverlay",setup(e){const{elementRef:t,pointerPosition:n,isDragging:s,draggingElements:u}=B(),l=o.computed(()=>{var a,v,f,E;return{transform:`translate3d(${(((a=n.current.value)==null?void 0:a.x)??0)-(((v=n.offset.pixel.value)==null?void 0:v.x)??0)}px, ${(((f=n.current.value)==null?void 0:f.y)??0)-(((E=n.offset.pixel.value)==null?void 0:E.y)??0)}px, 0)`,zIndex:1e3,position:"fixed",top:0,left:0,transition:"0.3s cubic-bezier(0.165, 0.84, 0.44, 1)"}});return(a,v)=>o.unref(s)?(o.openBlock(),o.createElementBlock("div",{key:0,ref_key:"elementRef",ref:t,style:o.normalizeStyle(l.value)},[(o.openBlock(!0),o.createElementBlock(o.Fragment,null,o.renderList(o.unref(u),(f,E)=>{var c,y;return o.openBlock(),o.createElementBlock("div",{key:E,innerHTML:f.initialHTML,style:o.normalizeStyle({width:`${(c=f.initialRect)==null?void 0:c.width}px`,height:`${(y=f.initialRect)==null?void 0:y.height}px`})},null,12,q)}),128))],4)):o.createCommentVNode("",!0)}}),R=o.defineComponent({__name:"DragOverlay",setup(e){const{activeContainer:t}=M(),n=o.computed(()=>t.component.value??K);return(s,u)=>(o.openBlock(),o.createBlock(o.resolveDynamicComponent(n.value)))}}),X={install(e){e.component("DragOverlay",R);const t=e.mount;e.mount=function(s){const u=t.call(this,s),l=typeof s=="string"?document.querySelector(s):s;if(l&&l instanceof Element&&!l.querySelector("#vue-dnd-kit-overlay")){const a=document.createElement("div");a.id="vue-dnd-kit-overlay",a.style.pointerEvents="none",l.appendChild(a);const v=o.createVNode(R);o.render(v,a),e.__VUE_DND_KIT_OVERLAY__={container:a,vnode:v}}return u};const n=e.unmount;e.unmount=function(){return e.__VUE_DND_KIT_OVERLAY__&&(o.render(null,e.__VUE_DND_KIT_OVERLAY__.container),delete e.__VUE_DND_KIT_OVERLAY__),n.call(this)}}},A="data-vue-dnd-kit-draggable",L=e=>{e.preventDefault()},$=e=>{const{elements:t,draggingElements:n,hovered:s,selectedElements:u,isDragging:l}=M(),a=o.ref(null),v=o.computed(()=>{var r;return((r=s.element.value)==null?void 0:r.node)===a.value}),f=o.computed(()=>n.value.some(r=>r.node===a.value)),E=o.computed(()=>{if(!a.value||!l.value)return!1;const r=t.value.find(i=>i.node===a.value);return r!=null&&r.groups.length?!n.value.some(i=>i.groups.length?!i.groups.some(m=>r.groups.includes(m)):!1):!0});return{elementRef:a,registerElement:()=>{if(!a.value)throw new Error("ElementRef is not set");t.value.push({node:a.value,groups:(e==null?void 0:e.groups)??[],layer:(e==null?void 0:e.layer)??null,defaultLayer:(e==null?void 0:e.layer)??null,events:(e==null?void 0:e.events)??{},data:(e==null?void 0:e.data)??void 0}),a.value.addEventListener("dragstart",L),a.value.addEventListener("drag",L),a.value.setAttribute(A,"true"),a.value.setAttribute("draggable","false"),a.value.style.touchAction="none"},unregisterElement:()=>{var m,p,w,x;const r=t.value.findIndex(d=>d.node===a.value);r!==-1&&t.value.splice(r,1);const i=u.value.findIndex(d=>d.node===a.value);i!==-1&&u.value.splice(i,1),(m=a.value)==null||m.removeEventListener("dragstart",L),(p=a.value)==null||p.removeEventListener("drag",L),(w=a.value)==null||w.removeAttribute(A),(x=a.value)==null||x.removeAttribute("draggable")},isDragging:f,isOvered:v,isAllowed:E}},j=()=>{let e="",t="",n="";return{disableInteractions:()=>{const l=document.body;e=l.style.userSelect,l.style.userSelect="none",window.addEventListener("contextmenu",L),window.addEventListener("selectstart",L),window.addEventListener("touchstart",L),window.addEventListener("touchmove",L)},enableInteractions:()=>{const l=document.body;l.style.userSelect=e,l.style.touchAction=t,l.style.overscrollBehavior=n,window.removeEventListener("contextmenu",L),window.removeEventListener("selectstart",L),window.removeEventListener("touchstart",L),window.removeEventListener("touchmove",L)}}},V=(e,t)=>e.x<t.x+t.width&&e.x+e.width>t.x&&e.y<t.y+t.height&&e.y+e.height>t.y,T=e=>{if(!e)return{x:0,y:0,width:0,height:0,bottom:0,left:0,right:0,top:0};const t=e.getBoundingClientRect();return{bottom:t.bottom,left:t.left,right:t.right,top:t.top,x:t.x,y:t.y,width:t.width,height:t.height}},O=e=>({x:e.x+e.width/2,y:e.y+e.height/2}),G=(e,t)=>{const n=T(e);return{pixel:{x:t.x-n.x,y:t.y-n.y},percent:{x:(t.x-n.x)/n.width*100,y:(t.y-n.y)/n.height*100}}},U=(e,t)=>{const n=t.x-e.x,s=t.y-e.y;return Math.sqrt(n*n+s*s)},H=(e,t)=>{const n=Math.max(0,Math.min(e.x+e.width,t.x+t.width)-Math.max(e.x,t.x)),s=Math.max(0,Math.min(e.y+e.height,t.y+t.height)-Math.max(e.y,t.y)),u=n*s,l=e.width*e.height,a=t.width*t.height;return(u/l*100+u/a*100)/2},C=(e,t)=>e?t.contains(e):!1,W=e=>{var c,y;const t=T(e.activeContainer.ref.value),n=O(t),s=((c=e.pointerPosition.current.value)==null?void 0:c.x)??0,u=((y=e.pointerPosition.current.value)==null?void 0:y.y)??0,a=!(t&&s>=t.x&&s<=t.x+t.width&&u>=t.y&&u<=t.y+t.height),v=e.draggingElements.value.map(r=>r.node),f=e.elements.value.filter(r=>{if(!r.node||v.some(m=>m&&C(r.node,m)))return!1;const i=T(r.node);return i&&t&&V(i,t)}).map(r=>{const i=T(r.node),m=O(i),p=s>=i.x&&s<=i.x+i.width&&u>=i.y&&u<=i.y+i.height,w=H(i,t),x=U(n,m),d=e.elements.value.filter(g=>g!==r&&g.node&&r.node&&C(r.node,g.node)).length;return{element:r,node:r.node,isPointerInElement:p,overlapPercent:w,depth:d,centerDistance:x}}).sort((r,i)=>{if(!a){if(r.isPointerInElement&&i.isPointerInElement)return i.depth-r.depth;if(r.isPointerInElement!==i.isPointerInElement)return r.isPointerInElement?-1:1}return Math.abs(r.overlapPercent-i.overlapPercent)<=1?r.centerDistance-i.centerDistance:i.overlapPercent-r.overlapPercent}),E=e.zones.value.filter(r=>{if(!r.node||v.some(m=>m&&C(r.node,m)))return!1;const i=T(r.node);return i&&t&&V(i,t)}).map(r=>{const i=T(r.node),m=O(i),p=s>=i.x&&s<=i.x+i.width&&u>=i.y&&u<=i.y+i.height,w=H(i,t),x=U(n,m),d=e.zones.value.filter(g=>g!==r&&g.node&&r.node&&C(r.node,g.node)).length;return{zone:r,node:r.node,isPointerInElement:p,overlapPercent:w,depth:d,centerDistance:x}}).sort((r,i)=>{if(!a){if(r.isPointerInElement&&i.isPointerInElement)return i.depth-r.depth;if(r.isPointerInElement!==i.isPointerInElement)return r.isPointerInElement?-1:1}return Math.abs(r.overlapPercent-i.overlapPercent)<=1?r.centerDistance-i.centerDistance:i.overlapPercent-r.overlapPercent});return[...f.map(r=>r.node),...E.map(r=>r.node)]},J=e=>{const t=M();return{onPointerStart:l=>{t.pointerPosition.start.value={x:l.clientX,y:l.clientY},t.pointerPosition.current.value={x:l.clientX,y:l.clientY};const{pixel:a,percent:v}=G(e.value,{x:l.clientX,y:l.clientY});t.pointerPosition.offset.pixel.value=a,t.pointerPosition.offset.percent.value=v},onPointerMove:l=>{t.pointerPosition.current.value={x:l.clientX,y:l.clientY}},onPointerEnd:()=>{t.pointerPosition.current.value=null,t.pointerPosition.start.value=null,t.pointerPosition.offset.pixel.value=null,t.pointerPosition.offset.percent.value=null}}},Q=(e,t)=>{const n=M(),{onPointerStart:s,onPointerMove:u,onPointerEnd:l}=J(e);let a=null;const v=d=>{var S,I;const g=n.selectedElements.value.some(h=>h.node===d);if(n.selectedElements.value.length&&g)return n.selectedElements.value.map(h=>{var _,D;return{...h,initialHTML:((_=h.node)==null?void 0:_.outerHTML)??"",initialRect:(D=h.node)==null?void 0:D.getBoundingClientRect()}});n.selectedElements.value=[];const P=n.elements.value.find(h=>h.node===d);return P?[{...P,initialHTML:((S=P.node)==null?void 0:S.outerHTML)??"",initialRect:(I=P.node)==null?void 0:I.getBoundingClientRect()}]:[]},f=d=>{if(!d)return{element:null,zone:null};const g=Array.isArray(d)?d:[d],P=n.draggingElements.value.map(h=>h.node),[S]=g.map(h=>n.elements.value.find(_=>_.node===h)).filter(h=>h?h.groups.length?!n.draggingElements.value.some(D=>D.groups.length?!D.groups.some(k=>h.groups.includes(k)):!1):!0:!1),[I]=g.map(h=>{const _=n.zones.value.find(D=>D.node===h);return!_||P.some(D=>D&&C(h,D))||_.groups.length&&!!n.draggingElements.value.some(k=>k.groups.length?!k.groups.some(b=>_.groups.includes(b)):!1)?null:_});return{element:S??null,zone:I??null}},E=(t==null?void 0:t.sensor)||W,c=d=>{var S,I,h,_,D,k;const g=n.hovered.element.value,P=n.hovered.zone.value;n.hovered.element.value=d.element,n.hovered.zone.value=d.zone,n.hovered.element.value!==g&&((S=g==null?void 0:g.events)!=null&&S.onLeave&&g.events.onLeave(n),(h=(I=n.hovered.element.value)==null?void 0:I.events)!=null&&h.onHover&&n.hovered.element.value.events.onHover(n)),n.hovered.zone.value!==P&&((_=P==null?void 0:P.events)!=null&&_.onLeave&&P.events.onLeave(n),(k=(D=n.hovered.zone.value)==null?void 0:D.events)!=null&&k.onHover&&n.hovered.zone.value.events.onHover(n))},y=Z(()=>{const d=E(n),g=f(d);c(g)},(t==null?void 0:t.throttle)??0),r=()=>{y(),a=requestAnimationFrame(r)},i=()=>r(),m=()=>{a!==null&&(cancelAnimationFrame(a),a=null)};return{activate:d=>{n.draggingElements.value=v(e.value),s(d),i()},track:d=>{u(d)},deactivate:()=>{var d,g;l(),n.hovered.zone.value?(g=(d=n.hovered.zone.value.events).onDrop)==null||g.call(d,n):n.draggingElements.value.forEach(P=>{var S,I;return(I=(S=P.events).onEnd)==null?void 0:I.call(S,n)}),n.draggingElements.value=[],n.selectedElements.value=[],n.hovered.zone.value=null,n.hovered.element.value=null,m()}}},ee=e=>{const{elementRef:t,registerElement:n,unregisterElement:s,isDragging:u,isOvered:l,isAllowed:a}=$(e),{disableInteractions:v,enableInteractions:f}=j(),{activeContainer:E,pointerPosition:c}=M(),{activate:y,track:r,deactivate:i}=Q(t,{throttle:e==null?void 0:e.throttle,sensor:e==null?void 0:e.sensor}),m=d=>{e!=null&&e.container&&(E.component.value=o.markRaw(e.container)),v(),y(d),document.addEventListener("pointermove",p),document.addEventListener("pointerup",x),document.addEventListener("wheel",w)},p=d=>r(d),w=d=>r(d),x=()=>{E.component.value=null,f(),i(),document.removeEventListener("pointermove",p),document.removeEventListener("pointerup",x),document.removeEventListener("wheel",w)};return o.onMounted(n),o.onBeforeUnmount(s),{pointerPosition:c,elementRef:t,isDragging:u,isOvered:l,isAllowed:a,handleDragStart:m}},te=e=>{const{zones:t,hovered:n,draggingElements:s,isDragging:u}=M(),l=o.ref(null),a=o.computed(()=>{var c;return((c=n.zone.value)==null?void 0:c.node)===l.value}),v=o.computed(()=>{if(!l.value||!u.value)return!1;const c=t.value.find(y=>y.node===l.value);return c!=null&&c.groups.length?!s.value.some(y=>y.groups.length?!y.groups.some(r=>c.groups.includes(r)):!1):!0});return{elementRef:l,registerZone:()=>{if(!l.value)throw new Error("elementRef is not set");t.value.push({node:l.value,groups:(e==null?void 0:e.groups)??[],events:(e==null?void 0:e.events)??{},data:(e==null?void 0:e.data)??void 0}),l.value.setAttribute("data-dnd-droppable","true")},unregisterZone:()=>{if(!l.value)throw new Error("elementRef is not set");const c=t.value.findIndex(y=>y.node===l.value);c!==-1&&t.value.splice(c,1)},isOvered:a,isAllowed:v}},ne=e=>{const{elementRef:t,registerZone:n,unregisterZone:s,isOvered:u,isAllowed:l}=te(e);return o.onMounted(n),o.onBeforeUnmount(s),{elementRef:t,isOvered:u,isAllowed:l}},re=e=>{const{selectedElements:t,elements:n}=M(),s=o.computed(()=>n.value.find(c=>c.node===e.value)),u=o.computed(()=>t.value.some(c=>c.node===e.value)),l=o.computed(()=>e.value?t.value.some(c=>c.node&&C(c.node,e.value)):!1),a=o.computed(()=>e.value?t.value.some(c=>c.node&&C(e.value,c.node)):!1),v=()=>{s.value&&(t.value=t.value.filter(c=>c.node!==e.value))},f=()=>{s.value&&(l.value&&(t.value=t.value.filter(c=>c.node&&!C(c.node,e.value))),a.value&&(t.value=t.value.filter(c=>c.node&&!C(e.value,c.node))),t.value.push(s.value))};return{handleUnselect:v,handleSelect:f,handleToggleSelect:()=>{s.value&&(t.value.some(c=>c.node===e.value)?v():f())},isSelected:u,isParentOfSelected:l}};exports.default=X;exports.useDnDStore=M;exports.useDraggable=ee;exports.useDroppable=ne;exports.useSelection=re;
