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
`;

// src/components/scripts/search.inline.ts
var search_inline_default = 'function w(e){return[...new Set(e.toLowerCase().split(/\\s+/).filter(Boolean))]}function L(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll(\'"\',"&quot;").replaceAll("\'","&#039;")}function O(e,c){let s=0;for(let r=e.indexOf(c);r!==-1;r=e.indexOf(c,r+c.length))s++;return s}function M(e){if(e.length===0)return null;let c=[...e].sort((s,r)=>r.length-s.length).map(s=>s.replace(/[.*+?^${}()|[\\]\\\\]/g,"\\\\$&")).join("|");return new RegExp(c,"gi")}function k(e,c){let s=M(c);if(!s)return L(e);let r="",i=0;for(let n of e.matchAll(s))r+=L(e.slice(i,n.index)),r+=`<span class="highlight">${L(n[0])}</span>`,i=n.index+n[0].length;return r+L(e.slice(i))}function $(e,c,s){let r=s.map(m=>c.indexOf(m)).filter(m=>m!==-1),i=r.length>0?Math.min(...r):0,n=Math.max(0,i-30),l=Math.min(e.length,n+140),u=n>0?"\\u2026":"",o=l<e.length?"\\u2026":"";return u+k(e.slice(n,l),s)+o}function C(e,c,s){let r=w(c);if(r.length===0)return[];let i=[];for(let n of e){let l=n.title.toLowerCase(),u=n.content.toLowerCase();r.every(o=>l.includes(o)||u.includes(o))&&i.push({doc:n,lowerContent:u,titleHits:r.filter(o=>l.includes(o)).length,count:r.reduce((o,m)=>o+O(u,m),0)})}return i.sort((n,l)=>l.titleHits-n.titleHits||l.count-n.count),i.slice(0,s).map(({doc:n,lowerContent:l})=>({slug:n.slug,title:k(n.title,r),snippet:$(n.content,l,r)}))}var I=8,S=null,D=new Map,P=[];function g(e,c,s){e.addEventListener(c,s),P.push(()=>e.removeEventListener(c,s))}async function F(){if(!S){let e=await fetchData;S=Object.entries(e).map(([c,s])=>({slug:c,title:s.title??"",content:(s.content??"").replace(/\\s+/g," ").trim()}))}return S}function N(e){let c=document.body.dataset.basepath??"",s=e==="index"?"":e.replace(/(^|\\/)index$/,"$1");return`${c}/${s}`}async function B(e){let c=D.get(e);if(c)return c;let s=new URL(N(e),location.origin).toString();try{let r=await fetch(s);if(!r.ok)return[];let i=new DOMParser().parseFromString(await r.text(),"text/html");for(let l of Array.from(i.querySelectorAll("[href], [src]"))){let u=l.hasAttribute("href")?"href":"src",o=l.getAttribute(u);o&&!/^(?:[a-z]+:|#|\\/)/i.test(o)&&l.setAttribute(u,new URL(o,s).toString())}let n=Array.from(i.getElementsByClassName("popover-hint"));return D.set(e,n),n}catch{return[]}}function _(e,c){let s=M(c);if(!s)return;let r=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),i=[];for(let n=r.nextNode();n;n=r.nextNode())i.push(n);for(let n of i){let l=n.nodeValue??"",u=[...l.matchAll(s)];if(u.length===0)continue;let o=document.createDocumentFragment(),m=0;for(let h of u){o.append(l.slice(m,h.index));let E=document.createElement("span");E.className="highlight",E.textContent=h[0],o.append(E),m=h.index+h[0].length}o.append(l.slice(m)),n.replaceWith(o)}}function U(e){let c=e.querySelector(".search-container"),s=e.querySelector(".search-button"),r=e.querySelector(".search-bar"),i=e.querySelector(".search-layout"),n=e.querySelector(".results-container");if(!c||!s||!r||!i||!n)return;let l=i.querySelector(".preview-container"),u=c.closest(".sidebar"),o=null,m=0,h,E=()=>Array.from(n.querySelectorAll("a.result-card")),q=async t=>{if(!l)return;let a=++m,d=t?await B(t.dataset.slug??""):[];if(a!==m)return;let p=document.createElement("div");p.className="preview-inner";let f=w(r.value);for(let x of d){let b=x.cloneNode(!0);_(b,f),p.append(b)}l.replaceChildren(p);let v=p.querySelector(".highlight");if(v){let x=v.getBoundingClientRect().top-l.getBoundingClientRect().top;l.scrollTop=Math.max(0,x-50)}},y=t=>{o?.classList.remove("focus"),o=t,o?.classList.add("focus"),o?.scrollIntoView({block:"nearest"}),clearTimeout(h),h=setTimeout(()=>q(o),150)},H=t=>{let a=E();if(a.length===0)return;let d=o?a.indexOf(o):t>0?-1:a.length;y(a[Math.min(Math.max(d+t,0),a.length-1)]??null)},A=()=>{u&&(u.style.zIndex="9999"),c.classList.add("active"),s.setAttribute("aria-expanded","true"),r.focus()},T=()=>{c.classList.remove("active"),u&&(u.style.zIndex=""),s.setAttribute("aria-expanded","false"),r.value="",i.classList.remove("display-results"),n.replaceChildren(),l?.replaceChildren(),o=null},K=async()=>{let t=r.value,a=t.trim()!=="";if(i.classList.toggle("display-results",a),!a){n.replaceChildren(),y(null);return}let d=C(await F(),t,I);if(r.value===t){if(d.length===0){let p=document.createElement("div");p.className="result-card no-match";let f=document.createElement("h3");f.textContent=i.dataset.noResults??"";let v=document.createElement("p");v.textContent=i.dataset.noResultsHint??"",p.append(f,v),n.replaceChildren(p),y(null);return}n.replaceChildren(...d.map(p=>{let f=document.createElement("a");return f.className="result-card",f.href=N(p.slug),f.dataset.slug=p.slug,f.innerHTML=`<h3 class="card-title">${p.title}</h3><p class="card-description">${p.snippet}</p>`,f})),y(E()[0]??null)}};g(s,"click",t=>{t.stopPropagation(),A()}),g(c,"click",t=>{t.target===c&&T()}),g(r,"input",K),g(r,"keydown",t=>{t.isComposing||(t.key==="ArrowDown"||t.key==="Tab"&&!t.shiftKey?(t.preventDefault(),H(1)):t.key==="ArrowUp"||t.key==="Tab"&&t.shiftKey?(t.preventDefault(),H(-1)):t.key==="Enter"&&o&&(t.preventDefault(),o.click(),T()))}),g(n,"mouseover",t=>{let a=t.target.closest("a.result-card");a&&a!==o&&y(a)}),g(n,"click",t=>{let a=t.target.closest("a.result-card"),d=t.ctrlKey||t.metaKey||t.shiftKey||t.altKey;a&&!d&&T()}),g(document,"keydown",t=>{t.key.toLowerCase()==="k"&&(t.ctrlKey||t.metaKey)?(t.preventDefault(),c.classList.contains("active")?T():A()):t.key==="Escape"&&c.classList.contains("active")&&(t.preventDefault(),T())})}function R(){P.splice(0).forEach(e=>e()),document.querySelectorAll(".search").forEach(U)}document.addEventListener("nav",R);document.addEventListener("render",R);\n';

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
