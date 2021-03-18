const fetch = require('node-fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { cyan, green, red } = require('chalk');

async function parser() {
	const response = await fetch(
		'https://www.sharp.com/health-classes/volunteer-registration-grossmont-center-covid-19-vaccine-clinic-2558'
	);
	const text = await response.text();
	const dom = await new JSDOM(text);
	const htmlTimeSlots = dom.window.document.getElementsByClassName(
		'section-date row'
	);
	const timeSlotArr = Array.from(htmlTimeSlots);
	let timeSlotFound = false;
	for (const slot of timeSlotArr) {
		const strSlot = slot.innerHTML;
		if (
			strSlot.includes('More Info') ||
			strSlot.includes('Classes and Events')
			// Uncomment the below line to see the simulated results when a slot is found
			// || strSlot.includes('Closed')
		) {
			console.log(green('\nWe found an open slot!\n'));
			timeSlotFound = true;
			let filteredDetails = strSlot
				.replace(/(<.*?>)/g, '')
				.split('\n')
				.filter((val) => val !== '\n' && val !== '')
				.join('\n');
			console.log(`Here are the details: \n${cyan(filteredDetails)}`);
		}
	}
	if (!timeSlotFound) {
		// Retries after 30 seconds
		console.log(red('Unsuccessful. Retrying'));
		setTimeout(() => parser(), 30000);
	} else {
		console.log('\x07');
	}
}
console.log(
	green(
		'Starting volunteer site crawler. \nThis will run until the process is killed, until an open slot is found'
	)
);
parser();
