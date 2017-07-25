console.log('module 2 loaded! r==eallykdfhjdf');

import $ from 'jquery';

const $h1 = $('h1');
$h1.text('changed');
const h1 = document.querySelector('h1');

h1.addEventListener('click', function () {
	console.log('clicked', this);
}, false)