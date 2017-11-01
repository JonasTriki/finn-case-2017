const path = require("path");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const bodyParser = require("body-parser");

const app = express();
const http = require("http");
const port = 8081;
const server = http.Server(app).listen(port);
console.log("Server started.");

app.use(cors());

function fib(n) {
    var a = 1, b = 0, temp;
    while (n > 0) {
        temp = a;
        a += b;
        b = temp;
        n--;
    }
    return b;
}

function sortWord(word) {
    return word.split("").sort().join();
}

function anagrams(words) {
    var anagrams = {};
    var result = "";
    for (var i in words) {
        var word = words[i];

        // sort the word like you've already described
        var sorted = sortWord(word);

        // If the key already exists, we just push
        // the new word on the the array
        if (anagrams[sorted] != null) {
            anagrams[sorted].push(word);
        }
        // Otherwise we create an array with the word
        // and insert it into the object
        else {
            anagrams[sorted] = [word];
        }
    }
}

app.get("/", function(req, res, next) {
    console.log(req.query);

    // Splitter main-query på ": " og sjekker hvor mange seksjoner vi har.
    var result = "";
    var splitted = req.query.q.split(": ");
    if (splitted.length == 3) {
        var split2 = splitted[2].replace("%20", " ").split(", ");
        console.log("split2", split2);
        if (splitted[1].indexOf("kubetall") > -1) {
            console.log("Kubetall");
            var list = [];
            for (var i = 0; i < split2.length; i++) {
                //console.log("u1", Number.isInteger(Math.cbrt(split2[i])));
                //console.log("u2", Number.isInteger(Math.sqrt(split2[i])));
                if (Number.isInteger(Math.cbrt(+split2[i])) && Number.isInteger(Math.sqrt(+split2[i]))) {
                    list.push(split2[i]);
                }
            }
            //console.log("kubetall liste", list);
            result = list.join(", ");
        } else if (splitted[1].indexOf("største") > -1) {
            console.log("Største");
            var curMax = +split2[0];
            for (var i = 1; i < split2.length; i++) {
                if (+split2[i] > curMax) {
                    curMax = +split2[i];
                }
            }
            result = "" + curMax;
        } else if (splitted[1].indexOf("primtall") > -1) {
            console.log("Primtall");
            var list = [];
            for (var i = 0; i < split2.length; i++) {
                var isPrime = true;
                for (var j = 2; j < Math.sqrt(+split2[i]); j++) {
                    if (Number.isInteger(+split2[i] / j)) {
                        isPrime = false;
                    }
                }
                if (isPrime && list.indexOf(+split2[i]) == -1) {
                    list.push(split2[i]);
                }
            }
            //console.log("Primtall --> ", list);
            result = list.join(", ");
        }
    } else {
        if (splitted[1].indexOf("ganger") > -1) {
            var split = splitted[1].replace("%20", " ").split(" ");
            result = "" + (+split[2] * +split[4]);
        } else if (splitted[1].indexOf("pluss") > -1) {
            var split = splitted[1].replace("%20", " ").split(" "); // pluss pluss
            if (split.length == 7) {  // pluss pluss
                result = "" + (+split[2] + +split[4] + +split[6]);
            } else { // bare pluss
                result = "" + (+split[2] + +split[4]);
            }
        } else if (splitted[1].indexOf("minus") > -1) {
            var split = splitted[1].replace("%20", " ").split(" ");
            result = "" + (+split[2] - +split[4]);
        } else if (splitted[1].indexOf("myntenhet") > -1) {
            result = "Peseta";
        } else if (splitted[1].indexOf("Eiffeltårnet") > -1) {
            result = "Paris";
        } else if (splitted[1].indexOf("statsminister") > -1) {
            result = "Erna Solberg";
        } else if (splitted[1].indexOf("James Bond") > -1) {
            result = "Sean Connery";
        } else if (splitted[1].indexOf("hvilken farge har en banan") > -1) {
            result = "Gul"
        } else if (splitted[1].indexOf("Fibonaccisekvensen") > -1) {
            var num = +splitted[1].split("hva er tall nr.")[1].split(" i ")[0];
            result = "" + fib(num);
        } else if (splitted[1].indexOf("opphøyd") > -1) {
            // hva blir 10 opphøyd i 12. potens
            var num1 = +splitted[1].split(" ")[2]
            var num2 = +splitted[1].split(" ")[5].split(".")[0];
            result = "" + Math.pow(num1, num2);
        }
    }
    res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
    });
    console.log(result);
    res.end(result);
    console.log(req.query.q);
});
