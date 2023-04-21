import { Markdown } from "../index";

function gmgcc(content: string) {
  const re = /\[gmacc title="(.+)" ?(close|open)?]([\S\s]+?)\[\/gmacc]/gm;
  if (content.search(re) === -1) {
    return false;
  }
  let index = 0;
  const handleAcc = (
    match: string /* 匹配到的字符串 */,
    p1: string,
    p2: string,
    p3: string
    /* offset: number,
    string: string /* 原始字符串 */
  ) => {
    index++;
    p3 = Markdown.render(p3);

    return `<div class="accordion-item my-3 shadow-sm rounded border-0">
      <div class="accordion-header" id="headingOne">
        <button class="accordion-button ${
          p2 === "close" ? "collapsed" : ""
        }" type="button" data-bs-toggle="collapse" data-bs-target="#aricle-gmacc-${index}">
        ${p1}
          <i class="menu-icon-arrow"></i>
        </button>
      </div>
      <div id="aricle-gmacc-${index}" class="accordion-collapse collapse ${
      p2 === "close" ? "" : "show"
    }" >
          <div class="accordion-body">
            ${p3}</div>
      </div>
    </div>`;
  };
  return content.replace(re, handleAcc);
}

function gmTab(content: string) {
  const tabs = /\[gmtab]([\S\s]*?)\[\/gmtab]/gm;
  if (content.search(tabs) === -1) {
    return false;
  }
  const tab = /\[tab name="(\w+)" ?(active)?]([\S\s]*?)\[\/tab]/gm;
  let num = 0;
  const handleTab = (match: string /* 匹配到的字符串 */, p1: string) => {
    if (p1.search(tab) === -1) return "空的tab";
    const a = [...p1.matchAll(tab)];
    const gentitle = () => {
      let out = "";
      a.forEach((v, idx) => {
        out += `<li class="nav-item"><a class="nav-link ${
          v[2] || ""
        }" data-bs-toggle="tab" href="#gmtab${num}-content-${idx}">${
          v[1]
        }</a></li>`;
      });
      return out;
    };
    const gencontent = () => {
      let out = "";
      a.forEach((v, idx) => {
        out += `<div id="gmtab${num}-content-${idx}" class="tab-pane p-3 fade ${
          v[2] === "active" ? "active show" : ""
        }">${Markdown.render(v[3])}</div>`;
      });
      return out;
    };
    const titles = `<ul class="nav nav-tabs" role="tablist">${gentitle()}</ul>`;
    const contents = `<div class="tab-content overflow-auto">${gencontent()}</div>`;
    num++;
    return `<div class="my-3 shadow-sm">${titles}${contents}</div>`;
  };

  return content.replace(tabs, handleTab);
}

function addClass(content: string) {
  // table
  const tablereg = /<table>([\S\s]*?)<\/table>/gm;
  if (content.search(tablereg) === -1) return false;
  return content.replace(
    tablereg,
    "<table class='table table-bordered table-hover w-auto'>$1</table>"
  );
}

export default function customTrans(content: string) {
  let output = content;
  output = gmgcc(output) || output;
  output = gmTab(output) || output;

  output = Markdown.render(output);

  // 渲染成html之后
  output = addClass(output) || output;

  return output;
}
