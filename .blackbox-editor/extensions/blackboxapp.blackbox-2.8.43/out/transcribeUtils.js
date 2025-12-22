const {
  StartStreamTranscriptionCommand,
  TranscribeStreamingClient,
} = require("@aws-sdk/client-transcribe-streaming");

let isActivelyRecording = false;
const SAMPLE_RATE = 16000;
const language = "en-US";
let currentTranscript = "";
let id = 1;

const createTranscribeClient = (creds) => {
  return new TranscribeStreamingClient(creds);
};

const encodePCMChunk = (input) => {
  const output = new Uint8Array(input.buffer);
  return output;
};

const getAudioStream = async function* (recorder) {
  try {
    while (recorder.isRecording && isActivelyRecording) {
      const frame = await recorder.read();
      yield {
        AudioEvent: {
          AudioChunk: encodePCMChunk(frame),
        },
      };
    }
  } catch (e) {
    console.log("recording stopped");
  }
};

const startTranscribe = async (client, command, callBack) => {
  const data = await client.send(command);
  if (!data?.TranscriptResultStream) {
    return;
  }
  callBack({
    command: "transcriptStarted",
  });
  for await (const event of data?.TranscriptResultStream) {
    const results = event.TranscriptEvent?.Transcript?.Results;
    if (results?.length && results[0]?.IsPartial) {
      const newTranscript = results[0].Alternatives?.[0].Transcript;
      callBack({
        command: "updateTranscribeText",
        text: currentTranscript + newTranscript,
        id: id++,
      });
    } else if (results?.length && !results[0]?.IsPartial) {
      const newTranscript = results[0].Alternatives?.[0].Transcript;
      currentTranscript += newTranscript + " ";
      callBack({
        command: "updateTranscribeText",
        text: currentTranscript,
        id: id++,
      });
    }
  }
};

const startTranscribing = (message, callBack) => {
  try {
    currentTranscript = "";
    const { PvRecorder } = require("@picovoice/pvrecorder-node");
    const recorder = new PvRecorder(2048, 0);
    isActivelyRecording = true;
  
    const client = createTranscribeClient(message);
    const command = new StartStreamTranscriptionCommand({
      LanguageCode: language,
      MediaEncoding: "pcm",
      MediaSampleRateHertz: SAMPLE_RATE,
      AudioStream: getAudioStream(recorder),
    });
    startTranscribe(client, command, callBack);
    recorder.start();
  } catch (error) {
    console.error(error);
  }
};

const stopTranscribe = () => {
  isActivelyRecording = false;
};

module.exports = {
  startTranscribing,
  stopTranscribe
};