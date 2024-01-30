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
    let uri = `${studentgh}.github.io/wdd130/quiz.html`;
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
  message.style.display = 'none';
  report.textContent = "";
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
  let htmlErrorCount = 0;
  let cssErrorCount = 0;

  validateHTML(h)
    .then((htmlErrorCount) => {
      document.getElementById('htmlerrorscount').innerHTML = `Reported Errors: ${htmlErrorCount}`;
    })
    .catch((error) => {
      document.getElementById('htmlerrorscount').innerHTML = `HTML Validation failed to report: ${error}`;
    });

  validateCSS(url)
    .then((cssErrorCount) => {
      document.getElementById('csserrorscount').innerHTML = `Reported Errors: ${cssErrorCount}`;
    })
    .catch((error) => {
      document.getElementById('csserrorscount').innerHTML = `CSS Validation failed to report: ${error}`;
    });

  return `<main>
   <h3>w3.org Validation Tool</h3>
      <div class="label">HTML Validator:</div>
      <div class="data">${htmlErrorCount === 0 ? '✅' : '❌'}</div>
      <div class="standard">🔗 <a href="https://validator.w3.org/check?verbose=1&uri=${url}" target="_blank">w3.org HTML Validation Report Link</a> <span class="blue" id="htmlerrorscount"></span>
      </div>

      <div class="label">CSS Validator:</div>
      <div class="data">${cssErrorCount === 0 ? '✅' : '❌'}</div>
      <div class="standard">🔗 <a href="https://jigsaw.w3.org/css-validator/validator?uri=${url}" target="_blank">w3.org CSS Validation Report Link</a> <span class="blue" id="csserrorscount">
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
      <div class="data">${data.css.pageTitle.includes("Quiz") ? "✅" : "❓"}</div>
      <div class="standard">&#10077;${data.css.pageTitle}&#10078;<span class="blue">contains "Quiz"</span></div>

     <div class="label">Meta Description:</div>
      <div class="data">${
    h.includes('<meta name="description" content="') > 0 ? "✅" : "❌"
    }</div>
      <div class="standard">${getContent(
      h,
      /<meta\s+name="description"\s+content="([^"]+)"/i
    )}</div>

      <div class="label">Meta Author:</div>
      <div class="data">${h.includes('name="author"') > 0 ? "✅" : "❌"}</div>
      <div class="standard">${getContent(
      h,
      /<meta\s+name="author"\s+content="([^"]+)"/i
    )}</div>

      <div class="label">External CSS:</div>
      <div class="data">${data.css.links[0].link == 'styles/quiz.css' ? '✅' : '❌'}</div>
      <div class="standard">${data.css.links[0].link} | (styles/quiz.css)</div>

      <div class="label">H1 Element:</div>
      <div class="data">${h.includes('<h1') && h.includes('</h1>')  ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h, '<h1')} / 1 : ${getContent(h, /<h1.*>(.*?)<\/h1>/) }</div>

      <h3>Form Elements</h3>

      <div class="label">Form Element:</div>
      <div class="data">${getElement(h, '<form') === 1 && h.includes('</form>') ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h, '<form')} / 1</div>

      <div class="label">Input Type Text:</div>
      <div class="data">${getElement(h, 'type="text"') >= 1 ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h, 'type="text"')} / 1+</div>

      <div class="label">TextArea Element:</div>
      <div class="data">${h.includes('<textarea') && h.includes('</textarea>') ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h, '</textarea>')} / 1+</div>

      <div class="label">Select Element:</div>
      <div class="data">${h.includes('<select') && h.includes('</select>') ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h , '</select>')} / 1+</div>

      <div class="label">Option Elements:</div>
      <div class="data">${getElement(h, '</option>') >= 3 ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h, '</option>')} / 3+</div>

      <div class="label">Input Type Number:</div>
      <div class="data">${getElement(h, 'type="number"') >= 1 ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h, 'type="number"')} / 1+</div>

      <div class="label">Label Elements:</div>
      <div class="data">${getElement(h, '</label>') >= 4 ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h, '</label>')} / 4+</div>

      <div class="label">Name Attributes:</div>
      <div class="data">${h.includes('name="q1"') && h.includes('name="q2"') && h.includes('name="q3"') && h.includes('name="q4"') ? '✅' : '❌'}</div>
      <div class="standard">Each quiz element has a name attribute: q1 - q4.</div>

      <div class="label">ID Attributes:</div>
      <div class="data">${h.includes('id="q1"') && h.includes('id="q2"') && h.includes('id="q3"') && h.includes('id="q4"') ? '✅' : '❌'}</div>
      <div class="standard">Each quiz element has an id attribute: q1 - q4.</div>



      <h3>Information Only: CSS</h3>
       <div class="label">Selectors:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.total}</div>
       <div class="label">Repeated Selectors:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.repeated.length}: ${data.stats.selectors.repeated}</div>
       <div class="label">Elements:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.values}</div>
       <div class="label">Classes:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.class}</div>
       <div class="label">IDs:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.id}</div>
       <div class="label">Pseudo-classes:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.pseudoClass}</div>
       <div class="label">Pseudo-elements:</div>
       <div class="data">📑</div>
       <div class="standard">${data.stats.selectors.pseudoElement}</div>

    </main>`;
}