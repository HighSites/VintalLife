// let anim = () => {
// 	//to activate: ._unvisible + data-to-animate (=x, if you want to determine threshold)
// 	let animItems = document.querySelectorAll('[data-to-animate]');
// 	if (animItems) {
// 		animItems.forEach(animItem => animCreateObserver(animItem));
// 	}

// 	function animCreateObserver(el) {
// 		let itemThreshold = el.dataset.toAnimate ? parseInt(el.dataset.toAnimate) : 1/2;
// 		let observer = new IntersectionObserver(animate, {
// 			threshold: itemThreshold
// 		});
// 		observer.observe(el);
// 	}

// 	function animate (entries, observer) {
// 		entries.forEach(entry => {
// 			if(entry.isIntersecting) {
// 				entry.target.classList.remove('_unvisible');
// 				observer.unobserve(entry.target);
// 			}
// 		})
// 	}
// };

let lockBody = () => {
  let body = document.querySelector('body');
  let elem = document.querySelector('.scrollbarWidthDetector');
  let scrollbarWidth = elem.offsetWidth - elem.clientWidth;
  body.classList.toggle('lock');
  if (body.classList.contains('lock'))
    body.style.marginRight = `${scrollbarWidth}px`;
  else body.style.removeProperty("margin-right");
}

//Adaptive transfering elements from one parent to another depending on resolution
(function () {
  let attrName = 'data-adtf';
  let elements = document.querySelectorAll(`[${attrName}]`);
  elements.forEach(element => {
    let elPoints = element.getAttribute(attrName).split('; ');
    let elParent = element.parentElement;
    let elIndex = [...elParent.children].indexOf(element);
    let elParentID = '.' + elParent.classList.value.replace(' ', '.');
    elPoints = [`${elParentID}, ${elIndex}, -1`].concat(elPoints);
    // // console.debug('ADTF:', 'for', element);
    // // console.debug('ADTF:', 'elPoints are', elPoints);
    elPoints.forEach((elPoint, i) => {
      elPoint = elPoint.split(', ');
      let media = window.matchMedia(`(min-width: ${elPoint[2] / 16}em)`);
      media.addEventListener('change', (event) => transfer(event));
      if (media.matches) {
        // // console.debug('ADTF: Initially', element, `matching a ${elPoint[2]}px media`);
        sendTo(elPoint);
      }
      function transfer(event) {
        if (event.matches) {
          // // console.debug('ADTF:transfer: Now', element, `matching a ${elPoint[2]}px media`);
          sendTo(elPoint);
        }
        else {
          // // console.debug('ADTF:transfer: Now', element, `not matching a ${elPoint[2]}px media`);
          sendTo(elPoints[i - 1].split(', '));
        }
      }
      function sendTo(point) {
        let elParentNext = document.querySelector(point[0]);
        let elIndexNext = point[1];
        elIndexNext = ({ 'first': 1, 'last': elParentNext.children.length + 1 }[elIndexNext] || elIndexNext) - 1;
        // // console.debug('ADTF:sendTo: transfering ', element, `on ${elIndexNext} position in `, elParentNext);
        elParentNext.insertBefore(element, elParentNext.children[elIndexNext]);
      }
    })
  });
}());
//To use -> add data-adtf="point1; point2; point3" to element,
// where point[i] -> "parent[i], index[i], resolution[i]" 
// parent[i] need to be determened strictly! (or the element will go to the first, that matches)
//points needed to be sorted from minor to greater by resolution


//TOGGLES
(function () {
  let toggleActiveClassName = '_toggleActive';
  let triggers = document.querySelectorAll('[data-toggle-trigger]');
  let areasSafeZones = new Map;

  triggers.forEach(toggleTrigger => {
    if (toggleTrigger.dataset.toggleSafeArea) {
      let area = toggleTrigger.dataset.toggleTrigger;
      let curZones = areasSafeZones.get(area);
      curZones = toggleTrigger.dataset.toggleSafeArea + (curZones ? curZones : '');
      areasSafeZones.set(toggleTrigger.dataset.toggleTrigger, curZones);
    }
    toggleTrigger.addEventListener('click', event => {
      if (event.target.dataset.toggleType?.includes('delay')) {
        setTimeout(() => toggling(toggleTrigger), 0)
      } else toggling(toggleTrigger);
    });
  });

  // console.debug('TGL: areasSafeZones', areasSafeZones);

  document.addEventListener('click', event => {
    let clickedToggleAreas = new Map(); //when there are several triggers for one area and glob function check only trigger not the whole area, other triggers toggle each other (and when their quantity is even nothing happens with targets)
    triggers.forEach(trigger => {
      if (trigger.contains(event.target)) {
        let clickedArea = trigger.dataset.toggleTrigger;
        // console.debug('TGL: glob:', clickedArea, 'was clicked');
        clickedToggleAreas.set(clickedArea, true);
      }
    })
    triggers.forEach(trigger => {
      // console.debug('TGL: The question is: should we untoggle this trigger', trigger);
      let noNeed = clickedToggleAreas.get(trigger.dataset.toggleTrigger);
      if (!noNeed) {
        let elTarget = document.querySelectorAll(`[data-toggle-target='${trigger.dataset.toggleTrigger}']`);
        if (elTarget)
          elTarget.forEach(target => {
            noNeed = noNeed || target.contains(event.target);
          })
      }
      // let safeAreas = trigger.dataset.toggleSafeArea;
      let safeAreas = areasSafeZones.get(trigger.dataset.toggleTrigger);
      if (safeAreas) {
        // console.debug('TGL: safe areas are detected');
        safeAreas = safeAreas.split('; ');
        // console.debug('TGL:', safeAreas);
        safeAreas.forEach(areaName => {
          // console.debug('TGL: this one is', areaName);
          let areas = document.querySelectorAll(areaName);
          if (areas)
            // console.debug('TGL: here it is', areas);
            areas.forEach(area => {
              // console.debug('TGL: does it contain clicked element?', area.contains(event.target))
              noNeed = noNeed || area.contains(event.target);
            })
        })
      }
      // console.debug('TGL: No need?', noNeed);
      if (!noNeed && trigger.classList.contains(toggleActiveClassName))
        toggling(trigger);
    })
  })

  function toggling(trigger) {
    // console.debug('TGL: toggling was loaded!');
    let toggleTrigger = trigger;
    // console.debug('TGL: for', toggleTrigger);
    let toggleArea = toggleTrigger.dataset.toggleTrigger;
    if (toggleTrigger.dataset.toggleType?.includes('severalToggles')) {
      let curStateIsOn = toggleTrigger.classList.contains(toggleActiveClassName);
      // console.debug('TGL: is active?', curStateIsOn);
      let elTriggers = document.querySelectorAll(`[data-toggle-trigger='${toggleArea}']`);
      if (elTriggers)
        if (curStateIsOn)
          elTriggers.forEach(toggleTrigger => toggleTrigger.classList.remove(toggleActiveClassName));
        else elTriggers.forEach(toggleTrigger => toggleTrigger.classList.add(toggleActiveClassName));
    } else toggleTrigger.classList.toggle(toggleActiveClassName);
    let elTarget = document.querySelectorAll(`[data-toggle-target='${toggleArea}']`);
    // console.debug('TGL: targets', elTarget);
    if (elTarget)
      elTarget.forEach(toggleTarget => {
        toggleTarget.classList.toggle(toggleActiveClassName);
        if (toggleTarget.dataset.toggleType?.includes('modal')) {
          toggleTarget.ariaHidden = !toggleTarget.classList.contains(toggleActiveClassName);
        }
      });
    // console.debug('TGL: trigger types:', toggleTrigger.dataset.toggleType);
    // console.debug('TGL: is it includes burger type?:', toggleTrigger.dataset.toggleType.includes('burger'));
    if (toggleTrigger.dataset.toggleType?.includes('burger'))
      lockBody();
  }
}());
// to use [data-toggle-trigger="toggleArea1"] on toggling element
// [data-toggle-target="toggleArea1"] on torget element for toggling element with the same toggleArea
// trigger:  [data-toggle-type] = "burger" => body locking
// trigger:  [data-toggle-type] = "severalToggles" => activeClass will appear only on target elements, not on this trigger
// target:  [data-toggle-type] = "modal" => adds and removes area-hidden attribute 
// trigger:  [data-toggle-type] = "delay" => useful when two or more 'click' events are present and toggling needs to be the last one
// trigger: [data-toggle-safe-areas]= "el1; el2; el3" => el1 - string that is valid in document.querySelector usage. Clicking on the "safe" elemet won't remove active state from area


//Dark/light theme toggling
(function () {
  let body = document.querySelector('body');
  let themeNames = ['light', 'dark'];
  let currentTheme = 0;
  let media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', themeChange);
  if (media.matches)
    currentTheme = 1;
  // console.debug('DarkLight:', `system theme: ${currentTheme} (${themeNames[currentTheme]})`);
  let userTheme = localStorage.getItem('preferedTheme');
  if (!userTheme) {
    localStorage.setItem('preferedTheme', currentTheme);
  } else currentTheme = userTheme;
  body.classList.add(`body_theme--${themeNames[currentTheme]}`);
  // console.debug('DarkLight:', `user theme: ${userTheme} (${themeNames[userTheme]})`);

  let toggles = document.querySelectorAll('[data-themeToggle]');
  // console.debug('DarkLight:', 'toggles', toggles);
  toggles.forEach(toggle => {
    toggle.addEventListener('click', themeChange);
  })

  function themeChange() {
    // console.debug('DarkLight:', 'theme change...');
    body.classList.toggle(`body_theme--${themeNames[currentTheme]}`);
    body.classList.toggle(`body_theme--${themeNames[currentTheme ^ 1]}`);
    currentTheme ^= 1;
    localStorage.setItem('preferedTheme', currentTheme);
  }
}());
//to create toggle => data-themeToggle


// telephone input formatting & validation
import { AsYouType } from 'libphonenumber-js'
(function () {
  let inputFields = document.querySelectorAll('input[type="tel"]');
  if (inputFields)
    inputFields.forEach(input => {
      let formatter = new AsYouType();
      input.addEventListener('input', event => inputFormatter(event, formatter));
    })
  function inputFormatter(event, formatter) {
    let input = event.target;
    let caretStart = input.selectionStart, caretEnd = input.selectionEnd;
    if (caretStart == caretEnd && caretStart == input.value.length && event.data)
      input.value = formatter.input(event.data);
    else {
      formatter.reset();
      input.value = formatter.input(input.value);
      input.setSelectionRange(caretStart, caretEnd);
    }
    // console.debug('TelParse: ', formatter.isValid());
    if (formatter.isValid())
      input.setCustomValidity('');
    else input.setCustomValidity('This phone number is not valid');
  }
}());

//form validating message
(function () {
  let formsSubmitters = document.querySelectorAll('button[type="submit"]');
  if (formsSubmitters)
    formsSubmitters.forEach(btn => {
      btn.addEventListener('click', event => {
        let curNode = btn;
        while (curNode != document && curNode.nodeName != 'FORM') {
          curNode = curNode.parentNode;
        }
        // console.debug('FormSub: found parent', curNode);
        if (curNode == document)
          return;
        let form = curNode;
        // console.debug('FormSub: form for a button', form);
        let response;
        if (form.checkValidity())
          response = document.querySelector('[data-form-response-accept]');
        else response = document.querySelector('[data-form-response-decline]');
        // console.debug('FormSub: response window', response);
        btn.dataset.toggleTrigger = response.dataset.toggleTarget;
        // console.debug('FormSub: final button', btn);
      })
    })
}());

(function() {
  try {
    document.querySelector('*:has(*)');
    console.debug('POLY: has selector is supported');
  } catch (error) {
    console.debug('POLY: has selector is not supported');
    let needHas = document.querySelectorAll('[data-polyfill-has]');
    if (needHas)
      needHas.forEach(elementToStyle => {
        console.debug('POLY: this element needs a :has support', elementToStyle);
        let elementToFind = elementToStyle.dataset.polyfillHas;
        console.debug('POLY: it needs to have a', elementToFind);
        if(elementToStyle.querySelector(elementToFind)) {
          console.debug('POLY: it has it!');
          elementToStyle.classList.add('_HasSupport-true');
        }
      });
  }
}());
//to use => data-polyfill-pseudo-class = "arguments"
//and write a code here!