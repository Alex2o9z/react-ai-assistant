export default function ErrorAlert({ message, onClose }) {
    if (!message) return null;

    return (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300 relative">
            <span>{message}</span>
            <button
                onClick={onClose}
                className="absolute top-1 right-2 text-sm text-red-500 hover:text-red-700"
            >
                ×
            </button>
        </div>
    );
}