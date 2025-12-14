var Ir=Object.create;var hs=Object.defineProperty;var Dr=Object.getOwnPropertyDescriptor;var Lr=Object.getOwnPropertyNames;var Mr=Object.getPrototypeOf,Nr=Object.prototype.hasOwnProperty;var Or=(s,e,t)=>e in s?hs(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var gs=(s,e)=>()=>(e||s((e={exports:{}}).exports,e),e.exports);var Pr=(s,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of Lr(e))!Nr.call(s,n)&&n!==t&&hs(s,n,{get:()=>e[n],enumerable:!(r=Dr(e,n))||r.enumerable});return s};var Fr=(s,e,t)=>(t=s!=null?Ir(Mr(s)):{},Pr(e||!s||!s.__esModule?hs(t,"default",{value:s,enumerable:!0}):t,s));var Q=(s,e,t)=>Or(s,typeof e!="symbol"?e+"":e,t);var yn=gs((mo,bn)=>{var mt=1e3,bt=mt*60,yt=bt*60,it=yt*24,qr=it*7,jr=it*365.25;bn.exports=function(s,e){e=e||{};var t=typeof s;if(t==="string"&&s.length>0)return Gr(s);if(t==="number"&&isFinite(s))return e.long?Vr(s):Wr(s);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(s))};function Gr(s){if(s=String(s),!(s.length>100)){var e=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(s);if(e){var t=parseFloat(e[1]),r=(e[2]||"ms").toLowerCase();switch(r){case"years":case"year":case"yrs":case"yr":case"y":return t*jr;case"weeks":case"week":case"w":return t*qr;case"days":case"day":case"d":return t*it;case"hours":case"hour":case"hrs":case"hr":case"h":return t*yt;case"minutes":case"minute":case"mins":case"min":case"m":return t*bt;case"seconds":case"second":case"secs":case"sec":case"s":return t*mt;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return t;default:return}}}}function Wr(s){var e=Math.abs(s);return e>=it?Math.round(s/it)+"d":e>=yt?Math.round(s/yt)+"h":e>=bt?Math.round(s/bt)+"m":e>=mt?Math.round(s/mt)+"s":s+"ms"}function Vr(s){var e=Math.abs(s);return e>=it?Vt(s,e,it,"day"):e>=yt?Vt(s,e,yt,"hour"):e>=bt?Vt(s,e,bt,"minute"):e>=mt?Vt(s,e,mt,"second"):s+" ms"}function Vt(s,e,t,r){var n=e>=t*1.5;return Math.round(s/t)+" "+r+(n?"s":"")}});var vn=gs((bo,wn)=>{function Zr(s){t.debug=t,t.default=t,t.coerce=a,t.disable=o,t.enable=n,t.enabled=l,t.humanize=yn(),t.destroy=d,Object.keys(s).forEach(u=>{t[u]=s[u]}),t.names=[],t.skips=[],t.formatters={};function e(u){let p=0;for(let h=0;h<u.length;h++)p=(p<<5)-p+u.charCodeAt(h),p|=0;return t.colors[Math.abs(p)%t.colors.length]}t.selectColor=e;function t(u){let p,h=null,v,k;function _(...R){if(!_.enabled)return;let m=_,E=Number(new Date),S=E-(p||E);m.diff=S,m.prev=p,m.curr=E,p=E,R[0]=t.coerce(R[0]),typeof R[0]!="string"&&R.unshift("%O");let x=0;R[0]=R[0].replace(/%([a-zA-Z%])/g,(b,g)=>{if(b==="%%")return"%";x++;let y=t.formatters[g];if(typeof y=="function"){let I=R[x];b=y.call(m,I),R.splice(x,1),x--}return b}),t.formatArgs.call(m,R),(m.log||t.log).apply(m,R)}return _.namespace=u,_.useColors=t.useColors(),_.color=t.selectColor(u),_.extend=r,_.destroy=t.destroy,Object.defineProperty(_,"enabled",{enumerable:!0,configurable:!1,get:()=>h!==null?h:(v!==t.namespaces&&(v=t.namespaces,k=t.enabled(u)),k),set:R=>{h=R}}),typeof t.init=="function"&&t.init(_),_}function r(u,p){let h=t(this.namespace+(typeof p>"u"?":":p)+u);return h.log=this.log,h}function n(u){t.save(u),t.namespaces=u,t.names=[],t.skips=[];let p=(typeof u=="string"?u:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(let h of p)h[0]==="-"?t.skips.push(h.slice(1)):t.names.push(h)}function i(u,p){let h=0,v=0,k=-1,_=0;for(;h<u.length;)if(v<p.length&&(p[v]===u[h]||p[v]==="*"))p[v]==="*"?(k=v,_=h,v++):(h++,v++);else if(k!==-1)v=k+1,_++,h=_;else return!1;for(;v<p.length&&p[v]==="*";)v++;return v===p.length}function o(){let u=[...t.names,...t.skips.map(p=>"-"+p)].join(",");return t.enable(""),u}function l(u){for(let p of t.skips)if(i(u,p))return!1;for(let p of t.names)if(i(u,p))return!0;return!1}function a(u){return u instanceof Error?u.stack||u.message:u}function d(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")}return t.enable(t.load()),t}wn.exports=Zr});var kn=gs((Ae,Zt)=>{Ae.formatArgs=Yr;Ae.save=Xr;Ae.load=Qr;Ae.useColors=Kr;Ae.storage=Jr();Ae.destroy=(()=>{let s=!1;return()=>{s||(s=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})();Ae.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function Kr(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let s;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(s=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(s[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function Yr(s){if(s[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+s[0]+(this.useColors?"%c ":" ")+"+"+Zt.exports.humanize(this.diff),!this.useColors)return;let e="color: "+this.color;s.splice(1,0,e,"color: inherit");let t=0,r=0;s[0].replace(/%[a-zA-Z%]/g,n=>{n!=="%%"&&(t++,n==="%c"&&(r=t))}),s.splice(r,0,e)}Ae.log=console.debug||console.log||(()=>{});function Xr(s){try{s?Ae.storage.setItem("debug",s):Ae.storage.removeItem("debug")}catch{}}function Qr(){let s;try{s=Ae.storage.getItem("debug")||Ae.storage.getItem("DEBUG")}catch{}return!s&&typeof process<"u"&&"env"in process&&(s=process.env.DEBUG),s}function Jr(){try{return localStorage}catch{}}Zt.exports=vn()(Ae);var{formatters:ei}=Zt.exports;ei.j=function(s){try{return JSON.stringify(s)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}}});var xt=globalThis,Wt=xt.trustedTypes,an=Wt?Wt.createPolicy("lit-html",{createHTML:s=>s}):void 0,fn="$lit$",Ve=`lit$${Math.random().toFixed(9).slice(2)}$`,hn="?"+Ve,zr=`<${hn}>`,nt=document,At=()=>nt.createComment(""),St=s=>s===null||typeof s!="object"&&typeof s!="function",_s=Array.isArray,Br=s=>_s(s)||typeof s?.[Symbol.iterator]=="function",ms=`[ 	
\f\r]`,_t=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ln=/-->/g,cn=/>/g,tt=RegExp(`>|${ms}(?:([^\\s"'>=/]+)(${ms}*=${ms}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),dn=/'/g,un=/"/g,gn=/^(?:script|style|textarea|title)$/i,xs=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),A=xs(1),co=xs(2),uo=xs(3),rt=Symbol.for("lit-noChange"),oe=Symbol.for("lit-nothing"),pn=new WeakMap,st=nt.createTreeWalker(nt,129);function mn(s,e){if(!_s(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return an!==void 0?an.createHTML(e):e}var Ur=(s,e)=>{let t=s.length-1,r=[],n,i=e===2?"<svg>":e===3?"<math>":"",o=_t;for(let l=0;l<t;l++){let a=s[l],d,u,p=-1,h=0;for(;h<a.length&&(o.lastIndex=h,u=o.exec(a),u!==null);)h=o.lastIndex,o===_t?u[1]==="!--"?o=ln:u[1]!==void 0?o=cn:u[2]!==void 0?(gn.test(u[2])&&(n=RegExp("</"+u[2],"g")),o=tt):u[3]!==void 0&&(o=tt):o===tt?u[0]===">"?(o=n??_t,p=-1):u[1]===void 0?p=-2:(p=o.lastIndex-u[2].length,d=u[1],o=u[3]===void 0?tt:u[3]==='"'?un:dn):o===un||o===dn?o=tt:o===ln||o===cn?o=_t:(o=tt,n=void 0);let v=o===tt&&s[l+1].startsWith("/>")?" ":"";i+=o===_t?a+zr:p>=0?(r.push(d),a.slice(0,p)+fn+a.slice(p)+Ve+v):a+Ve+(p===-2?l:v)}return[mn(s,i+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},$t=class s{constructor({strings:e,_$litType$:t},r){let n;this.parts=[];let i=0,o=0,l=e.length-1,a=this.parts,[d,u]=Ur(e,t);if(this.el=s.createElement(d,r),st.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(n=st.nextNode())!==null&&a.length<l;){if(n.nodeType===1){if(n.hasAttributes())for(let p of n.getAttributeNames())if(p.endsWith(fn)){let h=u[o++],v=n.getAttribute(p).split(Ve),k=/([.?@])?(.*)/.exec(h);a.push({type:1,index:i,name:k[2],strings:v,ctor:k[1]==="."?ys:k[1]==="?"?ws:k[1]==="@"?vs:ht}),n.removeAttribute(p)}else p.startsWith(Ve)&&(a.push({type:6,index:i}),n.removeAttribute(p));if(gn.test(n.tagName)){let p=n.textContent.split(Ve),h=p.length-1;if(h>0){n.textContent=Wt?Wt.emptyScript:"";for(let v=0;v<h;v++)n.append(p[v],At()),st.nextNode(),a.push({type:2,index:++i});n.append(p[h],At())}}}else if(n.nodeType===8)if(n.data===hn)a.push({type:2,index:i});else{let p=-1;for(;(p=n.data.indexOf(Ve,p+1))!==-1;)a.push({type:7,index:i}),p+=Ve.length-1}i++}}static createElement(e,t){let r=nt.createElement("template");return r.innerHTML=e,r}};function ft(s,e,t=s,r){if(e===rt)return e;let n=r!==void 0?t._$Co?.[r]:t._$Cl,i=St(e)?void 0:e._$litDirective$;return n?.constructor!==i&&(n?._$AO?.(!1),i===void 0?n=void 0:(n=new i(s),n._$AT(s,t,r)),r!==void 0?(t._$Co??(t._$Co=[]))[r]=n:t._$Cl=n),n!==void 0&&(e=ft(s,n._$AS(s,e.values),n,r)),e}var bs=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:r}=this._$AD,n=(e?.creationScope??nt).importNode(t,!0);st.currentNode=n;let i=st.nextNode(),o=0,l=0,a=r[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new Tt(i,i.nextSibling,this,e):a.type===1?d=new a.ctor(i,a.name,a.strings,this,e):a.type===6&&(d=new ks(i,this,e)),this._$AV.push(d),a=r[++l]}o!==a?.index&&(i=st.nextNode(),o++)}return st.currentNode=nt,n}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},Tt=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,n){this.type=2,this._$AH=oe,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ft(this,e,t),St(e)?e===oe||e==null||e===""?(this._$AH!==oe&&this._$AR(),this._$AH=oe):e!==this._$AH&&e!==rt&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Br(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==oe&&St(this._$AH)?this._$AA.nextSibling.data=e:this.T(nt.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:r}=e,n=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=$t.createElement(mn(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===n)this._$AH.p(t);else{let i=new bs(n,this),o=i.u(this.options);i.p(t),this.T(o),this._$AH=i}}_$AC(e){let t=pn.get(e.strings);return t===void 0&&pn.set(e.strings,t=new $t(e)),t}k(e){_s(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,n=0;for(let i of e)n===t.length?t.push(r=new s(this.O(At()),this.O(At()),this,this.options)):r=t[n],r._$AI(i),n++;n<t.length&&(this._$AR(r&&r._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let r=e.nextSibling;e.remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},ht=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,n,i){this.type=1,this._$AH=oe,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=i,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=oe}_$AI(e,t=this,r,n){let i=this.strings,o=!1;if(i===void 0)e=ft(this,e,t,0),o=!St(e)||e!==this._$AH&&e!==rt,o&&(this._$AH=e);else{let l=e,a,d;for(e=i[0],a=0;a<i.length-1;a++)d=ft(this,l[r+a],t,a),d===rt&&(d=this._$AH[a]),o||(o=!St(d)||d!==this._$AH[a]),d===oe?e=oe:e!==oe&&(e+=(d??"")+i[a+1]),this._$AH[a]=d}o&&!n&&this.j(e)}j(e){e===oe?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ys=class extends ht{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===oe?void 0:e}},ws=class extends ht{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==oe)}},vs=class extends ht{constructor(e,t,r,n,i){super(e,t,r,n,i),this.type=5}_$AI(e,t=this){if((e=ft(this,e,t,0)??oe)===rt)return;let r=this._$AH,n=e===oe&&r!==oe||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,i=e!==oe&&(r===oe||n);n&&this.element.removeEventListener(this.name,this,r),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ks=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){ft(this,e)}};var Hr=xt.litHtmlPolyfillSupport;Hr?.($t,Tt),(xt.litHtmlVersions??(xt.litHtmlVersions=[])).push("3.3.1");var J=(s,e,t)=>{let r=t?.renderBefore??e,n=r._$litPart$;if(n===void 0){let i=t?.renderBefore??null;r._$litPart$=n=new Tt(e.insertBefore(At(),i),i,void 0,t??{})}return n._$AI(s),n};function Re(s,e){let t=s.priority??2,r=e.priority??2;if(t!==r)return t-r;let n=s.created_at??0,i=e.created_at??0;if(n!==i)return n<i?-1:1;let o=s.id,l=e.id;return o<l?-1:o>l?1:0}function gt(s,e){let t=s.closed_at??0,r=e.closed_at??0;if(t!==r)return t<r?1:-1;let n=s?.id,i=e?.id;return n<i?-1:n>i?1:0}function Ze(s=void 0){function e(i){return!s||typeof s.snapshotFor!="function"?[]:s.snapshotFor(i).slice().sort(Re)}function t(i,o){let l=s&&s.snapshotFor?s.snapshotFor(i).slice():[];return o==="in_progress"?l.sort(Re):o==="closed"?l.sort(gt):l.sort(Re),l}function r(i){if(!s||typeof s.snapshotFor!="function")return[];let l=(s.snapshotFor(`detail:${i}`)||[]).find(d=>String(d?.id||"")===String(i));return(Array.isArray(l?.dependents)?l.dependents:[]).slice().sort(Re)}function n(i){return s&&typeof s.subscribe=="function"?s.subscribe(i):()=>{}}return{selectIssuesFor:e,selectBoardColumn:t,selectEpicChildren:r,subscribe:n}}var _n=Fr(kn(),1);function V(s){return(0,_n.default)(`queenui:${s}`)}function xn(s){let e=V("data");async function t(r){let{id:n}=r;e("updateIssue %s %o",n,Object.keys(r));let i=null;return typeof r.title=="string"&&(i=await s("edit-text",{id:n,field:"title",value:r.title})),typeof r.acceptance=="string"&&(i=await s("edit-text",{id:n,field:"acceptance",value:r.acceptance})),typeof r.notes=="string"&&(i=await s("edit-text",{id:n,field:"notes",value:r.notes})),typeof r.design=="string"&&(i=await s("edit-text",{id:n,field:"design",value:r.design})),typeof r.status=="string"&&(i=await s("update-status",{id:n,status:r.status})),typeof r.priority=="number"&&(i=await s("update-priority",{id:n,priority:r.priority})),typeof r.assignee=="string"&&(i=await s("update-assignee",{id:n,assignee:r.assignee})),e("updateIssue done %s",n),i}return{updateIssue:t}}function As(s,e={}){let t=V(`issue-store:${s}`),r=new Map,n=[],i=0,o=new Set,l=!1,a=e.sort||Re;function d(){for(let h of Array.from(o))try{h()}catch{}}function u(){n=Array.from(r.values()).sort(a)}function p(h){if(l||!h||h.id!==s)return;let v=Number(h.revision)||0;if(t("apply %s rev=%d",h.type,v),!(v<=i&&h.type!=="snapshot")){if(h.type==="snapshot"){if(v<=i)return;r.clear();let k=Array.isArray(h.issues)?h.issues:[];for(let _ of k)_&&typeof _.id=="string"&&_.id.length>0&&r.set(_.id,_);u(),i=v,d();return}if(h.type==="upsert"){let k=h.issue;if(k&&typeof k.id=="string"&&k.id.length>0){let _=r.get(k.id);if(!_)r.set(k.id,k);else{let R=Number.isFinite(_.updated_at)?_.updated_at:0,m=Number.isFinite(k.updated_at)?k.updated_at:0;if(R<=m){for(let E of Object.keys(_))E in k||delete _[E];for(let[E,S]of Object.entries(k))_[E]=S}}u()}i=v,d()}else if(h.type==="delete"){let k=String(h.issue_id||"");k&&(r.delete(k),u()),i=v,d()}}}return{id:s,subscribe(h){return o.add(h),()=>{o.delete(h)}},applyPush:p,snapshot(){return n},size(){return r.size},getById(h){return r.get(h)},dispose(){l=!0,r.clear(),n=[],o.clear(),i=0}}}function Kt(s){let e=String(s.type||"").trim(),t={};if(s.params&&typeof s.params=="object"){let n=Object.keys(s.params).sort();for(let i of n){let o=s.params[i];t[i]=String(o)}}let r=new URLSearchParams(t).toString();return r.length>0?`${e}?${r}`:e}function An(s){let e=V("subs"),t=new Map,r=new Map;function n(l,a){e("applyDelta %s +%d ~%d -%d",l,(a.added||[]).length,(a.updated||[]).length,(a.removed||[]).length);let d=r.get(l);if(!d||d.size===0)return;let u=Array.isArray(a.added)?a.added:[],p=Array.isArray(a.updated)?a.updated:[],h=Array.isArray(a.removed)?a.removed:[];for(let v of Array.from(d)){let k=t.get(v);if(!k)continue;let _=k.itemsById;for(let R of u)typeof R=="string"&&R.length>0&&_.set(R,!0);for(let R of p)typeof R=="string"&&R.length>0&&_.set(R,!0);for(let R of h)typeof R=="string"&&R.length>0&&_.delete(R)}}async function i(l,a){let d=Kt(a);if(e("subscribe %s key=%s",l,d),!t.has(l))t.set(l,{key:d,itemsById:new Map});else{let p=t.get(l);if(p&&p.key!==d){let h=r.get(p.key);h&&(h.delete(l),h.size===0&&r.delete(p.key)),t.set(l,{key:d,itemsById:new Map})}}r.has(d)||r.set(d,new Set);let u=r.get(d);u&&u.add(l);try{await s("subscribe-list",{id:l,type:a.type,params:a.params})}catch(p){let h=t.get(l)||null;if(h){let v=r.get(h.key);v&&(v.delete(l),v.size===0&&r.delete(h.key))}throw t.delete(l),p}return async()=>{e("unsubscribe %s key=%s",l,d);try{await s("unsubscribe-list",{id:l})}catch{}let p=t.get(l)||null;if(p){let h=r.get(p.key);h&&(h.delete(l),h.size===0&&r.delete(p.key))}t.delete(l)}}return{subscribeList:i,_applyDelta:n,_subKeyOf:Kt,selectors:{getIds(l){let a=t.get(l);return a?Array.from(a.itemsById.keys()):[]},has(l,a){let d=t.get(l);return d?d.itemsById.has(a):!1},count(l){let a=t.get(l);return a?a.itemsById.size:0},getItemsById(l){let a=t.get(l),d={};if(!a)return d;for(let u of a.itemsById.keys())d[u]=!0;return d}}}}function Sn(){let s=V("issue-stores"),e=new Map,t=new Map,r=new Set,n=new Map;function i(){for(let a of Array.from(r))try{a()}catch{}}function o(a,d,u){let p=d?Kt(d):"",h=t.get(a)||"",v=e.has(a);if(s("register %s key=%s (prev=%s)",a,p,h),v&&h&&p&&h!==p){let k=e.get(a);if(k)try{k.dispose()}catch{}let _=n.get(a);if(_){try{_()}catch{}n.delete(a)}let R=As(a,u);e.set(a,R);let m=R.subscribe(()=>i());n.set(a,m)}else if(!v){let k=As(a,u);e.set(a,k);let _=k.subscribe(()=>i());n.set(a,_)}return t.set(a,p),()=>l(a)}function l(a){s("unregister %s",a),t.delete(a);let d=e.get(a);d&&(d.dispose(),e.delete(a));let u=n.get(a);if(u){try{u()}catch{}n.delete(a)}}return{register:o,unregister:l,getStore(a){return e.get(a)||null},snapshotFor(a){let d=e.get(a);return d?d.snapshot().slice():[]},subscribe(a){return r.add(a),()=>r.delete(a)}}}function Ke(s,e){return`#/${s==="epics"||s==="board"?s:"issues"}?issue=${encodeURIComponent(e)}`}function Yt(s){let e=String(s||""),t=e.startsWith("#")?e.slice(1):e,r=t.indexOf("?"),n=r>=0?t.slice(r+1):"";if(n){let l=new URLSearchParams(n).get("issue");if(l)return decodeURIComponent(l)}let i=/^\/issue\/([^\s?#]+)/.exec(t);return i&&i[1]?decodeURIComponent(i[1]):null}function Ss(s){let e=String(s||"");return/^#\/epics(\b|\/|$)/.test(e)?"epics":/^#\/board(\b|\/|$)/.test(e)?"board":/^#\/messages(\b|\/|$)/.test(e)?"messages":/^#\/assignments(\b|\/|$)/.test(e)?"assignments":/^#\/reservations(\b|\/|$)/.test(e)?"reservations":/^#\/droids(\b|\/|$)/.test(e)?"droids":"issues"}function $n(s){let e=V("router"),t=()=>{let r=window.location.hash||"",n=/^#\/issue\/([^\s?#]+)/.exec(r);if(n&&n[1]){let l=decodeURIComponent(n[1]);s.setState({selected_id:l,view:"issues"});let a=`#/issues?issue=${encodeURIComponent(l)}`;if(window.location.hash!==a){window.location.hash=a;return}}let i=Yt(r),o=Ss(r);e("hash change \u2192 view=%s id=%s",o,i),s.setState({selected_id:i,view:o})};return{start(){window.addEventListener("hashchange",t),t()},stop(){window.removeEventListener("hashchange",t)},gotoIssue(r){let i=(s.getState?s.getState():{view:"issues"}).view||"issues",o=Ke(i,r);e("goto issue %s (view=%s)",r,i),window.location.hash!==o?window.location.hash=o:s.setState({selected_id:r,view:i})},gotoView(r){let i=(s.getState?s.getState():{selected_id:null}).selected_id,o=i?Ke(r,i):`#/${r}`;e("goto view %s (id=%s)",r,i||""),window.location.hash!==o?window.location.hash=o:s.setState({view:r,selected_id:null})}}}function Tn(s={}){let e=V("state"),t={selected_id:s.selected_id??null,view:s.view??"issues",filters:{status:s.filters?.status??"all",search:s.filters?.search??"",type:typeof s.filters?.type=="string"?s.filters?.type:""},board:{closed_filter:s.board?.closed_filter==="3"||s.board?.closed_filter==="7"||s.board?.closed_filter==="today"?s.board?.closed_filter:"today"}},r=new Set;function n(){for(let i of Array.from(r))try{i(t)}catch{}}return{getState(){return t},setState(i){let o={...t,...i,filters:{...t.filters,...i.filters||{}},board:{...t.board,...i.board||{}}};o.selected_id===t.selected_id&&o.view===t.view&&o.filters.status===t.filters.status&&o.filters.search===t.filters.search&&o.filters.type===t.filters.type&&o.board.closed_filter===t.board.closed_filter||(t=o,e("state change %o",{selected_id:t.selected_id,view:t.view,filters:t.filters,board:t.board}),n())},subscribe(i){return r.add(i),()=>r.delete(i)}}}function En(s){let e=0;function t(){if(!s)return;let o=e>0;s.toggleAttribute("hidden",!o),s.setAttribute("aria-busy",o?"true":"false")}function r(){e+=1,t()}function n(){e=Math.max(0,e-1),t()}function i(o){return async(l,a)=>{r();try{return await o(l,a)}finally{n()}}}return t(),{wrapSend:i,start:r,done:n,getCount:()=>e}}function ge(s,e="info",t=2800){let r=document.createElement("div");r.className="toast",r.textContent=s,r.style.position="fixed",r.style.right="12px",r.style.bottom="12px",r.style.zIndex="1000",r.style.color="#fff",r.style.padding="8px 10px",r.style.borderRadius="4px",r.style.fontSize="12px",e==="success"?r.style.background="#156d36":e==="error"?r.style.background="#9f2011":r.style.background="rgba(0,0,0,0.85)",(document.body||document.documentElement).appendChild(r),setTimeout(()=>{try{r.remove()}catch{}},t)}function Ye(s,e){let t=typeof e?.duration_ms=="number"?e.duration_ms:1200,r=document.createElement("button");r.className=(e?.class_name?e.class_name+" ":"")+"mono id-copy",r.type="button",r.setAttribute("aria-live","polite"),r.setAttribute("title","Copy issue ID"),r.setAttribute("aria-label",`Copy issue ID ${s}`),r.textContent=s;async function n(){try{navigator.clipboard&&typeof navigator.clipboard.writeText=="function"&&await navigator.clipboard.writeText(String(s)),r.textContent="Copied";let i=r.getAttribute("aria-label")||"";r.setAttribute("aria-label","Copied"),setTimeout(()=>{r.textContent=s,r.setAttribute("aria-label",i)},Math.max(80,t))}catch{}}return r.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),n()}),r.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),i.stopPropagation(),n())}),r}var Xe=["Critical","High","Medium","Low","Backlog"];function Cn(s){let e=typeof s=="number"?s:2,t=document.createElement("span");t.className="priority-badge",t.classList.add(`is-p${Math.max(0,Math.min(4,e))}`),t.setAttribute("role","img");let r=ti(e);return t.setAttribute("title",r),t.setAttribute("aria-label",`Priority: ${r}`),t.textContent=Et(e)+" "+r,t}function ti(s){let e=Math.max(0,Math.min(4,s));return Xe[e]||"Medium"}function Et(s){switch(s){case 0:return"\u{1F525}";case 1:return"\u26A1\uFE0F";case 2:return"\u{1F527}";case 3:return"\u{1FAB6}";case 4:return"\u{1F4A4}";default:return"\u{1F527}"}}function ot(s){let e=document.createElement("span");e.className="type-badge";let t=(s||"").toString().toLowerCase(),r=new Set(["bug","feature","task","epic","chore"]),n=r.has(t)?t:"neutral";e.classList.add(`type-badge--${n}`),e.setAttribute("role","img");let i=r.has(t)?t==="bug"?"Bug":t==="feature"?"Feature":t==="task"?"Task":t==="epic"?"Epic":"Chore":"\u2014";return e.setAttribute("aria-label",r.has(t)?`Issue type: ${i}`:"Issue type: unknown"),e.setAttribute("title",r.has(t)?`Type: ${i}`:"Type: unknown"),e.textContent=i,e}function Rn(s,e,t,r,n=void 0,i=void 0){let o=V("views:board"),l=[],a=[],d=[],u=[],p=[],h=i?Ze(i):null,v="today";if(r)try{let g=r.getState(),y=g&&g.board?String(g.board.closed_filter||"today"):"today";(y==="today"||y==="3"||y==="7")&&(v=y)}catch{}function k(){return A`
      <div class="panel__body board-root">
        ${_("Blocked","blocked-col",a)}
        ${_("Ready","ready-col",l)}
        ${_("In Progress","in-progress-col",d)}
        ${_("Closed","closed-col",u)}
      </div>
    `}function _(g,y,I){let M=Array.isArray(I)?I.length:0,O=M===1?"1 issue":`${M} issues`;return A`
      <section class="board-column" id=${y}>
        <header
          class="board-column__header"
          id=${y+"-header"}
          role="heading"
          aria-level="2"
        >
          <div class="board-column__title">
            <span class="board-column__title-text">${g}</span>
            <span class="badge board-column__count" aria-label=${O}>
              ${M}
            </span>
          </div>
          ${y==="closed-col"?A`<label class="board-closed-filter">
                <span class="visually-hidden">Filter closed issues</span>
                <select
                  id="closed-filter"
                  aria-label="Filter closed issues"
                  @change=${L}
                >
                  <option
                    value="today"
                    ?selected=${v==="today"}
                  >
                    Today
                  </option>
                  <option value="3" ?selected=${v==="3"}>
                    Last 3 days
                  </option>
                  <option value="7" ?selected=${v==="7"}>
                    Last 7 days
                  </option>
                </select>
              </label>`:""}
        </header>
        <div
          class="board-column__body"
          role="list"
          aria-labelledby=${y+"-header"}
        >
          ${I.map(j=>R(j))}
        </div>
      </section>
    `}function R(g){return A`
      <article
        class="board-card"
        data-issue-id=${g.id}
        role="listitem"
        tabindex="-1"
        @click=${()=>t(g.id)}
      >
        <div class="board-card__title text-truncate">
          ${g.title||"(no title)"}
        </div>
        <div class="board-card__meta">
          ${ot(g.issue_type)} ${Cn(g.priority)}
          ${Ye(g.id,{class_name:"mono"})}
        </div>
      </article>
    `}function m(){J(k(),s),E()}function E(){try{let g=Array.from(s.querySelectorAll(".board-column"));for(let y of g){let I=y.querySelector(".board-column__body");if(!I)continue;let M=Array.from(I.querySelectorAll(".board-card")),O=y.querySelector(".board-column__header"),j=O&&O.textContent?.trim()||"";for(let z of M){let H=z.querySelector(".board-card__title"),K=H&&H.textContent?.trim()||"";z.setAttribute("aria-label",`Issue ${K||"(no title)"} \u2014 Column ${j}`),z.tabIndex=-1}M.length>0&&(M[0].tabIndex=0)}}catch{}}s.addEventListener("keydown",g=>{let y=g.target;if(!y||!(y instanceof HTMLElement))return;let I=String(y.tagName||"").toLowerCase();if(I==="input"||I==="textarea"||I==="select"||y.isContentEditable===!0)return;let M=y.closest(".board-card");if(!M)return;let O=String(g.key||"");if(O==="Enter"||O===" "){g.preventDefault();let W=M.getAttribute("data-issue-id");W&&t(W);return}if(O!=="ArrowUp"&&O!=="ArrowDown"&&O!=="ArrowLeft"&&O!=="ArrowRight")return;g.preventDefault();let j=M.closest(".board-column");if(!j)return;let z=j.querySelector(".board-column__body");if(!z)return;let H=Array.from(z.querySelectorAll(".board-card")),K=H.indexOf(M);if(K!==-1){if(O==="ArrowDown"&&K<H.length-1){S(H[K],H[K+1]);return}if(O==="ArrowUp"&&K>0){S(H[K],H[K-1]);return}if(O==="ArrowRight"||O==="ArrowLeft"){let W=Array.from(s.querySelectorAll(".board-column")),le=W.indexOf(j);if(le===-1)return;let ue=O==="ArrowRight"?1:-1,ce=le+ue,se=null;for(;ce>=0&&ce<W.length;){let U=W[ce],pe=U.querySelector(".board-column__body");if((pe?Array.from(pe.querySelectorAll(".board-card")):[]).length>0){se=U;break}ce+=ue}if(se){let U=se.querySelector(".board-column__body .board-card");U&&S(M,U)}return}}});function S(g,y){try{g.tabIndex=-1,y.tabIndex=0,y.focus()}catch{}}function x(){o("applyClosedFilter %s",v);let g=Array.isArray(p)?[...p]:[],y=new Date,I=0;v==="today"?I=new Date(y.getFullYear(),y.getMonth(),y.getDate(),0,0,0,0).getTime():v==="3"?I=y.getTime()-4320*60*1e3:v==="7"&&(I=y.getTime()-10080*60*1e3),g=g.filter(M=>{let O=Number.isFinite(M.closed_at)?M.closed_at:NaN;return Number.isFinite(O)?O>=I:!1}),g.sort(gt),u=g}function L(g){try{let y=g.target,I=String(y.value||"today");if(v=I==="3"||I==="7"?I:"today",o("closed filter %s",v),r)try{r.setState({board:{closed_filter:v}})}catch{}x(),m()}catch{}}function b(){try{if(h){let g=h.selectBoardColumn("tab:board:in-progress","in_progress"),y=h.selectBoardColumn("tab:board:blocked","blocked"),I=h.selectBoardColumn("tab:board:ready","ready"),M=h.selectBoardColumn("tab:board:closed","closed"),O=new Set(g.map(z=>z.id));l=I.filter(z=>!O.has(z.id)),a=y,d=g,p=M}x(),m()}catch{l=[],a=[],d=[],u=[],m()}}return h&&h.subscribe(()=>{try{b()}catch{}}),{async load(){o("load"),b();try{let g=!!(n&&n.selectors),y=j=>{if(!g||!n)return 0;let z=n.selectors;if(typeof z.count=="function")return Number(z.count(j)||0);try{let H=z.getIds(j);return Array.isArray(H)?H.length:0}catch{return 0}},I=y("tab:board:ready")+y("tab:board:blocked")+y("tab:board:in-progress")+y("tab:board:closed"),M=e,O=M&&typeof M.getReady=="function"&&typeof M.getBlocked=="function"&&typeof M.getInProgress=="function"&&typeof M.getClosed=="function";if(I===0&&O){o("fallback fetch");let[j,z,H,K]=await Promise.all([M.getReady().catch(()=>[]),M.getBlocked().catch(()=>[]),M.getInProgress().catch(()=>[]),M.getClosed().catch(()=>[])]),W=Array.isArray(j)?j.map(U=>U):[],le=Array.isArray(z)?z.map(U=>U):[],ue=Array.isArray(H)?H.map(U=>U):[],ce=Array.isArray(K)?K.map(U=>U):[],se=new Set(ue.map(U=>U.id));W=W.filter(U=>!se.has(U.id)),W.sort(Re),le.sort(Re),ue.sort(Re),l=W,a=le,d=ue,p=ce,x(),m()}}catch{}},clear(){s.replaceChildren(),l=[],a=[],d=[],u=[]}}}var{entries:zn,setPrototypeOf:In,isFrozen:si,getPrototypeOf:ni,getOwnPropertyDescriptor:ri}=Object,{freeze:we,seal:$e,create:Ds}=Object,{apply:Ls,construct:Ms}=typeof Reflect<"u"&&Reflect;we||(we=function(e){return e});$e||($e=function(e){return e});Ls||(Ls=function(e,t){for(var r=arguments.length,n=new Array(r>2?r-2:0),i=2;i<r;i++)n[i-2]=arguments[i];return e.apply(t,n)});Ms||(Ms=function(e){for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n];return new e(...r)});var Xt=ve(Array.prototype.forEach),ii=ve(Array.prototype.lastIndexOf),Dn=ve(Array.prototype.pop),Ct=ve(Array.prototype.push),oi=ve(Array.prototype.splice),Jt=ve(String.prototype.toLowerCase),$s=ve(String.prototype.toString),Ts=ve(String.prototype.match),Rt=ve(String.prototype.replace),ai=ve(String.prototype.indexOf),li=ve(String.prototype.trim),Ie=ve(Object.prototype.hasOwnProperty),ye=ve(RegExp.prototype.test),It=ci(TypeError);function ve(s){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var t=arguments.length,r=new Array(t>1?t-1:0),n=1;n<t;n++)r[n-1]=arguments[n];return Ls(s,e,r)}}function ci(s){return function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return Ms(s,t)}}function G(s,e){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Jt;In&&In(s,null);let r=e.length;for(;r--;){let n=e[r];if(typeof n=="string"){let i=t(n);i!==n&&(si(e)||(e[r]=i),n=i)}s[n]=!0}return s}function di(s){for(let e=0;e<s.length;e++)Ie(s,e)||(s[e]=null);return s}function Oe(s){let e=Ds(null);for(let[t,r]of zn(s))Ie(s,t)&&(Array.isArray(r)?e[t]=di(r):r&&typeof r=="object"&&r.constructor===Object?e[t]=Oe(r):e[t]=r);return e}function Dt(s,e){for(;s!==null;){let r=ri(s,e);if(r){if(r.get)return ve(r.get);if(typeof r.value=="function")return ve(r.value)}s=ni(s)}function t(){return null}return t}var Ln=we(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Es=we(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Cs=we(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),ui=we(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Rs=we(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),pi=we(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Mn=we(["#text"]),Nn=we(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Is=we(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),On=we(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Qt=we(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),fi=$e(/\{\{[\w\W]*|[\w\W]*\}\}/gm),hi=$e(/<%[\w\W]*|[\w\W]*%>/gm),gi=$e(/\$\{[\w\W]*/gm),mi=$e(/^data-[\-\w.\u00B7-\uFFFF]+$/),bi=$e(/^aria-[\-\w]+$/),Bn=$e(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),yi=$e(/^(?:\w+script|data):/i),wi=$e(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Un=$e(/^html$/i),vi=$e(/^[a-z][.\w]*(-[.\w]+)+$/i),Pn=Object.freeze({__proto__:null,ARIA_ATTR:bi,ATTR_WHITESPACE:wi,CUSTOM_ELEMENT:vi,DATA_ATTR:mi,DOCTYPE_NAME:Un,ERB_EXPR:hi,IS_ALLOWED_URI:Bn,IS_SCRIPT_OR_DATA:yi,MUSTACHE_EXPR:fi,TMPLIT_EXPR:gi}),Lt={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,progressingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},ki=function(){return typeof window>"u"?null:window},_i=function(e,t){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let r=null,n="data-tt-policy-suffix";t&&t.hasAttribute(n)&&(r=t.getAttribute(n));let i="dompurify"+(r?"#"+r:"");try{return e.createPolicy(i,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+i+" could not be created."),null}},Fn=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Hn(){let s=arguments.length>0&&arguments[0]!==void 0?arguments[0]:ki(),e=F=>Hn(F);if(e.version="3.3.1",e.removed=[],!s||!s.document||s.document.nodeType!==Lt.document||!s.Element)return e.isSupported=!1,e;let{document:t}=s,r=t,n=r.currentScript,{DocumentFragment:i,HTMLTemplateElement:o,Node:l,Element:a,NodeFilter:d,NamedNodeMap:u=s.NamedNodeMap||s.MozNamedAttrMap,HTMLFormElement:p,DOMParser:h,trustedTypes:v}=s,k=a.prototype,_=Dt(k,"cloneNode"),R=Dt(k,"remove"),m=Dt(k,"nextSibling"),E=Dt(k,"childNodes"),S=Dt(k,"parentNode");if(typeof o=="function"){let F=t.createElement("template");F.content&&F.content.ownerDocument&&(t=F.content.ownerDocument)}let x,L="",{implementation:b,createNodeIterator:g,createDocumentFragment:y,getElementsByTagName:I}=t,{importNode:M}=r,O=Fn();e.isSupported=typeof zn=="function"&&typeof S=="function"&&b&&b.createHTMLDocument!==void 0;let{MUSTACHE_EXPR:j,ERB_EXPR:z,TMPLIT_EXPR:H,DATA_ATTR:K,ARIA_ATTR:W,IS_SCRIPT_OR_DATA:le,ATTR_WHITESPACE:ue,CUSTOM_ELEMENT:ce}=Pn,{IS_ALLOWED_URI:se}=Pn,U=null,pe=G({},[...Ln,...Es,...Cs,...Rs,...Mn]),re=null,Je=G({},[...Nn,...Is,...On,...Qt]),ee=Object.seal(Ds(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Me=null,qe=null,Se=Object.seal(Ds(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),wt=!0,Te=!0,Pe=!1,Ee=!0,_e=!1,N=!0,be=!1,je=!1,Fe=!1,Ce=!1,ze=!1,$=!1,w=!0,f=!1,T="user-content-",B=!0,D=!1,X={},ie=null,ct=G({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),fe=null,Ut=G({},["audio","video","img","source","image","track"]),vt=null,Ht=G({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Ge="http://www.w3.org/1998/Math/MathML",dt="http://www.w3.org/2000/svg",q="http://www.w3.org/1999/xhtml",te=q,We=!1,qt=null,Ar=G({},[Ge,dt,q],$s),jt=G({},["mi","mo","mn","ms","mtext"]),Gt=G({},["annotation-xml"]),Sr=G({},["title","style","font","a","script"]),kt=null,$r=["application/xhtml+xml","text/html"],Tr="text/html",de=null,ut=null,Er=t.createElement("form"),Zs=function(c){return c instanceof RegExp||c instanceof Function},us=function(){let c=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(ut&&ut===c)){if((!c||typeof c!="object")&&(c={}),c=Oe(c),kt=$r.indexOf(c.PARSER_MEDIA_TYPE)===-1?Tr:c.PARSER_MEDIA_TYPE,de=kt==="application/xhtml+xml"?$s:Jt,U=Ie(c,"ALLOWED_TAGS")?G({},c.ALLOWED_TAGS,de):pe,re=Ie(c,"ALLOWED_ATTR")?G({},c.ALLOWED_ATTR,de):Je,qt=Ie(c,"ALLOWED_NAMESPACES")?G({},c.ALLOWED_NAMESPACES,$s):Ar,vt=Ie(c,"ADD_URI_SAFE_ATTR")?G(Oe(Ht),c.ADD_URI_SAFE_ATTR,de):Ht,fe=Ie(c,"ADD_DATA_URI_TAGS")?G(Oe(Ut),c.ADD_DATA_URI_TAGS,de):Ut,ie=Ie(c,"FORBID_CONTENTS")?G({},c.FORBID_CONTENTS,de):ct,Me=Ie(c,"FORBID_TAGS")?G({},c.FORBID_TAGS,de):Oe({}),qe=Ie(c,"FORBID_ATTR")?G({},c.FORBID_ATTR,de):Oe({}),X=Ie(c,"USE_PROFILES")?c.USE_PROFILES:!1,wt=c.ALLOW_ARIA_ATTR!==!1,Te=c.ALLOW_DATA_ATTR!==!1,Pe=c.ALLOW_UNKNOWN_PROTOCOLS||!1,Ee=c.ALLOW_SELF_CLOSE_IN_ATTR!==!1,_e=c.SAFE_FOR_TEMPLATES||!1,N=c.SAFE_FOR_XML!==!1,be=c.WHOLE_DOCUMENT||!1,Ce=c.RETURN_DOM||!1,ze=c.RETURN_DOM_FRAGMENT||!1,$=c.RETURN_TRUSTED_TYPE||!1,Fe=c.FORCE_BODY||!1,w=c.SANITIZE_DOM!==!1,f=c.SANITIZE_NAMED_PROPS||!1,B=c.KEEP_CONTENT!==!1,D=c.IN_PLACE||!1,se=c.ALLOWED_URI_REGEXP||Bn,te=c.NAMESPACE||q,jt=c.MATHML_TEXT_INTEGRATION_POINTS||jt,Gt=c.HTML_INTEGRATION_POINTS||Gt,ee=c.CUSTOM_ELEMENT_HANDLING||{},c.CUSTOM_ELEMENT_HANDLING&&Zs(c.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(ee.tagNameCheck=c.CUSTOM_ELEMENT_HANDLING.tagNameCheck),c.CUSTOM_ELEMENT_HANDLING&&Zs(c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(ee.attributeNameCheck=c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),c.CUSTOM_ELEMENT_HANDLING&&typeof c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(ee.allowCustomizedBuiltInElements=c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),_e&&(Te=!1),ze&&(Ce=!0),X&&(U=G({},Mn),re=[],X.html===!0&&(G(U,Ln),G(re,Nn)),X.svg===!0&&(G(U,Es),G(re,Is),G(re,Qt)),X.svgFilters===!0&&(G(U,Cs),G(re,Is),G(re,Qt)),X.mathMl===!0&&(G(U,Rs),G(re,On),G(re,Qt))),c.ADD_TAGS&&(typeof c.ADD_TAGS=="function"?Se.tagCheck=c.ADD_TAGS:(U===pe&&(U=Oe(U)),G(U,c.ADD_TAGS,de))),c.ADD_ATTR&&(typeof c.ADD_ATTR=="function"?Se.attributeCheck=c.ADD_ATTR:(re===Je&&(re=Oe(re)),G(re,c.ADD_ATTR,de))),c.ADD_URI_SAFE_ATTR&&G(vt,c.ADD_URI_SAFE_ATTR,de),c.FORBID_CONTENTS&&(ie===ct&&(ie=Oe(ie)),G(ie,c.FORBID_CONTENTS,de)),c.ADD_FORBID_CONTENTS&&(ie===ct&&(ie=Oe(ie)),G(ie,c.ADD_FORBID_CONTENTS,de)),B&&(U["#text"]=!0),be&&G(U,["html","head","body"]),U.table&&(G(U,["tbody"]),delete Me.tbody),c.TRUSTED_TYPES_POLICY){if(typeof c.TRUSTED_TYPES_POLICY.createHTML!="function")throw It('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof c.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw It('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');x=c.TRUSTED_TYPES_POLICY,L=x.createHTML("")}else x===void 0&&(x=_i(v,n)),x!==null&&typeof L=="string"&&(L=x.createHTML(""));we&&we(c),ut=c}},Ks=G({},[...Es,...Cs,...ui]),Ys=G({},[...Rs,...pi]),Cr=function(c){let C=S(c);(!C||!C.tagName)&&(C={namespaceURI:te,tagName:"template"});let P=Jt(c.tagName),ne=Jt(C.tagName);return qt[c.namespaceURI]?c.namespaceURI===dt?C.namespaceURI===q?P==="svg":C.namespaceURI===Ge?P==="svg"&&(ne==="annotation-xml"||jt[ne]):!!Ks[P]:c.namespaceURI===Ge?C.namespaceURI===q?P==="math":C.namespaceURI===dt?P==="math"&&Gt[ne]:!!Ys[P]:c.namespaceURI===q?C.namespaceURI===dt&&!Gt[ne]||C.namespaceURI===Ge&&!jt[ne]?!1:!Ys[P]&&(Sr[P]||!Ks[P]):!!(kt==="application/xhtml+xml"&&qt[c.namespaceURI]):!1},Ne=function(c){Ct(e.removed,{element:c});try{S(c).removeChild(c)}catch{R(c)}},et=function(c,C){try{Ct(e.removed,{attribute:C.getAttributeNode(c),from:C})}catch{Ct(e.removed,{attribute:null,from:C})}if(C.removeAttribute(c),c==="is")if(Ce||ze)try{Ne(C)}catch{}else try{C.setAttribute(c,"")}catch{}},Xs=function(c){let C=null,P=null;if(Fe)c="<remove></remove>"+c;else{let ae=Ts(c,/^[\r\n\t ]+/);P=ae&&ae[0]}kt==="application/xhtml+xml"&&te===q&&(c='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+c+"</body></html>");let ne=x?x.createHTML(c):c;if(te===q)try{C=new h().parseFromString(ne,kt)}catch{}if(!C||!C.documentElement){C=b.createDocument(te,"template",null);try{C.documentElement.innerHTML=We?L:ne}catch{}}let me=C.body||C.documentElement;return c&&P&&me.insertBefore(t.createTextNode(P),me.childNodes[0]||null),te===q?I.call(C,be?"html":"body")[0]:be?C.documentElement:me},Qs=function(c){return g.call(c.ownerDocument||c,c,d.SHOW_ELEMENT|d.SHOW_COMMENT|d.SHOW_TEXT|d.SHOW_PROCESSING_INSTRUCTION|d.SHOW_CDATA_SECTION,null)},ps=function(c){return c instanceof p&&(typeof c.nodeName!="string"||typeof c.textContent!="string"||typeof c.removeChild!="function"||!(c.attributes instanceof u)||typeof c.removeAttribute!="function"||typeof c.setAttribute!="function"||typeof c.namespaceURI!="string"||typeof c.insertBefore!="function"||typeof c.hasChildNodes!="function")},Js=function(c){return typeof l=="function"&&c instanceof l};function Be(F,c,C){Xt(F,P=>{P.call(e,c,C,ut)})}let en=function(c){let C=null;if(Be(O.beforeSanitizeElements,c,null),ps(c))return Ne(c),!0;let P=de(c.nodeName);if(Be(O.uponSanitizeElement,c,{tagName:P,allowedTags:U}),N&&c.hasChildNodes()&&!Js(c.firstElementChild)&&ye(/<[/\w!]/g,c.innerHTML)&&ye(/<[/\w!]/g,c.textContent)||c.nodeType===Lt.progressingInstruction||N&&c.nodeType===Lt.comment&&ye(/<[/\w]/g,c.data))return Ne(c),!0;if(!(Se.tagCheck instanceof Function&&Se.tagCheck(P))&&(!U[P]||Me[P])){if(!Me[P]&&sn(P)&&(ee.tagNameCheck instanceof RegExp&&ye(ee.tagNameCheck,P)||ee.tagNameCheck instanceof Function&&ee.tagNameCheck(P)))return!1;if(B&&!ie[P]){let ne=S(c)||c.parentNode,me=E(c)||c.childNodes;if(me&&ne){let ae=me.length;for(let xe=ae-1;xe>=0;--xe){let Ue=_(me[xe],!0);Ue.__removalCount=(c.__removalCount||0)+1,ne.insertBefore(Ue,m(c))}}}return Ne(c),!0}return c instanceof a&&!Cr(c)||(P==="noscript"||P==="noembed"||P==="noframes")&&ye(/<\/no(script|embed|frames)/i,c.innerHTML)?(Ne(c),!0):(_e&&c.nodeType===Lt.text&&(C=c.textContent,Xt([j,z,H],ne=>{C=Rt(C,ne," ")}),c.textContent!==C&&(Ct(e.removed,{element:c.cloneNode()}),c.textContent=C)),Be(O.afterSanitizeElements,c,null),!1)},tn=function(c,C,P){if(w&&(C==="id"||C==="name")&&(P in t||P in Er))return!1;if(!(Te&&!qe[C]&&ye(K,C))){if(!(wt&&ye(W,C))){if(!(Se.attributeCheck instanceof Function&&Se.attributeCheck(C,c))){if(!re[C]||qe[C]){if(!(sn(c)&&(ee.tagNameCheck instanceof RegExp&&ye(ee.tagNameCheck,c)||ee.tagNameCheck instanceof Function&&ee.tagNameCheck(c))&&(ee.attributeNameCheck instanceof RegExp&&ye(ee.attributeNameCheck,C)||ee.attributeNameCheck instanceof Function&&ee.attributeNameCheck(C,c))||C==="is"&&ee.allowCustomizedBuiltInElements&&(ee.tagNameCheck instanceof RegExp&&ye(ee.tagNameCheck,P)||ee.tagNameCheck instanceof Function&&ee.tagNameCheck(P))))return!1}else if(!vt[C]){if(!ye(se,Rt(P,ue,""))){if(!((C==="src"||C==="xlink:href"||C==="href")&&c!=="script"&&ai(P,"data:")===0&&fe[c])){if(!(Pe&&!ye(le,Rt(P,ue,"")))){if(P)return!1}}}}}}}return!0},sn=function(c){return c!=="annotation-xml"&&Ts(c,ce)},nn=function(c){Be(O.beforeSanitizeAttributes,c,null);let{attributes:C}=c;if(!C||ps(c))return;let P={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:re,forceKeepAttr:void 0},ne=C.length;for(;ne--;){let me=C[ne],{name:ae,namespaceURI:xe,value:Ue}=me,pt=de(ae),fs=Ue,he=ae==="value"?fs:li(fs);if(P.attrName=pt,P.attrValue=he,P.keepAttr=!0,P.forceKeepAttr=void 0,Be(O.uponSanitizeAttribute,c,P),he=P.attrValue,f&&(pt==="id"||pt==="name")&&(et(ae,c),he=T+he),N&&ye(/((--!?|])>)|<\/(style|title|textarea)/i,he)){et(ae,c);continue}if(pt==="attributename"&&Ts(he,"href")){et(ae,c);continue}if(P.forceKeepAttr)continue;if(!P.keepAttr){et(ae,c);continue}if(!Ee&&ye(/\/>/i,he)){et(ae,c);continue}_e&&Xt([j,z,H],on=>{he=Rt(he,on," ")});let rn=de(c.nodeName);if(!tn(rn,pt,he)){et(ae,c);continue}if(x&&typeof v=="object"&&typeof v.getAttributeType=="function"&&!xe)switch(v.getAttributeType(rn,pt)){case"TrustedHTML":{he=x.createHTML(he);break}case"TrustedScriptURL":{he=x.createScriptURL(he);break}}if(he!==fs)try{xe?c.setAttributeNS(xe,ae,he):c.setAttribute(ae,he),ps(c)?Ne(c):Dn(e.removed)}catch{et(ae,c)}}Be(O.afterSanitizeAttributes,c,null)},Rr=function F(c){let C=null,P=Qs(c);for(Be(O.beforeSanitizeShadowDOM,c,null);C=P.nextNode();)Be(O.uponSanitizeShadowNode,C,null),en(C),nn(C),C.content instanceof i&&F(C.content);Be(O.afterSanitizeShadowDOM,c,null)};return e.sanitize=function(F){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},C=null,P=null,ne=null,me=null;if(We=!F,We&&(F="<!-->"),typeof F!="string"&&!Js(F))if(typeof F.toString=="function"){if(F=F.toString(),typeof F!="string")throw It("dirty is not a string, aborting")}else throw It("toString is not a function");if(!e.isSupported)return F;if(je||us(c),e.removed=[],typeof F=="string"&&(D=!1),D){if(F.nodeName){let Ue=de(F.nodeName);if(!U[Ue]||Me[Ue])throw It("root node is forbidden and cannot be sanitized in-place")}}else if(F instanceof l)C=Xs("<!---->"),P=C.ownerDocument.importNode(F,!0),P.nodeType===Lt.element&&P.nodeName==="BODY"||P.nodeName==="HTML"?C=P:C.appendChild(P);else{if(!Ce&&!_e&&!be&&F.indexOf("<")===-1)return x&&$?x.createHTML(F):F;if(C=Xs(F),!C)return Ce?null:$?L:""}C&&Fe&&Ne(C.firstChild);let ae=Qs(D?F:C);for(;ne=ae.nextNode();)en(ne),nn(ne),ne.content instanceof i&&Rr(ne.content);if(D)return F;if(Ce){if(ze)for(me=y.call(C.ownerDocument);C.firstChild;)me.appendChild(C.firstChild);else me=C;return(re.shadowroot||re.shadowrootmode)&&(me=M.call(r,me,!0)),me}let xe=be?C.outerHTML:C.innerHTML;return be&&U["!doctype"]&&C.ownerDocument&&C.ownerDocument.doctype&&C.ownerDocument.doctype.name&&ye(Un,C.ownerDocument.doctype.name)&&(xe="<!DOCTYPE "+C.ownerDocument.doctype.name+`>
`+xe),_e&&Xt([j,z,H],Ue=>{xe=Rt(xe,Ue," ")}),x&&$?x.createHTML(xe):xe},e.setConfig=function(){let F=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};us(F),je=!0},e.clearConfig=function(){ut=null,je=!1},e.isValidAttribute=function(F,c,C){ut||us({});let P=de(F),ne=de(c);return tn(P,ne,C)},e.addHook=function(F,c){typeof c=="function"&&Ct(O[F],c)},e.removeHook=function(F,c){if(c!==void 0){let C=ii(O[F],c);return C===-1?void 0:oi(O[F],C,1)[0]}return Dn(O[F])},e.removeHooks=function(F){O[F]=[]},e.removeAllHooks=function(){O=Fn()},e}var qn=Hn();var jn={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Gn=s=>(...e)=>({_$litDirective$:s,values:e}),es=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,r){this._$Ct=e,this._$AM=t,this._$Ci=r}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var Mt=class extends es{constructor(e){if(super(e),this.it=oe,e.type!==jn.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===oe||e==null)return this._t=void 0,this.it=e;if(e===rt)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;let t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};Mt.directiveName="unsafeHTML",Mt.resultType=1;var Wn=Gn(Mt);function Fs(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var lt=Fs();function Jn(s){lt=s}var Ft={exec:()=>null};function Z(s,e=""){let t=typeof s=="string"?s:s.source,r={replace:(n,i)=>{let o=typeof i=="string"?i:i.source;return o=o.replace(ke.caret,"$1"),t=t.replace(n,o),r},getRegex:()=>new RegExp(t,e)};return r}var xi=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),ke={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:s=>new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}#`),htmlBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}<(?:[a-z].*>|!--)`,"i")},Ai=/^(?:[ \t]*(?:\n|$))+/,Si=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,$i=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,zt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Ti=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,zs=/(?:[*+-]|\d{1,9}[.)])/,er=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,tr=Z(er).replace(/bull/g,zs).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Ei=Z(er).replace(/bull/g,zs).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Bs=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Ci=/^[^\n]+/,Us=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Ri=Z(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Us).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Ii=Z(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,zs).getRegex(),os="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Hs=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Di=Z("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Hs).replace("tag",os).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),sr=Z(Bs).replace("hr",zt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",os).getRegex(),Li=Z(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",sr).getRegex(),qs={blockquote:Li,code:Si,def:Ri,fences:$i,heading:Ti,hr:zt,html:Di,lheading:tr,list:Ii,newline:Ai,paragraph:sr,table:Ft,text:Ci},Vn=Z("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",zt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",os).getRegex(),Mi={...qs,lheading:Ei,table:Vn,paragraph:Z(Bs).replace("hr",zt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Vn).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",os).getRegex()},Ni={...qs,html:Z(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Hs).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Ft,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Z(Bs).replace("hr",zt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",tr).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Oi=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Pi=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,nr=/^( {2,}|\\)\n(?!\s*$)/,Fi=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,as=/[\p{P}\p{S}]/u,js=/[\s\p{P}\p{S}]/u,rr=/[^\s\p{P}\p{S}]/u,zi=Z(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,js).getRegex(),ir=/(?!~)[\p{P}\p{S}]/u,Bi=/(?!~)[\s\p{P}\p{S}]/u,Ui=/(?:[^\s\p{P}\p{S}]|~)/u,Hi=Z(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",xi?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),or=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,qi=Z(or,"u").replace(/punct/g,as).getRegex(),ji=Z(or,"u").replace(/punct/g,ir).getRegex(),ar="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Gi=Z(ar,"gu").replace(/notPunctSpace/g,rr).replace(/punctSpace/g,js).replace(/punct/g,as).getRegex(),Wi=Z(ar,"gu").replace(/notPunctSpace/g,Ui).replace(/punctSpace/g,Bi).replace(/punct/g,ir).getRegex(),Vi=Z("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,rr).replace(/punctSpace/g,js).replace(/punct/g,as).getRegex(),Zi=Z(/\\(punct)/,"gu").replace(/punct/g,as).getRegex(),Ki=Z(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Yi=Z(Hs).replace("(?:-->|$)","-->").getRegex(),Xi=Z("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Yi).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),ns=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Qi=Z(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",ns).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),lr=Z(/^!?\[(label)\]\[(ref)\]/).replace("label",ns).replace("ref",Us).getRegex(),cr=Z(/^!?\[(ref)\](?:\[\])?/).replace("ref",Us).getRegex(),Ji=Z("reflink|nolink(?!\\()","g").replace("reflink",lr).replace("nolink",cr).getRegex(),Zn=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Gs={_backpedal:Ft,anyPunctuation:Zi,autolink:Ki,blockSkip:Hi,br:nr,code:Pi,del:Ft,emStrongLDelim:qi,emStrongRDelimAst:Gi,emStrongRDelimUnd:Vi,escape:Oi,link:Qi,nolink:cr,punctuation:zi,reflink:lr,reflinkSearch:Ji,tag:Xi,text:Fi,url:Ft},eo={...Gs,link:Z(/^!?\[(label)\]\((.*?)\)/).replace("label",ns).getRegex(),reflink:Z(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",ns).getRegex()},Ns={...Gs,emStrongRDelimAst:Wi,emStrongLDelim:ji,url:Z(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Zn).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:Z(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Zn).getRegex()},to={...Ns,br:Z(nr).replace("{2,}","*").getRegex(),text:Z(Ns.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},ts={normal:qs,gfm:Mi,pedantic:Ni},Nt={normal:Gs,gfm:Ns,breaks:to,pedantic:eo},so={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Kn=s=>so[s];function He(s,e){if(e){if(ke.escapeTest.test(s))return s.replace(ke.escapeReplace,Kn)}else if(ke.escapeTestNoEncode.test(s))return s.replace(ke.escapeReplaceNoEncode,Kn);return s}function Yn(s){try{s=encodeURI(s).replace(ke.percentDecode,"%")}catch{return null}return s}function Xn(s,e){let t=s.replace(ke.findPipe,(i,o,l)=>{let a=!1,d=o;for(;--d>=0&&l[d]==="\\";)a=!a;return a?"|":" |"}),r=t.split(ke.splitPipe),n=0;if(r[0].trim()||r.shift(),r.length>0&&!r.at(-1)?.trim()&&r.pop(),e)if(r.length>e)r.splice(e);else for(;r.length<e;)r.push("");for(;n<r.length;n++)r[n]=r[n].trim().replace(ke.slashPipe,"|");return r}function Ot(s,e,t){let r=s.length;if(r===0)return"";let n=0;for(;n<r;){let i=s.charAt(r-n-1);if(i===e&&!t)n++;else if(i!==e&&t)n++;else break}return s.slice(0,r-n)}function no(s,e){if(s.indexOf(e[1])===-1)return-1;let t=0;for(let r=0;r<s.length;r++)if(s[r]==="\\")r++;else if(s[r]===e[0])t++;else if(s[r]===e[1]&&(t--,t<0))return r;return t>0?-2:-1}function Qn(s,e,t,r,n){let i=e.href,o=e.title||null,l=s[1].replace(n.other.outputLinkReplace,"$1");r.state.inLink=!0;let a={type:s[0].charAt(0)==="!"?"image":"link",raw:t,href:i,title:o,text:l,tokens:r.inlineTokens(l)};return r.state.inLink=!1,a}function ro(s,e,t){let r=s.match(t.other.indentCodeCompensation);if(r===null)return e;let n=r[1];return e.split(`
`).map(i=>{let o=i.match(t.other.beginningSpace);if(o===null)return i;let[l]=o;return l.length>=n.length?i.slice(n.length):i}).join(`
`)}var rs=class{constructor(s){Q(this,"options");Q(this,"rules");Q(this,"lexer");this.options=s||lt}space(s){let e=this.rules.block.newline.exec(s);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(s){let e=this.rules.block.code.exec(s);if(e){let t=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?t:Ot(t,`
`)}}}fences(s){let e=this.rules.block.fences.exec(s);if(e){let t=e[0],r=ro(t,e[3]||"",this.rules);return{type:"code",raw:t,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:r}}}heading(s){let e=this.rules.block.heading.exec(s);if(e){let t=e[2].trim();if(this.rules.other.endingHash.test(t)){let r=Ot(t,"#");(this.options.pedantic||!r||this.rules.other.endingSpaceChar.test(r))&&(t=r.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:t,tokens:this.lexer.inline(t)}}}hr(s){let e=this.rules.block.hr.exec(s);if(e)return{type:"hr",raw:Ot(e[0],`
`)}}blockquote(s){let e=this.rules.block.blockquote.exec(s);if(e){let t=Ot(e[0],`
`).split(`
`),r="",n="",i=[];for(;t.length>0;){let o=!1,l=[],a;for(a=0;a<t.length;a++)if(this.rules.other.blockquoteStart.test(t[a]))l.push(t[a]),o=!0;else if(!o)l.push(t[a]);else break;t=t.slice(a);let d=l.join(`
`),u=d.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");r=r?`${r}
${d}`:d,n=n?`${n}
${u}`:u;let p=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(u,i,!0),this.lexer.state.top=p,t.length===0)break;let h=i.at(-1);if(h?.type==="code")break;if(h?.type==="blockquote"){let v=h,k=v.raw+`
`+t.join(`
`),_=this.blockquote(k);i[i.length-1]=_,r=r.substring(0,r.length-v.raw.length)+_.raw,n=n.substring(0,n.length-v.text.length)+_.text;break}else if(h?.type==="list"){let v=h,k=v.raw+`
`+t.join(`
`),_=this.list(k);i[i.length-1]=_,r=r.substring(0,r.length-h.raw.length)+_.raw,n=n.substring(0,n.length-v.raw.length)+_.raw,t=k.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:r,tokens:i,text:n}}}list(s){let e=this.rules.block.list.exec(s);if(e){let t=e[1].trim(),r=t.length>1,n={type:"list",raw:"",ordered:r,start:r?+t.slice(0,-1):"",loose:!1,items:[]};t=r?`\\d{1,9}\\${t.slice(-1)}`:`\\${t}`,this.options.pedantic&&(t=r?t:"[*+-]");let i=this.rules.other.listItemRegex(t),o=!1;for(;s;){let a=!1,d="",u="";if(!(e=i.exec(s))||this.rules.block.hr.test(s))break;d=e[0],s=s.substring(d.length);let p=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,_=>" ".repeat(3*_.length)),h=s.split(`
`,1)[0],v=!p.trim(),k=0;if(this.options.pedantic?(k=2,u=p.trimStart()):v?k=e[1].length+1:(k=e[2].search(this.rules.other.nonSpaceChar),k=k>4?1:k,u=p.slice(k),k+=e[1].length),v&&this.rules.other.blankLine.test(h)&&(d+=h+`
`,s=s.substring(h.length+1),a=!0),!a){let _=this.rules.other.nextBulletRegex(k),R=this.rules.other.hrRegex(k),m=this.rules.other.fencesBeginRegex(k),E=this.rules.other.headingBeginRegex(k),S=this.rules.other.htmlBeginRegex(k);for(;s;){let x=s.split(`
`,1)[0],L;if(h=x,this.options.pedantic?(h=h.replace(this.rules.other.listReplaceNesting,"  "),L=h):L=h.replace(this.rules.other.tabCharGlobal,"    "),m.test(h)||E.test(h)||S.test(h)||_.test(h)||R.test(h))break;if(L.search(this.rules.other.nonSpaceChar)>=k||!h.trim())u+=`
`+L.slice(k);else{if(v||p.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||m.test(p)||E.test(p)||R.test(p))break;u+=`
`+h}!v&&!h.trim()&&(v=!0),d+=x+`
`,s=s.substring(x.length+1),p=L.slice(k)}}n.loose||(o?n.loose=!0:this.rules.other.doubleBlankLine.test(d)&&(o=!0)),n.items.push({type:"list_item",raw:d,task:!!this.options.gfm&&this.rules.other.listIsTask.test(u),loose:!1,text:u,tokens:[]}),n.raw+=d}let l=n.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;n.raw=n.raw.trimEnd();for(let a of n.items){if(this.lexer.state.top=!1,a.tokens=this.lexer.blockTokens(a.text,[]),a.task){if(a.text=a.text.replace(this.rules.other.listReplaceTask,""),a.tokens[0]?.type==="text"||a.tokens[0]?.type==="paragraph"){a.tokens[0].raw=a.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),a.tokens[0].text=a.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let u=this.lexer.inlineQueue.length-1;u>=0;u--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[u].src)){this.lexer.inlineQueue[u].src=this.lexer.inlineQueue[u].src.replace(this.rules.other.listReplaceTask,"");break}}let d=this.rules.other.listTaskCheckbox.exec(a.raw);if(d){let u={type:"checkbox",raw:d[0]+" ",checked:d[0]!=="[ ]"};a.checked=u.checked,n.loose?a.tokens[0]&&["paragraph","text"].includes(a.tokens[0].type)&&"tokens"in a.tokens[0]&&a.tokens[0].tokens?(a.tokens[0].raw=u.raw+a.tokens[0].raw,a.tokens[0].text=u.raw+a.tokens[0].text,a.tokens[0].tokens.unshift(u)):a.tokens.unshift({type:"paragraph",raw:u.raw,text:u.raw,tokens:[u]}):a.tokens.unshift(u)}}if(!n.loose){let d=a.tokens.filter(p=>p.type==="space"),u=d.length>0&&d.some(p=>this.rules.other.anyLine.test(p.raw));n.loose=u}}if(n.loose)for(let a of n.items){a.loose=!0;for(let d of a.tokens)d.type==="text"&&(d.type="paragraph")}return n}}html(s){let e=this.rules.block.html.exec(s);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(s){let e=this.rules.block.def.exec(s);if(e){let t=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),r=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:t,raw:e[0],href:r,title:n}}}table(s){let e=this.rules.block.table.exec(s);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let t=Xn(e[1]),r=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),n=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(t.length===r.length){for(let o of r)this.rules.other.tableAlignRight.test(o)?i.align.push("right"):this.rules.other.tableAlignCenter.test(o)?i.align.push("center"):this.rules.other.tableAlignLeft.test(o)?i.align.push("left"):i.align.push(null);for(let o=0;o<t.length;o++)i.header.push({text:t[o],tokens:this.lexer.inline(t[o]),header:!0,align:i.align[o]});for(let o of n)i.rows.push(Xn(o,i.header.length).map((l,a)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:i.align[a]})));return i}}lheading(s){let e=this.rules.block.lheading.exec(s);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(s){let e=this.rules.block.paragraph.exec(s);if(e){let t=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:t,tokens:this.lexer.inline(t)}}}text(s){let e=this.rules.block.text.exec(s);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(s){let e=this.rules.inline.escape.exec(s);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(s){let e=this.rules.inline.tag.exec(s);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(s){let e=this.rules.inline.link.exec(s);if(e){let t=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(t)){if(!this.rules.other.endAngleBracket.test(t))return;let i=Ot(t.slice(0,-1),"\\");if((t.length-i.length)%2===0)return}else{let i=no(e[2],"()");if(i===-2)return;if(i>-1){let o=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,o).trim(),e[3]=""}}let r=e[2],n="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(r);i&&(r=i[1],n=i[3])}else n=e[3]?e[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(t)?r=r.slice(1):r=r.slice(1,-1)),Qn(e,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:n&&n.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(s,e){let t;if((t=this.rules.inline.reflink.exec(s))||(t=this.rules.inline.nolink.exec(s))){let r=(t[2]||t[1]).replace(this.rules.other.multipleSpaceGlobal," "),n=e[r.toLowerCase()];if(!n){let i=t[0].charAt(0);return{type:"text",raw:i,text:i}}return Qn(t,n,t[0],this.lexer,this.rules)}}emStrong(s,e,t=""){let r=this.rules.inline.emStrongLDelim.exec(s);if(!(!r||r[3]&&t.match(this.rules.other.unicodeAlphaNumeric))&&(!(r[1]||r[2])||!t||this.rules.inline.punctuation.exec(t))){let n=[...r[0]].length-1,i,o,l=n,a=0,d=r[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(d.lastIndex=0,e=e.slice(-1*s.length+n);(r=d.exec(e))!=null;){if(i=r[1]||r[2]||r[3]||r[4]||r[5]||r[6],!i)continue;if(o=[...i].length,r[3]||r[4]){l+=o;continue}else if((r[5]||r[6])&&n%3&&!((n+o)%3)){a+=o;continue}if(l-=o,l>0)continue;o=Math.min(o,o+l+a);let u=[...r[0]][0].length,p=s.slice(0,n+r.index+u+o);if(Math.min(n,o)%2){let v=p.slice(1,-1);return{type:"em",raw:p,text:v,tokens:this.lexer.inlineTokens(v)}}let h=p.slice(2,-2);return{type:"strong",raw:p,text:h,tokens:this.lexer.inlineTokens(h)}}}}codespan(s){let e=this.rules.inline.code.exec(s);if(e){let t=e[2].replace(this.rules.other.newLineCharGlobal," "),r=this.rules.other.nonSpaceChar.test(t),n=this.rules.other.startingSpaceChar.test(t)&&this.rules.other.endingSpaceChar.test(t);return r&&n&&(t=t.substring(1,t.length-1)),{type:"codespan",raw:e[0],text:t}}}br(s){let e=this.rules.inline.br.exec(s);if(e)return{type:"br",raw:e[0]}}del(s){let e=this.rules.inline.del.exec(s);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(s){let e=this.rules.inline.autolink.exec(s);if(e){let t,r;return e[2]==="@"?(t=e[1],r="mailto:"+t):(t=e[1],r=t),{type:"link",raw:e[0],text:t,href:r,tokens:[{type:"text",raw:t,text:t}]}}}url(s){let e;if(e=this.rules.inline.url.exec(s)){let t,r;if(e[2]==="@")t=e[0],r="mailto:"+t;else{let n;do n=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(n!==e[0]);t=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:t,href:r,tokens:[{type:"text",raw:t,text:t}]}}}inlineText(s){let e=this.rules.inline.text.exec(s);if(e){let t=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:t}}}},De=class Os{constructor(e){Q(this,"tokens");Q(this,"options");Q(this,"state");Q(this,"inlineQueue");Q(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||lt,this.options.tokenizer=this.options.tokenizer||new rs,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={other:ke,block:ts.normal,inline:Nt.normal};this.options.pedantic?(t.block=ts.pedantic,t.inline=Nt.pedantic):this.options.gfm&&(t.block=ts.gfm,this.options.breaks?t.inline=Nt.breaks:t.inline=Nt.gfm),this.tokenizer.rules=t}static get rules(){return{block:ts,inline:Nt}}static lex(e,t){return new Os(t).lex(e)}static lexInline(e,t){return new Os(t).inlineTokens(e)}lex(e){e=e.replace(ke.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){let r=this.inlineQueue[t];this.inlineTokens(r.src,r.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],r=!1){for(this.options.pedantic&&(e=e.replace(ke.tabCharGlobal,"    ").replace(ke.spaceLine,""));e;){let n;if(this.options.extensions?.block?.some(o=>(n=o.call({lexer:this},e,t))?(e=e.substring(n.raw.length),t.push(n),!0):!1))continue;if(n=this.tokenizer.space(e)){e=e.substring(n.raw.length);let o=t.at(-1);n.raw.length===1&&o!==void 0?o.raw+=`
`:t.push(n);continue}if(n=this.tokenizer.code(e)){e=e.substring(n.raw.length);let o=t.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+n.raw,o.text+=`
`+n.text,this.inlineQueue.at(-1).src=o.text):t.push(n);continue}if(n=this.tokenizer.fences(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.heading(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.hr(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.blockquote(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.list(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.html(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.def(e)){e=e.substring(n.raw.length);let o=t.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+n.raw,o.text+=`
`+n.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[n.tag]||(this.tokens.links[n.tag]={href:n.href,title:n.title},t.push(n));continue}if(n=this.tokenizer.table(e)){e=e.substring(n.raw.length),t.push(n);continue}if(n=this.tokenizer.lheading(e)){e=e.substring(n.raw.length),t.push(n);continue}let i=e;if(this.options.extensions?.startBlock){let o=1/0,l=e.slice(1),a;this.options.extensions.startBlock.forEach(d=>{a=d.call({lexer:this},l),typeof a=="number"&&a>=0&&(o=Math.min(o,a))}),o<1/0&&o>=0&&(i=e.substring(0,o+1))}if(this.state.top&&(n=this.tokenizer.paragraph(i))){let o=t.at(-1);r&&o?.type==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+n.raw,o.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):t.push(n),r=i.length!==e.length,e=e.substring(n.raw.length);continue}if(n=this.tokenizer.text(e)){e=e.substring(n.raw.length);let o=t.at(-1);o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+n.raw,o.text+=`
`+n.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):t.push(n);continue}if(e){let o="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(o);break}else throw new Error(o)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let r=e,n=null;if(this.tokens.links){let a=Object.keys(this.tokens.links);if(a.length>0)for(;(n=this.tokenizer.rules.inline.reflinkSearch.exec(r))!=null;)a.includes(n[0].slice(n[0].lastIndexOf("[")+1,-1))&&(r=r.slice(0,n.index)+"["+"a".repeat(n[0].length-2)+"]"+r.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(n=this.tokenizer.rules.inline.anyPunctuation.exec(r))!=null;)r=r.slice(0,n.index)+"++"+r.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(n=this.tokenizer.rules.inline.blockSkip.exec(r))!=null;)i=n[2]?n[2].length:0,r=r.slice(0,n.index+i)+"["+"a".repeat(n[0].length-i-2)+"]"+r.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);r=this.options.hooks?.emStrongMask?.call({lexer:this},r)??r;let o=!1,l="";for(;e;){o||(l=""),o=!1;let a;if(this.options.extensions?.inline?.some(u=>(a=u.call({lexer:this},e,t))?(e=e.substring(a.raw.length),t.push(a),!0):!1))continue;if(a=this.tokenizer.escape(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.tag(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.link(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(a.raw.length);let u=t.at(-1);a.type==="text"&&u?.type==="text"?(u.raw+=a.raw,u.text+=a.text):t.push(a);continue}if(a=this.tokenizer.emStrong(e,r,l)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.codespan(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.br(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.del(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.autolink(e)){e=e.substring(a.raw.length),t.push(a);continue}if(!this.state.inLink&&(a=this.tokenizer.url(e))){e=e.substring(a.raw.length),t.push(a);continue}let d=e;if(this.options.extensions?.startInline){let u=1/0,p=e.slice(1),h;this.options.extensions.startInline.forEach(v=>{h=v.call({lexer:this},p),typeof h=="number"&&h>=0&&(u=Math.min(u,h))}),u<1/0&&u>=0&&(d=e.substring(0,u+1))}if(a=this.tokenizer.inlineText(d)){e=e.substring(a.raw.length),a.raw.slice(-1)!=="_"&&(l=a.raw.slice(-1)),o=!0;let u=t.at(-1);u?.type==="text"?(u.raw+=a.raw,u.text+=a.text):t.push(a);continue}if(e){let u="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(u);break}else throw new Error(u)}}return t}},is=class{constructor(s){Q(this,"options");Q(this,"parser");this.options=s||lt}space(s){return""}code({text:s,lang:e,escaped:t}){let r=(e||"").match(ke.notSpaceStart)?.[0],n=s.replace(ke.endingNewline,"")+`
`;return r?'<pre><code class="language-'+He(r)+'">'+(t?n:He(n,!0))+`</code></pre>
`:"<pre><code>"+(t?n:He(n,!0))+`</code></pre>
`}blockquote({tokens:s}){return`<blockquote>
${this.parser.parse(s)}</blockquote>
`}html({text:s}){return s}def(s){return""}heading({tokens:s,depth:e}){return`<h${e}>${this.parser.parseInline(s)}</h${e}>
`}hr(s){return`<hr>
`}list(s){let e=s.ordered,t=s.start,r="";for(let o=0;o<s.items.length;o++){let l=s.items[o];r+=this.listitem(l)}let n=e?"ol":"ul",i=e&&t!==1?' start="'+t+'"':"";return"<"+n+i+`>
`+r+"</"+n+`>
`}listitem(s){return`<li>${this.parser.parse(s.tokens)}</li>
`}checkbox({checked:s}){return"<input "+(s?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:s}){return`<p>${this.parser.parseInline(s)}</p>
`}table(s){let e="",t="";for(let n=0;n<s.header.length;n++)t+=this.tablecell(s.header[n]);e+=this.tablerow({text:t});let r="";for(let n=0;n<s.rows.length;n++){let i=s.rows[n];t="";for(let o=0;o<i.length;o++)t+=this.tablecell(i[o]);r+=this.tablerow({text:t})}return r&&(r=`<tbody>${r}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+r+`</table>
`}tablerow({text:s}){return`<tr>
${s}</tr>
`}tablecell(s){let e=this.parser.parseInline(s.tokens),t=s.header?"th":"td";return(s.align?`<${t} align="${s.align}">`:`<${t}>`)+e+`</${t}>
`}strong({tokens:s}){return`<strong>${this.parser.parseInline(s)}</strong>`}em({tokens:s}){return`<em>${this.parser.parseInline(s)}</em>`}codespan({text:s}){return`<code>${He(s,!0)}</code>`}br(s){return"<br>"}del({tokens:s}){return`<del>${this.parser.parseInline(s)}</del>`}link({href:s,title:e,tokens:t}){let r=this.parser.parseInline(t),n=Yn(s);if(n===null)return r;s=n;let i='<a href="'+s+'"';return e&&(i+=' title="'+He(e)+'"'),i+=">"+r+"</a>",i}image({href:s,title:e,text:t,tokens:r}){r&&(t=this.parser.parseInline(r,this.parser.textRenderer));let n=Yn(s);if(n===null)return He(t);s=n;let i=`<img src="${s}" alt="${t}"`;return e&&(i+=` title="${He(e)}"`),i+=">",i}text(s){return"tokens"in s&&s.tokens?this.parser.parseInline(s.tokens):"escaped"in s&&s.escaped?s.text:He(s.text)}},Ws=class{strong({text:s}){return s}em({text:s}){return s}codespan({text:s}){return s}del({text:s}){return s}html({text:s}){return s}text({text:s}){return s}link({text:s}){return""+s}image({text:s}){return""+s}br(){return""}checkbox({raw:s}){return s}},Le=class Ps{constructor(e){Q(this,"options");Q(this,"renderer");Q(this,"textRenderer");this.options=e||lt,this.options.renderer=this.options.renderer||new is,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Ws}static parse(e,t){return new Ps(t).parse(e)}static parseInline(e,t){return new Ps(t).parseInline(e)}parse(e){let t="";for(let r=0;r<e.length;r++){let n=e[r];if(this.options.extensions?.renderers?.[n.type]){let o=n,l=this.options.extensions.renderers[o.type].call({parser:this},o);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(o.type)){t+=l||"";continue}}let i=n;switch(i.type){case"space":{t+=this.renderer.space(i);break}case"hr":{t+=this.renderer.hr(i);break}case"heading":{t+=this.renderer.heading(i);break}case"code":{t+=this.renderer.code(i);break}case"table":{t+=this.renderer.table(i);break}case"blockquote":{t+=this.renderer.blockquote(i);break}case"list":{t+=this.renderer.list(i);break}case"checkbox":{t+=this.renderer.checkbox(i);break}case"html":{t+=this.renderer.html(i);break}case"def":{t+=this.renderer.def(i);break}case"paragraph":{t+=this.renderer.paragraph(i);break}case"text":{t+=this.renderer.text(i);break}default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return t}parseInline(e,t=this.renderer){let r="";for(let n=0;n<e.length;n++){let i=e[n];if(this.options.extensions?.renderers?.[i.type]){let l=this.options.extensions.renderers[i.type].call({parser:this},i);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){r+=l||"";continue}}let o=i;switch(o.type){case"escape":{r+=t.text(o);break}case"html":{r+=t.html(o);break}case"link":{r+=t.link(o);break}case"image":{r+=t.image(o);break}case"checkbox":{r+=t.checkbox(o);break}case"strong":{r+=t.strong(o);break}case"em":{r+=t.em(o);break}case"codespan":{r+=t.codespan(o);break}case"br":{r+=t.br(o);break}case"del":{r+=t.del(o);break}case"text":{r+=t.text(o);break}default:{let l='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return r}},ss,Pt=(ss=class{constructor(s){Q(this,"options");Q(this,"block");this.options=s||lt}preprocess(s){return s}postprocess(s){return s}processAllTokens(s){return s}emStrongMask(s){return s}provideLexer(){return this.block?De.lex:De.lexInline}provideParser(){return this.block?Le.parse:Le.parseInline}},Q(ss,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),Q(ss,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),ss),io=class{constructor(...s){Q(this,"defaults",Fs());Q(this,"options",this.setOptions);Q(this,"parse",this.parseMarkdown(!0));Q(this,"parseInline",this.parseMarkdown(!1));Q(this,"Parser",Le);Q(this,"Renderer",is);Q(this,"TextRenderer",Ws);Q(this,"Lexer",De);Q(this,"Tokenizer",rs);Q(this,"Hooks",Pt);this.use(...s)}walkTokens(s,e){let t=[];for(let r of s)switch(t=t.concat(e.call(this,r)),r.type){case"table":{let n=r;for(let i of n.header)t=t.concat(this.walkTokens(i.tokens,e));for(let i of n.rows)for(let o of i)t=t.concat(this.walkTokens(o.tokens,e));break}case"list":{let n=r;t=t.concat(this.walkTokens(n.items,e));break}default:{let n=r;this.defaults.extensions?.childTokens?.[n.type]?this.defaults.extensions.childTokens[n.type].forEach(i=>{let o=n[i].flat(1/0);t=t.concat(this.walkTokens(o,e))}):n.tokens&&(t=t.concat(this.walkTokens(n.tokens,e)))}}return t}use(...s){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return s.forEach(t=>{let r={...t};if(r.async=this.defaults.async||r.async||!1,t.extensions&&(t.extensions.forEach(n=>{if(!n.name)throw new Error("extension name required");if("renderer"in n){let i=e.renderers[n.name];i?e.renderers[n.name]=function(...o){let l=n.renderer.apply(this,o);return l===!1&&(l=i.apply(this,o)),l}:e.renderers[n.name]=n.renderer}if("tokenizer"in n){if(!n.level||n.level!=="block"&&n.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[n.level];i?i.unshift(n.tokenizer):e[n.level]=[n.tokenizer],n.start&&(n.level==="block"?e.startBlock?e.startBlock.push(n.start):e.startBlock=[n.start]:n.level==="inline"&&(e.startInline?e.startInline.push(n.start):e.startInline=[n.start]))}"childTokens"in n&&n.childTokens&&(e.childTokens[n.name]=n.childTokens)}),r.extensions=e),t.renderer){let n=this.defaults.renderer||new is(this.defaults);for(let i in t.renderer){if(!(i in n))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let o=i,l=t.renderer[o],a=n[o];n[o]=(...d)=>{let u=l.apply(n,d);return u===!1&&(u=a.apply(n,d)),u||""}}r.renderer=n}if(t.tokenizer){let n=this.defaults.tokenizer||new rs(this.defaults);for(let i in t.tokenizer){if(!(i in n))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let o=i,l=t.tokenizer[o],a=n[o];n[o]=(...d)=>{let u=l.apply(n,d);return u===!1&&(u=a.apply(n,d)),u}}r.tokenizer=n}if(t.hooks){let n=this.defaults.hooks||new Pt;for(let i in t.hooks){if(!(i in n))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let o=i,l=t.hooks[o],a=n[o];Pt.passThroughHooks.has(i)?n[o]=d=>{if(this.defaults.async&&Pt.passThroughHooksRespectAsync.has(i))return(async()=>{let p=await l.call(n,d);return a.call(n,p)})();let u=l.call(n,d);return a.call(n,u)}:n[o]=(...d)=>{if(this.defaults.async)return(async()=>{let p=await l.apply(n,d);return p===!1&&(p=await a.apply(n,d)),p})();let u=l.apply(n,d);return u===!1&&(u=a.apply(n,d)),u}}r.hooks=n}if(t.walkTokens){let n=this.defaults.walkTokens,i=t.walkTokens;r.walkTokens=function(o){let l=[];return l.push(i.call(this,o)),n&&(l=l.concat(n.call(this,o))),l}}this.defaults={...this.defaults,...r}}),this}setOptions(s){return this.defaults={...this.defaults,...s},this}lexer(s,e){return De.lex(s,e??this.defaults)}parser(s,e){return Le.parse(s,e??this.defaults)}parseMarkdown(s){return(e,t)=>{let r={...t},n={...this.defaults,...r},i=this.onError(!!n.silent,!!n.async);if(this.defaults.async===!0&&r.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(n.hooks&&(n.hooks.options=n,n.hooks.block=s),n.async)return(async()=>{let o=n.hooks?await n.hooks.preprocess(e):e,l=await(n.hooks?await n.hooks.provideLexer():s?De.lex:De.lexInline)(o,n),a=n.hooks?await n.hooks.processAllTokens(l):l;n.walkTokens&&await Promise.all(this.walkTokens(a,n.walkTokens));let d=await(n.hooks?await n.hooks.provideParser():s?Le.parse:Le.parseInline)(a,n);return n.hooks?await n.hooks.postprocess(d):d})().catch(i);try{n.hooks&&(e=n.hooks.preprocess(e));let o=(n.hooks?n.hooks.provideLexer():s?De.lex:De.lexInline)(e,n);n.hooks&&(o=n.hooks.processAllTokens(o)),n.walkTokens&&this.walkTokens(o,n.walkTokens);let l=(n.hooks?n.hooks.provideParser():s?Le.parse:Le.parseInline)(o,n);return n.hooks&&(l=n.hooks.postprocess(l)),l}catch(o){return i(o)}}}onError(s,e){return t=>{if(t.message+=`
Please report this to https://github.com/markedjs/marked.`,s){let r="<p>An error occurred:</p><pre>"+He(t.message+"",!0)+"</pre>";return e?Promise.resolve(r):r}if(e)return Promise.reject(t);throw t}}},at=new io;function Y(s,e){return at.parse(s,e)}Y.options=Y.setOptions=function(s){return at.setOptions(s),Y.defaults=at.defaults,Jn(Y.defaults),Y};Y.getDefaults=Fs;Y.defaults=lt;Y.use=function(...s){return at.use(...s),Y.defaults=at.defaults,Jn(Y.defaults),Y};Y.walkTokens=function(s,e){return at.walkTokens(s,e)};Y.parseInline=at.parseInline;Y.Parser=Le;Y.parser=Le.parse;Y.Renderer=is;Y.TextRenderer=Ws;Y.Lexer=De;Y.lexer=De.lex;Y.Tokenizer=rs;Y.Hooks=Pt;Y.parse=Y;var sa=Y.options,na=Y.setOptions,ra=Y.use,ia=Y.walkTokens,oa=Y.parseInline;var aa=Le.parse,la=De.lex;function Bt(s){let e=Y.parse(s),t=qn.sanitize(e);return Wn(t)}function Qe(s){switch((s||"").toString()){case"open":return"Open";case"in_progress":return"In progress";case"closed":return"Closed";default:return(s||"").toString()||"Open"}}function oo(s){window.location.hash=s}function dr(s,e,t=oo,r=void 0){let n=V("views:detail"),i=null,o=null,l=!1,a=!1,d=!1,u=!1,p=!1,h=!1,v=!1,k="";function _(f){let T=Ss(window.location.hash||"");return Ke(T,f)}function R(f){J(A`
        <div class="panel__body" id="detail-root">
          <p class="muted">${f}</p>
        </div>
      `,s)}function m(){if(!o||!r||typeof r.snapshotFor!="function")return;let f=r.snapshotFor(`detail:${o}`);Array.isArray(f)&&f.length>0&&(i=f.find(B=>String(B.id)===String(o))||f[0])}r&&typeof r.subscribe=="function"&&r.subscribe(()=>{try{m(),N()}catch(f){n("issue stores listener error %o",f)}});let E=()=>{a=!0,N()},S=f=>{f.key==="Enter"?(a=!0,N()):f.key==="Escape"&&(a=!1,N())},x=async()=>{if(!i||l)return;let f=s.querySelector("h2 input"),T=i.title||"",B=f?f.value:"";if(B===T){a=!1,N();return}l=!0,f&&(f.disabled=!0);try{n("save title %s \u2192 %s",String(i.id),B);let D=await e("edit-text",{id:i.id,field:"title",value:B});D&&typeof D=="object"&&(i=D,a=!1,N())}catch(D){n("save title failed %s %o",String(i.id),D),i.title=T,a=!1,N(),ge("Failed to save title","error")}finally{l=!1}},L=()=>{a=!1,N()},b=()=>{v=!0,N()},g=f=>{f.key==="Enter"?(f.preventDefault(),v=!0,N()):f.key==="Escape"&&(f.preventDefault(),v=!1,N())},y=async()=>{if(!i||l)return;let f=s.querySelector("#detail-root .prop.assignee input"),T=i?.assignee??"",B=f?.value??"";if(B===T){v=!1,N();return}l=!0,f&&(f.disabled=!0);try{n("save assignee %s \u2192 %s",String(i.id),B);let D=await e("update-assignee",{id:i.id,assignee:B});D&&typeof D=="object"&&(i=D,v=!1,N())}catch(D){n("save assignee failed %s %o",String(i.id),D),i.assignee=T,v=!1,N(),ge("Failed to update assignee","error")}finally{l=!1}},I=()=>{v=!1,N()},M=f=>{k=f.currentTarget.value||""};function O(f){f.key==="Enter"&&(f.preventDefault(),j())}async function j(){if(!i||l)return;let f=k.trim();if(f){l=!0;try{n("add label %s \u2192 %s",String(i.id),f);let T=await e("label-add",{id:i.id,label:f});T&&typeof T=="object"&&(i=T,k="",N())}catch(T){n("add label failed %s %o",String(i.id),T),ge("Failed to add label","error")}finally{l=!1}}}async function z(f){if(!(!i||l)){l=!0;try{n("remove label %s \u2192 %s",String(i?.id||""),f);let T=await e("label-remove",{id:i.id,label:f});T&&typeof T=="object"&&(i=T,N())}catch(T){n("remove label failed %s %o",String(i?.id||""),T),ge("Failed to remove label","error")}finally{l=!1}}}let H=async f=>{if(!i||l){N();return}let T=f.currentTarget,B=i.status||"open",D=T.value;if(D!==B){l=!0,i.status=D,N();try{n("update status %s \u2192 %s",String(i.id),D);let X=await e("update-status",{id:i.id,status:D});X&&typeof X=="object"&&(i=X,N())}catch(X){n("update status failed %s %o",String(i.id),X),i.status=B,N(),ge("Failed to update status","error")}finally{l=!1}}},K=async f=>{if(!i||l){N();return}let T=f.currentTarget,B=typeof i.priority=="number"?i.priority:2,D=Number(T.value);if(D!==B){l=!0,i.priority=D,N();try{n("update priority %s \u2192 %d",String(i.id),D);let X=await e("update-priority",{id:i.id,priority:D});X&&typeof X=="object"&&(i=X,N())}catch(X){n("update priority failed %s %o",String(i.id),X),i.priority=B,N(),ge("Failed to update priority","error")}finally{l=!1}}},W=()=>{d=!0,N()},le=f=>{if(f.key==="Escape")d=!1,N();else if(f.key==="Enter"&&f.ctrlKey){let T=s.querySelector("#detail-root .editable-actions button");T&&T.click()}},ue=async()=>{if(!i||l)return;let f=s.querySelector("#detail-root textarea"),T=i.description||"",B=f?f.value:"";if(B===T){d=!1,N();return}l=!0,f&&(f.disabled=!0);try{n("save description %s",String(i?.id||""));let D=await e("edit-text",{id:i.id,field:"description",value:B});D&&typeof D=="object"&&(i=D,d=!1,N())}catch(D){n("save description failed %s %o",String(i?.id||""),D),i.description=T,d=!1,N(),ge("Failed to save description","error")}finally{l=!1}},ce=()=>{d=!1,N()},se=()=>{u=!0,N();try{let f=s.querySelector("#detail-root .design textarea");f&&f.focus()}catch(f){n("focus design textarea failed %o",f)}},U=f=>{if(f.key==="Escape")u=!1,N();else if(f.key==="Enter"&&(f.ctrlKey||f.metaKey)){let T=s.querySelector("#detail-root .design .editable-actions button");T&&T.click()}},pe=async()=>{if(!i||l)return;let f=s.querySelector("#detail-root .design textarea"),T=i.design||"",B=f?f.value:"";if(B===T){u=!1,N();return}l=!0,f&&(f.disabled=!0);try{n("save design %s",String(i?.id||""));let D=await e("edit-text",{id:i.id,field:"design",value:B});D&&typeof D=="object"&&(i=D,u=!1,N())}catch(D){n("save design failed %s %o",String(i?.id||""),D),i.design=T,u=!1,N(),ge("Failed to save design","error")}finally{l=!1}},re=()=>{u=!1,N()},Je=()=>{p=!0,N()},ee=f=>{if(f.key==="Escape")p=!1,N();else if(f.key==="Enter"&&(f.ctrlKey||f.metaKey)){let T=s.querySelector("#detail-root .notes .editable-actions button");T&&T.click()}},Me=async()=>{if(!i||l)return;let f=s.querySelector("#detail-root .notes textarea"),T=i.notes||"",B=f?f.value:"";if(B===T){p=!1,N();return}l=!0,f&&(f.disabled=!0);try{n("save notes %s",String(i?.id||""));let D=await e("edit-text",{id:i.id,field:"notes",value:B});D&&typeof D=="object"&&(i=D,p=!1,N())}catch(D){n("save notes failed %s %o",String(i?.id||""),D),i.notes=T,p=!1,N(),ge("Failed to save notes","error")}finally{l=!1}},qe=()=>{p=!1,N()},Se=()=>{h=!0,N()},wt=f=>{if(f.key==="Escape")h=!1,N();else if(f.key==="Enter"&&(f.ctrlKey||f.metaKey)){let T=s.querySelector("#detail-root .acceptance .editable-actions button");T&&T.click()}},Te=async()=>{if(!i||l)return;let f=s.querySelector("#detail-root .acceptance textarea"),T=i.acceptance||"",B=f?f.value:"";if(B===T){h=!1,N();return}l=!0,f&&(f.disabled=!0);try{n("save acceptance %s",String(i?.id||""));let D=await e("edit-text",{id:i.id,field:"acceptance",value:B});D&&typeof D=="object"&&(i=D,h=!1,N())}catch(D){n("save acceptance failed %s %o",String(i?.id||""),D),i.acceptance=T,h=!1,N(),ge("Failed to save acceptance","error")}finally{l=!1}},Pe=()=>{h=!1,N()};function Ee(f,T){let B=f==="Dependencies"?"add-dependency":"add-dependent";return A`
      <div class="props-card">
        <div>
          <div class="props-card__title">${f}</div>
        </div>
        <ul>
          ${!T||T.length===0?null:T.map(D=>{let X=D.id,ie=_(X);return A`<li
                  data-href=${ie}
                  @click=${()=>t(ie)}
                >
                  ${ot(D.issue_type||"")}
                  <span class="text-truncate">${D.title||""}</span>
                  <button
                    aria-label=${`Remove dependency ${X}`}
                    @click=${be(X,f)}
                  >
                    ×
                  </button>
                </li>`})}
        </ul>
        <div class="props-card__footer">
          <input type="text" placeholder="Issue ID" data-testid=${B} />
          <button @click=${je(T,f)}>Add</button>
        </div>
      </div>
    `}function _e(f){let T=a?A`<div class="detail-title">
          <h2>
            <input
              type="text"
              aria-label="Edit title"
              .value=${f.title||""}
              @keydown=${Fe}
            />
            <button @click=${x}>Save</button>
            <button @click=${L}>Cancel</button>
          </h2>
        </div>`:A`<div class="detail-title">
          <h2>
            <span
              class="editable"
              tabindex="0"
              role="button"
              aria-label="Edit title"
              @click=${E}
              @keydown=${S}
              >${f.title||""}</span
            >
          </h2>
        </div>`,B=A`<select
      class=${`badge-select badge--status is-${f.status||"open"}`}
      @change=${H}
      .value=${f.status||"open"}
      ?disabled=${l}
    >
      ${(()=>{let q=String(f.status||"open");return["open","in_progress","closed"].map(te=>A`<option value=${te} ?selected=${q===te}>
              ${Qe(te)}
            </option>`)})()}
    </select>`,D=A`<select
      class=${`badge-select badge--priority is-p${String(typeof f.priority=="number"?f.priority:2)}`}
      @change=${K}
      .value=${String(typeof f.priority=="number"?f.priority:2)}
      ?disabled=${l}
    >
      ${(()=>{let q=String(typeof f.priority=="number"?f.priority:2);return Xe.map((te,We)=>A`<option value=${String(We)} ?selected=${q===String(We)}>
              ${Et(We)} ${te}
            </option>`)})()}
    </select>`,X=d?A`<div class="description">
          <textarea
            @keydown=${le}
            .value=${f.description||""}
            rows="8"
            style="width:100%"
          ></textarea>
          <div class="editable-actions">
            <button @click=${ue}>Save</button>
            <button @click=${ce}>Cancel</button>
          </div>
        </div>`:A`<div
          class="md editable"
          tabindex="0"
          role="button"
          aria-label="Edit description"
          @click=${W}
          @keydown=${Ce}
        >
          ${(()=>{let q=f.description||"";return q.trim()===""?A`<div class="muted">Description</div>`:Bt(q)})()}
        </div>`,ie=(()=>{let q=f;return String(f.acceptance||q.acceptance_criteria||"")})(),ct=h?A`<div class="acceptance">
          ${ie.trim().length>0?A`<div class="props-card__title">Acceptance Criteria</div>`:""}
          <textarea
            @keydown=${wt}
            .value=${ie}
            rows="6"
            style="width:100%"
          ></textarea>
          <div class="editable-actions">
            <button @click=${Te}>Save</button>
            <button @click=${Pe}>Cancel</button>
          </div>
        </div>`:A`<div class="acceptance">
          ${(()=>{let q=ie,te=q.trim().length>0;return A`${te?A`<div class="props-card__title">Acceptance Criteria</div>`:""}
              <div
                class="md editable"
                tabindex="0"
                role="button"
                aria-label="Edit acceptance criteria"
                @click=${Se}
                @keydown=${ze}
              >
                ${te?Bt(q):A`<div class="muted">Add acceptance criteria…</div>`}
              </div>`})()}
        </div>`,fe=String(f.notes||""),Ut=p?A`<div class="notes">
          ${fe.trim().length>0?A`<div class="props-card__title">Notes</div>`:""}
          <textarea
            @keydown=${ee}
            .value=${fe}
            rows="6"
            style="width:100%"
          ></textarea>
          <div class="editable-actions">
            <button @click=${Me}>Save</button>
            <button @click=${qe}>Cancel</button>
          </div>
        </div>`:A`<div class="notes">
          ${(()=>{let q=fe,te=q.trim().length>0;return A`${te?A`<div class="props-card__title">Notes</div>`:""}
              <div
                class="md editable"
                tabindex="0"
                role="button"
                aria-label="Edit notes"
                @click=${Je}
                @keydown=${$}
              >
                ${te?Bt(q):A`<div class="muted">Add notes…</div>`}
              </div>`})()}
        </div>`,vt=Array.isArray(f.labels)?f.labels:[],Ht=A`<div class="props-card labels">
      <div>
        <div class="props-card__title">Labels</div>
      </div>
      <ul>
        ${vt.map(q=>A`<li>
              <span class="badge" title=${q}
                >${q}
                <button
                  class="icon-button"
                  title="Remove label"
                  aria-label=${"Remove label "+q}
                  @click=${()=>z(q)}
                  style="margin-left:6px"
                >
                  ×
                </button></span
              >
            </li>`)}
      </ul>
      <div class="props-card__footer">
        <input
          type="text"
          placeholder="Label"
          size="12"
          .value=${k}
          @input=${M}
          @keydown=${O}
        />
        <button @click=${j}>Add</button>
      </div>
    </div>`,Ge=String(f.design||""),dt=u?A`<div class="design">
          ${Ge.trim().length>0?A`<div class="props-card__title">Design</div>`:""}
          <textarea
            @keydown=${U}
            .value=${Ge}
            rows="6"
            style="width:100%"
          ></textarea>
          <div class="editable-actions">
            <button @click=${pe}>Save</button>
            <button @click=${re}>Cancel</button>
          </div>
        </div>`:A`<div class="design">
          ${(()=>{let q=Ge,te=q.trim().length>0;return A`${te?A`<div class="props-card__title">Design</div>`:""}
              <div
                class="md editable"
                tabindex="0"
                role="button"
                aria-label="Edit design"
                @click=${se}
                @keydown=${w}
              >
                ${te?Bt(q):A`<div class="muted">Add design…</div>`}
              </div>`})()}
        </div>`;return A`
      <div class="panel__body" id="detail-root">
        <div style="position:relative">
          <div class="detail-layout">
            <div class="detail-main">
              ${T} ${X} ${dt} ${Ut}
              ${ct}
            </div>
            <div class="detail-side">
              <div class="props-card">
                <div class="props-card__title">Properties</div>
                <div class="prop">
                  <div class="label">Type</div>
                  <div class="value">
                    ${ot(f.issue_type)}
                  </div>
                </div>
                <div class="prop">
                  <div class="label">Status</div>
                  <div class="value">${B}</div>
                </div>
                <div class="prop">
                  <div class="label">Priority</div>
                  <div class="value">${D}</div>
                </div>
                <div class="prop assignee">
                  <div class="label">Assignee</div>
                  <div class="value">
                    ${v?A`<input
                            type="text"
                            aria-label="Edit assignee"
                            .value=${f.assignee||""}
                            size=${Math.min(40,Math.max(12,(f.assignee||"").length+3))}
                            @keydown=${q=>{q.key==="Escape"?(q.preventDefault(),I()):q.key==="Enter"&&(q.preventDefault(),y())}}
                          />
                          <button
                            class="btn"
                            style="margin-left:6px"
                            @click=${y}
                          >
                            Save
                          </button>
                          <button
                            class="btn"
                            style="margin-left:6px"
                            @click=${I}
                          >
                            Cancel
                          </button>`:A`${(()=>{let q=f.assignee||"",te=q.trim().length>0;return A`<span
                            class=${te?"editable":"editable muted"}
                            tabindex="0"
                            role="button"
                            aria-label="Edit assignee"
                            @click=${b}
                            @keydown=${g}
                            >${te?q:"Unassigned"}</span
                          >`})()}`}
                  </div>
                </div>
              </div>
              ${Ht}
              ${Ee("Dependencies",f.dependencies||[])}
              ${Ee("Dependents",f.dependents||[])}
            </div>
          </div>
        </div>
      </div>
    `}function N(){if(!i){R(o?"Loading\u2026":"No issue selected");return}J(_e(i),s)}function be(f,T){return async B=>{if(B.stopPropagation(),!(!i||l)){l=!0;try{if(T==="Dependencies"){let D=await e("dep-remove",{a:i.id,b:f,view_id:i.id});D&&typeof D=="object"&&(i=D,N())}else{let D=await e("dep-remove",{a:f,b:i.id,view_id:i.id});D&&typeof D=="object"&&(i=D,N())}}catch(D){n("dep-remove failed %o",D)}finally{l=!1}}}}function je(f,T){return async B=>{if(!i||l)return;let D=B.currentTarget,X=D.previousElementSibling,ie=X?X.value.trim():"";if(!ie||ie===i.id){ge("Enter a different issue id");return}if(new Set((f||[]).map(fe=>fe.id)).has(ie)){ge("Link already exists");return}l=!0,D&&(D.disabled=!0),X&&(X.disabled=!0);try{if(T==="Dependencies"){let fe=await e("dep-add",{a:i.id,b:ie,view_id:i.id});fe&&typeof fe=="object"&&(i=fe,N())}else{let fe=await e("dep-add",{a:ie,b:i.id,view_id:i.id});fe&&typeof fe=="object"&&(i=fe,N())}}catch(fe){n("dep-add failed %o",fe),ge("Failed to add dependency","error")}finally{l=!1}}}function Fe(f){f.key==="Escape"?(a=!1,N()):f.key==="Enter"&&(f.preventDefault(),x())}function Ce(f){f.key==="Enter"&&W()}function ze(f){f.key==="Enter"&&Se()}function $(f){f.key==="Enter"&&Je()}function w(f){f.key==="Enter"&&se()}return{async load(f){if(!f){R("No issue selected");return}o=String(f),i=null,m(),i||R("Loading\u2026"),l=!1,N()},clear(){R("Select an issue to view details")},destroy(){s.replaceChildren()}}}function ls(s){let e=s.navigate,t=s.onUpdate,r=s.requestRender,n=s.getSelectedId||(()=>null),i=s.row_class||"issue-row",o=new Set;function l(p,h,v,k=""){let _=`${p}:${h}`;return o.has(_)?A`<span>
        <input
          type="text"
          .value=${v}
          class="inline-edit"
          @keydown=${async m=>{if(m.key==="Escape")o.delete(_),r();else if(m.key==="Enter"){let S=m.currentTarget.value||"";S!==v&&await t(p,{[h]:S}),o.delete(_),r()}}}
          @blur=${async m=>{let S=m.currentTarget.value||"";S!==v&&await t(p,{[h]:S}),o.delete(_),r()}}
          autofocus
        />
      </span>`:A`<span
      class="editable text-truncate ${v?"":"muted"}"
      tabindex="0"
      role="button"
      @click=${m=>{m.stopPropagation(),m.preventDefault(),o.add(_),r()}}
      @keydown=${m=>{m.key==="Enter"&&(m.preventDefault(),m.stopPropagation(),o.add(_),r())}}
      >${v||k}</span
    >`}function a(p,h){return async v=>{let _=v.currentTarget.value||"",R={};R[h]=h==="priority"?Number(_):_,await t(p,R)}}function d(p){return h=>{let v=h.target;v&&(v.tagName==="INPUT"||v.tagName==="SELECT")||e(p)}}function u(p){let h=String(p.status||"open"),v=String(p.priority??2),k=n()===p.id;return A`<tr
      role="row"
      class="${i} ${k?"selected":""}"
      data-issue-id=${p.id}
      @click=${d(p.id)}
    >
      <td role="gridcell" class="mono">${Ye(p.id)}</td>
      <td role="gridcell">${ot(p.issue_type)}</td>
      <td role="gridcell">${l(p.id,"title",p.title||"")}</td>
      <td role="gridcell">
        <select
          class="badge-select badge--status is-${h}"
          .value=${h}
          @change=${a(p.id,"status")}
        >
          ${["open","in_progress","closed"].map(_=>A`<option value=${_} ?selected=${h===_}>
                ${Qe(_)}
              </option>`)}
        </select>
      </td>
      <td role="gridcell">
        ${l(p.id,"assignee",p.assignee||"","Unassigned")}
      </td>
      <td role="gridcell">
        <select
          class="badge-select badge--priority ${"is-p"+v}"
          .value=${v}
          @change=${a(p.id,"priority")}
        >
          ${Xe.map((_,R)=>A`<option
                value=${String(R)}
                ?selected=${v===String(R)}
              >
                ${Et(R)} ${_}
              </option>`)}
        </select>
      </td>
    </tr>`}return u}function ur(s,e,t,r=void 0,n=void 0){let i=[],o=new Set,l=new Set,a=new Map,d=n?Ze(n):null;d&&d.subscribe(()=>{let m=i.length===0;if(i=R(),p(),m&&i.length>0){let E=String(i[0].epic?.id||"");E&&!o.has(E)&&_(E)}});let u=ls({navigate:m=>t(m),onUpdate:k,requestRender:p,getSelectedId:()=>null,row_class:"epic-row"});function p(){J(h(),s)}function h(){return i.length?A`${i.map(m=>v(m))}`:A`<div class="panel__header muted">No epics found.</div>`}function v(m){let E=m.epic||{},S=String(E.id||""),x=o.has(S),L=d?d.selectEpicChildren(S):[],b=l.has(S);return A`
      <div class="epic-group" data-epic-id=${S}>
        <div
          class="epic-header"
          @click=${()=>_(S)}
          role="button"
          tabindex="0"
          aria-expanded=${x}
        >
          ${Ye(S,{class_name:"mono"})}
          <span class="text-truncate" style="margin-left:8px"
            >${E.title||"(no title)"}</span
          >
          <span
            class="epic-progress"
            style="margin-left:auto; display:flex; align-items:center; gap:8px;"
          >
            <progress
              value=${Number(m.closed_children||0)}
              max=${Math.max(1,Number(m.total_children||0))}
            ></progress>
            <span class="muted mono"
              >${m.closed_children}/${m.total_children}</span
            >
          </span>
        </div>
        ${x?A`<div class="epic-children">
              ${b?A`<div class="muted">Loading…</div>`:L.length===0?A`<div class="muted">No issues found</div>`:A`<table class="table">
                      <colgroup>
                        <col style="width: 100px" />
                        <col style="width: 120px" />
                        <col />
                        <col style="width: 120px" />
                        <col style="width: 160px" />
                        <col style="width: 130px" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Type</th>
                          <th>Title</th>
                          <th>Status</th>
                          <th>Assignee</th>
                          <th>Priority</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${L.map(g=>u(g))}
                      </tbody>
                    </table>`}
            </div>`:null}
      </div>
    `}async function k(m,E){try{await e.updateIssue({id:m,...E}),p()}catch{}}async function _(m){if(o.has(m)){if(o.delete(m),a.has(m)){try{let E=a.get(m);E&&await E()}catch{}a.delete(m);try{n&&n.unregister&&n.unregister(`detail:${m}`)}catch{}}}else{if(o.add(m),l.add(m),p(),r&&typeof r.subscribeList=="function")try{try{n&&n.register&&n.register(`detail:${m}`,{type:"issue-detail",params:{id:m}})}catch{}let E=await r.subscribeList(`detail:${m}`,{type:"issue-detail",params:{id:m}});a.set(m,E)}catch{}l.delete(m)}p()}function R(){let m=n&&n.snapshotFor?n.snapshotFor("tab:epics")||[]:[],E=[];for(let S of m){let x=Array.isArray(S.dependents)?S.dependents:[],L=Number.isFinite(S.total_children),b=Number.isFinite(S.closed_children),g=L?Number(S.total_children)||0:x.length,y=b&&Number(S.closed_children)||0;if(!b)for(let I of x)String(I.status||"")==="closed"&&y++;E.push({epic:S,total_children:g,closed_children:y})}return E}return{async load(){i=R(),p();try{if(i.length>0){let m=String(i[0].epic?.id||"");m&&!o.has(m)&&await _(m)}}catch{}}}}function pr(s){let e=document.createElement("dialog");e.id="fatal-error-dialog",e.setAttribute("role","alertdialog"),e.setAttribute("aria-modal","true"),e.innerHTML=`
    <div class="fatal-error">
      <div class="fatal-error__icon" aria-hidden="true">!</div>
      <div class="fatal-error__body">
        <p class="fatal-error__eyebrow">Critical</p>
        <h2 class="fatal-error__title" id="fatal-error-title">Command failed</h2>
        <p class="fatal-error__message" id="fatal-error-message"></p>
        <pre class="fatal-error__detail" id="fatal-error-detail"></pre>
        <div class="fatal-error__actions">
          <button type="button" class="btn primary" id="fatal-error-reload">Reload</button>
          <button type="button" class="btn" id="fatal-error-close">Dismiss</button>
        </div>
      </div>
    </div>`,s.appendChild(e);let t=e.querySelector("#fatal-error-title"),r=e.querySelector("#fatal-error-message"),n=e.querySelector("#fatal-error-detail"),i=e.querySelector("#fatal-error-reload"),o=e.querySelector("#fatal-error-close"),l=()=>{if(typeof e.close=="function")try{e.close()}catch{}e.removeAttribute("open")},a=(d,u,p="")=>{t&&(t.textContent=d||"Unexpected Error"),r&&(r.textContent=u||"An unrecoverable error occurred.");let h=typeof p=="string"?p.trim():"";if(n&&(h.length>0?(n.textContent=h,n.removeAttribute("hidden")):(n.textContent="No additional diagnostics available.",n.setAttribute("hidden",""))),typeof e.showModal=="function")try{e.showModal(),e.setAttribute("open","")}catch{e.setAttribute("open","")}else e.setAttribute("open","")};return i&&i.addEventListener("click",()=>{window.location.reload()}),o&&o.addEventListener("click",()=>l()),e.addEventListener("cancel",d=>{d.preventDefault(),l()}),{open:a,close:l,getElement(){return e}}}function fr(s,e,t){let r=document.createElement("dialog");r.id="issue-dialog",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.innerHTML=`
    <div class="issue-dialog__container" part="container">
      <header class="issue-dialog__header">
        <div class="issue-dialog__title">
          <span class="mono" id="issue-dialog-title"></span>
        </div>
        <button type="button" class="issue-dialog__close" aria-label="Close">\xD7</button>
      </header>
      <div class="issue-dialog__body" id="issue-dialog-body"></div>
    </div>
  `,s.appendChild(r);let n=r.querySelector("#issue-dialog-body"),i=r.querySelector("#issue-dialog-title"),o=r.querySelector(".issue-dialog__close");function l(v){i.replaceChildren(),i.appendChild(Ye(v))}r.addEventListener("mousedown",v=>{v.target===r&&(v.preventDefault(),d())}),r.addEventListener("cancel",v=>{v.preventDefault(),d()}),o.addEventListener("click",()=>d());let a=null;function d(){try{typeof r.close=="function"?r.close():r.removeAttribute("open")}catch{r.removeAttribute("open")}try{t()}catch{}h()}function u(v){try{let k=document.activeElement;k&&k instanceof HTMLElement?a=k:a=null}catch{a=null}l(v);try{"showModal"in r&&typeof r.showModal=="function"?r.showModal():r.setAttribute("open",""),setTimeout(()=>{try{o.focus()}catch{}},0)}catch{r.setAttribute("open","")}}function p(){try{typeof r.close=="function"?r.close():r.removeAttribute("open")}catch{r.removeAttribute("open")}h()}function h(){try{a&&document.contains(a)&&a.focus()}catch{}finally{a=null}}return{open:u,close:p,getMount(){return n}}}var cs=["bug","feature","task","epic","chore"];function ds(s){switch((s||"").toString().toLowerCase()){case"bug":return"Bug";case"feature":return"Feature";case"task":return"Task";case"epic":return"Epic";case"chore":return"Chore";default:return""}}function hr(s,e,t,r,n=void 0,i=void 0){let o=V("views:list"),l="all",a="",d=[],u="",p=r?r.getState().selected_id:null,h=null,v=ls({navigate:b=>{let g=t||(I=>window.location.hash=I),y=r?r.getState().view:"issues";g(Ke(y,b))},onUpdate:x,requestRender:S,getSelectedId:()=>p,row_class:"issue-row"}),k=async b=>{l=b.currentTarget.value,o("status change %s",l),r&&r.setState({filters:{status:l}}),await L()},_=b=>{a=b.currentTarget.value,o("search input %s",a),r&&r.setState({filters:{search:a}}),S()},R=b=>{u=b.currentTarget.value||"",o("type change %s",u||"(all)"),r&&r.setState({filters:{type:u}}),S()};if(r){let b=r.getState();b&&b.filters&&typeof b.filters=="object"&&(l=b.filters.status||"all",a=b.filters.search||"",u=typeof b.filters.type=="string"?b.filters.type:"")}let m=i?Ze(i):null;function E(){let b=d;if(l!=="all"&&l!=="ready"&&(b=b.filter(g=>String(g.status||"")===l)),a){let g=a.toLowerCase();b=b.filter(y=>{let I=String(y.id).toLowerCase(),M=String(y.title||"").toLowerCase();return I.includes(g)||M.includes(g)})}return u&&(b=b.filter(g=>String(g.issue_type||"")===String(u))),l==="closed"&&(b=b.slice().sort(gt)),A`
      <div class="panel__header">
        <select @change=${k} .value=${l}>
          <option value="all">All</option>
          <option value="ready">Ready</option>
          <option value="open">${Qe("open")}</option>
          <option value="in_progress">${Qe("in_progress")}</option>
          <option value="closed">${Qe("closed")}</option>
        </select>
        <select
          @change=${R}
          .value=${u}
          aria-label="Filter by type"
        >
          <option value="">All types</option>
          ${cs.map(g=>A`<option value=${g} ?selected=${u===g}>
                ${ds(g)}
              </option>`)}
        </select>
        <input
          type="search"
          placeholder="Search…"
          @input=${_}
          .value=${a}
        />
      </div>
      <div class="panel__body" id="list-root">
        ${b.length===0?A`<div class="issues-block">
              <div class="muted" style="padding:10px 12px;">No issues</div>
            </div>`:A`<div class="issues-block">
              <table
                class="table"
                role="grid"
                aria-rowcount=${String(b.length)}
                aria-colcount="6"
              >
                <colgroup>
                  <col style="width: 100px" />
                  <col style="width: 120px" />
                  <col />
                  <col style="width: 120px" />
                  <col style="width: 160px" />
                  <col style="width: 130px" />
                </colgroup>
                <thead>
                  <tr role="row">
                    <th role="columnheader">ID</th>
                    <th role="columnheader">Type</th>
                    <th role="columnheader">Title</th>
                    <th role="columnheader">Status</th>
                    <th role="columnheader">Assignee</th>
                    <th role="columnheader">Priority</th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  ${b.map(g=>v(g))}
                </tbody>
              </table>
            </div>`}
      </div>
    `}function S(){J(E(),s)}S();async function x(b,g){try{o("updateInline %s %o",b,Object.keys(g)),typeof g.title=="string"&&await e("edit-text",{id:b,field:"title",value:g.title}),typeof g.assignee=="string"&&await e("update-assignee",{id:b,assignee:g.assignee}),typeof g.status=="string"&&await e("update-status",{id:b,status:g.status}),typeof g.priority=="number"&&await e("update-priority",{id:b,priority:g.priority})}catch{}}async function L(){o("load");let b=s.querySelector("#list-root"),g=b?b.scrollTop:0;try{m?d=m.selectIssuesFor("tab:issues"):d=[]}catch(y){o("load failed: %o",y),d=[]}S();try{let y=s.querySelector("#list-root");y&&g>0&&(y.scrollTop=g)}catch{}}return s.tabIndex=0,s.addEventListener("keydown",b=>{if(b.key==="ArrowDown"||b.key==="ArrowUp"){let M=b.target;if((M&&typeof M.closest=="function"?M.closest("#list-root table.table"):null)&&!!!(M&&typeof M.closest=="function"&&(M.closest("input")||M.closest("textarea")||M.closest("select")))){let z=M&&typeof M.closest=="function"?M.closest("td"):null;if(z&&z.parentElement){let H=z.parentElement,K=H.parentElement;if(K&&K.querySelectorAll){let W=Array.from(K.querySelectorAll("tr")),le=Math.max(0,W.indexOf(H)),ue=z.cellIndex||0,ce=b.key==="ArrowDown"?Math.min(le+1,W.length-1):Math.max(le-1,0),se=W[ce],U=se&&se.cells?se.cells[ue]:null;if(U){let pe=U.querySelector('button:not([disabled]), [tabindex]:not([tabindex="-1"]), a[href], select:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled])');if(pe&&typeof pe.focus=="function"){b.preventDefault(),pe.focus();return}}}}}}let g=s.querySelector("#list-root tbody"),y=g?g.querySelectorAll("tr"):[];if(y.length===0)return;let I=0;if(p&&(I=Array.from(y).findIndex(O=>(O.getAttribute("data-issue-id")||"")===p),I<0&&(I=0)),b.key==="ArrowDown"){b.preventDefault();let M=y[Math.min(I+1,y.length-1)],O=M?M.getAttribute("data-issue-id"):"",j=O||null;r&&j&&r.setState({selected_id:j}),p=j,S()}else if(b.key==="ArrowUp"){b.preventDefault();let M=y[Math.max(I-1,0)],O=M?M.getAttribute("data-issue-id"):"",j=O||null;r&&j&&r.setState({selected_id:j}),p=j,S()}else if(b.key==="Enter"){b.preventDefault();let M=y[I],O=M?M.getAttribute("data-issue-id"):"";if(O){let j=t||(H=>window.location.hash=H),z=r?r.getState().view:"issues";j(Ke(z,O))}}}),r&&(h=r.subscribe(b=>{if(b.selected_id!==p&&(p=b.selected_id,o("selected %s",p||"(none)"),S()),b.filters&&typeof b.filters=="object"){let g=b.filters.status,y=b.filters.search||"",I=typeof b.filters.type=="string"?b.filters.type:"",M=!1;if(g!==l){l=g,L();return}y!==a&&(a=y,M=!0),I!==u&&(u=I,M=!0),M&&S()}})),m&&m.subscribe(()=>{try{d=m.selectIssuesFor("tab:issues"),S()}catch{}}),{load:L,destroy(){s.replaceChildren(),h&&(h(),h=null)}}}function gr(s,e,t){let r=V("views:nav"),n=null;function i(a){return d=>{d.preventDefault(),r("click tab %s",a),t.gotoView(a)}}function o(){let d=e.getState().view||"issues";return A`
      <nav class="header-nav" aria-label="Primary">
        <a
          href="#/issues"
          class="tab ${d==="issues"?"active":""}"
          @click=${i("issues")}
          >Issues</a
        >
        <a
          href="#/epics"
          class="tab ${d==="epics"?"active":""}"
          @click=${i("epics")}
          >Epics</a
        >
        <a
          href="#/board"
          class="tab ${d==="board"?"active":""}"
          @click=${i("board")}
          >Board</a
        >
        <div class="queen-nav">
          <a
            href="#/messages"
            class="tab ${d==="messages"?"active":""}"
            @click=${i("messages")}
            >Messages</a
          >
          <a
            href="#/assignments"
            class="tab ${d==="assignments"?"active":""}"
            @click=${i("assignments")}
            >Assigns</a
          >
          <a
            href="#/reservations"
            class="tab ${d==="reservations"?"active":""}"
            @click=${i("reservations")}
            >Files</a
          >
        </div>
      </nav>
    `}function l(){J(o(),s)}return l(),n=e.subscribe(()=>l()),{destroy(){n&&(n(),n=null),J(A``,s)}}}function mr(s,e,t,r){let n=document.createElement("dialog");n.id="new-issue-dialog",n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true"),n.innerHTML=`
    <div class="new-issue__container" part="container">
      <header class="new-issue__header">
        <div class="new-issue__title">New Issue</div>
        <button type="button" class="new-issue__close" aria-label="Close">\xD7</button>
      </header>
      <div class="new-issue__body">
        <form id="new-issue-form" class="new-issue__form">
          <label for="new-title">Title</label>
          <input id="new-title" name="title" type="text" required placeholder="Short summary" />

          <label for="new-type">Type</label>
          <select id="new-type" name="type" aria-label="Issue type"></select>

          <label for="new-priority">Priority</label>
          <select id="new-priority" name="priority" aria-label="Priority"></select>

          <label for="new-labels">Labels</label>
          <input id="new-labels" name="labels" type="text" placeholder="comma,separated" />

          <label for="new-description">Description</label>
          <textarea id="new-description" name="description" rows="6" placeholder="Optional markdown description"></textarea>

          <div aria-live="polite" role="status" class="new-issue__error" id="new-issue-error"></div>

          <div class="new-issue__actions" style="grid-column: 1 / -1">
            <button type="button" id="btn-cancel">Cancel (Esc)</button>
            <button type="submit" id="btn-create">Create</button>
          </div>
        </form>
      </div>
    </div>
  `,s.appendChild(n);let i=n.querySelector("#new-issue-form"),o=n.querySelector("#new-title"),l=n.querySelector("#new-type"),a=n.querySelector("#new-priority"),d=n.querySelector("#new-labels"),u=n.querySelector("#new-description"),p=n.querySelector("#new-issue-error"),h=n.querySelector("#btn-cancel"),v=n.querySelector("#btn-create"),k=n.querySelector(".new-issue__close");function _(){l.replaceChildren();let y=document.createElement("option");y.value="",y.textContent="\u2014 Select \u2014",l.appendChild(y);for(let I of cs){let M=document.createElement("option");M.value=I,M.textContent=ds(I),l.appendChild(M)}a.replaceChildren();for(let I=0;I<=4;I+=1){let M=document.createElement("option");M.value=String(I);let O=Xe[I]||"Medium";M.textContent=`${I} \u2013 ${O}`,a.appendChild(M)}}_();function R(){try{typeof n.close=="function"?n.close():n.removeAttribute("open")}catch{n.removeAttribute("open")}}function m(y){o.disabled=y,l.disabled=y,a.disabled=y,d.disabled=y,u.disabled=y,h.disabled=y,v.disabled=y,v.textContent=y?"Creating\u2026":"Create"}function E(){p.textContent=""}function S(y){p.textContent=y}function x(){try{let y=window.localStorage.getItem("beads-ui.new.type");y?l.value=y:l.value="";let I=window.localStorage.getItem("beads-ui.new.priority");I&&/^\d$/.test(I)?a.value=I:a.value="2"}catch{l.value="",a.value="2"}}function L(){let y=l.value||"",I=a.value||"";y.length>0&&window.localStorage.setItem("beads-ui.new.type",y),I.length>0&&window.localStorage.setItem("beads-ui.new.priority",I)}function b(y){let I=/-(\d+)$/.exec(String(y||""));return I&&I[1]?Number(I[1]):-1}async function g(){E();let y=String(o.value||"").trim();if(y.length===0){S("Title is required"),o.focus();return}let I=Number(a.value||"2");if(!(I>=0&&I<=4)){S("Priority must be 0..4"),a.focus();return}let M=String(l.value||""),O=String(u.value||""),j=String(d.value||"").split(",").map(W=>W.trim()).filter(W=>W.length>0),z={title:y};M.length>0&&(z.type=M),String(I).length>0&&(z.priority=I),O.length>0&&(z.description=O),m(!0);try{await e("create-issue",z)}catch{m(!1),S("Failed to create issue");return}L();let H=null;try{H=await e("list-issues",{filters:{status:"open",limit:50}})}catch{H=null}let K="";if(Array.isArray(H)){let W=H.filter(le=>String(le.title||"")===y);if(W.length>0){let le=W[0];for(let ue of W){let ce=b(le.id||"");b(ue.id||"")>ce&&(le=ue)}K=String(le.id||"")}}if(K&&j.length>0)for(let W of j)try{await e("label-add",{id:K,label:W})}catch{}if(K){try{t.gotoIssue(K)}catch{}try{r&&r.setState({selected_id:K})}catch{}}m(!1),R()}return n.addEventListener("cancel",y=>{y.preventDefault(),R()}),k.addEventListener("click",()=>R()),h.addEventListener("click",()=>R()),n.addEventListener("keydown",y=>{y.key==="Enter"&&(y.ctrlKey||y.metaKey)&&(y.preventDefault(),g())}),i.addEventListener("submit",y=>{y.preventDefault(),g()}),{open(){i.reset(),E(),x();try{"showModal"in n&&typeof n.showModal=="function"?n.showModal():n.setAttribute("open","")}catch{n.setAttribute("open","")}setTimeout(()=>{try{o.focus()}catch{}},0)},close(){R()}}}function br(s,e,t={}){let r=V("views:messages"),n=null,i=null,o=null,l=!1;function a(m){i=m;let x=(e.getState().queen_messages||[]).find(L=>L.id===m);x&&x.thread_id&&(o=x.thread_id),R()}function d(){l=!l,R()}function u(m){try{let E=new Date(m),x=new Date().getTime()-E.getTime(),L=Math.floor(x/6e4),b=Math.floor(x/36e5),g=Math.floor(x/864e5);return L<1?"just now":L<60?`${L}m ago`:b<24?`${b}h ago`:g<7?`${g}d ago`:E.toLocaleDateString()}catch{return m}}function p(m){let E=m.id===i,S=!m.read_at;return A`
      <div
        class="message-row ${E?"selected":""} ${S?"unread":""}"
        @click=${()=>a(m.id)}
        tabindex="0"
        @keydown=${x=>{(x.key==="Enter"||x.key===" ")&&(x.preventDefault(),a(m.id))}}
      >
        <div class="message-header">
          <span class="message-from">${m.from}</span>
          <span class="message-time">${u(m.created_at)}</span>
        </div>
        <div class="message-subject">${m.subject}</div>
        <div class="message-preview">${m.body?.slice(0,80)}${m.body?.length>80?"...":""}</div>
      </div>
    `}function h(m){return A`
      <div class="message-detail">
        <div class="message-detail-header">
          <h3>${m.subject}</h3>
          <div class="message-meta">
            <span>From: <strong>${m.from}</strong></span>
            <span>To: <strong>${m.to}</strong></span>
            <span>${u(m.created_at)}</span>
          </div>
        </div>
        <div class="message-body">
          ${m.body}
        </div>
        <div class="message-actions">
          <button class="btn btn-reply" @click=${d}>
            Reply
          </button>
        </div>
      </div>
    `}function v(){return A`
      <div class="compose-form">
        <h3>New Message</h3>
        <form @submit=${k}>
          <div class="form-group">
            <label for="msg-to">To:</label>
            <input type="text" id="msg-to" name="to" required placeholder="droid name" />
          </div>
          <div class="form-group">
            <label for="msg-subject">Subject:</label>
            <input type="text" id="msg-subject" name="subject" required />
          </div>
          <div class="form-group">
            <label for="msg-body">Message:</label>
            <textarea id="msg-body" name="body" rows="6" required></textarea>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Send</button>
            <button type="button" class="btn btn-secondary" @click=${d}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    `}function k(m){m.preventDefault();let E=m.target,S=new FormData(E);r("send message: to=%s subject=%s",S.get("to"),S.get("subject")),l=!1,R()}function _(){let E=e.getState().queen_messages||[],S=E.find(g=>g.id===i),x=new Map;for(let g of E){let y=g.thread_id||g.id;x.has(y)||x.set(y,[]),x.get(y).push(g)}let L=Array.from(x.entries()).sort((g,y)=>{let I=g[1][g[1].length-1],M=y[1][y[1].length-1];return new Date(M.created_at).getTime()-new Date(I.created_at).getTime()}),b=E;return o&&(b=E.filter(g=>g.thread_id===o||g.id===o)),A`
      <div class="queen-messages">
        <div class="messages-header">
          <h2>Messages</h2>
          <div class="messages-toolbar">
            <button
              class="btn btn-compose"
              @click=${d}
              title="New message"
            >
              + New
            </button>
            <button
              class="btn btn-refresh"
              @click=${()=>t.onRefresh?.()}
              title="Refresh"
            >
              ↻
            </button>
          </div>
        </div>
        ${l?v():""}
        <div class="messages-container">
          <div class="messages-list">
            ${b.length===0?A`<div class="empty-state">No messages</div>`:b.map(g=>p(g))}
          </div>
          <div class="messages-detail">
            ${S?h(S):A`<div class="empty-state">Select a message to view</div>`}
          </div>
        </div>
      </div>
    `}function R(){J(_(),s)}return{load(){r("load messages view"),R(),n=e.subscribe(()=>R())},unload(){r("unload messages view"),n&&(n(),n=null)},destroy(){n&&(n(),n=null),J(A``,s)}}}function yr(s,e,t={}){let r=V("views:assignments"),n=null,i=null,o=null;function l(_){try{let R=new Date(_),E=new Date().getTime()-R.getTime(),S=Math.floor(E/6e4),x=Math.floor(E/36e5),L=Math.floor(E/864e5);return S<1?"just now":S<60?`${S}m ago`:x<24?`${x}h ago`:L<7?`${L}d ago`:R.toLocaleDateString()}catch{return _}}function a(_){switch(_){case"active":return"status-active";case"completed":return"status-completed";case"blocked":return"status-blocked";case"released":return"status-released";default:return""}}function d(_){return A`
      <tr class="assignment-row">
        <td class="col-issue">
          <a href="#/issues?issue=${encodeURIComponent(_.issue_id)}" class="issue-link">
            ${_.issue_id}
          </a>
        </td>
        <td class="col-droid">
          <span class="droid-badge">${_.droid}</span>
        </td>
        <td class="col-status">
          <span class="status-badge ${a(_.status)}">
            ${_.status}
          </span>
        </td>
        <td class="col-worktree">${_.worktree||"-"}</td>
        <td class="col-assigned">${l(_.assigned_at)}</td>
        <td class="col-actions">
          ${_.status==="active"?A`<button class="btn btn-sm btn-release" @click=${()=>u(_)}>
                Release
              </button>`:""}
        </td>
      </tr>
    `}function u(_){r("release assignment: %s",_.id)}function p(_){i=i===_?null:_,k()}function h(_){o=o===_?null:_,k()}function v(){let _=e.getState(),R=_.queen_assignments||[],m=_.queen_droids||[],E=[...new Set(R.map(b=>b.status))],S=R;i&&(S=S.filter(b=>b.status===i)),o&&(S=S.filter(b=>b.droid===o)),S=S.sort((b,g)=>new Date(g.assigned_at).getTime()-new Date(b.assigned_at).getTime());let x=R.filter(b=>b.status==="active").length,L=R.filter(b=>b.status==="active").reduce((b,g)=>(b.set(g.droid,(b.get(g.droid)||0)+1),b),new Map);return A`
      <div class="queen-assignments">
        <div class="assignments-header">
          <h2>Assignments</h2>
          <div class="assignments-toolbar">
            <button
              class="btn btn-refresh"
              @click=${()=>t.onRefresh?.()}
              title="Refresh"
            >
              ↻
            </button>
          </div>
        </div>
        <div class="assignments-stats">
          <div class="stat">
            <span class="stat-value">${x}</span>
            <span class="stat-label">Active</span>
          </div>
          ${Array.from(L.entries()).map(([b,g])=>A`
              <div
                class="stat droid-stat ${o===b?"active":""}"
                @click=${()=>h(b)}
              >
                <span class="stat-value">${g}</span>
                <span class="stat-label">${b}</span>
              </div>
            `)}
        </div>
        <div class="assignments-filters">
          ${E.map(b=>A`
              <button
                class="filter-btn ${i===b?"active":""}"
                @click=${()=>p(b)}
              >
                ${b}
              </button>
            `)}
        </div>
        <div class="assignments-table-container">
          ${S.length===0?A`<div class="empty-state">No assignments</div>`:A`
                <table class="assignments-table">
                  <thead>
                    <tr>
                      <th>Issue</th>
                      <th>Droid</th>
                      <th>Status</th>
                      <th>Worktree</th>
                      <th>Assigned</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${S.map(b=>d(b))}
                  </tbody>
                </table>
              `}
        </div>
      </div>
    `}function k(){J(v(),s)}return{load(){r("load assignments view"),k(),n=e.subscribe(()=>k())},unload(){r("unload assignments view"),n&&(n(),n=null)},destroy(){n&&(n(),n=null),J(A``,s)}}}function wr(s,e,t={}){let r=V("views:reservations"),n=null,i=null,o=!1;function l(m){try{let E=new Date(m),x=new Date().getTime()-E.getTime(),L=Math.floor(x/6e4),b=Math.floor(x/36e5),g=Math.floor(x/864e5);return L<1?"just now":L<60?`${L}m ago`:b<24?`${b}h ago`:g<7?`${g}d ago`:E.toLocaleDateString()}catch{return m}}function a(m){try{let E=new Date(m),S=new Date,x=E.getTime()-S.getTime();if(x<=0)return"Expired";let L=Math.floor(x/6e4),b=Math.floor(x/36e5);return L<60?`${L}m left`:b<24?`${b}h left`:`${Math.floor(b/24)}d left`}catch{return m}}function d(m){try{return new Date(m).getTime()<Date.now()}catch{return!1}}function u(m){let E=d(m.expires_at),S=m.has_conflict||!1;return A`
      <tr class="reservation-row ${E?"expired":""} ${S?"has-conflict":""}">
        <td class="col-path">
          <span class="path-badge ${m.exclusive?"exclusive":"shared"}">
            ${m.exclusive?"\u{1F512}":"\u{1F441}\uFE0F"}
          </span>
          <code class="file-path">${m.path}</code>
          ${S?A`<span class="conflict-indicator" title="Conflict with: ${m.conflicting_droids?.join(", ")}">⚠️</span>`:""}
        </td>
        <td class="col-droid">
          <span class="droid-badge">${m.droid}</span>
        </td>
        <td class="col-type">
          <span class="type-badge ${m.exclusive?"exclusive":"shared"}">
            ${m.exclusive?"Exclusive":"Shared"}
          </span>
        </td>
        <td class="col-expiry ${E?"expired-text":""}">
          ${a(m.expires_at)}
        </td>
        <td class="col-created">${l(m.created_at)}</td>
        <td class="col-actions">
          ${E?A`
                <span class="expired-label">Expired</span>
              `:A`
                <button
                  class="btn btn-sm btn-release"
                  @click=${()=>p(m)}
                  title="Release reservation"
                >
                  Release
                </button>
                <button
                  class="btn btn-sm btn-renew"
                  @click=${()=>h(m)}
                  title="Extend reservation"
                >
                  Renew
                </button>
              `}
        </td>
      </tr>
    `}function p(m){r("release reservation: %s",m.id)}function h(m){r("renew reservation: %s",m.id)}function v(m){i=i===m?null:m,R()}function k(){o=!o,R()}function _(){let E=e.getState().queen_reservations||[],S=[...new Set(E.map(y=>y.droid))],x=E;i&&(x=x.filter(y=>y.droid===i)),o||(x=x.filter(y=>!d(y.expires_at))),x=x.sort((y,I)=>new Date(y.expires_at).getTime()-new Date(I.expires_at).getTime());let L=E.filter(y=>!d(y.expires_at)).length,b=E.filter(y=>y.has_conflict).length,g=E.filter(y=>y.exclusive&&!d(y.expires_at)).length;return A`
      <div class="queen-reservations">
        <div class="reservations-header">
          <h2>File Reservations</h2>
          <div class="reservations-toolbar">
            <label class="toggle-expired">
              <input
                type="checkbox"
                ?checked=${o}
                @change=${k}
              />
              Show expired
            </label>
            <button
              class="btn btn-refresh"
              @click=${()=>t.onRefresh?.()}
              title="Refresh"
            >
              ↻
            </button>
          </div>
        </div>
        <div class="reservations-stats">
          <div class="stat">
            <span class="stat-value">${L}</span>
            <span class="stat-label">Active</span>
          </div>
          <div class="stat">
            <span class="stat-value">${g}</span>
            <span class="stat-label">Exclusive</span>
          </div>
          ${b>0?A`
                <div class="stat stat-warning">
                  <span class="stat-value">${b}</span>
                  <span class="stat-label">Conflicts</span>
                </div>
              `:""}
          ${S.map(y=>A`
              <div
                class="stat droid-stat ${i===y?"active":""}"
                @click=${()=>v(y)}
              >
                <span class="stat-value">${E.filter(I=>I.droid===y&&!d(I.expires_at)).length}</span>
                <span class="stat-label">${y}</span>
              </div>
            `)}
        </div>
        <div class="reservations-table-container">
          ${x.length===0?A`<div class="empty-state">No reservations</div>`:A`
                <table class="reservations-table">
                  <thead>
                    <tr>
                      <th>Path</th>
                      <th>Droid</th>
                      <th>Type</th>
                      <th>Expires</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${x.map(y=>u(y))}
                  </tbody>
                </table>
              `}
        </div>
      </div>
    `}function R(){J(_(),s)}return{load(){r("load reservations view"),R(),n=e.subscribe(()=>R())},unload(){r("unload reservations view"),n&&(n(),n=null)},destroy(){n&&(n(),n=null),J(A``,s)}}}function vr(s,e,t={}){let r=V("views:droids"),n=null,i=null,o=null;function l(k){try{let _=new Date(k),m=new Date().getTime()-_.getTime(),E=Math.floor(m/6e4),S=Math.floor(m/36e5),x=Math.floor(m/864e5);return E<1?"just now":E<60?`${E}m ago`:S<24?`${S}h ago`:x<7?`${x}d ago`:_.toLocaleDateString()}catch{return k||"never"}}function a(k){switch(k){case"active":return{icon:"\u{1F7E2}",class:"status-active"};case"idle":return{icon:"\u{1F7E1}",class:"status-idle"};case"busy":return{icon:"\u{1F535}",class:"status-busy"};case"offline":return{icon:"\u26AB",class:"status-offline"};default:return{icon:"\u26AA",class:"status-unknown"}}}function d(k){let _=a(k.status),R=k.current_assignment&&k.current_assignment.length>0,m=(k.unread_count||0)>0;return A`
      <div class="droid-card ${_.class}">
        <div class="droid-header">
          <div class="droid-status">
            <span class="status-icon">${_.icon}</span>
            <span class="droid-name">${k.name}</span>
          </div>
          ${k.location?A`<span class="droid-location">${k.location}</span>`:""}
        </div>
        ${k.description?A`<div class="droid-description">${k.description}</div>`:""}
        <div class="droid-meta">
          ${k.model?A`<span class="droid-model" title="Model">${k.model}</span>`:""}
          <span class="droid-path" title="Path">${k.path}</span>
        </div>
        <div class="droid-activity">
          ${R?A`
                <div class="droid-assignment">
                  <span class="label">Working on:</span>
                  <a href="#/issues?issue=${encodeURIComponent(k.current_assignment||"")}" class="issue-link">
                    ${k.current_assignment}
                  </a>
                </div>
              `:A`<div class="droid-assignment idle">No active assignment</div>`}
          <div class="droid-stats">
            <span class="stat-item ${m?"has-unread":""}">
              ${m?`${k.unread_count} unread`:`${k.message_count||0} messages`}
            </span>
            <span class="stat-item">
              Active: ${l(k.last_active||"")}
            </span>
          </div>
        </div>
      </div>
    `}function u(k){i=i===k?null:k,v()}function p(k){o=o===k?null:k,v()}function h(){let _=e.getState().queen_droids||[],R=[...new Set(_.map(g=>g.status))],m=[...new Set(_.map(g=>g.location).filter(Boolean))],E=_;i&&(E=E.filter(g=>g.status===i)),o&&(E=E.filter(g=>g.location===o));let S={active:0,busy:1,idle:2,offline:3};E=E.sort((g,y)=>{let I=S[g.status]??4,M=S[y.status]??4;return I!==M?I-M:g.name.localeCompare(y.name)});let x=_.filter(g=>g.status==="active").length,L=_.filter(g=>g.status==="idle").length,b=_.reduce((g,y)=>g+(y.unread_count||0),0);return A`
      <div class="queen-droids">
        <div class="droids-header">
          <h2>Droids</h2>
          <div class="droids-toolbar">
            <button
              class="btn btn-refresh"
              @click=${()=>t.onRefresh?.()}
              title="Refresh"
            >
              ↻
            </button>
          </div>
        </div>
        <div class="droids-stats">
          <div class="stat ${i==="active"?"active":""}" @click=${()=>u("active")}>
            <span class="stat-value">${x}</span>
            <span class="stat-label">Active</span>
          </div>
          <div class="stat ${i==="idle"?"active":""}" @click=${()=>u("idle")}>
            <span class="stat-value">${L}</span>
            <span class="stat-label">Idle</span>
          </div>
          <div class="stat">
            <span class="stat-value">${_.length}</span>
            <span class="stat-label">Total</span>
          </div>
          ${b>0?A`
                <div class="stat stat-warning">
                  <span class="stat-value">${b}</span>
                  <span class="stat-label">Unread</span>
                </div>
              `:""}
        </div>
        ${m.length>1?A`
              <div class="droids-filters">
                ${m.map(g=>A`
                    <button
                      class="filter-btn ${o===g?"active":""}"
                      @click=${()=>p(g)}
                    >
                      ${g}
                    </button>
                  `)}
              </div>
            `:""}
        <div class="droids-grid">
          ${E.length===0?A`<div class="empty-state">No droids discovered</div>`:E.map(g=>d(g))}
        </div>
      </div>
    `}function v(){J(h(),s)}return{load(){r("load droids view"),v(),n=e.subscribe(()=>v())},unload(){r("unload droids view"),n&&(n(),n=null)},destroy(){n&&(n(),n=null),J(A``,s)}}}var kr=["list-issues","update-status","edit-text","update-priority","create-issue","list-ready","dep-add","dep-remove","epic-status","update-assignee","label-add","label-remove","subscribe-list","unsubscribe-list","snapshot","upsert","delete"];function Vs(){let s=Date.now().toString(36),e=Math.random().toString(36).slice(2,8);return`${s}-${e}`}function _r(s,e,t=Vs()){return{id:t,type:s,payload:e}}function xr(s={}){let e=V("ws"),t={initialMs:s.backoff?.initialMs??1e3,maxMs:s.backoff?.maxMs??3e4,factor:s.backoff?.factor??2,jitterRatio:s.backoff?.jitterRatio??.2},r=()=>s.url&&s.url.length>0?s.url:typeof location<"u"?(location.protocol==="https:"?"wss://":"ws://")+location.host+"/ws":"ws://localhost/ws",n=null,i="closed",o=0,l=null,a=!0,d=new Map,u=[],p=new Map,h=new Set;function v(x){for(let L of Array.from(h))try{L(x)}catch{}}function k(){if(!a||l)return;i="reconnecting",e("ws reconnecting\u2026"),v(i);let x=Math.min(t.maxMs||0,(t.initialMs||0)*Math.pow(t.factor||1,o)),L=(t.jitterRatio||0)*x,b=Math.max(0,Math.round(x+(Math.random()*2-1)*L));e("ws retry in %d ms (attempt %d)",b,o+1),l=setTimeout(()=>{l=null,S()},b)}function _(x){try{n?.send(JSON.stringify(x))}catch(L){e("ws send failed",L)}}function R(){for(i="open",e("ws open"),v(i),o=0;u.length;){let x=u.shift();x&&_(x)}}function m(x){let L;try{L=JSON.parse(String(x.data))}catch{e("ws received non-JSON message");return}if(!L||typeof L.id!="string"||typeof L.type!="string"){e("ws received invalid envelope");return}if(d.has(L.id)){let g=d.get(L.id);d.delete(L.id),L.ok?g?.resolve(L.payload):g?.reject(L.error||new Error("ws error"));return}let b=p.get(L.type);if(b&&b.size>0)for(let g of Array.from(b))try{g(L.payload)}catch(y){e("ws event handler error",y)}else e("ws received unhandled message type: %s",L.type)}function E(){i="closed",e("ws closed"),v(i);for(let[x,L]of d.entries())L.reject(new Error("ws disconnected")),d.delete(x);o+=1,k()}function S(){if(!a)return;let x=r();try{n=new WebSocket(x),e("ws connecting %s",x),i="connecting",v(i),n.addEventListener("open",R),n.addEventListener("message",m),n.addEventListener("error",()=>{}),n.addEventListener("close",E)}catch(L){e("ws connect failed %o",L),k()}}return S(),{send(x,L){if(!kr.includes(x))return Promise.reject(new Error(`unknown message type: ${x}`));let b=Vs(),g=_r(x,L,b);return e("send %s id=%s",x,b),new Promise((y,I)=>{d.set(b,{resolve:y,reject:I,type:x}),n&&n.readyState===n.OPEN?_(g):(e("queue %s id=%s (state=%s)",x,b,i),u.push(g))})},on(x,L){p.has(x)||p.set(x,new Set);let b=p.get(x);return b?.add(L),()=>{b?.delete(L)}},onConnection(x){return h.add(x),()=>{h.delete(x)}},close(){a=!1,l&&(clearTimeout(l),l=null);try{n?.close()}catch{}},getState(){return i}}}function ao(s){let e=V("main");e("bootstrap start");let t=A`
    <section id="issues-root" class="route issues">
      <aside id="list-panel" class="panel"></aside>
    </section>
    <section id="epics-root" class="route epics" hidden></section>
    <section id="board-root" class="route board" hidden></section>
    <section id="detail-panel" class="route detail" hidden></section>
    <section id="messages-root" class="route messages" hidden></section>
    <section id="assignments-root" class="route assignments" hidden></section>
    <section id="reservations-root" class="route reservations" hidden></section>
    <section id="droids-root" class="route droids" hidden></section>
  `;J(t,s);let r=document.getElementById("top-nav"),n=document.getElementById("issues-root"),i=document.getElementById("epics-root"),o=document.getElementById("board-root"),l=document.getElementById("messages-root"),a=document.getElementById("assignments-root"),d=document.getElementById("reservations-root"),u=document.getElementById("droids-root"),p=document.getElementById("list-panel"),h=document.getElementById("detail-panel");if(p&&n&&i&&o&&h&&l&&a&&d&&u){let S=function($,w){let f="Request failed",T="";if($&&typeof $=="object"){let D=$;if(typeof D.message=="string"&&D.message.length>0&&(f=D.message),typeof D.details=="string")T=D.details;else if(D.details&&typeof D.details=="object")try{T=JSON.stringify(D.details,null,2)}catch{T=""}}else typeof $=="string"&&$.length>0&&(f=$);let B=w&&w.length>0?`Failed to load ${w}`:"Request failed";E.open(B,f,T)},je=function($){let w=String($?.status||"all");return w==="ready"?{type:"ready-issues"}:w==="in_progress"?{type:"in-progress-issues"}:w==="closed"?{type:"closed-issues"}:{type:"all-issues"}},Ce=function($){if($.view==="issues"){let w=je($.filters||{}),f=JSON.stringify(w);try{g.register("tab:issues",w)}catch(T){e("register issues store failed: %o",T)}(!Te||f!==Fe)&&b.subscribeList("tab:issues",w).then(T=>{Te=T,Fe=f}).catch(T=>{e("subscribe issues failed: %o",T),S(T,"issues list")})}else if(Te){Te().catch(()=>{}),Te=null,Fe=null;try{g.unregister("tab:issues")}catch(w){e("unregister issues store failed: %o",w)}}if($.view==="epics"){try{g.register("tab:epics",{type:"epics"})}catch(w){e("register epics store failed: %o",w)}b.subscribeList("tab:epics",{type:"epics"}).then(w=>{Pe=w}).catch(w=>{e("subscribe epics failed: %o",w),S(w,"epics")})}else if(Pe){Pe().catch(()=>{}),Pe=null;try{g.unregister("tab:epics")}catch(w){e("unregister epics store failed: %o",w)}}if($.view==="board"){if(!Ee){try{g.register("tab:board:ready",{type:"ready-issues"})}catch(w){e("register board:ready store failed: %o",w)}b.subscribeList("tab:board:ready",{type:"ready-issues"}).then(w=>Ee=w).catch(w=>{e("subscribe board ready failed: %o",w),S(w,"board (Ready)")})}if(!_e){try{g.register("tab:board:in-progress",{type:"in-progress-issues"})}catch(w){e("register board:in-progress store failed: %o",w)}b.subscribeList("tab:board:in-progress",{type:"in-progress-issues"}).then(w=>_e=w).catch(w=>{e("subscribe board in-progress failed: %o",w),S(w,"board (In Progress)")})}if(!N){try{g.register("tab:board:closed",{type:"closed-issues"})}catch(w){e("register board:closed store failed: %o",w)}b.subscribeList("tab:board:closed",{type:"closed-issues"}).then(w=>N=w).catch(w=>{e("subscribe board closed failed: %o",w),S(w,"board (Closed)")})}if(!be){try{g.register("tab:board:blocked",{type:"blocked-issues"})}catch(w){e("register board:blocked store failed: %o",w)}b.subscribeList("tab:board:blocked",{type:"blocked-issues"}).then(w=>be=w).catch(w=>{e("subscribe board blocked failed: %o",w),S(w,"board (Blocked)")})}}else{if(Ee){Ee().catch(()=>{}),Ee=null;try{g.unregister("tab:board:ready")}catch(w){e("unregister board:ready failed: %o",w)}}if(_e){_e().catch(()=>{}),_e=null;try{g.unregister("tab:board:in-progress")}catch(w){e("unregister board:in-progress failed: %o",w)}}if(N){N().catch(()=>{}),N=null;try{g.unregister("tab:board:closed")}catch(w){e("unregister board:closed failed: %o",w)}}if(be){be().catch(()=>{}),be=null;try{g.unregister("tab:board:blocked")}catch(w){e("unregister board:blocked failed: %o",w)}}}};var v=S,k=je,_=Ce;let R=document.getElementById("header-loading"),m=En(R),E=pr(s),x=xr(),L=m.wrapSend(($,w)=>x.send($,w)),b=An(L),g=Sn();x.on("snapshot",$=>{let w=$,f=w&&typeof w.id=="string"?w.id:"",T=f?g.getStore(f):null;if(T&&w&&w.type==="snapshot")try{T.applyPush(w)}catch{}}),x.on("upsert",$=>{let w=$,f=w&&typeof w.id=="string"?w.id:"",T=f?g.getStore(f):null;if(T&&w&&w.type==="upsert")try{T.applyPush(w)}catch{}}),x.on("delete",$=>{let w=$,f=w&&typeof w.id=="string"?w.id:"",T=f?g.getStore(f):null;if(T&&w&&w.type==="delete")try{T.applyPush(w)}catch{}});let y=Ze(g),I=!1;if(typeof x.onConnection=="function"){let $=w=>{e("ws state %s",w),w==="reconnecting"||w==="closed"?(I=!0,ge("Connection lost. Reconnecting\u2026","error",4e3)):w==="open"&&I&&(I=!1,ge("Reconnected","success",2200))};x.onConnection($)}let M={status:"all",search:"",type:""};try{let $=window.localStorage.getItem("beads-ui.filters");if($){let w=JSON.parse($);if(w&&typeof w=="object"){let f=["bug","feature","task","epic","chore"],T="";if(typeof w.type=="string"&&f.includes(w.type))T=w.type;else if(Array.isArray(w.types)){let B="";for(let D of w.types)if(f.includes(String(D))){B=D;break}T=B}M={status:["all","open","in_progress","closed","ready"].includes(w.status)?w.status:"all",search:typeof w.search=="string"?w.search:"",type:T}}}}catch($){e("filters parse error: %o",$)}let O="issues";try{let $=window.localStorage.getItem("beads-ui.view");($==="issues"||$==="epics"||$==="board")&&(O=$)}catch($){e("view parse error: %o",$)}let j={closed_filter:"today"};try{let $=window.localStorage.getItem("beads-ui.board");if($){let w=JSON.parse($);if(w&&typeof w=="object"){let f=String(w.closed_filter||"today");(f==="today"||f==="3"||f==="7")&&(j.closed_filter=f)}}}catch($){e("board prefs parse error: %o",$)}let z=Tn({filters:M,view:O,board:j}),H=$n(z);H.start();let K=async($,w)=>{try{return await L($,w)}catch{return[]}};r&&gr(r,z,H);let W=mr(s,($,w)=>L($,w),H,z);try{let $=document.getElementById("new-issue-btn");$&&$.addEventListener("click",()=>W.open())}catch{}let ue=hr(p,async($,w)=>{if($==="list-issues")try{return y.selectIssuesFor("tab:issues")}catch(f){return e("list selectors failed: %o",f),[]}return K($,w)},$=>{let w=Yt($);w&&H.gotoIssue(w)},z,b,g);z.subscribe($=>{let w={status:$.filters.status,search:$.filters.search,type:typeof $.filters.type=="string"?$.filters.type:""};window.localStorage.setItem("beads-ui.filters",JSON.stringify(w))}),z.subscribe($=>{window.localStorage.setItem("beads-ui.board",JSON.stringify({closed_filter:$.board.closed_filter}))}),ue.load();let ce=fr(h,z,()=>{let $=z.getState();z.setState({selected_id:null});try{let w=$.view||"issues";H.gotoView(w)}catch{}}),se=null;se=dr(ce.getMount(),K,$=>{let w=Yt($);w&&H.gotoIssue(w)},g);let U=z.getState().selected_id;if(U){h.hidden=!1,ce.open(U),se&&se.load(U);let $=`detail:${U}`,w={type:"issue-detail",params:{id:U}};try{g.register($,w)}catch(f){e("register detail store failed: %o",f)}b.subscribeList($,w).catch(f=>{e("detail subscribe failed: %o",f),S(f,"issue details")})}let pe=null;z.subscribe($=>{let w=$.selected_id;if(w){h.hidden=!1,ce.open(w),se&&se.load(w);let f=`detail:${w}`,T={type:"issue-detail",params:{id:w}};try{g.register(f,T)}catch{}b.subscribeList(f,T).then(B=>{pe&&pe().catch(()=>{}),pe=B}).catch(B=>{e("detail subscribe failed: %o",B),S(B,"issue details")})}else{try{ce.close()}catch{}se&&se.clear(),h.hidden=!0,pe&&(pe().catch(()=>{}),pe=null)}});let re=xn(K),Je=ur(i,re,$=>H.gotoIssue($),b,g),ee=Rn(o,re,$=>H.gotoIssue($),z,b,g),Me=br(l,z,{onRefresh:()=>{e("refresh messages requested")}}),qe=yr(a,z,{onRefresh:()=>{e("refresh assignments requested")}}),Se=wr(d,z,{onRefresh:()=>{e("refresh reservations requested")}}),wt=vr(u,z,{onRefresh:()=>{e("refresh droids requested")}}),Te=null,Pe=null,Ee=null,_e=null,N=null,be=null,Fe=null,ze=$=>{n&&i&&o&&h&&l&&a&&d&&u&&(n.hidden=$.view!=="issues",i.hidden=$.view!=="epics",o.hidden=$.view!=="board",l.hidden=$.view!=="messages",a.hidden=$.view!=="assignments",d.hidden=$.view!=="reservations",u.hidden=$.view!=="droids"),Ce($),!$.selected_id&&$.view==="epics"&&Je.load(),!$.selected_id&&$.view==="board"&&ee.load(),$.view==="messages"?Me.load():Me.unload(),$.view==="assignments"?qe.load():qe.unload(),$.view==="reservations"?Se.load():Se.unload(),window.localStorage.setItem("beads-ui.view",$.view)};z.subscribe(ze),ze(z.getState()),window.addEventListener("keydown",$=>{let w=$.ctrlKey||$.metaKey,f=String($.key||"").toLowerCase(),T=$.target,B=T&&T.tagName?String(T.tagName).toLowerCase():"",D=B==="input"||B==="textarea"||B==="select"||T&&typeof T.isContentEditable=="boolean"&&T.isContentEditable;w&&f==="n"&&(D||($.preventDefault(),W.open()))})}}typeof window<"u"&&typeof document<"u"&&window.addEventListener("DOMContentLoaded",()=>{try{let t=window.localStorage.getItem("beads-ui.theme"),r=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches,n=t==="dark"||t==="light"?t:r?"dark":"light";document.documentElement.setAttribute("data-theme",n);let i=document.getElementById("theme-switch");i&&(i.checked=n==="dark")}catch{}let s=document.getElementById("theme-switch");s&&s.addEventListener("change",()=>{let t=s.checked?"dark":"light";document.documentElement.setAttribute("data-theme",t),window.localStorage.setItem("beads-ui.theme",t)});let e=document.getElementById("app");e&&ao(e)});export{ao as bootstrap};
//# sourceMappingURL=main.bundle.js.map
