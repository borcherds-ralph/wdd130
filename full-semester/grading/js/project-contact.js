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
    let uri = `${studentgh}.github.io/wdd130/wwr/contact.html`;
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
  console.log(cssresult);
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
      <div class="standard"> <span id="htmlerrorscount"></span> <a href="https://validator.w3.org/check?verbose=1&uri=${url}" target="_blank">🔗HTML Validation Link</a>
      </div>

      <div class="label">CSS</div>
      <div class="data" id="cvalid"></div>
      <div class="standard"><span id="csserrorscount"></span> <a href="https://jigsaw.w3.org/css-validator/validator?uri=${url}" target="_blank">🔗CSS Validation Link</a>
      </div>

      <h3>HTML Document</h3>
      <div class="label">Document Type:</div>
      <div class="data">${h.toLowerCase().includes('<!doctype html>') && h.toLowerCase().indexOf('<!doctype html>') === 0 ? '✅' : '❌'}</div>
      <div class="standard">&lt;!DOCTYPE html&gt;<span class="blue">This should be on the first line.</span></div>

      <div class="label">HTML Lang Attribute:</div>
      <div class="data">${h.includes('<html lang="') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;html lang="en-US"&gt;</span></div>

      <div class="label">&lt;head&gt;</div>
      <div class="data">${h.includes('<head') && h.includes('</head>') && h.indexOf('</head>') < h.indexOf('<body') ? '✅' : '❌'}</div>
      <div class="standard">&lt;head&gt; ... &lt;/head&gt; <span class="blue">Must end before the &lt;body&gt; tag.</span></div>

      <div class="label">&lt;body&gt;</div>
      <div class="data">${h.includes('<body') && h.includes('</body>') && h.indexOf('</body>') < h.indexOf('</html>') ? '✅' : '❌'}</div>
      <div class="standard">&lt;body&gt; ... &lt;/body&gt; <span class="blue">Must end before the closing &lt;/html&gt; tag.</span></div>


      <h3>&lt;head&gt; Elements</h3>
      <div class="label">Meta Charset:</div>
      <div class="data">${h.toLowerCase().includes('<meta charset="utf-8">') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;meta charset="UTF-8"&gt;</span></div>

      <div class="label">Meta Viewport:</div>
      <div class="data">${h.includes('<meta name="viewport"') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;meta name="viewport" content="width=device-width,initial-scale=1.0"&gt;</span></div>

      <div class="label">Title:</div>
      <div class="data">${data.css.pageTitle.includes('Contact') && data.css.pageTitle.length > 20 ? '👀' : '❌'}</div>
      <div class="standard">&#10077;${data.css.pageTitle}&#10078; <span class="blue">Review: Must contain 'Contact' and rafting company name</span></div>

      <div class="label">Meta Description:</div>
      <div class="data">${h.indexOf('<meta name="description" content="') > 0 ? '👀' : '❌'}</div>
      <div class="standard">${getContent(h, /<meta\s+name="description"\s+content="([^"]+)"/i)} <span class="blue">Review: Is the description about contacting the company?</span></div>

      <div class="label">Meta Author:</div>
      <div class="data">${h.indexOf('name="author"') > 0 ? '✅' : '❌'}</div>
      <div class="standard">${getContent(h, /<meta\s+name="author"\s+content="([^"]+)"/i)}</div>

      <div class="label">External CSS:</div>
      <div class="data">${data.css.links[0].link == 'styles/rafting.css' && data.css.links.length <= 2 ? '✅' : '❌'}</div>
      <div class="standard">${csslinks} <span class="blue">Must use styles/rafting.css and no other CSS references for the site.<br> Google CSS Font reference is OK.</div>

      <div class="label">No Embedded/Inline</div>
      <div class="data">${h.includes("<style>") || h.includes("</style>") || h.includes("style=") ? "❌" : "✅"}</div>
      <div class="standard"><span class="blue">Embedded (&lt;style&gt;) or inline styles (style=") are not permitted in this class. You might have to remove any inline styles from the Google Map iframe element.</span></div>

     <h3>&lt;body&gt; Elements</h3>

      <div class="label">&lt;header&gt;</div>
      <div class="data">${h.includes("<header") && h.includes("</header>") ? "✅" : "❌"}</div>
      <div class="standard"></div>

      <div class="label">&lt;nav&gt;</div>
      <div class="data">${h.includes("<nav") && h.includes("</nav>") ? "✅" : "❌"}</div>
      <div class="standard"></div>

      <div class="label">&lt;h1&gt;</div>
      <div class="data">${h.includes("<h1") && h.includes("</h1>") ? "✅" : "❌"}</div>
      <div class="standard">Found ${getElement(h, "<h1")} out of 1 maximum. ${getContent(h, /<h1.*>(.*?)<\/h1>/)}
        <span class="blue">Review: The h1 element content should strongly reflect the page and site.</span>
      </div>

      <div class="label">&lt;main&gt;</div>
      <div class="data">${h.includes("<main") && h.includes("</main>") ? "✅" : "❌"}</div>
      <div class="standard"></div>

     <div class="label">&lt;footer&gt;</div>
      <div class="data">${h.includes("<footer") && h.includes("</footer>") ? "✅" : "❌"}</div>
      <div class="standard"></div>

      <div class="label">Page Structure</div>
      <div class="data">${h.indexOf('<header') < h.indexOf('<nav') && h.indexOf('</nav>') < h.indexOf('<main') && h.indexOf('</main>') < h.indexOf('<footer') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">header-nav, main, footer</span></div>

      <h3>Assignment Elements</h3>

      <div class="label">Embedded Google Map:</div>
      <div class="data">${h.includes('src="https://www.google.com/maps/embed?') && h.includes('</iframe>') ? '👀' : '❌'}</div>
      <div class="standard"><span class="blue">iframe with google.com/maps source | Visual check OK</span></div>

      <div class="label">&lt;form&gt;</div>
      <div class="data">${h.includes('<form') && h.includes('</form>') ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h, '<form')} / 1</div>

      <div class="label">type="text"</div>
      <div class="data">${getElement(h, 'type="text"') >= 1 ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h, 'type="text"')}</div>

      <div class="label">type="radio"</div>
      <div class="data">${getElement(h, 'type="radio"') === 3 ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h, 'type="radio"')} / 3</div>

      <div class="label">&lt;textarea&gt;</div>
      <div class="data">${getElement(h, '<textarea') === 1 && h.includes('</textarea>') ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h, '<textarea')} / 1</div>

      <div class="label">type="checkbox"</div>
      <div class="data">${getElement(h, 'type="checkbox"') === 1 ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h, 'type="checkbox"')} / 1</div>

      <div class="label">&lt;button type="submit"&gt;</div>
      <div class="data">${getElement(h, '<button type="submit"') === 1 && h.indexOf('</button>') < h.indexOf('</form>') ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h, 'type="submit"')} / 1
      <span class="blue">&lt;input type="submit"&gt; is reasonable but the course wants you to use a button and that is labeled with expressive content. Not just "Submit"</div>

      <div class="label">&lt;label&gt;</div>
      <div class="data">${getElement(h, '</label>') >= 6 ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h, '</label>')} <span class="blue">There should be at least 6 label elements that are associated with form elements.</span></div>

      <div class="label">name attribute</div>
      <div class="data">${getElement(h, 'name="') >= 5 ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">Each form form element with entries should have a name including each radio button.</span></div>

      <div class="label">id attribute</div>
      <div class="data">${getElement(h, 'id="') >= 5 ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">Each form element must have an id attribute.</span></div>

      <div class="label">&lt;img&gt;</div>
      <div class="data">${getElement(h, '<img') >= 7 ? '✅' : '❌'}</div>
      <div class="standard">${getElement(h, '<img')} <span class="blue">There should be at least 7 img elements on this page.</span> </div>


       <h3>CSS Selector Information</h3>
       <div class="label">Selectors:</div>
       <div class="data">${data.stats.selectors.total < 100 ? '✅' : '❌'}</div>
       <div class="standard">${data.stats.selectors.total} <span class="blue">There should be less than 100 selectors used for the entire rafting site in rafting.css.</div>

       <div class="label">Repeated:</div>
       <div class="data">${data.stats.selectors.repeated.length < 15 ? '✅' : '❌'}</div>
       <div class="standard">${data.stats.selectors.repeated.length} (${data.stats.selectors.repeated})
       <span class="blue">If you receive a ❌, then you need to review why you are repeating so many selectors in the rafting site. There should only be a few.</div>

    </main>`;
}