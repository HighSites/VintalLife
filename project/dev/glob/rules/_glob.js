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

// window.addEventListener('load', (event) => {
// 	console.log('loaded');
// 	let attrName = 'data-adtf';
// 	let elements = document.querySelectorAll(`[${attrName}]`);
// 	console.debug(elements);
// })

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
		// console.debug('ADTF:', 'for', element);
		// console.debug('ADTF:', 'elPoints are', elPoints);
		elPoints.forEach((elPoint, i) => {
			elPoint = elPoint.split(', ');
			let media = window.matchMedia(`(min-width: ${elPoint[2]/16}em)`);
			media.addEventListener('change', (event) => transfer(event));
			if(media.matches) {
				// console.debug('ADTF: Initially', element, `matching a ${elPoint[2]}px media`);
				sendTo(elPoint);
			}
			function transfer(event) {
				if (event.matches) {
					// console.debug('ADTF:transfer: Now', element, `matching a ${elPoint[2]}px media`);
					sendTo(elPoint);
				}
				else {
					// console.debug('ADTF:transfer: Now', element, `not matching a ${elPoint[2]}px media`);
					sendTo(elPoints[i - 1].split(', '));
				}
			}
			function sendTo(point) {
				let elParentNext = document.querySelector(point[0]);
				let elIndexNext = point[1];
				elIndexNext = ({'first': 1, 'last': elParentNext.children.length + 1}[elIndexNext] || elIndexNext) - 1;
				// console.debug('ADTF:sendTo: transfering ', element, `on ${elIndexNext} position in `, elParentNext);
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
(function() {
	let triggers = document.querySelectorAll('[data-toggle-trigger]');
	
	triggers.forEach(toggleTrigger => {
		toggleTrigger.addEventListener('click', event => toggling(toggleTrigger));
	});
	
	document.addEventListener('click', event => {
		triggers.forEach(trigger => {
			let isInToggle = trigger.contains(event.target);
			if (!isInToggle) {
				let elTarget = document.querySelectorAll(`[data-toggle-target='${trigger.dataset.toggleTrigger}']`);
				if (elTarget)
					elTarget.forEach(target => {
						isInToggle = isInToggle || target.contains(event.target);
					})
			}
			if (!isInToggle && trigger.classList.contains('_toggleActive'))
				toggling(trigger);
		})
	})

	function toggling(trigger) {
		let toggleTrigger = trigger;
		toggleTrigger.classList.toggle('_toggleActive');
		let toggleArea = toggleTrigger.dataset.toggleTrigger;
		let elTarget = document.querySelectorAll(`[data-toggle-target='${toggleArea}']`);
		if (elTarget)
			elTarget.forEach(toggleTarget => toggleTarget.classList.toggle('_toggleActive'));
		if (toggleTrigger.dataset.toggleType == 'burger')
			document.querySelector('body').classList.toggle('lock');
	}
}());
// let customToggle = () => {
// 	let triggers = document.querySelectorAll('[data-toggle-trigger]');

// 	let toggling = (trigger) => {
// 		let toggleTrigger = trigger;
// 		toggleTrigger.classList.toggle('_toggleActive');
// 		let toggleArea = toggleTrigger.dataset.toggleTrigger;
// 		let elTarget = document.querySelectorAll(`[data-toggle-target='${toggleArea}']`);
// 		if (elTarget)
// 			elTarget.forEach(toggleTarget => toggleTarget.classList.toggle('_toggleActive'));
// 		if (toggleTrigger.dataset.toggleType == 'burger')
// 			document.querySelector('body').classList.toggle('lock');
// 	}

// 	triggers.forEach(toggleTrigger => {
// 		toggleTrigger.addEventListener('click', event => toggling(toggleTrigger));
// 	});

// 	document.addEventListener('click', event => {
// 		triggers.forEach(trigger => {
// 			let isInToggle = trigger.contains(event.target);
// 			if (!isInToggle) {
// 				let elTarget = document.querySelectorAll(`[data-toggle-target='${trigger.dataset.toggleTrigger}']`);
// 				if (elTarget)
// 					elTarget.forEach(target => {
// 						isInToggle = isInToggle || target.contains(event.target);
// 					})
// 			}
// 			if (!isInToggle && trigger.classList.contains('_toggleActive'))
// 				toggling(trigger);
// 		})
// 	})
// }

//Dark/light theme toggling
(function () {
	let body = document.querySelector('body');
	let themeNames = ['light', 'dark'];
	let currentTheme = 0;
	let media = window.matchMedia('(prefers-color-scheme: dark)');
	media.addEventListener('change', themeChange);
	if (media.matches)
		currentTheme = 1;
	console.debug('DarkLight:', `system theme: ${currentTheme} (${themeNames[currentTheme]})`);
	let userTheme = localStorage.getItem('preferedTheme');
	if (!userTheme) {
		localStorage.setItem('preferedTheme', currentTheme);
	} else currentTheme = userTheme;
	body.classList.add(`body_theme--${themeNames[currentTheme]}`);
	console.debug('DarkLight:', `user theme: ${userTheme} (${themeNames[userTheme]})`);

	let toggles = document.querySelectorAll('[data-themeToggle]');
	console.debug('DarkLight:', 'toggles', toggles);
	toggles.forEach(toggle => {
		toggle.addEventListener('click', themeChange);
	})
	
	function themeChange() {
		console.debug('DarkLight:', 'theme change...');
		body.classList.toggle(`body_theme--${themeNames[currentTheme]}`);
		body.classList.toggle(`body_theme--${themeNames[currentTheme^1]}`);
		currentTheme ^= 1;
		localStorage.setItem('preferedTheme', currentTheme);
	}
}());
//to create toggle => data-themeToggle