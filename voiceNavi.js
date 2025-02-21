class VoiceNavigation {
    constructor() {
        this.recognition = new webkitSpeechRecognition();
        this.commands = {
            'go home': '/',
            'start design': '/design',
            'try on': '/ar',
            'log in': '#auth'
        };
        
        this.recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            this.handleCommand(command);
        };
    }

    toggle() {
        if(this.recognition.active) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    handleCommand(command) {
        for(const [key, value] of Object.entries(this.commands)) {
            if(command.includes(key)) {
                window.location.href = value;
                break;
            }
        }
    }
}

const voiceNav = new VoiceNavigation();