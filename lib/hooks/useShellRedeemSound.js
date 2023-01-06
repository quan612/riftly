import { useEffect, useState } from "react";
import { BufferLoader } from "utils/buffer-loader";

export default function useShellRedeemSound() {
    let bufferLoader, audioContext;

    const [audioControl, setAudioControl] = useState({
        isSoundOn: true,
        audioContext: null,
        bufferList: null
    });

    const [audioState, setAudioState] = useState("unloaded");


    useEffect(() => {
        if (audioState == "unloaded") {
            LoadAudios();
        } else {
            // PlayIdleVendingMachine();
        }
        return () => { };
    }, [audioState]);

    const LoadAudios = () => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
        bufferLoader = new BufferLoader(
            audioContext,
            [
                "/challenger/audio/01_machine_idle.mp3",
                "/challenger/audio/02_machine_stuck.mp3",
                "/challenger/audio/03_machine_punch.mp3",
                "/challenger/audio/04_machine_reward.mp3",
                "/challenger/audio/Underwater.mp3",
            ],
            onFinishedLoadingAudioSource
        );

        bufferLoader.load();
    };

    const PlayIdleVendingMachine = () => {
        if (audioControl.idle.isPlaying == false) {
            if (audioControl.idle && typeof audioControl.idle.playRepeat === "function") {

                if (audioControl.isSoundOn) {

                    audioControl.idle.playRepeat(1);
                }

                setAudioControl((prevState) => ({
                    ...prevState,
                    idle: {
                        ...prevState.idle,
                        isPlaying: true,
                    },
                }));
            }
        }
    };

    const onFinishedLoadingAudioSource = (bufferList) => {
        setAudioControl((prevState) => ({
            ...prevState,
            setSound: function (val) {
                if (val === false) {
                    this.idle.setVolume(1);
                } else {
                    // this.background.play(0.5);
                }
            },

            bufferList,
            idle: {
                isPlaying: false,
                source: null,
                gainNode: null,
                playRepeat: function (volumeVal = 1) {
                    this.source = audioContext.createBufferSource();
                    this.source.buffer = bufferList[0];
                    this.gainNode = audioContext.createGain();

                    if (!audioControl.isSoundOn) {
                        this.gainNode.gain.value = 0;
                    } else {
                        this.gainNode.gain.value = volumeVal;
                    }

                    this.source.connect(this.gainNode).connect(audioContext.destination);
                    this.source.start(0);
                    this.source.loop = true;
                },
                stop: function () {
                    if (this.source) {
                        this.source.stop();
                    }
                },
            },
            stuck: {
                source: null,
                gainNode: null,
                play: function (volumeVal = 1) {
                    this.source = audioContext.createBufferSource();
                    this.source.buffer = bufferList[1];
                    this.gainNode = audioContext.createGain();

                    if (!audioControl.isSoundOn) {
                        this.gainNode.gain.value = 0;
                    } else {
                        this.gainNode.gain.value = volumeVal;
                    }

                    this.source.connect(this.gainNode).connect(audioContext.destination);
                    this.source.start(0);
                },
                stop: function () {
                    if (this.source) {
                        this.source.stop();
                    }
                },
            },
            punch: {
                source: null,
                gainNode: null,
                play: function (volumeVal = 1) {
                    this.source = audioContext.createBufferSource();
                    this.source.buffer = bufferList[2];
                    this.gainNode = audioContext.createGain();

                    if (!audioControl.isSoundOn) {
                        this.gainNode.gain.value = 0;
                    } else {
                        this.gainNode.gain.value = volumeVal;
                    }

                    this.source.connect(this.gainNode).connect(audioContext.destination);
                    this.source.start(0);
                },
                stop: function () {
                    if (this.source) {
                        this.source.stop();
                    }
                },
            },
            reward: {
                source: null,
                gainNode: null,
                play: function (volumeVal = 1) {
                    this.source = audioContext.createBufferSource();
                    this.source.buffer = bufferList[3];
                    this.gainNode = audioContext.createGain();

                    if (!audioControl.isSoundOn) {
                        this.gainNode.gain.value = 0;
                    } else {
                        this.gainNode.gain.value = volumeVal;
                    }

                    this.source.connect(this.gainNode).connect(audioContext.destination);
                    this.source.start(0);
                },
                stop: function () {
                    if (this.source) {
                        this.source.stop();
                    }
                },
            },
            underwater: {
                isPlaying: false,
                source: null,
                gainNode: null,
                playRepeat: function (volumeVal = 1) {
                    this.source = audioContext.createBufferSource();
                    this.source.buffer = bufferList[4];
                    this.gainNode = audioContext.createGain();

                    if (!audioControl.isSoundOn) {
                        this.gainNode.gain.value = 0;
                    } else {
                        this.gainNode.gain.value = volumeVal;
                    }

                    this.source.connect(this.gainNode).connect(audioContext.destination);
                    this.source.start(0);
                    this.source.loop = true;
                },
                stop: function () {
                    if (this.source) {
                        this.source.stop();
                    }
                },
            },
        }));

        setAudioState("loaded");
    };

    return [audioControl, PlayIdleVendingMachine];
}