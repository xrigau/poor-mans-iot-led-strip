# poor-mans-iot-led-strip

This is a quick and dirty implementation of a remote-controlled LED strip, using:
 * Puck.js as a BLE button to toggle between LED effects.
 * Raspberry Pi Zero W as the receiver of the commands. The RPi runs the hyperion (ambilight software) to control the LED strip.
 * WS2801 LED strip connected to the Rpi Zero W to display the effects.

Communication occurs using BLE Advertising.