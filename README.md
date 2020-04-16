# poor-mans-iot-led-strip

## Overview

This is a quick and dirty implementation of a remote-controlled LED strip, using:
 * Puck.js as a BLE button to toggle between LED effects.
 * Raspberry Pi Zero W as the receiver of the commands. The RPi runs the hyperion (ambilight software) to control the LED strip.
 * WS2801 LED strip connected to the Rpi Zero W to display the effects.

## Communication

Communication occurs using BLE Advertising.

### Button

When the he Puck.js program starts, it sets its Bluetooth module to sleep. As soon as the button is pressed, the Bluetooth module is woken and will be put to sleep after a reasonable time of inactivity (15 seconds).
As soon as the Bluetooth module is awake, the code goes into 'Editing' mode (which will revert to 'Idle' mode after a 5 seconds of inactivity).
Once 'Editing' mode is activated, every button press will advertise a 'button press' event using BLE capabilities, including the value of the current number of button presses, and will also increase that counter by 1.

The various LEDs indicate the different states of the button:
 - The blue LED will be turned on for as long as the Bluetooth module is kept awake, as soon as it turns off, it means that the Bluetooth module is put to sleep.
 - The green LED will be turned on when the button goes into 'Editing' mode, and it'll turn off as soon as the button goes back to 'Idle'
 mode.
 - The red LED will be turned on when a button press is registered.

### LEDs

When the RPi receiver is started, it connects to the Hyperion server (the address and port can be configured), and will also start listening for BLE advertising events.
When an event is received, it checks if the UUID matches the Puck.js one, and if so, it checks to see if the payload includes the count of button presses, if that's found, it uses the hyperion-client package to display the next effect using the LED strip.

By default, the LEDs will iterate through a list of hyperion effects, then a list of colors, and then it'll turn off (changes on every button press).

### Notes

This assumes hyperion is correctly installed and configured in the Raspberry Pi Zero W.
This assumes node.js and npm is correctly installed in the Raspberry Pi Zero W.
This also assumes a recent version of the Puck.js firmware is installed in the Puck.js device.
