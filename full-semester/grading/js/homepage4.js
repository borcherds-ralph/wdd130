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
    let uri = `${studentgh}.github.io/wdd130/`;
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
  // console.log(cssresult);
  return cssresult;
}

function resetReport() {
  message.style.display = 'none';
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
  let c = data.css.css;
  c = c.replace(/[\n\r]/g, ""); // remove line breaks
  console.log(c);

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
      <div class="data">${h.toLowerCase().includes('<!doctype html>') && h.toLowerCase().indexOf('<!doctype html>') === 0 ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;!DOCTYPE html&gt; or &lt;!doctype html&gt; should be on the first line of the document.</span></div>

      <div class="label">HTML Lang Attribute:</div>
      <div class="data">${h.includes('<html lang="') > 0 ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;html lang="en-US"&gt; or another language can be OK</span></div>

      <div class="label">&lt;head&gt; element</div>
      <div class="data">${h.includes('<head>') && h.includes('</head>') && h.indexOf('</head>') < h.indexOf('<body') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;head&gt; ... &lt;/head&gt;</span></div>

      <div class="label">&lt;body&gt; element</div>
      <div class="data">${h.includes('<body') && h.includes('</body>') && h.indexOf('</body>') < h.indexOf('</html>') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;body&gt; ... &lt;/body&gt;</span></div>

    <h3>&lt;head&gt; Elements</h3>

      <div class="label">Meta Charset:</div>
      <div class="data">${h.toLowerCase().includes('<meta charset="utf-8">') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;meta charset="UTF-8"&gt;</span></div>

      <div class="label">Meta Viewport:</div>
      <div class="data">${h.includes('<meta name="viewport"') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;meta name="viewport" content="width=device-width,initial-scale=1.0"&gt;</span></div>

      <div class="label">Title:</div>
      <div class="data">${data.css.pageTitle.includes('WDD 130') && data.css.pageTitle.length > 15 ? '👀' : '❌'}</div>
      <div class="standard">&#10077;${data.css.pageTitle}&#10078;<span class="blue">Must contain the student name and 'WDD 130'</span></div>

      <div class="label">Meta Description:</div>
      <div class="data">${h.includes('<meta name="description" content="') ? '👀' : '❌'}</div>
      <div class="standard">${getContent(h, /<meta\s+name="description"\s+content="([^"]+)"/i)} <span class="blue">Is this meta description sufficient?</span></div>

      <div class="label">Meta Author:</div>
      <div class="data">${h.includes('name="author"') > 0 ? "✅" : "❌"}</div>
      <div class="standard">${getContent(
        h,
        /<meta\s+name="author"\s+content="([^"]+)"/i
      )}</div>

<h3>&lt;body&gt; Elements</h3>

          <div class="label">&lt;header&gt;</div>
      <div class="data">${h.includes('<header') && h.includes('</header>') && h.indexOf('<header') > h.indexOf('<body') && h.indexOf('</header>') < h.indexOf('</body>') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">The &lt;header&gt; ... &lt;/header&gt; must be within the &lt;body&gt;.</span></div>

      <div class="label">&lt;nav&gt;</div>
      <div class="data">${h.includes('<nav') && h.includes('</nav>') && h.indexOf('<nav>') > h.indexOf('<header>') && h.indexOf('</nav>') < h.indexOf('</header>') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">The &lt;nav&gt; ... &lt;/nav&gt; must be within the &lt;header&gt;.</span></div>

      <div class="label">&lt;a&gt;</div>
      <div class="data">${getElement(h, '<a href="') > 7 ? '✅' : '❌'}</div>
      <div class="standard">found ${getElement(h, '<a href="')} / out of 7+ required.</div>

      <div class="label">&lt;main&gt;</div>
      <div class="data">${h.includes('<main') && h.includes('</main>') && h.indexOf('<main>') > h.indexOf('</header>') && h.indexOf('</main>') < h.indexOf('<footer>') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;main&gt; ... &lt;/main&gt; is after the &lt;/header&gt; and before the &lt;footer&gt; </div>

      <div class="label">&lt;h1&gt;</div>
      <div class="data">${h.includes('<h1') && h.includes('</h1>') ? '✅' : '❌'}</div>
      <div class="standard">${getContent(h, /<h1.*>(.*?)<\/h1>/)} <span class="blue">Must contain the student's name and the characters WDD 130</span></div>

      <div class="label">&lt;ul&gt;</div>
      <div class="data">${h.includes('<ul class="box') && h.includes("</ul>") && h.indexOf("</ul>") < h.indexOf("</main") ? "✅" : "❌"}</div>
      <div class="standard">&lt;ul class="box"&gt; <span class="blue">Located within the main element</span></div>

      <div class="label">&lt;aside&gt;</div>
      <div class="data">${h.includes('<aside class="box') && h.includes('</aside>') && h.indexOf('<aside') > h.indexOf('</main>') && h.indexOf('</aside>') < h.indexOf('<footer>') ? '✅' : '❌'}</div>
      <div class="standard">&lt;aside class="box"&gt;<span class="blue">The aside element is located after the main element ends and before the footer element begins.</span></div>

      <div class="label">&lt;h2&gt;</div>
      <div class="data">${h.includes('<h2') && h.includes('</h2>') && h.indexOf('<h2') > h.indexOf('<aside') ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h, '<h2')} found out of 1 required. ${getContent(h, /<h2.*>(.*?)<\/h2>/)}</div>

      <div class="label">div.grid</div>
      <div class="data">${h.includes('<div class="grid"') && h.includes("</div>") ? "✅" : "❌"}</div>
      <div class="standard"><span class="blue">&lt;div class="grid"&gt; ... &lt;/grid&gt;</span></div>

      <div class="label">&lt;img&gt;</div>
      <div class="data">${getElement(h, '<img') >= 2 ? '✅' : '❌'}</div>
      <div class="standard">found ${getElement(h, '<img')} </div>

      <div class="label">&lt;p&gt;</div>
      <div class="data">${getElement(h, '<p') >= 2 ? '✅' : '❌'}</div>
      <div class="standard">found ${getElement(h, '<p')} </div>

      <div class="label">&lt;footer&gt;</div>
      <div class="data">${h.includes('<footer') && h.includes('</footer>') && h.indexOf('<footer') > h.indexOf('</aside>') && h.indexOf('</footer>') < h.indexOf('</body>') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">Located at the end of the document and before the closing body tag.</span></div>

<h3>CSS</h3>

      <div class="label">External CSS:</div>
      <div class="data">${data.css.links[0].link == "styles/styles.css" ? "✅" : "❌"}</div>
      <div class="standard">${csslinks}</div>

      <div class="label">No Embedded/Inline</div>
      <div class="data">${h.includes("<style>") || h.includes("</style>") || h.includes("style=") ? "❌" : "✅"}</div>
      <div class="standard"><span class="blue">Embedded (&lt;style&gt;) or inline styles (style=") are not permitted in this class.</span></div>

      <div class="label">combination</div>
      <div class="data">${(c.includes("header, .grid, footer {") || c.includes("header, footer, .grid {") || c.includes("header,.grid,footer {") || c.includes("header,footer,.grid {")) && c.includes("max-width: 840px;") && c.includes("margin: 0 auto;") ? "✅" : "❌"}</div>
      <div class="standard"><code class="css">header, footer, .grid {<br>&nbsp;&nbsp;&nbsp;&nbsp;margin: 0 auto;<br>&nbsp;&nbsp;&nbsp;&nbsp;max-width: 840px;<br>}</code></div>

      <div class="label">.grid Class:</div>
      <div class="data">${c.includes(".grid {") && c.includes("display: grid;") ? "✅" : "❌"}</div>
      <div class="standard"><code class="css">.grid {<br>&nbsp;&nbsp;&nbsp;&nbsp;display: grid;<br>&nbsp;&nbsp;&nbsp;&nbsp;align-items: center;<br>}</code></div>

      <div class="label">main</div>
      <div class="data">${c.includes("main {") && c.includes("float: right;") && c.includes("grid-column: 2/3;") ? "✅" : "❌"}</div>
      <div class="standard"><code class="css">main {<br>&nbsp;&nbsp;&nbsp;&nbsp;display: grid;<br>&nbsp;&nbsp;&nbsp;&nbsp;align-items: center;<br>}</code></div>

      <div class="label">aside</div>
      <div class="data">${c.includes("aside {") && c.includes("position: relative;") ? "✅" : "❌"}</div>
      <div class="standard"><code class="css">aside {<br>&nbsp;&nbsp;&nbsp;&nbsp;...<br>&nbsp;&nbsp;&nbsp;&nbsp;position: relative;<br>}</code></div>

    </main>`;
}
