import { useEffect, useState } from "react";

const useRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recorder, setRecorder] = useState(null);
    const [audioData, setAudioData] = useState(null);

    const [recoredIsCancel, setRecordCancel] = useState(false);
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
            if (recoredIsCancel) {
                return;
            }
            setAudioData(e.data);
        };

        recorder.addEventListener("dataavailable", handleData);
        return () => recorder.removeEventListener("dataavailable", handleData);
    }, [recorder, isRecording, recoredIsCancel]);

    const startRecording = () => {
        setRecordCancel(false);
        setIsRecording(true);
    };

    const stopRecording = () => {
        setIsRecording(false);
    };
    const cancelRecording = () => {
        setRecordCancel(true);
        setIsRecording(false);
    };

    return [isRecording, startRecording, stopRecording, cancelRecording, audioData];
};

const requestRecorder = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log(stream)
    return new MediaRecorder(stream);
}
export default useRecorder;
