export default function EmotionIndicator({ emotion }: { emotion: string }) {
    const getEmoji = (e: string) => {
        switch (e?.toLowerCase()) {
            case "happy": return "😊";
            case "angry": return "😠";
            case "sad": return "😢";
            case "surprised": return "😲";
            case "anxious": return "😰";
            default: return "😐";
        }
    };

    return (
        <span className="ml-2 text-lg" title={emotion}>
            {getEmoji(emotion)}
        </span>
    );
}
