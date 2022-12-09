# WLE XR Speech Interactions

This repository contains an example project demonstrating a speech interaction system I developed.
It uses Wonderland Engine to render the world and the Web Speech API to take voice input.
The SpeechRecognition portion of the Web Speech API is also polyfilled with the SEPIA SpeechRecognition Polyfill.
To make use of the polyfill, you will need to connect to a SEPIA STT server. See the [polyfill repo](https://github.com/msub2/sepia-speechrecognition-polyfill) for more details.

## Setup

This is an NPM+Wonderland Engine project, so don't forget to `npm i` before attempting to build the project.
