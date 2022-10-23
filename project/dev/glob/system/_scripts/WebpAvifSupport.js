import "gulp-avif-css/plugin.js";

//if you need to disable Avif support uncomment the code below (and make sure to run gulp in the right mode)

// const detect = () => {
//     console.log ("Avif support is ignored");
//     const testWebp = (callback) => {
//         let webP = new Image();
//         webP.onload = webP.onerror = () => {
//             callback(webP.height == 1);
//         };
//         webP.src = "data:image/webp;base64,UklGRhwAAABXRUJQVlA4TBAAAAAvAAAAEAfQpv5HmQMR0f8A"
//     }

//     testWebp(function(support) {
//         let className = support === true ? 'webp' : '';
//         document.documentElement.classList.add(className);
//     });
// }

// detect();