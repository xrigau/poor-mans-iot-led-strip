var noble = require('@abandonware/noble');
var Hyperion = require('hyperion-client');
var hyperion = new Hyperion(process.argv[2] || 'localhost', process.argv[3] || 19444);

noble.startScanning([], true)

const puckJsServiceUuid = "6e400001b5a3f393e0a9e50e24dcca9e"
const effects = [
	{type: 'effect', name: 'Blue mood blobs'},
	{type: 'effect', name: 'Police Lights Solid'},
	{type: 'effect', name: 'Knight rider'},
	{type: 'effect', name: 'X-Mas'},
	{type: 'color', rgb: [255, 0, 0]},
	{type: 'color', rgb: [0, 255, 0]},
	{type: 'color', rgb: [0, 0, 255]},
	{type: 'color', rgb: [255, 255, 255]},
	{type: 'color', rgb: [0, 0, 0]}
];
var effectIndex = 0;

var lastClickCount = null;
var hyperionConnected = false;


hyperion.on('connect', () => {
    console.log('hyperion connected');
    hyperionConnected = true;
})


hyperion.on('error', (error) => {
    console.error('hyperion error:', error)
    hyperionConnected = false;
})


noble.on('discover', (peripheral) => {
	if (peripheral.advertisement.serviceUuids != puckJsServiceUuid) {
		return;
	}
	if (peripheral.advertisement == null || peripheral.advertisement.serviceData == null || peripheral.advertisement.serviceData[0] == null || peripheral.advertisement.serviceData[0].data[0] == null) {
		console.log("Missing data");
		return;
	}
	if (lastClickCount == peripheral.advertisement.serviceData[0].data[0]) {
		console.log("Duplicate");
		return;
	}
	if (!hyperionConnected) {
		console.log("Not connected to hyperion");
		return;
	}

    console.log("Another button click: " + peripheral.advertisement.serviceData[0].data[0]);
    lastClickCount = peripheral.advertisement.serviceData[0].data[0];
    nextEffect();

});

function nextEffect() {
	const nextEffect = effects[effectIndex];
	if (nextEffect.type == 'effect') {
		hyperion.setEffect(nextEffect.name, {}, (err, result) => {
	        if (err) console.log('err', err, 'result', result)
	        updateEffectIndex();
	    })
	} else {
		hyperion.setColor(nextEffect.rgb, (err, result) => {
			if (err) console.log('err', err, 'result', result)
	        updateEffectIndex();
	    })
	}
}

function updateEffectIndex() {
	effectIndex++;
    if (effectIndex == effects.length) {
    	effectIndex = 0;
    }
}
