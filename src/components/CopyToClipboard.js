const CopyToClipboard = (text, onSuccess, onError) => {
    const copyWithExecCommand = () => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            onSuccess && onSuccess();
        } catch (err) {
            onError && onError(err);
        }
        document.body.removeChild(textarea);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                onSuccess && onSuccess();
            })
            .catch(() => {
                copyWithExecCommand();
            });
    } else {
        copyWithExecCommand();
    }
};

export default CopyToClipboard;