import { useEffect, useState } from "react";

const useRecorder = () => {
    const [audioURL, setAudioURL] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState(null);
    const [audioChunk, setAudioChunk] = useState(null);

    useEffect(() => {
        // Lazily obtain recorder first time we're recording.
        if (recorder === null) {
            if (isRecording) {
                requestRecorder()
                    .then(setRecorder)
                    .catch(err => console.log(err));
            }
            return;
        }

        // Manage recorder state.
        if (isRecording) {
            // setChunks([]);
            recorder.start();
        } else {
            recorder.stop();
        }

        // Obtain the audio when ready.
        const handleData = e => {
            console.log(e);
            // setChunks(prev => [...prev, e.data]);
            setAudioURL(URL.createObjectURL(e.data));
            setAudioChunk(e.data);
        };

        recorder.addEventListener("dataavailable", handleData);
        return () => recorder.removeEventListener("dataavailable", handleData);
    }, [recorder, isRecording]);

    const startRecording = () => {
        setIsRecording(true);
    };

    const stopRecording = () => {
        setIsRecording(false);
    };

    return [audioURL, isRecording, startRecording, stopRecording, audioChunk, setAudioURL];
};

async function requestRecorder() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log(stream)
    return new MediaRecorder(stream);
}
export default useRecorder;
