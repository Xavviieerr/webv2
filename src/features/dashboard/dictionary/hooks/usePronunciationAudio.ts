import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setPlayingAudio } from "@/slice/audioSlice";

export function usePronunciationAudio() {
  const dispatch = useDispatch();
  const playingAudioUrl = useSelector(
    (state: RootState) => state.audio?.playingAudioUrl ?? null,
  );

  const handlePlayPronunciation = (audioUrl: string | null | undefined) => {
    if (!audioUrl) return;
    dispatch(setPlayingAudio(audioUrl));
    const audio = new Audio(audioUrl);
    const clearPlaying = () => dispatch(setPlayingAudio(null));
    audio.addEventListener("ended", clearPlaying);
    audio.addEventListener("error", clearPlaying);
    audio.play().catch(clearPlaying);
  };

  return { playingAudioUrl, handlePlayPronunciation };
}