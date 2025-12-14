var Cn=Object.create;var hs=Object.defineProperty;var Rn=Object.getOwnPropertyDescriptor;var In=Object.getOwnPropertyNames;var Ln=Object.getPrototypeOf,Dn=Object.prototype.hasOwnProperty;var Mn=(s,e,t)=>e in s?hs(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var gs=(s,e)=>()=>(e||s((e={exports:{}}).exports,e),e.exports);var Nn=(s,e,t,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of In(e))!Dn.call(s,r)&&r!==t&&hs(s,r,{get:()=>e[r],enumerable:!(n=Rn(e,r))||n.enumerable});return s};var On=(s,e,t)=>(t=s!=null?Cn(Ln(s)):{},Nn(e||!s||!s.__esModule?hs(t,"default",{value:s,enumerable:!0}):t,s));var J=(s,e,t)=>Mn(s,typeof e!="symbol"?e+"":e,t);var br=gs((ho,mr)=>{var bt=1e3,yt=bt*60,wt=yt*60,ot=wt*24,Hn=ot*7,Un=ot*365.25;mr.exports=function(s,e){e=e||{};var t=typeof s;if(t==="string"&&s.length>0)return qn(s);if(t==="number"&&isFinite(s))return e.long?Gn(s):jn(s);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(s))};function qn(s){if(s=String(s),!(s.length>100)){var e=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(s);if(e){var t=parseFloat(e[1]),n=(e[2]||"ms").toLowerCase();switch(n){case"years":case"year":case"yrs":case"yr":case"y":return t*Un;case"weeks":case"week":case"w":return t*Hn;case"days":case"day":case"d":return t*ot;case"hours":case"hour":case"hrs":case"hr":case"h":return t*wt;case"minutes":case"minute":case"mins":case"min":case"m":return t*yt;case"seconds":case"second":case"secs":case"sec":case"s":return t*bt;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return t;default:return}}}}function jn(s){var e=Math.abs(s);return e>=ot?Math.round(s/ot)+"d":e>=wt?Math.round(s/wt)+"h":e>=yt?Math.round(s/yt)+"m":e>=bt?Math.round(s/bt)+"s":s+"ms"}function Gn(s){var e=Math.abs(s);return e>=ot?Vt(s,e,ot,"day"):e>=wt?Vt(s,e,wt,"hour"):e>=yt?Vt(s,e,yt,"minute"):e>=bt?Vt(s,e,bt,"second"):s+" ms"}function Vt(s,e,t,n){var r=e>=t*1.5;return Math.round(s/t)+" "+n+(r?"s":"")}});var wr=gs((go,yr)=>{function Wn(s){t.debug=t,t.default=t,t.coerce=a,t.disable=o,t.enable=r,t.enabled=l,t.humanize=br(),t.destroy=u,Object.keys(s).forEach(d=>{t[d]=s[d]}),t.names=[],t.skips=[],t.formatters={};function e(d){let p=0;for(let f=0;f<d.length;f++)p=(p<<5)-p+d.charCodeAt(f),p|=0;return t.colors[Math.abs(p)%t.colors.length]}t.selectColor=e;function t(d){let p,f=null,b,x;function _(...C){if(!_.enabled)return;let y=_,M=Number(new Date),E=M-(p||M);y.diff=E,y.prev=p,y.curr=M,p=M,C[0]=t.coerce(C[0]),typeof C[0]!="string"&&C.unshift("%O");let v=0;C[0]=C[0].replace(/%([a-zA-Z%])/g,(m,w)=>{if(m==="%%")return"%";v++;let k=t.formatters[w];if(typeof k=="function"){let R=C[v];m=k.call(y,R),C.splice(v,1),v--}return m}),t.formatArgs.call(y,C),(y.log||t.log).apply(y,C)}return _.namespace=d,_.useColors=t.useColors(),_.color=t.selectColor(d),_.extend=n,_.destroy=t.destroy,Object.defineProperty(_,"enabled",{enumerable:!0,configurable:!1,get:()=>f!==null?f:(b!==t.namespaces&&(b=t.namespaces,x=t.enabled(d)),x),set:C=>{f=C}}),typeof t.init=="function"&&t.init(_),_}function n(d,p){let f=t(this.namespace+(typeof p>"u"?":":p)+d);return f.log=this.log,f}function r(d){t.save(d),t.namespaces=d,t.names=[],t.skips=[];let p=(typeof d=="string"?d:"").trim().replace(/\s+/g,",").split(",").filter(Boolean);for(let f of p)f[0]==="-"?t.skips.push(f.slice(1)):t.names.push(f)}function i(d,p){let f=0,b=0,x=-1,_=0;for(;f<d.length;)if(b<p.length&&(p[b]===d[f]||p[b]==="*"))p[b]==="*"?(x=b,_=f,b++):(f++,b++);else if(x!==-1)b=x+1,_++,f=_;else return!1;for(;b<p.length&&p[b]==="*";)b++;return b===p.length}function o(){let d=[...t.names,...t.skips.map(p=>"-"+p)].join(",");return t.enable(""),d}function l(d){for(let p of t.skips)if(i(d,p))return!1;for(let p of t.names)if(i(d,p))return!0;return!1}function a(d){return d instanceof Error?d.stack||d.message:d}function u(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.")}return t.enable(t.load()),t}yr.exports=Wn});var kr=gs(($e,Zt)=>{$e.formatArgs=Zn;$e.save=Kn;$e.load=Yn;$e.useColors=Vn;$e.storage=Xn();$e.destroy=(()=>{let s=!1;return()=>{s||(s=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."))}})();$e.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function Vn(){if(typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs))return!0;if(typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;let s;return typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&(s=navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/))&&parseInt(s[1],10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}function Zn(s){if(s[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+s[0]+(this.useColors?"%c ":" ")+"+"+Zt.exports.humanize(this.diff),!this.useColors)return;let e="color: "+this.color;s.splice(1,0,e,"color: inherit");let t=0,n=0;s[0].replace(/%[a-zA-Z%]/g,r=>{r!=="%%"&&(t++,r==="%c"&&(n=t))}),s.splice(n,0,e)}$e.log=console.debug||console.log||(()=>{});function Kn(s){try{s?$e.storage.setItem("debug",s):$e.storage.removeItem("debug")}catch{}}function Yn(){let s;try{s=$e.storage.getItem("debug")||$e.storage.getItem("DEBUG")}catch{}return!s&&typeof process<"u"&&"env"in process&&(s=process.env.DEBUG),s}function Xn(){try{return localStorage}catch{}}Zt.exports=wr()($e);var{formatters:Qn}=Zt.exports;Qn.j=function(s){try{return JSON.stringify(s)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}}});var xt=globalThis,Wt=xt.trustedTypes,or=Wt?Wt.createPolicy("lit-html",{createHTML:s=>s}):void 0,pr="$lit$",Ke=`lit$${Math.random().toFixed(9).slice(2)}$`,fr="?"+Ke,Pn=`<${fr}>`,nt=document,At=()=>nt.createComment(""),St=s=>s===null||typeof s!="object"&&typeof s!="function",vs=Array.isArray,Fn=s=>vs(s)||typeof s?.[Symbol.iterator]=="function",ms=`[ 	
\f\r]`,vt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ar=/-->/g,lr=/>/g,st=RegExp(`>|${ms}(?:([^\\s"'>=/]+)(${ms}*=${ms}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),cr=/'/g,dr=/"/g,hr=/^(?:script|style|textarea|title)$/i,xs=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),T=xs(1),ao=xs(2),lo=xs(3),it=Symbol.for("lit-noChange"),ce=Symbol.for("lit-nothing"),ur=new WeakMap,rt=nt.createTreeWalker(nt,129);function gr(s,e){if(!vs(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return or!==void 0?or.createHTML(e):e}var zn=(s,e)=>{let t=s.length-1,n=[],r,i=e===2?"<svg>":e===3?"<math>":"",o=vt;for(let l=0;l<t;l++){let a=s[l],u,d,p=-1,f=0;for(;f<a.length&&(o.lastIndex=f,d=o.exec(a),d!==null);)f=o.lastIndex,o===vt?d[1]==="!--"?o=ar:d[1]!==void 0?o=lr:d[2]!==void 0?(hr.test(d[2])&&(r=RegExp("</"+d[2],"g")),o=st):d[3]!==void 0&&(o=st):o===st?d[0]===">"?(o=r??vt,p=-1):d[1]===void 0?p=-2:(p=o.lastIndex-d[2].length,u=d[1],o=d[3]===void 0?st:d[3]==='"'?dr:cr):o===dr||o===cr?o=st:o===ar||o===lr?o=vt:(o=st,r=void 0);let b=o===st&&s[l+1].startsWith("/>")?" ":"";i+=o===vt?a+Pn:p>=0?(n.push(u),a.slice(0,p)+pr+a.slice(p)+Ke+b):a+Ke+(p===-2?l:b)}return[gr(s,i+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),n]},$t=class s{constructor({strings:e,_$litType$:t},n){let r;this.parts=[];let i=0,o=0,l=e.length-1,a=this.parts,[u,d]=zn(e,t);if(this.el=s.createElement(u,n),rt.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(r=rt.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(let p of r.getAttributeNames())if(p.endsWith(pr)){let f=d[o++],b=r.getAttribute(p).split(Ke),x=/([.?@])?(.*)/.exec(f);a.push({type:1,index:i,name:x[2],strings:b,ctor:x[1]==="."?ys:x[1]==="?"?ws:x[1]==="@"?ks:gt}),r.removeAttribute(p)}else p.startsWith(Ke)&&(a.push({type:6,index:i}),r.removeAttribute(p));if(hr.test(r.tagName)){let p=r.textContent.split(Ke),f=p.length-1;if(f>0){r.textContent=Wt?Wt.emptyScript:"";for(let b=0;b<f;b++)r.append(p[b],At()),rt.nextNode(),a.push({type:2,index:++i});r.append(p[f],At())}}}else if(r.nodeType===8)if(r.data===fr)a.push({type:2,index:i});else{let p=-1;for(;(p=r.data.indexOf(Ke,p+1))!==-1;)a.push({type:7,index:i}),p+=Ke.length-1}i++}}static createElement(e,t){let n=nt.createElement("template");return n.innerHTML=e,n}};function ht(s,e,t=s,n){if(e===it)return e;let r=n!==void 0?t._$Co?.[n]:t._$Cl,i=St(e)?void 0:e._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),i===void 0?r=void 0:(r=new i(s),r._$AT(s,t,n)),n!==void 0?(t._$Co??(t._$Co=[]))[n]=r:t._$Cl=r),r!==void 0&&(e=ht(s,r._$AS(s,e.values),r,n)),e}var bs=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:n}=this._$AD,r=(e?.creationScope??nt).importNode(t,!0);rt.currentNode=r;let i=rt.nextNode(),o=0,l=0,a=n[0];for(;a!==void 0;){if(o===a.index){let u;a.type===2?u=new Tt(i,i.nextSibling,this,e):a.type===1?u=new a.ctor(i,a.name,a.strings,this,e):a.type===6&&(u=new _s(i,this,e)),this._$AV.push(u),a=n[++l]}o!==a?.index&&(i=rt.nextNode(),o++)}return rt.currentNode=nt,r}p(e){let t=0;for(let n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(e,n,t),t+=n.strings.length-2):n._$AI(e[t])),t++}},Tt=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,n,r){this.type=2,this._$AH=ce,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ht(this,e,t),St(e)?e===ce||e==null||e===""?(this._$AH!==ce&&this._$AR(),this._$AH=ce):e!==this._$AH&&e!==it&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Fn(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==ce&&St(this._$AH)?this._$AA.nextSibling.data=e:this.T(nt.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:n}=e,r=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=$t.createElement(gr(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===r)this._$AH.p(t);else{let i=new bs(r,this),o=i.u(this.options);i.p(t),this.T(o),this._$AH=i}}_$AC(e){let t=ur.get(e.strings);return t===void 0&&ur.set(e.strings,t=new $t(e)),t}k(e){vs(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,n,r=0;for(let i of e)r===t.length?t.push(n=new s(this.O(At()),this.O(At()),this,this.options)):n=t[r],n._$AI(i),r++;r<t.length&&(this._$AR(n&&n._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let n=e.nextSibling;e.remove(),e=n}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},gt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,r,i){this.type=1,this._$AH=ce,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=i,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=ce}_$AI(e,t=this,n,r){let i=this.strings,o=!1;if(i===void 0)e=ht(this,e,t,0),o=!St(e)||e!==this._$AH&&e!==it,o&&(this._$AH=e);else{let l=e,a,u;for(e=i[0],a=0;a<i.length-1;a++)u=ht(this,l[n+a],t,a),u===it&&(u=this._$AH[a]),o||(o=!St(u)||u!==this._$AH[a]),u===ce?e=ce:e!==ce&&(e+=(u??"")+i[a+1]),this._$AH[a]=u}o&&!r&&this.j(e)}j(e){e===ce?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ys=class extends gt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===ce?void 0:e}},ws=class extends gt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==ce)}},ks=class extends gt{constructor(e,t,n,r,i){super(e,t,n,r,i),this.type=5}_$AI(e,t=this){if((e=ht(this,e,t,0)??ce)===it)return;let n=this._$AH,r=e===ce&&n!==ce||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,i=e!==ce&&(n===ce||r);r&&this.element.removeEventListener(this.name,this,n),i&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},_s=class{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){ht(this,e)}};var Bn=xt.litHtmlPolyfillSupport;Bn?.($t,Tt),(xt.litHtmlVersions??(xt.litHtmlVersions=[])).push("3.3.1");var fe=(s,e,t)=>{let n=t?.renderBefore??e,r=n._$litPart$;if(r===void 0){let i=t?.renderBefore??null;n._$litPart$=r=new Tt(e.insertBefore(At(),i),i,void 0,t??{})}return r._$AI(s),r};function De(s,e){let t=s.priority??2,n=e.priority??2;if(t!==n)return t-n;let r=s.created_at??0,i=e.created_at??0;if(r!==i)return r<i?-1:1;let o=s.id,l=e.id;return o<l?-1:o>l?1:0}function mt(s,e){let t=s.closed_at??0,n=e.closed_at??0;if(t!==n)return t<n?1:-1;let r=s?.id,i=e?.id;return r<i?-1:r>i?1:0}function Ye(s=void 0){function e(i){return!s||typeof s.snapshotFor!="function"?[]:s.snapshotFor(i).slice().sort(De)}function t(i,o){let l=s&&s.snapshotFor?s.snapshotFor(i).slice():[];return o==="in_progress"?l.sort(De):o==="closed"?l.sort(mt):l.sort(De),l}function n(i){if(!s||typeof s.snapshotFor!="function")return[];let l=(s.snapshotFor(`detail:${i}`)||[]).find(u=>String(u?.id||"")===String(i));return(Array.isArray(l?.dependents)?l.dependents:[]).slice().sort(De)}function r(i){return s&&typeof s.subscribe=="function"?s.subscribe(i):()=>{}}return{selectIssuesFor:e,selectBoardColumn:t,selectEpicChildren:n,subscribe:r}}var _r=On(kr(),1);function ee(s){return(0,_r.default)(`queenui:${s}`)}function vr(s){let e=ee("data");async function t(n){let{id:r}=n;e("updateIssue %s %o",r,Object.keys(n));let i=null;return typeof n.title=="string"&&(i=await s("edit-text",{id:r,field:"title",value:n.title})),typeof n.acceptance=="string"&&(i=await s("edit-text",{id:r,field:"acceptance",value:n.acceptance})),typeof n.notes=="string"&&(i=await s("edit-text",{id:r,field:"notes",value:n.notes})),typeof n.design=="string"&&(i=await s("edit-text",{id:r,field:"design",value:n.design})),typeof n.status=="string"&&(i=await s("update-status",{id:r,status:n.status})),typeof n.priority=="number"&&(i=await s("update-priority",{id:r,priority:n.priority})),typeof n.assignee=="string"&&(i=await s("update-assignee",{id:r,assignee:n.assignee})),e("updateIssue done %s",r),i}return{updateIssue:t}}function As(s,e={}){let t=ee(`issue-store:${s}`),n=new Map,r=[],i=0,o=new Set,l=!1,a=e.sort||De;function u(){for(let f of Array.from(o))try{f()}catch{}}function d(){r=Array.from(n.values()).sort(a)}function p(f){if(l||!f||f.id!==s)return;let b=Number(f.revision)||0;if(t("apply %s rev=%d",f.type,b),!(b<=i&&f.type!=="snapshot")){if(f.type==="snapshot"){if(b<=i)return;n.clear();let x=Array.isArray(f.issues)?f.issues:[];for(let _ of x)_&&typeof _.id=="string"&&_.id.length>0&&n.set(_.id,_);d(),i=b,u();return}if(f.type==="upsert"){let x=f.issue;if(x&&typeof x.id=="string"&&x.id.length>0){let _=n.get(x.id);if(!_)n.set(x.id,x);else{let C=Number.isFinite(_.updated_at)?_.updated_at:0,y=Number.isFinite(x.updated_at)?x.updated_at:0;if(C<=y){for(let M of Object.keys(_))M in x||delete _[M];for(let[M,E]of Object.entries(x))_[M]=E}}d()}i=b,u()}else if(f.type==="delete"){let x=String(f.issue_id||"");x&&(n.delete(x),d()),i=b,u()}}}return{id:s,subscribe(f){return o.add(f),()=>{o.delete(f)}},applyPush:p,snapshot(){return r},size(){return n.size},getById(f){return n.get(f)},dispose(){l=!0,n.clear(),r=[],o.clear(),i=0}}}function Kt(s){let e=String(s.type||"").trim(),t={};if(s.params&&typeof s.params=="object"){let r=Object.keys(s.params).sort();for(let i of r){let o=s.params[i];t[i]=String(o)}}let n=new URLSearchParams(t).toString();return n.length>0?`${e}?${n}`:e}function xr(s){let e=ee("subs"),t=new Map,n=new Map;function r(l,a){e("applyDelta %s +%d ~%d -%d",l,(a.added||[]).length,(a.updated||[]).length,(a.removed||[]).length);let u=n.get(l);if(!u||u.size===0)return;let d=Array.isArray(a.added)?a.added:[],p=Array.isArray(a.updated)?a.updated:[],f=Array.isArray(a.removed)?a.removed:[];for(let b of Array.from(u)){let x=t.get(b);if(!x)continue;let _=x.itemsById;for(let C of d)typeof C=="string"&&C.length>0&&_.set(C,!0);for(let C of p)typeof C=="string"&&C.length>0&&_.set(C,!0);for(let C of f)typeof C=="string"&&C.length>0&&_.delete(C)}}async function i(l,a){let u=Kt(a);if(e("subscribe %s key=%s",l,u),!t.has(l))t.set(l,{key:u,itemsById:new Map});else{let p=t.get(l);if(p&&p.key!==u){let f=n.get(p.key);f&&(f.delete(l),f.size===0&&n.delete(p.key)),t.set(l,{key:u,itemsById:new Map})}}n.has(u)||n.set(u,new Set);let d=n.get(u);d&&d.add(l);try{await s("subscribe-list",{id:l,type:a.type,params:a.params})}catch(p){let f=t.get(l)||null;if(f){let b=n.get(f.key);b&&(b.delete(l),b.size===0&&n.delete(f.key))}throw t.delete(l),p}return async()=>{e("unsubscribe %s key=%s",l,u);try{await s("unsubscribe-list",{id:l})}catch{}let p=t.get(l)||null;if(p){let f=n.get(p.key);f&&(f.delete(l),f.size===0&&n.delete(p.key))}t.delete(l)}}return{subscribeList:i,_applyDelta:r,_subKeyOf:Kt,selectors:{getIds(l){let a=t.get(l);return a?Array.from(a.itemsById.keys()):[]},has(l,a){let u=t.get(l);return u?u.itemsById.has(a):!1},count(l){let a=t.get(l);return a?a.itemsById.size:0},getItemsById(l){let a=t.get(l),u={};if(!a)return u;for(let d of a.itemsById.keys())u[d]=!0;return u}}}}function Ar(){let s=ee("issue-stores"),e=new Map,t=new Map,n=new Set,r=new Map;function i(){for(let a of Array.from(n))try{a()}catch{}}function o(a,u,d){let p=u?Kt(u):"",f=t.get(a)||"",b=e.has(a);if(s("register %s key=%s (prev=%s)",a,p,f),b&&f&&p&&f!==p){let x=e.get(a);if(x)try{x.dispose()}catch{}let _=r.get(a);if(_){try{_()}catch{}r.delete(a)}let C=As(a,d);e.set(a,C);let y=C.subscribe(()=>i());r.set(a,y)}else if(!b){let x=As(a,d);e.set(a,x);let _=x.subscribe(()=>i());r.set(a,_)}return t.set(a,p),()=>l(a)}function l(a){s("unregister %s",a),t.delete(a);let u=e.get(a);u&&(u.dispose(),e.delete(a));let d=r.get(a);if(d){try{d()}catch{}r.delete(a)}}return{register:o,unregister:l,getStore(a){return e.get(a)||null},snapshotFor(a){let u=e.get(a);return u?u.snapshot().slice():[]},subscribe(a){return n.add(a),()=>n.delete(a)}}}function Xe(s,e){return`#/${s==="epics"||s==="board"?s:"issues"}?issue=${encodeURIComponent(e)}`}function Yt(s){let e=String(s||""),t=e.startsWith("#")?e.slice(1):e,n=t.indexOf("?"),r=n>=0?t.slice(n+1):"";if(r){let l=new URLSearchParams(r).get("issue");if(l)return decodeURIComponent(l)}let i=/^\/issue\/([^\s?#]+)/.exec(t);return i&&i[1]?decodeURIComponent(i[1]):null}function Ss(s){let e=String(s||"");return/^#\/epics(\b|\/|$)/.test(e)?"epics":/^#\/board(\b|\/|$)/.test(e)?"board":/^#\/messages(\b|\/|$)/.test(e)?"messages":/^#\/assignments(\b|\/|$)/.test(e)?"assignments":"issues"}function Sr(s){let e=ee("router"),t=()=>{let n=window.location.hash||"",r=/^#\/issue\/([^\s?#]+)/.exec(n);if(r&&r[1]){let l=decodeURIComponent(r[1]);s.setState({selected_id:l,view:"issues"});let a=`#/issues?issue=${encodeURIComponent(l)}`;if(window.location.hash!==a){window.location.hash=a;return}}let i=Yt(n),o=Ss(n);e("hash change \u2192 view=%s id=%s",o,i),s.setState({selected_id:i,view:o})};return{start(){window.addEventListener("hashchange",t),t()},stop(){window.removeEventListener("hashchange",t)},gotoIssue(n){let i=(s.getState?s.getState():{view:"issues"}).view||"issues",o=Xe(i,n);e("goto issue %s (view=%s)",n,i),window.location.hash!==o?window.location.hash=o:s.setState({selected_id:n,view:i})},gotoView(n){let i=(s.getState?s.getState():{selected_id:null}).selected_id,o=i?Xe(n,i):`#/${n}`;e("goto view %s (id=%s)",n,i||""),window.location.hash!==o?window.location.hash=o:s.setState({view:n,selected_id:null})}}}function $r(s={}){let e=ee("state"),t={selected_id:s.selected_id??null,view:s.view??"issues",filters:{status:s.filters?.status??"all",search:s.filters?.search??"",type:typeof s.filters?.type=="string"?s.filters?.type:""},board:{closed_filter:s.board?.closed_filter==="3"||s.board?.closed_filter==="7"||s.board?.closed_filter==="today"?s.board?.closed_filter:"today"}},n=new Set;function r(){for(let i of Array.from(n))try{i(t)}catch{}}return{getState(){return t},setState(i){let o={...t,...i,filters:{...t.filters,...i.filters||{}},board:{...t.board,...i.board||{}}};o.selected_id===t.selected_id&&o.view===t.view&&o.filters.status===t.filters.status&&o.filters.search===t.filters.search&&o.filters.type===t.filters.type&&o.board.closed_filter===t.board.closed_filter||(t=o,e("state change %o",{selected_id:t.selected_id,view:t.view,filters:t.filters,board:t.board}),r())},subscribe(i){return n.add(i),()=>n.delete(i)}}}function Tr(s){let e=0;function t(){if(!s)return;let o=e>0;s.toggleAttribute("hidden",!o),s.setAttribute("aria-busy",o?"true":"false")}function n(){e+=1,t()}function r(){e=Math.max(0,e-1),t()}function i(o){return async(l,a)=>{n();try{return await o(l,a)}finally{r()}}}return t(),{wrapSend:i,start:n,done:r,getCount:()=>e}}function ye(s,e="info",t=2800){let n=document.createElement("div");n.className="toast",n.textContent=s,n.style.position="fixed",n.style.right="12px",n.style.bottom="12px",n.style.zIndex="1000",n.style.color="#fff",n.style.padding="8px 10px",n.style.borderRadius="4px",n.style.fontSize="12px",e==="success"?n.style.background="#156d36":e==="error"?n.style.background="#9f2011":n.style.background="rgba(0,0,0,0.85)",(document.body||document.documentElement).appendChild(n),setTimeout(()=>{try{n.remove()}catch{}},t)}function Qe(s,e){let t=typeof e?.duration_ms=="number"?e.duration_ms:1200,n=document.createElement("button");n.className=(e?.class_name?e.class_name+" ":"")+"mono id-copy",n.type="button",n.setAttribute("aria-live","polite"),n.setAttribute("title","Copy issue ID"),n.setAttribute("aria-label",`Copy issue ID ${s}`),n.textContent=s;async function r(){try{navigator.clipboard&&typeof navigator.clipboard.writeText=="function"&&await navigator.clipboard.writeText(String(s)),n.textContent="Copied";let i=n.getAttribute("aria-label")||"";n.setAttribute("aria-label","Copied"),setTimeout(()=>{n.textContent=s,n.setAttribute("aria-label",i)},Math.max(80,t))}catch{}}return n.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),r()}),n.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),i.stopPropagation(),r())}),n}var Je=["Critical","High","Medium","Low","Backlog"];function Er(s){let e=typeof s=="number"?s:2,t=document.createElement("span");t.className="priority-badge",t.classList.add(`is-p${Math.max(0,Math.min(4,e))}`),t.setAttribute("role","img");let n=Jn(e);return t.setAttribute("title",n),t.setAttribute("aria-label",`Priority: ${n}`),t.textContent=Et(e)+" "+n,t}function Jn(s){let e=Math.max(0,Math.min(4,s));return Je[e]||"Medium"}function Et(s){switch(s){case 0:return"\u{1F525}";case 1:return"\u26A1\uFE0F";case 2:return"\u{1F527}";case 3:return"\u{1FAB6}";case 4:return"\u{1F4A4}";default:return"\u{1F527}"}}function at(s){let e=document.createElement("span");e.className="type-badge";let t=(s||"").toString().toLowerCase(),n=new Set(["bug","feature","task","epic","chore"]),r=n.has(t)?t:"neutral";e.classList.add(`type-badge--${r}`),e.setAttribute("role","img");let i=n.has(t)?t==="bug"?"Bug":t==="feature"?"Feature":t==="task"?"Task":t==="epic"?"Epic":"Chore":"\u2014";return e.setAttribute("aria-label",n.has(t)?`Issue type: ${i}`:"Issue type: unknown"),e.setAttribute("title",n.has(t)?`Type: ${i}`:"Type: unknown"),e.textContent=i,e}function Cr(s,e,t,n,r=void 0,i=void 0){let o=ee("views:board"),l=[],a=[],u=[],d=[],p=[],f=i?Ye(i):null,b="today";if(n)try{let w=n.getState(),k=w&&w.board?String(w.board.closed_filter||"today"):"today";(k==="today"||k==="3"||k==="7")&&(b=k)}catch{}function x(){return T`
      <div class="panel__body board-root">
        ${_("Blocked","blocked-col",a)}
        ${_("Ready","ready-col",l)}
        ${_("In Progress","in-progress-col",u)}
        ${_("Closed","closed-col",d)}
      </div>
    `}function _(w,k,R){let I=Array.isArray(R)?R.length:0,L=I===1?"1 issue":`${I} issues`;return T`
      <section class="board-column" id=${k}>
        <header
          class="board-column__header"
          id=${k+"-header"}
          role="heading"
          aria-level="2"
        >
          <div class="board-column__title">
            <span class="board-column__title-text">${w}</span>
            <span class="badge board-column__count" aria-label=${L}>
              ${I}
            </span>
          </div>
          ${k==="closed-col"?T`<label class="board-closed-filter">
                <span class="visually-hidden">Filter closed issues</span>
                <select
                  id="closed-filter"
                  aria-label="Filter closed issues"
                  @change=${S}
                >
                  <option
                    value="today"
                    ?selected=${b==="today"}
                  >
                    Today
                  </option>
                  <option value="3" ?selected=${b==="3"}>
                    Last 3 days
                  </option>
                  <option value="7" ?selected=${b==="7"}>
                    Last 7 days
                  </option>
                </select>
              </label>`:""}
        </header>
        <div
          class="board-column__body"
          role="list"
          aria-labelledby=${k+"-header"}
        >
          ${R.map(z=>C(z))}
        </div>
      </section>
    `}function C(w){return T`
      <article
        class="board-card"
        data-issue-id=${w.id}
        role="listitem"
        tabindex="-1"
        @click=${()=>t(w.id)}
      >
        <div class="board-card__title text-truncate">
          ${w.title||"(no title)"}
        </div>
        <div class="board-card__meta">
          ${at(w.issue_type)} ${Er(w.priority)}
          ${Qe(w.id,{class_name:"mono"})}
        </div>
      </article>
    `}function y(){fe(x(),s),M()}function M(){try{let w=Array.from(s.querySelectorAll(".board-column"));for(let k of w){let R=k.querySelector(".board-column__body");if(!R)continue;let I=Array.from(R.querySelectorAll(".board-card")),L=k.querySelector(".board-column__header"),z=L&&L.textContent?.trim()||"";for(let j of I){let V=j.querySelector(".board-card__title"),Q=V&&V.textContent?.trim()||"";j.setAttribute("aria-label",`Issue ${Q||"(no title)"} \u2014 Column ${z}`),j.tabIndex=-1}I.length>0&&(I[0].tabIndex=0)}}catch{}}s.addEventListener("keydown",w=>{let k=w.target;if(!k||!(k instanceof HTMLElement))return;let R=String(k.tagName||"").toLowerCase();if(R==="input"||R==="textarea"||R==="select"||k.isContentEditable===!0)return;let I=k.closest(".board-card");if(!I)return;let L=String(w.key||"");if(L==="Enter"||L===" "){w.preventDefault();let Z=I.getAttribute("data-issue-id");Z&&t(Z);return}if(L!=="ArrowUp"&&L!=="ArrowDown"&&L!=="ArrowLeft"&&L!=="ArrowRight")return;w.preventDefault();let z=I.closest(".board-column");if(!z)return;let j=z.querySelector(".board-column__body");if(!j)return;let V=Array.from(j.querySelectorAll(".board-card")),Q=V.indexOf(I);if(Q!==-1){if(L==="ArrowDown"&&Q<V.length-1){E(V[Q],V[Q+1]);return}if(L==="ArrowUp"&&Q>0){E(V[Q],V[Q-1]);return}if(L==="ArrowRight"||L==="ArrowLeft"){let Z=Array.from(s.querySelectorAll(".board-column")),ie=Z.indexOf(z);if(ie===-1)return;let re=L==="ArrowRight"?1:-1,de=ie+re,oe=null;for(;de>=0&&de<Z.length;){let B=Z[de],Te=B.querySelector(".board-column__body");if((Te?Array.from(Te.querySelectorAll(".board-card")):[]).length>0){oe=B;break}de+=re}if(oe){let B=oe.querySelector(".board-column__body .board-card");B&&E(I,B)}return}}});function E(w,k){try{w.tabIndex=-1,k.tabIndex=0,k.focus()}catch{}}function v(){o("applyClosedFilter %s",b);let w=Array.isArray(p)?[...p]:[],k=new Date,R=0;b==="today"?R=new Date(k.getFullYear(),k.getMonth(),k.getDate(),0,0,0,0).getTime():b==="3"?R=k.getTime()-4320*60*1e3:b==="7"&&(R=k.getTime()-10080*60*1e3),w=w.filter(I=>{let L=Number.isFinite(I.closed_at)?I.closed_at:NaN;return Number.isFinite(L)?L>=R:!1}),w.sort(mt),d=w}function S(w){try{let k=w.target,R=String(k.value||"today");if(b=R==="3"||R==="7"?R:"today",o("closed filter %s",b),n)try{n.setState({board:{closed_filter:b}})}catch{}v(),y()}catch{}}function m(){try{if(f){let w=f.selectBoardColumn("tab:board:in-progress","in_progress"),k=f.selectBoardColumn("tab:board:blocked","blocked"),R=f.selectBoardColumn("tab:board:ready","ready"),I=f.selectBoardColumn("tab:board:closed","closed"),L=new Set(w.map(j=>j.id));l=R.filter(j=>!L.has(j.id)),a=k,u=w,p=I}v(),y()}catch{l=[],a=[],u=[],d=[],y()}}return f&&f.subscribe(()=>{try{m()}catch{}}),{async load(){o("load"),m();try{let w=!!(r&&r.selectors),k=z=>{if(!w||!r)return 0;let j=r.selectors;if(typeof j.count=="function")return Number(j.count(z)||0);try{let V=j.getIds(z);return Array.isArray(V)?V.length:0}catch{return 0}},R=k("tab:board:ready")+k("tab:board:blocked")+k("tab:board:in-progress")+k("tab:board:closed"),I=e,L=I&&typeof I.getReady=="function"&&typeof I.getBlocked=="function"&&typeof I.getInProgress=="function"&&typeof I.getClosed=="function";if(R===0&&L){o("fallback fetch");let[z,j,V,Q]=await Promise.all([I.getReady().catch(()=>[]),I.getBlocked().catch(()=>[]),I.getInProgress().catch(()=>[]),I.getClosed().catch(()=>[])]),Z=Array.isArray(z)?z.map(B=>B):[],ie=Array.isArray(j)?j.map(B=>B):[],re=Array.isArray(V)?V.map(B=>B):[],de=Array.isArray(Q)?Q.map(B=>B):[],oe=new Set(re.map(B=>B.id));Z=Z.filter(B=>!oe.has(B.id)),Z.sort(De),ie.sort(De),re.sort(De),l=Z,a=ie,u=re,p=de,v(),y()}}catch{}},clear(){s.replaceChildren(),l=[],a=[],u=[],d=[]}}}var{entries:Fr,setPrototypeOf:Rr,isFrozen:ei,getPrototypeOf:ti,getOwnPropertyDescriptor:si}=Object,{freeze:ve,seal:Ie,create:Ls}=Object,{apply:Ds,construct:Ms}=typeof Reflect<"u"&&Reflect;ve||(ve=function(e){return e});Ie||(Ie=function(e){return e});Ds||(Ds=function(e,t){for(var n=arguments.length,r=new Array(n>2?n-2:0),i=2;i<n;i++)r[i-2]=arguments[i];return e.apply(t,r)});Ms||(Ms=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return new e(...n)});var Xt=xe(Array.prototype.forEach),ri=xe(Array.prototype.lastIndexOf),Ir=xe(Array.prototype.pop),Ct=xe(Array.prototype.push),ni=xe(Array.prototype.splice),Jt=xe(String.prototype.toLowerCase),$s=xe(String.prototype.toString),Ts=xe(String.prototype.match),Rt=xe(String.prototype.replace),ii=xe(String.prototype.indexOf),oi=xe(String.prototype.trim),Me=xe(Object.prototype.hasOwnProperty),_e=xe(RegExp.prototype.test),It=ai(TypeError);function xe(s){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var t=arguments.length,n=new Array(t>1?t-1:0),r=1;r<t;r++)n[r-1]=arguments[r];return Ds(s,e,n)}}function ai(s){return function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return Ms(s,t)}}function W(s,e){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:Jt;Rr&&Rr(s,null);let n=e.length;for(;n--;){let r=e[n];if(typeof r=="string"){let i=t(r);i!==r&&(ei(e)||(e[n]=i),r=i)}s[r]=!0}return s}function li(s){for(let e=0;e<s.length;e++)Me(s,e)||(s[e]=null);return s}function He(s){let e=Ls(null);for(let[t,n]of Fr(s))Me(s,t)&&(Array.isArray(n)?e[t]=li(n):n&&typeof n=="object"&&n.constructor===Object?e[t]=He(n):e[t]=n);return e}function Lt(s,e){for(;s!==null;){let n=si(s,e);if(n){if(n.get)return xe(n.get);if(typeof n.value=="function")return xe(n.value)}s=ti(s)}function t(){return null}return t}var Lr=ve(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Es=ve(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Cs=ve(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),ci=ve(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Rs=ve(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),di=ve(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Dr=ve(["#text"]),Mr=ve(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),Is=ve(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),Nr=ve(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),Qt=ve(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),ui=Ie(/\{\{[\w\W]*|[\w\W]*\}\}/gm),pi=Ie(/<%[\w\W]*|[\w\W]*%>/gm),fi=Ie(/\$\{[\w\W]*/gm),hi=Ie(/^data-[\-\w.\u00B7-\uFFFF]+$/),gi=Ie(/^aria-[\-\w]+$/),zr=Ie(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),mi=Ie(/^(?:\w+script|data):/i),bi=Ie(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),Br=Ie(/^html$/i),yi=Ie(/^[a-z][.\w]*(-[.\w]+)+$/i),Or=Object.freeze({__proto__:null,ARIA_ATTR:gi,ATTR_WHITESPACE:bi,CUSTOM_ELEMENT:yi,DATA_ATTR:hi,DOCTYPE_NAME:Br,ERB_EXPR:pi,IS_ALLOWED_URI:zr,IS_SCRIPT_OR_DATA:mi,MUSTACHE_EXPR:ui,TMPLIT_EXPR:fi}),Dt={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,progressingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},wi=function(){return typeof window>"u"?null:window},ki=function(e,t){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let n=null,r="data-tt-policy-suffix";t&&t.hasAttribute(r)&&(n=t.getAttribute(r));let i="dompurify"+(n?"#"+n:"");try{return e.createPolicy(i,{createHTML(o){return o},createScriptURL(o){return o}})}catch{return console.warn("TrustedTypes policy "+i+" could not be created."),null}},Pr=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}};function Hr(){let s=arguments.length>0&&arguments[0]!==void 0?arguments[0]:wi(),e=F=>Hr(F);if(e.version="3.3.1",e.removed=[],!s||!s.document||s.document.nodeType!==Dt.document||!s.Element)return e.isSupported=!1,e;let{document:t}=s,n=t,r=n.currentScript,{DocumentFragment:i,HTMLTemplateElement:o,Node:l,Element:a,NodeFilter:u,NamedNodeMap:d=s.NamedNodeMap||s.MozNamedAttrMap,HTMLFormElement:p,DOMParser:f,trustedTypes:b}=s,x=a.prototype,_=Lt(x,"cloneNode"),C=Lt(x,"remove"),y=Lt(x,"nextSibling"),M=Lt(x,"childNodes"),E=Lt(x,"parentNode");if(typeof o=="function"){let F=t.createElement("template");F.content&&F.content.ownerDocument&&(t=F.content.ownerDocument)}let v,S="",{implementation:m,createNodeIterator:w,createDocumentFragment:k,getElementsByTagName:R}=t,{importNode:I}=n,L=Pr();e.isSupported=typeof Fr=="function"&&typeof E=="function"&&m&&m.createHTMLDocument!==void 0;let{MUSTACHE_EXPR:z,ERB_EXPR:j,TMPLIT_EXPR:V,DATA_ATTR:Q,ARIA_ATTR:Z,IS_SCRIPT_OR_DATA:ie,ATTR_WHITESPACE:re,CUSTOM_ELEMENT:de}=Or,{IS_ALLOWED_URI:oe}=Or,B=null,Te=W({},[...Lr,...Es,...Cs,...Rs,...Dr]),le=null,Ge=W({},[...Mr,...Is,...Nr,...Qt]),te=Object.seal(Ls(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Ee=null,Pe=null,ke=Object.seal(Ls(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}})),Fe=!0,Le=!0,ze=!1,We=!0,Ce=!1,N=!0,Re=!1,A=!1,g=!1,H=!1,U=!1,ue=!1,ge=!0,h=!1,O="user-content-",G=!0,D=!1,X={},ae=null,dt=W({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),me=null,Ht=W({},["audio","video","img","source","image","track"]),kt=null,Ut=W({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Ve="http://www.w3.org/1998/Math/MathML",ut="http://www.w3.org/2000/svg",q="http://www.w3.org/1999/xhtml",se=q,Ze=!1,qt=null,vn=W({},[Ve,ut,q],$s),jt=W({},["mi","mo","mn","ms","mtext"]),Gt=W({},["annotation-xml"]),xn=W({},["title","style","font","a","script"]),_t=null,An=["application/xhtml+xml","text/html"],Sn="text/html",he=null,pt=null,$n=t.createElement("form"),Zs=function(c){return c instanceof RegExp||c instanceof Function},us=function(){let c=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!(pt&&pt===c)){if((!c||typeof c!="object")&&(c={}),c=He(c),_t=An.indexOf(c.PARSER_MEDIA_TYPE)===-1?Sn:c.PARSER_MEDIA_TYPE,he=_t==="application/xhtml+xml"?$s:Jt,B=Me(c,"ALLOWED_TAGS")?W({},c.ALLOWED_TAGS,he):Te,le=Me(c,"ALLOWED_ATTR")?W({},c.ALLOWED_ATTR,he):Ge,qt=Me(c,"ALLOWED_NAMESPACES")?W({},c.ALLOWED_NAMESPACES,$s):vn,kt=Me(c,"ADD_URI_SAFE_ATTR")?W(He(Ut),c.ADD_URI_SAFE_ATTR,he):Ut,me=Me(c,"ADD_DATA_URI_TAGS")?W(He(Ht),c.ADD_DATA_URI_TAGS,he):Ht,ae=Me(c,"FORBID_CONTENTS")?W({},c.FORBID_CONTENTS,he):dt,Ee=Me(c,"FORBID_TAGS")?W({},c.FORBID_TAGS,he):He({}),Pe=Me(c,"FORBID_ATTR")?W({},c.FORBID_ATTR,he):He({}),X=Me(c,"USE_PROFILES")?c.USE_PROFILES:!1,Fe=c.ALLOW_ARIA_ATTR!==!1,Le=c.ALLOW_DATA_ATTR!==!1,ze=c.ALLOW_UNKNOWN_PROTOCOLS||!1,We=c.ALLOW_SELF_CLOSE_IN_ATTR!==!1,Ce=c.SAFE_FOR_TEMPLATES||!1,N=c.SAFE_FOR_XML!==!1,Re=c.WHOLE_DOCUMENT||!1,H=c.RETURN_DOM||!1,U=c.RETURN_DOM_FRAGMENT||!1,ue=c.RETURN_TRUSTED_TYPE||!1,g=c.FORCE_BODY||!1,ge=c.SANITIZE_DOM!==!1,h=c.SANITIZE_NAMED_PROPS||!1,G=c.KEEP_CONTENT!==!1,D=c.IN_PLACE||!1,oe=c.ALLOWED_URI_REGEXP||zr,se=c.NAMESPACE||q,jt=c.MATHML_TEXT_INTEGRATION_POINTS||jt,Gt=c.HTML_INTEGRATION_POINTS||Gt,te=c.CUSTOM_ELEMENT_HANDLING||{},c.CUSTOM_ELEMENT_HANDLING&&Zs(c.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(te.tagNameCheck=c.CUSTOM_ELEMENT_HANDLING.tagNameCheck),c.CUSTOM_ELEMENT_HANDLING&&Zs(c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(te.attributeNameCheck=c.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),c.CUSTOM_ELEMENT_HANDLING&&typeof c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements=="boolean"&&(te.allowCustomizedBuiltInElements=c.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),Ce&&(Le=!1),U&&(H=!0),X&&(B=W({},Dr),le=[],X.html===!0&&(W(B,Lr),W(le,Mr)),X.svg===!0&&(W(B,Es),W(le,Is),W(le,Qt)),X.svgFilters===!0&&(W(B,Cs),W(le,Is),W(le,Qt)),X.mathMl===!0&&(W(B,Rs),W(le,Nr),W(le,Qt))),c.ADD_TAGS&&(typeof c.ADD_TAGS=="function"?ke.tagCheck=c.ADD_TAGS:(B===Te&&(B=He(B)),W(B,c.ADD_TAGS,he))),c.ADD_ATTR&&(typeof c.ADD_ATTR=="function"?ke.attributeCheck=c.ADD_ATTR:(le===Ge&&(le=He(le)),W(le,c.ADD_ATTR,he))),c.ADD_URI_SAFE_ATTR&&W(kt,c.ADD_URI_SAFE_ATTR,he),c.FORBID_CONTENTS&&(ae===dt&&(ae=He(ae)),W(ae,c.FORBID_CONTENTS,he)),c.ADD_FORBID_CONTENTS&&(ae===dt&&(ae=He(ae)),W(ae,c.ADD_FORBID_CONTENTS,he)),G&&(B["#text"]=!0),Re&&W(B,["html","head","body"]),B.table&&(W(B,["tbody"]),delete Ee.tbody),c.TRUSTED_TYPES_POLICY){if(typeof c.TRUSTED_TYPES_POLICY.createHTML!="function")throw It('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof c.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw It('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');v=c.TRUSTED_TYPES_POLICY,S=v.createHTML("")}else v===void 0&&(v=ki(b,r)),v!==null&&typeof S=="string"&&(S=v.createHTML(""));ve&&ve(c),pt=c}},Ks=W({},[...Es,...Cs,...ci]),Ys=W({},[...Rs,...di]),Tn=function(c){let $=E(c);(!$||!$.tagName)&&($={namespaceURI:se,tagName:"template"});let P=Jt(c.tagName),ne=Jt($.tagName);return qt[c.namespaceURI]?c.namespaceURI===ut?$.namespaceURI===q?P==="svg":$.namespaceURI===Ve?P==="svg"&&(ne==="annotation-xml"||jt[ne]):!!Ks[P]:c.namespaceURI===Ve?$.namespaceURI===q?P==="math":$.namespaceURI===ut?P==="math"&&Gt[ne]:!!Ys[P]:c.namespaceURI===q?$.namespaceURI===ut&&!Gt[ne]||$.namespaceURI===Ve&&!jt[ne]?!1:!Ys[P]&&(xn[P]||!Ks[P]):!!(_t==="application/xhtml+xml"&&qt[c.namespaceURI]):!1},Be=function(c){Ct(e.removed,{element:c});try{E(c).removeChild(c)}catch{C(c)}},tt=function(c,$){try{Ct(e.removed,{attribute:$.getAttributeNode(c),from:$})}catch{Ct(e.removed,{attribute:null,from:$})}if($.removeAttribute(c),c==="is")if(H||U)try{Be($)}catch{}else try{$.setAttribute(c,"")}catch{}},Xs=function(c){let $=null,P=null;if(g)c="<remove></remove>"+c;else{let pe=Ts(c,/^[\r\n\t ]+/);P=pe&&pe[0]}_t==="application/xhtml+xml"&&se===q&&(c='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+c+"</body></html>");let ne=v?v.createHTML(c):c;if(se===q)try{$=new f().parseFromString(ne,_t)}catch{}if(!$||!$.documentElement){$=m.createDocument(se,"template",null);try{$.documentElement.innerHTML=Ze?S:ne}catch{}}let we=$.body||$.documentElement;return c&&P&&we.insertBefore(t.createTextNode(P),we.childNodes[0]||null),se===q?R.call($,Re?"html":"body")[0]:Re?$.documentElement:we},Qs=function(c){return w.call(c.ownerDocument||c,c,u.SHOW_ELEMENT|u.SHOW_COMMENT|u.SHOW_TEXT|u.SHOW_PROCESSING_INSTRUCTION|u.SHOW_CDATA_SECTION,null)},ps=function(c){return c instanceof p&&(typeof c.nodeName!="string"||typeof c.textContent!="string"||typeof c.removeChild!="function"||!(c.attributes instanceof d)||typeof c.removeAttribute!="function"||typeof c.setAttribute!="function"||typeof c.namespaceURI!="string"||typeof c.insertBefore!="function"||typeof c.hasChildNodes!="function")},Js=function(c){return typeof l=="function"&&c instanceof l};function Ue(F,c,$){Xt(F,P=>{P.call(e,c,$,pt)})}let er=function(c){let $=null;if(Ue(L.beforeSanitizeElements,c,null),ps(c))return Be(c),!0;let P=he(c.nodeName);if(Ue(L.uponSanitizeElement,c,{tagName:P,allowedTags:B}),N&&c.hasChildNodes()&&!Js(c.firstElementChild)&&_e(/<[/\w!]/g,c.innerHTML)&&_e(/<[/\w!]/g,c.textContent)||c.nodeType===Dt.progressingInstruction||N&&c.nodeType===Dt.comment&&_e(/<[/\w]/g,c.data))return Be(c),!0;if(!(ke.tagCheck instanceof Function&&ke.tagCheck(P))&&(!B[P]||Ee[P])){if(!Ee[P]&&sr(P)&&(te.tagNameCheck instanceof RegExp&&_e(te.tagNameCheck,P)||te.tagNameCheck instanceof Function&&te.tagNameCheck(P)))return!1;if(G&&!ae[P]){let ne=E(c)||c.parentNode,we=M(c)||c.childNodes;if(we&&ne){let pe=we.length;for(let Se=pe-1;Se>=0;--Se){let qe=_(we[Se],!0);qe.__removalCount=(c.__removalCount||0)+1,ne.insertBefore(qe,y(c))}}}return Be(c),!0}return c instanceof a&&!Tn(c)||(P==="noscript"||P==="noembed"||P==="noframes")&&_e(/<\/no(script|embed|frames)/i,c.innerHTML)?(Be(c),!0):(Ce&&c.nodeType===Dt.text&&($=c.textContent,Xt([z,j,V],ne=>{$=Rt($,ne," ")}),c.textContent!==$&&(Ct(e.removed,{element:c.cloneNode()}),c.textContent=$)),Ue(L.afterSanitizeElements,c,null),!1)},tr=function(c,$,P){if(ge&&($==="id"||$==="name")&&(P in t||P in $n))return!1;if(!(Le&&!Pe[$]&&_e(Q,$))){if(!(Fe&&_e(Z,$))){if(!(ke.attributeCheck instanceof Function&&ke.attributeCheck($,c))){if(!le[$]||Pe[$]){if(!(sr(c)&&(te.tagNameCheck instanceof RegExp&&_e(te.tagNameCheck,c)||te.tagNameCheck instanceof Function&&te.tagNameCheck(c))&&(te.attributeNameCheck instanceof RegExp&&_e(te.attributeNameCheck,$)||te.attributeNameCheck instanceof Function&&te.attributeNameCheck($,c))||$==="is"&&te.allowCustomizedBuiltInElements&&(te.tagNameCheck instanceof RegExp&&_e(te.tagNameCheck,P)||te.tagNameCheck instanceof Function&&te.tagNameCheck(P))))return!1}else if(!kt[$]){if(!_e(oe,Rt(P,re,""))){if(!(($==="src"||$==="xlink:href"||$==="href")&&c!=="script"&&ii(P,"data:")===0&&me[c])){if(!(ze&&!_e(ie,Rt(P,re,"")))){if(P)return!1}}}}}}}return!0},sr=function(c){return c!=="annotation-xml"&&Ts(c,de)},rr=function(c){Ue(L.beforeSanitizeAttributes,c,null);let{attributes:$}=c;if(!$||ps(c))return;let P={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:le,forceKeepAttr:void 0},ne=$.length;for(;ne--;){let we=$[ne],{name:pe,namespaceURI:Se,value:qe}=we,ft=he(pe),fs=qe,be=pe==="value"?fs:oi(fs);if(P.attrName=ft,P.attrValue=be,P.keepAttr=!0,P.forceKeepAttr=void 0,Ue(L.uponSanitizeAttribute,c,P),be=P.attrValue,h&&(ft==="id"||ft==="name")&&(tt(pe,c),be=O+be),N&&_e(/((--!?|])>)|<\/(style|title|textarea)/i,be)){tt(pe,c);continue}if(ft==="attributename"&&Ts(be,"href")){tt(pe,c);continue}if(P.forceKeepAttr)continue;if(!P.keepAttr){tt(pe,c);continue}if(!We&&_e(/\/>/i,be)){tt(pe,c);continue}Ce&&Xt([z,j,V],ir=>{be=Rt(be,ir," ")});let nr=he(c.nodeName);if(!tr(nr,ft,be)){tt(pe,c);continue}if(v&&typeof b=="object"&&typeof b.getAttributeType=="function"&&!Se)switch(b.getAttributeType(nr,ft)){case"TrustedHTML":{be=v.createHTML(be);break}case"TrustedScriptURL":{be=v.createScriptURL(be);break}}if(be!==fs)try{Se?c.setAttributeNS(Se,pe,be):c.setAttribute(pe,be),ps(c)?Be(c):Ir(e.removed)}catch{tt(pe,c)}}Ue(L.afterSanitizeAttributes,c,null)},En=function F(c){let $=null,P=Qs(c);for(Ue(L.beforeSanitizeShadowDOM,c,null);$=P.nextNode();)Ue(L.uponSanitizeShadowNode,$,null),er($),rr($),$.content instanceof i&&F($.content);Ue(L.afterSanitizeShadowDOM,c,null)};return e.sanitize=function(F){let c=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},$=null,P=null,ne=null,we=null;if(Ze=!F,Ze&&(F="<!-->"),typeof F!="string"&&!Js(F))if(typeof F.toString=="function"){if(F=F.toString(),typeof F!="string")throw It("dirty is not a string, aborting")}else throw It("toString is not a function");if(!e.isSupported)return F;if(A||us(c),e.removed=[],typeof F=="string"&&(D=!1),D){if(F.nodeName){let qe=he(F.nodeName);if(!B[qe]||Ee[qe])throw It("root node is forbidden and cannot be sanitized in-place")}}else if(F instanceof l)$=Xs("<!---->"),P=$.ownerDocument.importNode(F,!0),P.nodeType===Dt.element&&P.nodeName==="BODY"||P.nodeName==="HTML"?$=P:$.appendChild(P);else{if(!H&&!Ce&&!Re&&F.indexOf("<")===-1)return v&&ue?v.createHTML(F):F;if($=Xs(F),!$)return H?null:ue?S:""}$&&g&&Be($.firstChild);let pe=Qs(D?F:$);for(;ne=pe.nextNode();)er(ne),rr(ne),ne.content instanceof i&&En(ne.content);if(D)return F;if(H){if(U)for(we=k.call($.ownerDocument);$.firstChild;)we.appendChild($.firstChild);else we=$;return(le.shadowroot||le.shadowrootmode)&&(we=I.call(n,we,!0)),we}let Se=Re?$.outerHTML:$.innerHTML;return Re&&B["!doctype"]&&$.ownerDocument&&$.ownerDocument.doctype&&$.ownerDocument.doctype.name&&_e(Br,$.ownerDocument.doctype.name)&&(Se="<!DOCTYPE "+$.ownerDocument.doctype.name+`>
`+Se),Ce&&Xt([z,j,V],qe=>{Se=Rt(Se,qe," ")}),v&&ue?v.createHTML(Se):Se},e.setConfig=function(){let F=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};us(F),A=!0},e.clearConfig=function(){pt=null,A=!1},e.isValidAttribute=function(F,c,$){pt||us({});let P=he(F),ne=he(c);return tr(P,ne,$)},e.addHook=function(F,c){typeof c=="function"&&Ct(L[F],c)},e.removeHook=function(F,c){if(c!==void 0){let $=ri(L[F],c);return $===-1?void 0:ni(L[F],$,1)[0]}return Ir(L[F])},e.removeHooks=function(F){L[F]=[]},e.removeAllHooks=function(){L=Pr()},e}var Ur=Hr();var qr={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},jr=s=>(...e)=>({_$litDirective$:s,values:e}),es=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,n){this._$Ct=e,this._$AM=t,this._$Ci=n}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};var Mt=class extends es{constructor(e){if(super(e),this.it=ce,e.type!==qr.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===ce||e==null)return this._t=void 0,this.it=e;if(e===it)return e;if(typeof e!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;let t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}};Mt.directiveName="unsafeHTML",Mt.resultType=1;var Gr=jr(Mt);function Fs(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var ct=Fs();function Qr(s){ct=s}var Ft={exec:()=>null};function K(s,e=""){let t=typeof s=="string"?s:s.source,n={replace:(r,i)=>{let o=typeof i=="string"?i:i.source;return o=o.replace(Ae.caret,"$1"),t=t.replace(r,o),n},getRegex:()=>new RegExp(t,e)};return n}var _i=(()=>{try{return!!new RegExp("(?<=1)(?<!1)")}catch{return!1}})(),Ae={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceTabs:/^\t+/,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,unescapeTest:/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:s=>new RegExp(`^( {0,3}${s})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`),hrRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),fencesBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}(?:\`\`\`|~~~)`),headingBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}#`),htmlBeginRegex:s=>new RegExp(`^ {0,${Math.min(3,s-1)}}<(?:[a-z].*>|!--)`,"i")},vi=/^(?:[ \t]*(?:\n|$))+/,xi=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Ai=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,zt=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,Si=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,zs=/(?:[*+-]|\d{1,9}[.)])/,Jr=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,en=K(Jr).replace(/bull/g,zs).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),$i=K(Jr).replace(/bull/g,zs).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),Bs=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,Ti=/^[^\n]+/,Hs=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,Ei=K(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",Hs).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Ci=K(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,zs).getRegex(),os="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Us=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Ri=K("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Us).replace("tag",os).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),tn=K(Bs).replace("hr",zt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",os).getRegex(),Ii=K(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",tn).getRegex(),qs={blockquote:Ii,code:xi,def:Ei,fences:Ai,heading:Si,hr:zt,html:Ri,lheading:en,list:Ci,newline:vi,paragraph:tn,table:Ft,text:Ti},Wr=K("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",zt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",os).getRegex(),Li={...qs,lheading:$i,table:Wr,paragraph:K(Bs).replace("hr",zt).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",Wr).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",os).getRegex()},Di={...qs,html:K(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Us).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:Ft,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:K(Bs).replace("hr",zt).replace("heading",` *#{1,6} *[^
]`).replace("lheading",en).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Mi=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Ni=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,sn=/^( {2,}|\\)\n(?!\s*$)/,Oi=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,as=/[\p{P}\p{S}]/u,js=/[\s\p{P}\p{S}]/u,rn=/[^\s\p{P}\p{S}]/u,Pi=K(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,js).getRegex(),nn=/(?!~)[\p{P}\p{S}]/u,Fi=/(?!~)[\s\p{P}\p{S}]/u,zi=/(?:[^\s\p{P}\p{S}]|~)/u,Bi=K(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",_i?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),on=/^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,Hi=K(on,"u").replace(/punct/g,as).getRegex(),Ui=K(on,"u").replace(/punct/g,nn).getRegex(),an="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",qi=K(an,"gu").replace(/notPunctSpace/g,rn).replace(/punctSpace/g,js).replace(/punct/g,as).getRegex(),ji=K(an,"gu").replace(/notPunctSpace/g,zi).replace(/punctSpace/g,Fi).replace(/punct/g,nn).getRegex(),Gi=K("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,rn).replace(/punctSpace/g,js).replace(/punct/g,as).getRegex(),Wi=K(/\\(punct)/,"gu").replace(/punct/g,as).getRegex(),Vi=K(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Zi=K(Us).replace("(?:-->|$)","-->").getRegex(),Ki=K("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Zi).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),rs=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,Yi=K(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label",rs).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),ln=K(/^!?\[(label)\]\[(ref)\]/).replace("label",rs).replace("ref",Hs).getRegex(),cn=K(/^!?\[(ref)\](?:\[\])?/).replace("ref",Hs).getRegex(),Xi=K("reflink|nolink(?!\\()","g").replace("reflink",ln).replace("nolink",cn).getRegex(),Vr=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,Gs={_backpedal:Ft,anyPunctuation:Wi,autolink:Vi,blockSkip:Bi,br:sn,code:Ni,del:Ft,emStrongLDelim:Hi,emStrongRDelimAst:qi,emStrongRDelimUnd:Gi,escape:Mi,link:Yi,nolink:cn,punctuation:Pi,reflink:ln,reflinkSearch:Xi,tag:Ki,text:Oi,url:Ft},Qi={...Gs,link:K(/^!?\[(label)\]\((.*?)\)/).replace("label",rs).getRegex(),reflink:K(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",rs).getRegex()},Ns={...Gs,emStrongRDelimAst:ji,emStrongLDelim:Ui,url:K(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",Vr).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:K(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",Vr).getRegex()},Ji={...Ns,br:K(sn).replace("{2,}","*").getRegex(),text:K(Ns.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},ts={normal:qs,gfm:Li,pedantic:Di},Nt={normal:Gs,gfm:Ns,breaks:Ji,pedantic:Qi},eo={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Zr=s=>eo[s];function je(s,e){if(e){if(Ae.escapeTest.test(s))return s.replace(Ae.escapeReplace,Zr)}else if(Ae.escapeTestNoEncode.test(s))return s.replace(Ae.escapeReplaceNoEncode,Zr);return s}function Kr(s){try{s=encodeURI(s).replace(Ae.percentDecode,"%")}catch{return null}return s}function Yr(s,e){let t=s.replace(Ae.findPipe,(i,o,l)=>{let a=!1,u=o;for(;--u>=0&&l[u]==="\\";)a=!a;return a?"|":" |"}),n=t.split(Ae.splitPipe),r=0;if(n[0].trim()||n.shift(),n.length>0&&!n.at(-1)?.trim()&&n.pop(),e)if(n.length>e)n.splice(e);else for(;n.length<e;)n.push("");for(;r<n.length;r++)n[r]=n[r].trim().replace(Ae.slashPipe,"|");return n}function Ot(s,e,t){let n=s.length;if(n===0)return"";let r=0;for(;r<n;){let i=s.charAt(n-r-1);if(i===e&&!t)r++;else if(i!==e&&t)r++;else break}return s.slice(0,n-r)}function to(s,e){if(s.indexOf(e[1])===-1)return-1;let t=0;for(let n=0;n<s.length;n++)if(s[n]==="\\")n++;else if(s[n]===e[0])t++;else if(s[n]===e[1]&&(t--,t<0))return n;return t>0?-2:-1}function Xr(s,e,t,n,r){let i=e.href,o=e.title||null,l=s[1].replace(r.other.outputLinkReplace,"$1");n.state.inLink=!0;let a={type:s[0].charAt(0)==="!"?"image":"link",raw:t,href:i,title:o,text:l,tokens:n.inlineTokens(l)};return n.state.inLink=!1,a}function so(s,e,t){let n=s.match(t.other.indentCodeCompensation);if(n===null)return e;let r=n[1];return e.split(`
`).map(i=>{let o=i.match(t.other.beginningSpace);if(o===null)return i;let[l]=o;return l.length>=r.length?i.slice(r.length):i}).join(`
`)}var ns=class{constructor(s){J(this,"options");J(this,"rules");J(this,"lexer");this.options=s||ct}space(s){let e=this.rules.block.newline.exec(s);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(s){let e=this.rules.block.code.exec(s);if(e){let t=e[0].replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:e[0],codeBlockStyle:"indented",text:this.options.pedantic?t:Ot(t,`
`)}}}fences(s){let e=this.rules.block.fences.exec(s);if(e){let t=e[0],n=so(t,e[3]||"",this.rules);return{type:"code",raw:t,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:n}}}heading(s){let e=this.rules.block.heading.exec(s);if(e){let t=e[2].trim();if(this.rules.other.endingHash.test(t)){let n=Ot(t,"#");(this.options.pedantic||!n||this.rules.other.endingSpaceChar.test(n))&&(t=n.trim())}return{type:"heading",raw:e[0],depth:e[1].length,text:t,tokens:this.lexer.inline(t)}}}hr(s){let e=this.rules.block.hr.exec(s);if(e)return{type:"hr",raw:Ot(e[0],`
`)}}blockquote(s){let e=this.rules.block.blockquote.exec(s);if(e){let t=Ot(e[0],`
`).split(`
`),n="",r="",i=[];for(;t.length>0;){let o=!1,l=[],a;for(a=0;a<t.length;a++)if(this.rules.other.blockquoteStart.test(t[a]))l.push(t[a]),o=!0;else if(!o)l.push(t[a]);else break;t=t.slice(a);let u=l.join(`
`),d=u.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");n=n?`${n}
${u}`:u,r=r?`${r}
${d}`:d;let p=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(d,i,!0),this.lexer.state.top=p,t.length===0)break;let f=i.at(-1);if(f?.type==="code")break;if(f?.type==="blockquote"){let b=f,x=b.raw+`
`+t.join(`
`),_=this.blockquote(x);i[i.length-1]=_,n=n.substring(0,n.length-b.raw.length)+_.raw,r=r.substring(0,r.length-b.text.length)+_.text;break}else if(f?.type==="list"){let b=f,x=b.raw+`
`+t.join(`
`),_=this.list(x);i[i.length-1]=_,n=n.substring(0,n.length-f.raw.length)+_.raw,r=r.substring(0,r.length-b.raw.length)+_.raw,t=x.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:n,tokens:i,text:r}}}list(s){let e=this.rules.block.list.exec(s);if(e){let t=e[1].trim(),n=t.length>1,r={type:"list",raw:"",ordered:n,start:n?+t.slice(0,-1):"",loose:!1,items:[]};t=n?`\\d{1,9}\\${t.slice(-1)}`:`\\${t}`,this.options.pedantic&&(t=n?t:"[*+-]");let i=this.rules.other.listItemRegex(t),o=!1;for(;s;){let a=!1,u="",d="";if(!(e=i.exec(s))||this.rules.block.hr.test(s))break;u=e[0],s=s.substring(u.length);let p=e[2].split(`
`,1)[0].replace(this.rules.other.listReplaceTabs,_=>" ".repeat(3*_.length)),f=s.split(`
`,1)[0],b=!p.trim(),x=0;if(this.options.pedantic?(x=2,d=p.trimStart()):b?x=e[1].length+1:(x=e[2].search(this.rules.other.nonSpaceChar),x=x>4?1:x,d=p.slice(x),x+=e[1].length),b&&this.rules.other.blankLine.test(f)&&(u+=f+`
`,s=s.substring(f.length+1),a=!0),!a){let _=this.rules.other.nextBulletRegex(x),C=this.rules.other.hrRegex(x),y=this.rules.other.fencesBeginRegex(x),M=this.rules.other.headingBeginRegex(x),E=this.rules.other.htmlBeginRegex(x);for(;s;){let v=s.split(`
`,1)[0],S;if(f=v,this.options.pedantic?(f=f.replace(this.rules.other.listReplaceNesting,"  "),S=f):S=f.replace(this.rules.other.tabCharGlobal,"    "),y.test(f)||M.test(f)||E.test(f)||_.test(f)||C.test(f))break;if(S.search(this.rules.other.nonSpaceChar)>=x||!f.trim())d+=`
`+S.slice(x);else{if(b||p.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||y.test(p)||M.test(p)||C.test(p))break;d+=`
`+f}!b&&!f.trim()&&(b=!0),u+=v+`
`,s=s.substring(v.length+1),p=S.slice(x)}}r.loose||(o?r.loose=!0:this.rules.other.doubleBlankLine.test(u)&&(o=!0)),r.items.push({type:"list_item",raw:u,task:!!this.options.gfm&&this.rules.other.listIsTask.test(d),loose:!1,text:d,tokens:[]}),r.raw+=u}let l=r.items.at(-1);if(l)l.raw=l.raw.trimEnd(),l.text=l.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let a of r.items){if(this.lexer.state.top=!1,a.tokens=this.lexer.blockTokens(a.text,[]),a.task){if(a.text=a.text.replace(this.rules.other.listReplaceTask,""),a.tokens[0]?.type==="text"||a.tokens[0]?.type==="paragraph"){a.tokens[0].raw=a.tokens[0].raw.replace(this.rules.other.listReplaceTask,""),a.tokens[0].text=a.tokens[0].text.replace(this.rules.other.listReplaceTask,"");for(let d=this.lexer.inlineQueue.length-1;d>=0;d--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[d].src)){this.lexer.inlineQueue[d].src=this.lexer.inlineQueue[d].src.replace(this.rules.other.listReplaceTask,"");break}}let u=this.rules.other.listTaskCheckbox.exec(a.raw);if(u){let d={type:"checkbox",raw:u[0]+" ",checked:u[0]!=="[ ]"};a.checked=d.checked,r.loose?a.tokens[0]&&["paragraph","text"].includes(a.tokens[0].type)&&"tokens"in a.tokens[0]&&a.tokens[0].tokens?(a.tokens[0].raw=d.raw+a.tokens[0].raw,a.tokens[0].text=d.raw+a.tokens[0].text,a.tokens[0].tokens.unshift(d)):a.tokens.unshift({type:"paragraph",raw:d.raw,text:d.raw,tokens:[d]}):a.tokens.unshift(d)}}if(!r.loose){let u=a.tokens.filter(p=>p.type==="space"),d=u.length>0&&u.some(p=>this.rules.other.anyLine.test(p.raw));r.loose=d}}if(r.loose)for(let a of r.items){a.loose=!0;for(let u of a.tokens)u.type==="text"&&(u.type="paragraph")}return r}}html(s){let e=this.rules.block.html.exec(s);if(e)return{type:"html",block:!0,raw:e[0],pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:e[0]}}def(s){let e=this.rules.block.def.exec(s);if(e){let t=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),n=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:t,raw:e[0],href:n,title:r}}}table(s){let e=this.rules.block.table.exec(s);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let t=Yr(e[1]),n=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:e[0],header:[],align:[],rows:[]};if(t.length===n.length){for(let o of n)this.rules.other.tableAlignRight.test(o)?i.align.push("right"):this.rules.other.tableAlignCenter.test(o)?i.align.push("center"):this.rules.other.tableAlignLeft.test(o)?i.align.push("left"):i.align.push(null);for(let o=0;o<t.length;o++)i.header.push({text:t[o],tokens:this.lexer.inline(t[o]),header:!0,align:i.align[o]});for(let o of r)i.rows.push(Yr(o,i.header.length).map((l,a)=>({text:l,tokens:this.lexer.inline(l),header:!1,align:i.align[a]})));return i}}lheading(s){let e=this.rules.block.lheading.exec(s);if(e)return{type:"heading",raw:e[0],depth:e[2].charAt(0)==="="?1:2,text:e[1],tokens:this.lexer.inline(e[1])}}paragraph(s){let e=this.rules.block.paragraph.exec(s);if(e){let t=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:t,tokens:this.lexer.inline(t)}}}text(s){let e=this.rules.block.text.exec(s);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(s){let e=this.rules.inline.escape.exec(s);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(s){let e=this.rules.inline.tag.exec(s);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(s){let e=this.rules.inline.link.exec(s);if(e){let t=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(t)){if(!this.rules.other.endAngleBracket.test(t))return;let i=Ot(t.slice(0,-1),"\\");if((t.length-i.length)%2===0)return}else{let i=to(e[2],"()");if(i===-2)return;if(i>-1){let o=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,o).trim(),e[3]=""}}let n=e[2],r="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(n);i&&(n=i[1],r=i[3])}else r=e[3]?e[3].slice(1,-1):"";return n=n.trim(),this.rules.other.startAngleBracket.test(n)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(t)?n=n.slice(1):n=n.slice(1,-1)),Xr(e,{href:n&&n.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(s,e){let t;if((t=this.rules.inline.reflink.exec(s))||(t=this.rules.inline.nolink.exec(s))){let n=(t[2]||t[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=e[n.toLowerCase()];if(!r){let i=t[0].charAt(0);return{type:"text",raw:i,text:i}}return Xr(t,r,t[0],this.lexer,this.rules)}}emStrong(s,e,t=""){let n=this.rules.inline.emStrongLDelim.exec(s);if(!(!n||n[3]&&t.match(this.rules.other.unicodeAlphaNumeric))&&(!(n[1]||n[2])||!t||this.rules.inline.punctuation.exec(t))){let r=[...n[0]].length-1,i,o,l=r,a=0,u=n[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(u.lastIndex=0,e=e.slice(-1*s.length+r);(n=u.exec(e))!=null;){if(i=n[1]||n[2]||n[3]||n[4]||n[5]||n[6],!i)continue;if(o=[...i].length,n[3]||n[4]){l+=o;continue}else if((n[5]||n[6])&&r%3&&!((r+o)%3)){a+=o;continue}if(l-=o,l>0)continue;o=Math.min(o,o+l+a);let d=[...n[0]][0].length,p=s.slice(0,r+n.index+d+o);if(Math.min(r,o)%2){let b=p.slice(1,-1);return{type:"em",raw:p,text:b,tokens:this.lexer.inlineTokens(b)}}let f=p.slice(2,-2);return{type:"strong",raw:p,text:f,tokens:this.lexer.inlineTokens(f)}}}}codespan(s){let e=this.rules.inline.code.exec(s);if(e){let t=e[2].replace(this.rules.other.newLineCharGlobal," "),n=this.rules.other.nonSpaceChar.test(t),r=this.rules.other.startingSpaceChar.test(t)&&this.rules.other.endingSpaceChar.test(t);return n&&r&&(t=t.substring(1,t.length-1)),{type:"codespan",raw:e[0],text:t}}}br(s){let e=this.rules.inline.br.exec(s);if(e)return{type:"br",raw:e[0]}}del(s){let e=this.rules.inline.del.exec(s);if(e)return{type:"del",raw:e[0],text:e[2],tokens:this.lexer.inlineTokens(e[2])}}autolink(s){let e=this.rules.inline.autolink.exec(s);if(e){let t,n;return e[2]==="@"?(t=e[1],n="mailto:"+t):(t=e[1],n=t),{type:"link",raw:e[0],text:t,href:n,tokens:[{type:"text",raw:t,text:t}]}}}url(s){let e;if(e=this.rules.inline.url.exec(s)){let t,n;if(e[2]==="@")t=e[0],n="mailto:"+t;else{let r;do r=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(r!==e[0]);t=e[0],e[1]==="www."?n="http://"+e[0]:n=e[0]}return{type:"link",raw:e[0],text:t,href:n,tokens:[{type:"text",raw:t,text:t}]}}}inlineText(s){let e=this.rules.inline.text.exec(s);if(e){let t=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:t}}}},Ne=class Os{constructor(e){J(this,"tokens");J(this,"options");J(this,"state");J(this,"inlineQueue");J(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||ct,this.options.tokenizer=this.options.tokenizer||new ns,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={other:Ae,block:ts.normal,inline:Nt.normal};this.options.pedantic?(t.block=ts.pedantic,t.inline=Nt.pedantic):this.options.gfm&&(t.block=ts.gfm,this.options.breaks?t.inline=Nt.breaks:t.inline=Nt.gfm),this.tokenizer.rules=t}static get rules(){return{block:ts,inline:Nt}}static lex(e,t){return new Os(t).lex(e)}static lexInline(e,t){return new Os(t).inlineTokens(e)}lex(e){e=e.replace(Ae.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){let n=this.inlineQueue[t];this.inlineTokens(n.src,n.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],n=!1){for(this.options.pedantic&&(e=e.replace(Ae.tabCharGlobal,"    ").replace(Ae.spaceLine,""));e;){let r;if(this.options.extensions?.block?.some(o=>(r=o.call({lexer:this},e,t))?(e=e.substring(r.raw.length),t.push(r),!0):!1))continue;if(r=this.tokenizer.space(e)){e=e.substring(r.raw.length);let o=t.at(-1);r.raw.length===1&&o!==void 0?o.raw+=`
`:t.push(r);continue}if(r=this.tokenizer.code(e)){e=e.substring(r.raw.length);let o=t.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.text,this.inlineQueue.at(-1).src=o.text):t.push(r);continue}if(r=this.tokenizer.fences(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.heading(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.hr(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.blockquote(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.list(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.html(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.def(e)){e=e.substring(r.raw.length);let o=t.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[r.tag]||(this.tokens.links[r.tag]={href:r.href,title:r.title},t.push(r));continue}if(r=this.tokenizer.table(e)){e=e.substring(r.raw.length),t.push(r);continue}if(r=this.tokenizer.lheading(e)){e=e.substring(r.raw.length),t.push(r);continue}let i=e;if(this.options.extensions?.startBlock){let o=1/0,l=e.slice(1),a;this.options.extensions.startBlock.forEach(u=>{a=u.call({lexer:this},l),typeof a=="number"&&a>=0&&(o=Math.min(o,a))}),o<1/0&&o>=0&&(i=e.substring(0,o+1))}if(this.state.top&&(r=this.tokenizer.paragraph(i))){let o=t.at(-1);n&&o?.type==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):t.push(r),n=i.length!==e.length,e=e.substring(r.raw.length);continue}if(r=this.tokenizer.text(e)){e=e.substring(r.raw.length);let o=t.at(-1);o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+r.raw,o.text+=`
`+r.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):t.push(r);continue}if(e){let o="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(o);break}else throw new Error(o)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let n=e,r=null;if(this.tokens.links){let a=Object.keys(this.tokens.links);if(a.length>0)for(;(r=this.tokenizer.rules.inline.reflinkSearch.exec(n))!=null;)a.includes(r[0].slice(r[0].lastIndexOf("[")+1,-1))&&(n=n.slice(0,r.index)+"["+"a".repeat(r[0].length-2)+"]"+n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;(r=this.tokenizer.rules.inline.anyPunctuation.exec(n))!=null;)n=n.slice(0,r.index)+"++"+n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);let i;for(;(r=this.tokenizer.rules.inline.blockSkip.exec(n))!=null;)i=r[2]?r[2].length:0,n=n.slice(0,r.index+i)+"["+"a".repeat(r[0].length-i-2)+"]"+n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);n=this.options.hooks?.emStrongMask?.call({lexer:this},n)??n;let o=!1,l="";for(;e;){o||(l=""),o=!1;let a;if(this.options.extensions?.inline?.some(d=>(a=d.call({lexer:this},e,t))?(e=e.substring(a.raw.length),t.push(a),!0):!1))continue;if(a=this.tokenizer.escape(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.tag(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.link(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(a.raw.length);let d=t.at(-1);a.type==="text"&&d?.type==="text"?(d.raw+=a.raw,d.text+=a.text):t.push(a);continue}if(a=this.tokenizer.emStrong(e,n,l)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.codespan(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.br(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.del(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.autolink(e)){e=e.substring(a.raw.length),t.push(a);continue}if(!this.state.inLink&&(a=this.tokenizer.url(e))){e=e.substring(a.raw.length),t.push(a);continue}let u=e;if(this.options.extensions?.startInline){let d=1/0,p=e.slice(1),f;this.options.extensions.startInline.forEach(b=>{f=b.call({lexer:this},p),typeof f=="number"&&f>=0&&(d=Math.min(d,f))}),d<1/0&&d>=0&&(u=e.substring(0,d+1))}if(a=this.tokenizer.inlineText(u)){e=e.substring(a.raw.length),a.raw.slice(-1)!=="_"&&(l=a.raw.slice(-1)),o=!0;let d=t.at(-1);d?.type==="text"?(d.raw+=a.raw,d.text+=a.text):t.push(a);continue}if(e){let d="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(d);break}else throw new Error(d)}}return t}},is=class{constructor(s){J(this,"options");J(this,"parser");this.options=s||ct}space(s){return""}code({text:s,lang:e,escaped:t}){let n=(e||"").match(Ae.notSpaceStart)?.[0],r=s.replace(Ae.endingNewline,"")+`
`;return n?'<pre><code class="language-'+je(n)+'">'+(t?r:je(r,!0))+`</code></pre>
`:"<pre><code>"+(t?r:je(r,!0))+`</code></pre>
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
`}strong({tokens:s}){return`<strong>${this.parser.parseInline(s)}</strong>`}em({tokens:s}){return`<em>${this.parser.parseInline(s)}</em>`}codespan({text:s}){return`<code>${je(s,!0)}</code>`}br(s){return"<br>"}del({tokens:s}){return`<del>${this.parser.parseInline(s)}</del>`}link({href:s,title:e,tokens:t}){let n=this.parser.parseInline(t),r=Kr(s);if(r===null)return n;s=r;let i='<a href="'+s+'"';return e&&(i+=' title="'+je(e)+'"'),i+=">"+n+"</a>",i}image({href:s,title:e,text:t,tokens:n}){n&&(t=this.parser.parseInline(n,this.parser.textRenderer));let r=Kr(s);if(r===null)return je(t);s=r;let i=`<img src="${s}" alt="${t}"`;return e&&(i+=` title="${je(e)}"`),i+=">",i}text(s){return"tokens"in s&&s.tokens?this.parser.parseInline(s.tokens):"escaped"in s&&s.escaped?s.text:je(s.text)}},Ws=class{strong({text:s}){return s}em({text:s}){return s}codespan({text:s}){return s}del({text:s}){return s}html({text:s}){return s}text({text:s}){return s}link({text:s}){return""+s}image({text:s}){return""+s}br(){return""}checkbox({raw:s}){return s}},Oe=class Ps{constructor(e){J(this,"options");J(this,"renderer");J(this,"textRenderer");this.options=e||ct,this.options.renderer=this.options.renderer||new is,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new Ws}static parse(e,t){return new Ps(t).parse(e)}static parseInline(e,t){return new Ps(t).parseInline(e)}parse(e){let t="";for(let n=0;n<e.length;n++){let r=e[n];if(this.options.extensions?.renderers?.[r.type]){let o=r,l=this.options.extensions.renderers[o.type].call({parser:this},o);if(l!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(o.type)){t+=l||"";continue}}let i=r;switch(i.type){case"space":{t+=this.renderer.space(i);break}case"hr":{t+=this.renderer.hr(i);break}case"heading":{t+=this.renderer.heading(i);break}case"code":{t+=this.renderer.code(i);break}case"table":{t+=this.renderer.table(i);break}case"blockquote":{t+=this.renderer.blockquote(i);break}case"list":{t+=this.renderer.list(i);break}case"checkbox":{t+=this.renderer.checkbox(i);break}case"html":{t+=this.renderer.html(i);break}case"def":{t+=this.renderer.def(i);break}case"paragraph":{t+=this.renderer.paragraph(i);break}case"text":{t+=this.renderer.text(i);break}default:{let o='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return t}parseInline(e,t=this.renderer){let n="";for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let l=this.options.extensions.renderers[i.type].call({parser:this},i);if(l!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){n+=l||"";continue}}let o=i;switch(o.type){case"escape":{n+=t.text(o);break}case"html":{n+=t.html(o);break}case"link":{n+=t.link(o);break}case"image":{n+=t.image(o);break}case"checkbox":{n+=t.checkbox(o);break}case"strong":{n+=t.strong(o);break}case"em":{n+=t.em(o);break}case"codespan":{n+=t.codespan(o);break}case"br":{n+=t.br(o);break}case"del":{n+=t.del(o);break}case"text":{n+=t.text(o);break}default:{let l='Token with "'+o.type+'" type was not found.';if(this.options.silent)return console.error(l),"";throw new Error(l)}}}return n}},ss,Pt=(ss=class{constructor(s){J(this,"options");J(this,"block");this.options=s||ct}preprocess(s){return s}postprocess(s){return s}processAllTokens(s){return s}emStrongMask(s){return s}provideLexer(){return this.block?Ne.lex:Ne.lexInline}provideParser(){return this.block?Oe.parse:Oe.parseInline}},J(ss,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),J(ss,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),ss),ro=class{constructor(...s){J(this,"defaults",Fs());J(this,"options",this.setOptions);J(this,"parse",this.parseMarkdown(!0));J(this,"parseInline",this.parseMarkdown(!1));J(this,"Parser",Oe);J(this,"Renderer",is);J(this,"TextRenderer",Ws);J(this,"Lexer",Ne);J(this,"Tokenizer",ns);J(this,"Hooks",Pt);this.use(...s)}walkTokens(s,e){let t=[];for(let n of s)switch(t=t.concat(e.call(this,n)),n.type){case"table":{let r=n;for(let i of r.header)t=t.concat(this.walkTokens(i.tokens,e));for(let i of r.rows)for(let o of i)t=t.concat(this.walkTokens(o.tokens,e));break}case"list":{let r=n;t=t.concat(this.walkTokens(r.items,e));break}default:{let r=n;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{let o=r[i].flat(1/0);t=t.concat(this.walkTokens(o,e))}):r.tokens&&(t=t.concat(this.walkTokens(r.tokens,e)))}}return t}use(...s){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return s.forEach(t=>{let n={...t};if(n.async=this.defaults.async||n.async||!1,t.extensions&&(t.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let i=e.renderers[r.name];i?e.renderers[r.name]=function(...o){let l=r.renderer.apply(this,o);return l===!1&&(l=i.apply(this,o)),l}:e.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[r.level];i?i.unshift(r.tokenizer):e[r.level]=[r.tokenizer],r.start&&(r.level==="block"?e.startBlock?e.startBlock.push(r.start):e.startBlock=[r.start]:r.level==="inline"&&(e.startInline?e.startInline.push(r.start):e.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(e.childTokens[r.name]=r.childTokens)}),n.extensions=e),t.renderer){let r=this.defaults.renderer||new is(this.defaults);for(let i in t.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let o=i,l=t.renderer[o],a=r[o];r[o]=(...u)=>{let d=l.apply(r,u);return d===!1&&(d=a.apply(r,u)),d||""}}n.renderer=r}if(t.tokenizer){let r=this.defaults.tokenizer||new ns(this.defaults);for(let i in t.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let o=i,l=t.tokenizer[o],a=r[o];r[o]=(...u)=>{let d=l.apply(r,u);return d===!1&&(d=a.apply(r,u)),d}}n.tokenizer=r}if(t.hooks){let r=this.defaults.hooks||new Pt;for(let i in t.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let o=i,l=t.hooks[o],a=r[o];Pt.passThroughHooks.has(i)?r[o]=u=>{if(this.defaults.async&&Pt.passThroughHooksRespectAsync.has(i))return(async()=>{let p=await l.call(r,u);return a.call(r,p)})();let d=l.call(r,u);return a.call(r,d)}:r[o]=(...u)=>{if(this.defaults.async)return(async()=>{let p=await l.apply(r,u);return p===!1&&(p=await a.apply(r,u)),p})();let d=l.apply(r,u);return d===!1&&(d=a.apply(r,u)),d}}n.hooks=r}if(t.walkTokens){let r=this.defaults.walkTokens,i=t.walkTokens;n.walkTokens=function(o){let l=[];return l.push(i.call(this,o)),r&&(l=l.concat(r.call(this,o))),l}}this.defaults={...this.defaults,...n}}),this}setOptions(s){return this.defaults={...this.defaults,...s},this}lexer(s,e){return Ne.lex(s,e??this.defaults)}parser(s,e){return Oe.parse(s,e??this.defaults)}parseMarkdown(s){return(e,t)=>{let n={...t},r={...this.defaults,...n},i=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&n.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=s),r.async)return(async()=>{let o=r.hooks?await r.hooks.preprocess(e):e,l=await(r.hooks?await r.hooks.provideLexer():s?Ne.lex:Ne.lexInline)(o,r),a=r.hooks?await r.hooks.processAllTokens(l):l;r.walkTokens&&await Promise.all(this.walkTokens(a,r.walkTokens));let u=await(r.hooks?await r.hooks.provideParser():s?Oe.parse:Oe.parseInline)(a,r);return r.hooks?await r.hooks.postprocess(u):u})().catch(i);try{r.hooks&&(e=r.hooks.preprocess(e));let o=(r.hooks?r.hooks.provideLexer():s?Ne.lex:Ne.lexInline)(e,r);r.hooks&&(o=r.hooks.processAllTokens(o)),r.walkTokens&&this.walkTokens(o,r.walkTokens);let l=(r.hooks?r.hooks.provideParser():s?Oe.parse:Oe.parseInline)(o,r);return r.hooks&&(l=r.hooks.postprocess(l)),l}catch(o){return i(o)}}}onError(s,e){return t=>{if(t.message+=`
Please report this to https://github.com/markedjs/marked.`,s){let n="<p>An error occurred:</p><pre>"+je(t.message+"",!0)+"</pre>";return e?Promise.resolve(n):n}if(e)return Promise.reject(t);throw t}}},lt=new ro;function Y(s,e){return lt.parse(s,e)}Y.options=Y.setOptions=function(s){return lt.setOptions(s),Y.defaults=lt.defaults,Qr(Y.defaults),Y};Y.getDefaults=Fs;Y.defaults=ct;Y.use=function(...s){return lt.use(...s),Y.defaults=lt.defaults,Qr(Y.defaults),Y};Y.walkTokens=function(s,e){return lt.walkTokens(s,e)};Y.parseInline=lt.parseInline;Y.Parser=Oe;Y.parser=Oe.parse;Y.Renderer=is;Y.TextRenderer=Ws;Y.Lexer=Ne;Y.lexer=Ne.lex;Y.Tokenizer=ns;Y.Hooks=Pt;Y.parse=Y;var ea=Y.options,ta=Y.setOptions,sa=Y.use,ra=Y.walkTokens,na=Y.parseInline;var ia=Oe.parse,oa=Ne.lex;function Bt(s){let e=Y.parse(s),t=Ur.sanitize(e);return Gr(t)}function et(s){switch((s||"").toString()){case"open":return"Open";case"in_progress":return"In progress";case"closed":return"Closed";default:return(s||"").toString()||"Open"}}function no(s){window.location.hash=s}function dn(s,e,t=no,n=void 0){let r=ee("views:detail"),i=null,o=null,l=!1,a=!1,u=!1,d=!1,p=!1,f=!1,b=!1,x="";function _(h){let O=Ss(window.location.hash||"");return Xe(O,h)}function C(h){fe(T`
        <div class="panel__body" id="detail-root">
          <p class="muted">${h}</p>
        </div>
      `,s)}function y(){if(!o||!n||typeof n.snapshotFor!="function")return;let h=n.snapshotFor(`detail:${o}`);Array.isArray(h)&&h.length>0&&(i=h.find(G=>String(G.id)===String(o))||h[0])}n&&typeof n.subscribe=="function"&&n.subscribe(()=>{try{y(),N()}catch(h){r("issue stores listener error %o",h)}});let M=()=>{a=!0,N()},E=h=>{h.key==="Enter"?(a=!0,N()):h.key==="Escape"&&(a=!1,N())},v=async()=>{if(!i||l)return;let h=s.querySelector("h2 input"),O=i.title||"",G=h?h.value:"";if(G===O){a=!1,N();return}l=!0,h&&(h.disabled=!0);try{r("save title %s \u2192 %s",String(i.id),G);let D=await e("edit-text",{id:i.id,field:"title",value:G});D&&typeof D=="object"&&(i=D,a=!1,N())}catch(D){r("save title failed %s %o",String(i.id),D),i.title=O,a=!1,N(),ye("Failed to save title","error")}finally{l=!1}},S=()=>{a=!1,N()},m=()=>{b=!0,N()},w=h=>{h.key==="Enter"?(h.preventDefault(),b=!0,N()):h.key==="Escape"&&(h.preventDefault(),b=!1,N())},k=async()=>{if(!i||l)return;let h=s.querySelector("#detail-root .prop.assignee input"),O=i?.assignee??"",G=h?.value??"";if(G===O){b=!1,N();return}l=!0,h&&(h.disabled=!0);try{r("save assignee %s \u2192 %s",String(i.id),G);let D=await e("update-assignee",{id:i.id,assignee:G});D&&typeof D=="object"&&(i=D,b=!1,N())}catch(D){r("save assignee failed %s %o",String(i.id),D),i.assignee=O,b=!1,N(),ye("Failed to update assignee","error")}finally{l=!1}},R=()=>{b=!1,N()},I=h=>{x=h.currentTarget.value||""};function L(h){h.key==="Enter"&&(h.preventDefault(),z())}async function z(){if(!i||l)return;let h=x.trim();if(h){l=!0;try{r("add label %s \u2192 %s",String(i.id),h);let O=await e("label-add",{id:i.id,label:h});O&&typeof O=="object"&&(i=O,x="",N())}catch(O){r("add label failed %s %o",String(i.id),O),ye("Failed to add label","error")}finally{l=!1}}}async function j(h){if(!(!i||l)){l=!0;try{r("remove label %s \u2192 %s",String(i?.id||""),h);let O=await e("label-remove",{id:i.id,label:h});O&&typeof O=="object"&&(i=O,N())}catch(O){r("remove label failed %s %o",String(i?.id||""),O),ye("Failed to remove label","error")}finally{l=!1}}}let V=async h=>{if(!i||l){N();return}let O=h.currentTarget,G=i.status||"open",D=O.value;if(D!==G){l=!0,i.status=D,N();try{r("update status %s \u2192 %s",String(i.id),D);let X=await e("update-status",{id:i.id,status:D});X&&typeof X=="object"&&(i=X,N())}catch(X){r("update status failed %s %o",String(i.id),X),i.status=G,N(),ye("Failed to update status","error")}finally{l=!1}}},Q=async h=>{if(!i||l){N();return}let O=h.currentTarget,G=typeof i.priority=="number"?i.priority:2,D=Number(O.value);if(D!==G){l=!0,i.priority=D,N();try{r("update priority %s \u2192 %d",String(i.id),D);let X=await e("update-priority",{id:i.id,priority:D});X&&typeof X=="object"&&(i=X,N())}catch(X){r("update priority failed %s %o",String(i.id),X),i.priority=G,N(),ye("Failed to update priority","error")}finally{l=!1}}},Z=()=>{u=!0,N()},ie=h=>{if(h.key==="Escape")u=!1,N();else if(h.key==="Enter"&&h.ctrlKey){let O=s.querySelector("#detail-root .editable-actions button");O&&O.click()}},re=async()=>{if(!i||l)return;let h=s.querySelector("#detail-root textarea"),O=i.description||"",G=h?h.value:"";if(G===O){u=!1,N();return}l=!0,h&&(h.disabled=!0);try{r("save description %s",String(i?.id||""));let D=await e("edit-text",{id:i.id,field:"description",value:G});D&&typeof D=="object"&&(i=D,u=!1,N())}catch(D){r("save description failed %s %o",String(i?.id||""),D),i.description=O,u=!1,N(),ye("Failed to save description","error")}finally{l=!1}},de=()=>{u=!1,N()},oe=()=>{d=!0,N();try{let h=s.querySelector("#detail-root .design textarea");h&&h.focus()}catch(h){r("focus design textarea failed %o",h)}},B=h=>{if(h.key==="Escape")d=!1,N();else if(h.key==="Enter"&&(h.ctrlKey||h.metaKey)){let O=s.querySelector("#detail-root .design .editable-actions button");O&&O.click()}},Te=async()=>{if(!i||l)return;let h=s.querySelector("#detail-root .design textarea"),O=i.design||"",G=h?h.value:"";if(G===O){d=!1,N();return}l=!0,h&&(h.disabled=!0);try{r("save design %s",String(i?.id||""));let D=await e("edit-text",{id:i.id,field:"design",value:G});D&&typeof D=="object"&&(i=D,d=!1,N())}catch(D){r("save design failed %s %o",String(i?.id||""),D),i.design=O,d=!1,N(),ye("Failed to save design","error")}finally{l=!1}},le=()=>{d=!1,N()},Ge=()=>{p=!0,N()},te=h=>{if(h.key==="Escape")p=!1,N();else if(h.key==="Enter"&&(h.ctrlKey||h.metaKey)){let O=s.querySelector("#detail-root .notes .editable-actions button");O&&O.click()}},Ee=async()=>{if(!i||l)return;let h=s.querySelector("#detail-root .notes textarea"),O=i.notes||"",G=h?h.value:"";if(G===O){p=!1,N();return}l=!0,h&&(h.disabled=!0);try{r("save notes %s",String(i?.id||""));let D=await e("edit-text",{id:i.id,field:"notes",value:G});D&&typeof D=="object"&&(i=D,p=!1,N())}catch(D){r("save notes failed %s %o",String(i?.id||""),D),i.notes=O,p=!1,N(),ye("Failed to save notes","error")}finally{l=!1}},Pe=()=>{p=!1,N()},ke=()=>{f=!0,N()},Fe=h=>{if(h.key==="Escape")f=!1,N();else if(h.key==="Enter"&&(h.ctrlKey||h.metaKey)){let O=s.querySelector("#detail-root .acceptance .editable-actions button");O&&O.click()}},Le=async()=>{if(!i||l)return;let h=s.querySelector("#detail-root .acceptance textarea"),O=i.acceptance||"",G=h?h.value:"";if(G===O){f=!1,N();return}l=!0,h&&(h.disabled=!0);try{r("save acceptance %s",String(i?.id||""));let D=await e("edit-text",{id:i.id,field:"acceptance",value:G});D&&typeof D=="object"&&(i=D,f=!1,N())}catch(D){r("save acceptance failed %s %o",String(i?.id||""),D),i.acceptance=O,f=!1,N(),ye("Failed to save acceptance","error")}finally{l=!1}},ze=()=>{f=!1,N()};function We(h,O){let G=h==="Dependencies"?"add-dependency":"add-dependent";return T`
      <div class="props-card">
        <div>
          <div class="props-card__title">${h}</div>
        </div>
        <ul>
          ${!O||O.length===0?null:O.map(D=>{let X=D.id,ae=_(X);return T`<li
                  data-href=${ae}
                  @click=${()=>t(ae)}
                >
                  ${at(D.issue_type||"")}
                  <span class="text-truncate">${D.title||""}</span>
                  <button
                    aria-label=${`Remove dependency ${X}`}
                    @click=${Re(X,h)}
                  >
                    ×
                  </button>
                </li>`})}
        </ul>
        <div class="props-card__footer">
          <input type="text" placeholder="Issue ID" data-testid=${G} />
          <button @click=${A(O,h)}>Add</button>
        </div>
      </div>
    `}function Ce(h){let O=a?T`<div class="detail-title">
          <h2>
            <input
              type="text"
              aria-label="Edit title"
              .value=${h.title||""}
              @keydown=${g}
            />
            <button @click=${v}>Save</button>
            <button @click=${S}>Cancel</button>
          </h2>
        </div>`:T`<div class="detail-title">
          <h2>
            <span
              class="editable"
              tabindex="0"
              role="button"
              aria-label="Edit title"
              @click=${M}
              @keydown=${E}
              >${h.title||""}</span
            >
          </h2>
        </div>`,G=T`<select
      class=${`badge-select badge--status is-${h.status||"open"}`}
      @change=${V}
      .value=${h.status||"open"}
      ?disabled=${l}
    >
      ${(()=>{let q=String(h.status||"open");return["open","in_progress","closed"].map(se=>T`<option value=${se} ?selected=${q===se}>
              ${et(se)}
            </option>`)})()}
    </select>`,D=T`<select
      class=${`badge-select badge--priority is-p${String(typeof h.priority=="number"?h.priority:2)}`}
      @change=${Q}
      .value=${String(typeof h.priority=="number"?h.priority:2)}
      ?disabled=${l}
    >
      ${(()=>{let q=String(typeof h.priority=="number"?h.priority:2);return Je.map((se,Ze)=>T`<option value=${String(Ze)} ?selected=${q===String(Ze)}>
              ${Et(Ze)} ${se}
            </option>`)})()}
    </select>`,X=u?T`<div class="description">
          <textarea
            @keydown=${ie}
            .value=${h.description||""}
            rows="8"
            style="width:100%"
          ></textarea>
          <div class="editable-actions">
            <button @click=${re}>Save</button>
            <button @click=${de}>Cancel</button>
          </div>
        </div>`:T`<div
          class="md editable"
          tabindex="0"
          role="button"
          aria-label="Edit description"
          @click=${Z}
          @keydown=${H}
        >
          ${(()=>{let q=h.description||"";return q.trim()===""?T`<div class="muted">Description</div>`:Bt(q)})()}
        </div>`,ae=(()=>{let q=h;return String(h.acceptance||q.acceptance_criteria||"")})(),dt=f?T`<div class="acceptance">
          ${ae.trim().length>0?T`<div class="props-card__title">Acceptance Criteria</div>`:""}
          <textarea
            @keydown=${Fe}
            .value=${ae}
            rows="6"
            style="width:100%"
          ></textarea>
          <div class="editable-actions">
            <button @click=${Le}>Save</button>
            <button @click=${ze}>Cancel</button>
          </div>
        </div>`:T`<div class="acceptance">
          ${(()=>{let q=ae,se=q.trim().length>0;return T`${se?T`<div class="props-card__title">Acceptance Criteria</div>`:""}
              <div
                class="md editable"
                tabindex="0"
                role="button"
                aria-label="Edit acceptance criteria"
                @click=${ke}
                @keydown=${U}
              >
                ${se?Bt(q):T`<div class="muted">Add acceptance criteria…</div>`}
              </div>`})()}
        </div>`,me=String(h.notes||""),Ht=p?T`<div class="notes">
          ${me.trim().length>0?T`<div class="props-card__title">Notes</div>`:""}
          <textarea
            @keydown=${te}
            .value=${me}
            rows="6"
            style="width:100%"
          ></textarea>
          <div class="editable-actions">
            <button @click=${Ee}>Save</button>
            <button @click=${Pe}>Cancel</button>
          </div>
        </div>`:T`<div class="notes">
          ${(()=>{let q=me,se=q.trim().length>0;return T`${se?T`<div class="props-card__title">Notes</div>`:""}
              <div
                class="md editable"
                tabindex="0"
                role="button"
                aria-label="Edit notes"
                @click=${Ge}
                @keydown=${ue}
              >
                ${se?Bt(q):T`<div class="muted">Add notes…</div>`}
              </div>`})()}
        </div>`,kt=Array.isArray(h.labels)?h.labels:[],Ut=T`<div class="props-card labels">
      <div>
        <div class="props-card__title">Labels</div>
      </div>
      <ul>
        ${kt.map(q=>T`<li>
              <span class="badge" title=${q}
                >${q}
                <button
                  class="icon-button"
                  title="Remove label"
                  aria-label=${"Remove label "+q}
                  @click=${()=>j(q)}
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
          .value=${x}
          @input=${I}
          @keydown=${L}
        />
        <button @click=${z}>Add</button>
      </div>
    </div>`,Ve=String(h.design||""),ut=d?T`<div class="design">
          ${Ve.trim().length>0?T`<div class="props-card__title">Design</div>`:""}
          <textarea
            @keydown=${B}
            .value=${Ve}
            rows="6"
            style="width:100%"
          ></textarea>
          <div class="editable-actions">
            <button @click=${Te}>Save</button>
            <button @click=${le}>Cancel</button>
          </div>
        </div>`:T`<div class="design">
          ${(()=>{let q=Ve,se=q.trim().length>0;return T`${se?T`<div class="props-card__title">Design</div>`:""}
              <div
                class="md editable"
                tabindex="0"
                role="button"
                aria-label="Edit design"
                @click=${oe}
                @keydown=${ge}
              >
                ${se?Bt(q):T`<div class="muted">Add design…</div>`}
              </div>`})()}
        </div>`;return T`
      <div class="panel__body" id="detail-root">
        <div style="position:relative">
          <div class="detail-layout">
            <div class="detail-main">
              ${O} ${X} ${ut} ${Ht}
              ${dt}
            </div>
            <div class="detail-side">
              <div class="props-card">
                <div class="props-card__title">Properties</div>
                <div class="prop">
                  <div class="label">Type</div>
                  <div class="value">
                    ${at(h.issue_type)}
                  </div>
                </div>
                <div class="prop">
                  <div class="label">Status</div>
                  <div class="value">${G}</div>
                </div>
                <div class="prop">
                  <div class="label">Priority</div>
                  <div class="value">${D}</div>
                </div>
                <div class="prop assignee">
                  <div class="label">Assignee</div>
                  <div class="value">
                    ${b?T`<input
                            type="text"
                            aria-label="Edit assignee"
                            .value=${h.assignee||""}
                            size=${Math.min(40,Math.max(12,(h.assignee||"").length+3))}
                            @keydown=${q=>{q.key==="Escape"?(q.preventDefault(),R()):q.key==="Enter"&&(q.preventDefault(),k())}}
                          />
                          <button
                            class="btn"
                            style="margin-left:6px"
                            @click=${k}
                          >
                            Save
                          </button>
                          <button
                            class="btn"
                            style="margin-left:6px"
                            @click=${R}
                          >
                            Cancel
                          </button>`:T`${(()=>{let q=h.assignee||"",se=q.trim().length>0;return T`<span
                            class=${se?"editable":"editable muted"}
                            tabindex="0"
                            role="button"
                            aria-label="Edit assignee"
                            @click=${m}
                            @keydown=${w}
                            >${se?q:"Unassigned"}</span
                          >`})()}`}
                  </div>
                </div>
              </div>
              ${Ut}
              ${We("Dependencies",h.dependencies||[])}
              ${We("Dependents",h.dependents||[])}
            </div>
          </div>
        </div>
      </div>
    `}function N(){if(!i){C(o?"Loading\u2026":"No issue selected");return}fe(Ce(i),s)}function Re(h,O){return async G=>{if(G.stopPropagation(),!(!i||l)){l=!0;try{if(O==="Dependencies"){let D=await e("dep-remove",{a:i.id,b:h,view_id:i.id});D&&typeof D=="object"&&(i=D,N())}else{let D=await e("dep-remove",{a:h,b:i.id,view_id:i.id});D&&typeof D=="object"&&(i=D,N())}}catch(D){r("dep-remove failed %o",D)}finally{l=!1}}}}function A(h,O){return async G=>{if(!i||l)return;let D=G.currentTarget,X=D.previousElementSibling,ae=X?X.value.trim():"";if(!ae||ae===i.id){ye("Enter a different issue id");return}if(new Set((h||[]).map(me=>me.id)).has(ae)){ye("Link already exists");return}l=!0,D&&(D.disabled=!0),X&&(X.disabled=!0);try{if(O==="Dependencies"){let me=await e("dep-add",{a:i.id,b:ae,view_id:i.id});me&&typeof me=="object"&&(i=me,N())}else{let me=await e("dep-add",{a:ae,b:i.id,view_id:i.id});me&&typeof me=="object"&&(i=me,N())}}catch(me){r("dep-add failed %o",me),ye("Failed to add dependency","error")}finally{l=!1}}}function g(h){h.key==="Escape"?(a=!1,N()):h.key==="Enter"&&(h.preventDefault(),v())}function H(h){h.key==="Enter"&&Z()}function U(h){h.key==="Enter"&&ke()}function ue(h){h.key==="Enter"&&Ge()}function ge(h){h.key==="Enter"&&oe()}return{async load(h){if(!h){C("No issue selected");return}o=String(h),i=null,y(),i||C("Loading\u2026"),l=!1,N()},clear(){C("Select an issue to view details")},destroy(){s.replaceChildren()}}}function ls(s){let e=s.navigate,t=s.onUpdate,n=s.requestRender,r=s.getSelectedId||(()=>null),i=s.row_class||"issue-row",o=new Set;function l(p,f,b,x=""){let _=`${p}:${f}`;return o.has(_)?T`<span>
        <input
          type="text"
          .value=${b}
          class="inline-edit"
          @keydown=${async y=>{if(y.key==="Escape")o.delete(_),n();else if(y.key==="Enter"){let E=y.currentTarget.value||"";E!==b&&await t(p,{[f]:E}),o.delete(_),n()}}}
          @blur=${async y=>{let E=y.currentTarget.value||"";E!==b&&await t(p,{[f]:E}),o.delete(_),n()}}
          autofocus
        />
      </span>`:T`<span
      class="editable text-truncate ${b?"":"muted"}"
      tabindex="0"
      role="button"
      @click=${y=>{y.stopPropagation(),y.preventDefault(),o.add(_),n()}}
      @keydown=${y=>{y.key==="Enter"&&(y.preventDefault(),y.stopPropagation(),o.add(_),n())}}
      >${b||x}</span
    >`}function a(p,f){return async b=>{let _=b.currentTarget.value||"",C={};C[f]=f==="priority"?Number(_):_,await t(p,C)}}function u(p){return f=>{let b=f.target;b&&(b.tagName==="INPUT"||b.tagName==="SELECT")||e(p)}}function d(p){let f=String(p.status||"open"),b=String(p.priority??2),x=r()===p.id;return T`<tr
      role="row"
      class="${i} ${x?"selected":""}"
      data-issue-id=${p.id}
      @click=${u(p.id)}
    >
      <td role="gridcell" class="mono">${Qe(p.id)}</td>
      <td role="gridcell">${at(p.issue_type)}</td>
      <td role="gridcell">${l(p.id,"title",p.title||"")}</td>
      <td role="gridcell">
        <select
          class="badge-select badge--status is-${f}"
          .value=${f}
          @change=${a(p.id,"status")}
        >
          ${["open","in_progress","closed"].map(_=>T`<option value=${_} ?selected=${f===_}>
                ${et(_)}
              </option>`)}
        </select>
      </td>
      <td role="gridcell">
        ${l(p.id,"assignee",p.assignee||"","Unassigned")}
      </td>
      <td role="gridcell">
        <select
          class="badge-select badge--priority ${"is-p"+b}"
          .value=${b}
          @change=${a(p.id,"priority")}
        >
          ${Je.map((_,C)=>T`<option
                value=${String(C)}
                ?selected=${b===String(C)}
              >
                ${Et(C)} ${_}
              </option>`)}
        </select>
      </td>
    </tr>`}return d}function un(s,e,t,n=void 0,r=void 0){let i=[],o=new Set,l=new Set,a=new Map,u=r?Ye(r):null;u&&u.subscribe(()=>{let y=i.length===0;if(i=C(),p(),y&&i.length>0){let M=String(i[0].epic?.id||"");M&&!o.has(M)&&_(M)}});let d=ls({navigate:y=>t(y),onUpdate:x,requestRender:p,getSelectedId:()=>null,row_class:"epic-row"});function p(){fe(f(),s)}function f(){return i.length?T`${i.map(y=>b(y))}`:T`<div class="panel__header muted">No epics found.</div>`}function b(y){let M=y.epic||{},E=String(M.id||""),v=o.has(E),S=u?u.selectEpicChildren(E):[],m=l.has(E);return T`
      <div class="epic-group" data-epic-id=${E}>
        <div
          class="epic-header"
          @click=${()=>_(E)}
          role="button"
          tabindex="0"
          aria-expanded=${v}
        >
          ${Qe(E,{class_name:"mono"})}
          <span class="text-truncate" style="margin-left:8px"
            >${M.title||"(no title)"}</span
          >
          <span
            class="epic-progress"
            style="margin-left:auto; display:flex; align-items:center; gap:8px;"
          >
            <progress
              value=${Number(y.closed_children||0)}
              max=${Math.max(1,Number(y.total_children||0))}
            ></progress>
            <span class="muted mono"
              >${y.closed_children}/${y.total_children}</span
            >
          </span>
        </div>
        ${v?T`<div class="epic-children">
              ${m?T`<div class="muted">Loading…</div>`:S.length===0?T`<div class="muted">No issues found</div>`:T`<table class="table">
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
                        ${S.map(w=>d(w))}
                      </tbody>
                    </table>`}
            </div>`:null}
      </div>
    `}async function x(y,M){try{await e.updateIssue({id:y,...M}),p()}catch{}}async function _(y){if(o.has(y)){if(o.delete(y),a.has(y)){try{let M=a.get(y);M&&await M()}catch{}a.delete(y);try{r&&r.unregister&&r.unregister(`detail:${y}`)}catch{}}}else{if(o.add(y),l.add(y),p(),n&&typeof n.subscribeList=="function")try{try{r&&r.register&&r.register(`detail:${y}`,{type:"issue-detail",params:{id:y}})}catch{}let M=await n.subscribeList(`detail:${y}`,{type:"issue-detail",params:{id:y}});a.set(y,M)}catch{}l.delete(y)}p()}function C(){let y=r&&r.snapshotFor?r.snapshotFor("tab:epics")||[]:[],M=[];for(let E of y){let v=Array.isArray(E.dependents)?E.dependents:[],S=Number.isFinite(E.total_children),m=Number.isFinite(E.closed_children),w=S?Number(E.total_children)||0:v.length,k=m&&Number(E.closed_children)||0;if(!m)for(let R of v)String(R.status||"")==="closed"&&k++;M.push({epic:E,total_children:w,closed_children:k})}return M}return{async load(){i=C(),p();try{if(i.length>0){let y=String(i[0].epic?.id||"");y&&!o.has(y)&&await _(y)}}catch{}}}}function pn(s){let e=document.createElement("dialog");e.id="fatal-error-dialog",e.setAttribute("role","alertdialog"),e.setAttribute("aria-modal","true"),e.innerHTML=`
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
    </div>`,s.appendChild(e);let t=e.querySelector("#fatal-error-title"),n=e.querySelector("#fatal-error-message"),r=e.querySelector("#fatal-error-detail"),i=e.querySelector("#fatal-error-reload"),o=e.querySelector("#fatal-error-close"),l=()=>{if(typeof e.close=="function")try{e.close()}catch{}e.removeAttribute("open")},a=(u,d,p="")=>{t&&(t.textContent=u||"Unexpected Error"),n&&(n.textContent=d||"An unrecoverable error occurred.");let f=typeof p=="string"?p.trim():"";if(r&&(f.length>0?(r.textContent=f,r.removeAttribute("hidden")):(r.textContent="No additional diagnostics available.",r.setAttribute("hidden",""))),typeof e.showModal=="function")try{e.showModal(),e.setAttribute("open","")}catch{e.setAttribute("open","")}else e.setAttribute("open","")};return i&&i.addEventListener("click",()=>{window.location.reload()}),o&&o.addEventListener("click",()=>l()),e.addEventListener("cancel",u=>{u.preventDefault(),l()}),{open:a,close:l,getElement(){return e}}}function fn(s,e,t){let n=document.createElement("dialog");n.id="issue-dialog",n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true"),n.innerHTML=`
    <div class="issue-dialog__container" part="container">
      <header class="issue-dialog__header">
        <div class="issue-dialog__title">
          <span class="mono" id="issue-dialog-title"></span>
        </div>
        <button type="button" class="issue-dialog__close" aria-label="Close">\xD7</button>
      </header>
      <div class="issue-dialog__body" id="issue-dialog-body"></div>
    </div>
  `,s.appendChild(n);let r=n.querySelector("#issue-dialog-body"),i=n.querySelector("#issue-dialog-title"),o=n.querySelector(".issue-dialog__close");function l(b){i.replaceChildren(),i.appendChild(Qe(b))}n.addEventListener("mousedown",b=>{b.target===n&&(b.preventDefault(),u())}),n.addEventListener("cancel",b=>{b.preventDefault(),u()}),o.addEventListener("click",()=>u());let a=null;function u(){try{typeof n.close=="function"?n.close():n.removeAttribute("open")}catch{n.removeAttribute("open")}try{t()}catch{}f()}function d(b){try{let x=document.activeElement;x&&x instanceof HTMLElement?a=x:a=null}catch{a=null}l(b);try{"showModal"in n&&typeof n.showModal=="function"?n.showModal():n.setAttribute("open",""),setTimeout(()=>{try{o.focus()}catch{}},0)}catch{n.setAttribute("open","")}}function p(){try{typeof n.close=="function"?n.close():n.removeAttribute("open")}catch{n.removeAttribute("open")}f()}function f(){try{a&&document.contains(a)&&a.focus()}catch{}finally{a=null}}return{open:d,close:p,getMount(){return r}}}var cs=["bug","feature","task","epic","chore"];function ds(s){switch((s||"").toString().toLowerCase()){case"bug":return"Bug";case"feature":return"Feature";case"task":return"Task";case"epic":return"Epic";case"chore":return"Chore";default:return""}}function hn(s,e,t,n,r=void 0,i=void 0){let o=ee("views:list"),l="all",a="",u=[],d="",p=n?n.getState().selected_id:null,f=null,b=ls({navigate:m=>{let w=t||(R=>window.location.hash=R),k=n?n.getState().view:"issues";w(Xe(k,m))},onUpdate:v,requestRender:E,getSelectedId:()=>p,row_class:"issue-row"}),x=async m=>{l=m.currentTarget.value,o("status change %s",l),n&&n.setState({filters:{status:l}}),await S()},_=m=>{a=m.currentTarget.value,o("search input %s",a),n&&n.setState({filters:{search:a}}),E()},C=m=>{d=m.currentTarget.value||"",o("type change %s",d||"(all)"),n&&n.setState({filters:{type:d}}),E()};if(n){let m=n.getState();m&&m.filters&&typeof m.filters=="object"&&(l=m.filters.status||"all",a=m.filters.search||"",d=typeof m.filters.type=="string"?m.filters.type:"")}let y=i?Ye(i):null;function M(){let m=u;if(l!=="all"&&l!=="ready"&&(m=m.filter(w=>String(w.status||"")===l)),a){let w=a.toLowerCase();m=m.filter(k=>{let R=String(k.id).toLowerCase(),I=String(k.title||"").toLowerCase();return R.includes(w)||I.includes(w)})}return d&&(m=m.filter(w=>String(w.issue_type||"")===String(d))),l==="closed"&&(m=m.slice().sort(mt)),T`
      <div class="panel__header">
        <select @change=${x} .value=${l}>
          <option value="all">All</option>
          <option value="ready">Ready</option>
          <option value="open">${et("open")}</option>
          <option value="in_progress">${et("in_progress")}</option>
          <option value="closed">${et("closed")}</option>
        </select>
        <select
          @change=${C}
          .value=${d}
          aria-label="Filter by type"
        >
          <option value="">All types</option>
          ${cs.map(w=>T`<option value=${w} ?selected=${d===w}>
                ${ds(w)}
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
        ${m.length===0?T`<div class="issues-block">
              <div class="muted" style="padding:10px 12px;">No issues</div>
            </div>`:T`<div class="issues-block">
              <table
                class="table"
                role="grid"
                aria-rowcount=${String(m.length)}
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
                  ${m.map(w=>b(w))}
                </tbody>
              </table>
            </div>`}
      </div>
    `}function E(){fe(M(),s)}E();async function v(m,w){try{o("updateInline %s %o",m,Object.keys(w)),typeof w.title=="string"&&await e("edit-text",{id:m,field:"title",value:w.title}),typeof w.assignee=="string"&&await e("update-assignee",{id:m,assignee:w.assignee}),typeof w.status=="string"&&await e("update-status",{id:m,status:w.status}),typeof w.priority=="number"&&await e("update-priority",{id:m,priority:w.priority})}catch{}}async function S(){o("load");let m=s.querySelector("#list-root"),w=m?m.scrollTop:0;try{y?u=y.selectIssuesFor("tab:issues"):u=[]}catch(k){o("load failed: %o",k),u=[]}E();try{let k=s.querySelector("#list-root");k&&w>0&&(k.scrollTop=w)}catch{}}return s.tabIndex=0,s.addEventListener("keydown",m=>{if(m.key==="ArrowDown"||m.key==="ArrowUp"){let I=m.target;if((I&&typeof I.closest=="function"?I.closest("#list-root table.table"):null)&&!!!(I&&typeof I.closest=="function"&&(I.closest("input")||I.closest("textarea")||I.closest("select")))){let j=I&&typeof I.closest=="function"?I.closest("td"):null;if(j&&j.parentElement){let V=j.parentElement,Q=V.parentElement;if(Q&&Q.querySelectorAll){let Z=Array.from(Q.querySelectorAll("tr")),ie=Math.max(0,Z.indexOf(V)),re=j.cellIndex||0,de=m.key==="ArrowDown"?Math.min(ie+1,Z.length-1):Math.max(ie-1,0),oe=Z[de],B=oe&&oe.cells?oe.cells[re]:null;if(B){let Te=B.querySelector('button:not([disabled]), [tabindex]:not([tabindex="-1"]), a[href], select:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled])');if(Te&&typeof Te.focus=="function"){m.preventDefault(),Te.focus();return}}}}}}let w=s.querySelector("#list-root tbody"),k=w?w.querySelectorAll("tr"):[];if(k.length===0)return;let R=0;if(p&&(R=Array.from(k).findIndex(L=>(L.getAttribute("data-issue-id")||"")===p),R<0&&(R=0)),m.key==="ArrowDown"){m.preventDefault();let I=k[Math.min(R+1,k.length-1)],L=I?I.getAttribute("data-issue-id"):"",z=L||null;n&&z&&n.setState({selected_id:z}),p=z,E()}else if(m.key==="ArrowUp"){m.preventDefault();let I=k[Math.max(R-1,0)],L=I?I.getAttribute("data-issue-id"):"",z=L||null;n&&z&&n.setState({selected_id:z}),p=z,E()}else if(m.key==="Enter"){m.preventDefault();let I=k[R],L=I?I.getAttribute("data-issue-id"):"";if(L){let z=t||(V=>window.location.hash=V),j=n?n.getState().view:"issues";z(Xe(j,L))}}}),n&&(f=n.subscribe(m=>{if(m.selected_id!==p&&(p=m.selected_id,o("selected %s",p||"(none)"),E()),m.filters&&typeof m.filters=="object"){let w=m.filters.status,k=m.filters.search||"",R=typeof m.filters.type=="string"?m.filters.type:"",I=!1;if(w!==l){l=w,S();return}k!==a&&(a=k,I=!0),R!==d&&(d=R,I=!0),I&&E()}})),y&&y.subscribe(()=>{try{u=y.selectIssuesFor("tab:issues"),E()}catch{}}),{load:S,destroy(){s.replaceChildren(),f&&(f(),f=null)}}}function gn(s,e,t){let n=ee("views:nav"),r=null;function i(a){return u=>{u.preventDefault(),n("click tab %s",a),t.gotoView(a)}}function o(){let u=e.getState().view||"issues";return T`
      <nav class="header-nav" aria-label="Primary">
        <a
          href="#/issues"
          class="tab ${u==="issues"?"active":""}"
          @click=${i("issues")}
          >Issues</a
        >
        <a
          href="#/epics"
          class="tab ${u==="epics"?"active":""}"
          @click=${i("epics")}
          >Epics</a
        >
        <a
          href="#/board"
          class="tab ${u==="board"?"active":""}"
          @click=${i("board")}
          >Board</a
        >
        <div class="queen-nav">
          <a
            href="#/messages"
            class="tab ${u==="messages"?"active":""}"
            @click=${i("messages")}
            >Messages</a
          >
          <a
            href="#/assignments"
            class="tab ${u==="assignments"?"active":""}"
            @click=${i("assignments")}
            >Assignments</a
          >
        </div>
      </nav>
    `}function l(){fe(o(),s)}return l(),r=e.subscribe(()=>l()),{destroy(){r&&(r(),r=null),fe(T``,s)}}}function mn(s,e,t,n){let r=document.createElement("dialog");r.id="new-issue-dialog",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.innerHTML=`
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
  `,s.appendChild(r);let i=r.querySelector("#new-issue-form"),o=r.querySelector("#new-title"),l=r.querySelector("#new-type"),a=r.querySelector("#new-priority"),u=r.querySelector("#new-labels"),d=r.querySelector("#new-description"),p=r.querySelector("#new-issue-error"),f=r.querySelector("#btn-cancel"),b=r.querySelector("#btn-create"),x=r.querySelector(".new-issue__close");function _(){l.replaceChildren();let k=document.createElement("option");k.value="",k.textContent="\u2014 Select \u2014",l.appendChild(k);for(let R of cs){let I=document.createElement("option");I.value=R,I.textContent=ds(R),l.appendChild(I)}a.replaceChildren();for(let R=0;R<=4;R+=1){let I=document.createElement("option");I.value=String(R);let L=Je[R]||"Medium";I.textContent=`${R} \u2013 ${L}`,a.appendChild(I)}}_();function C(){try{typeof r.close=="function"?r.close():r.removeAttribute("open")}catch{r.removeAttribute("open")}}function y(k){o.disabled=k,l.disabled=k,a.disabled=k,u.disabled=k,d.disabled=k,f.disabled=k,b.disabled=k,b.textContent=k?"Creating\u2026":"Create"}function M(){p.textContent=""}function E(k){p.textContent=k}function v(){try{let k=window.localStorage.getItem("beads-ui.new.type");k?l.value=k:l.value="";let R=window.localStorage.getItem("beads-ui.new.priority");R&&/^\d$/.test(R)?a.value=R:a.value="2"}catch{l.value="",a.value="2"}}function S(){let k=l.value||"",R=a.value||"";k.length>0&&window.localStorage.setItem("beads-ui.new.type",k),R.length>0&&window.localStorage.setItem("beads-ui.new.priority",R)}function m(k){let R=/-(\d+)$/.exec(String(k||""));return R&&R[1]?Number(R[1]):-1}async function w(){M();let k=String(o.value||"").trim();if(k.length===0){E("Title is required"),o.focus();return}let R=Number(a.value||"2");if(!(R>=0&&R<=4)){E("Priority must be 0..4"),a.focus();return}let I=String(l.value||""),L=String(d.value||""),z=String(u.value||"").split(",").map(Z=>Z.trim()).filter(Z=>Z.length>0),j={title:k};I.length>0&&(j.type=I),String(R).length>0&&(j.priority=R),L.length>0&&(j.description=L),y(!0);try{await e("create-issue",j)}catch{y(!1),E("Failed to create issue");return}S();let V=null;try{V=await e("list-issues",{filters:{status:"open",limit:50}})}catch{V=null}let Q="";if(Array.isArray(V)){let Z=V.filter(ie=>String(ie.title||"")===k);if(Z.length>0){let ie=Z[0];for(let re of Z){let de=m(ie.id||"");m(re.id||"")>de&&(ie=re)}Q=String(ie.id||"")}}if(Q&&z.length>0)for(let Z of z)try{await e("label-add",{id:Q,label:Z})}catch{}if(Q){try{t.gotoIssue(Q)}catch{}try{n&&n.setState({selected_id:Q})}catch{}}y(!1),C()}return r.addEventListener("cancel",k=>{k.preventDefault(),C()}),x.addEventListener("click",()=>C()),f.addEventListener("click",()=>C()),r.addEventListener("keydown",k=>{k.key==="Enter"&&(k.ctrlKey||k.metaKey)&&(k.preventDefault(),w())}),i.addEventListener("submit",k=>{k.preventDefault(),w()}),{open(){i.reset(),M(),v();try{"showModal"in r&&typeof r.showModal=="function"?r.showModal():r.setAttribute("open","")}catch{r.setAttribute("open","")}setTimeout(()=>{try{o.focus()}catch{}},0)},close(){C()}}}function bn(s,e,t={}){let n=ee("views:messages"),r=null,i=null,o=null,l=!1;function a(y){i=y;let v=(e.getState().queen_messages||[]).find(S=>S.id===y);v&&v.thread_id&&(o=v.thread_id),C()}function u(){l=!l,C()}function d(y){try{let M=new Date(y),v=new Date().getTime()-M.getTime(),S=Math.floor(v/6e4),m=Math.floor(v/36e5),w=Math.floor(v/864e5);return S<1?"just now":S<60?`${S}m ago`:m<24?`${m}h ago`:w<7?`${w}d ago`:M.toLocaleDateString()}catch{return y}}function p(y){let M=y.id===i,E=!y.read_at;return T`
      <div
        class="message-row ${M?"selected":""} ${E?"unread":""}"
        @click=${()=>a(y.id)}
        tabindex="0"
        @keydown=${v=>{(v.key==="Enter"||v.key===" ")&&(v.preventDefault(),a(y.id))}}
      >
        <div class="message-header">
          <span class="message-from">${y.from}</span>
          <span class="message-time">${d(y.created_at)}</span>
        </div>
        <div class="message-subject">${y.subject}</div>
        <div class="message-preview">${y.body?.slice(0,80)}${y.body?.length>80?"...":""}</div>
      </div>
    `}function f(y){return T`
      <div class="message-detail">
        <div class="message-detail-header">
          <h3>${y.subject}</h3>
          <div class="message-meta">
            <span>From: <strong>${y.from}</strong></span>
            <span>To: <strong>${y.to}</strong></span>
            <span>${d(y.created_at)}</span>
          </div>
        </div>
        <div class="message-body">
          ${y.body}
        </div>
        <div class="message-actions">
          <button class="btn btn-reply" @click=${u}>
            Reply
          </button>
        </div>
      </div>
    `}function b(){return T`
      <div class="compose-form">
        <h3>New Message</h3>
        <form @submit=${x}>
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
            <button type="button" class="btn btn-secondary" @click=${u}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    `}function x(y){y.preventDefault();let M=y.target,E=new FormData(M);n("send message: to=%s subject=%s",E.get("to"),E.get("subject")),l=!1,C()}function _(){let M=e.getState().queen_messages||[],E=M.find(w=>w.id===i),v=new Map;for(let w of M){let k=w.thread_id||w.id;v.has(k)||v.set(k,[]),v.get(k).push(w)}let S=Array.from(v.entries()).sort((w,k)=>{let R=w[1][w[1].length-1],I=k[1][k[1].length-1];return new Date(I.created_at).getTime()-new Date(R.created_at).getTime()}),m=M;return o&&(m=M.filter(w=>w.thread_id===o||w.id===o)),T`
      <div class="queen-messages">
        <div class="messages-header">
          <h2>Messages</h2>
          <div class="messages-toolbar">
            <button
              class="btn btn-compose"
              @click=${u}
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
        ${l?b():""}
        <div class="messages-container">
          <div class="messages-list">
            ${m.length===0?T`<div class="empty-state">No messages</div>`:m.map(w=>p(w))}
          </div>
          <div class="messages-detail">
            ${E?f(E):T`<div class="empty-state">Select a message to view</div>`}
          </div>
        </div>
      </div>
    `}function C(){fe(_(),s)}return{load(){n("load messages view"),C(),r=e.subscribe(()=>C())},unload(){n("unload messages view"),r&&(r(),r=null)},destroy(){r&&(r(),r=null),fe(T``,s)}}}function yn(s,e,t={}){let n=ee("views:assignments"),r=null,i=null,o=null;function l(_){try{let C=new Date(_),M=new Date().getTime()-C.getTime(),E=Math.floor(M/6e4),v=Math.floor(M/36e5),S=Math.floor(M/864e5);return E<1?"just now":E<60?`${E}m ago`:v<24?`${v}h ago`:S<7?`${S}d ago`:C.toLocaleDateString()}catch{return _}}function a(_){switch(_){case"active":return"status-active";case"completed":return"status-completed";case"blocked":return"status-blocked";case"released":return"status-released";default:return""}}function u(_){return T`
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
          ${_.status==="active"?T`<button class="btn btn-sm btn-release" @click=${()=>d(_)}>
                Release
              </button>`:""}
        </td>
      </tr>
    `}function d(_){n("release assignment: %s",_.id)}function p(_){i=i===_?null:_,x()}function f(_){o=o===_?null:_,x()}function b(){let _=e.getState(),C=_.queen_assignments||[],y=_.queen_droids||[],M=[...new Set(C.map(m=>m.status))],E=C;i&&(E=E.filter(m=>m.status===i)),o&&(E=E.filter(m=>m.droid===o)),E=E.sort((m,w)=>new Date(w.assigned_at).getTime()-new Date(m.assigned_at).getTime());let v=C.filter(m=>m.status==="active").length,S=C.filter(m=>m.status==="active").reduce((m,w)=>(m.set(w.droid,(m.get(w.droid)||0)+1),m),new Map);return T`
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
            <span class="stat-value">${v}</span>
            <span class="stat-label">Active</span>
          </div>
          ${Array.from(S.entries()).map(([m,w])=>T`
              <div
                class="stat droid-stat ${o===m?"active":""}"
                @click=${()=>f(m)}
              >
                <span class="stat-value">${w}</span>
                <span class="stat-label">${m}</span>
              </div>
            `)}
        </div>
        <div class="assignments-filters">
          ${M.map(m=>T`
              <button
                class="filter-btn ${i===m?"active":""}"
                @click=${()=>p(m)}
              >
                ${m}
              </button>
            `)}
        </div>
        <div class="assignments-table-container">
          ${E.length===0?T`<div class="empty-state">No assignments</div>`:T`
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
                    ${E.map(m=>u(m))}
                  </tbody>
                </table>
              `}
        </div>
      </div>
    `}function x(){fe(b(),s)}return{load(){n("load assignments view"),x(),r=e.subscribe(()=>x())},unload(){n("unload assignments view"),r&&(r(),r=null)},destroy(){r&&(r(),r=null),fe(T``,s)}}}var wn=["list-issues","update-status","edit-text","update-priority","create-issue","list-ready","dep-add","dep-remove","epic-status","update-assignee","label-add","label-remove","subscribe-list","unsubscribe-list","snapshot","upsert","delete"];function Vs(){let s=Date.now().toString(36),e=Math.random().toString(36).slice(2,8);return`${s}-${e}`}function kn(s,e,t=Vs()){return{id:t,type:s,payload:e}}function _n(s={}){let e=ee("ws"),t={initialMs:s.backoff?.initialMs??1e3,maxMs:s.backoff?.maxMs??3e4,factor:s.backoff?.factor??2,jitterRatio:s.backoff?.jitterRatio??.2},n=()=>s.url&&s.url.length>0?s.url:typeof location<"u"?(location.protocol==="https:"?"wss://":"ws://")+location.host+"/ws":"ws://localhost/ws",r=null,i="closed",o=0,l=null,a=!0,u=new Map,d=[],p=new Map,f=new Set;function b(v){for(let S of Array.from(f))try{S(v)}catch{}}function x(){if(!a||l)return;i="reconnecting",e("ws reconnecting\u2026"),b(i);let v=Math.min(t.maxMs||0,(t.initialMs||0)*Math.pow(t.factor||1,o)),S=(t.jitterRatio||0)*v,m=Math.max(0,Math.round(v+(Math.random()*2-1)*S));e("ws retry in %d ms (attempt %d)",m,o+1),l=setTimeout(()=>{l=null,E()},m)}function _(v){try{r?.send(JSON.stringify(v))}catch(S){e("ws send failed",S)}}function C(){for(i="open",e("ws open"),b(i),o=0;d.length;){let v=d.shift();v&&_(v)}}function y(v){let S;try{S=JSON.parse(String(v.data))}catch{e("ws received non-JSON message");return}if(!S||typeof S.id!="string"||typeof S.type!="string"){e("ws received invalid envelope");return}if(u.has(S.id)){let w=u.get(S.id);u.delete(S.id),S.ok?w?.resolve(S.payload):w?.reject(S.error||new Error("ws error"));return}let m=p.get(S.type);if(m&&m.size>0)for(let w of Array.from(m))try{w(S.payload)}catch(k){e("ws event handler error",k)}else e("ws received unhandled message type: %s",S.type)}function M(){i="closed",e("ws closed"),b(i);for(let[v,S]of u.entries())S.reject(new Error("ws disconnected")),u.delete(v);o+=1,x()}function E(){if(!a)return;let v=n();try{r=new WebSocket(v),e("ws connecting %s",v),i="connecting",b(i),r.addEventListener("open",C),r.addEventListener("message",y),r.addEventListener("error",()=>{}),r.addEventListener("close",M)}catch(S){e("ws connect failed %o",S),x()}}return E(),{send(v,S){if(!wn.includes(v))return Promise.reject(new Error(`unknown message type: ${v}`));let m=Vs(),w=kn(v,S,m);return e("send %s id=%s",v,m),new Promise((k,R)=>{u.set(m,{resolve:k,reject:R,type:v}),r&&r.readyState===r.OPEN?_(w):(e("queue %s id=%s (state=%s)",v,m,i),d.push(w))})},on(v,S){p.has(v)||p.set(v,new Set);let m=p.get(v);return m?.add(S),()=>{m?.delete(S)}},onConnection(v){return f.add(v),()=>{f.delete(v)}},close(){a=!1,l&&(clearTimeout(l),l=null);try{r?.close()}catch{}},getState(){return i}}}function io(s){let e=ee("main");e("bootstrap start");let t=T`
    <section id="issues-root" class="route issues">
      <aside id="list-panel" class="panel"></aside>
    </section>
    <section id="epics-root" class="route epics" hidden></section>
    <section id="board-root" class="route board" hidden></section>
    <section id="detail-panel" class="route detail" hidden></section>
    <section id="messages-root" class="route messages" hidden></section>
    <section id="assignments-root" class="route assignments" hidden></section>
  `;fe(t,s);let n=document.getElementById("top-nav"),r=document.getElementById("issues-root"),i=document.getElementById("epics-root"),o=document.getElementById("board-root"),l=document.getElementById("messages-root"),a=document.getElementById("assignments-root"),u=document.getElementById("list-panel"),d=document.getElementById("detail-panel");if(u&&r&&i&&o&&d&&l&&a){let y=function(A,g){let H="Request failed",U="";if(A&&typeof A=="object"){let ge=A;if(typeof ge.message=="string"&&ge.message.length>0&&(H=ge.message),typeof ge.details=="string")U=ge.details;else if(ge.details&&typeof ge.details=="object")try{U=JSON.stringify(ge.details,null,2)}catch{U=""}}else typeof A=="string"&&A.length>0&&(H=A);let ue=g&&g.length>0?`Failed to load ${g}`:"Request failed";C.open(ue,H,U)},We=function(A){let g=String(A?.status||"all");return g==="ready"?{type:"ready-issues"}:g==="in_progress"?{type:"in-progress-issues"}:g==="closed"?{type:"closed-issues"}:{type:"all-issues"}},N=function(A){if(A.view==="issues"){let g=We(A.filters||{}),H=JSON.stringify(g);try{S.register("tab:issues",g)}catch(U){e("register issues store failed: %o",U)}(!Ee||H!==Ce)&&v.subscribeList("tab:issues",g).then(U=>{Ee=U,Ce=H}).catch(U=>{e("subscribe issues failed: %o",U),y(U,"issues list")})}else if(Ee){Ee().catch(()=>{}),Ee=null,Ce=null;try{S.unregister("tab:issues")}catch(g){e("unregister issues store failed: %o",g)}}if(A.view==="epics"){try{S.register("tab:epics",{type:"epics"})}catch(g){e("register epics store failed: %o",g)}v.subscribeList("tab:epics",{type:"epics"}).then(g=>{Pe=g}).catch(g=>{e("subscribe epics failed: %o",g),y(g,"epics")})}else if(Pe){Pe().catch(()=>{}),Pe=null;try{S.unregister("tab:epics")}catch(g){e("unregister epics store failed: %o",g)}}if(A.view==="board"){if(!ke){try{S.register("tab:board:ready",{type:"ready-issues"})}catch(g){e("register board:ready store failed: %o",g)}v.subscribeList("tab:board:ready",{type:"ready-issues"}).then(g=>ke=g).catch(g=>{e("subscribe board ready failed: %o",g),y(g,"board (Ready)")})}if(!Fe){try{S.register("tab:board:in-progress",{type:"in-progress-issues"})}catch(g){e("register board:in-progress store failed: %o",g)}v.subscribeList("tab:board:in-progress",{type:"in-progress-issues"}).then(g=>Fe=g).catch(g=>{e("subscribe board in-progress failed: %o",g),y(g,"board (In Progress)")})}if(!Le){try{S.register("tab:board:closed",{type:"closed-issues"})}catch(g){e("register board:closed store failed: %o",g)}v.subscribeList("tab:board:closed",{type:"closed-issues"}).then(g=>Le=g).catch(g=>{e("subscribe board closed failed: %o",g),y(g,"board (Closed)")})}if(!ze){try{S.register("tab:board:blocked",{type:"blocked-issues"})}catch(g){e("register board:blocked store failed: %o",g)}v.subscribeList("tab:board:blocked",{type:"blocked-issues"}).then(g=>ze=g).catch(g=>{e("subscribe board blocked failed: %o",g),y(g,"board (Blocked)")})}}else{if(ke){ke().catch(()=>{}),ke=null;try{S.unregister("tab:board:ready")}catch(g){e("unregister board:ready failed: %o",g)}}if(Fe){Fe().catch(()=>{}),Fe=null;try{S.unregister("tab:board:in-progress")}catch(g){e("unregister board:in-progress failed: %o",g)}}if(Le){Le().catch(()=>{}),Le=null;try{S.unregister("tab:board:closed")}catch(g){e("unregister board:closed failed: %o",g)}}if(ze){ze().catch(()=>{}),ze=null;try{S.unregister("tab:board:blocked")}catch(g){e("unregister board:blocked failed: %o",g)}}}};var p=y,f=We,b=N;let x=document.getElementById("header-loading"),_=Tr(x),C=pn(s),M=_n(),E=_.wrapSend((A,g)=>M.send(A,g)),v=xr(E),S=Ar();M.on("snapshot",A=>{let g=A,H=g&&typeof g.id=="string"?g.id:"",U=H?S.getStore(H):null;if(U&&g&&g.type==="snapshot")try{U.applyPush(g)}catch{}}),M.on("upsert",A=>{let g=A,H=g&&typeof g.id=="string"?g.id:"",U=H?S.getStore(H):null;if(U&&g&&g.type==="upsert")try{U.applyPush(g)}catch{}}),M.on("delete",A=>{let g=A,H=g&&typeof g.id=="string"?g.id:"",U=H?S.getStore(H):null;if(U&&g&&g.type==="delete")try{U.applyPush(g)}catch{}});let m=Ye(S),w=!1;if(typeof M.onConnection=="function"){let A=g=>{e("ws state %s",g),g==="reconnecting"||g==="closed"?(w=!0,ye("Connection lost. Reconnecting\u2026","error",4e3)):g==="open"&&w&&(w=!1,ye("Reconnected","success",2200))};M.onConnection(A)}let k={status:"all",search:"",type:""};try{let A=window.localStorage.getItem("beads-ui.filters");if(A){let g=JSON.parse(A);if(g&&typeof g=="object"){let H=["bug","feature","task","epic","chore"],U="";if(typeof g.type=="string"&&H.includes(g.type))U=g.type;else if(Array.isArray(g.types)){let ue="";for(let ge of g.types)if(H.includes(String(ge))){ue=ge;break}U=ue}k={status:["all","open","in_progress","closed","ready"].includes(g.status)?g.status:"all",search:typeof g.search=="string"?g.search:"",type:U}}}}catch(A){e("filters parse error: %o",A)}let R="issues";try{let A=window.localStorage.getItem("beads-ui.view");(A==="issues"||A==="epics"||A==="board")&&(R=A)}catch(A){e("view parse error: %o",A)}let I={closed_filter:"today"};try{let A=window.localStorage.getItem("beads-ui.board");if(A){let g=JSON.parse(A);if(g&&typeof g=="object"){let H=String(g.closed_filter||"today");(H==="today"||H==="3"||H==="7")&&(I.closed_filter=H)}}}catch(A){e("board prefs parse error: %o",A)}let L=$r({filters:k,view:R,board:I}),z=Sr(L);z.start();let j=async(A,g)=>{try{return await E(A,g)}catch{return[]}};n&&gn(n,L,z);let V=mn(s,(A,g)=>E(A,g),z,L);try{let A=document.getElementById("new-issue-btn");A&&A.addEventListener("click",()=>V.open())}catch{}let Z=hn(u,async(A,g)=>{if(A==="list-issues")try{return m.selectIssuesFor("tab:issues")}catch(H){return e("list selectors failed: %o",H),[]}return j(A,g)},A=>{let g=Yt(A);g&&z.gotoIssue(g)},L,v,S);L.subscribe(A=>{let g={status:A.filters.status,search:A.filters.search,type:typeof A.filters.type=="string"?A.filters.type:""};window.localStorage.setItem("beads-ui.filters",JSON.stringify(g))}),L.subscribe(A=>{window.localStorage.setItem("beads-ui.board",JSON.stringify({closed_filter:A.board.closed_filter}))}),Z.load();let ie=fn(d,L,()=>{let A=L.getState();L.setState({selected_id:null});try{let g=A.view||"issues";z.gotoView(g)}catch{}}),re=null;re=dn(ie.getMount(),j,A=>{let g=Yt(A);g&&z.gotoIssue(g)},S);let de=L.getState().selected_id;if(de){d.hidden=!1,ie.open(de),re&&re.load(de);let A=`detail:${de}`,g={type:"issue-detail",params:{id:de}};try{S.register(A,g)}catch(H){e("register detail store failed: %o",H)}v.subscribeList(A,g).catch(H=>{e("detail subscribe failed: %o",H),y(H,"issue details")})}let oe=null;L.subscribe(A=>{let g=A.selected_id;if(g){d.hidden=!1,ie.open(g),re&&re.load(g);let H=`detail:${g}`,U={type:"issue-detail",params:{id:g}};try{S.register(H,U)}catch{}v.subscribeList(H,U).then(ue=>{oe&&oe().catch(()=>{}),oe=ue}).catch(ue=>{e("detail subscribe failed: %o",ue),y(ue,"issue details")})}else{try{ie.close()}catch{}re&&re.clear(),d.hidden=!0,oe&&(oe().catch(()=>{}),oe=null)}});let B=vr(j),Te=un(i,B,A=>z.gotoIssue(A),v,S),le=Cr(o,B,A=>z.gotoIssue(A),L,v,S),Ge=bn(l,L,{onRefresh:()=>{e("refresh messages requested")}}),te=yn(a,L,{onRefresh:()=>{e("refresh assignments requested")}}),Ee=null,Pe=null,ke=null,Fe=null,Le=null,ze=null,Ce=null,Re=A=>{r&&i&&o&&d&&l&&a&&(r.hidden=A.view!=="issues",i.hidden=A.view!=="epics",o.hidden=A.view!=="board",l.hidden=A.view!=="messages",a.hidden=A.view!=="assignments"),N(A),!A.selected_id&&A.view==="epics"&&Te.load(),!A.selected_id&&A.view==="board"&&le.load(),A.view==="messages"?Ge.load():Ge.unload(),A.view==="assignments"?te.load():te.unload(),window.localStorage.setItem("beads-ui.view",A.view)};L.subscribe(Re),Re(L.getState()),window.addEventListener("keydown",A=>{let g=A.ctrlKey||A.metaKey,H=String(A.key||"").toLowerCase(),U=A.target,ue=U&&U.tagName?String(U.tagName).toLowerCase():"",ge=ue==="input"||ue==="textarea"||ue==="select"||U&&typeof U.isContentEditable=="boolean"&&U.isContentEditable;g&&H==="n"&&(ge||(A.preventDefault(),V.open()))})}}typeof window<"u"&&typeof document<"u"&&window.addEventListener("DOMContentLoaded",()=>{try{let t=window.localStorage.getItem("beads-ui.theme"),n=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches,r=t==="dark"||t==="light"?t:n?"dark":"light";document.documentElement.setAttribute("data-theme",r);let i=document.getElementById("theme-switch");i&&(i.checked=r==="dark")}catch{}let s=document.getElementById("theme-switch");s&&s.addEventListener("change",()=>{let t=s.checked?"dark":"light";document.documentElement.setAttribute("data-theme",t),window.localStorage.setItem("beads-ui.theme",t)});let e=document.getElementById("app");e&&io(e)});export{io as bootstrap};
//# sourceMappingURL=main.bundle.js.map
