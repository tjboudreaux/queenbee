var Rn=Object.create;var hs=Object.defineProperty;var In=Object.getOwnPropertyDescriptor;var Ln=Object.getOwnPropertyNames;var Dn=Object.getPrototypeOf,Mn=Object.prototype.hasOwnProperty;var Nn=(s,e,t)=>e in s?hs(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var gs=(s,e)=>()=>(e||s((e={exports:{}}).exports,e),e.exports);var On=(s,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of Ln(e))!Mn.call(s,r)&&r!==t&&hs(s,r,{get:()=>e[r],enumerable:!(n=In(e,r))||n.enumerable});return s};var Pn=(s,e,t)=>(t=s!=null?Rn(Dn(s)):{},On(e||!s||!s.__esModule?hs(t,"default",{value:s,enumerable:!0}):t,s));var ee=(s,e,t)=>Nn(s,typeof e!="symbol"?e+"":e,t);var br=gs((go,mr)=>{var bt=1e3,yt=bt*60,wt=yt*60,ot=wt*24,Un=ot*7,qn=ot*365.25;mr.exports=function(s,e){e=e||{};var t=typeof s;if(t==="string"&&s.length>0)return jn(s);if(t==="number"&&isFinite(s))return e.long?Wn(s):Gn(s);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(s))};function jn(s){if(s=String(s),!(s.length>100)){var e=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(s);if(e){var t=parseFloat(e[1]),n=(e[2]||"ms").toLowerCase();switch(n){case"years":case"year":case"yrs":case"yr":case"y":return t*qn;case"weeks":case"week":case"w":return t*Un;case"days":case"day":case"d":return t*ot;case"hours":case"hour":case"hrs":case"hr":case"h":return t*wt;case"minutes":case"minute":case"mins":case"min":case"m":return t*yt;case"seconds":case"second":case"secs":case"sec":case"s":return t*bt;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return t;default:return}}}}function Gn(s){var e=Math.abs(s);return e>=ot?Math.round(s/ot)+"d":e>=wt?Math.round(s/wt)+"h":e>=yt?Math.round(s/yt)+"m":e>=bt?Math.round(s/bt)+"s":s+"ms"}function Wn(s){var e=Math.abs(s);return e>=ot?Vt(s,e,ot,"day"):e>=wt?Vt(s,e,wt,"hour"):e>=yt?Vt(s,e,yt,"minute"):e>=bt?Vt(s,e,bt,"second"):s+" ms"}function Vt(s,e,t,n){var r=e>=t*1.5;return Math.round(s/t)+" "+n+(r?"s":"")}});var wr=gs((mo,yr)=>{function Vn(s){t.debug=t,t.default=t,t.coerce=a,t.disable=o,t.enable=r,t.enabled=l,t.humanize=br(),t.destroy=d,Object.keys(s).forEach(p=>{t[p]=s[p]}),t.names=[],t.skips=[],t.formatters={};function e(p){let u=0;for(let h=0;h<p.length;h++)u=(u<<5)-u+p.charCodeAt(h),u|=0;return t.colors[Math.abs(u)%t.colors.length]}t.selectColor=e;function t(p){let u,h=null,w,A;function k(...R){if(!k.enabled)return;let m=k,E=Number(new Date),$=E-(u||E);m.diff=$,m.prev=u,m.curr=E,u=E,R[0]=t.coerce(R[0]),typeof R[0]!="string"&&R.unshift("%O");let _=0;R[0]=R[0].replace(/%([a-zA-Z%])/g,(f,v)=>{if(f==="%%")return"%";_++;let b=t.formatters[v];if(typeof b=="function"){let I=R[_];f=b.call(m,I),R.splice(_,1),_--}return f}),t.formatArgs.call(m,R),(m.log||t.log).apply(m,R)}return k.namespace=p,k.useColors=t.useColors(),k.color=t.selectColor(p),k.extend=n,k.destroy=t.destroy,Object.defineProperty(k,"enabled",{enumerable:!0,configurable:!1,get:()=>h!==null?h:(w!==t.namespaces&&(w=t.namespaces,A=t.enabled(p)),A),set:R=>{h=R}}),typeof t.init=="function"&&t.init(k),k}function n(p,u){let h=t(this.namespace+(typeof u>"u"?":":u)+p);return h.log=this.log,h}function r(p){t.save(p),t.namespaces=p,t.names=[],t.skips=[];let u=(typeof p=="string"?p:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(let h of u)h[0]==="-"?t.skips.push(h.slice(1)):t.names.push(h)}function i(p,u){let h=0,w=0,A=-1,k=0;for(;h<p.length;)if(w<u.length&&(u[w]===p[h]||u[w]==="*"))u[w]==="*"?(A=w,k=h,w++):(h++,w++);else if(A!==-1)w=A+1,k++,h=k;else return!1;for(;w<u.length&&u[w]==="*";)w++;return w===u.length}function o(){let p=[...t.names,...t.skips.map(u=>"-"+u)].join(",");return t.enable(""),p}function l(p){for(let u of t.skips)if(i(p,u))return!1;for(let u of t.names)if(i(p,u))return!0;return!1}function a(p){return p instanceof Error?p.stack||p.message:p}function d(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")}return t.enable(t.load()),t}yr.exports=Vn});var vr=gs(($e,Zt)=>{$e.formatArgs=Kn;$e.save=Yn;$e.load=Xn;$e.useColors=Zn;$e.storage=Qn();$e.destroy=(()=>{let s=!1;return()=>{s||(s=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})();$e.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function Zn(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let s;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(s=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(s[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function Kn(s){if(s[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+s[0]+(this.useColors?"%c ":" ")+"+"+Zt.exports.humanize(this.diff),!this.useColors)return;let e="color: "+this.color;s.splice(1,0,e,"color: inherit");let t=0,n=0;s[0].replace(/%[a-zA-Z%]/g,r=>{r!=="%%"&&(t++,r==="%c"&&(n=t))}),s.splice(n,0,e)}$e.log=console.debug||console.log||(()=>{});function Yn(s){try{s?$e.storage.setItem("debug",s):$e.storage.removeItem("debug")}catch{}}function Xn(){let s;try{s=$e.storage.getItem("debug")||$e.storage.getItem("DEBUG")}catch{}return!s&&typeof process<"u"&&"env"in process&&(s=process.env.DEBUG),s}function Qn(){try{return localStorage}catch{}}Zt.exports=wr()($e);var{formatters:Jn}=Zt.exports;Jn.j=function(s){try{return JSON.stringify(s)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}}});var xt=globalThis,Wt=xt.trustedTypes,or=Wt?Wt.createPolicy("lit-html",{createHTML:s=>s}):void 0,pr="$lit$",Ze=`lit$${Math.random().toFixed(9).slice(2)}$`,fr="?"+Ze,Fn=`<${fr}>`,nt=document,At=()=>nt.createComment(""),St=s=>s===null||typeof s!="object"&&typeof s!="function",_s=Array.isArray,zn=s=>_s(s)||typeof s?.[Symbol.iterator]=="function",ms=`[ 	
\f\r]`,_t=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ar=/-->/g,lr=/>/g,st=RegExp(`>|${ms}(?:([^\\s"'>=/]+)(${ms}*=${ms}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),cr=/'/g,dr=/"/g,hr=/^(?:script|style|textarea|title)$/i,xs=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),S=xs(1),lo=xs(2),co=xs(3),it=Symbol.for("lit-noChange"),de=Symbol.for("lit-nothing"),ur=new WeakMap,rt=nt.createTreeWalker(nt,129);function gr(s,e){if(!_s(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return or!==void 0?or.createHTML(e):e}var Bn=(s,e)=>{let t=s.length-1,n=[],r,i=e===2?"<svg>":e===3?"<math>":"",o=_t;for(let l=0;l<t;l++){let a=s[l],d,p,u=-1,h=0;for(;h<a.length&&(o.lastIndex=h,p=o.exec(a),p!==null);)h=o.lastIndex,o===_t?p[1]==="!--"?o=ar:p[1]!==void 0?o=lr:p[2]!==void 0?(hr.test(p[2])&&(r=RegExp("</"+p[2],"g")),o=st):p[3]!==void 0&&(o=st):o===st?p[0]===">"?(o=r??_t,u=-1):p[1]===void 0?u=-2:(u=o.lastIndex-p[2].length,d=p[1],o=p[3]===void 0?st:p[3]==='"'?dr:cr):o===dr||o===cr?o=st:o===ar||o===lr?o=_t:(o=st,r=void 0);let w=o===st&&s[l+1].startsWith("/>")?" ":"";i+=o===_t?a+Fn:u>=0?(n.push(d),a.slice(0,u)+pr+a.slice(u)+Ze+w):a+Ze+(u===-2?l:w)}return[gr(s,i+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),n]},$t=class s{constructor({strings:e,_$litType$:t},n){let r;this.parts=[];let i=0,o=0,l=e.length-1,a=this.parts,[d,p]=Bn(e,t);if(this.el=s.createElement(d,n),rt.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=rt.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let u of r.getAttributeNames())if(u.endsWith(pr)){let h=p[o++],w=r.getAttribute(u).split(Ze),A=/([.?@])?(.*)/.exec(h);a.push({type:1,index:i,name:A[2],strings:w,ctor:A[1]==="."?ys:A[1]==="?"?ws:A[1]==="@"?vs:gt}),r.removeAttribute(u)}else u.startsWith(Ze)&&(a.push({type:6,index:i}),r.removeAttribute(u));if(hr.test(r.tagName)){let u=r.textContent.split(Ze),h=u.length-1;if(h>0){r.textContent=Wt?Wt.emptyScript:"";for(let w=0;w<h;w++)r.append(u[w],At()),rt.nextNode(),a.push({type:2,index:++i});r.append(u[h],At())}}}else if(r.nodeType===8)if(r.data===fr)a.push({type:2,index:i});else{let u=-1;for(;(u=r.data.indexOf(Ze,u+1))!==-1;)a.push({type:7,index:i}),u+=Ze.length-1}i++}}static createElement(e,t){let n=nt.createElement("template");return n.innerHTML=e,n}};function ht(s,e,t=s,n){if(e===it)return e;let r=n!==void 0?t._$Co?.[n]:t._$Cl,i=St(e)?void 0:e._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),i===void 0?r=void 0:(r=new i(s),r._$AT(s,t,n)),n!==void 0?(t._$Co??(t._$Co=[]))[n]=r:t._$Cl=r),r!==void 0&&(e=ht(s,r._$AS(s,e.values),r,n)),e}var bs=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??nt).importNode(t,!0);rt.currentNode=r;let i=rt.nextNode(),o=0,l=0,a=n[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new Tt(i,i.nextSibling,this,e):a.type===1?d=new a.ctor(i,a.name,a.strings,this,e):a.type===6&&(d=new ks(i,this,e)),this._$AV.push(d),a=n[++l]}o!==a?.index&&(i=rt.nextNode(),o++)}return rt.currentNode=nt,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(e,n,t),t+=n.strings.length-2):n._$AI(e[t])),t++}},Tt=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=de,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ht(this,e,t),St(e)?e===de||e==null||e===""?(this._$AH!==de&&this._$AR(),this._$AH=de):e!==this._$AH&&e!==it&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):zn(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==de&&St(this._$AH)?this._$AA.nextSibling.data=e:this.T(nt.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=$t.createElement(gr(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let i=new bs(r,this),o=i.u(this.options);i.p(t),this.T(o),this._$AH=i}}_$AC(e){let t=ur.get(e.strings);return t===void 0&&ur.set(e.strings,t=new $t(e)),t}k(e){_s(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,n,r=0;for(let i of e)r===t.length?t.push(n=new s(this.O(At()),this.O(At()),this,this.options)):n=t[r],n._$AI(i),r++;r<t.length&&(this._$AR(n&&n._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let n=e.nextSibling;e.remove(),e=n}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},gt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=de,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=de}_$AI(e,t=this,n,r){let i=this.strings,o=!1;if(i===void 0)e=ht(this,e,t,0),o=!St(e)||e!==this._$AH&&e!==it,o&&(this._$AH=e);else{let l=e,a,d;for(e=i[0],a=0;a<i.length-1;a++)d=ht(this,l[n+a],t,a),d===it&&(d=this._$AH[a]),o||(o=!St(d)||d!==this._$AH[a]),d===de?e=de:e!==de&&(e+=(d??"")+i[a+1]),this._$AH[a]=d}o&&!r&&this.j(e)}j(e){e===de?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ys=class extends gt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===de?void 0:e}},ws=class extends gt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==de)}},vs=class extends gt{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=ht(this,e,t,0)??de)===it)return;let n=this._$AH,r=e===de&&n!==de||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==de&&(n===de||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ks=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){ht(this,e)}};var Hn=xt.litHtmlPolyfillSupport;Hn?.($t,Tt),(xt.litHtmlVersions??(xt.litHtmlVersions=[])).push("3.3.1");var ie=(s,e,t)=>{let n=t?.renderBefore??e,r=n._$litPart$;if(r===void 0){let i=t?.renderBefore??null;n._$litPart$=r=new Tt(e.insertBefore(At(),i),i,void 0,t??{})}return r._$AI(s),r};function Ie(s,e){let t=s.priority??2,n=e.priority??2;if(t!==n)return t-n;let r=s.created_at??0,i=e.created_at??0;if(r!==i)return r<i?-1:1;let o=s.id,l=e.id;return o<l?-1:o>l?1:0}function mt(s,e){let t=s.closed_at??0,n=e.closed_at??0;if(t!==n)return t<n?1:-1;let r=s?.id,i=e?.id;return r<i?-1:r>i?1:0}function Ke(s=void 0){function e(i){return!s||typeof s.snapshotFor!="function"?[]:s.snapshotFor(i).slice().sort(Ie)}function t(i,o){let l=s&&s.snapshotFor?s.snapshotFor(i).slice():[];return o==="in_progress"?l.sort(Ie):o==="closed"?l.sort(mt):l.sort(Ie),l}function n(i){if(!s||typeof s.snapshotFor!="function")return[];let l=(s.snapshotFor(`detail:${i}`)||[]).find(d=>String(d?.id||"")===String(i));return(Array.isArray(l?.dependents)?l.dependents:[]).slice().sort(Ie)}function r(i){return s&&typeof s.subscribe=="function"?s.subscribe(i):()=>{}}return{selectIssuesFor:e,selectBoardColumn:t,selectEpicChildren:n,subscribe:r}}var kr=Pn(vr(),1);function X(s){return(0,kr.default)(`queenui:${s}`)}function _r(s){let e=X("data");async function t(n){let{id:r}=n;e("updateIssue %s %o",r,Object.keys(n));let i=null;return typeof n.title=="string"&&(i=await s("edit-text",{id:r,field:"title",value:n.title})),typeof n.acceptance=="string"&&(i=await s("edit-text",{id:r,field:"acceptance",value:n.acceptance})),typeof n.notes=="string"&&(i=await s("edit-text",{id:r,field:"notes",value:n.notes})),typeof n.design=="string"&&(i=await s("edit-text",{id:r,field:"design",value:n.design})),typeof n.status=="string"&&(i=await s("update-status",{id:r,status:n.status})),typeof n.priority=="number"&&(i=await s("update-priority",{id:r,priority:n.priority})),typeof n.assignee=="string"&&(i=await s("update-assignee",{id:r,assignee:n.assignee})),e("updateIssue done %s",r),i}return{updateIssue:t}}function As(s,e={}){let t=X(`issue-store:${s}`),n=new Map,r=[],i=0,o=new Set,l=!1,a=e.sort||Ie;function d(){for(let h of Array.from(o))try{h()}catch{}}function p(){r=Array.from(n.values()).sort(a)}function u(h){if(l||!h||h.id!==s)return;let w=Number(h.revision)||0;if(t("apply %s rev=%d",h.type,w),!(w<=i&&h.type!=="snapshot")){if(h.type==="snapshot"){if(w<=i)return;n.clear();let A=Array.isArray(h.issues)?h.issues:[];for(let k of A)k&&typeof k.id=="string"&&k.id.length>0&&n.set(k.id,k);p(),i=w,d();return}if(h.type==="upsert"){let A=h.issue;if(A&&typeof A.id=="string"&&A.id.length>0){let k=n.get(A.id);if(!k)n.set(A.id,A);else{let R=Number.isFinite(k.updated_at)?k.updated_at:0,m=Number.isFinite(A.updated_at)?A.updated_at:0;if(R<=m){for(let E of Object.keys(k))E in A||delete k[E];for(let[E,$]of Object.entries(A))k[E]=$}}p()}i=w,d()}else if(h.type==="delete"){let A=String(h.issue_id||"");A&&(n.delete(A),p()),i=w,d()}}}return{id:s,subscribe(h){return o.add(h),()=>{o.delete(h)}},applyPush:u,snapshot(){return r},size(){return n.size},getById(h){return n.get(h)},dispose(){l=!0,n.clear(),r=[],o.clear(),i=0}}}function Kt(s){let e=String(s.type||"").trim(),t={};if(s.params&&typeof s.params=="object"){let r=Object.keys(s.params).sort();for(let i of r){let o=s.params[i];t[i]=String(o)}}let n=new URLSearchParams(t).toString();return n.length>0?`${e}?${n}`:e}function xr(s){let e=X("subs"),t=new Map,n=new Map;function r(l,a){e("applyDelta %s +%d ~%d -%d",l,(a.added||[]).length,(a.updated||[]).length,(a.removed||[]).length);let d=n.get(l);if(!d||d.size===0)return;let p=Array.isArray(a.added)?a.added:[],u=Array.isArray(a.updated)?a.updated:[],h=Array.isArray(a.removed)?a.removed:[];for(let w of Array.from(d)){let A=t.get(w);if(!A)continue;let k=A.itemsById;for(let R of p)typeof R=="string"&&R.length>0&&k.set(R,!0);for(let R of u)typeof R=="string"&&R.length>0&&k.set(R,!0);for(let R of h)typeof R=="string"&&R.length>0&&k.delete(R)}}async function i(l,a){let d=Kt(a);if(e("subscribe %s key=%s",l,d),!t.has(l))t.set(l,{key:d,itemsById:new Map});else{let u=t.get(l);if(u&&u.key!==d){let h=n.get(u.key);h&&(h.delete(l),h.size===0&&n.delete(u.key)),t.set(l,{key:d,itemsById:new Map})}}n.has(d)||n.set(d,new Set);let p=n.get(d);p&&p.add(l);try{await s("subscribe-list",{id:l,type:a.type,params:a.params})}catch(u){let h=t.get(l)||null;if(h){let w=n.get(h.key);w&&(w.delete(l),w.size===0&&n.delete(h.key))}throw t.delete(l),u}return async()=>{e("unsubscribe %s key=%s",l,d);try{await s("unsubscribe-list",{id:l})}catch{}let u=t.get(l)||null;if(u){let h=n.get(u.key);h&&(h.delete(l),h.size===0&&n.delete(u.key))}t.delete(l)}}return{subscribeList:i,_applyDelta:r,_subKeyOf:Kt,selectors:{getIds(l){let a=t.get(l);return a?Array.from(a.itemsById.keys()):[]},has(l,a){let d=t.get(l);return d?d.itemsById.has(a):!1},count(l){let a=t.get(l);return a?a.itemsById.size:0},getItemsById(l){let a=t.get(l),d={};if(!a)return d;for(let p of a.itemsById.keys())d[p]=!0;return d}}}}function Ar(){let s=X("issue-stores"),e=new Map,t=new Map,n=new Set,r=new Map;function i(){for(let a of Array.from(n))try{a()}catch{}}function o(a,d,p){let u=d?Kt(d):"",h=t.get(a)||"",w=e.has(a);if(s("register %s key=%s (prev=%s)",a,u,h),w&&h&&u&&h!==u){let A=e.get(a);if(A)try{A.dispose()}catch{}let k=r.get(a);if(k){try{k()}catch{}r.delete(a)}let R=As(a,p);e.set(a,R);let m=R.subscribe(()=>i());r.set(a,m)}else if(!w){let A=As(a,p);e.set(a,A);let k=A.subscribe(()=>i());r.set(a,k)}return t.set(a,u),()=>l(a)}function l(a){s("unregister %s",a),t.delete(a);let d=e.get(a);d&&(d.dispose(),e.delete(a));let p=r.get(a);if(p){try{p()}catch{}r.delete(a)}}return{register:o,unregister:l,getStore(a){return e.get(a)||null},snapshotFor(a){let d=e.get(a);return d?d.snapshot().slice():[]},subscribe(a){return n.add(a),()=>n.delete(a)}}}function Ye(s,e){return`#/${s==="epics"||s==="board"?s:"issues"}?issue=${encodeURIComponent(e)}`}function Yt(s){let e=String(s||""),t=e.startsWith("#")?e.slice(1):e,n=t.indexOf("?"),r=n>=0?t.slice(n+1):"";if(r){let l=new URLSearchParams(r).get("issue");if(l)return decodeURIComponent(l)}let i=/^\/issue\/([^\s?#]+)/.exec(t);return i&&i[1]?decodeURIComponent(i[1]):null}function Ss(s){let e=String(s||"");return/^#\/epics(\b|\/|$)/.test(e)?"epics":/^#\/board(\b|\/|$)/.test(e)?"board":/^#\/messages(\b|\/|$)/.test(e)?"messages":/^#\/assignments(\b|\/|$)/.test(e)?"assignments":/^#\/reservations(\b|\/|$)/.test(e)?"reservations":"issues"}function Sr(s){let e=X("router"),t=()=>{let n=window.location.hash||"",r=/^#\/issue\/([^\s?#]+)/.exec(n);if(r&&r[1]){let l=decodeURIComponent(r[1]);s.setState({selected_id:l,view:"issues"});let a=`#/issues?issue=${encodeURIComponent(l)}`;if(window.location.hash!==a){window.location.hash=a;return}}let i=Yt(n),o=Ss(n);e("hash change \u2192 view=%s id=%s",o,i),s.setState({selected_id:i,view:o})};return{start(){window.addEventListener("hashchange",t),t()},stop(){window.removeEventListener("hashchange",t)},gotoIssue(n){let i=(s.getState?s.getState():{view:"issues"}).view||"issues",o=Ye(i,n);e("goto issue %s (view=%s)",n,i),window.location.hash!==o?window.location.hash=o:s.setState({selected_id:n,view:i})},gotoView(n){let i=(s.getState?s.getState():{selected_id:null}).selected_id,o=i?Ye(n,i):`#/${n}`;e("goto view %s (id=%s)",n,i||""),window.location.hash!==o?window.location.hash=o:s.setState({view:n,selected_id:null})}}}function $r(s={}){let e=X("state"),t={selected_id:s.selected_id??null,view:s.view??"issues",filters:{status:s.filters?.status??"all",search:s.filters?.search??"",type:typeof s.filters?.type=="string"?s.filters?.type:""},board:{closed_filter:s.board?.closed_filter==="3"||s.board?.closed_filter==="7"||s.board?.closed_filter==="today"?s.board?.closed_filter:"today"}},n=new Set;function r(){for(let i of Array.from(n))try{i(t)}catch{}}return{getState(){return t},setState(i){let o={...t,...i,filters:{...t.filters,...i.filters||{}},board:{...t.board,...i.board||{}}};o.selected_id===t.selected_id&&o.view===t.view&&o.filters.status===t.filters.status&&o.filters.search===t.filters.search&&o.filters.type===t.filters.type&&o.board.closed_filter===t.board.closed_filter||(t=o,e("state change %o",{selected_id:t.selected_id,view:t.view,filters:t.filters,board:t.board}),r())},subscribe(i){return n.add(i),()=>n.delete(i)}}}function Tr(s){let e=0;function t(){if(!s)return;let o=e>0;s.toggleAttribute("hidden",!o),s.setAttribute("aria-busy",o?"true":"false")}function n(){e+=1,t()}function r(){e=Math.max(0,e-1),t()}function i(o){return async(l,a)=>{n();try{return await o(l,a)}finally{r()}}}return t(),{wrapSend:i,start:n,done:r,getCount:()=>e}}function me(s,e="info",t=2800){let n=document.createElement("div");n.className="toast",n.textContent=s,n.style.position="fixed",n.style.right="12px",n.style.bottom="12px",n.style.zIndex="1000",n.style.color="#fff",n.style.padding="8px 10px",n.style.borderRadius="4px",n.style.fontSize="12px",e==="success"?n.style.background="#156d36":e==="error"?n.style.background="#9f2011":n.style.background="rgba(0,0,0,0.85)",(document.body||document.documentElement).appendChild(n),setTimeout(()=>{try{n.remove()}catch{}},t)}function Xe(s,e){let t=typeof e?.duration_ms=="number"?e.duration_ms:1200,n=document.createElement("button");n.className=(e?.class_name?e.class_name+" ":"")+"mono id-copy",n.type="button",n.setAttribute("aria-live","polite"),n.setAttribute("title","Copy issue ID"),n.setAttribute("aria-label",`Copy issue ID ${s}`),n.textContent=s;async function r(){try{navigator.clipboard&&typeof navigator.clipboard.writeText=="function"&&await navigator.clipboard.writeText(String(s)),n.textContent="Copied";let i=n.getAttribute("aria-label")||"";n.setAttribute("aria-label","Copied"),setTimeout(()=>{n.textContent=s,n.setAttribute("aria-label",i)},Math.max(80,t))}catch{}}return n.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),r()}),n.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),i.stopPropagation(),r())}),n}var Qe=["Critical","High","Medium","Low","Backlog"];function Er(s){let e=typeof s=="number"?s:2,t=document.createElement("span");t.className="priority-badge",t.classList.add(`is-p${Math.max(0,Math.min(4,e))}`),t.setAttribute("role","img");let n=ei(e);return t.setAttribute("title",n),t.setAttribute("aria-label",`Priority: ${n}`),t.textContent=Et(e)+" "+n,t}function ei(s){let e=Math.max(0,Math.min(4,s));return Qe[e]||"Medium"}function Et(s){switch(s){case 0:return"\u{1F525}";case 1:return"\u26A1\uFE0F";case 2:return"\u{1F527}";case 3:return"\u{1FAB6}";case 4:return"\u{1F4A4}";default:return"\u{1F527}"}}function at(s){let e=document.createElement("span");e.className="type-badge";let t=(s||"").toString().toLowerCase(),n=new Set(["bug","feature","task","epic","chore"]),r=n.has(t)?t:"neutral";e.classList.add(`type-badge--${r}`),e.setAttribute("role","img");let i=n.has(t)?t==="bug"?"Bug":t==="feature"?"Feature":t==="task"?"Task":t==="epic"?"Epic":"Chore":"\u2014";return e.setAttribute("aria-label",n.has(t)?`Issue type: ${i}`:"Issue type: unknown"),e.setAttribute("title",n.has(t)?`Type: ${i}`:"Type: unknown"),e.textContent=i,e}function Cr(s,e,t,n,r=void 0,i=void 0){let o=X("views:board"),l=[],a=[],d=[],p=[],u=[],h=i?Ke(i):null,w="today";if(n)try{let v=n.getState(),b=v&&v.board?String(v.board.closed_filter||"today"):"today";(b==="today"||b==="3"||b==="7")&&(w=b)}catch{}function A(){return S`
      <div class="panel__body board-root">
        ${k("Blocked","blocked-col",a)}
        ${k("Ready","ready-col",l)}
        ${k("In Progress","in-progress-col",d)}
        ${k("Closed","closed-col",p)}
      </div>
    `}function k(v,b,I){let L=Array.isArray(I)?I.length:0,O=L===1?"1 issue":`${L} issues`;return S`
      <section class="board-column" id=${b}>
        <header
          class="board-column__header"
          id=${b+"-header"}
          role="heading"
          aria-level="2"
        >
          <div class="board-column__title">
            <span class="board-column__title-text">${v}</span>
            <span class="badge board-column__count" aria-label=${O}>
              ${L}
            </span>
          </div>
          ${b==="closed-col"?S`<label class="board-closed-filter">
                <span class="visually-hidden">Filter closed issues</span>
                <select
                  id="closed-filter"
                  aria-label="Filter closed issues"
                  @change=${C}
                >
                  <option
                    value="today"
                    ?selected=${w==="today"}
                  >
                    Today
                  </option>
                  <option value="3" ?selected=${w==="3"}>
                    Last 3 days
                  </option>
                  <option value="7" ?selected=${w==="7"}>
                    Last 7 days
                  </option>
                </select>
              </label>`:""}
        </header>
        <div
          class="board-column__body"
          role="list"
          aria-labelledby=${b+"-header"}
        >
          ${I.map(z=>R(z))}
        </div>
      </section>
    `}function R(v){return S`
      <article
        class="board-card"
        data-issue-id=${v.id}
        role="listitem"
        tabindex="-1"
        @click=${()=>t(v.id)}
      >
        <div class="board-card__title text-truncate">
          ${v.title||"(no title)"}
        </div>
        <div class="board-card__meta">
          ${at(v.issue_type)} ${Er(v.priority)}
          ${Xe(v.id,{class_name:"mono"})}
        </div>
      </article>
    `}function m(){ie(A(),s),E()}function E(){try{let v=Array.from(s.querySelectorAll(".board-column"));for(let b of v){let I=b.querySelector(".board-column__body");if(!I)continue;let L=Array.from(I.querySelectorAll(".board-card")),O=b.querySelector(".board-column__header"),z=O&&O.textContent?.trim()||"";for(let H of L){let V=H.querySelector(".board-card__title"),Y=V&&V.textContent?.trim()||"";H.setAttribute("aria-label",`Issue ${Y||"(no title)"} \u2014 Column ${z}`),H.tabIndex=-1}L.length>0&&(L[0].tabIndex=0)}}catch{}}s.addEventListener("keydown",v=>{let b=v.target;if(!b||!(b instanceof HTMLElement))return;let I=String(b.tagName||"").toLowerCase();if(I==="input"||I==="textarea"||I==="select"||b.isContentEditable===!0)return;let L=b.closest(".board-card");if(!L)return;let O=String(v.key||"");if(O==="Enter"||O===" "){v.preventDefault();let K=L.getAttribute("data-issue-id");K&&t(K);return}if(O!=="ArrowUp"&&O!=="ArrowDown"&&O!=="ArrowLeft"&&O!=="ArrowRight")return;v.preventDefault();let z=L.closest(".board-column");if(!z)return;let H=z.querySelector(".board-column__body");if(!H)return;let V=Array.from(H.querySelectorAll(".board-card")),Y=V.indexOf(L);if(Y!==-1){if(O==="ArrowDown"&&Y<V.length-1){$(V[Y],V[Y+1]);return}if(O==="ArrowUp"&&Y>0){$(V[Y],V[Y-1]);return}if(O==="ArrowRight"||O==="ArrowLeft"){let K=Array.from(s.querySelectorAll(".board-column")),ue=K.indexOf(z);if(ue===-1)return;let ce=O==="ArrowRight"?1:-1,oe=ue+ce,ae=null;for(;oe>=0&&oe<K.length;){let B=K[oe],xe=B.querySelector(".board-column__body");if((xe?Array.from(xe.querySelectorAll(".board-card")):[]).length>0){ae=B;break}oe+=ce}if(ae){let B=ae.querySelector(".board-column__body .board-card");B&&$(L,B)}return}}});function $(v,b){try{v.tabIndex=-1,b.tabIndex=0,b.focus()}catch{}}function _(){o("applyClosedFilter %s",w);let v=Array.isArray(u)?[...u]:[],b=new Date,I=0;w==="today"?I=new Date(b.getFullYear(),b.getMonth(),b.getDate(),0,0,0,0).getTime():w==="3"?I=b.getTime()-4320*60*1e3:w==="7"&&(I=b.getTime()-10080*60*1e3),v=v.filter(L=>{let O=Number.isFinite(L.closed_at)?L.closed_at:NaN;return Number.isFinite(O)?O>=I:!1}),v.sort(mt),p=v}function C(v){try{let b=v.target,I=String(b.value||"today");if(w=I==="3"||I==="7"?I:"today",o("closed filter %s",w),n)try{n.setState({board:{closed_filter:w}})}catch{}_(),m()}catch{}}function f(){try{if(h){let v=h.selectBoardColumn("tab:board:in-progress","in_progress"),b=h.selectBoardColumn("tab:board:blocked","blocked"),I=h.selectBoardColumn("tab:board:ready","ready"),L=h.selectBoardColumn("tab:board:closed","closed"),O=new Set(v.map(H=>H.id));l=I.filter(H=>!O.has(H.id)),a=b,d=v,u=L}_(),m()}catch{l=[],a=[],d=[],p=[],m()}}return h&&h.subscribe(()=>{try{f()}catch{}}),{async load(){o("load"),f();try{let v=!!(r&&r.selectors),b=z=>{if(!v||!r)return 0;let H=r.selectors;if(typeof H.count=="function")return Number(H.count(z)||0);try{let V=H.getIds(z);return Array.isArray(V)?V.length:0}catch{return 0}},I=b("tab:board:ready")+b("tab:board:blocked")+b("tab:board:in-progress")+b("tab:board:closed"),L=e,O=L&&typeof L.getReady=="function"&&typeof L.getBlocked=="function"&&typeof L.getInProgress=="function"&&typeof L.getClosed=="function";if(I===0&&O){o("fallback fetch");let[z,H,V,Y]=await Promise.all([L.getReady().catch(()=>[]),L.getBlocked().catch(()=>[]),L.getInProgress().catch(()=>[]),L.getClosed().catch(()=>[])]),K=Array.isArray(z)?z.map(B=>B):[],ue=Array.isArray(H)?H.map(B=>B):[],ce=Array.isArray(V)?V.map(B=>B):[],oe=Array.isArray(Y)?Y.map(B=>B):[],ae=new Set(ce.map(B=>B.id));K=K.filter(B=>!ae.has(B.id)),K.sort(Ie),ue.sort(Ie),ce.sort(Ie),l=K,a=ue,d=ce,u=oe,_(),m()}}catch{}},clear(){s.replaceChildren(),l=[],a=[],d=[],p=[]}}}var{entries:Fr,setPrototypeOf:Rr,isFrozen:ti,getPrototypeOf:si,getOwnPropertyDescriptor:ri}=Object,{freeze:ve,seal:Ee,create:Ls}=Object,{apply:Ds,construct:Ms}=typeof Reflect<"u"&&Reflect;ve||(ve=function(e){return e});Ee||(Ee=function(e){return e});Ds||(Ds=function(e,t){for(var n=arguments.length,r=new Array(n>2?n-2:0),i=2;i<n;i++)r[i-2]=arguments[i];return e.apply(t,r)});Ms||(Ms=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return new e(...n)});var Xt=ke(Array.prototype.forEach),ni=ke(Array.prototype.lastIndexOf),Ir=ke(Array.prototype.pop),Ct=ke(Array.prototype.push),ii=ke(Array.prototype.splice),Jt=ke(String.prototype.toLowerCase),$s=ke(String.prototype.toString),Ts=ke(String.prototype.match),Rt=ke(String.prototype.replace),oi=ke(String.prototype.indexOf),ai=ke(String.prototype.trim),Le=ke(Object.prototype.hasOwnProperty),we=ke(RegExp.prototype.test),It=li(TypeError);function ke(s){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return Ds(s,e,n)}}function li(s){return function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return Ms(s,t)}}function W(s,e){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Jt;Rr&&Rr(s,null);let n=e.length;for(;n--;){let r=e[n];if(typeof r=="string"){let i=t(r);i!==r&&(ti(e)||(e[n]=i),r=i)}s[r]=!0}return s}function ci(s){for(let e=0;e<s.length;e++)Le(s,e)||(s[e]=null);return s}function Fe(s){let e=Ls(null);for(let[t,n]of Fr(s))Le(s,t)&&(Array.isArray(n)?e[t]=ci(n):n&&typeof n=="object"&&n.constructor===Object?e[t]=Fe(n):e[t]=n);return e}function Lt(s,e){for(;s!==null;){let n=ri(s,e);if(n){if(n.get)return ke(n.get);if(typeof n.value=="function")return ke(n.value)}s=si(s)}function t(){return null}return t}var Lr=ve(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Es=ve(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Cs=ve(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),di=ve(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Rs=ve(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),ui=ve(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Dr=ve(["#text"]),Mr=ve(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Is=ve(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Nr=ve(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Qt=ve(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),pi=Ee(/\{\{[\w\W]*|[\w\W]*\}\}/gm),fi=Ee(/<%[\w\W]*|[\w\W]*%>/gm),hi=Ee(/\$\{[\w\W]*/gm),gi=Ee(/^data-[\-\w.\u00B7-\uFFFF]+$/),mi=Ee(/^aria-[\-\w]+$/),zr=Ee(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),bi=Ee(/^(?:\w+script|data):/i),yi=Ee(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Br=Ee(/^html$/i),wi=Ee(/^[a-z][.\w]*(-[.\w]+)+$/i),Or=Object.freeze({__proto__:null,ARIA_ATTR:mi,ATTR_WHITESPACE:yi,CUSTOM_ELEMENT:wi,DATA_ATTR:gi,DOCTYPE_NAME:Br,ERB_EXPR:fi,IS_ALLOWED_URI:zr,IS_SCRIPT_OR_DATA:bi,MUSTACHE_EXPR:pi,TMPLIT_EXPR:hi}),Dt={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,progressingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},vi=function(){return typeof window>"u"?null:window},ki=function(e,t){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let n=null,r="data-tt-policy-suffix";t&&t.hasAttribute(r)&&(n=t.getAttribute(r));let i="dompurify"+(n?"#"+n:"");try{return e.createPolicy(i,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+i+" could not be created."),null}},Pr=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Hr(){let s=arguments.length>0&&arguments[0]!==void 0?arguments[0]:vi(),e=F=>Hr(F);if(e.version="3.3.1",e.removed=[],!s||!s.document||s.document.nodeType!==Dt.document||!s.Element)return e.isSupported=!1,e;let{document:t}=s,n=t,r=n.currentScript,{DocumentFragment:i,HTMLTemplateElement:o,Node:l,Element:a,NodeFilter:d,NamedNodeMap:p=s.NamedNodeMap||s.MozNamedAttrMap,HTMLFormElement:u,DOMParser:h,trustedTypes:w}=s,A=a.prototype,k=Lt(A,"cloneNode"),R=Lt(A,"remove"),m=Lt(A,"nextSibling"),E=Lt(A,"childNodes"),$=Lt(A,"parentNode");if(typeof o=="function"){let F=t.createElement("template");F.content&&F.content.ownerDocument&&(t=F.content.ownerDocument)}let _,C="",{implementation:f,createNodeIterator:v,createDocumentFragment:b,getElementsByTagName:I}=t,{importNode:L}=n,O=Pr();e.isSupported=typeof Fr=="function"&&typeof $=="function"&&f&&f.createHTMLDocument!==void 0;let{MUSTACHE_EXPR:z,ERB_EXPR:H,TMPLIT_EXPR:V,DATA_ATTR:Y,ARIA_ATTR:K,IS_SCRIPT_OR_DATA:ue,ATTR_WHITESPACE:ce,CUSTOM_ELEMENT:oe}=Or,{IS_ALLOWED_URI:ae}=Or,B=null,xe=W({},[...Lr,...Es,...Cs,...Rs,...Dr]),le=null,et=W({},[...Mr,...Is,...Nr,...Qt]),te=Object.seal(Ls(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Ne=null,qe=null,ye=Object.seal(Ls(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),ze=!0,Ce=!0,Oe=!1,Re=!0,Ae=!1,N=!0,Te=!1,je=!1,Ge=!1,x=!1,y=!1,U=!1,j=!0,g=!1,D="user-content-",G=!0,M=!1,J={},ne=null,dt=W({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),he=null,Ht=W({},["audio","video","img","source","image","track"]),vt=null,Ut=W({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),We="http://www.w3.org/1998/Math/MathML",ut="http://www.w3.org/2000/svg",q="http://www.w3.org/1999/xhtml",se=q,Ve=!1,qt=null,xn=W({},[We,ut,q],$s),jt=W({},["mi","mo","mn","ms","mtext"]),Gt=W({},["annotation-xml"]),An=W({},["title","style","font","a","script"]),kt=null,Sn=["application/xhtml+xml","text/html"],$n="text/html",fe=null,pt=null,Tn=t.createElement("form"),Zs=function(c){return c instanceof RegExp||c instanceof Function},us=function(){let c=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(pt&&pt===c)){if((!c||typeof c!="object")&&(c={}),c=Fe(c),kt=Sn.indexOf(c.PARSER_MEDIA_TYPE)===-1?$n:c.PARSER_MEDIA_TYPE,fe=kt==="application/xhtml+xml"?$s:Jt,B=Le(c,"ALLOWED_TAGS")?W({},c.ALLOWED_TAGS,fe):xe,le=Le(c,"ALLOWED_ATTR")?W({},c.ALLOWED_ATTR,fe):et,qt=Le(c,"ALLOWED_NAMESPACES")?W({},c.ALLOWED_NAMESPACES,$s):xn,vt=Le(c,"ADD_URI_SAFE_ATTR")?W(Fe(Ut),c.ADD_URI_SAFE_ATTR,fe):Ut,he=Le(c,"ADD_DATA_URI_TAGS")?W(Fe(Ht),c.ADD_DATA_URI_TAGS,fe):Ht,ne=Le(c,"FORBID_CONTENTS")?W({},c.FORBID_CONTENTS,fe):dt,Ne=Le(c,"FORBID_TAGS")?W({},c.FORBID_TAGS,fe):Fe({}),qe=Le(c,"FORBID_ATTR")?W({},c.FORBID_ATTR,fe):Fe({}),J=Le(c,"USE_PROFILES")?c.USE_PROFILES:!1,ze=c.ALLOW_ARIA_ATTR!==!1,Ce=c.ALLOW_DATA_ATTR!==!1,Oe=c.ALLOW_UNKNOWN_PROTOCOLS||!1,Re=c.ALLOW_SELF_CLOSE_IN_ATTR!==!1,Ae=c.SAFE_FOR_TEMPLATES||!1,N=c.SAFE_FOR_XML!==!1,Te=c.WHOLE_DOCUMENT||!1,x=c.RETURN_DOM||!1,y=c.RETURN_DOM_FRAGMENT||!1,U=c.RETURN_TRUSTED_TYPE||!1,Ge=c.FORCE_BODY||!1,j=c.SANITIZE_DOM!==!1,g=c.SANITIZE_NAMED_PROPS||!1,G=c.KEEP_CONTENT!==!1,M=c.IN_PLACE||!1,ae=c.ALLOWED_URI_REGEXP||zr,se=c.NAMESPACE||q,jt=c.MATHML_TEXT_INTEGRATION_POINTS||jt,Gt=c.HTML_INTEGRATION_POINTS||Gt,te=c.CUSTOM_ELEMENT_HANDLING||{},c.CUSTOM_ELEMENT_HANDLING&&Zs(c.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(te.tagNameCheck=c.CUSTOM_ELEMENT_HANDLING.tagNameCheck),c.CUSTOM_ELEMENT_HANDLING&&Zs(c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(te.attributeNameCheck=c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),c.CUSTOM_ELEMENT_HANDLING&&typeof c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(te.allowCustomizedBuiltInElements=c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),Ae&&(Ce=!1),y&&(x=!0),J&&(B=W({},Dr),le=[],J.html===!0&&(W(B,Lr),W(le,Mr)),J.svg===!0&&(W(B,Es),W(le,Is),W(le,Qt)),J.svgFilters===!0&&(W(B,Cs),W(le,Is),W(le,Qt)),J.mathMl===!0&&(W(B,Rs),W(le,Nr),W(le,Qt))),c.ADD_TAGS&&(typeof c.ADD_TAGS=="function"?ye.tagCheck=c.ADD_TAGS:(B===xe&&(B=Fe(B)),W(B,c.ADD_TAGS,fe))),c.ADD_ATTR&&(typeof c.ADD_ATTR=="function"?ye.attributeCheck=c.ADD_ATTR:(le===et&&(le=Fe(le)),W(le,c.ADD_ATTR,fe))),c.ADD_URI_SAFE_ATTR&&W(vt,c.ADD_URI_SAFE_ATTR,fe),c.FORBID_CONTENTS&&(ne===dt&&(ne=Fe(ne)),W(ne,c.FORBID_CONTENTS,fe)),c.ADD_FORBID_CONTENTS&&(ne===dt&&(ne=Fe(ne)),W(ne,c.ADD_FORBID_CONTENTS,fe)),G&&(B["#text"]=!0),Te&&W(B,["html","head","body"]),B.table&&(W(B,["tbody"]),delete Ne.tbody),c.TRUSTED_TYPES_POLICY){if(typeof c.TRUSTED_TYPES_POLICY.createHTML!="function")throw It('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof c.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw It('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');_=c.TRUSTED_TYPES_POLICY,C=_.createHTML("")}else _===void 0&&(_=ki(w,r)),_!==null&&typeof C=="string"&&(C=_.createHTML(""));ve&&ve(c),pt=c}},Ks=W({},[...Es,...Cs,...di]),Ys=W({},[...Rs,...ui]),En=function(c){let T=$(c);(!T||!T.tagName)&&(T={namespaceURI:se,tagName:"template"});let P=Jt(c.tagName),re=Jt(T.tagName);return qt[c.namespaceURI]?c.namespaceURI===ut?T.namespaceURI===q?P==="svg":T.namespaceURI===We?P==="svg"&&(re==="annotation-xml"||jt[re]):!!Ks[P]:c.namespaceURI===We?T.namespaceURI===q?P==="math":T.namespaceURI===ut?P==="math"&&Gt[re]:!!Ys[P]:c.namespaceURI===q?T.namespaceURI===ut&&!Gt[re]||T.namespaceURI===We&&!jt[re]?!1:!Ys[P]&&(An[P]||!Ks[P]):!!(kt==="application/xhtml+xml"&&qt[c.namespaceURI]):!1},Pe=function(c){Ct(e.removed,{element:c});try{$(c).removeChild(c)}catch{R(c)}},tt=function(c,T){try{Ct(e.removed,{attribute:T.getAttributeNode(c),from:T})}catch{Ct(e.removed,{attribute:null,from:T})}if(T.removeAttribute(c),c==="is")if(x||y)try{Pe(T)}catch{}else try{T.setAttribute(c,"")}catch{}},Xs=function(c){let T=null,P=null;if(Ge)c="<remove></remove>"+c;else{let pe=Ts(c,/^[\r\n\t ]+/);P=pe&&pe[0]}kt==="application/xhtml+xml"&&se===q&&(c='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+c+"</body></html>");let re=_?_.createHTML(c):c;if(se===q)try{T=new h().parseFromString(re,kt)}catch{}if(!T||!T.documentElement){T=f.createDocument(se,"template",null);try{T.documentElement.innerHTML=Ve?C:re}catch{}}let be=T.body||T.documentElement;return c&&P&&be.insertBefore(t.createTextNode(P),be.childNodes[0]||null),se===q?I.call(T,Te?"html":"body")[0]:Te?T.documentElement:be},Qs=function(c){return v.call(c.ownerDocument||c,c,d.SHOW_ELEMENT|d.SHOW_COMMENT|d.SHOW_TEXT|d.SHOW_PROCESSING_INSTRUCTION|d.SHOW_CDATA_SECTION,null)},ps=function(c){return c instanceof u&&(typeof c.nodeName!="string"||typeof c.textContent!="string"||typeof c.removeChild!="function"||!(c.attributes instanceof p)||typeof c.removeAttribute!="function"||typeof c.setAttribute!="function"||typeof c.namespaceURI!="string"||typeof c.insertBefore!="function"||typeof c.hasChildNodes!="function")},Js=function(c){return typeof l=="function"&&c instanceof l};function Be(F,c,T){Xt(F,P=>{P.call(e,c,T,pt)})}let er=function(c){let T=null;if(Be(O.beforeSanitizeElements,c,null),ps(c))return Pe(c),!0;let P=fe(c.nodeName);if(Be(O.uponSanitizeElement,c,{tagName:P,allowedTags:B}),N&&c.hasChildNodes()&&!Js(c.firstElementChild)&&we(/<[/\w!]/g,c.innerHTML)&&we(/<[/\w!]/g,c.textContent)||c.nodeType===Dt.progressingInstruction||N&&c.nodeType===Dt.comment&&we(/<[/\w]/g,c.data))return Pe(c),!0;if(!(ye.tagCheck instanceof Function&&ye.tagCheck(P))&&(!B[P]||Ne[P])){if(!Ne[P]&&sr(P)&&(te.tagNameCheck instanceof RegExp&&we(te.tagNameCheck,P)||te.tagNameCheck instanceof Function&&te.tagNameCheck(P)))return!1;if(G&&!ne[P]){let re=$(c)||c.parentNode,be=E(c)||c.childNodes;if(be&&re){let pe=be.length;for(let Se=pe-1;Se>=0;--Se){let He=k(be[Se],!0);He.__removalCount=(c.__removalCount||0)+1,re.insertBefore(He,m(c))}}}return Pe(c),!0}return c instanceof a&&!En(c)||(P==="noscript"||P==="noembed"||P==="noframes")&&we(/<\/no(script|embed|frames)/i,c.innerHTML)?(Pe(c),!0):(Ae&&c.nodeType===Dt.text&&(T=c.textContent,Xt([z,H,V],re=>{T=Rt(T,re," ")}),c.textContent!==T&&(Ct(e.removed,{element:c.cloneNode()}),c.textContent=T)),Be(O.afterSanitizeElements,c,null),!1)},tr=function(c,T,P){if(j&&(T==="id"||T==="name")&&(P in t||P in Tn))return!1;if(!(Ce&&!qe[T]&&we(Y,T))){if(!(ze&&we(K,T))){if(!(ye.attributeCheck instanceof Function&&ye.attributeCheck(T,c))){if(!le[T]||qe[T]){if(!(sr(c)&&(te.tagNameCheck instanceof RegExp&&we(te.tagNameCheck,c)||te.tagNameCheck instanceof Function&&te.tagNameCheck(c))&&(te.attributeNameCheck instanceof RegExp&&we(te.attributeNameCheck,T)||te.attributeNameCheck instanceof Function&&te.attributeNameCheck(T,c))||T==="is"&&te.allowCustomizedBuiltInElements&&(te.tagNameCheck instanceof RegExp&&we(te.tagNameCheck,P)||te.tagNameCheck instanceof Function&&te.tagNameCheck(P))))return!1}else if(!vt[T]){if(!we(ae,Rt(P,ce,""))){if(!((T==="src"||T==="xlink:href"||T==="href")&&c!=="script"&&oi(P,"data:")===0&&he[c])){if(!(Oe&&!we(ue,Rt(P,ce,"")))){if(P)return!1}}}}}}}return!0},sr=function(c){return c!=="annotation-xml"&&Ts(c,oe)},rr=function(c){Be(O.beforeSanitizeAttributes,c,null);let{attributes:T}=c;if(!T||ps(c))return;let P={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:le,forceKeepAttr:void 0},re=T.length;for(;re--;){let be=T[re],{name:pe,namespaceURI:Se,value:He}=be,ft=fe(pe),fs=He,ge=pe==="value"?fs:ai(fs);if(P.attrName=ft,P.attrValue=ge,P.keepAttr=!0,P.forceKeepAttr=void 0,Be(O.uponSanitizeAttribute,c,P),ge=P.attrValue,g&&(ft==="id"||ft==="name")&&(tt(pe,c),ge=D+ge),N&&we(/((--!?|])>)|<\/(style|title|textarea)/i,ge)){tt(pe,c);continue}if(ft==="attributename"&&Ts(ge,"href")){tt(pe,c);continue}if(P.forceKeepAttr)continue;if(!P.keepAttr){tt(pe,c);continue}if(!Re&&we(/\/>/i,ge)){tt(pe,c);continue}Ae&&Xt([z,H,V],ir=>{ge=Rt(ge,ir," ")});let nr=fe(c.nodeName);if(!tr(nr,ft,ge)){tt(pe,c);continue}if(_&&typeof w=="object"&&typeof w.getAttributeType=="function"&&!Se)switch(w.getAttributeType(nr,ft)){case"TrustedHTML":{ge=_.createHTML(ge);break}case"TrustedScriptURL":{ge=_.createScriptURL(ge);break}}if(ge!==fs)try{Se?c.setAttributeNS(Se,pe,ge):c.setAttribute(pe,ge),ps(c)?Pe(c):Ir(e.removed)}catch{tt(pe,c)}}Be(O.afterSanitizeAttributes,c,null)},Cn=function F(c){let T=null,P=Qs(c);for(Be(O.beforeSanitizeShadowDOM,c,null);T=P.nextNode();)Be(O.uponSanitizeShadowNode,T,null),er(T),rr(T),T.content instanceof i&&F(T.content);Be(O.afterSanitizeShadowDOM,c,null)};return e.sanitize=function(F){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},T=null,P=null,re=null,be=null;if(Ve=!F,Ve&&(F="<!-->"),typeof F!="string"&&!Js(F))if(typeof F.toString=="function"){if(F=F.toString(),typeof F!="string")throw It("dirty is not a string, aborting")}else throw It("toString is not a function");if(!e.isSupported)return F;if(je||us(c),e.removed=[],typeof F=="string"&&(M=!1),M){if(F.nodeName){let He=fe(F.nodeName);if(!B[He]||Ne[He])throw It("root node is forbidden and cannot be sanitized in-place")}}else if(F instanceof l)T=Xs("<!---->"),P=T.ownerDocument.importNode(F,!0),P.nodeType===Dt.element&&P.nodeName==="BODY"||P.nodeName==="HTML"?T=P:T.appendChild(P);else{if(!x&&!Ae&&!Te&&F.indexOf("<")===-1)return _&&U?_.createHTML(F):F;if(T=Xs(F),!T)return x?null:U?C:""}T&&Ge&&Pe(T.firstChild);let pe=Qs(M?F:T);for(;re=pe.nextNode();)er(re),rr(re),re.content instanceof i&&Cn(re.content);if(M)return F;if(x){if(y)for(be=b.call(T.ownerDocument);T.firstChild;)be.appendChild(T.firstChild);else be=T;return(le.shadowroot||le.shadowrootmode)&&(be=L.call(n,be,!0)),be}let Se=Te?T.outerHTML:T.innerHTML;return Te&&B["!doctype"]&&T.ownerDocument&&T.ownerDocument.doctype&&T.ownerDocument.doctype.name&&we(Br,T.ownerDocument.doctype.name)&&(Se="<!DOCTYPE "+T.ownerDocument.doctype.name+`>
`+Se),Ae&&Xt([z,H,V],He=>{Se=Rt(Se,He," ")}),_&&U?_.createHTML(Se):Se},e.setConfig=function(){let F=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};us(F),je=!0},e.clearConfig=function(){pt=null,je=!1},e.isValidAttribute=function(F,c,T){pt||us({});let P=fe(F),re=fe(c);return tr(P,re,T)},e.addHook=function(F,c){typeof c=="function"&&Ct(O[F],c)},e.removeHook=function(F,c){if(c!==void 0){let T=ni(O[F],c);return T===-1?void 0:ii(O[F],T,1)[0]}return Ir(O[F])},e.removeHooks=function(F){O[F]=[]},e.removeAllHooks=function(){O=Pr()},e}var Ur=Hr();var qr={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},jr=s=>(...e)=>({_$litDirective$:s,values:e}),es=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var Mt=class extends es{constructor(e){if(super(e),this.it=de,e.type!==qr.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===de||e==null)return this._t=void 0,this.it=e;if(e===it)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;let t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};Mt.directiveName="unsafeHTML",Mt.resultType=1;var Gr=jr(Mt);function Fs(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ct=Fs();function Qr(s){ct=s}var Ft={exec:()=>null};function Z(s,e=""){let t=typeof s=="string"?s:s.source,n={replace:(r,i)=>{let o=typeof i=="string"?i:i.source;return o=o.replace(_e.caret,"$1"),t=t.replace(r,o),n},getRegex:()=>new RegExp(t,e)};return n}var _i=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),_e={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:s=>new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}#`),htmlBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}<(?:[a-z].*>|!--)`,"i")},xi=/^(?:[ \t]*(?:\n|$))+/,Ai=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Si=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,zt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,$i=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,zs=/(?:[*+-]|\d{1,9}[.)])/,Jr=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,en=Z(Jr).replace(/bull/g,zs).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Ti=Z(Jr).replace(/bull/g,zs).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Bs=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Ei=/^[^\n]+/,Hs=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Ci=Z(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Hs).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Ri=Z(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,zs).getRegex(),os="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Us=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Ii=Z("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Us).replace("tag",os).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),tn=Z(Bs).replace("hr",zt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",os).getRegex(),Li=Z(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",tn).getRegex(),qs={blockquote:Li,code:Ai,def:Ci,fences:Si,heading:$i,hr:zt,html:Ii,lheading:en,list:Ri,newline:xi,paragraph:tn,table:Ft,text:Ei},Wr=Z("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",zt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",os).getRegex(),Di={...qs,lheading:Ti,table:Wr,paragraph:Z(Bs).replace("hr",zt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Wr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",os).getRegex()},Mi={...qs,html:Z(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Us).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Ft,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Z(Bs).replace("hr",zt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",en).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Ni=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Oi=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,sn=/^( {2,}|\\)\n(?!\s*$)/,Pi=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,as=/[\p{P}\p{S}]/u,js=/[\s\p{P}\p{S}]/u,rn=/[^\s\p{P}\p{S}]/u,Fi=Z(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,js).getRegex(),nn=/(?!~)[\p{P}\p{S}]/u,zi=/(?!~)[\s\p{P}\p{S}]/u,Bi=/(?:[^\s\p{P}\p{S}]|~)/u,Hi=Z(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",_i?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),on=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Ui=Z(on,"u").replace(/punct/g,as).getRegex(),qi=Z(on,"u").replace(/punct/g,nn).getRegex(),an="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",ji=Z(an,"gu").replace(/notPunctSpace/g,rn).replace(/punctSpace/g,js).replace(/punct/g,as).getRegex(),Gi=Z(an,"gu").replace(/notPunctSpace/g,Bi).replace(/punctSpace/g,zi).replace(/punct/g,nn).getRegex(),Wi=Z("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,rn).replace(/punctSpace/g,js).replace(/punct/g,as).getRegex(),Vi=Z(/\\(punct)/,"gu").replace(/punct/g,as).getRegex(),Zi=Z(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Ki=Z(Us).replace("(?:-->|$)","-->").getRegex(),Yi=Z("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Ki).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),rs=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Xi=Z(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",rs).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),ln=Z(/^!?\[(label)\]\[(ref)\]/).replace("label",rs).replace("ref",Hs).getRegex(),cn=Z(/^!?\[(ref)\](?:\[\])?/).replace("ref",Hs).getRegex(),Qi=Z("reflink|nolink(?!\\()","g").replace("reflink",ln).replace("nolink",cn).getRegex(),Vr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Gs={_backpedal:Ft,anyPunctuation:Vi,autolink:Zi,blockSkip:Hi,br:sn,code:Oi,del:Ft,emStrongLDelim:Ui,emStrongRDelimAst:ji,emStrongRDelimUnd:Wi,escape:Ni,link:Xi,nolink:cn,punctuation:Fi,reflink:ln,reflinkSearch:Qi,tag:Yi,text:Pi,url:Ft},Ji={...Gs,link:Z(/^!?\[(label)\]\((.*?)\)/).replace("label",rs).getRegex(),reflink:Z(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",rs).getRegex()},Ns={...Gs,emStrongRDelimAst:Gi,emStrongLDelim:qi,url:Z(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Vr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:Z(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Vr).getRegex()},eo={...Ns,br:Z(sn).replace("{2,}","*").getRegex(),text:Z(Ns.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},ts={normal:qs,gfm:Di,pedantic:Mi},Nt={normal:Gs,gfm:Ns,breaks:eo,pedantic:Ji},to={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Zr=s=>to[s];function Ue(s,e){if(e){if(_e.escapeTest.test(s))return s.replace(_e.escapeReplace,Zr)}else if(_e.escapeTestNoEncode.test(s))return s.replace(_e.escapeReplaceNoEncode,Zr);return s}function Kr(s){try{s=encodeURI(s).replace(_e.percentDecode,"%")}catch{return null}return s}function Yr(s,e){let t=s.replace(_e.findPipe,(i,o,l)=>{let a=!1,d=o;for(;--d>=0&&l[d]==="\\";)a=!a;return a?"|":" |"}),n=t.split(_e.splitPipe),r=0;if(n[0].trim()||n.shift(),n.length>0&&!n.at(-1)?.trim()&&n.pop(),e)if(n.length>e)n.splice(e);else for(;n.length<e;)n.push("");for(;r<n.length;r++)n[r]=n[r].trim().replace(_e.slashPipe,"|");return n}function Ot(s,e,t){let n=s.length;if(n===0)return"";let r=0;for(;r<n;){let i=s.charAt(n-r-1);if(i===e&&!t)r++;else if(i!==e&&t)r++;else break}return s.slice(0,n-r)}function so(s,e){if(s.indexOf(e[1])===-1)return-1;let t=0;for(let n=0;n<s.length;n++)if(s[n]==="\\")n++;else if(s[n]===e[0])t++;else if(s[n]===e[1]&&(t--,t<0))return n;return t>0?-2:-1}function Xr(s,e,t,n,r){let i=e.href,o=e.title||null,l=s[1].replace(r.other.outputLinkReplace,"$1");n.state.inLink=!0;let a={type:s[0].charAt(0)==="!"?"image":"link",raw:t,href:i,title:o,text:l,tokens:n.inlineTokens(l)};return n.state.inLink=!1,a}function ro(s,e,t){let n=s.match(t.other.indentCodeCompensation);if(n===null)return e;let r=n[1];return e.split(`
`).map(i=>{let o=i.match(t.other.beginningSpace);if(o===null)return i;let[l]=o;return l.length>=r.length?i.slice(r.length):i}).join(`
`)}var ns=class{constructor(s){ee(this,"options");ee(this,"rules");ee(this,"lexer");this.options=s||ct}space(s){let e=this.rules.block.newline.exec(s);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(s){let e=this.rules.block.code.exec(s);if(e){let t=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?t:Ot(t,`
`)}}}fences(s){let e=this.rules.block.fences.exec(s);if(e){let t=e[0],n=ro(t,e[3]||"",this.rules);return{type:"code",raw:t,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:n}}}heading(s){let e=this.rules.block.heading.exec(s);if(e){let t=e[2].trim();if(this.rules.other.endingHash.test(t)){let n=Ot(t,"#");(this.options.pedantic||!n||this.rules.other.endingSpaceChar.test(n))&&(t=n.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:t,tokens:this.lexer.inline(t)}}}hr(s){let e=this.rules.block.hr.exec(s);if(e)return{type:"hr",raw:Ot(e[0],`
`)}}blockquote(s){let e=this.rules.block.blockquote.exec(s);if(e){let t=Ot(e[0],`
`).split(`
`),n="",r="",i=[];for(;t.length>0;){let o=!1,l=[],a;for(a=0;a<t.length;a++)if(this.rules.other.blockquoteStart.test(t[a]))l.push(t[a]),o=!0;else if(!o)l.push(t[a]);else break;t=t.slice(a);let d=l.join(`
`),p=d.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");n=n?`${n}
${d}`:d,r=r?`${r}
${p}`:p;let u=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(p,i,!0),this.lexer.state.top=u,t.length===0)break;let h=i.at(-1);if(h?.type==="code")break;if(h?.type==="blockquote"){let w=h,A=w.raw+`
`+t.join(`
`),k=this.blockquote(A);i[i.length-1]=k,n=n.substring(0,n.length-w.raw.length)+k.raw,r=r.substring(0,r.length-w.text.length)+k.text;break}else if(h?.type==="list"){let w=h,A=w.raw+`
`+t.join(`
`),k=this.list(A);i[i.length-1]=k,n=n.substring(0,n.length-h.raw.length)+k.raw,r=r.substring(0,r.length-w.raw.length)+k.raw,t=A.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:n,tokens:i,text:r}}}list(s){let e=this.rules.block.list.exec(s);if(e){let t=e[1].trim(),n=t.length>1,r={type:"list",raw:"",ordered:n,start:n?+t.slice(0,-1):"",loose:!1,items:[]};t=n?`\\d{1,9}\\${t.slice(-1)}`:`\\${t}`,this.options.pedantic&&(t=n?t:"[*+-]");let i=this.rules.other.listItemRegex(t),o=!1;for(;s;){let a=!1,d="",p="";if(!(e=i.exec(s))||this.rules.block.hr.test(s))break;d=e[0],s=s.substring(d.length);let u=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,k=>" ".repeat(3*k.length)),h=s.split(`
`,1)[0],w=!u.trim(),A=0;if(this.options.pedantic?(A=2,p=u.trimStart()):w?A=e[1].length+1:(A=e[2].search(this.rules.other.nonSpaceChar),A=A>4?1:A,p=u.slice(A),A+=e[1].length),w&&this.rules.other.blankLine.test(h)&&(d+=h+`
`,s=s.substring(h.length+1),a=!0),!a){let k=this.rules.other.nextBulletRegex(A),R=this.rules.other.hrRegex(A),m=this.rules.other.fencesBeginRegex(A),E=this.rules.other.headingBeginRegex(A),$=this.rules.other.htmlBeginRegex(A);for(;s;){let _=s.split(`
`,1)[0],C;if(h=_,this.options.pedantic?(h=h.replace(this.rules.other.listReplaceNesting,"  "),C=h):C=h.replace(this.rules.other.tabCharGlobal,"    "),m.test(h)||E.test(h)||$.test(h)||k.test(h)||R.test(h))break;if(C.search(this.rules.other.nonSpaceChar)>=A||!h.trim())p+=`
`+C.slice(A);else{if(w||u.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||m.test(u)||E.test(u)||R.test(u))break;p+=`
`+h}!w&&!h.trim()&&(w=!0),d+=_+`
`,s=s.substring(_.length+1),u=C.slice(A)}}r.loose||(o?r.loose=!0:this.rules.other.doubleBlankLine.test(d)&&(o=!0)),r.items.push({type:"list_item",raw:d,task:!!this.options.gfm&&this.rules.other.listIsTask.test(p),loose:!1,text:p,tokens:[]}),r.raw+=d}let l=r.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let a of r.items){if(this.lexer.state.top=!1,a.tokens=this.lexer.blockTokens(a.text,[]),a.task){if(a.text=a.text.replace(this.rules.other.listReplaceTask,""),a.tokens[0]?.type==="text"||a.tokens[0]?.type==="paragraph"){a.tokens[0].raw=a.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),a.tokens[0].text=a.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let p=this.lexer.inlineQueue.length-1;p>=0;p--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[p].src)){this.lexer.inlineQueue[p].src=this.lexer.inlineQueue[p].src.replace(this.rules.other.listReplaceTask,"");break}}let d=this.rules.other.listTaskCheckbox.exec(a.raw);if(d){let p={type:"checkbox",raw:d[0]+" ",checked:d[0]!=="[ ]"};a.checked=p.checked,r.loose?a.tokens[0]&&["paragraph","text"].includes(a.tokens[0].type)&&"tokens"in a.tokens[0]&&a.tokens[0].tokens?(a.tokens[0].raw=p.raw+a.tokens[0].raw,a.tokens[0].text=p.raw+a.tokens[0].text,a.tokens[0].tokens.unshift(p)):a.tokens.unshift({type:"paragraph",raw:p.raw,text:p.raw,tokens:[p]}):a.tokens.unshift(p)}}if(!r.loose){let d=a.tokens.filter(u=>u.type==="space"),p=d.length>0&&d.some(u=>this.rules.other.anyLine.test(u.raw));r.loose=p}}if(r.loose)for(let a of r.items){a.loose=!0;for(let d of a.tokens)d.type==="text"&&(d.type="paragraph")}return r}}html(s){let e=this.rules.block.html.exec(s);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(s){let e=this.rules.block.def.exec(s);if(e){let t=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),n=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:t,raw:e[0],href:n,title:r}}}table(s){let e=this.rules.block.table.exec(s);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let t=Yr(e[1]),n=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(t.length===n.length){for(let o of n)this.rules.other.tableAlignRight.test(o)?i.align.push("right"):this.rules.other.tableAlignCenter.test(o)?i.align.push("center"):this.rules.other.tableAlignLeft.test(o)?i.align.push("left"):i.align.push(null);for(let o=0;o<t.length;o++)i.header.push({text:t[o],tokens:this.lexer.inline(t[o]),header:!0,align:i.align[o]});for(let o of r)i.rows.push(Yr(o,i.header.length).map((l,a)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:i.align[a]})));return i}}lheading(s){let e=this.rules.block.lheading.exec(s);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(s){let e=this.rules.block.paragraph.exec(s);if(e){let t=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:t,tokens:this.lexer.inline(t)}}}text(s){let e=this.rules.block.text.exec(s);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(s){let e=this.rules.inline.escape.exec(s);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(s){let e=this.rules.inline.tag.exec(s);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(s){let e=this.rules.inline.link.exec(s);if(e){let t=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(t)){if(!this.rules.other.endAngleBracket.test(t))return;let i=Ot(t.slice(0,-1),"\\");if((t.length-i.length)%2===0)return}else{let i=so(e[2],"()");if(i===-2)return;if(i>-1){let o=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,o).trim(),e[3]=""}}let n=e[2],r="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(n);i&&(n=i[1],r=i[3])}else r=e[3]?e[3].slice(1,-1):"";return n=n.trim(),this.rules.other.startAngleBracket.test(n)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(t)?n=n.slice(1):n=n.slice(1,-1)),Xr(e,{href:n&&n.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(s,e){let t;if((t=this.rules.inline.reflink.exec(s))||(t=this.rules.inline.nolink.exec(s))){let n=(t[2]||t[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=e[n.toLowerCase()];if(!r){let i=t[0].charAt(0);return{type:"text",raw:i,text:i}}return Xr(t,r,t[0],this.lexer,this.rules)}}emStrong(s,e,t=""){let n=this.rules.inline.emStrongLDelim.exec(s);if(!(!n||n[3]&&t.match(this.rules.other.unicodeAlphaNumeric))&&(!(n[1]||n[2])||!t||this.rules.inline.punctuation.exec(t))){let r=[...n[0]].length-1,i,o,l=r,a=0,d=n[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(d.lastIndex=0,e=e.slice(-1*s.length+r);(n=d.exec(e))!=null;){if(i=n[1]||n[2]||n[3]||n[4]||n[5]||n[6],!i)continue;if(o=[...i].length,n[3]||n[4]){l+=o;continue}else if((n[5]||n[6])&&r%3&&!((r+o)%3)){a+=o;continue}if(l-=o,l>0)continue;o=Math.min(o,o+l+a);let p=[...n[0]][0].length,u=s.slice(0,r+n.index+p+o);if(Math.min(r,o)%2){let w=u.slice(1,-1);return{type:"em",raw:u,text:w,tokens:this.lexer.inlineTokens(w)}}let h=u.slice(2,-2);return{type:"strong",raw:u,text:h,tokens:this.lexer.inlineTokens(h)}}}}codespan(s){let e=this.rules.inline.code.exec(s);if(e){let t=e[2].replace(this.rules.other.newLineCharGlobal," "),n=this.rules.other.nonSpaceChar.test(t),r=this.rules.other.startingSpaceChar.test(t)&&this.rules.other.endingSpaceChar.test(t);return n&&r&&(t=t.substring(1,t.length-1)),{type:"codespan",raw:e[0],text:t}}}br(s){let e=this.rules.inline.br.exec(s);if(e)return{type:"br",raw:e[0]}}del(s){let e=this.rules.inline.del.exec(s);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(s){let e=this.rules.inline.autolink.exec(s);if(e){let t,n;return e[2]==="@"?(t=e[1],n="mailto:"+t):(t=e[1],n=t),{type:"link",raw:e[0],text:t,href:n,tokens:[{type:"text",raw:t,text:t}]}}}url(s){let e;if(e=this.rules.inline.url.exec(s)){let t,n;if(e[2]==="@")t=e[0],n="mailto:"+t;else{let r;do r=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(r!==e[0]);t=e[0],e[1]==="www."?n="http://"+e[0]:n=e[0]}return{type:"link",raw:e[0],text:t,href:n,tokens:[{type:"text",raw:t,text:t}]}}}inlineText(s){let e=this.rules.inline.text.exec(s);if(e){let t=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:t}}}},De=class Os{constructor(e){ee(this,"tokens");ee(this,"options");ee(this,"state");ee(this,"inlineQueue");ee(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ct,this.options.tokenizer=this.options.tokenizer||new ns,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={other:_e,block:ts.normal,inline:Nt.normal};this.options.pedantic?(t.block=ts.pedantic,t.inline=Nt.pedantic):this.options.gfm&&(t.block=ts.gfm,this.options.breaks?t.inline=Nt.breaks:t.inline=Nt.gfm),this.tokenizer.rules=t}static get rules(){return{block:ts,inline:Nt}}static lex(e,t){return new Os(t).lex(e)}static lexInline(e,t){return new Os(t).inlineTokens(e)}lex(e){e=e.replace(_e.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){let n=this.inlineQueue[t];this.inlineTokens(n.src,n.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],n=!1){for(this.options.pedantic&&(e=e.replace(_e.tabCharGlobal,"    ").replace(_e.spaceLine,""));e;){let r;if(this.options.extensions?.block?.some(o=>(r=o.call({lexer:this},e,t))?(e=e.substring(r.raw.length),t.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let o=t.at(-1);r.raw.length===1&&o!==void 0?o.raw+=`
`:t.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);let o=t.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.text,this.inlineQueue.at(-1).src=o.text):t.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);let o=t.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},t.push(r));continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),t.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let o=1/0,l=e.slice(1),a;this.options.extensions.startBlock.forEach(d=>{a=d.call({lexer:this},l),typeof a=="number"&&a>=0&&(o=Math.min(o,a))}),o<1/0&&o>=0&&(i=e.substring(0,o+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let o=t.at(-1);n&&o?.type==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):t.push(r),n=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);let o=t.at(-1);o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):t.push(r);continue}if(e){let o="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(o);break}else throw new Error(o)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let n=e,r=null;if(this.tokens.links){let a=Object.keys(this.tokens.links);if(a.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(n))!=null;)a.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(n=n.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(n))!=null;)n=n.slice(0,r.index)+"++"+n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(n))!=null;)i=r[2]?r[2].length:0,n=n.slice(0,r.index+i)+"["+"a".repeat(r[0].length-i-2)+"]"+n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);n=this.options.hooks?.emStrongMask?.call({lexer:this},n)??n;let o=!1,l="";for(;e;){o||(l=""),o=!1;let a;if(this.options.extensions?.inline?.some(p=>(a=p.call({lexer:this},e,t))?(e=e.substring(a.raw.length),t.push(a),!0):!1))continue;if(a=this.tokenizer.escape(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.tag(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.link(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(a.raw.length);let p=t.at(-1);a.type==="text"&&p?.type==="text"?(p.raw+=a.raw,p.text+=a.text):t.push(a);continue}if(a=this.tokenizer.emStrong(e,n,l)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.codespan(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.br(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.del(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.autolink(e)){e=e.substring(a.raw.length),t.push(a);continue}if(!this.state.inLink&&(a=this.tokenizer.url(e))){e=e.substring(a.raw.length),t.push(a);continue}let d=e;if(this.options.extensions?.startInline){let p=1/0,u=e.slice(1),h;this.options.extensions.startInline.forEach(w=>{h=w.call({lexer:this},u),typeof h=="number"&&h>=0&&(p=Math.min(p,h))}),p<1/0&&p>=0&&(d=e.substring(0,p+1))}if(a=this.tokenizer.inlineText(d)){e=e.substring(a.raw.length),a.raw.slice(-1)!=="_"&&(l=a.raw.slice(-1)),o=!0;let p=t.at(-1);p?.type==="text"?(p.raw+=a.raw,p.text+=a.text):t.push(a);continue}if(e){let p="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(p);break}else throw new Error(p)}}return t}},is=class{constructor(s){ee(this,"options");ee(this,"parser");this.options=s||ct}space(s){return""}code({text:s,lang:e,escaped:t}){let n=(e||"").match(_e.notSpaceStart)?.[0],r=s.replace(_e.endingNewline,"")+`
`;return n?'<pre><code class="language-'+Ue(n)+'">'+(t?r:Ue(r,!0))+`</code></pre>
`:"<pre><code>"+(t?r:Ue(r,!0))+`</code></pre>
`}blockquote({tokens:s}){return`<blockquote>
${this.parser.parse(s)}</blockquote>
`}html({text:s}){return s}def(s){return""}heading({tokens:s,depth:e}){return`<h${e}>${this.parser.parseInline(s)}</h${e}>
`}hr(s){return`<hr>
`}list(s){let e=s.ordered,t=s.start,n="";for(let o=0;o<s.items.length;o++){let l=s.items[o];n+=this.listitem(l)}let r=e?"ol":"ul",i=e&&t!==1?' start="'+t+'"':"";return"<"+r+i+`>
`+n+"</"+r+`>
`}listitem(s){return`<li>${this.parser.parse(s.tokens)}</li>
`}checkbox({checked:s}){return"<input "+(s?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:s}){return`<p>${this.parser.parseInline(s)}</p>
`}table(s){let e="",t="";for(let r=0;r<s.header.length;r++)t+=this.tablecell(s.header[r]);e+=this.tablerow({text:t});let n="";for(let r=0;r<s.rows.length;r++){let i=s.rows[r];t="";for(let o=0;o<i.length;o++)t+=this.tablecell(i[o]);n+=this.tablerow({text:t})}return n&&(n=`<tbody>${n}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+n+`</table>
`}tablerow({text:s}){return`<tr>
${s}</tr>
`}tablecell(s){let e=this.parser.parseInline(s.tokens),t=s.header?"th":"td";return(s.align?`<${t} align="${s.align}">`:`<${t}>`)+e+`</${t}>
`}strong({tokens:s}){return`<strong>${this.parser.parseInline(s)}</strong>`}em({tokens:s}){return`<em>${this.parser.parseInline(s)}</em>`}codespan({text:s}){return`<code>${Ue(s,!0)}</code>`}br(s){return"<br>"}del({tokens:s}){return`<del>${this.parser.parseInline(s)}</del>`}link({href:s,title:e,tokens:t}){let n=this.parser.parseInline(t),r=Kr(s);if(r===null)return n;s=r;let i='<a href="'+s+'"';return e&&(i+=' title="'+Ue(e)+'"'),i+=">"+n+"</a>",i}image({href:s,title:e,text:t,tokens:n}){n&&(t=this.parser.parseInline(n,this.parser.textRenderer));let r=Kr(s);if(r===null)return Ue(t);s=r;let i=`<img src="${s}" alt="${t}"`;return e&&(i+=` title="${Ue(e)}"`),i+=">",i}text(s){return"tokens"in s&&s.tokens?this.parser.parseInline(s.tokens):"escaped"in s&&s.escaped?s.text:Ue(s.text)}},Ws=class{strong({text:s}){return s}em({text:s}){return s}codespan({text:s}){return s}del({text:s}){return s}html({text:s}){return s}text({text:s}){return s}link({text:s}){return""+s}image({text:s}){return""+s}br(){return""}checkbox({raw:s}){return s}},Me=class Ps{constructor(e){ee(this,"options");ee(this,"renderer");ee(this,"textRenderer");this.options=e||ct,this.options.renderer=this.options.renderer||new is,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Ws}static parse(e,t){return new Ps(t).parse(e)}static parseInline(e,t){return new Ps(t).parseInline(e)}parse(e){let t="";for(let n=0;n<e.length;n++){let r=e[n];if(this.options.extensions?.renderers?.[r.type]){let o=r,l=this.options.extensions.renderers[o.type].call({parser:this},o);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(o.type)){t+=l||"";continue}}let i=r;switch(i.type){case"space":{t+=this.renderer.space(i);break}case"hr":{t+=this.renderer.hr(i);break}case"heading":{t+=this.renderer.heading(i);break}case"code":{t+=this.renderer.code(i);break}case"table":{t+=this.renderer.table(i);break}case"blockquote":{t+=this.renderer.blockquote(i);break}case"list":{t+=this.renderer.list(i);break}case"checkbox":{t+=this.renderer.checkbox(i);break}case"html":{t+=this.renderer.html(i);break}case"def":{t+=this.renderer.def(i);break}case"paragraph":{t+=this.renderer.paragraph(i);break}case"text":{t+=this.renderer.text(i);break}default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return t}parseInline(e,t=this.renderer){let n="";for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let l=this.options.extensions.renderers[i.type].call({parser:this},i);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){n+=l||"";continue}}let o=i;switch(o.type){case"escape":{n+=t.text(o);break}case"html":{n+=t.html(o);break}case"link":{n+=t.link(o);break}case"image":{n+=t.image(o);break}case"checkbox":{n+=t.checkbox(o);break}case"strong":{n+=t.strong(o);break}case"em":{n+=t.em(o);break}case"codespan":{n+=t.codespan(o);break}case"br":{n+=t.br(o);break}case"del":{n+=t.del(o);break}case"text":{n+=t.text(o);break}default:{let l='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return n}},ss,Pt=(ss=class{constructor(s){ee(this,"options");ee(this,"block");this.options=s||ct}preprocess(s){return s}postprocess(s){return s}processAllTokens(s){return s}emStrongMask(s){return s}provideLexer(){return this.block?De.lex:De.lexInline}provideParser(){return this.block?Me.parse:Me.parseInline}},ee(ss,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),ee(ss,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),ss),no=class{constructor(...s){ee(this,"defaults",Fs());ee(this,"options",this.setOptions);ee(this,"parse",this.parseMarkdown(!0));ee(this,"parseInline",this.parseMarkdown(!1));ee(this,"Parser",Me);ee(this,"Renderer",is);ee(this,"TextRenderer",Ws);ee(this,"Lexer",De);ee(this,"Tokenizer",ns);ee(this,"Hooks",Pt);this.use(...s)}walkTokens(s,e){let t=[];for(let n of s)switch(t=t.concat(e.call(this,n)),n.type){case"table":{let r=n;for(let i of r.header)t=t.concat(this.walkTokens(i.tokens,e));for(let i of r.rows)for(let o of i)t=t.concat(this.walkTokens(o.tokens,e));break}case"list":{let r=n;t=t.concat(this.walkTokens(r.items,e));break}default:{let r=n;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{let o=r[i].flat(1/0);t=t.concat(this.walkTokens(o,e))}):r.tokens&&(t=t.concat(this.walkTokens(r.tokens,e)))}}return t}use(...s){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return s.forEach(t=>{let n={...t};if(n.async=this.defaults.async||n.async||!1,t.extensions&&(t.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let i=e.renderers[r.name];i?e.renderers[r.name]=function(...o){let l=r.renderer.apply(this,o);return l===!1&&(l=i.apply(this,o)),l}:e.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[r.level];i?i.unshift(r.tokenizer):e[r.level]=[r.tokenizer],r.start&&(r.level==="block"?e.startBlock?e.startBlock.push(r.start):e.startBlock=[r.start]:r.level==="inline"&&(e.startInline?e.startInline.push(r.start):e.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(e.childTokens[r.name]=r.childTokens)}),n.extensions=e),t.renderer){let r=this.defaults.renderer||new is(this.defaults);for(let i in t.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let o=i,l=t.renderer[o],a=r[o];r[o]=(...d)=>{let p=l.apply(r,d);return p===!1&&(p=a.apply(r,d)),p||""}}n.renderer=r}if(t.tokenizer){let r=this.defaults.tokenizer||new ns(this.defaults);for(let i in t.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let o=i,l=t.tokenizer[o],a=r[o];r[o]=(...d)=>{let p=l.apply(r,d);return p===!1&&(p=a.apply(r,d)),p}}n.tokenizer=r}if(t.hooks){let r=this.defaults.hooks||new Pt;for(let i in t.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let o=i,l=t.hooks[o],a=r[o];Pt.passThroughHooks.has(i)?r[o]=d=>{if(this.defaults.async&&Pt.passThroughHooksRespectAsync.has(i))return(async()=>{let u=await l.call(r,d);return a.call(r,u)})();let p=l.call(r,d);return a.call(r,p)}:r[o]=(...d)=>{if(this.defaults.async)return(async()=>{let u=await l.apply(r,d);return u===!1&&(u=await a.apply(r,d)),u})();let p=l.apply(r,d);return p===!1&&(p=a.apply(r,d)),p}}n.hooks=r}if(t.walkTokens){let r=this.defaults.walkTokens,i=t.walkTokens;n.walkTokens=function(o){let l=[];return l.push(i.call(this,o)),r&&(l=l.concat(r.call(this,o))),l}}this.defaults={...this.defaults,...n}}),this}setOptions(s){return this.defaults={...this.defaults,...s},this}lexer(s,e){return De.lex(s,e??this.defaults)}parser(s,e){return Me.parse(s,e??this.defaults)}parseMarkdown(s){return(e,t)=>{let n={...t},r={...this.defaults,...n},i=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&n.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=s),r.async)return(async()=>{let o=r.hooks?await r.hooks.preprocess(e):e,l=await(r.hooks?await r.hooks.provideLexer():s?De.lex:De.lexInline)(o,r),a=r.hooks?await r.hooks.processAllTokens(l):l;r.walkTokens&&await Promise.all(this.walkTokens(a,r.walkTokens));let d=await(r.hooks?await r.hooks.provideParser():s?Me.parse:Me.parseInline)(a,r);return r.hooks?await r.hooks.postprocess(d):d})().catch(i);try{r.hooks&&(e=r.hooks.preprocess(e));let o=(r.hooks?r.hooks.provideLexer():s?De.lex:De.lexInline)(e,r);r.hooks&&(o=r.hooks.processAllTokens(o)),r.walkTokens&&this.walkTokens(o,r.walkTokens);let l=(r.hooks?r.hooks.provideParser():s?Me.parse:Me.parseInline)(o,r);return r.hooks&&(l=r.hooks.postprocess(l)),l}catch(o){return i(o)}}}onError(s,e){return t=>{if(t.message+=`
Please report this to https://github.com/markedjs/marked.`,s){let n="<p>An error occurred:</p><pre>"+Ue(t.message+"",!0)+"</pre>";return e?Promise.resolve(n):n}if(e)return Promise.reject(t);throw t}}},lt=new no;function Q(s,e){return lt.parse(s,e)}Q.options=Q.setOptions=function(s){return lt.setOptions(s),Q.defaults=lt.defaults,Qr(Q.defaults),Q};Q.getDefaults=Fs;Q.defaults=ct;Q.use=function(...s){return lt.use(...s),Q.defaults=lt.defaults,Qr(Q.defaults),Q};Q.walkTokens=function(s,e){return lt.walkTokens(s,e)};Q.parseInline=lt.parseInline;Q.Parser=Me;Q.parser=Me.parse;Q.Renderer=is;Q.TextRenderer=Ws;Q.Lexer=De;Q.lexer=De.lex;Q.Tokenizer=ns;Q.Hooks=Pt;Q.parse=Q;var ta=Q.options,sa=Q.setOptions,ra=Q.use,na=Q.walkTokens,ia=Q.parseInline;var oa=Me.parse,aa=De.lex;function Bt(s){let e=Q.parse(s),t=Ur.sanitize(e);return Gr(t)}function Je(s){switch((s||"").toString()){case"open":return"Open";case"in_progress":return"In progress";case"closed":return"Closed";default:return(s||"").toString()||"Open"}}function io(s){window.location.hash=s}function dn(s,e,t=io,n=void 0){let r=X("views:detail"),i=null,o=null,l=!1,a=!1,d=!1,p=!1,u=!1,h=!1,w=!1,A="";function k(g){let D=Ss(window.location.hash||"");return Ye(D,g)}function R(g){ie(S`
        <div class="panel__body" id="detail-root">
          <p class="muted">${g}</p>
        </div>
      `,s)}function m(){if(!o||!n||typeof n.snapshotFor!="function")return;let g=n.snapshotFor(`detail:${o}`);Array.isArray(g)&&g.length>0&&(i=g.find(G=>String(G.id)===String(o))||g[0])}n&&typeof n.subscribe=="function"&&n.subscribe(()=>{try{m(),N()}catch(g){r("issue stores listener error %o",g)}});let E=()=>{a=!0,N()},$=g=>{g.key==="Enter"?(a=!0,N()):g.key==="Escape"&&(a=!1,N())},_=async()=>{if(!i||l)return;let g=s.querySelector("h2 input"),D=i.title||"",G=g?g.value:"";if(G===D){a=!1,N();return}l=!0,g&&(g.disabled=!0);try{r("save title %s \u2192 %s",String(i.id),G);let M=await e("edit-text",{id:i.id,field:"title",value:G});M&&typeof M=="object"&&(i=M,a=!1,N())}catch(M){r("save title failed %s %o",String(i.id),M),i.title=D,a=!1,N(),me("Failed to save title","error")}finally{l=!1}},C=()=>{a=!1,N()},f=()=>{w=!0,N()},v=g=>{g.key==="Enter"?(g.preventDefault(),w=!0,N()):g.key==="Escape"&&(g.preventDefault(),w=!1,N())},b=async()=>{if(!i||l)return;let g=s.querySelector("#detail-root .prop.assignee input"),D=i?.assignee??"",G=g?.value??"";if(G===D){w=!1,N();return}l=!0,g&&(g.disabled=!0);try{r("save assignee %s \u2192 %s",String(i.id),G);let M=await e("update-assignee",{id:i.id,assignee:G});M&&typeof M=="object"&&(i=M,w=!1,N())}catch(M){r("save assignee failed %s %o",String(i.id),M),i.assignee=D,w=!1,N(),me("Failed to update assignee","error")}finally{l=!1}},I=()=>{w=!1,N()},L=g=>{A=g.currentTarget.value||""};function O(g){g.key==="Enter"&&(g.preventDefault(),z())}async function z(){if(!i||l)return;let g=A.trim();if(g){l=!0;try{r("add label %s \u2192 %s",String(i.id),g);let D=await e("label-add",{id:i.id,label:g});D&&typeof D=="object"&&(i=D,A="",N())}catch(D){r("add label failed %s %o",String(i.id),D),me("Failed to add label","error")}finally{l=!1}}}async function H(g){if(!(!i||l)){l=!0;try{r("remove label %s \u2192 %s",String(i?.id||""),g);let D=await e("label-remove",{id:i.id,label:g});D&&typeof D=="object"&&(i=D,N())}catch(D){r("remove label failed %s %o",String(i?.id||""),D),me("Failed to remove label","error")}finally{l=!1}}}let V=async g=>{if(!i||l){N();return}let D=g.currentTarget,G=i.status||"open",M=D.value;if(M!==G){l=!0,i.status=M,N();try{r("update status %s \u2192 %s",String(i.id),M);let J=await e("update-status",{id:i.id,status:M});J&&typeof J=="object"&&(i=J,N())}catch(J){r("update status failed %s %o",String(i.id),J),i.status=G,N(),me("Failed to update status","error")}finally{l=!1}}},Y=async g=>{if(!i||l){N();return}let D=g.currentTarget,G=typeof i.priority=="number"?i.priority:2,M=Number(D.value);if(M!==G){l=!0,i.priority=M,N();try{r("update priority %s \u2192 %d",String(i.id),M);let J=await e("update-priority",{id:i.id,priority:M});J&&typeof J=="object"&&(i=J,N())}catch(J){r("update priority failed %s %o",String(i.id),J),i.priority=G,N(),me("Failed to update priority","error")}finally{l=!1}}},K=()=>{d=!0,N()},ue=g=>{if(g.key==="Escape")d=!1,N();else if(g.key==="Enter"&&g.ctrlKey){let D=s.querySelector("#detail-root .editable-actions button");D&&D.click()}},ce=async()=>{if(!i||l)return;let g=s.querySelector("#detail-root textarea"),D=i.description||"",G=g?g.value:"";if(G===D){d=!1,N();return}l=!0,g&&(g.disabled=!0);try{r("save description %s",String(i?.id||""));let M=await e("edit-text",{id:i.id,field:"description",value:G});M&&typeof M=="object"&&(i=M,d=!1,N())}catch(M){r("save description failed %s %o",String(i?.id||""),M),i.description=D,d=!1,N(),me("Failed to save description","error")}finally{l=!1}},oe=()=>{d=!1,N()},ae=()=>{p=!0,N();try{let g=s.querySelector("#detail-root .design textarea");g&&g.focus()}catch(g){r("focus design textarea failed %o",g)}},B=g=>{if(g.key==="Escape")p=!1,N();else if(g.key==="Enter"&&(g.ctrlKey||g.metaKey)){let D=s.querySelector("#detail-root .design .editable-actions button");D&&D.click()}},xe=async()=>{if(!i||l)return;let g=s.querySelector("#detail-root .design textarea"),D=i.design||"",G=g?g.value:"";if(G===D){p=!1,N();return}l=!0,g&&(g.disabled=!0);try{r("save design %s",String(i?.id||""));let M=await e("edit-text",{id:i.id,field:"design",value:G});M&&typeof M=="object"&&(i=M,p=!1,N())}catch(M){r("save design failed %s %o",String(i?.id||""),M),i.design=D,p=!1,N(),me("Failed to save design","error")}finally{l=!1}},le=()=>{p=!1,N()},et=()=>{u=!0,N()},te=g=>{if(g.key==="Escape")u=!1,N();else if(g.key==="Enter"&&(g.ctrlKey||g.metaKey)){let D=s.querySelector("#detail-root .notes .editable-actions button");D&&D.click()}},Ne=async()=>{if(!i||l)return;let g=s.querySelector("#detail-root .notes textarea"),D=i.notes||"",G=g?g.value:"";if(G===D){u=!1,N();return}l=!0,g&&(g.disabled=!0);try{r("save notes %s",String(i?.id||""));let M=await e("edit-text",{id:i.id,field:"notes",value:G});M&&typeof M=="object"&&(i=M,u=!1,N())}catch(M){r("save notes failed %s %o",String(i?.id||""),M),i.notes=D,u=!1,N(),me("Failed to save notes","error")}finally{l=!1}},qe=()=>{u=!1,N()},ye=()=>{h=!0,N()},ze=g=>{if(g.key==="Escape")h=!1,N();else if(g.key==="Enter"&&(g.ctrlKey||g.metaKey)){let D=s.querySelector("#detail-root .acceptance .editable-actions button");D&&D.click()}},Ce=async()=>{if(!i||l)return;let g=s.querySelector("#detail-root .acceptance textarea"),D=i.acceptance||"",G=g?g.value:"";if(G===D){h=!1,N();return}l=!0,g&&(g.disabled=!0);try{r("save acceptance %s",String(i?.id||""));let M=await e("edit-text",{id:i.id,field:"acceptance",value:G});M&&typeof M=="object"&&(i=M,h=!1,N())}catch(M){r("save acceptance failed %s %o",String(i?.id||""),M),i.acceptance=D,h=!1,N(),me("Failed to save acceptance","error")}finally{l=!1}},Oe=()=>{h=!1,N()};function Re(g,D){let G=g==="Dependencies"?"add-dependency":"add-dependent";return S`
      <div class="props-card">
        <div>
          <div class="props-card__title">${g}</div>
        </div>
        <ul>
          ${!D||D.length===0?null:D.map(M=>{let J=M.id,ne=k(J);return S`<li
                  data-href=${ne}
                  @click=${()=>t(ne)}
                >
                  ${at(M.issue_type||"")}
                  <span class="text-truncate">${M.title||""}</span>
                  <button
                    aria-label=${`Remove dependency ${J}`}
                    @click=${Te(J,g)}
                  >
                    ×
                  </button>
                </li>`})}
        </ul>
        <div class="props-card__footer">
          <input type="text" placeholder="Issue ID" data-testid=${G} />
          <button @click=${je(D,g)}>Add</button>
        </div>
      </div>
    `}function Ae(g){let D=a?S`<div class="detail-title">
          <h2>
            <input
              type="text"
              aria-label="Edit title"
              .value=${g.title||""}
              @keydown=${Ge}
            />
            <button @click=${_}>Save</button>
            <button @click=${C}>Cancel</button>
          </h2>
        </div>`:S`<div class="detail-title">
          <h2>
            <span
              class="editable"
              tabindex="0"
              role="button"
              aria-label="Edit title"
              @click=${E}
              @keydown=${$}
              >${g.title||""}</span
            >
          </h2>
        </div>`,G=S`<select
      class=${`badge-select badge--status is-${g.status||"open"}`}
      @change=${V}
      .value=${g.status||"open"}
      ?disabled=${l}
    >
      ${(()=>{let q=String(g.status||"open");return["open","in_progress","closed"].map(se=>S`<option value=${se} ?selected=${q===se}>
              ${Je(se)}
            </option>`)})()}
    </select>`,M=S`<select
      class=${`badge-select badge--priority is-p${String(typeof g.priority=="number"?g.priority:2)}`}
      @change=${Y}
      .value=${String(typeof g.priority=="number"?g.priority:2)}
      ?disabled=${l}
    >
      ${(()=>{let q=String(typeof g.priority=="number"?g.priority:2);return Qe.map((se,Ve)=>S`<option value=${String(Ve)} ?selected=${q===String(Ve)}>
              ${Et(Ve)} ${se}
            </option>`)})()}
    </select>`,J=d?S`<div class="description">
          <textarea
            @keydown=${ue}
            .value=${g.description||""}
            rows="8"
            style="width:100%"
          ></textarea>
          <div class="editable-actions">
            <button @click=${ce}>Save</button>
            <button @click=${oe}>Cancel</button>
          </div>
        </div>`:S`<div
          class="md editable"
          tabindex="0"
          role="button"
          aria-label="Edit description"
          @click=${K}
          @keydown=${x}
        >
          ${(()=>{let q=g.description||"";return q.trim()===""?S`<div class="muted">Description</div>`:Bt(q)})()}
        </div>`,ne=(()=>{let q=g;return String(g.acceptance||q.acceptance_criteria||"")})(),dt=h?S`<div class="acceptance">
          ${ne.trim().length>0?S`<div class="props-card__title">Acceptance Criteria</div>`:""}
          <textarea
            @keydown=${ze}
            .value=${ne}
            rows="6"
            style="width:100%"
          ></textarea>
          <div class="editable-actions">
            <button @click=${Ce}>Save</button>
            <button @click=${Oe}>Cancel</button>
          </div>
        </div>`:S`<div class="acceptance">
          ${(()=>{let q=ne,se=q.trim().length>0;return S`${se?S`<div class="props-card__title">Acceptance Criteria</div>`:""}
              <div
                class="md editable"
                tabindex="0"
                role="button"
                aria-label="Edit acceptance criteria"
                @click=${ye}
                @keydown=${y}
              >
                ${se?Bt(q):S`<div class="muted">Add acceptance criteria…</div>`}
              </div>`})()}
        </div>`,he=String(g.notes||""),Ht=u?S`<div class="notes">
          ${he.trim().length>0?S`<div class="props-card__title">Notes</div>`:""}
          <textarea
            @keydown=${te}
            .value=${he}
            rows="6"
            style="width:100%"
          ></textarea>
          <div class="editable-actions">
            <button @click=${Ne}>Save</button>
            <button @click=${qe}>Cancel</button>
          </div>
        </div>`:S`<div class="notes">
          ${(()=>{let q=he,se=q.trim().length>0;return S`${se?S`<div class="props-card__title">Notes</div>`:""}
              <div
                class="md editable"
                tabindex="0"
                role="button"
                aria-label="Edit notes"
                @click=${et}
                @keydown=${U}
              >
                ${se?Bt(q):S`<div class="muted">Add notes…</div>`}
              </div>`})()}
        </div>`,vt=Array.isArray(g.labels)?g.labels:[],Ut=S`<div class="props-card labels">
      <div>
        <div class="props-card__title">Labels</div>
      </div>
      <ul>
        ${vt.map(q=>S`<li>
              <span class="badge" title=${q}
                >${q}
                <button
                  class="icon-button"
                  title="Remove label"
                  aria-label=${"Remove label "+q}
                  @click=${()=>H(q)}
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
          .value=${A}
          @input=${L}
          @keydown=${O}
        />
        <button @click=${z}>Add</button>
      </div>
    </div>`,We=String(g.design||""),ut=p?S`<div class="design">
          ${We.trim().length>0?S`<div class="props-card__title">Design</div>`:""}
          <textarea
            @keydown=${B}
            .value=${We}
            rows="6"
            style="width:100%"
          ></textarea>
          <div class="editable-actions">
            <button @click=${xe}>Save</button>
            <button @click=${le}>Cancel</button>
          </div>
        </div>`:S`<div class="design">
          ${(()=>{let q=We,se=q.trim().length>0;return S`${se?S`<div class="props-card__title">Design</div>`:""}
              <div
                class="md editable"
                tabindex="0"
                role="button"
                aria-label="Edit design"
                @click=${ae}
                @keydown=${j}
              >
                ${se?Bt(q):S`<div class="muted">Add design…</div>`}
              </div>`})()}
        </div>`;return S`
      <div class="panel__body" id="detail-root">
        <div style="position:relative">
          <div class="detail-layout">
            <div class="detail-main">
              ${D} ${J} ${ut} ${Ht}
              ${dt}
            </div>
            <div class="detail-side">
              <div class="props-card">
                <div class="props-card__title">Properties</div>
                <div class="prop">
                  <div class="label">Type</div>
                  <div class="value">
                    ${at(g.issue_type)}
                  </div>
                </div>
                <div class="prop">
                  <div class="label">Status</div>
                  <div class="value">${G}</div>
                </div>
                <div class="prop">
                  <div class="label">Priority</div>
                  <div class="value">${M}</div>
                </div>
                <div class="prop assignee">
                  <div class="label">Assignee</div>
                  <div class="value">
                    ${w?S`<input
                            type="text"
                            aria-label="Edit assignee"
                            .value=${g.assignee||""}
                            size=${Math.min(40,Math.max(12,(g.assignee||"").length+3))}
                            @keydown=${q=>{q.key==="Escape"?(q.preventDefault(),I()):q.key==="Enter"&&(q.preventDefault(),b())}}
                          />
                          <button
                            class="btn"
                            style="margin-left:6px"
                            @click=${b}
                          >
                            Save
                          </button>
                          <button
                            class="btn"
                            style="margin-left:6px"
                            @click=${I}
                          >
                            Cancel
                          </button>`:S`${(()=>{let q=g.assignee||"",se=q.trim().length>0;return S`<span
                            class=${se?"editable":"editable muted"}
                            tabindex="0"
                            role="button"
                            aria-label="Edit assignee"
                            @click=${f}
                            @keydown=${v}
                            >${se?q:"Unassigned"}</span
                          >`})()}`}
                  </div>
                </div>
              </div>
              ${Ut}
              ${Re("Dependencies",g.dependencies||[])}
              ${Re("Dependents",g.dependents||[])}
            </div>
          </div>
        </div>
      </div>
    `}function N(){if(!i){R(o?"Loading\u2026":"No issue selected");return}ie(Ae(i),s)}function Te(g,D){return async G=>{if(G.stopPropagation(),!(!i||l)){l=!0;try{if(D==="Dependencies"){let M=await e("dep-remove",{a:i.id,b:g,view_id:i.id});M&&typeof M=="object"&&(i=M,N())}else{let M=await e("dep-remove",{a:g,b:i.id,view_id:i.id});M&&typeof M=="object"&&(i=M,N())}}catch(M){r("dep-remove failed %o",M)}finally{l=!1}}}}function je(g,D){return async G=>{if(!i||l)return;let M=G.currentTarget,J=M.previousElementSibling,ne=J?J.value.trim():"";if(!ne||ne===i.id){me("Enter a different issue id");return}if(new Set((g||[]).map(he=>he.id)).has(ne)){me("Link already exists");return}l=!0,M&&(M.disabled=!0),J&&(J.disabled=!0);try{if(D==="Dependencies"){let he=await e("dep-add",{a:i.id,b:ne,view_id:i.id});he&&typeof he=="object"&&(i=he,N())}else{let he=await e("dep-add",{a:ne,b:i.id,view_id:i.id});he&&typeof he=="object"&&(i=he,N())}}catch(he){r("dep-add failed %o",he),me("Failed to add dependency","error")}finally{l=!1}}}function Ge(g){g.key==="Escape"?(a=!1,N()):g.key==="Enter"&&(g.preventDefault(),_())}function x(g){g.key==="Enter"&&K()}function y(g){g.key==="Enter"&&ye()}function U(g){g.key==="Enter"&&et()}function j(g){g.key==="Enter"&&ae()}return{async load(g){if(!g){R("No issue selected");return}o=String(g),i=null,m(),i||R("Loading\u2026"),l=!1,N()},clear(){R("Select an issue to view details")},destroy(){s.replaceChildren()}}}function ls(s){let e=s.navigate,t=s.onUpdate,n=s.requestRender,r=s.getSelectedId||(()=>null),i=s.row_class||"issue-row",o=new Set;function l(u,h,w,A=""){let k=`${u}:${h}`;return o.has(k)?S`<span>
        <input
          type="text"
          .value=${w}
          class="inline-edit"
          @keydown=${async m=>{if(m.key==="Escape")o.delete(k),n();else if(m.key==="Enter"){let $=m.currentTarget.value||"";$!==w&&await t(u,{[h]:$}),o.delete(k),n()}}}
          @blur=${async m=>{let $=m.currentTarget.value||"";$!==w&&await t(u,{[h]:$}),o.delete(k),n()}}
          autofocus
        />
      </span>`:S`<span
      class="editable text-truncate ${w?"":"muted"}"
      tabindex="0"
      role="button"
      @click=${m=>{m.stopPropagation(),m.preventDefault(),o.add(k),n()}}
      @keydown=${m=>{m.key==="Enter"&&(m.preventDefault(),m.stopPropagation(),o.add(k),n())}}
      >${w||A}</span
    >`}function a(u,h){return async w=>{let k=w.currentTarget.value||"",R={};R[h]=h==="priority"?Number(k):k,await t(u,R)}}function d(u){return h=>{let w=h.target;w&&(w.tagName==="INPUT"||w.tagName==="SELECT")||e(u)}}function p(u){let h=String(u.status||"open"),w=String(u.priority??2),A=r()===u.id;return S`<tr
      role="row"
      class="${i} ${A?"selected":""}"
      data-issue-id=${u.id}
      @click=${d(u.id)}
    >
      <td role="gridcell" class="mono">${Xe(u.id)}</td>
      <td role="gridcell">${at(u.issue_type)}</td>
      <td role="gridcell">${l(u.id,"title",u.title||"")}</td>
      <td role="gridcell">
        <select
          class="badge-select badge--status is-${h}"
          .value=${h}
          @change=${a(u.id,"status")}
        >
          ${["open","in_progress","closed"].map(k=>S`<option value=${k} ?selected=${h===k}>
                ${Je(k)}
              </option>`)}
        </select>
      </td>
      <td role="gridcell">
        ${l(u.id,"assignee",u.assignee||"","Unassigned")}
      </td>
      <td role="gridcell">
        <select
          class="badge-select badge--priority ${"is-p"+w}"
          .value=${w}
          @change=${a(u.id,"priority")}
        >
          ${Qe.map((k,R)=>S`<option
                value=${String(R)}
                ?selected=${w===String(R)}
              >
                ${Et(R)} ${k}
              </option>`)}
        </select>
      </td>
    </tr>`}return p}function un(s,e,t,n=void 0,r=void 0){let i=[],o=new Set,l=new Set,a=new Map,d=r?Ke(r):null;d&&d.subscribe(()=>{let m=i.length===0;if(i=R(),u(),m&&i.length>0){let E=String(i[0].epic?.id||"");E&&!o.has(E)&&k(E)}});let p=ls({navigate:m=>t(m),onUpdate:A,requestRender:u,getSelectedId:()=>null,row_class:"epic-row"});function u(){ie(h(),s)}function h(){return i.length?S`${i.map(m=>w(m))}`:S`<div class="panel__header muted">No epics found.</div>`}function w(m){let E=m.epic||{},$=String(E.id||""),_=o.has($),C=d?d.selectEpicChildren($):[],f=l.has($);return S`
      <div class="epic-group" data-epic-id=${$}>
        <div
          class="epic-header"
          @click=${()=>k($)}
          role="button"
          tabindex="0"
          aria-expanded=${_}
        >
          ${Xe($,{class_name:"mono"})}
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
        ${_?S`<div class="epic-children">
              ${f?S`<div class="muted">Loading…</div>`:C.length===0?S`<div class="muted">No issues found</div>`:S`<table class="table">
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
                        ${C.map(v=>p(v))}
                      </tbody>
                    </table>`}
            </div>`:null}
      </div>
    `}async function A(m,E){try{await e.updateIssue({id:m,...E}),u()}catch{}}async function k(m){if(o.has(m)){if(o.delete(m),a.has(m)){try{let E=a.get(m);E&&await E()}catch{}a.delete(m);try{r&&r.unregister&&r.unregister(`detail:${m}`)}catch{}}}else{if(o.add(m),l.add(m),u(),n&&typeof n.subscribeList=="function")try{try{r&&r.register&&r.register(`detail:${m}`,{type:"issue-detail",params:{id:m}})}catch{}let E=await n.subscribeList(`detail:${m}`,{type:"issue-detail",params:{id:m}});a.set(m,E)}catch{}l.delete(m)}u()}function R(){let m=r&&r.snapshotFor?r.snapshotFor("tab:epics")||[]:[],E=[];for(let $ of m){let _=Array.isArray($.dependents)?$.dependents:[],C=Number.isFinite($.total_children),f=Number.isFinite($.closed_children),v=C?Number($.total_children)||0:_.length,b=f&&Number($.closed_children)||0;if(!f)for(let I of _)String(I.status||"")==="closed"&&b++;E.push({epic:$,total_children:v,closed_children:b})}return E}return{async load(){i=R(),u();try{if(i.length>0){let m=String(i[0].epic?.id||"");m&&!o.has(m)&&await k(m)}}catch{}}}}function pn(s){let e=document.createElement("dialog");e.id="fatal-error-dialog",e.setAttribute("role","alertdialog"),e.setAttribute("aria-modal","true"),e.innerHTML=`
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
    </div>`,s.appendChild(e);let t=e.querySelector("#fatal-error-title"),n=e.querySelector("#fatal-error-message"),r=e.querySelector("#fatal-error-detail"),i=e.querySelector("#fatal-error-reload"),o=e.querySelector("#fatal-error-close"),l=()=>{if(typeof e.close=="function")try{e.close()}catch{}e.removeAttribute("open")},a=(d,p,u="")=>{t&&(t.textContent=d||"Unexpected Error"),n&&(n.textContent=p||"An unrecoverable error occurred.");let h=typeof u=="string"?u.trim():"";if(r&&(h.length>0?(r.textContent=h,r.removeAttribute("hidden")):(r.textContent="No additional diagnostics available.",r.setAttribute("hidden",""))),typeof e.showModal=="function")try{e.showModal(),e.setAttribute("open","")}catch{e.setAttribute("open","")}else e.setAttribute("open","")};return i&&i.addEventListener("click",()=>{window.location.reload()}),o&&o.addEventListener("click",()=>l()),e.addEventListener("cancel",d=>{d.preventDefault(),l()}),{open:a,close:l,getElement(){return e}}}function fn(s,e,t){let n=document.createElement("dialog");n.id="issue-dialog",n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true"),n.innerHTML=`
    <div class="issue-dialog__container" part="container">
      <header class="issue-dialog__header">
        <div class="issue-dialog__title">
          <span class="mono" id="issue-dialog-title"></span>
        </div>
        <button type="button" class="issue-dialog__close" aria-label="Close">\xD7</button>
      </header>
      <div class="issue-dialog__body" id="issue-dialog-body"></div>
    </div>
  `,s.appendChild(n);let r=n.querySelector("#issue-dialog-body"),i=n.querySelector("#issue-dialog-title"),o=n.querySelector(".issue-dialog__close");function l(w){i.replaceChildren(),i.appendChild(Xe(w))}n.addEventListener("mousedown",w=>{w.target===n&&(w.preventDefault(),d())}),n.addEventListener("cancel",w=>{w.preventDefault(),d()}),o.addEventListener("click",()=>d());let a=null;function d(){try{typeof n.close=="function"?n.close():n.removeAttribute("open")}catch{n.removeAttribute("open")}try{t()}catch{}h()}function p(w){try{let A=document.activeElement;A&&A instanceof HTMLElement?a=A:a=null}catch{a=null}l(w);try{"showModal"in n&&typeof n.showModal=="function"?n.showModal():n.setAttribute("open",""),setTimeout(()=>{try{o.focus()}catch{}},0)}catch{n.setAttribute("open","")}}function u(){try{typeof n.close=="function"?n.close():n.removeAttribute("open")}catch{n.removeAttribute("open")}h()}function h(){try{a&&document.contains(a)&&a.focus()}catch{}finally{a=null}}return{open:p,close:u,getMount(){return r}}}var cs=["bug","feature","task","epic","chore"];function ds(s){switch((s||"").toString().toLowerCase()){case"bug":return"Bug";case"feature":return"Feature";case"task":return"Task";case"epic":return"Epic";case"chore":return"Chore";default:return""}}function hn(s,e,t,n,r=void 0,i=void 0){let o=X("views:list"),l="all",a="",d=[],p="",u=n?n.getState().selected_id:null,h=null,w=ls({navigate:f=>{let v=t||(I=>window.location.hash=I),b=n?n.getState().view:"issues";v(Ye(b,f))},onUpdate:_,requestRender:$,getSelectedId:()=>u,row_class:"issue-row"}),A=async f=>{l=f.currentTarget.value,o("status change %s",l),n&&n.setState({filters:{status:l}}),await C()},k=f=>{a=f.currentTarget.value,o("search input %s",a),n&&n.setState({filters:{search:a}}),$()},R=f=>{p=f.currentTarget.value||"",o("type change %s",p||"(all)"),n&&n.setState({filters:{type:p}}),$()};if(n){let f=n.getState();f&&f.filters&&typeof f.filters=="object"&&(l=f.filters.status||"all",a=f.filters.search||"",p=typeof f.filters.type=="string"?f.filters.type:"")}let m=i?Ke(i):null;function E(){let f=d;if(l!=="all"&&l!=="ready"&&(f=f.filter(v=>String(v.status||"")===l)),a){let v=a.toLowerCase();f=f.filter(b=>{let I=String(b.id).toLowerCase(),L=String(b.title||"").toLowerCase();return I.includes(v)||L.includes(v)})}return p&&(f=f.filter(v=>String(v.issue_type||"")===String(p))),l==="closed"&&(f=f.slice().sort(mt)),S`
      <div class="panel__header">
        <select @change=${A} .value=${l}>
          <option value="all">All</option>
          <option value="ready">Ready</option>
          <option value="open">${Je("open")}</option>
          <option value="in_progress">${Je("in_progress")}</option>
          <option value="closed">${Je("closed")}</option>
        </select>
        <select
          @change=${R}
          .value=${p}
          aria-label="Filter by type"
        >
          <option value="">All types</option>
          ${cs.map(v=>S`<option value=${v} ?selected=${p===v}>
                ${ds(v)}
              </option>`)}
        </select>
        <input
          type="search"
          placeholder="Search…"
          @input=${k}
          .value=${a}
        />
      </div>
      <div class="panel__body" id="list-root">
        ${f.length===0?S`<div class="issues-block">
              <div class="muted" style="padding:10px 12px;">No issues</div>
            </div>`:S`<div class="issues-block">
              <table
                class="table"
                role="grid"
                aria-rowcount=${String(f.length)}
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
                  ${f.map(v=>w(v))}
                </tbody>
              </table>
            </div>`}
      </div>
    `}function $(){ie(E(),s)}$();async function _(f,v){try{o("updateInline %s %o",f,Object.keys(v)),typeof v.title=="string"&&await e("edit-text",{id:f,field:"title",value:v.title}),typeof v.assignee=="string"&&await e("update-assignee",{id:f,assignee:v.assignee}),typeof v.status=="string"&&await e("update-status",{id:f,status:v.status}),typeof v.priority=="number"&&await e("update-priority",{id:f,priority:v.priority})}catch{}}async function C(){o("load");let f=s.querySelector("#list-root"),v=f?f.scrollTop:0;try{m?d=m.selectIssuesFor("tab:issues"):d=[]}catch(b){o("load failed: %o",b),d=[]}$();try{let b=s.querySelector("#list-root");b&&v>0&&(b.scrollTop=v)}catch{}}return s.tabIndex=0,s.addEventListener("keydown",f=>{if(f.key==="ArrowDown"||f.key==="ArrowUp"){let L=f.target;if((L&&typeof L.closest=="function"?L.closest("#list-root table.table"):null)&&!!!(L&&typeof L.closest=="function"&&(L.closest("input")||L.closest("textarea")||L.closest("select")))){let H=L&&typeof L.closest=="function"?L.closest("td"):null;if(H&&H.parentElement){let V=H.parentElement,Y=V.parentElement;if(Y&&Y.querySelectorAll){let K=Array.from(Y.querySelectorAll("tr")),ue=Math.max(0,K.indexOf(V)),ce=H.cellIndex||0,oe=f.key==="ArrowDown"?Math.min(ue+1,K.length-1):Math.max(ue-1,0),ae=K[oe],B=ae&&ae.cells?ae.cells[ce]:null;if(B){let xe=B.querySelector('button:not([disabled]), [tabindex]:not([tabindex="-1"]), a[href], select:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled])');if(xe&&typeof xe.focus=="function"){f.preventDefault(),xe.focus();return}}}}}}let v=s.querySelector("#list-root tbody"),b=v?v.querySelectorAll("tr"):[];if(b.length===0)return;let I=0;if(u&&(I=Array.from(b).findIndex(O=>(O.getAttribute("data-issue-id")||"")===u),I<0&&(I=0)),f.key==="ArrowDown"){f.preventDefault();let L=b[Math.min(I+1,b.length-1)],O=L?L.getAttribute("data-issue-id"):"",z=O||null;n&&z&&n.setState({selected_id:z}),u=z,$()}else if(f.key==="ArrowUp"){f.preventDefault();let L=b[Math.max(I-1,0)],O=L?L.getAttribute("data-issue-id"):"",z=O||null;n&&z&&n.setState({selected_id:z}),u=z,$()}else if(f.key==="Enter"){f.preventDefault();let L=b[I],O=L?L.getAttribute("data-issue-id"):"";if(O){let z=t||(V=>window.location.hash=V),H=n?n.getState().view:"issues";z(Ye(H,O))}}}),n&&(h=n.subscribe(f=>{if(f.selected_id!==u&&(u=f.selected_id,o("selected %s",u||"(none)"),$()),f.filters&&typeof f.filters=="object"){let v=f.filters.status,b=f.filters.search||"",I=typeof f.filters.type=="string"?f.filters.type:"",L=!1;if(v!==l){l=v,C();return}b!==a&&(a=b,L=!0),I!==p&&(p=I,L=!0),L&&$()}})),m&&m.subscribe(()=>{try{d=m.selectIssuesFor("tab:issues"),$()}catch{}}),{load:C,destroy(){s.replaceChildren(),h&&(h(),h=null)}}}function gn(s,e,t){let n=X("views:nav"),r=null;function i(a){return d=>{d.preventDefault(),n("click tab %s",a),t.gotoView(a)}}function o(){let d=e.getState().view||"issues";return S`
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
    `}function l(){ie(o(),s)}return l(),r=e.subscribe(()=>l()),{destroy(){r&&(r(),r=null),ie(S``,s)}}}function mn(s,e,t,n){let r=document.createElement("dialog");r.id="new-issue-dialog",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.innerHTML=`
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
  `,s.appendChild(r);let i=r.querySelector("#new-issue-form"),o=r.querySelector("#new-title"),l=r.querySelector("#new-type"),a=r.querySelector("#new-priority"),d=r.querySelector("#new-labels"),p=r.querySelector("#new-description"),u=r.querySelector("#new-issue-error"),h=r.querySelector("#btn-cancel"),w=r.querySelector("#btn-create"),A=r.querySelector(".new-issue__close");function k(){l.replaceChildren();let b=document.createElement("option");b.value="",b.textContent="\u2014 Select \u2014",l.appendChild(b);for(let I of cs){let L=document.createElement("option");L.value=I,L.textContent=ds(I),l.appendChild(L)}a.replaceChildren();for(let I=0;I<=4;I+=1){let L=document.createElement("option");L.value=String(I);let O=Qe[I]||"Medium";L.textContent=`${I} \u2013 ${O}`,a.appendChild(L)}}k();function R(){try{typeof r.close=="function"?r.close():r.removeAttribute("open")}catch{r.removeAttribute("open")}}function m(b){o.disabled=b,l.disabled=b,a.disabled=b,d.disabled=b,p.disabled=b,h.disabled=b,w.disabled=b,w.textContent=b?"Creating\u2026":"Create"}function E(){u.textContent=""}function $(b){u.textContent=b}function _(){try{let b=window.localStorage.getItem("beads-ui.new.type");b?l.value=b:l.value="";let I=window.localStorage.getItem("beads-ui.new.priority");I&&/^\d$/.test(I)?a.value=I:a.value="2"}catch{l.value="",a.value="2"}}function C(){let b=l.value||"",I=a.value||"";b.length>0&&window.localStorage.setItem("beads-ui.new.type",b),I.length>0&&window.localStorage.setItem("beads-ui.new.priority",I)}function f(b){let I=/-(\d+)$/.exec(String(b||""));return I&&I[1]?Number(I[1]):-1}async function v(){E();let b=String(o.value||"").trim();if(b.length===0){$("Title is required"),o.focus();return}let I=Number(a.value||"2");if(!(I>=0&&I<=4)){$("Priority must be 0..4"),a.focus();return}let L=String(l.value||""),O=String(p.value||""),z=String(d.value||"").split(",").map(K=>K.trim()).filter(K=>K.length>0),H={title:b};L.length>0&&(H.type=L),String(I).length>0&&(H.priority=I),O.length>0&&(H.description=O),m(!0);try{await e("create-issue",H)}catch{m(!1),$("Failed to create issue");return}C();let V=null;try{V=await e("list-issues",{filters:{status:"open",limit:50}})}catch{V=null}let Y="";if(Array.isArray(V)){let K=V.filter(ue=>String(ue.title||"")===b);if(K.length>0){let ue=K[0];for(let ce of K){let oe=f(ue.id||"");f(ce.id||"")>oe&&(ue=ce)}Y=String(ue.id||"")}}if(Y&&z.length>0)for(let K of z)try{await e("label-add",{id:Y,label:K})}catch{}if(Y){try{t.gotoIssue(Y)}catch{}try{n&&n.setState({selected_id:Y})}catch{}}m(!1),R()}return r.addEventListener("cancel",b=>{b.preventDefault(),R()}),A.addEventListener("click",()=>R()),h.addEventListener("click",()=>R()),r.addEventListener("keydown",b=>{b.key==="Enter"&&(b.ctrlKey||b.metaKey)&&(b.preventDefault(),v())}),i.addEventListener("submit",b=>{b.preventDefault(),v()}),{open(){i.reset(),E(),_();try{"showModal"in r&&typeof r.showModal=="function"?r.showModal():r.setAttribute("open","")}catch{r.setAttribute("open","")}setTimeout(()=>{try{o.focus()}catch{}},0)},close(){R()}}}function bn(s,e,t={}){let n=X("views:messages"),r=null,i=null,o=null,l=!1;function a(m){i=m;let _=(e.getState().queen_messages||[]).find(C=>C.id===m);_&&_.thread_id&&(o=_.thread_id),R()}function d(){l=!l,R()}function p(m){try{let E=new Date(m),_=new Date().getTime()-E.getTime(),C=Math.floor(_/6e4),f=Math.floor(_/36e5),v=Math.floor(_/864e5);return C<1?"just now":C<60?`${C}m ago`:f<24?`${f}h ago`:v<7?`${v}d ago`:E.toLocaleDateString()}catch{return m}}function u(m){let E=m.id===i,$=!m.read_at;return S`
      <div
        class="message-row ${E?"selected":""} ${$?"unread":""}"
        @click=${()=>a(m.id)}
        tabindex="0"
        @keydown=${_=>{(_.key==="Enter"||_.key===" ")&&(_.preventDefault(),a(m.id))}}
      >
        <div class="message-header">
          <span class="message-from">${m.from}</span>
          <span class="message-time">${p(m.created_at)}</span>
        </div>
        <div class="message-subject">${m.subject}</div>
        <div class="message-preview">${m.body?.slice(0,80)}${m.body?.length>80?"...":""}</div>
      </div>
    `}function h(m){return S`
      <div class="message-detail">
        <div class="message-detail-header">
          <h3>${m.subject}</h3>
          <div class="message-meta">
            <span>From: <strong>${m.from}</strong></span>
            <span>To: <strong>${m.to}</strong></span>
            <span>${p(m.created_at)}</span>
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
    `}function w(){return S`
      <div class="compose-form">
        <h3>New Message</h3>
        <form @submit=${A}>
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
    `}function A(m){m.preventDefault();let E=m.target,$=new FormData(E);n("send message: to=%s subject=%s",$.get("to"),$.get("subject")),l=!1,R()}function k(){let E=e.getState().queen_messages||[],$=E.find(v=>v.id===i),_=new Map;for(let v of E){let b=v.thread_id||v.id;_.has(b)||_.set(b,[]),_.get(b).push(v)}let C=Array.from(_.entries()).sort((v,b)=>{let I=v[1][v[1].length-1],L=b[1][b[1].length-1];return new Date(L.created_at).getTime()-new Date(I.created_at).getTime()}),f=E;return o&&(f=E.filter(v=>v.thread_id===o||v.id===o)),S`
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
        ${l?w():""}
        <div class="messages-container">
          <div class="messages-list">
            ${f.length===0?S`<div class="empty-state">No messages</div>`:f.map(v=>u(v))}
          </div>
          <div class="messages-detail">
            ${$?h($):S`<div class="empty-state">Select a message to view</div>`}
          </div>
        </div>
      </div>
    `}function R(){ie(k(),s)}return{load(){n("load messages view"),R(),r=e.subscribe(()=>R())},unload(){n("unload messages view"),r&&(r(),r=null)},destroy(){r&&(r(),r=null),ie(S``,s)}}}function yn(s,e,t={}){let n=X("views:assignments"),r=null,i=null,o=null;function l(k){try{let R=new Date(k),E=new Date().getTime()-R.getTime(),$=Math.floor(E/6e4),_=Math.floor(E/36e5),C=Math.floor(E/864e5);return $<1?"just now":$<60?`${$}m ago`:_<24?`${_}h ago`:C<7?`${C}d ago`:R.toLocaleDateString()}catch{return k}}function a(k){switch(k){case"active":return"status-active";case"completed":return"status-completed";case"blocked":return"status-blocked";case"released":return"status-released";default:return""}}function d(k){return S`
      <tr class="assignment-row">
        <td class="col-issue">
          <a href="#/issues?issue=${encodeURIComponent(k.issue_id)}" class="issue-link">
            ${k.issue_id}
          </a>
        </td>
        <td class="col-droid">
          <span class="droid-badge">${k.droid}</span>
        </td>
        <td class="col-status">
          <span class="status-badge ${a(k.status)}">
            ${k.status}
          </span>
        </td>
        <td class="col-worktree">${k.worktree||"-"}</td>
        <td class="col-assigned">${l(k.assigned_at)}</td>
        <td class="col-actions">
          ${k.status==="active"?S`<button class="btn btn-sm btn-release" @click=${()=>p(k)}>
                Release
              </button>`:""}
        </td>
      </tr>
    `}function p(k){n("release assignment: %s",k.id)}function u(k){i=i===k?null:k,A()}function h(k){o=o===k?null:k,A()}function w(){let k=e.getState(),R=k.queen_assignments||[],m=k.queen_droids||[],E=[...new Set(R.map(f=>f.status))],$=R;i&&($=$.filter(f=>f.status===i)),o&&($=$.filter(f=>f.droid===o)),$=$.sort((f,v)=>new Date(v.assigned_at).getTime()-new Date(f.assigned_at).getTime());let _=R.filter(f=>f.status==="active").length,C=R.filter(f=>f.status==="active").reduce((f,v)=>(f.set(v.droid,(f.get(v.droid)||0)+1),f),new Map);return S`
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
            <span class="stat-value">${_}</span>
            <span class="stat-label">Active</span>
          </div>
          ${Array.from(C.entries()).map(([f,v])=>S`
              <div
                class="stat droid-stat ${o===f?"active":""}"
                @click=${()=>h(f)}
              >
                <span class="stat-value">${v}</span>
                <span class="stat-label">${f}</span>
              </div>
            `)}
        </div>
        <div class="assignments-filters">
          ${E.map(f=>S`
              <button
                class="filter-btn ${i===f?"active":""}"
                @click=${()=>u(f)}
              >
                ${f}
              </button>
            `)}
        </div>
        <div class="assignments-table-container">
          ${$.length===0?S`<div class="empty-state">No assignments</div>`:S`
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
                    ${$.map(f=>d(f))}
                  </tbody>
                </table>
              `}
        </div>
      </div>
    `}function A(){ie(w(),s)}return{load(){n("load assignments view"),A(),r=e.subscribe(()=>A())},unload(){n("unload assignments view"),r&&(r(),r=null)},destroy(){r&&(r(),r=null),ie(S``,s)}}}function wn(s,e,t={}){let n=X("views:reservations"),r=null,i=null,o=!1;function l(m){try{let E=new Date(m),_=new Date().getTime()-E.getTime(),C=Math.floor(_/6e4),f=Math.floor(_/36e5),v=Math.floor(_/864e5);return C<1?"just now":C<60?`${C}m ago`:f<24?`${f}h ago`:v<7?`${v}d ago`:E.toLocaleDateString()}catch{return m}}function a(m){try{let E=new Date(m),$=new Date,_=E.getTime()-$.getTime();if(_<=0)return"Expired";let C=Math.floor(_/6e4),f=Math.floor(_/36e5);return C<60?`${C}m left`:f<24?`${f}h left`:`${Math.floor(f/24)}d left`}catch{return m}}function d(m){try{return new Date(m).getTime()<Date.now()}catch{return!1}}function p(m){let E=d(m.expires_at),$=m.has_conflict||!1;return S`
      <tr class="reservation-row ${E?"expired":""} ${$?"has-conflict":""}">
        <td class="col-path">
          <span class="path-badge ${m.exclusive?"exclusive":"shared"}">
            ${m.exclusive?"\u{1F512}":"\u{1F441}\uFE0F"}
          </span>
          <code class="file-path">${m.path}</code>
          ${$?S`<span class="conflict-indicator" title="Conflict with: ${m.conflicting_droids?.join(", ")}">⚠️</span>`:""}
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
          ${E?S`
                <span class="expired-label">Expired</span>
              `:S`
                <button
                  class="btn btn-sm btn-release"
                  @click=${()=>u(m)}
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
    `}function u(m){n("release reservation: %s",m.id)}function h(m){n("renew reservation: %s",m.id)}function w(m){i=i===m?null:m,R()}function A(){o=!o,R()}function k(){let E=e.getState().queen_reservations||[],$=[...new Set(E.map(b=>b.droid))],_=E;i&&(_=_.filter(b=>b.droid===i)),o||(_=_.filter(b=>!d(b.expires_at))),_=_.sort((b,I)=>new Date(b.expires_at).getTime()-new Date(I.expires_at).getTime());let C=E.filter(b=>!d(b.expires_at)).length,f=E.filter(b=>b.has_conflict).length,v=E.filter(b=>b.exclusive&&!d(b.expires_at)).length;return S`
      <div class="queen-reservations">
        <div class="reservations-header">
          <h2>File Reservations</h2>
          <div class="reservations-toolbar">
            <label class="toggle-expired">
              <input
                type="checkbox"
                ?checked=${o}
                @change=${A}
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
            <span class="stat-value">${C}</span>
            <span class="stat-label">Active</span>
          </div>
          <div class="stat">
            <span class="stat-value">${v}</span>
            <span class="stat-label">Exclusive</span>
          </div>
          ${f>0?S`
                <div class="stat stat-warning">
                  <span class="stat-value">${f}</span>
                  <span class="stat-label">Conflicts</span>
                </div>
              `:""}
          ${$.map(b=>S`
              <div
                class="stat droid-stat ${i===b?"active":""}"
                @click=${()=>w(b)}
              >
                <span class="stat-value">${E.filter(I=>I.droid===b&&!d(I.expires_at)).length}</span>
                <span class="stat-label">${b}</span>
              </div>
            `)}
        </div>
        <div class="reservations-table-container">
          ${_.length===0?S`<div class="empty-state">No reservations</div>`:S`
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
                    ${_.map(b=>p(b))}
                  </tbody>
                </table>
              `}
        </div>
      </div>
    `}function R(){ie(k(),s)}return{load(){n("load reservations view"),R(),r=e.subscribe(()=>R())},unload(){n("unload reservations view"),r&&(r(),r=null)},destroy(){r&&(r(),r=null),ie(S``,s)}}}var vn=["list-issues","update-status","edit-text","update-priority","create-issue","list-ready","dep-add","dep-remove","epic-status","update-assignee","label-add","label-remove","subscribe-list","unsubscribe-list","snapshot","upsert","delete"];function Vs(){let s=Date.now().toString(36),e=Math.random().toString(36).slice(2,8);return`${s}-${e}`}function kn(s,e,t=Vs()){return{id:t,type:s,payload:e}}function _n(s={}){let e=X("ws"),t={initialMs:s.backoff?.initialMs??1e3,maxMs:s.backoff?.maxMs??3e4,factor:s.backoff?.factor??2,jitterRatio:s.backoff?.jitterRatio??.2},n=()=>s.url&&s.url.length>0?s.url:typeof location<"u"?(location.protocol==="https:"?"wss://":"ws://")+location.host+"/ws":"ws://localhost/ws",r=null,i="closed",o=0,l=null,a=!0,d=new Map,p=[],u=new Map,h=new Set;function w(_){for(let C of Array.from(h))try{C(_)}catch{}}function A(){if(!a||l)return;i="reconnecting",e("ws reconnecting\u2026"),w(i);let _=Math.min(t.maxMs||0,(t.initialMs||0)*Math.pow(t.factor||1,o)),C=(t.jitterRatio||0)*_,f=Math.max(0,Math.round(_+(Math.random()*2-1)*C));e("ws retry in %d ms (attempt %d)",f,o+1),l=setTimeout(()=>{l=null,$()},f)}function k(_){try{r?.send(JSON.stringify(_))}catch(C){e("ws send failed",C)}}function R(){for(i="open",e("ws open"),w(i),o=0;p.length;){let _=p.shift();_&&k(_)}}function m(_){let C;try{C=JSON.parse(String(_.data))}catch{e("ws received non-JSON message");return}if(!C||typeof C.id!="string"||typeof C.type!="string"){e("ws received invalid envelope");return}if(d.has(C.id)){let v=d.get(C.id);d.delete(C.id),C.ok?v?.resolve(C.payload):v?.reject(C.error||new Error("ws error"));return}let f=u.get(C.type);if(f&&f.size>0)for(let v of Array.from(f))try{v(C.payload)}catch(b){e("ws event handler error",b)}else e("ws received unhandled message type: %s",C.type)}function E(){i="closed",e("ws closed"),w(i);for(let[_,C]of d.entries())C.reject(new Error("ws disconnected")),d.delete(_);o+=1,A()}function $(){if(!a)return;let _=n();try{r=new WebSocket(_),e("ws connecting %s",_),i="connecting",w(i),r.addEventListener("open",R),r.addEventListener("message",m),r.addEventListener("error",()=>{}),r.addEventListener("close",E)}catch(C){e("ws connect failed %o",C),A()}}return $(),{send(_,C){if(!vn.includes(_))return Promise.reject(new Error(`unknown message type: ${_}`));let f=Vs(),v=kn(_,C,f);return e("send %s id=%s",_,f),new Promise((b,I)=>{d.set(f,{resolve:b,reject:I,type:_}),r&&r.readyState===r.OPEN?k(v):(e("queue %s id=%s (state=%s)",_,f,i),p.push(v))})},on(_,C){u.has(_)||u.set(_,new Set);let f=u.get(_);return f?.add(C),()=>{f?.delete(C)}},onConnection(_){return h.add(_),()=>{h.delete(_)}},close(){a=!1,l&&(clearTimeout(l),l=null);try{r?.close()}catch{}},getState(){return i}}}function oo(s){let e=X("main");e("bootstrap start");let t=S`
    <section id="issues-root" class="route issues">
      <aside id="list-panel" class="panel"></aside>
    </section>
    <section id="epics-root" class="route epics" hidden></section>
    <section id="board-root" class="route board" hidden></section>
    <section id="detail-panel" class="route detail" hidden></section>
    <section id="messages-root" class="route messages" hidden></section>
    <section id="assignments-root" class="route assignments" hidden></section>
    <section id="reservations-root" class="route reservations" hidden></section>
  `;ie(t,s);let n=document.getElementById("top-nav"),r=document.getElementById("issues-root"),i=document.getElementById("epics-root"),o=document.getElementById("board-root"),l=document.getElementById("messages-root"),a=document.getElementById("assignments-root"),d=document.getElementById("reservations-root"),p=document.getElementById("list-panel"),u=document.getElementById("detail-panel");if(p&&r&&i&&o&&u&&l&&a&&d){let E=function(x,y){let U="Request failed",j="";if(x&&typeof x=="object"){let D=x;if(typeof D.message=="string"&&D.message.length>0&&(U=D.message),typeof D.details=="string")j=D.details;else if(D.details&&typeof D.details=="object")try{j=JSON.stringify(D.details,null,2)}catch{j=""}}else typeof x=="string"&&x.length>0&&(U=x);let g=y&&y.length>0?`Failed to load ${y}`:"Request failed";m.open(g,U,j)},N=function(x){let y=String(x?.status||"all");return y==="ready"?{type:"ready-issues"}:y==="in_progress"?{type:"in-progress-issues"}:y==="closed"?{type:"closed-issues"}:{type:"all-issues"}},je=function(x){if(x.view==="issues"){let y=N(x.filters||{}),U=JSON.stringify(y);try{f.register("tab:issues",y)}catch(j){e("register issues store failed: %o",j)}(!ye||U!==Te)&&C.subscribeList("tab:issues",y).then(j=>{ye=j,Te=U}).catch(j=>{e("subscribe issues failed: %o",j),E(j,"issues list")})}else if(ye){ye().catch(()=>{}),ye=null,Te=null;try{f.unregister("tab:issues")}catch(y){e("unregister issues store failed: %o",y)}}if(x.view==="epics"){try{f.register("tab:epics",{type:"epics"})}catch(y){e("register epics store failed: %o",y)}C.subscribeList("tab:epics",{type:"epics"}).then(y=>{ze=y}).catch(y=>{e("subscribe epics failed: %o",y),E(y,"epics")})}else if(ze){ze().catch(()=>{}),ze=null;try{f.unregister("tab:epics")}catch(y){e("unregister epics store failed: %o",y)}}if(x.view==="board"){if(!Ce){try{f.register("tab:board:ready",{type:"ready-issues"})}catch(y){e("register board:ready store failed: %o",y)}C.subscribeList("tab:board:ready",{type:"ready-issues"}).then(y=>Ce=y).catch(y=>{e("subscribe board ready failed: %o",y),E(y,"board (Ready)")})}if(!Oe){try{f.register("tab:board:in-progress",{type:"in-progress-issues"})}catch(y){e("register board:in-progress store failed: %o",y)}C.subscribeList("tab:board:in-progress",{type:"in-progress-issues"}).then(y=>Oe=y).catch(y=>{e("subscribe board in-progress failed: %o",y),E(y,"board (In Progress)")})}if(!Re){try{f.register("tab:board:closed",{type:"closed-issues"})}catch(y){e("register board:closed store failed: %o",y)}C.subscribeList("tab:board:closed",{type:"closed-issues"}).then(y=>Re=y).catch(y=>{e("subscribe board closed failed: %o",y),E(y,"board (Closed)")})}if(!Ae){try{f.register("tab:board:blocked",{type:"blocked-issues"})}catch(y){e("register board:blocked store failed: %o",y)}C.subscribeList("tab:board:blocked",{type:"blocked-issues"}).then(y=>Ae=y).catch(y=>{e("subscribe board blocked failed: %o",y),E(y,"board (Blocked)")})}}else{if(Ce){Ce().catch(()=>{}),Ce=null;try{f.unregister("tab:board:ready")}catch(y){e("unregister board:ready failed: %o",y)}}if(Oe){Oe().catch(()=>{}),Oe=null;try{f.unregister("tab:board:in-progress")}catch(y){e("unregister board:in-progress failed: %o",y)}}if(Re){Re().catch(()=>{}),Re=null;try{f.unregister("tab:board:closed")}catch(y){e("unregister board:closed failed: %o",y)}}if(Ae){Ae().catch(()=>{}),Ae=null;try{f.unregister("tab:board:blocked")}catch(y){e("unregister board:blocked failed: %o",y)}}}};var h=E,w=N,A=je;let k=document.getElementById("header-loading"),R=Tr(k),m=pn(s),$=_n(),_=R.wrapSend((x,y)=>$.send(x,y)),C=xr(_),f=Ar();$.on("snapshot",x=>{let y=x,U=y&&typeof y.id=="string"?y.id:"",j=U?f.getStore(U):null;if(j&&y&&y.type==="snapshot")try{j.applyPush(y)}catch{}}),$.on("upsert",x=>{let y=x,U=y&&typeof y.id=="string"?y.id:"",j=U?f.getStore(U):null;if(j&&y&&y.type==="upsert")try{j.applyPush(y)}catch{}}),$.on("delete",x=>{let y=x,U=y&&typeof y.id=="string"?y.id:"",j=U?f.getStore(U):null;if(j&&y&&y.type==="delete")try{j.applyPush(y)}catch{}});let v=Ke(f),b=!1;if(typeof $.onConnection=="function"){let x=y=>{e("ws state %s",y),y==="reconnecting"||y==="closed"?(b=!0,me("Connection lost. Reconnecting\u2026","error",4e3)):y==="open"&&b&&(b=!1,me("Reconnected","success",2200))};$.onConnection(x)}let I={status:"all",search:"",type:""};try{let x=window.localStorage.getItem("beads-ui.filters");if(x){let y=JSON.parse(x);if(y&&typeof y=="object"){let U=["bug","feature","task","epic","chore"],j="";if(typeof y.type=="string"&&U.includes(y.type))j=y.type;else if(Array.isArray(y.types)){let g="";for(let D of y.types)if(U.includes(String(D))){g=D;break}j=g}I={status:["all","open","in_progress","closed","ready"].includes(y.status)?y.status:"all",search:typeof y.search=="string"?y.search:"",type:j}}}}catch(x){e("filters parse error: %o",x)}let L="issues";try{let x=window.localStorage.getItem("beads-ui.view");(x==="issues"||x==="epics"||x==="board")&&(L=x)}catch(x){e("view parse error: %o",x)}let O={closed_filter:"today"};try{let x=window.localStorage.getItem("beads-ui.board");if(x){let y=JSON.parse(x);if(y&&typeof y=="object"){let U=String(y.closed_filter||"today");(U==="today"||U==="3"||U==="7")&&(O.closed_filter=U)}}}catch(x){e("board prefs parse error: %o",x)}let z=$r({filters:I,view:L,board:O}),H=Sr(z);H.start();let V=async(x,y)=>{try{return await _(x,y)}catch{return[]}};n&&gn(n,z,H);let Y=mn(s,(x,y)=>_(x,y),H,z);try{let x=document.getElementById("new-issue-btn");x&&x.addEventListener("click",()=>Y.open())}catch{}let ue=hn(p,async(x,y)=>{if(x==="list-issues")try{return v.selectIssuesFor("tab:issues")}catch(U){return e("list selectors failed: %o",U),[]}return V(x,y)},x=>{let y=Yt(x);y&&H.gotoIssue(y)},z,C,f);z.subscribe(x=>{let y={status:x.filters.status,search:x.filters.search,type:typeof x.filters.type=="string"?x.filters.type:""};window.localStorage.setItem("beads-ui.filters",JSON.stringify(y))}),z.subscribe(x=>{window.localStorage.setItem("beads-ui.board",JSON.stringify({closed_filter:x.board.closed_filter}))}),ue.load();let ce=fn(u,z,()=>{let x=z.getState();z.setState({selected_id:null});try{let y=x.view||"issues";H.gotoView(y)}catch{}}),oe=null;oe=dn(ce.getMount(),V,x=>{let y=Yt(x);y&&H.gotoIssue(y)},f);let ae=z.getState().selected_id;if(ae){u.hidden=!1,ce.open(ae),oe&&oe.load(ae);let x=`detail:${ae}`,y={type:"issue-detail",params:{id:ae}};try{f.register(x,y)}catch(U){e("register detail store failed: %o",U)}C.subscribeList(x,y).catch(U=>{e("detail subscribe failed: %o",U),E(U,"issue details")})}let B=null;z.subscribe(x=>{let y=x.selected_id;if(y){u.hidden=!1,ce.open(y),oe&&oe.load(y);let U=`detail:${y}`,j={type:"issue-detail",params:{id:y}};try{f.register(U,j)}catch{}C.subscribeList(U,j).then(g=>{B&&B().catch(()=>{}),B=g}).catch(g=>{e("detail subscribe failed: %o",g),E(g,"issue details")})}else{try{ce.close()}catch{}oe&&oe.clear(),u.hidden=!0,B&&(B().catch(()=>{}),B=null)}});let xe=_r(V),le=un(i,xe,x=>H.gotoIssue(x),C,f),et=Cr(o,xe,x=>H.gotoIssue(x),z,C,f),te=bn(l,z,{onRefresh:()=>{e("refresh messages requested")}}),Ne=yn(a,z,{onRefresh:()=>{e("refresh assignments requested")}}),qe=wn(d,z,{onRefresh:()=>{e("refresh reservations requested")}}),ye=null,ze=null,Ce=null,Oe=null,Re=null,Ae=null,Te=null,Ge=x=>{r&&i&&o&&u&&l&&a&&d&&(r.hidden=x.view!=="issues",i.hidden=x.view!=="epics",o.hidden=x.view!=="board",l.hidden=x.view!=="messages",a.hidden=x.view!=="assignments",d.hidden=x.view!=="reservations"),je(x),!x.selected_id&&x.view==="epics"&&le.load(),!x.selected_id&&x.view==="board"&&et.load(),x.view==="messages"?te.load():te.unload(),x.view==="assignments"?Ne.load():Ne.unload(),x.view==="reservations"?qe.load():qe.unload(),window.localStorage.setItem("beads-ui.view",x.view)};z.subscribe(Ge),Ge(z.getState()),window.addEventListener("keydown",x=>{let y=x.ctrlKey||x.metaKey,U=String(x.key||"").toLowerCase(),j=x.target,g=j&&j.tagName?String(j.tagName).toLowerCase():"",D=g==="input"||g==="textarea"||g==="select"||j&&typeof j.isContentEditable=="boolean"&&j.isContentEditable;y&&U==="n"&&(D||(x.preventDefault(),Y.open()))})}}typeof window<"u"&&typeof document<"u"&&window.addEventListener("DOMContentLoaded",()=>{try{let t=window.localStorage.getItem("beads-ui.theme"),n=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches,r=t==="dark"||t==="light"?t:n?"dark":"light";document.documentElement.setAttribute("data-theme",r);let i=document.getElementById("theme-switch");i&&(i.checked=r==="dark")}catch{}let s=document.getElementById("theme-switch");s&&s.addEventListener("change",()=>{let t=s.checked?"dark":"light";document.documentElement.setAttribute("data-theme",t),window.localStorage.setItem("beads-ui.theme",t)});let e=document.getElementById("app");e&&oo(e)});export{oo as bootstrap};
//# sourceMappingURL=main.bundle.js.map
