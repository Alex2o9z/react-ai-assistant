import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useApiKeyStore from '@/stores/apiKeyStore';

const InputApiKeyDialog = ({ open, model, defaultValue = '', onSave, onClose }) => {
    const [inputValue, setInputValue] = useState(defaultValue);
    const { setApiKey } = useApiKeyStore();
    const inputRef = useRef(null);

    useEffect(() => {
        setInputValue(defaultValue);
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open, defaultValue]);

    const handleSave = () => {
        if (inputValue) {
            setApiKey(model.group, inputValue);
            onSave?.(inputValue);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="rounded-md">
                <DialogHeader>
                    <DialogTitle>Manage API Key for {model.title}</DialogTitle>
                    <DialogDescription>
                        Provide your {model.title} API Key to proceed.{' '}
                        <a
                            href="https://makersuite.google.com/app/apikey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#6abfe7] hover:underline"
                        >
                            Get API key here
                        </a>
                        <br />
                        (Your API Key is stored locally in your browser's session storage)
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="AIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full"
                        onKeyDown={(e) => e.key === 'Enter' && inputValue && handleSave()}
                    />
                </div>
                <DialogFooter className="flex justify-end gap-2 mt-4">
                    <DialogClose asChild>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSave} disabled={!inputValue}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InputApiKeyDialog;

// import { useState, useRef, useEffect } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import useApiKeyStore from '@/stores/apiKeyStore'; // Import store

// const InputApiKeyDialog = ({ open, onClose }) => {
//     const { apiKey, setApiKey } = useApiKeyStore(); // Lấy apiKey và setApiKey từ store
//     const [inputValue, setInputValue] = useState(apiKey || '');
//     const inputRef = useRef(null);

//     useEffect(() => {
//         if (open && inputRef.current) {
//             inputRef.current.focus();
//         }
//     }, [open]);

//     const handleSave = () => {
//         setApiKey(inputValue); // Cập nhật apiKey vào store
//         console.log('Saved API Key:', inputValue);
//         onClose();
//     };

//     return (
//         <Dialog open={open} onOpenChange={onClose}>
//             <DialogContent className="rounded-md">
//                 <DialogHeader>
//                     <DialogTitle>Manage your API Keys</DialogTitle>
//                     <DialogDescription>
//                         Provide your Google Gemini API Key to proceed.{' '}
//                         <a
//                             href="https://makersuite.google.com/app/apikey"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-[#6abfe7] hover:underline"
//                         >
//                             Get API key here
//                         </a>
//                         <br />
//                         (By default, your API Key is stored locally on your browser and never sent anywhere else)
//                     </DialogDescription>
//                 </DialogHeader>
//                 <div className="mt-4">
//                     <Input
//                         ref={inputRef}
//                         value={inputValue}
//                         onChange={(e) => setInputValue(e.target.value)}
//                         placeholder="AIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
//                         className="w-full"
//                         onKeyDown={(e) => e.key === 'Enter' && inputValue && handleSave()}
//                     />
//                 </div>
//                 <DialogFooter className="flex justify-end gap-2 mt-4">
//                     <DialogClose asChild>
//                         <Button variant="outline" onClick={onClose}>
//                             Cancel
//                         </Button>
//                     </DialogClose>
//                     <Button onClick={handleSave} disabled={!inputValue}>
//                         Save
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default InputApiKeyDialog;

// =============================================================

// import { useState, useRef, useEffect } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import useApiKeyStore from '@/stores/apiKeyStore';

// const InputApiKeyDialog = ({ open, value = '', onSave, onClose }) => {
//     const { apiKey, setApiKey } = useApiKeyStore();
//     const [inputValue, setInputValue] = useState(apiKey || '');
//     const inputRef = useRef(null);

//     useEffect(() => {
//         if (open && inputRef.current) {
//             inputRef.current.focus();
//         }
//     }, [open]);

//     const handleSave = () => {
//         setApiKey(inputValue);
//         console.log('Saved API Key:', inputValue);
//         onClose();
//     };

//     return (
//         <Dialog open={open} onOpenChange={onClose}>
//             <DialogContent className="rounded-md">
//                 <DialogHeader>
//                     <DialogTitle>Manage your API Keys</DialogTitle>
//                     <DialogDescription>
//                         Provide your Google Gemini API Key to proceed.{' '}
//                         <a
//                             href="https://makersuite.google.com/app/apikey"
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-[#6abfe7] hover:underline"
//                         >
//                             Get API key here
//                         </a>
//                         <br />
//                         (By default, your API Key is stored locally on your browser and never sent anywhere else)
//                     </DialogDescription>
//                 </DialogHeader>
//                 <div className="mt-4">
//                     <Input
//                         ref={inputRef}
//                         value={inputValue}
//                         onChange={(e) => setInputValue(e.target.value)}
//                         placeholder="AIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
//                         className="w-full"
//                         onKeyDown={(e) => e.key === 'Enter' && inputValue && handleSave()}
//                     />
//                 </div>
//                 <DialogFooter className="flex justify-end gap-2 mt-4">
//                     <DialogClose asChild>
//                         <Button variant="outline" onClick={onClose}>
//                             Cancel
//                         </Button>
//                     </DialogClose>
//                     <Button onClick={handleSave} disabled={!inputValue}>
//                         Save
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default InputApiKeyDialog;