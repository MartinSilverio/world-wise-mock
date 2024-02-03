import { MouseEvent, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonType = 'primary' | 'back' | 'position';

function Button({
    children,
    onClick,
    type,
}: {
    children: ReactNode;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    type: ButtonType;
}) {
    return (
        <button className={`${styles.btn} ${styles[type]}`} onClick={onClick}>
            {children}
        </button>
    );
}

export default Button;
