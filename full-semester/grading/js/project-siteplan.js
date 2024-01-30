// #region Set HTML Elements ******************************************
const student = document.querySelector('#student');
const getReportButton = document.querySelector('#getReport');
const report = document.querySelector('#report');
const message = document.querySelector('#message');
// #endregion Set HTML Elements ***************************************

getReportButton.addEventListener("click", getReport);
document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getReport();
  }
});

function checkURL(url) {
  return fetch(url)
    .then(res => res.ok)
    .catch(err => false);
}



async function getReport() {
  resetReport();
  let studentgh = student.value;
  if (studentgh === "") {
    student.focus();
    return;
  }
  else {
    let uri = `${studentgh}.github.io/wdd130/wwr/site-plan-rafting.html`;
    let url = `https://${uri}`;
    let rescheck = await checkURL(url);
    if (rescheck) {
      const cssStats = await cssstats(uri);
      report.innerHTML += buildReport(cssStats, uri);
    } else {
      message.style.display = 'block';
      return;
    }
  }
}

async function cssstats(baseuri) {
  let url = `https://cssstats.com/api/stats?url=${baseuri}`;
  let response = await fetch(url);
  let cssresult = await response.json();
  return cssresult;
}

function resetReport() {
  message.style.display = "none";
  report.textContent = "";
}

// #region Utility Functions ******************************************
function getSemanticElements(html) {
  let found = "";
  let semanticElements = [
    "<article",
    "<aside",
    "<details",
    "<figcaption",
    "<figure",
    "<footer",
    "<header",
    "<hgroup",
    "<main",
    "<mark",
    "<nav",
    "<section",
    "<summary",
    "<time",
  ];
  semanticElements.forEach((element) => {
    if (html.includes(element)) {
      let base = element.substring(1);
      found += `${base}, `;
    }
  });
  return found;
}

function getElement(html, element) {
  let count = 0;
  let i = 0;
  while (true) {
    let elementIndex = html.indexOf(element, i);
    if (elementIndex === -1) break;
    count++;
    i = elementIndex + 1;
  }
  return count;
}
function getContent(html, regex) {
  let match = html.match(regex);
  return match ? `&#10077;${match[1]}&#10078;` : null;
}

async function validateHTML(h) {
  let url = `https://validator.w3.org/nu/?out=json`;
  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/html'
    },
    body: h
  });
  if (response.status !== 200 || !response.ok) {
    throw new Error(`Validation failed with status code ${response.status}`);
  }
  let hResult = await response.json();

  return hResult.messages.reduce((count, message) => {
    return message.type === 'error' ? count + 1 : count;
  }, 0);

}
async function validateCSS(uri) {
  let url = `https://jigsaw.w3.org/css-validator/validator?uri=${uri}&profile=css3svg&usermedium=all&output=json`;
  let response = await fetch(url);
  if (response.status !== 200 || !response.ok) {
    throw new Error(`Validation failed with status code ${response.status}`);
  }
  let cResult = await response.json();
  let cssErrorCount = cResult.cssvalidation.result.errorcount;

  return cssErrorCount;
}
// #endregion Utility Functions ***************************************

function buildReport(data, url) {
  let h = data.css.html;
  h = h.replace(/[\n\r]/g, ""); // remove line breaks
  h = h.replace(/ {2,}/g, " "); // remove extra spaces
  let c = data.css.css;

  let htmlErrorCount, cssErrorCount;

  validateHTML(h)
    .then((htmlErrorCount) => {
      document.getElementById('hvalid').innerHTML = (htmlErrorCount === 0) ? '✅' : '❌';
      document.getElementById('htmlerrorscount').innerHTML = `Errors: ${htmlErrorCount}`;
    })
    .catch((error) => {
      document.getElementById('htmlerrorscount').innerHTML = `HTML Validation failed to report: ${error}`;
    });

  validateCSS(url)
    .then((cssErrorCount) => {
      document.getElementById('cvalid').innerHTML = (cssErrorCount === 0) ? '✅' : '❌';
      document.getElementById('csserrorscount').innerHTML = `Errors: ${cssErrorCount}`;
    })
    .catch((error) => {
      document.getElementById('csserrorscount').innerHTML = `CSS Validation failed to report: ${error}`;
    });

  return `<main>
     <h3>w3.org Validation Tools</h3>
      <div class="label">HTML</div>
      <div class="data" id="hvalid"></div>
      <div class="standard"> <span id="htmlerrorscount"></span> <a href="https://validator.w3.org/check?verbose=1&uri=${url}" target="_blank">🔗HTML Validation Link</a>
      </div>

      <div class="label">CSS</div>
      <div class="data" id="cvalid"></div>
      <div class="standard"><span id="csserrorscount"></span> <a href="https://jigsaw.w3.org/css-validator/validator?uri=${url}" target="_blank">🔗CSS Validation Link</a>
      </div>

      <h3>HTML Document</h3>
      <div class="label">Document Type:</div>
      <div class="data">${h.includes('<!DOCTYPE html>') || h.includes('<!doctype html>') ? '✅' : '❌'}</div>
      <div class="standard">&lt;!DOCTYPE html&gt; or &lt;!doctype html&gt; <span class="blue">This should be on the first line.</span></div>

      <div class="label">HTML Lang Attribute:</div>
      <div class="data">${h.includes('<html lang="') && h.indexOf('<html') < h.indexOf('<head') ? '✅' : '❌'}</div>
      <div class="standard">&lt;html lang="en-US"&gt; <span class="blue">Encases the entire document</span></div>

      <div class="label">&lt;head&gt; element</div>
      <div class="data">${h.includes('<head>') && h.includes('</head>') && h.indexOf('</head>') < h.indexOf('<body') ? '✅' : '❌'}</div>
      <div class="standard">&lt;head&gt; ... &lt;/head&gt; <span class="blue">Start tag and end tag before the &lt;body&gt; element</span></div>

      <div class="label">&lt;body&gt; element</div>
      <div class="data">${h.includes('<body') && h.includes('</body>') && h.indexOf('</body>') < h.indexOf('</html>') ? '✅' : '❌'}</div>
      <div class="standard">&lt;body&gt; ... &lt;/body&gt; <span class="blue">Closes before the closing &lt;/html&gt; element</span></div>

      <h3>&lt;head&gt; Elements</h3>

      <div class="label">Meta Charset:</div>
      <div class="data">${h.includes('<meta charset="utf-8"') > 0 || h.includes('<meta charset="UTF-8"') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;meta charset="UTF-8"&gt;</span></div>

      <div class="label">Meta Viewport:</div>
      <div class="data">${h.includes('<meta name="viewport"') > 0 ? '✅' : '❌'}</div>
      <div class="standard">&lt;meta name="viewport" content="width=device-width,initial-scale=1.0"&gt;</div>

      <div class="label">Title:</div>
      <div class="data">${data.css.pageTitle.includes("Site Plan") ? "👀" : "❌"}</div>
      <div class="standard">${data.css.pageTitle} <span class="blue">Must include the words "Site Plan".</span></div>

      <div class="label">Meta Description:</div>
      <div class="data">${h.includes('<meta name="description"') > 0 ? "👀" : "❌"}</div>
      <div class="standard">${getContent(h,/<meta\s+name="description"\s+content="([^"]+)"/i)} <span class="blue">Check for relevance.</span></div>

      <div class="label">Meta Author:</div>
      <div class="data">${h.includes('name="author"') > 0 ? "✅" : "❌"}</div>
      <div class="standard">${getContent(
        h,
        /<meta\s+name="author"\s+content="([^"]+)"/i
  )}</div>

      <h3>&lt;body&gt; Elements</h3>

      <div class="label">&lt;header&gt;</div>
      <div class="data">${h.includes('<header') && h.includes('</header>') && h.indexOf("<header") > h.indexOf("<body") ? '✅' : '❌'}</div>
      <div class="standard"></div>

      <div class="label">&lt;h1&gt;</div>
      <div class="data">${h.includes("<h1") && h.includes("</h1>") && getElement(h, "<h1") == 1 ? "✅" : "❌"}</div>
      <div class="standard">${getContent(h,/<h1.*>(.*?)<\/h1>/)} <span class="blue">Only 1 &lt;h1&gt; allowed and it should resemble the &lt;title&gt;</span></div>

      <div class="label">&lt;main&gt;</div>
      <div class="data">${h.includes('<main') && h.includes('</main>') && h.indexOf("<main>") > h.indexOf("</header>") && h.indexOf("</main>") < h.indexOf("<footer>") ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">Located between the &lt;header&gt; and &lt;footer&gt;</div>

      <div class="label">&lt;h2&gt;</div>
      <div class="data">${getElement(h, "<h2") >= 4 ? "✅" : "❌"}</div>
      <div class="standard">${getElement(h, "</h2>")} found of 4 total required</div>

      <div class="label">&lt;h3&gt;</div>
      <div class="data">${getElement(h, "<h3") >= 8 ? "✅" : "❌"}</div>
      <div class="standard">${getElement(h, "</h3>")} found of 8 total required</div>

      <div class="label">&lt;p&gt;</div>
      <div class="data">${getElement(h, "</p>") >= 6 ? "✅" : "❌"}</div>
      <div class="standard">${getElement(h, "</p>")} found of 6 total required</div>

      <div class="label">&lt;h4&gt;</div>
      <div class="data">${getElement(h, "<h4") >= 3 ? "✅" : "❌"}</div>
      <div class="standard">${getElement(h, "</h4>")} found of 3 total required</div>

      <div class="label">&lt;nav&gt;</div>
      <div class="data">${h.includes(h, "<nav>") && h.includes("</nav>") && h.indexOf("<nav>") > h.indexOf("<main>") && h.indexOf("</nav>") < h.indexOf("</main>") && getElement(h, "</nav>") === 1 ? "✅" : "❌"}</div>
      <div class="standard">${getElement(h, "<nav")} found of 1 required</div>

      <div class="label">&lt;img&gt;</div>
      <div class="data">${getElement(h, "<img") >= 2 ? "✅" : "❌"}</div>
      <div class="standard">${getElement(h, "<img")} found of at least 2 total required</div>

      <div class="label">anchor Elements:</div>
      <div class="data">${getElement(h, "<a") >= 3 ? "✅" : "❌"}</div>
      <div class="standard">${getElement(h, "<a")} / 4</div>

      <div class="label">&lt;footer&gt;</div>
      <div class="data">${h.includes('<footer') && h.includes('</footer>') && h.indexOf('<footer') > h.indexOf('</aside>') && h.indexOf('</footer>') < h.indexOf('</body>') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">Located at the end of the document and before the closing body tag.</span></div>

      <h3>CSS</h3>

      <div class="label">External CSS:</div>
      <div class="data">${data.css.links[0].link === "styles/site-plan-rafting.css" ? "✅" : "❌"}</div>
      <div class="standard">${data.css.links[0].link || "not found"}</div>

      <div class="label">@import Font(s):</div>
      <div class="data">${c.includes("@import") ? "✅" : "❌"}</div>
      <div class="standard"><span class="blue">Of the form: @import url('https://fonts.googleapis.com/css2?family ...</span></div>

      <div class="label">:root Selector:</div>
      <div class="data">${
        c.includes(":root {") || c.includes(":root{") ? "✅" : "❌"
      }</div>
      <div class="standard"></div>

      <div class="label">CSS Variables</div>
      <div class="data">
        ${
          c.includes("--primary-color:") &&
          c.includes("--secondary-color:") &&
          c.includes("--accent1-color:") &&
          c.includes("--accent2-color:") &&
          c.includes("--heading-font:") &&
          c.includes("--paragraph-font:") &&
          c.includes("--nav-background-color:") &&
          c.includes("--nav-link-color:") &&
          c.includes("--nav-hover-link-color:") &&
          c.includes("--nav-hover-background-color:")
            ? "✅"
            : "❌"
        }</div>
      <div class="standard"><strong>Required CSS Variables</strong>: primary-color, secondary-color, accent1-color, accent2-color, heading-font, paragraph-font, nav-background-color, nav-link-color, nav-hover-link-color, and nav-hover-background-color</div>

      <div class="label">CSS Variable Values:</div>
      <div class="data">${
        c.includes("XXXXXX") || c.includes("______") ? "❌" : "✅"
      }</div>
      <div class="standard">CSS variable custom values must replace the XXXXXX and ______ placeholders provided in the instructions.</div>

      <div class="label">body Rule:</div>
      <div class="data">${
        c.includes("body {") || c.includes("body{") ? "✅" : "❌"
      }</div>
      <div class="standard">body { .. }</div>

      <div class="label">Headings Grouped:</div>
      <div class="data">${c.includes("h1, h2, h3, h4, h5, h6") || c.includes("h1,h2,h3,h4,h5,h6") || (c.includes("h1,") && c.includes("h2,") && c.includes("h3,") && c.includes("h4,") && c.includes("h5,") && c.includes("h6"))? "✅" : "❌"}</div>
      <div class="standard">h1, h2, h3, h4, h5, h6 { ... }</div>

      <div class="label">header Rule:</div>
      <div class="data">${c.includes("header") ? "✅" : "❌"}</div>
      <div class="standard">header { .. }</div>

      <div class="label">p Rule:</div>
      <div class="data">${c.includes("p") ? "✅" : "❌"}</div>
      <div class="standard">p { .. }</div>

      <div class="label">nav Rules:</div>
      <div class="data">${
        c.includes("nav") &&
        c.includes("nav a") &&
        c.includes("nav a:link") &&
        c.includes("nav a:visited") &&
        c.includes("nav a:hover")
          ? "✅"
          : "❌"
      }</div>
      <div class="standard">Required CSS Rules: nav | nav a | nav a:link | nav a:visited | nav a:hover</div>

      <div class="label">Emedded or Inline CSS</div>
      <div class="data">${data.css.styles.length === 0 && h.indexOf("style=") < 0 ? "✅" : "❌"}</div>
      <div class="standard"><span class="blue">Embedded and inline styles are not permitted in this class.</span></div>


    </main>`;

}
