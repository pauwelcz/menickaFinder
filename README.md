
<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#prerequisites">Prerequisites</a></li>
    <li><a href="#built-in">Built in</a></li>
    <li><a href="#getting-started">Getting started</a></li>
    <li><a href="#usage">Usage</a></li>
        <ul>
        <li><a href="#parameters">Parameters</a></li>
        <li><a href="#running-script">Running script</a></li>
      </ul>
    <li><a href="#author">Author</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Project prints food from daily menu (by [object file](https://github.com/pauwelcz/menickaFinder/blob/master/data/restaurants.json)) for today from different restaurants (or, as user choose). This project was implemented because of job application (backend developer). Project can be practical (mainly for Czech consuments), but I believe, that project can be expanded for other countries. Project using mainly modules "[cheerio](https://www.npmjs.com/package/cheerio)" (for parsing) and "[got](https://www.npmjs.com/package/got)" (for request).


## Prerequisites
*  Node.js version v16.4.0

## Built in
Project implemented in:
*  Visual studio code 1.57.1

<!-- GETTING STARTED -->
## Getting Started
Before you start that project, make sure that you have installed programs in <a href="#prerequisites">Prerequisites</a>.
```
    git clone https://github.com/pauwelcz/menickaFinder.git
    npm i
```

<!-- USAGE EXAMPLES -->
## Usage

Most important part for using this project is file **object**, whose default path is *./data/restaurants.js*, but you can choose your own path by parameter. This file must be in format:

```json
[
    {
        "name": "restaurantName",
        "url": "restaurantURL",
        "urlMenicka": "restaurantMenicka"
    },
    // ...
]
```
\* Note: object key **urlMenicka** is used for czech customers, because is parsing body from web page [Menicka.cz](https://menicka.cz/). Reason to add this key is that there is same web structure for many czech restaurants and by author opinion it is better for reusability.

### Parameters
Both scripts (00.dailyMenuZMenicka.js, 01.dailyMenu.js) using same argument by user choice. These arguments are:

```
  -r, --restaurants <string>  Path to of objects with restaurants (default: "./data/restaurants.json")
  -o, --output <string>       Parameter for saving file, if parameter is not set, output is printed to console. (default: "")
  -n, --name <string>         Parameter for name of file (in combination with parameter output), if parameter is not set, name of file is in format "DD-MM-YYYY.txt". (default: "")
  -h, --help                  output usage information
```

### Running script
Script should run throught Node.js:
```
    node 00.dailyMenuZMenicka.js [arguments]
```

or

```
    node 01.dailyMenu.js [arguments]
```
<!-- Author -->
## Author

Pavel Sedlář

Project Link: [https://github.com/pauwelcz/menickaFinder](https://github.com/pauwelcz/menickaFinder)

