import { useCallback } from "react";

export const useFileActions = (audioAction) => {
    const handleFullScript = useCallback(
        async (fileName) => await audioAction(fileName, "full_script"),
        [audioAction]
    );
    const handleSummarize = useCallback(
        async (fileName) => await audioAction(fileName, "summarize"),
        [audioAction]
    );
    return { handleFullScript, handleSummarize };
};