import PropTypes from "prop-types";
import { Upload, File, FilePlus2, Link, X } from "lucide-react";

export default function FileUploadPreviewBox({
    currentState,
    files,
    dragOver,
    onDragEnter,
    onDragLeave,
    onDrop,
    onFileSelect,
    onRemoveFile,
}) {
    const isUploaded = ["input-file-uploaded", "input-audio-uploaded"].includes(currentState);
    const isFileSelected = ["input-file-selected"].includes(currentState);
    const isURLSelected = ["input-url"].includes(currentState);
    const isDraggingState = ["input-file"].includes(currentState);

    const validFileTypes = ['pdf', 'doc', 'docx', 'txt', 'wav', 'mp3', 'mp4'];
    const maxFileSizeMB = import.meta.env.VITE_MAX_FILE_SIZE_MB || 200;
    const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

    const handleFileSelect = (selectedFiles) => {
        const newFiles = Array.from(selectedFiles).filter((file) => {
            const isValid = validFileTypes.includes(file.name.split('.').pop()?.toLowerCase());
            const isDuplicate = files.some((f) => f.name === file.name);
            const isTooLarge = file.size > maxFileSizeBytes;

            if (!isValid) {
                alert(`File không hợp lệ: ${file.name}. Chỉ chấp nhận: ${validFileTypes.join(", ")}.`);
                return false;
            }
            if (isDuplicate) {
                alert(`File đã được chọn: ${file.name}.`);
                return false;
            }
            if (isTooLarge) {
                alert(`File quá lớn: ${file.name}. Kích thước tối đa là ${maxFileSizeMB}MB.`);
                return false;
            }
            return true;
        });

        if (files.length + newFiles.length > 10) {
            alert("Chỉ được phép chọn tối đa 10 file.");
            return;
        }
        if (newFiles.length > 0) {
            onFileSelect(newFiles);
        }
    };

    const handleDrop = (droppedFiles) => {
        const newFiles = Array.from(droppedFiles).filter((file) => {
            const isValid = validFileTypes.includes(file.name.split('.').pop()?.toLowerCase());
            const isDuplicate = files.some((f) => f.name === file.name);
            const isTooLarge = file.size > maxFileSizeBytes;

            if (!isValid) {
                alert(`File không hợp lệ: ${file.name}. Chỉ chấp nhận: ${validFileTypes.join(", ")}.`);
                return false;
            }
            if (isDuplicate) {
                alert(`File đã được chọn: ${file.name}.`);
                return false;
            }
            if (isTooLarge) {
                alert(`File quá lớn: ${file.name}. Kích thước tối đa là ${maxFileSizeMB}MB.`);
                return false;
            }
            return true;
        });

        if (files.length + newFiles.length > 10) {
            alert("Chỉ được phép chọn tối đa 10 file. Vui lòng xóa bớt file trước khi thêm mới.");
            return;
        }
        if (newFiles.length > 0) {
            onDrop(newFiles);
        }
    };

    return (
        <div
            className={`w-full flex items-center ${isDraggingState ? "justify-center" : "justify-start"} gap-6 p-3 relative rounded-[18px] border transition-all cursor-pointer ${dragOver
                ? "bg-blue-100 border-blue-400 border-2 border-dashed"
                : "bg-white border border-gray-200"
                }`}
            onDragOver={(e) => {
                e.preventDefault();
                onDragEnter();
            }}
            onDragLeave={(e) => {
                e.preventDefault();
                onDragLeave();
            }}
            onDrop={(e) => {
                e.preventDefault();
                handleDrop(e.dataTransfer.files);
            }}
        >
            <div className="inline-flex flex-col items-center gap-1">
                <div
                    className={`p-4 bg-[#f0f8ff] rounded-xl border-2 ${isDraggingState || isFileSelected ? "border-dashed" : ""
                        } border-primary`}
                >
                    {isDraggingState && <Upload className="w-6 h-6 text-primary" />}
                    {isFileSelected && <FilePlus2 className="w-6 h-6 text-primary" />}
                    {isURLSelected && <Link className="w-6 h-6 text-primary" />}
                    {/* {isUploaded && <File className="w-6 h-6 text-primary" />} */}

                </div>
                {isFileSelected && (
                    <label className="inline-block">
                        <span className="text-primary cursor-pointer text-xs hover:underline">
                            Add files
                        </span>
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt,.wav,.mp3,.mp4"
                            multiple
                            onChange={(e) => handleFileSelect(e.target.files)}
                        />
                    </label>
                )}
            </div>

            <div className="flex min-w-0">
                {isDraggingState && (
                    <label>
                        <span className="text-[#000000b2] cursor-pointer">
                            Drag and drop
                            <br />
                            or <span className="text-primary">Choose files</span>
                        </span>
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.txt,.wav,.mp3,.mp4"
                            multiple
                            onChange={(e) => handleFileSelect(e.target.files)}
                        />
                    </label>
                )}
                {(isFileSelected || isUploaded) && files.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto">
                        {files.map((file, index) => (
                            <div className="flex flex-col gap-1 flex-shrink-0 w-[120px] max-w-[140px]">
                                <div
                                    key={index}
                                    className="relative p-4 bg-gray-50 border-2 border-primary rounded-lg hover:shadow-sm transition-shadow"
                                >
                                    <File className="w-6 h-6 mx-auto text-primary" />
                                    <button
                                        onClick={() => onRemoveFile(index)}
                                        className="absolute top-1 right-1 p-1 text-primary opacity-75 hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-xs text-gray-800 truncate text-center py-1">
                                    {file.name}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

FileUploadPreviewBox.propTypes = {
    currentState: PropTypes.string.isRequired,
    files: PropTypes.array,
    dragOver: PropTypes.bool.isRequired,
    onDragEnter: PropTypes.func.isRequired,
    onDragLeave: PropTypes.func.isRequired,
    onDrop: PropTypes.func.isRequired,
    onFileSelect: PropTypes.func.isRequired,
    onRemoveFile: PropTypes.func.isRequired,
};