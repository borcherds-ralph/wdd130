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
        let uri = `${studentgh}.github.io/wdd130/index.html`;
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
    let vResult = await response.json();

    htmlErrorCount = vResult.messages.reduce((count, message) => {
        return message.type === 'error' ? count + 1 : count;
    }, 0);

    return htmlErrorCount;
}
// #endregion Utility Functions ***************************************

function buildReport(data, url) {
    let h = data.css.html;
    h = h.replace(/[\n\r]/g, ""); // remove line breaks
    h = h.replace(/ {2,}/g, " "); // remove extra spaces


    validateHTML(h)
        .then((htmlErrorCount) => {
            document.getElementById('hvalid').innerHTML = (htmlErrorCount === 0) ? '✅' : '❌';
            document.getElementById('htmlerrorscount').innerHTML = `Errors: ${htmlErrorCount}`;
        })
        .catch((error) => {
            document.getElementById('htmlerrorscount').innerHTML = `HTML Validation failed to report: ${error}`;
        });

    return `<main>

      <h3>w3.org Validation Tools</h3>
      <div class="label">HTML</div>
      <div class="data" id="hvalid"></div>
      <div class="standard"> <span id="htmlerrorscount"></span> <a href="https://validator.w3.org/check?verbose=1&uri=${url}" target="_blank">🔗HTML Validation Link</a>
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
      <div class="data">${h.includes('<meta charset="utf-8"') > 0 || h.includes('<meta charset="UTF-8"') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;meta charset="UTF-8"&gt;</span></div>

      <div class="label">Meta Viewport:</div>
      <div class="data">${h.includes('<meta name="viewport"') > 0 ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;meta name="viewport" content="width=device-width,initial-scale=1.0"&gt;</span></div>

      <div class="label">Title:</div>
      <div class="data">${data.css.pageTitle.includes('WDD 130') && data.css.pageTitle.length > 15 ? '✅' : '❓'}</div>
      <div class="standard">&#10077;${data.css.pageTitle}&#10078;<span class="blue">Must contain the student name and 'WDD 130'</span></div>

      <h3>&lt;body&gt; Elements</h3>

      <div class="label">&lt;header&gt;</div>
      <div class="data">${h.includes('<header') && h.includes('</header>') && h.indexOf('<header') > h.indexOf('<body') && h.indexOf('</header>') < h.indexOf('</body>') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">The &lt;header&gt; ... &lt;/header&gt; must be within the &lt;body&gt;.</span></div>

      <div class="label">&lt;nav&gt;</div>
      <div class="data">${h.includes('<nav') && h.includes('</nav>') && h.indexOf('<nav>') > h.indexOf('<header>') && h.indexOf('</nav>') < h.indexOf('</header>') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">The &lt;nav&gt; ... &lt;/nav&gt; must be within the &lt;header&gt;.</span></div>

      <div class="label">&lt;a&gt;</div>
      <div class="data">${getElement(h, '<a href="') >= 3 ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">Found ${getElement(h, '<a href="')} / out of 3 required. All anchors must be within the &lt;nav&gt;</span></div>

      <div class="label">&lt;main&gt;</div>
      <div class="data">${h.includes('<main') && h.includes('</main>') && h.indexOf('<main>') > h.indexOf('</header>') && h.indexOf('</main>') < h.indexOf('<footer>') ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">&lt;main&gt; ... &lt;/main&gt; is after the &lt;/header&gt; and before the &lt;footer&gt; </div>

      <div class="label">&lt;h1&gt;</div>
      <div class="data">${h.includes('<h1') && h.includes('</h1>') ? '✅' : '❌'}</div>
      <div class="standard">${getContent(h, /<h1.*>(.*?)<\/h1>/)} <span class="blue">Must contain the student's name and the characters WDD 130</span></div>

      <div class="label">&lt;img&gt;</div>
      <div class="data">${getElement(h, '<img') >= 1 ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">Found ${getElement(h, '<img')} / out of 1 required</span></div>

      <div class="label">&lt;p&gt;</div>
      <div class="data">${getElement(h, '<p') >= 2 ? '✅' : '❌'}</div>
      <div class="standard"><span class="blue">found ${getElement(h, '<p')} / out 2 required</span></div>

      <div class="label">&lt;footer&gt;</div>
      <div class="data">${h.includes('<footer') && h.includes('</footer>') && h.indexOf('<footer>') > h.indexOf('</main>') && h.indexOf('</footer>') < h.indexOf('</body>') ? '✅' : '❌'}</div>
      <div class="standard">${getContent(h, /<footer>(.*?)<\/footer>/)} <span class="blue">Must be after the &lt;/main&gt; element and before the &lt;/body&gt; closing tag.</span></div>

    </main>`;
}

document.querySelector('.warning').style.display = "none";
