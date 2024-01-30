// #region Set HTML Elements ******************************************
const student = document.querySelector('#student');
const getReportButton = document.querySelector('#getReport');
const report = document.querySelector('#report');
const message = document.querySelector('#message');
// #endregion Set HTML Elements ***************************************

getReportButton.addEventListener('click', getReport);
document.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
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
    let uri = `${studentgh}.github.io/wdd130/wwr/about.html`;
    let url = `https://${uri}`;
    let rescheck = await checkURL(url);
    if (rescheck) {
      const cssStats = await cssstats(uri);
      report.innerHTML += buildReport(cssStats, uri);
    } else {
      message.style.display = "block";
      return;
    }
  }
}

async function cssstats(baseuri) {
  let url = `https://cssstats.com/api/stats?url=${baseuri}`;
  let response = await fetch(url);
  let cssresult = await response.json();
  console.log(cssresult);
  return cssresult;
}

function resetReport() {
  report.textContent = '';
}

// #region Utility Functions ******************************************
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

  htmlErrorCount = hResult.messages.reduce((count, message) => {
    return message.type === 'error' ? count + 1 : count;
  }, 0);

  return htmlErrorCount;
}

async function validateCSS(uri) {
  let url = `https://jigsaw.w3.org/css-validator/validator?uri=${uri}&profile=css3svg&usermedium=all&output=json`;
  let response = await fetch(url);
  if (response.status !== 200 || !response.ok) {
    throw new Error(`Validation failed with status code ${response.status}`);
  }
  let cResult = await response.json();
  cssErrorCount = cResult.cssvalidation.result.errorcount;

  return cssErrorCount;
}
// #endregion Utility Functions ***************************************

function buildReport(data, url) {
  let h = data.css.html;
  h = h.replace(/[\n\r]/g, ""); // remove line breaks
  h = h.replace(/ {2,}/g, " "); // remove extra spaces
  h = h.replace(/<!--[\s\S]*?-->/g, ''); // remove comments
  let c = data.css.css;
  let csslinks = '';
  data.css.links.forEach(css => {
    csslinks += `${css.link}<br>`
  });

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


  return `
      <div class="callout warning smaller">
        ⚠️A trailing slash on void elements has no effect and interacts badly with unquoted attribute values in HTML. Do not use a trailing slash for <a href="https://developer.mozilla.org/en-US/docs/Glossary/Void_element" target="_blank">void elements</a>.
      </div>

      <main>

      <h3>w3.org Validation Tools</h3>
      <div class="label">HTML</div>
      <div class="data" id="hvalid"></div>
      <div class="standard"> <span class="blue" id="htmlerrorscount"></span> <a href="https://validator.w3.org/check?verbose=1&uri=${url}" target="_blank">🔗HTML Validation Link</a>
      </div>

      <div class="label">CSS</div>
      <div class="data" id="cvalid"></div>
      <div class="standard"><span class="blue" id="csserrorscount"></span> <a href="https://jigsaw.w3.org/css-validator/validator?uri=${url}" target="_blank">🔗CSS Validation Link</a>
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
      <div class="data">${
    h.includes('<meta charset="utf-8"') ||
      h.includes('<meta charset="UTF-8"')
      ? "✅"
      : "❌"
    }</div>
      <div class="standard"><span class="blue">&lt;meta charset="UTF-8"&gt;</span></div>

      <div class="label">Meta Viewport:</div>
      <div class="data">${h.includes('<meta name="viewport" content="width=device-width')
      ? "✅"
      : "❌"
    }</div>
      <div class="standard">&lt;meta name="viewport" content="width=device-width,initial-scale=1.0"&gt;</div>

      <div class="label">Title:</div>
      <div class="data">${data.css.pageTitle.includes("About") ? "👀" : "❓"}</div>
      <div class="standard">&#10077;${data.css.pageTitle}&#10078;<span class="blue">Contains "About" or "About Us" and rafting company name, e.g., "About Us - Dry Oar Rafting"</span></div>

      <div class="label">Meta Description:</div>
      <div class="data">${h.includes('<meta name="description" content="') > 0 ? "👀" : "❌"
    }</div>
      <div class="standard">${getContent(h,/<meta\s+name="description"\s+content="([^"]+)"/i)} <span class="blue">Is this description of the page relevant and appropriate in describing the purpose and content of the page?"</div>

      <div class="label">Meta Author:</div>
      <div class="data">${h.includes('name="author"') > 0 ? "✅" : "❌"}</div>
      <div class="standard">${getContent(h,/<meta\s+name="author"\s+content="([^"]+)"/i)}</div>

    <h3>&lt;body&gt; Elements</h3>

      <div class="label">&lt;header&gt;</div>
      <div class="data">${h.includes('<header') && h.includes('</header>') && h.indexOf('<header') > h.indexOf('<body') && h.indexOf('</header>') < h.indexOf('</body>') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">The &lt;header&gt; ... &lt;/header&gt; must be within the &lt;body&gt;.</span></div>

      <div class="label">&lt;nav&gt;</div>
      <div class="data">${h.includes('<nav') && h.includes('</nav>') && h.indexOf('<nav>') > h.indexOf('<header>') && h.indexOf('</nav>') < h.indexOf('</header>') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">The &lt;nav&gt; ... &lt;/nav&gt; must be within the &lt;header&gt;.</span></div>

      <div class="label">&lt;a&gt;</div>
      <div class="data">${getElement(h, '<a href="') >= 4 ? '✅' : '❌'}</div>
      <div class="standard">found ${getElement(h, '<a href="')} / out of 4 required<span class="blue">All main navigation anchors must be within the &lt;nav&gt;</span></div>

      <div class="label">&lt;a href=""&gt;</div>
      <div class="data">${h.includes(' href="index.html"') && h.includes(' href="about.html"') && h.includes(' href="trips.html"') && h.includes(' href="contact.html"') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">Four &lt;a&gt; href="" values are index.html, about.html, trips.html, and contact.html</span></div>

      <div class="label">&lt;main&gt;</div>
      <div class="data">${h.includes('<main') && h.includes('</main>') && h.indexOf('<main>') > h.indexOf('</header>') && h.indexOf('</main>') < h.indexOf('<footer>') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;main&gt; ... &lt;/main&gt; is after the &lt;/header&gt; and before the &lt;footer&gt; </div>

      <div class="label">&lt;h1&gt;</div>
      <div class="data">${h.includes('<h1') && h.includes('</h1>') ? '✅' : '❌'}</div>
      <div class="standard">${getContent(h, /<h1.*>(.*?)<\/h1>/)} <span class="blue">Title of rafting company.</span></div>

      <div class="label">&lt;section&gt;</div>
      <div class="data">${h.includes("<section") && h.includes("</section>") ? "✅" : "❌"}</div>
      <div class="standard">${getElement(h, "<section")} found out of 2 required</div>

      <div class="label">&lt;h2&gt;</div>
      <div class="data">${h.includes("<h2") && h.includes("</h2>") && getElement(h, "<h2") >= 2 ? "✅" : "❌"}</div>
      <div class="standard">${getElement(h, "<h2")} found out 2 required</div>

      <div class="label">&lt;figure&gt;</div>
      <div class="data">${getElement(h, "<figure") >= 5 ? "✅" : "❌"}</div>
      <div class="standard">${getElement(h, "<figure")} found out of at least 5</div>

      <div class="label">&lt;img&gt;</div>
      <div class="data">${getElement(h, "<img") >= 10 ? "✅" : "❌"}</div>
      <div class="standard">${getElement(h, "<img")} found out of at least 10</div>

      <div class="label">&lt;footer&gt;</div>
      <div class="data">${h.includes("<footer") && h.includes("</footer>") ? "✅" : "❌"}</div>
      <div class="standard"></div>

      <div class="label">Page Structure</div>
      <div class="data">${h.indexOf('<header') < h.indexOf('<nav') && h.indexOf('</nav>') < h.indexOf('<main') && h.indexOf('</main>') < h.indexOf('<footer') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">header-nav, main, footer</span></div>

      <h3>CSS</h3>
      <div class="label">External CSS:</div>
      <div class="data">${data.css.links[0].link == 'styles/rafting.css' ? '✅' : '❓'
    }</div>
      <div class="standard">${data.css.links[0].link || 'not found'}</div>

      <div class="label">No Embedded/Inline</div>
      <div class="data">${h.includes("<style>") || h.includes("</style>") || h.includes("style=") ? "❌" : "✅"}</div>
      <div class="standard"><span class="blue">Embedded (&lt;style&gt;) or inline styles (style=") are not permitted in this class.</span></div>

      <div class="label">Selectors</div>
      <div class="data">${data.stats.selectors.total < 100 ? '✅' : '❌'}</div>
      <div class="standard">${data.stats.selectors.total} | Repeated Selectors: ${data.stats.selectors.repeated.length} <span class="blue">There should be no more than 100 selectors used if that. There should be very few repeated selectors.</span></div>


    </main>`;
}