var Nn=Object.create;var gs=Object.defineProperty;var On=Object.getOwnPropertyDescriptor;var Pn=Object.getOwnPropertyNames;var Fn=Object.getPrototypeOf,zn=Object.prototype.hasOwnProperty;var Bn=(s,e,t)=>e in s?gs(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var ms=(s,e)=>()=>(e||s((e={exports:{}}).exports,e),e.exports);var Hn=(s,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of Pn(e))!zn.call(s,r)&&r!==t&&gs(s,r,{get:()=>e[r],enumerable:!(n=On(e,r))||n.enumerable});return s};var lr=(s,e,t)=>(t=s!=null?Nn(Fn(s)):{},Hn(e||!s||!s.__esModule?gs(t,"default",{value:s,enumerable:!0}):t,s));var Q=(s,e,t)=>Bn(s,typeof e!="symbol"?e+"":e,t);var vr=ms((wo,wr)=>{var bt=1e3,yt=bt*60,wt=yt*60,ot=wt*24,Gn=ot*7,Vn=ot*365.25;wr.exports=function(s,e){e=e||{};var t=typeof s;if(t==="string"&&s.length>0)return Zn(s);if(t==="number"&&isFinite(s))return e.long?Yn(s):Kn(s);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(s))};function Zn(s){if(s=String(s),!(s.length>100)){var e=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(s);if(e){var t=parseFloat(e[1]),n=(e[2]||"ms").toLowerCase();switch(n){case"years":case"year":case"yrs":case"yr":case"y":return t*Vn;case"weeks":case"week":case"w":return t*Gn;case"days":case"day":case"d":return t*ot;case"hours":case"hour":case"hrs":case"hr":case"h":return t*wt;case"minutes":case"minute":case"mins":case"min":case"m":return t*yt;case"seconds":case"second":case"secs":case"sec":case"s":return t*bt;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return t;default:return}}}}function Kn(s){var e=Math.abs(s);return e>=ot?Math.round(s/ot)+"d":e>=wt?Math.round(s/wt)+"h":e>=yt?Math.round(s/yt)+"m":e>=bt?Math.round(s/bt)+"s":s+"ms"}function Yn(s){var e=Math.abs(s);return e>=ot?Vt(s,e,ot,"day"):e>=wt?Vt(s,e,wt,"hour"):e>=yt?Vt(s,e,yt,"minute"):e>=bt?Vt(s,e,bt,"second"):s+" ms"}function Vt(s,e,t,n){var r=e>=t*1.5;return Math.round(s/t)+" "+n+(r?"s":"")}});var _r=ms((vo,kr)=>{function Xn(s){t.debug=t,t.default=t,t.coerce=a,t.disable=o,t.enable=r,t.enabled=c,t.humanize=vr(),t.destroy=p,Object.keys(s).forEach(f=>{t[f]=s[f]}),t.names=[],t.skips=[],t.formatters={};function e(f){let h=0;for(let m=0;m<f.length;m++)h=(h<<5)-h+f.charCodeAt(m),h|=0;return t.colors[Math.abs(h)%t.colors.length]}t.selectColor=e;function t(f){let h,m=null,v,_;function k(...x){if(!k.enabled)return;let g=k,A=Number(new Date),E=A-(h||A);g.diff=E,g.prev=h,g.curr=A,h=A,x[0]=t.coerce(x[0]),typeof x[0]!="string"&&x.unshift("%O");let $=0;x[0]=x[0].replace(/%([a-zA-Z%])/g,(w,y)=>{if(w==="%%")return"%";$++;let b=t.formatters[y];if(typeof b=="function"){let I=x[$];w=b.call(g,I),x.splice($,1),$--}return w}),t.formatArgs.call(g,x),(g.log||t.log).apply(g,x)}return k.namespace=f,k.useColors=t.useColors(),k.color=t.selectColor(f),k.extend=n,k.destroy=t.destroy,Object.defineProperty(k,"enabled",{enumerable:!0,configurable:!1,get:()=>m!==null?m:(v!==t.namespaces&&(v=t.namespaces,_=t.enabled(f)),_),set:x=>{m=x}}),typeof t.init=="function"&&t.init(k),k}function n(f,h){let m=t(this.namespace+(typeof h>"u"?":":h)+f);return m.log=this.log,m}function r(f){t.save(f),t.namespaces=f,t.names=[],t.skips=[];let h=(typeof f=="string"?f:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(let m of h)m[0]==="-"?t.skips.push(m.slice(1)):t.names.push(m)}function i(f,h){let m=0,v=0,_=-1,k=0;for(;m<f.length;)if(v<h.length&&(h[v]===f[m]||h[v]==="*"))h[v]==="*"?(_=v,k=m,v++):(m++,v++);else if(_!==-1)v=_+1,k++,m=k;else return!1;for(;v<h.length&&h[v]==="*";)v++;return v===h.length}function o(){let f=[...t.names,...t.skips.map(h=>"-"+h)].join(",");return t.enable(""),f}function c(f){for(let h of t.skips)if(i(f,h))return!1;for(let h of t.names)if(i(f,h))return!0;return!1}function a(f){return f instanceof Error?f.stack||f.message:f}function p(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")}return t.enable(t.load()),t}kr.exports=Xn});var Ss=ms((ke,Zt)=>{ke.formatArgs=Jn;ke.save=ei;ke.load=ti;ke.useColors=Qn;ke.storage=si();ke.destroy=(()=>{let s=!1;return()=>{s||(s=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})();ke.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function Qn(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let s;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(s=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(s[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function Jn(s){if(s[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+s[0]+(this.useColors?"%c ":" ")+"+"+Zt.exports.humanize(this.diff),!this.useColors)return;let e="color: "+this.color;s.splice(1,0,e,"color: inherit");let t=0,n=0;s[0].replace(/%[a-zA-Z%]/g,r=>{r!=="%%"&&(t++,r==="%c"&&(n=t))}),s.splice(n,0,e)}ke.log=console.debug||console.log||(()=>{});function ei(s){try{s?ke.storage.setItem("debug",s):ke.storage.removeItem("debug")}catch{}}function ti(){let s;try{s=ke.storage.getItem("debug")||ke.storage.getItem("DEBUG")}catch{}return!s&&typeof process<"u"&&"env"in process&&(s=process.env.DEBUG),s}function si(){try{return localStorage}catch{}}Zt.exports=_r()(ke);var{formatters:ri}=Zt.exports;ri.j=function(s){try{return JSON.stringify(s)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}}});var xt=globalThis,Gt=xt.trustedTypes,cr=Gt?Gt.createPolicy("lit-html",{createHTML:s=>s}):void 0,gr="$lit$",Ge=`lit$${Math.random().toFixed(9).slice(2)}$`,mr="?"+Ge,Un=`<${mr}>`,nt=document,$t=()=>nt.createComment(""),St=s=>s===null||typeof s!="object"&&typeof s!="function",xs=Array.isArray,qn=s=>xs(s)||typeof s?.[Symbol.iterator]=="function",bs=`[ 	
\f\r]`,_t=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,dr=/-->/g,ur=/>/g,st=RegExp(`>|${bs}(?:([^\\s"'>=/]+)(${bs}*=${bs}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),pr=/'/g,fr=/"/g,br=/^(?:script|style|textarea|title)$/i,$s=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),S=$s(1),fo=$s(2),ho=$s(3),it=Symbol.for("lit-noChange"),ie=Symbol.for("lit-nothing"),hr=new WeakMap,rt=nt.createTreeWalker(nt,129);function yr(s,e){if(!xs(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return cr!==void 0?cr.createHTML(e):e}var jn=(s,e)=>{let t=s.length-1,n=[],r,i=e===2?"<svg>":e===3?"<math>":"",o=_t;for(let c=0;c<t;c++){let a=s[c],p,f,h=-1,m=0;for(;m<a.length&&(o.lastIndex=m,f=o.exec(a),f!==null);)m=o.lastIndex,o===_t?f[1]==="!--"?o=dr:f[1]!==void 0?o=ur:f[2]!==void 0?(br.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=st):f[3]!==void 0&&(o=st):o===st?f[0]===">"?(o=r??_t,h=-1):f[1]===void 0?h=-2:(h=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?st:f[3]==='"'?fr:pr):o===fr||o===pr?o=st:o===dr||o===ur?o=_t:(o=st,r=void 0);let v=o===st&&s[c+1].startsWith("/>")?" ":"";i+=o===_t?a+Un:h>=0?(n.push(p),a.slice(0,h)+gr+a.slice(h)+Ge+v):a+Ge+(h===-2?c:v)}return[yr(s,i+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),n]},At=class s{constructor({strings:e,_$litType$:t},n){let r;this.parts=[];let i=0,o=0,c=e.length-1,a=this.parts,[p,f]=jn(e,t);if(this.el=s.createElement(p,n),rt.currentNode=this.el.content,t===2||t===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(r=rt.nextNode())!==null&&a.length<c;){if(r.nodeType===1){if(r.hasAttributes())for(let h of r.getAttributeNames())if(h.endsWith(gr)){let m=f[o++],v=r.getAttribute(h).split(Ge),_=/([.?@])?(.*)/.exec(m);a.push({type:1,index:i,name:_[2],strings:v,ctor:_[1]==="."?ws:_[1]==="?"?vs:_[1]==="@"?ks:gt}),r.removeAttribute(h)}else h.startsWith(Ge)&&(a.push({type:6,index:i}),r.removeAttribute(h));if(br.test(r.tagName)){let h=r.textContent.split(Ge),m=h.length-1;if(m>0){r.textContent=Gt?Gt.emptyScript:"";for(let v=0;v<m;v++)r.append(h[v],$t()),rt.nextNode(),a.push({type:2,index:++i});r.append(h[m],$t())}}}else if(r.nodeType===8)if(r.data===mr)a.push({type:2,index:i});else{let h=-1;for(;(h=r.data.indexOf(Ge,h+1))!==-1;)a.push({type:7,index:i}),h+=Ge.length-1}i++}}static createElement(e,t){let n=nt.createElement("template");return n.innerHTML=e,n}};function ht(s,e,t=s,n){if(e===it)return e;let r=n!==void 0?t._$Co?.[n]:t._$Cl,i=St(e)?void 0:e._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),i===void 0?r=void 0:(r=new i(s),r._$AT(s,t,n)),n!==void 0?(t._$Co??(t._$Co=[]))[n]=r:t._$Cl=r),r!==void 0&&(e=ht(s,r._$AS(s,e.values),r,n)),e}var ys=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??nt).importNode(t,!0);rt.currentNode=r;let i=rt.nextNode(),o=0,c=0,a=n[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new Tt(i,i.nextSibling,this,e):a.type===1?p=new a.ctor(i,a.name,a.strings,this,e):a.type===6&&(p=new _s(i,this,e)),this._$AV.push(p),a=n[++c]}o!==a?.index&&(i=rt.nextNode(),o++)}return rt.currentNode=nt,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(e,n,t),t+=n.strings.length-2):n._$AI(e[t])),t++}},Tt=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=ie,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ht(this,e,t),St(e)?e===ie||e==null||e===""?(this._$AH!==ie&&this._$AR(),this._$AH=ie):e!==this._$AH&&e!==it&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):qn(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==ie&&St(this._$AH)?this._$AA.nextSibling.data=e:this.T(nt.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=At.createElement(yr(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let i=new ys(r,this),o=i.u(this.options);i.p(t),this.T(o),this._$AH=i}}_$AC(e){let t=hr.get(e.strings);return t===void 0&&hr.set(e.strings,t=new At(e)),t}k(e){xs(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,n,r=0;for(let i of e)r===t.length?t.push(n=new s(this.O($t()),this.O($t()),this,this.options)):n=t[r],n._$AI(i),r++;r<t.length&&(this._$AR(n&&n._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let n=e.nextSibling;e.remove(),e=n}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},gt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=ie,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=ie}_$AI(e,t=this,n,r){let i=this.strings,o=!1;if(i===void 0)e=ht(this,e,t,0),o=!St(e)||e!==this._$AH&&e!==it,o&&(this._$AH=e);else{let c=e,a,p;for(e=i[0],a=0;a<i.length-1;a++)p=ht(this,c[n+a],t,a),p===it&&(p=this._$AH[a]),o||(o=!St(p)||p!==this._$AH[a]),p===ie?e=ie:e!==ie&&(e+=(p??"")+i[a+1]),this._$AH[a]=p}o&&!r&&this.j(e)}j(e){e===ie?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ws=class extends gt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===ie?void 0:e}},vs=class extends gt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==ie)}},ks=class extends gt{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=ht(this,e,t,0)??ie)===it)return;let n=this._$AH,r=e===ie&&n!==ie||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==ie&&(n===ie||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},_s=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){ht(this,e)}};var Wn=xt.litHtmlPolyfillSupport;Wn?.(At,Tt),(xt.litHtmlVersions??(xt.litHtmlVersions=[])).push("3.3.1");var X=(s,e,t)=>{let n=t?.renderBefore??e,r=n._$litPart$;if(r===void 0){let i=t?.renderBefore??null;n._$litPart$=r=new Tt(e.insertBefore($t(),i),i,void 0,t??{})}return r._$AI(s),r};function Ce(s,e){let t=s.priority??2,n=e.priority??2;if(t!==n)return t-n;let r=s.created_at??0,i=e.created_at??0;if(r!==i)return r<i?-1:1;let o=s.id,c=e.id;return o<c?-1:o>c?1:0}function mt(s,e){let t=s.closed_at??0,n=e.closed_at??0;if(t!==n)return t<n?1:-1;let r=s?.id,i=e?.id;return r<i?-1:r>i?1:0}function Ve(s=void 0){function e(i){return!s||typeof s.snapshotFor!="function"?[]:s.snapshotFor(i).slice().sort(Ce)}function t(i,o){let c=s&&s.snapshotFor?s.snapshotFor(i).slice():[];return o==="in_progress"?c.sort(Ce):o==="closed"?c.sort(mt):c.sort(Ce),c}function n(i){if(!s||typeof s.snapshotFor!="function")return[];let c=(s.snapshotFor(`detail:${i}`)||[]).find(p=>String(p?.id||"")===String(i));return(Array.isArray(c?.dependents)?c.dependents:[]).slice().sort(Ce)}function r(i){return s&&typeof s.subscribe=="function"?s.subscribe(i):()=>{}}return{selectIssuesFor:e,selectBoardColumn:t,selectEpicChildren:n,subscribe:r}}var xr=lr(Ss(),1);function Z(s){return(0,xr.default)(`queenui:${s}`)}function $r(s){let e=Z("data");async function t(n){let{id:r}=n;e("updateIssue %s %o",r,Object.keys(n));let i=null;return typeof n.title=="string"&&(i=await s("edit-text",{id:r,field:"title",value:n.title})),typeof n.acceptance=="string"&&(i=await s("edit-text",{id:r,field:"acceptance",value:n.acceptance})),typeof n.notes=="string"&&(i=await s("edit-text",{id:r,field:"notes",value:n.notes})),typeof n.design=="string"&&(i=await s("edit-text",{id:r,field:"design",value:n.design})),typeof n.status=="string"&&(i=await s("update-status",{id:r,status:n.status})),typeof n.priority=="number"&&(i=await s("update-priority",{id:r,priority:n.priority})),typeof n.assignee=="string"&&(i=await s("update-assignee",{id:r,assignee:n.assignee})),e("updateIssue done %s",r),i}return{updateIssue:t}}function As(s,e={}){let t=Z(`issue-store:${s}`),n=new Map,r=[],i=0,o=new Set,c=!1,a=e.sort||Ce;function p(){for(let m of Array.from(o))try{m()}catch{}}function f(){r=Array.from(n.values()).sort(a)}function h(m){if(c||!m||m.id!==s)return;let v=Number(m.revision)||0;if(t("apply %s rev=%d",m.type,v),!(v<=i&&m.type!=="snapshot")){if(m.type==="snapshot"){if(v<=i)return;n.clear();let _=Array.isArray(m.issues)?m.issues:[];for(let k of _)k&&typeof k.id=="string"&&k.id.length>0&&n.set(k.id,k);f(),i=v,p();return}if(m.type==="upsert"){let _=m.issue;if(_&&typeof _.id=="string"&&_.id.length>0){let k=n.get(_.id);if(!k)n.set(_.id,_);else{let x=Number.isFinite(k.updated_at)?k.updated_at:0,g=Number.isFinite(_.updated_at)?_.updated_at:0;if(x<=g){for(let A of Object.keys(k))A in _||delete k[A];for(let[A,E]of Object.entries(_))k[A]=E}}f()}i=v,p()}else if(m.type==="delete"){let _=String(m.issue_id||"");_&&(n.delete(_),f()),i=v,p()}}}return{id:s,subscribe(m){return o.add(m),()=>{o.delete(m)}},applyPush:h,snapshot(){return r},size(){return n.size},getById(m){return n.get(m)},dispose(){c=!0,n.clear(),r=[],o.clear(),i=0}}}function Kt(s){let e=String(s.type||"").trim(),t={};if(s.params&&typeof s.params=="object"){let r=Object.keys(s.params).sort();for(let i of r){let o=s.params[i];t[i]=String(o)}}let n=new URLSearchParams(t).toString();return n.length>0?`${e}?${n}`:e}function Sr(s){let e=Z("subs"),t=new Map,n=new Map;function r(c,a){e("applyDelta %s +%d ~%d -%d",c,(a.added||[]).length,(a.updated||[]).length,(a.removed||[]).length);let p=n.get(c);if(!p||p.size===0)return;let f=Array.isArray(a.added)?a.added:[],h=Array.isArray(a.updated)?a.updated:[],m=Array.isArray(a.removed)?a.removed:[];for(let v of Array.from(p)){let _=t.get(v);if(!_)continue;let k=_.itemsById;for(let x of f)typeof x=="string"&&x.length>0&&k.set(x,!0);for(let x of h)typeof x=="string"&&x.length>0&&k.set(x,!0);for(let x of m)typeof x=="string"&&x.length>0&&k.delete(x)}}async function i(c,a){let p=Kt(a);if(e("subscribe %s key=%s",c,p),!t.has(c))t.set(c,{key:p,itemsById:new Map});else{let h=t.get(c);if(h&&h.key!==p){let m=n.get(h.key);m&&(m.delete(c),m.size===0&&n.delete(h.key)),t.set(c,{key:p,itemsById:new Map})}}n.has(p)||n.set(p,new Set);let f=n.get(p);f&&f.add(c);try{await s("subscribe-list",{id:c,type:a.type,params:a.params})}catch(h){let m=t.get(c)||null;if(m){let v=n.get(m.key);v&&(v.delete(c),v.size===0&&n.delete(m.key))}throw t.delete(c),h}return async()=>{e("unsubscribe %s key=%s",c,p);try{await s("unsubscribe-list",{id:c})}catch{}let h=t.get(c)||null;if(h){let m=n.get(h.key);m&&(m.delete(c),m.size===0&&n.delete(h.key))}t.delete(c)}}return{subscribeList:i,_applyDelta:r,_subKeyOf:Kt,selectors:{getIds(c){let a=t.get(c);return a?Array.from(a.itemsById.keys()):[]},has(c,a){let p=t.get(c);return p?p.itemsById.has(a):!1},count(c){let a=t.get(c);return a?a.itemsById.size:0},getItemsById(c){let a=t.get(c),p={};if(!a)return p;for(let f of a.itemsById.keys())p[f]=!0;return p}}}}function Ar(){let s=Z("issue-stores"),e=new Map,t=new Map,n=new Set,r=new Map;function i(){for(let a of Array.from(n))try{a()}catch{}}function o(a,p,f){let h=p?Kt(p):"",m=t.get(a)||"",v=e.has(a);if(s("register %s key=%s (prev=%s)",a,h,m),v&&m&&h&&m!==h){let _=e.get(a);if(_)try{_.dispose()}catch{}let k=r.get(a);if(k){try{k()}catch{}r.delete(a)}let x=As(a,f);e.set(a,x);let g=x.subscribe(()=>i());r.set(a,g)}else if(!v){let _=As(a,f);e.set(a,_);let k=_.subscribe(()=>i());r.set(a,k)}return t.set(a,h),()=>c(a)}function c(a){s("unregister %s",a),t.delete(a);let p=e.get(a);p&&(p.dispose(),e.delete(a));let f=r.get(a);if(f){try{f()}catch{}r.delete(a)}}return{register:o,unregister:c,getStore(a){return e.get(a)||null},snapshotFor(a){let p=e.get(a);return p?p.snapshot().slice():[]},subscribe(a){return n.add(a),()=>n.delete(a)}}}function Ze(s,e){return`#/${s==="epics"||s==="board"?s:"issues"}?issue=${encodeURIComponent(e)}`}function Yt(s){let e=String(s||""),t=e.startsWith("#")?e.slice(1):e,n=t.indexOf("?"),r=n>=0?t.slice(n+1):"";if(r){let c=new URLSearchParams(r).get("issue");if(c)return decodeURIComponent(c)}let i=/^\/issue\/([^\s?#]+)/.exec(t);return i&&i[1]?decodeURIComponent(i[1]):null}function Ts(s){let e=String(s||"");return/^#\/epics(\b|\/|$)/.test(e)?"epics":/^#\/board(\b|\/|$)/.test(e)?"board":/^#\/messages(\b|\/|$)/.test(e)?"messages":/^#\/assignments(\b|\/|$)/.test(e)?"assignments":/^#\/reservations(\b|\/|$)/.test(e)?"reservations":/^#\/droids(\b|\/|$)/.test(e)?"droids":/^#\/worktrees(\b|\/|$)/.test(e)?"worktrees":"issues"}function Tr(s){let e=Z("router"),t=()=>{let n=window.location.hash||"",r=/^#\/issue\/([^\s?#]+)/.exec(n);if(r&&r[1]){let c=decodeURIComponent(r[1]);s.setState({selected_id:c,view:"issues"});let a=`#/issues?issue=${encodeURIComponent(c)}`;if(window.location.hash!==a){window.location.hash=a;return}}let i=Yt(n),o=Ts(n);e("hash change \u2192 view=%s id=%s",o,i),s.setState({selected_id:i,view:o})};return{start(){window.addEventListener("hashchange",t),t()},stop(){window.removeEventListener("hashchange",t)},gotoIssue(n){let i=(s.getState?s.getState():{view:"issues"}).view||"issues",o=Ze(i,n);e("goto issue %s (view=%s)",n,i),window.location.hash!==o?window.location.hash=o:s.setState({selected_id:n,view:i})},gotoView(n){let i=(s.getState?s.getState():{selected_id:null}).selected_id,o=i?Ze(n,i):`#/${n}`;e("goto view %s (id=%s)",n,i||""),window.location.hash!==o?window.location.hash=o:s.setState({view:n,selected_id:null})}}}function Er(s={}){let e=Z("state"),t={selected_id:s.selected_id??null,view:s.view??"issues",filters:{status:s.filters?.status??"all",search:s.filters?.search??"",type:typeof s.filters?.type=="string"?s.filters?.type:""},board:{closed_filter:s.board?.closed_filter==="3"||s.board?.closed_filter==="7"||s.board?.closed_filter==="today"?s.board?.closed_filter:"today"}},n=new Set;function r(){for(let i of Array.from(n))try{i(t)}catch{}}return{getState(){return t},setState(i){let o={...t,...i,filters:{...t.filters,...i.filters||{}},board:{...t.board,...i.board||{}}};o.selected_id===t.selected_id&&o.view===t.view&&o.filters.status===t.filters.status&&o.filters.search===t.filters.search&&o.filters.type===t.filters.type&&o.board.closed_filter===t.board.closed_filter||(t=o,e("state change %o",{selected_id:t.selected_id,view:t.view,filters:t.filters,board:t.board}),r())},subscribe(i){return n.add(i),()=>n.delete(i)}}}function Cr(s){let e=0;function t(){if(!s)return;let o=e>0;s.toggleAttribute("hidden",!o),s.setAttribute("aria-busy",o?"true":"false")}function n(){e+=1,t()}function r(){e=Math.max(0,e-1),t()}function i(o){return async(c,a)=>{n();try{return await o(c,a)}finally{r()}}}return t(),{wrapSend:i,start:n,done:r,getCount:()=>e}}function ce(s,e="info",t=2800){let n=document.createElement("div");n.className="toast",n.textContent=s,n.style.position="fixed",n.style.right="12px",n.style.bottom="12px",n.style.zIndex="1000",n.style.color="#fff",n.style.padding="8px 10px",n.style.borderRadius="4px",n.style.fontSize="12px",e==="success"?n.style.background="#156d36":e==="error"?n.style.background="#9f2011":n.style.background="rgba(0,0,0,0.85)",(document.body||document.documentElement).appendChild(n),setTimeout(()=>{try{n.remove()}catch{}},t)}function Ke(s,e){let t=typeof e?.duration_ms=="number"?e.duration_ms:1200,n=document.createElement("button");n.className=(e?.class_name?e.class_name+" ":"")+"mono id-copy",n.type="button",n.setAttribute("aria-live","polite"),n.setAttribute("title","Copy issue ID"),n.setAttribute("aria-label",`Copy issue ID ${s}`),n.textContent=s;async function r(){try{navigator.clipboard&&typeof navigator.clipboard.writeText=="function"&&await navigator.clipboard.writeText(String(s)),n.textContent="Copied";let i=n.getAttribute("aria-label")||"";n.setAttribute("aria-label","Copied"),setTimeout(()=>{n.textContent=s,n.setAttribute("aria-label",i)},Math.max(80,t))}catch{}}return n.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),r()}),n.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),i.stopPropagation(),r())}),n}var Ye=["Critical","High","Medium","Low","Backlog"];function Rr(s){let e=typeof s=="number"?s:2,t=document.createElement("span");t.className="priority-badge",t.classList.add(`is-p${Math.max(0,Math.min(4,e))}`),t.setAttribute("role","img");let n=ni(e);return t.setAttribute("title",n),t.setAttribute("aria-label",`Priority: ${n}`),t.textContent=Et(e)+" "+n,t}function ni(s){let e=Math.max(0,Math.min(4,s));return Ye[e]||"Medium"}function Et(s){switch(s){case 0:return"\u{1F525}";case 1:return"\u26A1\uFE0F";case 2:return"\u{1F527}";case 3:return"\u{1FAB6}";case 4:return"\u{1F4A4}";default:return"\u{1F527}"}}function at(s){let e=document.createElement("span");e.className="type-badge";let t=(s||"").toString().toLowerCase(),n=new Set(["bug","feature","task","epic","chore"]),r=n.has(t)?t:"neutral";e.classList.add(`type-badge--${r}`),e.setAttribute("role","img");let i=n.has(t)?t==="bug"?"Bug":t==="feature"?"Feature":t==="task"?"Task":t==="epic"?"Epic":"Chore":"\u2014";return e.setAttribute("aria-label",n.has(t)?`Issue type: ${i}`:"Issue type: unknown"),e.setAttribute("title",n.has(t)?`Type: ${i}`:"Type: unknown"),e.textContent=i,e}function Ir(s,e,t,n,r=void 0,i=void 0){let o=Z("views:board"),c=[],a=[],p=[],f=[],h=[],m=i?Ve(i):null,v="today";if(n)try{let y=n.getState(),b=y&&y.board?String(y.board.closed_filter||"today"):"today";(b==="today"||b==="3"||b==="7")&&(v=b)}catch{}function _(){return S`
      <div class="panel__body board-root">
        ${k("Blocked","blocked-col",a)}
        ${k("Ready","ready-col",c)}
        ${k("In Progress","in-progress-col",p)}
        ${k("Closed","closed-col",f)}
      </div>
    `}function k(y,b,I){let D=Array.isArray(I)?I.length:0,N=D===1?"1 issue":`${D} issues`;return S`
      <section class="board-column" id=${b}>
        <header
          class="board-column__header"
          id=${b+"-header"}
          role="heading"
          aria-level="2"
        >
          <div class="board-column__title">
            <span class="board-column__title-text">${y}</span>
            <span class="badge board-column__count" aria-label=${N}>
              ${D}
            </span>
          </div>
          ${b==="closed-col"?S`<label class="board-closed-filter">
                <span class="visually-hidden">Filter closed issues</span>
                <select
                  id="closed-filter"
                  aria-label="Filter closed issues"
                  @change=${R}
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
          aria-labelledby=${b+"-header"}
        >
          ${I.map(U=>x(U))}
        </div>
      </section>
    `}function x(y){return S`
      <article
        class="board-card"
        data-issue-id=${y.id}
        role="listitem"
        tabindex="-1"
        @click=${()=>t(y.id)}
      >
        <div class="board-card__title text-truncate">
          ${y.title||"(no title)"}
        </div>
        <div class="board-card__meta">
          ${at(y.issue_type)} ${Rr(y.priority)}
          ${Ke(y.id,{class_name:"mono"})}
        </div>
      </article>
    `}function g(){X(_(),s),A()}function A(){try{let y=Array.from(s.querySelectorAll(".board-column"));for(let b of y){let I=b.querySelector(".board-column__body");if(!I)continue;let D=Array.from(I.querySelectorAll(".board-card")),N=b.querySelector(".board-column__header"),U=N&&N.textContent?.trim()||"";for(let j of D){let F=j.querySelector(".board-card__title"),q=F&&F.textContent?.trim()||"";j.setAttribute("aria-label",`Issue ${q||"(no title)"} \u2014 Column ${U}`),j.tabIndex=-1}D.length>0&&(D[0].tabIndex=0)}}catch{}}s.addEventListener("keydown",y=>{let b=y.target;if(!b||!(b instanceof HTMLElement))return;let I=String(b.tagName||"").toLowerCase();if(I==="input"||I==="textarea"||I==="select"||b.isContentEditable===!0)return;let D=b.closest(".board-card");if(!D)return;let N=String(y.key||"");if(N==="Enter"||N===" "){y.preventDefault();let V=D.getAttribute("data-issue-id");V&&t(V);return}if(N!=="ArrowUp"&&N!=="ArrowDown"&&N!=="ArrowLeft"&&N!=="ArrowRight")return;y.preventDefault();let U=D.closest(".board-column");if(!U)return;let j=U.querySelector(".board-column__body");if(!j)return;let F=Array.from(j.querySelectorAll(".board-card")),q=F.indexOf(D);if(q!==-1){if(N==="ArrowDown"&&q<F.length-1){E(F[q],F[q+1]);return}if(N==="ArrowUp"&&q>0){E(F[q],F[q-1]);return}if(N==="ArrowRight"||N==="ArrowLeft"){let V=Array.from(s.querySelectorAll(".board-column")),re=V.indexOf(U);if(re===-1)return;let de=N==="ArrowRight"?1:-1,fe=re+de,ne=null;for(;fe>=0&&fe<V.length;){let z=V[fe],ue=z.querySelector(".board-column__body");if((ue?Array.from(ue.querySelectorAll(".board-card")):[]).length>0){ne=z;break}fe+=de}if(ne){let z=ne.querySelector(".board-column__body .board-card");z&&E(D,z)}return}}});function E(y,b){try{y.tabIndex=-1,b.tabIndex=0,b.focus()}catch{}}function $(){o("applyClosedFilter %s",v);let y=Array.isArray(h)?[...h]:[],b=new Date,I=0;v==="today"?I=new Date(b.getFullYear(),b.getMonth(),b.getDate(),0,0,0,0).getTime():v==="3"?I=b.getTime()-4320*60*1e3:v==="7"&&(I=b.getTime()-10080*60*1e3),y=y.filter(D=>{let N=Number.isFinite(D.closed_at)?D.closed_at:NaN;return Number.isFinite(N)?N>=I:!1}),y.sort(mt),f=y}function R(y){try{let b=y.target,I=String(b.value||"today");if(v=I==="3"||I==="7"?I:"today",o("closed filter %s",v),n)try{n.setState({board:{closed_filter:v}})}catch{}$(),g()}catch{}}function w(){try{if(m){let y=m.selectBoardColumn("tab:board:in-progress","in_progress"),b=m.selectBoardColumn("tab:board:blocked","blocked"),I=m.selectBoardColumn("tab:board:ready","ready"),D=m.selectBoardColumn("tab:board:closed","closed"),N=new Set(y.map(j=>j.id));c=I.filter(j=>!N.has(j.id)),a=b,p=y,h=D}$(),g()}catch{c=[],a=[],p=[],f=[],g()}}return m&&m.subscribe(()=>{try{w()}catch{}}),{async load(){o("load"),w();try{let y=!!(r&&r.selectors),b=U=>{if(!y||!r)return 0;let j=r.selectors;if(typeof j.count=="function")return Number(j.count(U)||0);try{let F=j.getIds(U);return Array.isArray(F)?F.length:0}catch{return 0}},I=b("tab:board:ready")+b("tab:board:blocked")+b("tab:board:in-progress")+b("tab:board:closed"),D=e,N=D&&typeof D.getReady=="function"&&typeof D.getBlocked=="function"&&typeof D.getInProgress=="function"&&typeof D.getClosed=="function";if(I===0&&N){o("fallback fetch");let[U,j,F,q]=await Promise.all([D.getReady().catch(()=>[]),D.getBlocked().catch(()=>[]),D.getInProgress().catch(()=>[]),D.getClosed().catch(()=>[])]),V=Array.isArray(U)?U.map(z=>z):[],re=Array.isArray(j)?j.map(z=>z):[],de=Array.isArray(F)?F.map(z=>z):[],fe=Array.isArray(q)?q.map(z=>z):[],ne=new Set(de.map(z=>z.id));V=V.filter(z=>!ne.has(z.id)),V.sort(Ce),re.sort(Ce),de.sort(Ce),c=V,a=re,p=de,h=fe,$(),g()}}catch{}},clear(){s.replaceChildren(),c=[],a=[],p=[],f=[]}}}var{entries:Br,setPrototypeOf:Dr,isFrozen:ii,getPrototypeOf:oi,getOwnPropertyDescriptor:ai}=Object,{freeze:be,seal:$e,create:Ms}=Object,{apply:Ns,construct:Os}=typeof Reflect<"u"&&Reflect;be||(be=function(e){return e});$e||($e=function(e){return e});Ns||(Ns=function(e,t){for(var n=arguments.length,r=new Array(n>2?n-2:0),i=2;i<n;i++)r[i-2]=arguments[i];return e.apply(t,r)});Os||(Os=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return new e(...n)});var Xt=ye(Array.prototype.forEach),li=ye(Array.prototype.lastIndexOf),Lr=ye(Array.prototype.pop),Ct=ye(Array.prototype.push),ci=ye(Array.prototype.splice),Jt=ye(String.prototype.toLowerCase),Es=ye(String.prototype.toString),Cs=ye(String.prototype.match),Rt=ye(String.prototype.replace),di=ye(String.prototype.indexOf),ui=ye(String.prototype.trim),Re=ye(Object.prototype.hasOwnProperty),me=ye(RegExp.prototype.test),It=pi(TypeError);function ye(s){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return Ns(s,e,n)}}function pi(s){return function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return Os(s,t)}}function W(s,e){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Jt;Dr&&Dr(s,null);let n=e.length;for(;n--;){let r=e[n];if(typeof r=="string"){let i=t(r);i!==r&&(ii(e)||(e[n]=i),r=i)}s[r]=!0}return s}function fi(s){for(let e=0;e<s.length;e++)Re(s,e)||(s[e]=null);return s}function Ne(s){let e=Ms(null);for(let[t,n]of Br(s))Re(s,t)&&(Array.isArray(n)?e[t]=fi(n):n&&typeof n=="object"&&n.constructor===Object?e[t]=Ne(n):e[t]=n);return e}function Dt(s,e){for(;s!==null;){let n=ai(s,e);if(n){if(n.get)return ye(n.get);if(typeof n.value=="function")return ye(n.value)}s=oi(s)}function t(){return null}return t}var Mr=be(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Rs=be(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Is=be(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),hi=be(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Ds=be(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),gi=be(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Nr=be(["#text"]),Or=be(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Ls=be(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Pr=be(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Qt=be(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),mi=$e(/\{\{[\w\W]*|[\w\W]*\}\}/gm),bi=$e(/<%[\w\W]*|[\w\W]*%>/gm),yi=$e(/\$\{[\w\W]*/gm),wi=$e(/^data-[\-\w.\u00B7-\uFFFF]+$/),vi=$e(/^aria-[\-\w]+$/),Hr=$e(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),ki=$e(/^(?:\w+script|data):/i),_i=$e(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Ur=$e(/^html$/i),xi=$e(/^[a-z][.\w]*(-[.\w]+)+$/i),Fr=Object.freeze({__proto__:null,ARIA_ATTR:vi,ATTR_WHITESPACE:_i,CUSTOM_ELEMENT:xi,DATA_ATTR:wi,DOCTYPE_NAME:Ur,ERB_EXPR:bi,IS_ALLOWED_URI:Hr,IS_SCRIPT_OR_DATA:ki,MUSTACHE_EXPR:mi,TMPLIT_EXPR:yi}),Lt={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,progressingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},$i=function(){return typeof window>"u"?null:window},Si=function(e,t){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let n=null,r="data-tt-policy-suffix";t&&t.hasAttribute(r)&&(n=t.getAttribute(r));let i="dompurify"+(n?"#"+n:"");try{return e.createPolicy(i,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+i+" could not be created."),null}},zr=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function qr(){let s=arguments.length>0&&arguments[0]!==void 0?arguments[0]:$i(),e=P=>qr(P);if(e.version="3.3.1",e.removed=[],!s||!s.document||s.document.nodeType!==Lt.document||!s.Element)return e.isSupported=!1,e;let{document:t}=s,n=t,r=n.currentScript,{DocumentFragment:i,HTMLTemplateElement:o,Node:c,Element:a,NodeFilter:p,NamedNodeMap:f=s.NamedNodeMap||s.MozNamedAttrMap,HTMLFormElement:h,DOMParser:m,trustedTypes:v}=s,_=a.prototype,k=Dt(_,"cloneNode"),x=Dt(_,"remove"),g=Dt(_,"nextSibling"),A=Dt(_,"childNodes"),E=Dt(_,"parentNode");if(typeof o=="function"){let P=t.createElement("template");P.content&&P.content.ownerDocument&&(t=P.content.ownerDocument)}let $,R="",{implementation:w,createNodeIterator:y,createDocumentFragment:b,getElementsByTagName:I}=t,{importNode:D}=n,N=zr();e.isSupported=typeof Br=="function"&&typeof E=="function"&&w&&w.createHTMLDocument!==void 0;let{MUSTACHE_EXPR:U,ERB_EXPR:j,TMPLIT_EXPR:F,DATA_ATTR:q,ARIA_ATTR:V,IS_SCRIPT_OR_DATA:re,ATTR_WHITESPACE:de,CUSTOM_ELEMENT:fe}=Fr,{IS_ALLOWED_URI:ne}=Fr,z=null,ue=W({},[...Mr,...Rs,...Is,...Ds,...Nr]),J=null,He=W({},[...Or,...Ls,...Pr,...Qt]),ee=Object.seal(Ms(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Oe=null,Ue=null,xe=Object.seal(Ms(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),Qe=!0,qe=!0,Je=!1,Se=!0,_e=!1,M=!0,ge=!1,Ae=!1,Te=!1,Ee=!1,Le=!1,Pe=!1,et=!0,l=!1,u="user-content-",L=!0,T=!1,B={},G=null,dt=W({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),le=null,Ht=W({},["audio","video","img","source","image","track"]),vt=null,Ut=W({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),je="http://www.w3.org/1998/Math/MathML",ut="http://www.w3.org/2000/svg",H="http://www.w3.org/1999/xhtml",te=H,We=!1,qt=null,En=W({},[je,ut,H],Es),jt=W({},["mi","mo","mn","ms","mtext"]),Wt=W({},["annotation-xml"]),Cn=W({},["title","style","font","a","script"]),kt=null,Rn=["application/xhtml+xml","text/html"],In="text/html",ae=null,pt=null,Dn=t.createElement("form"),Ys=function(d){return d instanceof RegExp||d instanceof Function},ps=function(){let d=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(pt&&pt===d)){if((!d||typeof d!="object")&&(d={}),d=Ne(d),kt=Rn.indexOf(d.PARSER_MEDIA_TYPE)===-1?In:d.PARSER_MEDIA_TYPE,ae=kt==="application/xhtml+xml"?Es:Jt,z=Re(d,"ALLOWED_TAGS")?W({},d.ALLOWED_TAGS,ae):ue,J=Re(d,"ALLOWED_ATTR")?W({},d.ALLOWED_ATTR,ae):He,qt=Re(d,"ALLOWED_NAMESPACES")?W({},d.ALLOWED_NAMESPACES,Es):En,vt=Re(d,"ADD_URI_SAFE_ATTR")?W(Ne(Ut),d.ADD_URI_SAFE_ATTR,ae):Ut,le=Re(d,"ADD_DATA_URI_TAGS")?W(Ne(Ht),d.ADD_DATA_URI_TAGS,ae):Ht,G=Re(d,"FORBID_CONTENTS")?W({},d.FORBID_CONTENTS,ae):dt,Oe=Re(d,"FORBID_TAGS")?W({},d.FORBID_TAGS,ae):Ne({}),Ue=Re(d,"FORBID_ATTR")?W({},d.FORBID_ATTR,ae):Ne({}),B=Re(d,"USE_PROFILES")?d.USE_PROFILES:!1,Qe=d.ALLOW_ARIA_ATTR!==!1,qe=d.ALLOW_DATA_ATTR!==!1,Je=d.ALLOW_UNKNOWN_PROTOCOLS||!1,Se=d.ALLOW_SELF_CLOSE_IN_ATTR!==!1,_e=d.SAFE_FOR_TEMPLATES||!1,M=d.SAFE_FOR_XML!==!1,ge=d.WHOLE_DOCUMENT||!1,Ee=d.RETURN_DOM||!1,Le=d.RETURN_DOM_FRAGMENT||!1,Pe=d.RETURN_TRUSTED_TYPE||!1,Te=d.FORCE_BODY||!1,et=d.SANITIZE_DOM!==!1,l=d.SANITIZE_NAMED_PROPS||!1,L=d.KEEP_CONTENT!==!1,T=d.IN_PLACE||!1,ne=d.ALLOWED_URI_REGEXP||Hr,te=d.NAMESPACE||H,jt=d.MATHML_TEXT_INTEGRATION_POINTS||jt,Wt=d.HTML_INTEGRATION_POINTS||Wt,ee=d.CUSTOM_ELEMENT_HANDLING||{},d.CUSTOM_ELEMENT_HANDLING&&Ys(d.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(ee.tagNameCheck=d.CUSTOM_ELEMENT_HANDLING.tagNameCheck),d.CUSTOM_ELEMENT_HANDLING&&Ys(d.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(ee.attributeNameCheck=d.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),d.CUSTOM_ELEMENT_HANDLING&&typeof d.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(ee.allowCustomizedBuiltInElements=d.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),_e&&(qe=!1),Le&&(Ee=!0),B&&(z=W({},Nr),J=[],B.html===!0&&(W(z,Mr),W(J,Or)),B.svg===!0&&(W(z,Rs),W(J,Ls),W(J,Qt)),B.svgFilters===!0&&(W(z,Is),W(J,Ls),W(J,Qt)),B.mathMl===!0&&(W(z,Ds),W(J,Pr),W(J,Qt))),d.ADD_TAGS&&(typeof d.ADD_TAGS=="function"?xe.tagCheck=d.ADD_TAGS:(z===ue&&(z=Ne(z)),W(z,d.ADD_TAGS,ae))),d.ADD_ATTR&&(typeof d.ADD_ATTR=="function"?xe.attributeCheck=d.ADD_ATTR:(J===He&&(J=Ne(J)),W(J,d.ADD_ATTR,ae))),d.ADD_URI_SAFE_ATTR&&W(vt,d.ADD_URI_SAFE_ATTR,ae),d.FORBID_CONTENTS&&(G===dt&&(G=Ne(G)),W(G,d.FORBID_CONTENTS,ae)),d.ADD_FORBID_CONTENTS&&(G===dt&&(G=Ne(G)),W(G,d.ADD_FORBID_CONTENTS,ae)),L&&(z["#text"]=!0),ge&&W(z,["html","head","body"]),z.table&&(W(z,["tbody"]),delete Oe.tbody),d.TRUSTED_TYPES_POLICY){if(typeof d.TRUSTED_TYPES_POLICY.createHTML!="function")throw It('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof d.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw It('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');$=d.TRUSTED_TYPES_POLICY,R=$.createHTML("")}else $===void 0&&($=Si(v,r)),$!==null&&typeof R=="string"&&(R=$.createHTML(""));be&&be(d),pt=d}},Xs=W({},[...Rs,...Is,...hi]),Qs=W({},[...Ds,...gi]),Ln=function(d){let C=E(d);(!C||!C.tagName)&&(C={namespaceURI:te,tagName:"template"});let O=Jt(d.tagName),se=Jt(C.tagName);return qt[d.namespaceURI]?d.namespaceURI===ut?C.namespaceURI===H?O==="svg":C.namespaceURI===je?O==="svg"&&(se==="annotation-xml"||jt[se]):!!Xs[O]:d.namespaceURI===je?C.namespaceURI===H?O==="math":C.namespaceURI===ut?O==="math"&&Wt[se]:!!Qs[O]:d.namespaceURI===H?C.namespaceURI===ut&&!Wt[se]||C.namespaceURI===je&&!jt[se]?!1:!Qs[O]&&(Cn[O]||!Xs[O]):!!(kt==="application/xhtml+xml"&&qt[d.namespaceURI]):!1},Me=function(d){Ct(e.removed,{element:d});try{E(d).removeChild(d)}catch{x(d)}},tt=function(d,C){try{Ct(e.removed,{attribute:C.getAttributeNode(d),from:C})}catch{Ct(e.removed,{attribute:null,from:C})}if(C.removeAttribute(d),d==="is")if(Ee||Le)try{Me(C)}catch{}else try{C.setAttribute(d,"")}catch{}},Js=function(d){let C=null,O=null;if(Te)d="<remove></remove>"+d;else{let oe=Cs(d,/^[\r\n\t ]+/);O=oe&&oe[0]}kt==="application/xhtml+xml"&&te===H&&(d='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+d+"</body></html>");let se=$?$.createHTML(d):d;if(te===H)try{C=new m().parseFromString(se,kt)}catch{}if(!C||!C.documentElement){C=w.createDocument(te,"template",null);try{C.documentElement.innerHTML=We?R:se}catch{}}let he=C.body||C.documentElement;return d&&O&&he.insertBefore(t.createTextNode(O),he.childNodes[0]||null),te===H?I.call(C,ge?"html":"body")[0]:ge?C.documentElement:he},er=function(d){return y.call(d.ownerDocument||d,d,p.SHOW_ELEMENT|p.SHOW_COMMENT|p.SHOW_TEXT|p.SHOW_PROCESSING_INSTRUCTION|p.SHOW_CDATA_SECTION,null)},fs=function(d){return d instanceof h&&(typeof d.nodeName!="string"||typeof d.textContent!="string"||typeof d.removeChild!="function"||!(d.attributes instanceof f)||typeof d.removeAttribute!="function"||typeof d.setAttribute!="function"||typeof d.namespaceURI!="string"||typeof d.insertBefore!="function"||typeof d.hasChildNodes!="function")},tr=function(d){return typeof c=="function"&&d instanceof c};function Fe(P,d,C){Xt(P,O=>{O.call(e,d,C,pt)})}let sr=function(d){let C=null;if(Fe(N.beforeSanitizeElements,d,null),fs(d))return Me(d),!0;let O=ae(d.nodeName);if(Fe(N.uponSanitizeElement,d,{tagName:O,allowedTags:z}),M&&d.hasChildNodes()&&!tr(d.firstElementChild)&&me(/<[/\w!]/g,d.innerHTML)&&me(/<[/\w!]/g,d.textContent)||d.nodeType===Lt.progressingInstruction||M&&d.nodeType===Lt.comment&&me(/<[/\w]/g,d.data))return Me(d),!0;if(!(xe.tagCheck instanceof Function&&xe.tagCheck(O))&&(!z[O]||Oe[O])){if(!Oe[O]&&nr(O)&&(ee.tagNameCheck instanceof RegExp&&me(ee.tagNameCheck,O)||ee.tagNameCheck instanceof Function&&ee.tagNameCheck(O)))return!1;if(L&&!G[O]){let se=E(d)||d.parentNode,he=A(d)||d.childNodes;if(he&&se){let oe=he.length;for(let ve=oe-1;ve>=0;--ve){let ze=k(he[ve],!0);ze.__removalCount=(d.__removalCount||0)+1,se.insertBefore(ze,g(d))}}}return Me(d),!0}return d instanceof a&&!Ln(d)||(O==="noscript"||O==="noembed"||O==="noframes")&&me(/<\/no(script|embed|frames)/i,d.innerHTML)?(Me(d),!0):(_e&&d.nodeType===Lt.text&&(C=d.textContent,Xt([U,j,F],se=>{C=Rt(C,se," ")}),d.textContent!==C&&(Ct(e.removed,{element:d.cloneNode()}),d.textContent=C)),Fe(N.afterSanitizeElements,d,null),!1)},rr=function(d,C,O){if(et&&(C==="id"||C==="name")&&(O in t||O in Dn))return!1;if(!(qe&&!Ue[C]&&me(q,C))){if(!(Qe&&me(V,C))){if(!(xe.attributeCheck instanceof Function&&xe.attributeCheck(C,d))){if(!J[C]||Ue[C]){if(!(nr(d)&&(ee.tagNameCheck instanceof RegExp&&me(ee.tagNameCheck,d)||ee.tagNameCheck instanceof Function&&ee.tagNameCheck(d))&&(ee.attributeNameCheck instanceof RegExp&&me(ee.attributeNameCheck,C)||ee.attributeNameCheck instanceof Function&&ee.attributeNameCheck(C,d))||C==="is"&&ee.allowCustomizedBuiltInElements&&(ee.tagNameCheck instanceof RegExp&&me(ee.tagNameCheck,O)||ee.tagNameCheck instanceof Function&&ee.tagNameCheck(O))))return!1}else if(!vt[C]){if(!me(ne,Rt(O,de,""))){if(!((C==="src"||C==="xlink:href"||C==="href")&&d!=="script"&&di(O,"data:")===0&&le[d])){if(!(Je&&!me(re,Rt(O,de,"")))){if(O)return!1}}}}}}}return!0},nr=function(d){return d!=="annotation-xml"&&Cs(d,fe)},ir=function(d){Fe(N.beforeSanitizeAttributes,d,null);let{attributes:C}=d;if(!C||fs(d))return;let O={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:J,forceKeepAttr:void 0},se=C.length;for(;se--;){let he=C[se],{name:oe,namespaceURI:ve,value:ze}=he,ft=ae(oe),hs=ze,pe=oe==="value"?hs:ui(hs);if(O.attrName=ft,O.attrValue=pe,O.keepAttr=!0,O.forceKeepAttr=void 0,Fe(N.uponSanitizeAttribute,d,O),pe=O.attrValue,l&&(ft==="id"||ft==="name")&&(tt(oe,d),pe=u+pe),M&&me(/((--!?|])>)|<\/(style|title|textarea)/i,pe)){tt(oe,d);continue}if(ft==="attributename"&&Cs(pe,"href")){tt(oe,d);continue}if(O.forceKeepAttr)continue;if(!O.keepAttr){tt(oe,d);continue}if(!Se&&me(/\/>/i,pe)){tt(oe,d);continue}_e&&Xt([U,j,F],ar=>{pe=Rt(pe,ar," ")});let or=ae(d.nodeName);if(!rr(or,ft,pe)){tt(oe,d);continue}if($&&typeof v=="object"&&typeof v.getAttributeType=="function"&&!ve)switch(v.getAttributeType(or,ft)){case"TrustedHTML":{pe=$.createHTML(pe);break}case"TrustedScriptURL":{pe=$.createScriptURL(pe);break}}if(pe!==hs)try{ve?d.setAttributeNS(ve,oe,pe):d.setAttribute(oe,pe),fs(d)?Me(d):Lr(e.removed)}catch{tt(oe,d)}}Fe(N.afterSanitizeAttributes,d,null)},Mn=function P(d){let C=null,O=er(d);for(Fe(N.beforeSanitizeShadowDOM,d,null);C=O.nextNode();)Fe(N.uponSanitizeShadowNode,C,null),sr(C),ir(C),C.content instanceof i&&P(C.content);Fe(N.afterSanitizeShadowDOM,d,null)};return e.sanitize=function(P){let d=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},C=null,O=null,se=null,he=null;if(We=!P,We&&(P="<!-->"),typeof P!="string"&&!tr(P))if(typeof P.toString=="function"){if(P=P.toString(),typeof P!="string")throw It("dirty is not a string, aborting")}else throw It("toString is not a function");if(!e.isSupported)return P;if(Ae||ps(d),e.removed=[],typeof P=="string"&&(T=!1),T){if(P.nodeName){let ze=ae(P.nodeName);if(!z[ze]||Oe[ze])throw It("root node is forbidden and cannot be sanitized in-place")}}else if(P instanceof c)C=Js("<!---->"),O=C.ownerDocument.importNode(P,!0),O.nodeType===Lt.element&&O.nodeName==="BODY"||O.nodeName==="HTML"?C=O:C.appendChild(O);else{if(!Ee&&!_e&&!ge&&P.indexOf("<")===-1)return $&&Pe?$.createHTML(P):P;if(C=Js(P),!C)return Ee?null:Pe?R:""}C&&Te&&Me(C.firstChild);let oe=er(T?P:C);for(;se=oe.nextNode();)sr(se),ir(se),se.content instanceof i&&Mn(se.content);if(T)return P;if(Ee){if(Le)for(he=b.call(C.ownerDocument);C.firstChild;)he.appendChild(C.firstChild);else he=C;return(J.shadowroot||J.shadowrootmode)&&(he=D.call(n,he,!0)),he}let ve=ge?C.outerHTML:C.innerHTML;return ge&&z["!doctype"]&&C.ownerDocument&&C.ownerDocument.doctype&&C.ownerDocument.doctype.name&&me(Ur,C.ownerDocument.doctype.name)&&(ve="<!DOCTYPE "+C.ownerDocument.doctype.name+`>
`+ve),_e&&Xt([U,j,F],ze=>{ve=Rt(ve,ze," ")}),$&&Pe?$.createHTML(ve):ve},e.setConfig=function(){let P=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};ps(P),Ae=!0},e.clearConfig=function(){pt=null,Ae=!1},e.isValidAttribute=function(P,d,C){pt||ps({});let O=ae(P),se=ae(d);return rr(O,se,C)},e.addHook=function(P,d){typeof d=="function"&&Ct(N[P],d)},e.removeHook=function(P,d){if(d!==void 0){let C=li(N[P],d);return C===-1?void 0:ci(N[P],C,1)[0]}return Lr(N[P])},e.removeHooks=function(P){N[P]=[]},e.removeAllHooks=function(){N=zr()},e}var jr=qr();var Wr={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},Gr=s=>(...e)=>({_$litDirective$:s,values:e}),es=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var Mt=class extends es{constructor(e){if(super(e),this.it=ie,e.type!==Wr.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===ie||e==null)return this._t=void 0,this.it=e;if(e===it)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;let t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};Mt.directiveName="unsafeHTML",Mt.resultType=1;var Vr=Gr(Mt);function Bs(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ct=Bs();function en(s){ct=s}var Ft={exec:()=>null};function K(s,e=""){let t=typeof s=="string"?s:s.source,n={replace:(r,i)=>{let o=typeof i=="string"?i:i.source;return o=o.replace(we.caret,"$1"),t=t.replace(r,o),n},getRegex:()=>new RegExp(t,e)};return n}var Ai=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),we={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:s=>new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}#`),htmlBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}<(?:[a-z].*>|!--)`,"i")},Ti=/^(?:[ \t]*(?:\n|$))+/,Ei=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Ci=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,zt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Ri=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Hs=/(?:[*+-]|\d{1,9}[.)])/,tn=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,sn=K(tn).replace(/bull/g,Hs).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Ii=K(tn).replace(/bull/g,Hs).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Us=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Di=/^[^\n]+/,qs=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Li=K(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",qs).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Mi=K(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,Hs).getRegex(),os="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",js=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Ni=K("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",js).replace("tag",os).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),rn=K(Us).replace("hr",zt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",os).getRegex(),Oi=K(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",rn).getRegex(),Ws={blockquote:Oi,code:Ei,def:Li,fences:Ci,heading:Ri,hr:zt,html:Ni,lheading:sn,list:Mi,newline:Ti,paragraph:rn,table:Ft,text:Di},Zr=K("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",zt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",os).getRegex(),Pi={...Ws,lheading:Ii,table:Zr,paragraph:K(Us).replace("hr",zt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Zr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",os).getRegex()},Fi={...Ws,html:K(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",js).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Ft,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:K(Us).replace("hr",zt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",sn).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},zi=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Bi=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,nn=/^( {2,}|\\)\n(?!\s*$)/,Hi=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,as=/[\p{P}\p{S}]/u,Gs=/[\s\p{P}\p{S}]/u,on=/[^\s\p{P}\p{S}]/u,Ui=K(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Gs).getRegex(),an=/(?!~)[\p{P}\p{S}]/u,qi=/(?!~)[\s\p{P}\p{S}]/u,ji=/(?:[^\s\p{P}\p{S}]|~)/u,Wi=K(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Ai?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),ln=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Gi=K(ln,"u").replace(/punct/g,as).getRegex(),Vi=K(ln,"u").replace(/punct/g,an).getRegex(),cn="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Zi=K(cn,"gu").replace(/notPunctSpace/g,on).replace(/punctSpace/g,Gs).replace(/punct/g,as).getRegex(),Ki=K(cn,"gu").replace(/notPunctSpace/g,ji).replace(/punctSpace/g,qi).replace(/punct/g,an).getRegex(),Yi=K("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,on).replace(/punctSpace/g,Gs).replace(/punct/g,as).getRegex(),Xi=K(/\\(punct)/,"gu").replace(/punct/g,as).getRegex(),Qi=K(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Ji=K(js).replace("(?:-->|$)","-->").getRegex(),eo=K("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Ji).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),rs=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,to=K(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",rs).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),dn=K(/^!?\[(label)\]\[(ref)\]/).replace("label",rs).replace("ref",qs).getRegex(),un=K(/^!?\[(ref)\](?:\[\])?/).replace("ref",qs).getRegex(),so=K("reflink|nolink(?!\\()","g").replace("reflink",dn).replace("nolink",un).getRegex(),Kr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Vs={_backpedal:Ft,anyPunctuation:Xi,autolink:Qi,blockSkip:Wi,br:nn,code:Bi,del:Ft,emStrongLDelim:Gi,emStrongRDelimAst:Zi,emStrongRDelimUnd:Yi,escape:zi,link:to,nolink:un,punctuation:Ui,reflink:dn,reflinkSearch:so,tag:eo,text:Hi,url:Ft},ro={...Vs,link:K(/^!?\[(label)\]\((.*?)\)/).replace("label",rs).getRegex(),reflink:K(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",rs).getRegex()},Ps={...Vs,emStrongRDelimAst:Ki,emStrongLDelim:Vi,url:K(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Kr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:K(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Kr).getRegex()},no={...Ps,br:K(nn).replace("{2,}","*").getRegex(),text:K(Ps.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},ts={normal:Ws,gfm:Pi,pedantic:Fi},Nt={normal:Vs,gfm:Ps,breaks:no,pedantic:ro},io={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Yr=s=>io[s];function Be(s,e){if(e){if(we.escapeTest.test(s))return s.replace(we.escapeReplace,Yr)}else if(we.escapeTestNoEncode.test(s))return s.replace(we.escapeReplaceNoEncode,Yr);return s}function Xr(s){try{s=encodeURI(s).replace(we.percentDecode,"%")}catch{return null}return s}function Qr(s,e){let t=s.replace(we.findPipe,(i,o,c)=>{let a=!1,p=o;for(;--p>=0&&c[p]==="\\";)a=!a;return a?"|":" |"}),n=t.split(we.splitPipe),r=0;if(n[0].trim()||n.shift(),n.length>0&&!n.at(-1)?.trim()&&n.pop(),e)if(n.length>e)n.splice(e);else for(;n.length<e;)n.push("");for(;r<n.length;r++)n[r]=n[r].trim().replace(we.slashPipe,"|");return n}function Ot(s,e,t){let n=s.length;if(n===0)return"";let r=0;for(;r<n;){let i=s.charAt(n-r-1);if(i===e&&!t)r++;else if(i!==e&&t)r++;else break}return s.slice(0,n-r)}function oo(s,e){if(s.indexOf(e[1])===-1)return-1;let t=0;for(let n=0;n<s.length;n++)if(s[n]==="\\")n++;else if(s[n]===e[0])t++;else if(s[n]===e[1]&&(t--,t<0))return n;return t>0?-2:-1}function Jr(s,e,t,n,r){let i=e.href,o=e.title||null,c=s[1].replace(r.other.outputLinkReplace,"$1");n.state.inLink=!0;let a={type:s[0].charAt(0)==="!"?"image":"link",raw:t,href:i,title:o,text:c,tokens:n.inlineTokens(c)};return n.state.inLink=!1,a}function ao(s,e,t){let n=s.match(t.other.indentCodeCompensation);if(n===null)return e;let r=n[1];return e.split(`
`).map(i=>{let o=i.match(t.other.beginningSpace);if(o===null)return i;let[c]=o;return c.length>=r.length?i.slice(r.length):i}).join(`
`)}var ns=class{constructor(s){Q(this,"options");Q(this,"rules");Q(this,"lexer");this.options=s||ct}space(s){let e=this.rules.block.newline.exec(s);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(s){let e=this.rules.block.code.exec(s);if(e){let t=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?t:Ot(t,`
`)}}}fences(s){let e=this.rules.block.fences.exec(s);if(e){let t=e[0],n=ao(t,e[3]||"",this.rules);return{type:"code",raw:t,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:n}}}heading(s){let e=this.rules.block.heading.exec(s);if(e){let t=e[2].trim();if(this.rules.other.endingHash.test(t)){let n=Ot(t,"#");(this.options.pedantic||!n||this.rules.other.endingSpaceChar.test(n))&&(t=n.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:t,tokens:this.lexer.inline(t)}}}hr(s){let e=this.rules.block.hr.exec(s);if(e)return{type:"hr",raw:Ot(e[0],`
`)}}blockquote(s){let e=this.rules.block.blockquote.exec(s);if(e){let t=Ot(e[0],`
`).split(`
`),n="",r="",i=[];for(;t.length>0;){let o=!1,c=[],a;for(a=0;a<t.length;a++)if(this.rules.other.blockquoteStart.test(t[a]))c.push(t[a]),o=!0;else if(!o)c.push(t[a]);else break;t=t.slice(a);let p=c.join(`
`),f=p.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");n=n?`${n}
${p}`:p,r=r?`${r}
${f}`:f;let h=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(f,i,!0),this.lexer.state.top=h,t.length===0)break;let m=i.at(-1);if(m?.type==="code")break;if(m?.type==="blockquote"){let v=m,_=v.raw+`
`+t.join(`
`),k=this.blockquote(_);i[i.length-1]=k,n=n.substring(0,n.length-v.raw.length)+k.raw,r=r.substring(0,r.length-v.text.length)+k.text;break}else if(m?.type==="list"){let v=m,_=v.raw+`
`+t.join(`
`),k=this.list(_);i[i.length-1]=k,n=n.substring(0,n.length-m.raw.length)+k.raw,r=r.substring(0,r.length-v.raw.length)+k.raw,t=_.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:n,tokens:i,text:r}}}list(s){let e=this.rules.block.list.exec(s);if(e){let t=e[1].trim(),n=t.length>1,r={type:"list",raw:"",ordered:n,start:n?+t.slice(0,-1):"",loose:!1,items:[]};t=n?`\\d{1,9}\\${t.slice(-1)}`:`\\${t}`,this.options.pedantic&&(t=n?t:"[*+-]");let i=this.rules.other.listItemRegex(t),o=!1;for(;s;){let a=!1,p="",f="";if(!(e=i.exec(s))||this.rules.block.hr.test(s))break;p=e[0],s=s.substring(p.length);let h=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,k=>" ".repeat(3*k.length)),m=s.split(`
`,1)[0],v=!h.trim(),_=0;if(this.options.pedantic?(_=2,f=h.trimStart()):v?_=e[1].length+1:(_=e[2].search(this.rules.other.nonSpaceChar),_=_>4?1:_,f=h.slice(_),_+=e[1].length),v&&this.rules.other.blankLine.test(m)&&(p+=m+`
`,s=s.substring(m.length+1),a=!0),!a){let k=this.rules.other.nextBulletRegex(_),x=this.rules.other.hrRegex(_),g=this.rules.other.fencesBeginRegex(_),A=this.rules.other.headingBeginRegex(_),E=this.rules.other.htmlBeginRegex(_);for(;s;){let $=s.split(`
`,1)[0],R;if(m=$,this.options.pedantic?(m=m.replace(this.rules.other.listReplaceNesting,"  "),R=m):R=m.replace(this.rules.other.tabCharGlobal,"    "),g.test(m)||A.test(m)||E.test(m)||k.test(m)||x.test(m))break;if(R.search(this.rules.other.nonSpaceChar)>=_||!m.trim())f+=`
`+R.slice(_);else{if(v||h.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||g.test(h)||A.test(h)||x.test(h))break;f+=`
`+m}!v&&!m.trim()&&(v=!0),p+=$+`
`,s=s.substring($.length+1),h=R.slice(_)}}r.loose||(o?r.loose=!0:this.rules.other.doubleBlankLine.test(p)&&(o=!0)),r.items.push({type:"list_item",raw:p,task:!!this.options.gfm&&this.rules.other.listIsTask.test(f),loose:!1,text:f,tokens:[]}),r.raw+=p}let c=r.items.at(-1);if(c)c.raw=c.raw.trimEnd(),c.text=c.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let a of r.items){if(this.lexer.state.top=!1,a.tokens=this.lexer.blockTokens(a.text,[]),a.task){if(a.text=a.text.replace(this.rules.other.listReplaceTask,""),a.tokens[0]?.type==="text"||a.tokens[0]?.type==="paragraph"){a.tokens[0].raw=a.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),a.tokens[0].text=a.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let f=this.lexer.inlineQueue.length-1;f>=0;f--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[f].src)){this.lexer.inlineQueue[f].src=this.lexer.inlineQueue[f].src.replace(this.rules.other.listReplaceTask,"");break}}let p=this.rules.other.listTaskCheckbox.exec(a.raw);if(p){let f={type:"checkbox",raw:p[0]+" ",checked:p[0]!=="[ ]"};a.checked=f.checked,r.loose?a.tokens[0]&&["paragraph","text"].includes(a.tokens[0].type)&&"tokens"in a.tokens[0]&&a.tokens[0].tokens?(a.tokens[0].raw=f.raw+a.tokens[0].raw,a.tokens[0].text=f.raw+a.tokens[0].text,a.tokens[0].tokens.unshift(f)):a.tokens.unshift({type:"paragraph",raw:f.raw,text:f.raw,tokens:[f]}):a.tokens.unshift(f)}}if(!r.loose){let p=a.tokens.filter(h=>h.type==="space"),f=p.length>0&&p.some(h=>this.rules.other.anyLine.test(h.raw));r.loose=f}}if(r.loose)for(let a of r.items){a.loose=!0;for(let p of a.tokens)p.type==="text"&&(p.type="paragraph")}return r}}html(s){let e=this.rules.block.html.exec(s);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(s){let e=this.rules.block.def.exec(s);if(e){let t=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),n=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:t,raw:e[0],href:n,title:r}}}table(s){let e=this.rules.block.table.exec(s);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let t=Qr(e[1]),n=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(t.length===n.length){for(let o of n)this.rules.other.tableAlignRight.test(o)?i.align.push("right"):this.rules.other.tableAlignCenter.test(o)?i.align.push("center"):this.rules.other.tableAlignLeft.test(o)?i.align.push("left"):i.align.push(null);for(let o=0;o<t.length;o++)i.header.push({text:t[o],tokens:this.lexer.inline(t[o]),header:!0,align:i.align[o]});for(let o of r)i.rows.push(Qr(o,i.header.length).map((c,a)=>({text:c,tokens:this.lexer.inline(c),header:!1,align:i.align[a]})));return i}}lheading(s){let e=this.rules.block.lheading.exec(s);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(s){let e=this.rules.block.paragraph.exec(s);if(e){let t=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:t,tokens:this.lexer.inline(t)}}}text(s){let e=this.rules.block.text.exec(s);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(s){let e=this.rules.inline.escape.exec(s);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(s){let e=this.rules.inline.tag.exec(s);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(s){let e=this.rules.inline.link.exec(s);if(e){let t=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(t)){if(!this.rules.other.endAngleBracket.test(t))return;let i=Ot(t.slice(0,-1),"\\");if((t.length-i.length)%2===0)return}else{let i=oo(e[2],"()");if(i===-2)return;if(i>-1){let o=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,o).trim(),e[3]=""}}let n=e[2],r="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(n);i&&(n=i[1],r=i[3])}else r=e[3]?e[3].slice(1,-1):"";return n=n.trim(),this.rules.other.startAngleBracket.test(n)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(t)?n=n.slice(1):n=n.slice(1,-1)),Jr(e,{href:n&&n.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(s,e){let t;if((t=this.rules.inline.reflink.exec(s))||(t=this.rules.inline.nolink.exec(s))){let n=(t[2]||t[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=e[n.toLowerCase()];if(!r){let i=t[0].charAt(0);return{type:"text",raw:i,text:i}}return Jr(t,r,t[0],this.lexer,this.rules)}}emStrong(s,e,t=""){let n=this.rules.inline.emStrongLDelim.exec(s);if(!(!n||n[3]&&t.match(this.rules.other.unicodeAlphaNumeric))&&(!(n[1]||n[2])||!t||this.rules.inline.punctuation.exec(t))){let r=[...n[0]].length-1,i,o,c=r,a=0,p=n[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(p.lastIndex=0,e=e.slice(-1*s.length+r);(n=p.exec(e))!=null;){if(i=n[1]||n[2]||n[3]||n[4]||n[5]||n[6],!i)continue;if(o=[...i].length,n[3]||n[4]){c+=o;continue}else if((n[5]||n[6])&&r%3&&!((r+o)%3)){a+=o;continue}if(c-=o,c>0)continue;o=Math.min(o,o+c+a);let f=[...n[0]][0].length,h=s.slice(0,r+n.index+f+o);if(Math.min(r,o)%2){let v=h.slice(1,-1);return{type:"em",raw:h,text:v,tokens:this.lexer.inlineTokens(v)}}let m=h.slice(2,-2);return{type:"strong",raw:h,text:m,tokens:this.lexer.inlineTokens(m)}}}}codespan(s){let e=this.rules.inline.code.exec(s);if(e){let t=e[2].replace(this.rules.other.newLineCharGlobal," "),n=this.rules.other.nonSpaceChar.test(t),r=this.rules.other.startingSpaceChar.test(t)&&this.rules.other.endingSpaceChar.test(t);return n&&r&&(t=t.substring(1,t.length-1)),{type:"codespan",raw:e[0],text:t}}}br(s){let e=this.rules.inline.br.exec(s);if(e)return{type:"br",raw:e[0]}}del(s){let e=this.rules.inline.del.exec(s);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(s){let e=this.rules.inline.autolink.exec(s);if(e){let t,n;return e[2]==="@"?(t=e[1],n="mailto:"+t):(t=e[1],n=t),{type:"link",raw:e[0],text:t,href:n,tokens:[{type:"text",raw:t,text:t}]}}}url(s){let e;if(e=this.rules.inline.url.exec(s)){let t,n;if(e[2]==="@")t=e[0],n="mailto:"+t;else{let r;do r=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(r!==e[0]);t=e[0],e[1]==="www."?n="http://"+e[0]:n=e[0]}return{type:"link",raw:e[0],text:t,href:n,tokens:[{type:"text",raw:t,text:t}]}}}inlineText(s){let e=this.rules.inline.text.exec(s);if(e){let t=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:t}}}},Ie=class Fs{constructor(e){Q(this,"tokens");Q(this,"options");Q(this,"state");Q(this,"inlineQueue");Q(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ct,this.options.tokenizer=this.options.tokenizer||new ns,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={other:we,block:ts.normal,inline:Nt.normal};this.options.pedantic?(t.block=ts.pedantic,t.inline=Nt.pedantic):this.options.gfm&&(t.block=ts.gfm,this.options.breaks?t.inline=Nt.breaks:t.inline=Nt.gfm),this.tokenizer.rules=t}static get rules(){return{block:ts,inline:Nt}}static lex(e,t){return new Fs(t).lex(e)}static lexInline(e,t){return new Fs(t).inlineTokens(e)}lex(e){e=e.replace(we.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){let n=this.inlineQueue[t];this.inlineTokens(n.src,n.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],n=!1){for(this.options.pedantic&&(e=e.replace(we.tabCharGlobal,"    ").replace(we.spaceLine,""));e;){let r;if(this.options.extensions?.block?.some(o=>(r=o.call({lexer:this},e,t))?(e=e.substring(r.raw.length),t.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let o=t.at(-1);r.raw.length===1&&o!==void 0?o.raw+=`
`:t.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);let o=t.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.text,this.inlineQueue.at(-1).src=o.text):t.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);let o=t.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},t.push(r));continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),t.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let o=1/0,c=e.slice(1),a;this.options.extensions.startBlock.forEach(p=>{a=p.call({lexer:this},c),typeof a=="number"&&a>=0&&(o=Math.min(o,a))}),o<1/0&&o>=0&&(i=e.substring(0,o+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let o=t.at(-1);n&&o?.type==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):t.push(r),n=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);let o=t.at(-1);o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):t.push(r);continue}if(e){let o="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(o);break}else throw new Error(o)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let n=e,r=null;if(this.tokens.links){let a=Object.keys(this.tokens.links);if(a.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(n))!=null;)a.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(n=n.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(n))!=null;)n=n.slice(0,r.index)+"++"+n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(n))!=null;)i=r[2]?r[2].length:0,n=n.slice(0,r.index+i)+"["+"a".repeat(r[0].length-i-2)+"]"+n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);n=this.options.hooks?.emStrongMask?.call({lexer:this},n)??n;let o=!1,c="";for(;e;){o||(c=""),o=!1;let a;if(this.options.extensions?.inline?.some(f=>(a=f.call({lexer:this},e,t))?(e=e.substring(a.raw.length),t.push(a),!0):!1))continue;if(a=this.tokenizer.escape(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.tag(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.link(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(a.raw.length);let f=t.at(-1);a.type==="text"&&f?.type==="text"?(f.raw+=a.raw,f.text+=a.text):t.push(a);continue}if(a=this.tokenizer.emStrong(e,n,c)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.codespan(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.br(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.del(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.autolink(e)){e=e.substring(a.raw.length),t.push(a);continue}if(!this.state.inLink&&(a=this.tokenizer.url(e))){e=e.substring(a.raw.length),t.push(a);continue}let p=e;if(this.options.extensions?.startInline){let f=1/0,h=e.slice(1),m;this.options.extensions.startInline.forEach(v=>{m=v.call({lexer:this},h),typeof m=="number"&&m>=0&&(f=Math.min(f,m))}),f<1/0&&f>=0&&(p=e.substring(0,f+1))}if(a=this.tokenizer.inlineText(p)){e=e.substring(a.raw.length),a.raw.slice(-1)!=="_"&&(c=a.raw.slice(-1)),o=!0;let f=t.at(-1);f?.type==="text"?(f.raw+=a.raw,f.text+=a.text):t.push(a);continue}if(e){let f="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(f);break}else throw new Error(f)}}return t}},is=class{constructor(s){Q(this,"options");Q(this,"parser");this.options=s||ct}space(s){return""}code({text:s,lang:e,escaped:t}){let n=(e||"").match(we.notSpaceStart)?.[0],r=s.replace(we.endingNewline,"")+`
`;return n?'<pre><code class="language-'+Be(n)+'">'+(t?r:Be(r,!0))+`</code></pre>
`:"<pre><code>"+(t?r:Be(r,!0))+`</code></pre>
`}blockquote({tokens:s}){return`<blockquote>
${this.parser.parse(s)}</blockquote>
`}html({text:s}){return s}def(s){return""}heading({tokens:s,depth:e}){return`<h${e}>${this.parser.parseInline(s)}</h${e}>
`}hr(s){return`<hr>
`}list(s){let e=s.ordered,t=s.start,n="";for(let o=0;o<s.items.length;o++){let c=s.items[o];n+=this.listitem(c)}let r=e?"ol":"ul",i=e&&t!==1?' start="'+t+'"':"";return"<"+r+i+`>
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
`}strong({tokens:s}){return`<strong>${this.parser.parseInline(s)}</strong>`}em({tokens:s}){return`<em>${this.parser.parseInline(s)}</em>`}codespan({text:s}){return`<code>${Be(s,!0)}</code>`}br(s){return"<br>"}del({tokens:s}){return`<del>${this.parser.parseInline(s)}</del>`}link({href:s,title:e,tokens:t}){let n=this.parser.parseInline(t),r=Xr(s);if(r===null)return n;s=r;let i='<a href="'+s+'"';return e&&(i+=' title="'+Be(e)+'"'),i+=">"+n+"</a>",i}image({href:s,title:e,text:t,tokens:n}){n&&(t=this.parser.parseInline(n,this.parser.textRenderer));let r=Xr(s);if(r===null)return Be(t);s=r;let i=`<img src="${s}" alt="${t}"`;return e&&(i+=` title="${Be(e)}"`),i+=">",i}text(s){return"tokens"in s&&s.tokens?this.parser.parseInline(s.tokens):"escaped"in s&&s.escaped?s.text:Be(s.text)}},Zs=class{strong({text:s}){return s}em({text:s}){return s}codespan({text:s}){return s}del({text:s}){return s}html({text:s}){return s}text({text:s}){return s}link({text:s}){return""+s}image({text:s}){return""+s}br(){return""}checkbox({raw:s}){return s}},De=class zs{constructor(e){Q(this,"options");Q(this,"renderer");Q(this,"textRenderer");this.options=e||ct,this.options.renderer=this.options.renderer||new is,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Zs}static parse(e,t){return new zs(t).parse(e)}static parseInline(e,t){return new zs(t).parseInline(e)}parse(e){let t="";for(let n=0;n<e.length;n++){let r=e[n];if(this.options.extensions?.renderers?.[r.type]){let o=r,c=this.options.extensions.renderers[o.type].call({parser:this},o);if(c!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(o.type)){t+=c||"";continue}}let i=r;switch(i.type){case"space":{t+=this.renderer.space(i);break}case"hr":{t+=this.renderer.hr(i);break}case"heading":{t+=this.renderer.heading(i);break}case"code":{t+=this.renderer.code(i);break}case"table":{t+=this.renderer.table(i);break}case"blockquote":{t+=this.renderer.blockquote(i);break}case"list":{t+=this.renderer.list(i);break}case"checkbox":{t+=this.renderer.checkbox(i);break}case"html":{t+=this.renderer.html(i);break}case"def":{t+=this.renderer.def(i);break}case"paragraph":{t+=this.renderer.paragraph(i);break}case"text":{t+=this.renderer.text(i);break}default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return t}parseInline(e,t=this.renderer){let n="";for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let c=this.options.extensions.renderers[i.type].call({parser:this},i);if(c!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){n+=c||"";continue}}let o=i;switch(o.type){case"escape":{n+=t.text(o);break}case"html":{n+=t.html(o);break}case"link":{n+=t.link(o);break}case"image":{n+=t.image(o);break}case"checkbox":{n+=t.checkbox(o);break}case"strong":{n+=t.strong(o);break}case"em":{n+=t.em(o);break}case"codespan":{n+=t.codespan(o);break}case"br":{n+=t.br(o);break}case"del":{n+=t.del(o);break}case"text":{n+=t.text(o);break}default:{let c='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(c),"";throw new Error(c)}}}return n}},ss,Pt=(ss=class{constructor(s){Q(this,"options");Q(this,"block");this.options=s||ct}preprocess(s){return s}postprocess(s){return s}processAllTokens(s){return s}emStrongMask(s){return s}provideLexer(){return this.block?Ie.lex:Ie.lexInline}provideParser(){return this.block?De.parse:De.parseInline}},Q(ss,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),Q(ss,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),ss),lo=class{constructor(...s){Q(this,"defaults",Bs());Q(this,"options",this.setOptions);Q(this,"parse",this.parseMarkdown(!0));Q(this,"parseInline",this.parseMarkdown(!1));Q(this,"Parser",De);Q(this,"Renderer",is);Q(this,"TextRenderer",Zs);Q(this,"Lexer",Ie);Q(this,"Tokenizer",ns);Q(this,"Hooks",Pt);this.use(...s)}walkTokens(s,e){let t=[];for(let n of s)switch(t=t.concat(e.call(this,n)),n.type){case"table":{let r=n;for(let i of r.header)t=t.concat(this.walkTokens(i.tokens,e));for(let i of r.rows)for(let o of i)t=t.concat(this.walkTokens(o.tokens,e));break}case"list":{let r=n;t=t.concat(this.walkTokens(r.items,e));break}default:{let r=n;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{let o=r[i].flat(1/0);t=t.concat(this.walkTokens(o,e))}):r.tokens&&(t=t.concat(this.walkTokens(r.tokens,e)))}}return t}use(...s){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return s.forEach(t=>{let n={...t};if(n.async=this.defaults.async||n.async||!1,t.extensions&&(t.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let i=e.renderers[r.name];i?e.renderers[r.name]=function(...o){let c=r.renderer.apply(this,o);return c===!1&&(c=i.apply(this,o)),c}:e.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[r.level];i?i.unshift(r.tokenizer):e[r.level]=[r.tokenizer],r.start&&(r.level==="block"?e.startBlock?e.startBlock.push(r.start):e.startBlock=[r.start]:r.level==="inline"&&(e.startInline?e.startInline.push(r.start):e.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(e.childTokens[r.name]=r.childTokens)}),n.extensions=e),t.renderer){let r=this.defaults.renderer||new is(this.defaults);for(let i in t.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let o=i,c=t.renderer[o],a=r[o];r[o]=(...p)=>{let f=c.apply(r,p);return f===!1&&(f=a.apply(r,p)),f||""}}n.renderer=r}if(t.tokenizer){let r=this.defaults.tokenizer||new ns(this.defaults);for(let i in t.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let o=i,c=t.tokenizer[o],a=r[o];r[o]=(...p)=>{let f=c.apply(r,p);return f===!1&&(f=a.apply(r,p)),f}}n.tokenizer=r}if(t.hooks){let r=this.defaults.hooks||new Pt;for(let i in t.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let o=i,c=t.hooks[o],a=r[o];Pt.passThroughHooks.has(i)?r[o]=p=>{if(this.defaults.async&&Pt.passThroughHooksRespectAsync.has(i))return(async()=>{let h=await c.call(r,p);return a.call(r,h)})();let f=c.call(r,p);return a.call(r,f)}:r[o]=(...p)=>{if(this.defaults.async)return(async()=>{let h=await c.apply(r,p);return h===!1&&(h=await a.apply(r,p)),h})();let f=c.apply(r,p);return f===!1&&(f=a.apply(r,p)),f}}n.hooks=r}if(t.walkTokens){let r=this.defaults.walkTokens,i=t.walkTokens;n.walkTokens=function(o){let c=[];return c.push(i.call(this,o)),r&&(c=c.concat(r.call(this,o))),c}}this.defaults={...this.defaults,...n}}),this}setOptions(s){return this.defaults={...this.defaults,...s},this}lexer(s,e){return Ie.lex(s,e??this.defaults)}parser(s,e){return De.parse(s,e??this.defaults)}parseMarkdown(s){return(e,t)=>{let n={...t},r={...this.defaults,...n},i=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&n.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=s),r.async)return(async()=>{let o=r.hooks?await r.hooks.preprocess(e):e,c=await(r.hooks?await r.hooks.provideLexer():s?Ie.lex:Ie.lexInline)(o,r),a=r.hooks?await r.hooks.processAllTokens(c):c;r.walkTokens&&await Promise.all(this.walkTokens(a,r.walkTokens));let p=await(r.hooks?await r.hooks.provideParser():s?De.parse:De.parseInline)(a,r);return r.hooks?await r.hooks.postprocess(p):p})().catch(i);try{r.hooks&&(e=r.hooks.preprocess(e));let o=(r.hooks?r.hooks.provideLexer():s?Ie.lex:Ie.lexInline)(e,r);r.hooks&&(o=r.hooks.processAllTokens(o)),r.walkTokens&&this.walkTokens(o,r.walkTokens);let c=(r.hooks?r.hooks.provideParser():s?De.parse:De.parseInline)(o,r);return r.hooks&&(c=r.hooks.postprocess(c)),c}catch(o){return i(o)}}}onError(s,e){return t=>{if(t.message+=`
Please report this to https://github.com/markedjs/marked.`,s){let n="<p>An error occurred:</p><pre>"+Be(t.message+"",!0)+"</pre>";return e?Promise.resolve(n):n}if(e)return Promise.reject(t);throw t}}},lt=new lo;function Y(s,e){return lt.parse(s,e)}Y.options=Y.setOptions=function(s){return lt.setOptions(s),Y.defaults=lt.defaults,en(Y.defaults),Y};Y.getDefaults=Bs;Y.defaults=ct;Y.use=function(...s){return lt.use(...s),Y.defaults=lt.defaults,en(Y.defaults),Y};Y.walkTokens=function(s,e){return lt.walkTokens(s,e)};Y.parseInline=lt.parseInline;Y.Parser=De;Y.parser=De.parse;Y.Renderer=is;Y.TextRenderer=Zs;Y.Lexer=Ie;Y.lexer=Ie.lex;Y.Tokenizer=ns;Y.Hooks=Pt;Y.parse=Y;var ia=Y.options,oa=Y.setOptions,aa=Y.use,la=Y.walkTokens,ca=Y.parseInline;var da=De.parse,ua=Ie.lex;function Bt(s){let e=Y.parse(s),t=jr.sanitize(e);return Vr(t)}function Xe(s){switch((s||"").toString()){case"open":return"Open";case"in_progress":return"In progress";case"closed":return"Closed";default:return(s||"").toString()||"Open"}}function co(s){window.location.hash=s}function pn(s,e,t=co,n=void 0){let r=Z("views:detail"),i=null,o=null,c=!1,a=!1,p=!1,f=!1,h=!1,m=!1,v=!1,_="";function k(l){let u=Ts(window.location.hash||"");return Ze(u,l)}function x(l){X(S`
        <div class="panel__body" id="detail-root">
          <p class="muted">${l}</p>
        </div>
      `,s)}function g(){if(!o||!n||typeof n.snapshotFor!="function")return;let l=n.snapshotFor(`detail:${o}`);Array.isArray(l)&&l.length>0&&(i=l.find(L=>String(L.id)===String(o))||l[0])}n&&typeof n.subscribe=="function"&&n.subscribe(()=>{try{g(),M()}catch(l){r("issue stores listener error %o",l)}});let A=()=>{a=!0,M()},E=l=>{l.key==="Enter"?(a=!0,M()):l.key==="Escape"&&(a=!1,M())},$=async()=>{if(!i||c)return;let l=s.querySelector("h2 input"),u=i.title||"",L=l?l.value:"";if(L===u){a=!1,M();return}c=!0,l&&(l.disabled=!0);try{r("save title %s \u2192 %s",String(i.id),L);let T=await e("edit-text",{id:i.id,field:"title",value:L});T&&typeof T=="object"&&(i=T,a=!1,M())}catch(T){r("save title failed %s %o",String(i.id),T),i.title=u,a=!1,M(),ce("Failed to save title","error")}finally{c=!1}},R=()=>{a=!1,M()},w=()=>{v=!0,M()},y=l=>{l.key==="Enter"?(l.preventDefault(),v=!0,M()):l.key==="Escape"&&(l.preventDefault(),v=!1,M())},b=async()=>{if(!i||c)return;let l=s.querySelector("#detail-root .prop.assignee input"),u=i?.assignee??"",L=l?.value??"";if(L===u){v=!1,M();return}c=!0,l&&(l.disabled=!0);try{r("save assignee %s \u2192 %s",String(i.id),L);let T=await e("update-assignee",{id:i.id,assignee:L});T&&typeof T=="object"&&(i=T,v=!1,M())}catch(T){r("save assignee failed %s %o",String(i.id),T),i.assignee=u,v=!1,M(),ce("Failed to update assignee","error")}finally{c=!1}},I=()=>{v=!1,M()},D=l=>{_=l.currentTarget.value||""};function N(l){l.key==="Enter"&&(l.preventDefault(),U())}async function U(){if(!i||c)return;let l=_.trim();if(l){c=!0;try{r("add label %s \u2192 %s",String(i.id),l);let u=await e("label-add",{id:i.id,label:l});u&&typeof u=="object"&&(i=u,_="",M())}catch(u){r("add label failed %s %o",String(i.id),u),ce("Failed to add label","error")}finally{c=!1}}}async function j(l){if(!(!i||c)){c=!0;try{r("remove label %s \u2192 %s",String(i?.id||""),l);let u=await e("label-remove",{id:i.id,label:l});u&&typeof u=="object"&&(i=u,M())}catch(u){r("remove label failed %s %o",String(i?.id||""),u),ce("Failed to remove label","error")}finally{c=!1}}}let F=async l=>{if(!i||c){M();return}let u=l.currentTarget,L=i.status||"open",T=u.value;if(T!==L){c=!0,i.status=T,M();try{r("update status %s \u2192 %s",String(i.id),T);let B=await e("update-status",{id:i.id,status:T});B&&typeof B=="object"&&(i=B,M())}catch(B){r("update status failed %s %o",String(i.id),B),i.status=L,M(),ce("Failed to update status","error")}finally{c=!1}}},q=async l=>{if(!i||c){M();return}let u=l.currentTarget,L=typeof i.priority=="number"?i.priority:2,T=Number(u.value);if(T!==L){c=!0,i.priority=T,M();try{r("update priority %s \u2192 %d",String(i.id),T);let B=await e("update-priority",{id:i.id,priority:T});B&&typeof B=="object"&&(i=B,M())}catch(B){r("update priority failed %s %o",String(i.id),B),i.priority=L,M(),ce("Failed to update priority","error")}finally{c=!1}}},V=()=>{p=!0,M()},re=l=>{if(l.key==="Escape")p=!1,M();else if(l.key==="Enter"&&l.ctrlKey){let u=s.querySelector("#detail-root .editable-actions button");u&&u.click()}},de=async()=>{if(!i||c)return;let l=s.querySelector("#detail-root textarea"),u=i.description||"",L=l?l.value:"";if(L===u){p=!1,M();return}c=!0,l&&(l.disabled=!0);try{r("save description %s",String(i?.id||""));let T=await e("edit-text",{id:i.id,field:"description",value:L});T&&typeof T=="object"&&(i=T,p=!1,M())}catch(T){r("save description failed %s %o",String(i?.id||""),T),i.description=u,p=!1,M(),ce("Failed to save description","error")}finally{c=!1}},fe=()=>{p=!1,M()},ne=()=>{f=!0,M();try{let l=s.querySelector("#detail-root .design textarea");l&&l.focus()}catch(l){r("focus design textarea failed %o",l)}},z=l=>{if(l.key==="Escape")f=!1,M();else if(l.key==="Enter"&&(l.ctrlKey||l.metaKey)){let u=s.querySelector("#detail-root .design .editable-actions button");u&&u.click()}},ue=async()=>{if(!i||c)return;let l=s.querySelector("#detail-root .design textarea"),u=i.design||"",L=l?l.value:"";if(L===u){f=!1,M();return}c=!0,l&&(l.disabled=!0);try{r("save design %s",String(i?.id||""));let T=await e("edit-text",{id:i.id,field:"design",value:L});T&&typeof T=="object"&&(i=T,f=!1,M())}catch(T){r("save design failed %s %o",String(i?.id||""),T),i.design=u,f=!1,M(),ce("Failed to save design","error")}finally{c=!1}},J=()=>{f=!1,M()},He=()=>{h=!0,M()},ee=l=>{if(l.key==="Escape")h=!1,M();else if(l.key==="Enter"&&(l.ctrlKey||l.metaKey)){let u=s.querySelector("#detail-root .notes .editable-actions button");u&&u.click()}},Oe=async()=>{if(!i||c)return;let l=s.querySelector("#detail-root .notes textarea"),u=i.notes||"",L=l?l.value:"";if(L===u){h=!1,M();return}c=!0,l&&(l.disabled=!0);try{r("save notes %s",String(i?.id||""));let T=await e("edit-text",{id:i.id,field:"notes",value:L});T&&typeof T=="object"&&(i=T,h=!1,M())}catch(T){r("save notes failed %s %o",String(i?.id||""),T),i.notes=u,h=!1,M(),ce("Failed to save notes","error")}finally{c=!1}},Ue=()=>{h=!1,M()},xe=()=>{m=!0,M()},Qe=l=>{if(l.key==="Escape")m=!1,M();else if(l.key==="Enter"&&(l.ctrlKey||l.metaKey)){let u=s.querySelector("#detail-root .acceptance .editable-actions button");u&&u.click()}},qe=async()=>{if(!i||c)return;let l=s.querySelector("#detail-root .acceptance textarea"),u=i.acceptance||"",L=l?l.value:"";if(L===u){m=!1,M();return}c=!0,l&&(l.disabled=!0);try{r("save acceptance %s",String(i?.id||""));let T=await e("edit-text",{id:i.id,field:"acceptance",value:L});T&&typeof T=="object"&&(i=T,m=!1,M())}catch(T){r("save acceptance failed %s %o",String(i?.id||""),T),i.acceptance=u,m=!1,M(),ce("Failed to save acceptance","error")}finally{c=!1}},Je=()=>{m=!1,M()};function Se(l,u){let L=l==="Dependencies"?"add-dependency":"add-dependent";return S`
      <div class="props-card">
        <div>
          <div class="props-card__title">${l}</div>
        </div>
        <ul>
          ${!u||u.length===0?null:u.map(T=>{let B=T.id,G=k(B);return S`<li
                  data-href=${G}
                  @click=${()=>t(G)}
                >
                  ${at(T.issue_type||"")}
                  <span class="text-truncate">${T.title||""}</span>
                  <button
                    aria-label=${`Remove dependency ${B}`}
                    @click=${ge(B,l)}
                  >
                    ×
                  </button>
                </li>`})}
        </ul>
        <div class="props-card__footer">
          <input type="text" placeholder="Issue ID" data-testid=${L} />
          <button @click=${Ae(u,l)}>Add</button>
        </div>
      </div>
    `}function _e(l){let u=a?S`<div class="detail-title">
          <h2>
            <input
              type="text"
              aria-label="Edit title"
              .value=${l.title||""}
              @keydown=${Te}
            />
            <button @click=${$}>Save</button>
            <button @click=${R}>Cancel</button>
          </h2>
        </div>`:S`<div class="detail-title">
          <h2>
            <span
              class="editable"
              tabindex="0"
              role="button"
              aria-label="Edit title"
              @click=${A}
              @keydown=${E}
              >${l.title||""}</span
            >
          </h2>
        </div>`,L=S`<select
      class=${`badge-select badge--status is-${l.status||"open"}`}
      @change=${F}
      .value=${l.status||"open"}
      ?disabled=${c}
    >
      ${(()=>{let H=String(l.status||"open");return["open","in_progress","closed"].map(te=>S`<option value=${te} ?selected=${H===te}>
              ${Xe(te)}
            </option>`)})()}
    </select>`,T=S`<select
      class=${`badge-select badge--priority is-p${String(typeof l.priority=="number"?l.priority:2)}`}
      @change=${q}
      .value=${String(typeof l.priority=="number"?l.priority:2)}
      ?disabled=${c}
    >
      ${(()=>{let H=String(typeof l.priority=="number"?l.priority:2);return Ye.map((te,We)=>S`<option value=${String(We)} ?selected=${H===String(We)}>
              ${Et(We)} ${te}
            </option>`)})()}
    </select>`,B=p?S`<div class="description">
          <textarea
            @keydown=${re}
            .value=${l.description||""}
            rows="8"
            style="width:100%"
          ></textarea>
          <div class="editable-actions">
            <button @click=${de}>Save</button>
            <button @click=${fe}>Cancel</button>
          </div>
        </div>`:S`<div
          class="md editable"
          tabindex="0"
          role="button"
          aria-label="Edit description"
          @click=${V}
          @keydown=${Ee}
        >
          ${(()=>{let H=l.description||"";return H.trim()===""?S`<div class="muted">Description</div>`:Bt(H)})()}
        </div>`,G=(()=>{let H=l;return String(l.acceptance||H.acceptance_criteria||"")})(),dt=m?S`<div class="acceptance">
          ${G.trim().length>0?S`<div class="props-card__title">Acceptance Criteria</div>`:""}
          <textarea
            @keydown=${Qe}
            .value=${G}
            rows="6"
            style="width:100%"
          ></textarea>
          <div class="editable-actions">
            <button @click=${qe}>Save</button>
            <button @click=${Je}>Cancel</button>
          </div>
        </div>`:S`<div class="acceptance">
          ${(()=>{let H=G,te=H.trim().length>0;return S`${te?S`<div class="props-card__title">Acceptance Criteria</div>`:""}
              <div
                class="md editable"
                tabindex="0"
                role="button"
                aria-label="Edit acceptance criteria"
                @click=${xe}
                @keydown=${Le}
              >
                ${te?Bt(H):S`<div class="muted">Add acceptance criteria…</div>`}
              </div>`})()}
        </div>`,le=String(l.notes||""),Ht=h?S`<div class="notes">
          ${le.trim().length>0?S`<div class="props-card__title">Notes</div>`:""}
          <textarea
            @keydown=${ee}
            .value=${le}
            rows="6"
            style="width:100%"
          ></textarea>
          <div class="editable-actions">
            <button @click=${Oe}>Save</button>
            <button @click=${Ue}>Cancel</button>
          </div>
        </div>`:S`<div class="notes">
          ${(()=>{let H=le,te=H.trim().length>0;return S`${te?S`<div class="props-card__title">Notes</div>`:""}
              <div
                class="md editable"
                tabindex="0"
                role="button"
                aria-label="Edit notes"
                @click=${He}
                @keydown=${Pe}
              >
                ${te?Bt(H):S`<div class="muted">Add notes…</div>`}
              </div>`})()}
        </div>`,vt=Array.isArray(l.labels)?l.labels:[],Ut=S`<div class="props-card labels">
      <div>
        <div class="props-card__title">Labels</div>
      </div>
      <ul>
        ${vt.map(H=>S`<li>
              <span class="badge" title=${H}
                >${H}
                <button
                  class="icon-button"
                  title="Remove label"
                  aria-label=${"Remove label "+H}
                  @click=${()=>j(H)}
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
          .value=${_}
          @input=${D}
          @keydown=${N}
        />
        <button @click=${U}>Add</button>
      </div>
    </div>`,je=String(l.design||""),ut=f?S`<div class="design">
          ${je.trim().length>0?S`<div class="props-card__title">Design</div>`:""}
          <textarea
            @keydown=${z}
            .value=${je}
            rows="6"
            style="width:100%"
          ></textarea>
          <div class="editable-actions">
            <button @click=${ue}>Save</button>
            <button @click=${J}>Cancel</button>
          </div>
        </div>`:S`<div class="design">
          ${(()=>{let H=je,te=H.trim().length>0;return S`${te?S`<div class="props-card__title">Design</div>`:""}
              <div
                class="md editable"
                tabindex="0"
                role="button"
                aria-label="Edit design"
                @click=${ne}
                @keydown=${et}
              >
                ${te?Bt(H):S`<div class="muted">Add design…</div>`}
              </div>`})()}
        </div>`;return S`
      <div class="panel__body" id="detail-root">
        <div style="position:relative">
          <div class="detail-layout">
            <div class="detail-main">
              ${u} ${B} ${ut} ${Ht}
              ${dt}
            </div>
            <div class="detail-side">
              <div class="props-card">
                <div class="props-card__title">Properties</div>
                <div class="prop">
                  <div class="label">Type</div>
                  <div class="value">
                    ${at(l.issue_type)}
                  </div>
                </div>
                <div class="prop">
                  <div class="label">Status</div>
                  <div class="value">${L}</div>
                </div>
                <div class="prop">
                  <div class="label">Priority</div>
                  <div class="value">${T}</div>
                </div>
                <div class="prop assignee">
                  <div class="label">Assignee</div>
                  <div class="value">
                    ${v?S`<input
                            type="text"
                            aria-label="Edit assignee"
                            .value=${l.assignee||""}
                            size=${Math.min(40,Math.max(12,(l.assignee||"").length+3))}
                            @keydown=${H=>{H.key==="Escape"?(H.preventDefault(),I()):H.key==="Enter"&&(H.preventDefault(),b())}}
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
                          </button>`:S`${(()=>{let H=l.assignee||"",te=H.trim().length>0;return S`<span
                            class=${te?"editable":"editable muted"}
                            tabindex="0"
                            role="button"
                            aria-label="Edit assignee"
                            @click=${w}
                            @keydown=${y}
                            >${te?H:"Unassigned"}</span
                          >`})()}`}
                  </div>
                </div>
              </div>
              ${Ut}
              ${Se("Dependencies",l.dependencies||[])}
              ${Se("Dependents",l.dependents||[])}
            </div>
          </div>
        </div>
      </div>
    `}function M(){if(!i){x(o?"Loading\u2026":"No issue selected");return}X(_e(i),s)}function ge(l,u){return async L=>{if(L.stopPropagation(),!(!i||c)){c=!0;try{if(u==="Dependencies"){let T=await e("dep-remove",{a:i.id,b:l,view_id:i.id});T&&typeof T=="object"&&(i=T,M())}else{let T=await e("dep-remove",{a:l,b:i.id,view_id:i.id});T&&typeof T=="object"&&(i=T,M())}}catch(T){r("dep-remove failed %o",T)}finally{c=!1}}}}function Ae(l,u){return async L=>{if(!i||c)return;let T=L.currentTarget,B=T.previousElementSibling,G=B?B.value.trim():"";if(!G||G===i.id){ce("Enter a different issue id");return}if(new Set((l||[]).map(le=>le.id)).has(G)){ce("Link already exists");return}c=!0,T&&(T.disabled=!0),B&&(B.disabled=!0);try{if(u==="Dependencies"){let le=await e("dep-add",{a:i.id,b:G,view_id:i.id});le&&typeof le=="object"&&(i=le,M())}else{let le=await e("dep-add",{a:G,b:i.id,view_id:i.id});le&&typeof le=="object"&&(i=le,M())}}catch(le){r("dep-add failed %o",le),ce("Failed to add dependency","error")}finally{c=!1}}}function Te(l){l.key==="Escape"?(a=!1,M()):l.key==="Enter"&&(l.preventDefault(),$())}function Ee(l){l.key==="Enter"&&V()}function Le(l){l.key==="Enter"&&xe()}function Pe(l){l.key==="Enter"&&He()}function et(l){l.key==="Enter"&&ne()}return{async load(l){if(!l){x("No issue selected");return}o=String(l),i=null,g(),i||x("Loading\u2026"),c=!1,M()},clear(){x("Select an issue to view details")},destroy(){s.replaceChildren()}}}function ls(s){let e=s.navigate,t=s.onUpdate,n=s.requestRender,r=s.getSelectedId||(()=>null),i=s.row_class||"issue-row",o=new Set;function c(h,m,v,_=""){let k=`${h}:${m}`;return o.has(k)?S`<span>
        <input
          type="text"
          .value=${v}
          class="inline-edit"
          @keydown=${async g=>{if(g.key==="Escape")o.delete(k),n();else if(g.key==="Enter"){let E=g.currentTarget.value||"";E!==v&&await t(h,{[m]:E}),o.delete(k),n()}}}
          @blur=${async g=>{let E=g.currentTarget.value||"";E!==v&&await t(h,{[m]:E}),o.delete(k),n()}}
          autofocus
        />
      </span>`:S`<span
      class="editable text-truncate ${v?"":"muted"}"
      tabindex="0"
      role="button"
      @click=${g=>{g.stopPropagation(),g.preventDefault(),o.add(k),n()}}
      @keydown=${g=>{g.key==="Enter"&&(g.preventDefault(),g.stopPropagation(),o.add(k),n())}}
      >${v||_}</span
    >`}function a(h,m){return async v=>{let k=v.currentTarget.value||"",x={};x[m]=m==="priority"?Number(k):k,await t(h,x)}}function p(h){return m=>{let v=m.target;v&&(v.tagName==="INPUT"||v.tagName==="SELECT")||e(h)}}function f(h){let m=String(h.status||"open"),v=String(h.priority??2),_=r()===h.id;return S`<tr
      role="row"
      class="${i} ${_?"selected":""}"
      data-issue-id=${h.id}
      @click=${p(h.id)}
    >
      <td role="gridcell" class="mono">${Ke(h.id)}</td>
      <td role="gridcell">${at(h.issue_type)}</td>
      <td role="gridcell">${c(h.id,"title",h.title||"")}</td>
      <td role="gridcell">
        <select
          class="badge-select badge--status is-${m}"
          .value=${m}
          @change=${a(h.id,"status")}
        >
          ${["open","in_progress","closed"].map(k=>S`<option value=${k} ?selected=${m===k}>
                ${Xe(k)}
              </option>`)}
        </select>
      </td>
      <td role="gridcell">
        ${c(h.id,"assignee",h.assignee||"","Unassigned")}
      </td>
      <td role="gridcell">
        <select
          class="badge-select badge--priority ${"is-p"+v}"
          .value=${v}
          @change=${a(h.id,"priority")}
        >
          ${Ye.map((k,x)=>S`<option
                value=${String(x)}
                ?selected=${v===String(x)}
              >
                ${Et(x)} ${k}
              </option>`)}
        </select>
      </td>
    </tr>`}return f}function fn(s,e,t,n=void 0,r=void 0){let i=[],o=new Set,c=new Set,a=new Map,p=r?Ve(r):null;p&&p.subscribe(()=>{let g=i.length===0;if(i=x(),h(),g&&i.length>0){let A=String(i[0].epic?.id||"");A&&!o.has(A)&&k(A)}});let f=ls({navigate:g=>t(g),onUpdate:_,requestRender:h,getSelectedId:()=>null,row_class:"epic-row"});function h(){X(m(),s)}function m(){return i.length?S`${i.map(g=>v(g))}`:S`<div class="panel__header muted">No epics found.</div>`}function v(g){let A=g.epic||{},E=String(A.id||""),$=o.has(E),R=p?p.selectEpicChildren(E):[],w=c.has(E);return S`
      <div class="epic-group" data-epic-id=${E}>
        <div
          class="epic-header"
          @click=${()=>k(E)}
          role="button"
          tabindex="0"
          aria-expanded=${$}
        >
          ${Ke(E,{class_name:"mono"})}
          <span class="text-truncate" style="margin-left:8px"
            >${A.title||"(no title)"}</span
          >
          <span
            class="epic-progress"
            style="margin-left:auto; display:flex; align-items:center; gap:8px;"
          >
            <progress
              value=${Number(g.closed_children||0)}
              max=${Math.max(1,Number(g.total_children||0))}
            ></progress>
            <span class="muted mono"
              >${g.closed_children}/${g.total_children}</span
            >
          </span>
        </div>
        ${$?S`<div class="epic-children">
              ${w?S`<div class="muted">Loading…</div>`:R.length===0?S`<div class="muted">No issues found</div>`:S`<table class="table">
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
                        ${R.map(y=>f(y))}
                      </tbody>
                    </table>`}
            </div>`:null}
      </div>
    `}async function _(g,A){try{await e.updateIssue({id:g,...A}),h()}catch{}}async function k(g){if(o.has(g)){if(o.delete(g),a.has(g)){try{let A=a.get(g);A&&await A()}catch{}a.delete(g);try{r&&r.unregister&&r.unregister(`detail:${g}`)}catch{}}}else{if(o.add(g),c.add(g),h(),n&&typeof n.subscribeList=="function")try{try{r&&r.register&&r.register(`detail:${g}`,{type:"issue-detail",params:{id:g}})}catch{}let A=await n.subscribeList(`detail:${g}`,{type:"issue-detail",params:{id:g}});a.set(g,A)}catch{}c.delete(g)}h()}function x(){let g=r&&r.snapshotFor?r.snapshotFor("tab:epics")||[]:[],A=[];for(let E of g){let $=Array.isArray(E.dependents)?E.dependents:[],R=Number.isFinite(E.total_children),w=Number.isFinite(E.closed_children),y=R?Number(E.total_children)||0:$.length,b=w&&Number(E.closed_children)||0;if(!w)for(let I of $)String(I.status||"")==="closed"&&b++;A.push({epic:E,total_children:y,closed_children:b})}return A}return{async load(){i=x(),h();try{if(i.length>0){let g=String(i[0].epic?.id||"");g&&!o.has(g)&&await k(g)}}catch{}}}}function hn(s){let e=document.createElement("dialog");e.id="fatal-error-dialog",e.setAttribute("role","alertdialog"),e.setAttribute("aria-modal","true"),e.innerHTML=`
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
    </div>`,s.appendChild(e);let t=e.querySelector("#fatal-error-title"),n=e.querySelector("#fatal-error-message"),r=e.querySelector("#fatal-error-detail"),i=e.querySelector("#fatal-error-reload"),o=e.querySelector("#fatal-error-close"),c=()=>{if(typeof e.close=="function")try{e.close()}catch{}e.removeAttribute("open")},a=(p,f,h="")=>{t&&(t.textContent=p||"Unexpected Error"),n&&(n.textContent=f||"An unrecoverable error occurred.");let m=typeof h=="string"?h.trim():"";if(r&&(m.length>0?(r.textContent=m,r.removeAttribute("hidden")):(r.textContent="No additional diagnostics available.",r.setAttribute("hidden",""))),typeof e.showModal=="function")try{e.showModal(),e.setAttribute("open","")}catch{e.setAttribute("open","")}else e.setAttribute("open","")};return i&&i.addEventListener("click",()=>{window.location.reload()}),o&&o.addEventListener("click",()=>c()),e.addEventListener("cancel",p=>{p.preventDefault(),c()}),{open:a,close:c,getElement(){return e}}}function gn(s,e,t){let n=document.createElement("dialog");n.id="issue-dialog",n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true"),n.innerHTML=`
    <div class="issue-dialog__container" part="container">
      <header class="issue-dialog__header">
        <div class="issue-dialog__title">
          <span class="mono" id="issue-dialog-title"></span>
        </div>
        <button type="button" class="issue-dialog__close" aria-label="Close">\xD7</button>
      </header>
      <div class="issue-dialog__body" id="issue-dialog-body"></div>
    </div>
  `,s.appendChild(n);let r=n.querySelector("#issue-dialog-body"),i=n.querySelector("#issue-dialog-title"),o=n.querySelector(".issue-dialog__close");function c(v){i.replaceChildren(),i.appendChild(Ke(v))}n.addEventListener("mousedown",v=>{v.target===n&&(v.preventDefault(),p())}),n.addEventListener("cancel",v=>{v.preventDefault(),p()}),o.addEventListener("click",()=>p());let a=null;function p(){try{typeof n.close=="function"?n.close():n.removeAttribute("open")}catch{n.removeAttribute("open")}try{t()}catch{}m()}function f(v){try{let _=document.activeElement;_&&_ instanceof HTMLElement?a=_:a=null}catch{a=null}c(v);try{"showModal"in n&&typeof n.showModal=="function"?n.showModal():n.setAttribute("open",""),setTimeout(()=>{try{o.focus()}catch{}},0)}catch{n.setAttribute("open","")}}function h(){try{typeof n.close=="function"?n.close():n.removeAttribute("open")}catch{n.removeAttribute("open")}m()}function m(){try{a&&document.contains(a)&&a.focus()}catch{}finally{a=null}}return{open:f,close:h,getMount(){return r}}}var cs=["bug","feature","task","epic","chore"];function ds(s){switch((s||"").toString().toLowerCase()){case"bug":return"Bug";case"feature":return"Feature";case"task":return"Task";case"epic":return"Epic";case"chore":return"Chore";default:return""}}function mn(s,e,t,n,r=void 0,i=void 0){let o=Z("views:list"),c="all",a="",p=[],f="",h=n?n.getState().selected_id:null,m=null,v=ls({navigate:w=>{let y=t||(I=>window.location.hash=I),b=n?n.getState().view:"issues";y(Ze(b,w))},onUpdate:$,requestRender:E,getSelectedId:()=>h,row_class:"issue-row"}),_=async w=>{c=w.currentTarget.value,o("status change %s",c),n&&n.setState({filters:{status:c}}),await R()},k=w=>{a=w.currentTarget.value,o("search input %s",a),n&&n.setState({filters:{search:a}}),E()},x=w=>{f=w.currentTarget.value||"",o("type change %s",f||"(all)"),n&&n.setState({filters:{type:f}}),E()};if(n){let w=n.getState();w&&w.filters&&typeof w.filters=="object"&&(c=w.filters.status||"all",a=w.filters.search||"",f=typeof w.filters.type=="string"?w.filters.type:"")}let g=i?Ve(i):null;function A(){let w=p;if(c!=="all"&&c!=="ready"&&(w=w.filter(y=>String(y.status||"")===c)),a){let y=a.toLowerCase();w=w.filter(b=>{let I=String(b.id).toLowerCase(),D=String(b.title||"").toLowerCase();return I.includes(y)||D.includes(y)})}return f&&(w=w.filter(y=>String(y.issue_type||"")===String(f))),c==="closed"&&(w=w.slice().sort(mt)),S`
      <div class="panel__header">
        <select @change=${_} .value=${c}>
          <option value="all">All</option>
          <option value="ready">Ready</option>
          <option value="open">${Xe("open")}</option>
          <option value="in_progress">${Xe("in_progress")}</option>
          <option value="closed">${Xe("closed")}</option>
        </select>
        <select
          @change=${x}
          .value=${f}
          aria-label="Filter by type"
        >
          <option value="">All types</option>
          ${cs.map(y=>S`<option value=${y} ?selected=${f===y}>
                ${ds(y)}
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
        ${w.length===0?S`<div class="issues-block">
              <div class="muted" style="padding:10px 12px;">No issues</div>
            </div>`:S`<div class="issues-block">
              <table
                class="table"
                role="grid"
                aria-rowcount=${String(w.length)}
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
                  ${w.map(y=>v(y))}
                </tbody>
              </table>
            </div>`}
      </div>
    `}function E(){X(A(),s)}E();async function $(w,y){try{o("updateInline %s %o",w,Object.keys(y)),typeof y.title=="string"&&await e("edit-text",{id:w,field:"title",value:y.title}),typeof y.assignee=="string"&&await e("update-assignee",{id:w,assignee:y.assignee}),typeof y.status=="string"&&await e("update-status",{id:w,status:y.status}),typeof y.priority=="number"&&await e("update-priority",{id:w,priority:y.priority})}catch{}}async function R(){o("load");let w=s.querySelector("#list-root"),y=w?w.scrollTop:0;try{g?p=g.selectIssuesFor("tab:issues"):p=[]}catch(b){o("load failed: %o",b),p=[]}E();try{let b=s.querySelector("#list-root");b&&y>0&&(b.scrollTop=y)}catch{}}return s.tabIndex=0,s.addEventListener("keydown",w=>{if(w.key==="ArrowDown"||w.key==="ArrowUp"){let D=w.target;if((D&&typeof D.closest=="function"?D.closest("#list-root table.table"):null)&&!!!(D&&typeof D.closest=="function"&&(D.closest("input")||D.closest("textarea")||D.closest("select")))){let j=D&&typeof D.closest=="function"?D.closest("td"):null;if(j&&j.parentElement){let F=j.parentElement,q=F.parentElement;if(q&&q.querySelectorAll){let V=Array.from(q.querySelectorAll("tr")),re=Math.max(0,V.indexOf(F)),de=j.cellIndex||0,fe=w.key==="ArrowDown"?Math.min(re+1,V.length-1):Math.max(re-1,0),ne=V[fe],z=ne&&ne.cells?ne.cells[de]:null;if(z){let ue=z.querySelector('button:not([disabled]), [tabindex]:not([tabindex="-1"]), a[href], select:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled])');if(ue&&typeof ue.focus=="function"){w.preventDefault(),ue.focus();return}}}}}}let y=s.querySelector("#list-root tbody"),b=y?y.querySelectorAll("tr"):[];if(b.length===0)return;let I=0;if(h&&(I=Array.from(b).findIndex(N=>(N.getAttribute("data-issue-id")||"")===h),I<0&&(I=0)),w.key==="ArrowDown"){w.preventDefault();let D=b[Math.min(I+1,b.length-1)],N=D?D.getAttribute("data-issue-id"):"",U=N||null;n&&U&&n.setState({selected_id:U}),h=U,E()}else if(w.key==="ArrowUp"){w.preventDefault();let D=b[Math.max(I-1,0)],N=D?D.getAttribute("data-issue-id"):"",U=N||null;n&&U&&n.setState({selected_id:U}),h=U,E()}else if(w.key==="Enter"){w.preventDefault();let D=b[I],N=D?D.getAttribute("data-issue-id"):"";if(N){let U=t||(F=>window.location.hash=F),j=n?n.getState().view:"issues";U(Ze(j,N))}}}),n&&(m=n.subscribe(w=>{if(w.selected_id!==h&&(h=w.selected_id,o("selected %s",h||"(none)"),E()),w.filters&&typeof w.filters=="object"){let y=w.filters.status,b=w.filters.search||"",I=typeof w.filters.type=="string"?w.filters.type:"",D=!1;if(y!==c){c=y,R();return}b!==a&&(a=b,D=!0),I!==f&&(f=I,D=!0),D&&E()}})),g&&g.subscribe(()=>{try{p=g.selectIssuesFor("tab:issues"),E()}catch{}}),{load:R,destroy(){s.replaceChildren(),m&&(m(),m=null)}}}function bn(s,e,t){let n=Z("views:nav"),r=null;function i(a){return p=>{p.preventDefault(),n("click tab %s",a),t.gotoView(a)}}function o(){let p=e.getState().view||"issues";return S`
      <nav class="header-nav" aria-label="Primary">
        <a
          href="#/issues"
          class="tab ${p==="issues"?"active":""}"
          @click=${i("issues")}
          >Issues</a
        >
        <a
          href="#/epics"
          class="tab ${p==="epics"?"active":""}"
          @click=${i("epics")}
          >Epics</a
        >
        <a
          href="#/board"
          class="tab ${p==="board"?"active":""}"
          @click=${i("board")}
          >Board</a
        >
        <div class="queen-nav">
          <a
            href="#/messages"
            class="tab ${p==="messages"?"active":""}"
            @click=${i("messages")}
            >Messages</a
          >
          <a
            href="#/assignments"
            class="tab ${p==="assignments"?"active":""}"
            @click=${i("assignments")}
            >Assigns</a
          >
          <a
            href="#/reservations"
            class="tab ${p==="reservations"?"active":""}"
            @click=${i("reservations")}
            >Files</a
          >
          <a
            href="#/droids"
            class="tab ${p==="droids"?"active":""}"
            @click=${i("droids")}
            >Droids</a
          >
          <a
            href="#/worktrees"
            class="tab ${p==="worktrees"?"active":""}"
            @click=${i("worktrees")}
            >Trees</a
          >
        </div>
      </nav>
    `}function c(){X(o(),s)}return c(),r=e.subscribe(()=>c()),{destroy(){r&&(r(),r=null),X(S``,s)}}}function yn(s,e,t,n){let r=document.createElement("dialog");r.id="new-issue-dialog",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.innerHTML=`
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
  `,s.appendChild(r);let i=r.querySelector("#new-issue-form"),o=r.querySelector("#new-title"),c=r.querySelector("#new-type"),a=r.querySelector("#new-priority"),p=r.querySelector("#new-labels"),f=r.querySelector("#new-description"),h=r.querySelector("#new-issue-error"),m=r.querySelector("#btn-cancel"),v=r.querySelector("#btn-create"),_=r.querySelector(".new-issue__close");function k(){c.replaceChildren();let b=document.createElement("option");b.value="",b.textContent="\u2014 Select \u2014",c.appendChild(b);for(let I of cs){let D=document.createElement("option");D.value=I,D.textContent=ds(I),c.appendChild(D)}a.replaceChildren();for(let I=0;I<=4;I+=1){let D=document.createElement("option");D.value=String(I);let N=Ye[I]||"Medium";D.textContent=`${I} \u2013 ${N}`,a.appendChild(D)}}k();function x(){try{typeof r.close=="function"?r.close():r.removeAttribute("open")}catch{r.removeAttribute("open")}}function g(b){o.disabled=b,c.disabled=b,a.disabled=b,p.disabled=b,f.disabled=b,m.disabled=b,v.disabled=b,v.textContent=b?"Creating\u2026":"Create"}function A(){h.textContent=""}function E(b){h.textContent=b}function $(){try{let b=window.localStorage.getItem("beads-ui.new.type");b?c.value=b:c.value="";let I=window.localStorage.getItem("beads-ui.new.priority");I&&/^\d$/.test(I)?a.value=I:a.value="2"}catch{c.value="",a.value="2"}}function R(){let b=c.value||"",I=a.value||"";b.length>0&&window.localStorage.setItem("beads-ui.new.type",b),I.length>0&&window.localStorage.setItem("beads-ui.new.priority",I)}function w(b){let I=/-(\d+)$/.exec(String(b||""));return I&&I[1]?Number(I[1]):-1}async function y(){A();let b=String(o.value||"").trim();if(b.length===0){E("Title is required"),o.focus();return}let I=Number(a.value||"2");if(!(I>=0&&I<=4)){E("Priority must be 0..4"),a.focus();return}let D=String(c.value||""),N=String(f.value||""),U=String(p.value||"").split(",").map(V=>V.trim()).filter(V=>V.length>0),j={title:b};D.length>0&&(j.type=D),String(I).length>0&&(j.priority=I),N.length>0&&(j.description=N),g(!0);try{await e("create-issue",j)}catch{g(!1),E("Failed to create issue");return}R();let F=null;try{F=await e("list-issues",{filters:{status:"open",limit:50}})}catch{F=null}let q="";if(Array.isArray(F)){let V=F.filter(re=>String(re.title||"")===b);if(V.length>0){let re=V[0];for(let de of V){let fe=w(re.id||"");w(de.id||"")>fe&&(re=de)}q=String(re.id||"")}}if(q&&U.length>0)for(let V of U)try{await e("label-add",{id:q,label:V})}catch{}if(q){try{t.gotoIssue(q)}catch{}try{n&&n.setState({selected_id:q})}catch{}}g(!1),x()}return r.addEventListener("cancel",b=>{b.preventDefault(),x()}),_.addEventListener("click",()=>x()),m.addEventListener("click",()=>x()),r.addEventListener("keydown",b=>{b.key==="Enter"&&(b.ctrlKey||b.metaKey)&&(b.preventDefault(),y())}),i.addEventListener("submit",b=>{b.preventDefault(),y()}),{open(){i.reset(),A(),$();try{"showModal"in r&&typeof r.showModal=="function"?r.showModal():r.setAttribute("open","")}catch{r.setAttribute("open","")}setTimeout(()=>{try{o.focus()}catch{}},0)},close(){x()}}}function wn(s,e,t={}){let n=Z("views:messages"),r=null,i=null,o=null,c=!1;function a(g){i=g;let $=(e.getState().queen_messages||[]).find(R=>R.id===g);$&&$.thread_id&&(o=$.thread_id),x()}function p(){c=!c,x()}function f(g){try{let A=new Date(g),$=new Date().getTime()-A.getTime(),R=Math.floor($/6e4),w=Math.floor($/36e5),y=Math.floor($/864e5);return R<1?"just now":R<60?`${R}m ago`:w<24?`${w}h ago`:y<7?`${y}d ago`:A.toLocaleDateString()}catch{return g}}function h(g){let A=g.id===i,E=!g.read_at;return S`
      <div
        class="message-row ${A?"selected":""} ${E?"unread":""}"
        @click=${()=>a(g.id)}
        tabindex="0"
        @keydown=${$=>{($.key==="Enter"||$.key===" ")&&($.preventDefault(),a(g.id))}}
      >
        <div class="message-header">
          <span class="message-from">${g.from}</span>
          <span class="message-time">${f(g.created_at)}</span>
        </div>
        <div class="message-subject">${g.subject}</div>
        <div class="message-preview">${g.body?.slice(0,80)}${g.body?.length>80?"...":""}</div>
      </div>
    `}function m(g){return S`
      <div class="message-detail">
        <div class="message-detail-header">
          <h3>${g.subject}</h3>
          <div class="message-meta">
            <span>From: <strong>${g.from}</strong></span>
            <span>To: <strong>${g.to}</strong></span>
            <span>${f(g.created_at)}</span>
          </div>
        </div>
        <div class="message-body">
          ${g.body}
        </div>
        <div class="message-actions">
          <button class="btn btn-reply" @click=${p}>
            Reply
          </button>
        </div>
      </div>
    `}function v(){return S`
      <div class="compose-form">
        <h3>New Message</h3>
        <form @submit=${_}>
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
            <button type="button" class="btn btn-secondary" @click=${p}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    `}function _(g){g.preventDefault();let A=g.target,E=new FormData(A);n("send message: to=%s subject=%s",E.get("to"),E.get("subject")),c=!1,x()}function k(){let A=e.getState().queen_messages||[],E=A.find(y=>y.id===i),$=new Map;for(let y of A){let b=y.thread_id||y.id;$.has(b)||$.set(b,[]),$.get(b).push(y)}let R=Array.from($.entries()).sort((y,b)=>{let I=y[1][y[1].length-1],D=b[1][b[1].length-1];return new Date(D.created_at).getTime()-new Date(I.created_at).getTime()}),w=A;return o&&(w=A.filter(y=>y.thread_id===o||y.id===o)),S`
      <div class="queen-messages">
        <div class="messages-header">
          <h2>Messages</h2>
          <div class="messages-toolbar">
            <button
              class="btn btn-compose"
              @click=${p}
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
        ${c?v():""}
        <div class="messages-container">
          <div class="messages-list">
            ${w.length===0?S`<div class="empty-state">No messages</div>`:w.map(y=>h(y))}
          </div>
          <div class="messages-detail">
            ${E?m(E):S`<div class="empty-state">Select a message to view</div>`}
          </div>
        </div>
      </div>
    `}function x(){X(k(),s)}return{load(){n("load messages view"),x(),r=e.subscribe(()=>x())},unload(){n("unload messages view"),r&&(r(),r=null)},destroy(){r&&(r(),r=null),X(S``,s)}}}function vn(s,e,t={}){let n=Z("views:assignments"),r=null,i=null,o=null;function c(k){try{let x=new Date(k),A=new Date().getTime()-x.getTime(),E=Math.floor(A/6e4),$=Math.floor(A/36e5),R=Math.floor(A/864e5);return E<1?"just now":E<60?`${E}m ago`:$<24?`${$}h ago`:R<7?`${R}d ago`:x.toLocaleDateString()}catch{return k}}function a(k){switch(k){case"active":return"status-active";case"completed":return"status-completed";case"blocked":return"status-blocked";case"released":return"status-released";default:return""}}function p(k){return S`
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
        <td class="col-assigned">${c(k.assigned_at)}</td>
        <td class="col-actions">
          ${k.status==="active"?S`<button class="btn btn-sm btn-release" @click=${()=>f(k)}>
                Release
              </button>`:""}
        </td>
      </tr>
    `}function f(k){n("release assignment: %s",k.id)}function h(k){i=i===k?null:k,_()}function m(k){o=o===k?null:k,_()}function v(){let k=e.getState(),x=k.queen_assignments||[],g=k.queen_droids||[],A=[...new Set(x.map(w=>w.status))],E=x;i&&(E=E.filter(w=>w.status===i)),o&&(E=E.filter(w=>w.droid===o)),E=E.sort((w,y)=>new Date(y.assigned_at).getTime()-new Date(w.assigned_at).getTime());let $=x.filter(w=>w.status==="active").length,R=x.filter(w=>w.status==="active").reduce((w,y)=>(w.set(y.droid,(w.get(y.droid)||0)+1),w),new Map);return S`
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
            <span class="stat-value">${$}</span>
            <span class="stat-label">Active</span>
          </div>
          ${Array.from(R.entries()).map(([w,y])=>S`
              <div
                class="stat droid-stat ${o===w?"active":""}"
                @click=${()=>m(w)}
              >
                <span class="stat-value">${y}</span>
                <span class="stat-label">${w}</span>
              </div>
            `)}
        </div>
        <div class="assignments-filters">
          ${A.map(w=>S`
              <button
                class="filter-btn ${i===w?"active":""}"
                @click=${()=>h(w)}
              >
                ${w}
              </button>
            `)}
        </div>
        <div class="assignments-table-container">
          ${E.length===0?S`<div class="empty-state">No assignments</div>`:S`
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
                    ${E.map(w=>p(w))}
                  </tbody>
                </table>
              `}
        </div>
      </div>
    `}function _(){X(v(),s)}return{load(){n("load assignments view"),_(),r=e.subscribe(()=>_())},unload(){n("unload assignments view"),r&&(r(),r=null)},destroy(){r&&(r(),r=null),X(S``,s)}}}function kn(s,e,t={}){let n=Z("views:reservations"),r=null,i=null,o=!1;function c(g){try{let A=new Date(g),$=new Date().getTime()-A.getTime(),R=Math.floor($/6e4),w=Math.floor($/36e5),y=Math.floor($/864e5);return R<1?"just now":R<60?`${R}m ago`:w<24?`${w}h ago`:y<7?`${y}d ago`:A.toLocaleDateString()}catch{return g}}function a(g){try{let A=new Date(g),E=new Date,$=A.getTime()-E.getTime();if($<=0)return"Expired";let R=Math.floor($/6e4),w=Math.floor($/36e5);return R<60?`${R}m left`:w<24?`${w}h left`:`${Math.floor(w/24)}d left`}catch{return g}}function p(g){try{return new Date(g).getTime()<Date.now()}catch{return!1}}function f(g){let A=p(g.expires_at),E=g.has_conflict||!1;return S`
      <tr class="reservation-row ${A?"expired":""} ${E?"has-conflict":""}">
        <td class="col-path">
          <span class="path-badge ${g.exclusive?"exclusive":"shared"}">
            ${g.exclusive?"\u{1F512}":"\u{1F441}\uFE0F"}
          </span>
          <code class="file-path">${g.path}</code>
          ${E?S`<span class="conflict-indicator" title="Conflict with: ${g.conflicting_droids?.join(", ")}">⚠️</span>`:""}
        </td>
        <td class="col-droid">
          <span class="droid-badge">${g.droid}</span>
        </td>
        <td class="col-type">
          <span class="type-badge ${g.exclusive?"exclusive":"shared"}">
            ${g.exclusive?"Exclusive":"Shared"}
          </span>
        </td>
        <td class="col-expiry ${A?"expired-text":""}">
          ${a(g.expires_at)}
        </td>
        <td class="col-created">${c(g.created_at)}</td>
        <td class="col-actions">
          ${A?S`
                <span class="expired-label">Expired</span>
              `:S`
                <button
                  class="btn btn-sm btn-release"
                  @click=${()=>h(g)}
                  title="Release reservation"
                >
                  Release
                </button>
                <button
                  class="btn btn-sm btn-renew"
                  @click=${()=>m(g)}
                  title="Extend reservation"
                >
                  Renew
                </button>
              `}
        </td>
      </tr>
    `}function h(g){n("release reservation: %s",g.id)}function m(g){n("renew reservation: %s",g.id)}function v(g){i=i===g?null:g,x()}function _(){o=!o,x()}function k(){let A=e.getState().queen_reservations||[],E=[...new Set(A.map(b=>b.droid))],$=A;i&&($=$.filter(b=>b.droid===i)),o||($=$.filter(b=>!p(b.expires_at))),$=$.sort((b,I)=>new Date(b.expires_at).getTime()-new Date(I.expires_at).getTime());let R=A.filter(b=>!p(b.expires_at)).length,w=A.filter(b=>b.has_conflict).length,y=A.filter(b=>b.exclusive&&!p(b.expires_at)).length;return S`
      <div class="queen-reservations">
        <div class="reservations-header">
          <h2>File Reservations</h2>
          <div class="reservations-toolbar">
            <label class="toggle-expired">
              <input
                type="checkbox"
                ?checked=${o}
                @change=${_}
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
            <span class="stat-value">${R}</span>
            <span class="stat-label">Active</span>
          </div>
          <div class="stat">
            <span class="stat-value">${y}</span>
            <span class="stat-label">Exclusive</span>
          </div>
          ${w>0?S`
                <div class="stat stat-warning">
                  <span class="stat-value">${w}</span>
                  <span class="stat-label">Conflicts</span>
                </div>
              `:""}
          ${E.map(b=>S`
              <div
                class="stat droid-stat ${i===b?"active":""}"
                @click=${()=>v(b)}
              >
                <span class="stat-value">${A.filter(I=>I.droid===b&&!p(I.expires_at)).length}</span>
                <span class="stat-label">${b}</span>
              </div>
            `)}
        </div>
        <div class="reservations-table-container">
          ${$.length===0?S`<div class="empty-state">No reservations</div>`:S`
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
                    ${$.map(b=>f(b))}
                  </tbody>
                </table>
              `}
        </div>
      </div>
    `}function x(){X(k(),s)}return{load(){n("load reservations view"),x(),r=e.subscribe(()=>x())},unload(){n("unload reservations view"),r&&(r(),r=null)},destroy(){r&&(r(),r=null),X(S``,s)}}}function _n(s,e,t={}){let n=Z("views:droids"),r=null,i=null,o=null;function c(_){try{let k=new Date(_),g=new Date().getTime()-k.getTime(),A=Math.floor(g/6e4),E=Math.floor(g/36e5),$=Math.floor(g/864e5);return A<1?"just now":A<60?`${A}m ago`:E<24?`${E}h ago`:$<7?`${$}d ago`:k.toLocaleDateString()}catch{return _||"never"}}function a(_){switch(_){case"active":return{icon:"\u{1F7E2}",class:"status-active"};case"idle":return{icon:"\u{1F7E1}",class:"status-idle"};case"busy":return{icon:"\u{1F535}",class:"status-busy"};case"offline":return{icon:"\u26AB",class:"status-offline"};default:return{icon:"\u26AA",class:"status-unknown"}}}function p(_){let k=a(_.status),x=_.current_assignment&&_.current_assignment.length>0,g=(_.unread_count||0)>0;return S`
      <div class="droid-card ${k.class}">
        <div class="droid-header">
          <div class="droid-status">
            <span class="status-icon">${k.icon}</span>
            <span class="droid-name">${_.name}</span>
          </div>
          ${_.location?S`<span class="droid-location">${_.location}</span>`:""}
        </div>
        ${_.description?S`<div class="droid-description">${_.description}</div>`:""}
        <div class="droid-meta">
          ${_.model?S`<span class="droid-model" title="Model">${_.model}</span>`:""}
          <span class="droid-path" title="Path">${_.path}</span>
        </div>
        <div class="droid-activity">
          ${x?S`
                <div class="droid-assignment">
                  <span class="label">Working on:</span>
                  <a href="#/issues?issue=${encodeURIComponent(_.current_assignment||"")}" class="issue-link">
                    ${_.current_assignment}
                  </a>
                </div>
              `:S`<div class="droid-assignment idle">No active assignment</div>`}
          <div class="droid-stats">
            <span class="stat-item ${g?"has-unread":""}">
              ${g?`${_.unread_count} unread`:`${_.message_count||0} messages`}
            </span>
            <span class="stat-item">
              Active: ${c(_.last_active||"")}
            </span>
          </div>
        </div>
      </div>
    `}function f(_){i=i===_?null:_,v()}function h(_){o=o===_?null:_,v()}function m(){let k=e.getState().queen_droids||[],x=[...new Set(k.map(y=>y.status))],g=[...new Set(k.map(y=>y.location).filter(Boolean))],A=k;i&&(A=A.filter(y=>y.status===i)),o&&(A=A.filter(y=>y.location===o));let E={active:0,busy:1,idle:2,offline:3};A=A.sort((y,b)=>{let I=E[y.status]??4,D=E[b.status]??4;return I!==D?I-D:y.name.localeCompare(b.name)});let $=k.filter(y=>y.status==="active").length,R=k.filter(y=>y.status==="idle").length,w=k.reduce((y,b)=>y+(b.unread_count||0),0);return S`
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
          <div class="stat ${i==="active"?"active":""}" @click=${()=>f("active")}>
            <span class="stat-value">${$}</span>
            <span class="stat-label">Active</span>
          </div>
          <div class="stat ${i==="idle"?"active":""}" @click=${()=>f("idle")}>
            <span class="stat-value">${R}</span>
            <span class="stat-label">Idle</span>
          </div>
          <div class="stat">
            <span class="stat-value">${k.length}</span>
            <span class="stat-label">Total</span>
          </div>
          ${w>0?S`
                <div class="stat stat-warning">
                  <span class="stat-value">${w}</span>
                  <span class="stat-label">Unread</span>
                </div>
              `:""}
        </div>
        ${g.length>1?S`
              <div class="droids-filters">
                ${g.map(y=>S`
                    <button
                      class="filter-btn ${o===y?"active":""}"
                      @click=${()=>h(y)}
                    >
                      ${y}
                    </button>
                  `)}
              </div>
            `:""}
        <div class="droids-grid">
          ${A.length===0?S`<div class="empty-state">No droids discovered</div>`:A.map(y=>p(y))}
        </div>
      </div>
    `}function v(){X(m(),s)}return{load(){n("load droids view"),v(),r=e.subscribe(()=>v())},unload(){n("unload droids view"),r&&(r(),r=null)},destroy(){r&&(r(),r=null),X(S``,s)}}}var xn=lr(Ss(),1),us=(0,xn.default)("queenui:worktrees");function $n(s,e,t={}){us("createWorktreesView called");let n=null,r=[],i=null,o=null;function c(x){let g=x.split("/");return g[g.length-1]||x}function a(x){return x==="detached"?"(detached HEAD)":x}function p(x){return x?x.slice(0,7):""}function f(x){o=x,t.onSelect&&t.onSelect(x),k()}function h(x){t.onSwitch&&t.onSwitch(x)}function m(x){let g=x.is_current,A=x.path===o,E=c(x.path);return S`
      <button
        class="worktree-tab ${A?"worktree-tab--selected":""} ${g?"worktree-tab--current":""}"
        @click=${()=>f(x.path)}
        title="${x.path}"
      >
        <span class="worktree-tab__icon">${g?"\u{1F4CD}":"\u{1F4C1}"}</span>
        <span class="worktree-tab__name">${E}</span>
        <span class="worktree-tab__branch">${a(x.branch)}</span>
      </button>
    `}function v(x){if(!x)return S`
        <div class="worktree-detail worktree-detail--empty">
          <p>Select a worktree to view details</p>
        </div>
      `;let g=x.is_current;return S`
      <div class="worktree-detail">
        <div class="worktree-detail__header">
          <h3>${c(x.path)}</h3>
          ${g?S`<span class="worktree-badge worktree-badge--current">Current</span>`:S`
                <button
                  class="btn btn--sm btn--primary"
                  @click=${()=>h(x.path)}
                >
                  Switch to this worktree
                </button>
              `}
        </div>

        <dl class="worktree-detail__info">
          <dt>Path</dt>
          <dd class="worktree-detail__path">${x.path}</dd>

          <dt>Branch</dt>
          <dd>${a(x.branch)}</dd>

          <dt>Commit</dt>
          <dd class="worktree-detail__commit">${p(x.commit)}</dd>

          ${x.is_bare?S`
                <dt>Type</dt>
                <dd>Bare repository</dd>
              `:""}
        </dl>

        <div class="worktree-detail__actions">
          <h4>Quick Actions</h4>
          <div class="worktree-actions">
            <button
              class="btn btn--sm"
              @click=${()=>t.onFilterIssues?.(x.path)}
              title="Show issues related to this worktree"
            >
              📋 View Issues
            </button>
            <button
              class="btn btn--sm"
              @click=${()=>t.onFilterReservations?.(x.path)}
              title="Show file reservations in this worktree"
            >
              🔒 View Reservations
            </button>
            <button
              class="btn btn--sm"
              @click=${()=>t.onFilterAssignments?.(x.path)}
              title="Show assignments for this worktree"
            >
              👤 View Assignments
            </button>
          </div>
        </div>
      </div>
    `}function _(){let x=r.find(A=>A.path===o)||null,g=r.filter(A=>!A.is_bare);return S`
      <div class="worktrees-view">
        <div class="worktrees-header">
          <h2>Git Worktrees</h2>
          <span class="worktrees-count">${g.length} worktree${g.length!==1?"s":""}</span>
        </div>

        ${g.length===0?S`
              <div class="worktrees-empty">
                <p>No git worktrees found.</p>
                <p class="worktrees-empty__hint">
                  Create worktrees with: <code>git worktree add ../feature-branch feature-branch</code>
                </p>
              </div>
            `:S`
              <div class="worktrees-tabs">
                ${g.map(A=>m(A))}
              </div>

              ${v(x)}

              <div class="worktrees-summary">
                <h4>Worktree Summary</h4>
                <table class="worktrees-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Branch</th>
                      <th>Commit</th>
                      <th>Path</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${g.map(A=>S`
                        <tr
                          class="${A.is_current?"worktrees-table__row--current":""}"
                          @click=${()=>f(A.path)}
                        >
                          <td>${A.is_current?"\u{1F4CD}":""}</td>
                          <td>${c(A.path)}</td>
                          <td>${a(A.branch)}</td>
                          <td class="worktrees-table__commit">${p(A.commit)}</td>
                          <td class="worktrees-table__path">${A.path}</td>
                        </tr>
                      `)}
                  </tbody>
                </table>
              </div>
            `}
      </div>
    `}function k(){try{X(_(),s)}catch(x){us("render error %o",x)}}return{load(){us("worktrees view load"),n=e.subscribe?.(x=>{x.worktrees&&(r=x.worktrees,i=x.current_worktree||null,r=r.map(g=>({...g,is_current:g.path===i})),!o&&i&&(o=i)),k()}),k()},unload(){us("worktrees view unload"),n&&(n(),n=null),X(S``,s)}}}var Sn=["list-issues","update-status","edit-text","update-priority","create-issue","list-ready","dep-add","dep-remove","epic-status","update-assignee","label-add","label-remove","subscribe-list","unsubscribe-list","snapshot","upsert","delete"];function Ks(){let s=Date.now().toString(36),e=Math.random().toString(36).slice(2,8);return`${s}-${e}`}function An(s,e,t=Ks()){return{id:t,type:s,payload:e}}function Tn(s={}){let e=Z("ws"),t={initialMs:s.backoff?.initialMs??1e3,maxMs:s.backoff?.maxMs??3e4,factor:s.backoff?.factor??2,jitterRatio:s.backoff?.jitterRatio??.2},n=()=>s.url&&s.url.length>0?s.url:typeof location<"u"?(location.protocol==="https:"?"wss://":"ws://")+location.host+"/ws":"ws://localhost/ws",r=null,i="closed",o=0,c=null,a=!0,p=new Map,f=[],h=new Map,m=new Set;function v($){for(let R of Array.from(m))try{R($)}catch{}}function _(){if(!a||c)return;i="reconnecting",e("ws reconnecting\u2026"),v(i);let $=Math.min(t.maxMs||0,(t.initialMs||0)*Math.pow(t.factor||1,o)),R=(t.jitterRatio||0)*$,w=Math.max(0,Math.round($+(Math.random()*2-1)*R));e("ws retry in %d ms (attempt %d)",w,o+1),c=setTimeout(()=>{c=null,E()},w)}function k($){try{r?.send(JSON.stringify($))}catch(R){e("ws send failed",R)}}function x(){for(i="open",e("ws open"),v(i),o=0;f.length;){let $=f.shift();$&&k($)}}function g($){let R;try{R=JSON.parse(String($.data))}catch{e("ws received non-JSON message");return}if(!R||typeof R.id!="string"||typeof R.type!="string"){e("ws received invalid envelope");return}if(p.has(R.id)){let y=p.get(R.id);p.delete(R.id),R.ok?y?.resolve(R.payload):y?.reject(R.error||new Error("ws error"));return}let w=h.get(R.type);if(w&&w.size>0)for(let y of Array.from(w))try{y(R.payload)}catch(b){e("ws event handler error",b)}else e("ws received unhandled message type: %s",R.type)}function A(){i="closed",e("ws closed"),v(i);for(let[$,R]of p.entries())R.reject(new Error("ws disconnected")),p.delete($);o+=1,_()}function E(){if(!a)return;let $=n();try{r=new WebSocket($),e("ws connecting %s",$),i="connecting",v(i),r.addEventListener("open",x),r.addEventListener("message",g),r.addEventListener("error",()=>{}),r.addEventListener("close",A)}catch(R){e("ws connect failed %o",R),_()}}return E(),{send($,R){if(!Sn.includes($))return Promise.reject(new Error(`unknown message type: ${$}`));let w=Ks(),y=An($,R,w);return e("send %s id=%s",$,w),new Promise((b,I)=>{p.set(w,{resolve:b,reject:I,type:$}),r&&r.readyState===r.OPEN?k(y):(e("queue %s id=%s (state=%s)",$,w,i),f.push(y))})},on($,R){h.has($)||h.set($,new Set);let w=h.get($);return w?.add(R),()=>{w?.delete(R)}},onConnection($){return m.add($),()=>{m.delete($)}},close(){a=!1,c&&(clearTimeout(c),c=null);try{r?.close()}catch{}},getState(){return i}}}function uo(s){let e=Z("main");e("bootstrap start");let t=S`
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
    <section id="worktrees-root" class="route worktrees" hidden></section>
  `;X(t,s);let n=document.getElementById("top-nav"),r=document.getElementById("issues-root"),i=document.getElementById("epics-root"),o=document.getElementById("board-root"),c=document.getElementById("messages-root"),a=document.getElementById("assignments-root"),p=document.getElementById("reservations-root"),f=document.getElementById("droids-root"),h=document.getElementById("worktrees-root"),m=document.getElementById("list-panel"),v=document.getElementById("detail-panel");if(m&&r&&i&&o&&v&&c&&a&&p&&f&&h){let $=function(l,u){let L="Request failed",T="";if(l&&typeof l=="object"){let G=l;if(typeof G.message=="string"&&G.message.length>0&&(L=G.message),typeof G.details=="string")T=G.details;else if(G.details&&typeof G.details=="object")try{T=JSON.stringify(G.details,null,2)}catch{T=""}}else typeof l=="string"&&l.length>0&&(L=l);let B=u&&u.length>0?`Failed to load ${u}`:"Request failed";E.open(B,L,T)},Ee=function(l){let u=String(l?.status||"all");return u==="ready"?{type:"ready-issues"}:u==="in_progress"?{type:"in-progress-issues"}:u==="closed"?{type:"closed-issues"}:{type:"all-issues"}},Pe=function(l){if(l.view==="issues"){let u=Ee(l.filters||{}),L=JSON.stringify(u);try{b.register("tab:issues",u)}catch(T){e("register issues store failed: %o",T)}(!Se||L!==Le)&&y.subscribeList("tab:issues",u).then(T=>{Se=T,Le=L}).catch(T=>{e("subscribe issues failed: %o",T),$(T,"issues list")})}else if(Se){Se().catch(()=>{}),Se=null,Le=null;try{b.unregister("tab:issues")}catch(u){e("unregister issues store failed: %o",u)}}if(l.view==="epics"){try{b.register("tab:epics",{type:"epics"})}catch(u){e("register epics store failed: %o",u)}y.subscribeList("tab:epics",{type:"epics"}).then(u=>{_e=u}).catch(u=>{e("subscribe epics failed: %o",u),$(u,"epics")})}else if(_e){_e().catch(()=>{}),_e=null;try{b.unregister("tab:epics")}catch(u){e("unregister epics store failed: %o",u)}}if(l.view==="board"){if(!M){try{b.register("tab:board:ready",{type:"ready-issues"})}catch(u){e("register board:ready store failed: %o",u)}y.subscribeList("tab:board:ready",{type:"ready-issues"}).then(u=>M=u).catch(u=>{e("subscribe board ready failed: %o",u),$(u,"board (Ready)")})}if(!ge){try{b.register("tab:board:in-progress",{type:"in-progress-issues"})}catch(u){e("register board:in-progress store failed: %o",u)}y.subscribeList("tab:board:in-progress",{type:"in-progress-issues"}).then(u=>ge=u).catch(u=>{e("subscribe board in-progress failed: %o",u),$(u,"board (In Progress)")})}if(!Ae){try{b.register("tab:board:closed",{type:"closed-issues"})}catch(u){e("register board:closed store failed: %o",u)}y.subscribeList("tab:board:closed",{type:"closed-issues"}).then(u=>Ae=u).catch(u=>{e("subscribe board closed failed: %o",u),$(u,"board (Closed)")})}if(!Te){try{b.register("tab:board:blocked",{type:"blocked-issues"})}catch(u){e("register board:blocked store failed: %o",u)}y.subscribeList("tab:board:blocked",{type:"blocked-issues"}).then(u=>Te=u).catch(u=>{e("subscribe board blocked failed: %o",u),$(u,"board (Blocked)")})}}else{if(M){M().catch(()=>{}),M=null;try{b.unregister("tab:board:ready")}catch(u){e("unregister board:ready failed: %o",u)}}if(ge){ge().catch(()=>{}),ge=null;try{b.unregister("tab:board:in-progress")}catch(u){e("unregister board:in-progress failed: %o",u)}}if(Ae){Ae().catch(()=>{}),Ae=null;try{b.unregister("tab:board:closed")}catch(u){e("unregister board:closed failed: %o",u)}}if(Te){Te().catch(()=>{}),Te=null;try{b.unregister("tab:board:blocked")}catch(u){e("unregister board:blocked failed: %o",u)}}}};var _=$,k=Ee,x=Pe;let g=document.getElementById("header-loading"),A=Cr(g),E=hn(s),R=Tn(),w=A.wrapSend((l,u)=>R.send(l,u)),y=Sr(w),b=Ar();R.on("snapshot",l=>{let u=l,L=u&&typeof u.id=="string"?u.id:"",T=L?b.getStore(L):null;if(T&&u&&u.type==="snapshot")try{T.applyPush(u)}catch{}}),R.on("upsert",l=>{let u=l,L=u&&typeof u.id=="string"?u.id:"",T=L?b.getStore(L):null;if(T&&u&&u.type==="upsert")try{T.applyPush(u)}catch{}}),R.on("delete",l=>{let u=l,L=u&&typeof u.id=="string"?u.id:"",T=L?b.getStore(L):null;if(T&&u&&u.type==="delete")try{T.applyPush(u)}catch{}});let I=Ve(b),D=!1;if(typeof R.onConnection=="function"){let l=u=>{e("ws state %s",u),u==="reconnecting"||u==="closed"?(D=!0,ce("Connection lost. Reconnecting\u2026","error",4e3)):u==="open"&&D&&(D=!1,ce("Reconnected","success",2200))};R.onConnection(l)}let N={status:"all",search:"",type:""};try{let l=window.localStorage.getItem("beads-ui.filters");if(l){let u=JSON.parse(l);if(u&&typeof u=="object"){let L=["bug","feature","task","epic","chore"],T="";if(typeof u.type=="string"&&L.includes(u.type))T=u.type;else if(Array.isArray(u.types)){let B="";for(let G of u.types)if(L.includes(String(G))){B=G;break}T=B}N={status:["all","open","in_progress","closed","ready"].includes(u.status)?u.status:"all",search:typeof u.search=="string"?u.search:"",type:T}}}}catch(l){e("filters parse error: %o",l)}let U="issues";try{let l=window.localStorage.getItem("beads-ui.view");(l==="issues"||l==="epics"||l==="board")&&(U=l)}catch(l){e("view parse error: %o",l)}let j={closed_filter:"today"};try{let l=window.localStorage.getItem("beads-ui.board");if(l){let u=JSON.parse(l);if(u&&typeof u=="object"){let L=String(u.closed_filter||"today");(L==="today"||L==="3"||L==="7")&&(j.closed_filter=L)}}}catch(l){e("board prefs parse error: %o",l)}let F=Er({filters:N,view:U,board:j}),q=Tr(F);q.start();let V=async(l,u)=>{try{return await w(l,u)}catch{return[]}};n&&bn(n,F,q);let re=yn(s,(l,u)=>w(l,u),q,F);try{let l=document.getElementById("new-issue-btn");l&&l.addEventListener("click",()=>re.open())}catch{}let fe=mn(m,async(l,u)=>{if(l==="list-issues")try{return I.selectIssuesFor("tab:issues")}catch(L){return e("list selectors failed: %o",L),[]}return V(l,u)},l=>{let u=Yt(l);u&&q.gotoIssue(u)},F,y,b);F.subscribe(l=>{let u={status:l.filters.status,search:l.filters.search,type:typeof l.filters.type=="string"?l.filters.type:""};window.localStorage.setItem("beads-ui.filters",JSON.stringify(u))}),F.subscribe(l=>{window.localStorage.setItem("beads-ui.board",JSON.stringify({closed_filter:l.board.closed_filter}))}),fe.load();let ne=gn(v,F,()=>{let l=F.getState();F.setState({selected_id:null});try{let u=l.view||"issues";q.gotoView(u)}catch{}}),z=null;z=pn(ne.getMount(),V,l=>{let u=Yt(l);u&&q.gotoIssue(u)},b);let ue=F.getState().selected_id;if(ue){v.hidden=!1,ne.open(ue),z&&z.load(ue);let l=`detail:${ue}`,u={type:"issue-detail",params:{id:ue}};try{b.register(l,u)}catch(L){e("register detail store failed: %o",L)}y.subscribeList(l,u).catch(L=>{e("detail subscribe failed: %o",L),$(L,"issue details")})}let J=null;F.subscribe(l=>{let u=l.selected_id;if(u){v.hidden=!1,ne.open(u),z&&z.load(u);let L=`detail:${u}`,T={type:"issue-detail",params:{id:u}};try{b.register(L,T)}catch{}y.subscribeList(L,T).then(B=>{J&&J().catch(()=>{}),J=B}).catch(B=>{e("detail subscribe failed: %o",B),$(B,"issue details")})}else{try{ne.close()}catch{}z&&z.clear(),v.hidden=!0,J&&(J().catch(()=>{}),J=null)}});let He=$r(V),ee=fn(i,He,l=>q.gotoIssue(l),y,b),Oe=Ir(o,He,l=>q.gotoIssue(l),F,y,b),Ue=wn(c,F,{onRefresh:()=>{e("refresh messages requested")}}),xe=vn(a,F,{onRefresh:()=>{e("refresh assignments requested")}}),Qe=kn(p,F,{onRefresh:()=>{e("refresh reservations requested")}}),qe=_n(f,F,{onRefresh:()=>{e("refresh droids requested")}}),Je=$n(h,F,{onSelect:l=>{e("worktree selected: %s",l)},onSwitch:l=>{e("switch worktree: %s",l),ce(`Switching to worktree: ${l.split("/").pop()}`,"info")},onFilterIssues:l=>{e("filter issues by worktree: %s",l),q.gotoView("issues")},onFilterReservations:l=>{e("filter reservations by worktree: %s",l),q.gotoView("reservations")},onFilterAssignments:l=>{e("filter assignments by worktree: %s",l),q.gotoView("assignments")}}),Se=null,_e=null,M=null,ge=null,Ae=null,Te=null,Le=null,et=l=>{r&&i&&o&&v&&c&&a&&p&&f&&h&&(r.hidden=l.view!=="issues",i.hidden=l.view!=="epics",o.hidden=l.view!=="board",c.hidden=l.view!=="messages",a.hidden=l.view!=="assignments",p.hidden=l.view!=="reservations",f.hidden=l.view!=="droids",h.hidden=l.view!=="worktrees"),Pe(l),!l.selected_id&&l.view==="epics"&&ee.load(),!l.selected_id&&l.view==="board"&&Oe.load(),l.view==="messages"?Ue.load():Ue.unload(),l.view==="assignments"?xe.load():xe.unload(),l.view==="reservations"?Qe.load():Qe.unload(),l.view==="droids"?qe.load():qe.unload(),l.view==="worktrees"?Je.load():Je.unload(),window.localStorage.setItem("beads-ui.view",l.view)};F.subscribe(et),et(F.getState()),window.addEventListener("keydown",l=>{let u=l.ctrlKey||l.metaKey,L=String(l.key||"").toLowerCase(),T=l.target,B=T&&T.tagName?String(T.tagName).toLowerCase():"",G=B==="input"||B==="textarea"||B==="select"||T&&typeof T.isContentEditable=="boolean"&&T.isContentEditable;u&&L==="n"&&(G||(l.preventDefault(),re.open()))})}}typeof window<"u"&&typeof document<"u"&&window.addEventListener("DOMContentLoaded",()=>{try{let t=window.localStorage.getItem("beads-ui.theme"),n=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches,r=t==="dark"||t==="light"?t:n?"dark":"light";document.documentElement.setAttribute("data-theme",r);let i=document.getElementById("theme-switch");i&&(i.checked=r==="dark")}catch{}let s=document.getElementById("theme-switch");s&&s.addEventListener("change",()=>{let t=s.checked?"dark":"light";document.documentElement.setAttribute("data-theme",t),window.localStorage.setItem("beads-ui.theme",t)});let e=document.getElementById("app");e&&uo(e)});export{uo as bootstrap};
//# sourceMappingURL=main.bundle.js.map
