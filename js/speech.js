import { sepiaSpeechRecognitionInit, SepiaSpeechRecognitionConfig } from 'sepia-speechrecognition-polyfill';

WL.registerComponent('speech', {
    transcriptDisplay: { type: WL.Type.Object },
    accessToken: { type: WL.Type.String, default: 'test1234' },
    clientId: { type: WL.Type.String, default: 'any' },
    model: { type: WL.Type.String, default: '' },
    optimizeFinalResult: { type: WL.Type.Bool, default: true },
    serverUrl: { type: WL.Type.String, default: '' },
    task: { type: WL.Type.String, default: '' },
}, {
    init: function() {
        this.transcriptDisplayText = null;
        this.speechTargets = [];

        this.speaking = false;

        const config = new SepiaSpeechRecognitionConfig();
        config.accessToken = this.accessToken;
        config.clientId = this.clientId;
        config.model = this.model;
        config.optimizeFinalResult = this.optimizeFinalResult;
        config.serverUrl = this.serverUrl;
        config.task = this.task;
        
        const SpeechRecognition = window.webkitSpeechRecognition || sepiaSpeechRecognitionInit(config);
        window.SpeechRecognition = SpeechRecognition;
        this.speechRecognition = new SpeechRecognition();
        if (SpeechRecognition == window.webkitSpeechRecognition) {
            console.log("This browser supports SpeechRecognition.");         
        }
        else {
            console.log("This browser does not natively support SpeechRecognition. SEPIA polyfill will be used.");
        }
        this.speechRecognition.lang = 'en-US';
        this.speechRecognition.maxAlternatives = 1;   
        this.speechRecognition.continuous = this.continuous;
        this.speechRecognition.interimResults = this.interimResults;

        document.addEventListener('keydown', e => {
            if (e.code === 'Space') {
                this.startSpeechRecognition();
            }              
        });
        document.addEventListener('keyup', e => {
            if (e.code === 'Space') {                    
                this.stopSpeechRecognition();
            }   
        });
        const setupVREvents = (s) => {
            s.addEventListener('selectstart', e => {
                this.startSpeechRecognition();
            });
            s.addEventListener('selectend', e => {
                this.stopSpeechRecognition();
            });
        }
        WL.onXRSessionStart.push(setupVREvents.bind(this));
        this.speechRecognition.onresult = e => {
            const transcript = e.results[0][0].transcript;
            console.log(transcript);
            this.transcriptDisplayText.text = transcript;
            this.parse(transcript);
        }
    },
    start: function() {
        this.transcriptDisplayText = this.transcriptDisplay.getComponent('text');
    },
    startSpeechRecognition: function() {
        if (!this.speaking) {
            console.log('started speaking');
            this.speaking = true;
            this.speechRecognition.start();
        }
    },
    stopSpeechRecognition: function() {
        if (this.speaking) {
            console.log('finished speaking');
            this.speaking = false;
            this.speechRecognition.stop();
        }
    },
    parse: function(transcript) {
        const tokens = transcript.toLowerCase().split(' ');
        
        // Extract subject        
        let subject;
        this.speechTargets.forEach(target => {
            if (tokens.includes(target.name.toLowerCase())) {
                subject = target;
            }
        });
        if (!subject) {
            console.log("No speech target found!");
            return;
        }

        // Extract action
        let action;
        subject.functionList.forEach(func => {
            if (tokens.includes(func)) {
                action = func;
            }
        });
        if (!action) {
            console.log("Action not found on speech target!");
            return;
        }

        // Call the specified action on the speech target
        subject.call(action);
    }
});
