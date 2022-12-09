/* WEBSHIM.LIB SETUP
****************************************/
// only implement  Webshim if not an Android native browser (too buggy)
$(function () {
    var nua = navigator.userAgent;
    var is_android = ((nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

    if (is_android) {
        webshims.setOptions(
            'forms', {
            addValidators: true,
            customDatalist: true
        });
        webshims.activeLang('en-AU');
        webshims.polyfill('forms');
    } else {
        webshims.setOptions(
            'forms', { addValidators: true },
            'forms-ext', {
            types: 'number',
            "number": { "calculateWidth": false }
        });
        webshims.activeLang('en-AU');
        webshims.polyfill('forms forms-ext');
    }
});

// // Change input type to match 'inputmode' on touch devices
$("html.touch input[type='text']").each(function () {
    var $t = $(this);
    if ($t.is("[inputmode='numeric']")) {
        $t.attr("type", "number");
    } else if ($t.is("[inputmode='tel']")) {
        $t.attr("type", "tel");
    } else if ($t.is("[inputmode='email']")) {
        $t.attr("type", "email");
    } else if ($t.is("[inputmode='url']")) {
        $t.attr("type", "url");
    }
});

// Custom validity error emssage for email for Login form 1 (with Show/hide)
// Reference for The constraint validation API: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#the-constraint-validation-api
$(function () {
    var email = document.getElementById("user-email-login1");

    email.addEventListener("input", function (event) {
        if (email.validity.typeMismatch) {
            email.setCustomValidity("I expect a valid e-mail, darling!");
        } else {
            email.setCustomValidity("");
        }
    })
});

// Password input for Login form 1 (with Show/hide)
$(function () {
    var pass1 = document.getElementById('user-psw-login1');
    $("#toggleBtn1").click(function () {
        if (this.innerHTML == 'Show') {
            this.innerHTML = 'Hide';
            pass1.type = "text";
        } else {
            this.innerHTML = 'Show';
            pass1.type = "password";
        }
    })
});

// Password input for Login form with icon
$(function () {
    $("#password_visibility").click(function () {
        var pass_input = document.getElementById("user-psw-icon");
        if (pass_input.type === "password") {
            pass_input.type = "text";
            $(this).removeClass("fa-eye-slash").addClass("fa-eye")
        } else {
            pass_input.type = "password";
            $(this).removeClass("fa-eye").addClass("fa-eye-slash")
        }
    });
});

// Personal Information Form 1
// Fruit count functionality
$(function () {
    var fruit_amount = document.querySelector('#fruitAmount');
    var fruit_count = document.querySelector('.fruitcount');

    fruit_count.textContent = fruit_amount.value;

    fruit_amount.oninput = function () {
        fruit_count.textContent = fruit_amount.value;
    }
});

// Personal Information Form 2
// Sliders and Spinboxes
function changeColor(type) {
    var redValue = document.getElementById(type + 'Red').value,
        greenValue = document.getElementById(type + 'Green').value,
        blueValue = document.getElementById(type + 'Blue').value,
        redInHex = parseInt(redValue).toString(16).toUpperCase();
    if (redInHex.length === 1) {
        redInHex = '0' + redInHex;
    }
    var greenInHex = parseInt(greenValue).toString(16).toUpperCase();
    if (greenInHex.length === 1) {
        greenInHex = '0' + greenInHex;
    }
    var blueInHex = parseInt(blueValue).toString(16).toUpperCase();
    if (blueInHex.length == 1) {
        blueInHex = '0' + blueInHex;
    }
    var newColor = "#" + redInHex + greenInHex + blueInHex,
        colorDivElement = type + 'ColorDiv',
        colorDiv = document.getElementById(colorDivElement);
    colorDiv.style.backgroundColor = newColor;
    var colorValuesDiv = document.getElementById(type + 'ColorValueDiv');
    colorValuesDiv.innerText = newColor;
}

// Input type file for upload of Image file
var input = document.querySelector('input[type=file]');
var preview = document.querySelector('.preview');

input.style.opacity = 0;
input.addEventListener('change', updateImageDisplay);
function updateImageDisplay() {
    while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }

    var curFiles = input.files;
    if (curFiles.length === 0) {
        var para = document.createElement('p');
        para.textContent = 'No files currently selected for upload';
        preview.appendChild(para);
    } else {
        var list = document.createElement('ol');
        preview.appendChild(list);
        for (var i = 0; i < curFiles.length; i++) {
            var listItem = document.createElement('li');
            var para = document.createElement('p');
            if (validFileType(curFiles[i])) {
                para.textContent = 'File name ' + curFiles[i].name + ', file size ' + returnFileSize(curFiles[i].size) + '.';
                var image = document.createElement('img');
                image.src = window.URL.createObjectURL(curFiles[i]);

                listItem.appendChild(image);
                listItem.appendChild(para);

            } else {
                para.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
                listItem.appendChild(para);
            }

            list.appendChild(listItem);
        }
    }
}
var fileTypes = [
    'image/jpeg',
    'image/pjpeg',
    'image/png'
]

function validFileType(file) {
    for (var i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i]) {
            return true;
        }
    }

    return false;
}
function returnFileSize(number) {
    if (number < 1024) {
        return number + 'bytes';
    } else if (number >= 1024 && number < 1048576) {
        return (number / 1024).toFixed(1) + 'KB';
    } else if (number >= 1048576) {
        return (number / 1048576).toFixed(1) + 'MB';
    }
}

// Input type file for upload of Video file
// Script written by Adam Khoury @ DevelopPHP.com */
// Video Tutorial: http://www.youtube.com/watch?v=EraNFJiY0Eg 
// http://www.developphp.com/video/JavaScript/File-Upload-Progress-Bar-Meter-Tutorial-Ajax-PHP

function _(el) {
    return document.getElementById(el);
}
function uploadFile() {
    var file = _("video-file").files[0];
    alert("File name: " + file.name + " | " + "Size: " + file.size + " | " + "Type: " + file.type);
    var formdata = new FormData();
    formdata.append("video-file", file);
    var ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);
    ajax.addEventListener("error", errorHandler, false);
    ajax.addEventListener("abort", abortHandler, false);
    ajax.open("POST", "file_upload_parser.php");
    ajax.send(formdata);
}
function progressHandler(event) {
    _("loaded_n_total").innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total;
    var percent = (event.loaded / event.total) * 100;
    _("progressBar").value = Math.round(percent);
    _("status").innerHTML = Math.round(percent) + "% uploaded... please wait";
}
function completeHandler(event) {
    _("status").innerHTML = event.target.responseText;
    _("progressBar").value = 0;
}
function errorHandler(event) {
    _("status").innerHTML = "Upload Failed";
}
function abortHandler(event) {
    _("status").innerHTML = "Upload Aborted";
}

// file_upload_parser.php

// <?php
// $fileName = $_FILES["file1"]["name"]; // The file name
// $fileTmpLoc = $_FILES["file1"]["tmp_name"]; // File in the PHP tmp folder
// $fileType = $_FILES["file1"]["type"]; // The type of file it is
// $fileSize = $_FILES["file1"]["size"]; // File size in bytes
// $fileErrorMsg = $_FILES["file1"]["error"]; // 0 for false... and 1 for true
// if (!$fileTmpLoc) { // if file not chosen
//     echo "ERROR: Please browse for a file before clicking the upload button.";
//     exit();
// }
// if(move_uploaded_file($fileTmpLoc, "test_uploads/$fileName")){
//     echo "$fileName upload is complete";
// } else {
//     echo "move_uploaded_file function failed";
// }
// ?>

// Personal Information Form 2 
// Initializing DateDroppper
$('#datedropper').dateDropper();
// Initializing TimeDroppper
$("#timedropper").timeDropper();
// Initializing PignoseCalendar
$(function () {
    $('#calendar').pignoseCalendar({
        theme: 'blue', // light, dark, blue
        // multiple: true,
    });
});

// Payment Form 1
// Country input
// https://www.w3schools.com/howto/howto_js_autocomplete.asp
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        e.preventDefault();
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "-autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "-autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

/*An array containing all the country names in the world:*/
var countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua & Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central Arfrican Republic", "Chad", "Chile", "China", "Colombia", "Congo", "Cook Islands", "Costa Rica", "Cote D Ivoire", "Croatia", "Cuba", "Curacao", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Polynesia", "French West Indies", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauro", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Pierre & Miquelon", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "St Kitts & Nevis", "St Lucia", "St Vincent", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor L'Este", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Virgin Islands (US)", "Yemen", "Zambia", "Zimbabwe"];

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("payment1-country"), countries);