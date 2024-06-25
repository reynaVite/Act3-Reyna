const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = {
    en: {
        translation: {
            WELCOME_MESSAGE: 'Welcome Vite! You can ask me to convert temperatures.',
            HELP_MESSAGE: 'You can ask me to convert temperatures between Fahrenheit and Celsius Vite.',
            GOODBYE_MESSAGE: 'Goodbye Vite!',
            FALLBACK_MESSAGE: 'Sorry Vite, I don\'t know about that. Please try again.',
            ERROR_MESSAGE: 'Sorry Vite, there was an error. Please try again.',
            CONVERTED_MESSAGE: 'Vite, {{gradosFahrenheit}} degrees Fahrenheit are {{gradosCelsius}} degrees Celsius.',
        }
    },
    es: {
        translation: {
            WELCOME_MESSAGE: '¡Bienvenida Vite! Puedes pedirme que convierta temperaturas.',
            HELP_MESSAGE: 'Puedes pedirme que convierta temperaturas entre Celsius y Fahrenheit Vite.',
            GOODBYE_MESSAGE: '¡Adiós Vite!',
            FALLBACK_MESSAGE: 'Lo siento Vite, no sé sobre eso. Por favor intenta de nuevo.',
            ERROR_MESSAGE: 'Lo siento Vite, ha ocurrido un error. Por favor intenta de nuevo.',
            CONVERTED_MESSAGE: 'Vite, {{gradosCelsius}} grados Celsius equivalen a {{gradosFahrenheit}} grados Fahrenheit.',
        }
    }
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            resources: languageStrings,
            returnObjects: true
        });
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        }
    }
};

const ConvertirCelsiusAFahrenheitIntentHandler = {
    canHandle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale;
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && locale.startsWith('es')
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertirCelsiusAFahrenheitIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const gradosCelsius = handlerInput.requestEnvelope.request.intent.slots.gradosCelsius.value;
        const gradosFahrenheit = (gradosCelsius * 9 / 5) + 32;
        const speakOutput = requestAttributes.t('CONVERTED_MESSAGE', { gradosCelsius: gradosCelsius, gradosFahrenheit: gradosFahrenheit.toFixed(2) });

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ConvertFahrenheitToCelsiusIntentHandler = {
    canHandle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale;
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && locale.startsWith('en')
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertFahrenheitToCelsiusIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const gradosFahrenheit = handlerInput.requestEnvelope.request.intent.slots.gradosFahrenheit.value;
        const gradosCelsius = (gradosFahrenheit - 32) * 5 / 9;
        const speakOutput = requestAttributes.t('CONVERTED_MESSAGE', { gradosFahrenheit: gradosFahrenheit, gradosCelsius: gradosCelsius.toFixed(2) });

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('FALLBACK_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('ERROR_MESSAGE');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConvertirCelsiusAFahrenheitIntentHandler,
        ConvertFahrenheitToCelsiusIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler
    )
    .addErrorHandlers(
        ErrorHandler
    )
    .addRequestInterceptors(
        LocalizationInterceptor,
        LoggingRequestInterceptor
    )
    .addResponseInterceptors(
        LoggingResponseInterceptor
    )
    .withCustomUserAgent('sample/convertidor-angy/v1.2')
    .lambda();
