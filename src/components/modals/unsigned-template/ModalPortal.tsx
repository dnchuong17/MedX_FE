import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface Props {
    children: React.ReactNode;
}

const ModalPortal: React.FC<Props> = ({ children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    return createPortal(children, document.body);
};

export default ModalPortal;
