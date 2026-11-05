// src/components/styles.ts
var styles_default = `
.search {
  min-width: fit-content;
  max-width: 14rem;
}

@media all and (max-width: 800px) {
  .search {
    flex-grow: 0.3;
  }
}

.search > .search-button {
  background-color: transparent;
  border: 1px var(--lightgray) solid;
  border-radius: 4px;
  font-family: inherit;
  font-size: inherit;
  height: 2rem;
  padding: 0 1rem 0 0;
  display: flex;
  align-items: center;
  text-align: inherit;
  cursor: pointer;
  white-space: nowrap;
  width: 100%;
}

.search > .search-button > p {
  display: inline;
  color: var(--gray);
  text-wrap: unset;
}

.search > .search-button svg {
  cursor: pointer;
  width: 18px;
  min-width: 18px;
  margin: 0 0.5rem;
}

.search > .search-button svg .search-path {
  stroke: var(--darkgray);
  stroke-width: 1.5px;
  transition: stroke 0.5s ease;
}

.search > .search-container {
  position: fixed;
  contain: layout;
  z-index: var(--search-z-index, 999);
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  display: none;
  backdrop-filter: blur(4px);
}

.search > .search-container.active {
  display: inline-block;
}

.search .search-space {
  width: 65%;
  margin: 12vh auto 0;
}

@media all and not (min-width: 1200px) {
  .search .search-space {
    width: 90%;
  }
}

.search .search-space > * {
  width: 100%;
  border-radius: 7px;
  background: var(--light);
  box-shadow:
    0 14px 50px rgba(27, 33, 48, 0.12),
    0 10px 30px rgba(27, 33, 48, 0.16);
  margin-bottom: 2em;
}

.search .search-bar {
  box-sizing: border-box;
  padding: 0.5em 1em;
  font-family: var(--bodyFont);
  color: var(--dark);
  font-size: 1.1em;
  border: 1px solid var(--lightgray);
}

.search .search-bar:focus {
  outline: none;
}

.search .search-layout {
  display: none;
  flex-direction: row;
  border: 1px solid var(--lightgray);
  box-sizing: border-box;
}

.search .search-layout.display-results {
  display: flex;
}

.search .search-layout > div {
  height: 63vh;
  border-radius: 5px;
}

.search .search-layout[data-preview] > .results-container {
  flex: 0 0 min(30%, 450px);
}

@media all and not (max-width: 800px) {
  .search .search-layout[data-preview] .card-description {
    display: none;
  }

  .search .search-layout[data-preview] > .results-container {
    border-right: 1px solid var(--lightgray);
    border-top-right-radius: unset;
    border-bottom-right-radius: unset;
  }

  .search .search-layout[data-preview] > .preview-container {
    border-top-left-radius: unset;
    border-bottom-left-radius: unset;
  }
}

@media all and (max-width: 800px) {
  .search .search-layout {
    flex-direction: column;
  }

  .search .search-layout > .preview-container {
    display: none !important;
  }

  .search .search-layout[data-preview] > .results-container {
    width: 100%;
    height: auto;
    max-height: 60vh;
    flex: 0 0 100%;
  }
}

.search .search-layout .highlight {
  background: color-mix(in srgb, var(--tertiary) 60%, rgba(255, 255, 255, 0));
  border-radius: 5px;
  scroll-margin-top: 2rem;
}

.search .preview-container {
  flex-grow: 1;
  display: block;
  overflow-y: auto;
  font-family: inherit;
  color: var(--dark);
  line-height: 1.5em;
  font-weight: 400;
  padding: 0 2rem;
}

.search .preview-container .preview-inner {
  margin: 0 auto;
  width: 100%;
}

.search .preview-container a[role="anchor"] {
  background-color: transparent;
}

.search .results-container {
  overflow-y: auto;
}

.search .result-card {
  overflow: hidden;
  padding: 1em;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid var(--lightgray);
  width: 100%;
  display: block;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  text-align: left;
  outline: none;
  font-weight: inherit;
  text-decoration: none;
  color: var(--dark);
}

.search a.result-card:hover,
.search a.result-card:focus,
.search a.result-card.focus {
  background: var(--lightgray);
}

.search .result-card > h3 {
  margin: 0;
  color: var(--secondary);
}

.search .result-card > p {
  margin-bottom: 0;
  margin-top: 0.5em;
  font-size: 0.9em;
  color: var(--gray);
}

.search .result-card.no-match {
  cursor: default;
}

.search-jump-target {
  background: color-mix(in srgb, var(--tertiary) 40%, rgba(255, 255, 255, 0));
  border-radius: 3px;
  transition: background 1s ease;
}

.search-jump-target.fade-out {
  background: transparent;
}
`;

// src/components/scripts/search.inline.ts
var search_inline_default = 'function w(e){return[...new Set(e.toLowerCase().split(/\\s+/).filter(Boolean))]}function L(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll(\'"\',"&quot;").replaceAll("\'","&#039;")}function O(e,o){let c=0;for(let r=e.indexOf(o);r!==-1;r=e.indexOf(o,r+o.length))c++;return c}function S(e){if(e.length===0)return null;let o=[...e].sort((c,r)=>r.length-c.length).map(c=>c.replace(/[.*+?^${}()|[\\]\\\\]/g,"\\\\$&")).join("|");return new RegExp(o,"gi")}function C(e,o){let c=S(o);if(!c)return L(e);let r="",i=0;for(let n of e.matchAll(c))r+=L(e.slice(i,n.index)),r+=`<span class="highlight">${L(n[0])}</span>`,i=n.index+n[0].length;return r+L(e.slice(i))}function $(e,o,c){let r=c.map(m=>o.indexOf(m)).filter(m=>m!==-1),i=r.length>0?Math.min(...r):0,n=Math.max(0,i-30),l=Math.min(e.length,n+140),a=n>0?"\\u2026":"",s=l<e.length?"\\u2026":"";return a+C(e.slice(n,l),c)+s}function D(e,o,c){let r=w(o);if(r.length===0)return[];let i=[];for(let n of e){let l=n.title.toLowerCase(),a=n.content.toLowerCase();r.every(s=>l.includes(s)||a.includes(s))&&i.push({doc:n,lowerContent:a,titleHits:r.filter(s=>l.includes(s)).length,count:r.reduce((s,m)=>s+O(a,m),0)})}return i.sort((n,l)=>l.titleHits-n.titleHits||l.count-n.count),i.slice(0,c).map(({doc:n,lowerContent:l})=>({slug:n.slug,title:C(n.title,r),snippet:$(n.content,l,r)}))}var F=8,b=null,P=new Map,q=[],M="quartz-simple-search:query";function v(e,o,c){e.addEventListener(o,c),q.push(()=>e.removeEventListener(o,c))}async function _(){if(!b){let e=await fetchData;b=Object.entries(e).map(([o,c])=>({slug:o,title:c.title??"",content:(c.content??"").replace(/\\s+/g," ").trim()}))}return b}function I(e){let o=document.body.dataset.basepath??"",c=e==="index"?"":e.replace(/(^|\\/)index$/,"$1");return`${o}/${c}`}async function W(e){let o=P.get(e);if(o)return o;let c=new URL(I(e),location.origin).toString();try{let r=await fetch(c);if(!r.ok)return[];let i=new DOMParser().parseFromString(await r.text(),"text/html");for(let l of Array.from(i.querySelectorAll("[href], [src]"))){let a=l.hasAttribute("href")?"href":"src",s=l.getAttribute(a);s&&!/^(?:[a-z]+:|#|\\/)/i.test(s)&&l.setAttribute(a,new URL(s,c).toString())}let n=Array.from(i.getElementsByClassName("popover-hint"));return P.set(e,n),n}catch{return[]}}function z(e,o){let c=S(o);if(!c)return;let r=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),i=[];for(let n=r.nextNode();n;n=r.nextNode())i.push(n);for(let n of i){let l=n.nodeValue??"",a=[...l.matchAll(c)];if(a.length===0)continue;let s=document.createDocumentFragment(),m=0;for(let f of a){s.append(l.slice(m,f.index));let g=document.createElement("span");g.className="highlight",g.textContent=f[0],s.append(g),m=f.index+f[0].length}s.append(l.slice(m)),n.replaceWith(s)}}function B(){let e=sessionStorage.getItem(M);if(e===null)return;sessionStorage.removeItem(M);let o=S(w(e)),c=document.querySelector(".center article");if(!o||!c)return;let r=document.createTreeWalker(c,NodeFilter.SHOW_TEXT);for(let i=r.nextNode();i;i=r.nextNode()){let n=i;o.lastIndex=0;let l=o.exec(n.nodeValue??"");if(!l)continue;let a=n.splitText(l.index);a.splitText(l[0].length);let s=document.createElement("span");s.className="search-jump-target",a.replaceWith(s),s.append(a);let m=()=>s.scrollIntoView({block:"center",behavior:"instant"}),f=new ResizeObserver(m),g=["wheel","touchstart","keydown"],y=()=>{f.disconnect(),g.forEach(p=>window.removeEventListener(p,y))};f.observe(c),g.forEach(p=>window.addEventListener(p,y,{passive:!0})),setTimeout(()=>s.classList.add("fade-out"),2e3),setTimeout(()=>{y();let p=s.parentNode;s.replaceWith(...s.childNodes),p?.normalize()},3e3);return}}function U(e){let o=e.querySelector(".search-container"),c=e.querySelector(".search-button"),r=e.querySelector(".search-bar"),i=e.querySelector(".search-layout"),n=e.querySelector(".results-container");if(!o||!c||!r||!i||!n)return;let l=i.querySelector(".preview-container"),a=o.closest(".sidebar"),s=null,m=0,f,g=()=>Array.from(n.querySelectorAll("a.result-card")),y=async t=>{if(!l)return;let u=++m,E=t?await W(t.dataset.slug??""):[];if(u!==m)return;let d=document.createElement("div");d.className="preview-inner";let h=w(r.value);for(let H of E){let N=H.cloneNode(!0);z(N,h),d.append(N)}l.replaceChildren(d);let x=d.querySelector(".highlight");if(x){let H=x.getBoundingClientRect().top-l.getBoundingClientRect().top;l.scrollTop=Math.max(0,H-50)}},p=t=>{s?.classList.remove("focus"),s=t,s?.classList.add("focus"),s?.scrollIntoView({block:"nearest"}),clearTimeout(f),f=setTimeout(()=>y(s),150)},k=t=>{let u=g();if(u.length===0)return;let E=s?u.indexOf(s):t>0?-1:u.length;p(u[Math.min(Math.max(E+t,0),u.length-1)]??null)},A=()=>{a&&(a.style.zIndex="9999"),o.classList.add("active"),c.setAttribute("aria-expanded","true"),r.focus()},T=()=>{o.classList.remove("active"),a&&(a.style.zIndex=""),c.setAttribute("aria-expanded","false"),r.value="",i.classList.remove("display-results"),n.replaceChildren(),l?.replaceChildren(),s=null},K=async()=>{let t=r.value,u=t.trim()!=="";if(i.classList.toggle("display-results",u),!u){n.replaceChildren(),p(null);return}let E=D(await _(),t,F);if(r.value===t){if(E.length===0){let d=document.createElement("div");d.className="result-card no-match";let h=document.createElement("h3");h.textContent=i.dataset.noResults??"";let x=document.createElement("p");x.textContent=i.dataset.noResultsHint??"",d.append(h,x),n.replaceChildren(d),p(null);return}n.replaceChildren(...E.map(d=>{let h=document.createElement("a");return h.className="result-card",h.href=I(d.slug),h.dataset.slug=d.slug,h.innerHTML=`<h3 class="card-title">${d.title}</h3><p class="card-description">${d.snippet}</p>`,h})),p(g()[0]??null)}};v(c,"click",t=>{t.stopPropagation(),A()}),v(o,"click",t=>{t.target===o&&T()}),v(r,"input",K),v(r,"keydown",t=>{if(!t.isComposing){if(t.key==="ArrowDown"||t.key==="Tab"&&!t.shiftKey)t.preventDefault(),k(1);else if(t.key==="ArrowUp"||t.key==="Tab"&&t.shiftKey)t.preventDefault(),k(-1);else if(t.key==="Enter"&&s){t.preventDefault();let u=s;sessionStorage.setItem(M,r.value),u.click(),T()}}}),v(n,"mouseover",t=>{let u=t.target.closest("a.result-card");u&&u!==s&&p(u)}),v(n,"click",t=>{let u=t.target.closest("a.result-card"),E=t.ctrlKey||t.metaKey||t.shiftKey||t.altKey;u&&!E&&(sessionStorage.setItem(M,r.value),T())}),v(document,"keydown",t=>{t.key.toLowerCase()==="k"&&(t.ctrlKey||t.metaKey)?(t.preventDefault(),o.classList.contains("active")?T():A()):t.key==="Escape"&&o.classList.contains("active")&&(t.preventDefault(),T())})}function R(){q.splice(0).forEach(e=>e()),document.querySelectorAll(".search").forEach(U),B()}document.addEventListener("nav",R);document.addEventListener("render",R);\n';

// src/components/SimpleSearch.tsx
import { jsx, jsxs } from "preact/jsx-runtime";
var strings = {
  zh: { title: "\u641C\u7D22", placeholder: "\u641C\u7D22\u5185\u5BB9...", noResults: "\u6CA1\u6709\u7ED3\u679C\u3002", hint: "\u8BF7\u5C1D\u8BD5\u5176\u4ED6\u641C\u7D22\u8BCD\u3002" },
  en: {
    title: "Search",
    placeholder: "Search for something...",
    noResults: "No results.",
    hint: "Try another search term?"
  }
};
var SimpleSearch_default = ((userOpts) => {
  const opts = { enablePreview: true, ...userOpts };
  const SimpleSearch = ({ displayClass, cfg }) => {
    const t = (cfg.locale ?? "en-US").startsWith("zh") ? strings.zh : strings.en;
    return /* @__PURE__ */ jsxs("div", { class: ["search", displayClass].filter(Boolean).join(" "), children: [
      /* @__PURE__ */ jsxs("button", { class: "search-button", "aria-label": t.title, "aria-expanded": "false", children: [
        /* @__PURE__ */ jsxs("svg", { role: "img", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 19.9 19.7", children: [
          /* @__PURE__ */ jsx("title", { children: t.title }),
          /* @__PURE__ */ jsxs("g", { class: "search-path", fill: "none", children: [
            /* @__PURE__ */ jsx("path", { "stroke-linecap": "square", d: "M18.5 18.3l-5.4-5.4" }),
            /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "7" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { children: t.title })
      ] }),
      /* @__PURE__ */ jsx("div", { class: "search-container", children: /* @__PURE__ */ jsxs("div", { class: "search-space", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            autocomplete: "off",
            class: "search-bar",
            name: "search",
            type: "text",
            "aria-label": t.placeholder,
            placeholder: t.placeholder
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            class: "search-layout",
            "data-preview": opts.enablePreview ? "true" : void 0,
            "data-no-results": t.noResults,
            "data-no-results-hint": t.hint,
            children: [
              /* @__PURE__ */ jsx("div", { class: "results-container", role: "listbox", "aria-label": t.title }),
              opts.enablePreview && /* @__PURE__ */ jsx("div", { class: "preview-container" })
            ]
          }
        )
      ] }) })
    ] });
  };
  SimpleSearch.afterDOMLoaded = search_inline_default;
  SimpleSearch.css = styles_default;
  return SimpleSearch;
});
export {
  SimpleSearch_default as SimpleSearch
};
