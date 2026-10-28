import React from 'react';
import { Button } from "@heroui/button";

const Buttons = ({ href, target = '_self', label, icon, classes, 'aria-label': ariaLabel, title, download }) => {
    if (href) {
        return (
            <Button as="a"
            className={`btn bg-blue-600 btn-primary text-center text-base ${classes || ''}`} 
            href={href} 
            target={target}
            download={download}
            aria-label={ariaLabel || label}
            title={title || label}
            rel="noopener noreferrer">
            {label} 
            {icon ? <span aria-hidden="true">{icon}</span> : undefined}
            </Button>
        )
    } else {
        return (
            <Button 
                className={`btn bg-blue-600 btn-primary text-center text-base ${classes || ''}`}
                aria-label={ariaLabel || label}
                title={title || label}>
                {label}
                {icon ? <span aria-hidden="true">{icon}</span> : undefined}
            </Button>
        )
    }
}

const ButtonExtend = ({ href, target = '_self', label, icon, classes, 'aria-label': ariaLabel, title }) => {
    if (href) {
        return (
            <Button as="a"
            className={`btn btn-outline text-center text-base ${classes || ''}`} 
            href={href} 
            target={target}
            aria-label={ariaLabel || label}
            title={title || label}
            rel="noopener noreferrer">
            {label} 
            {icon ? <span aria-hidden="true">{icon}</span> : undefined}
            </Button>
        )
    } else {
        return (
            <Button 
                color="default" 
                className={`btn btn-outline text-center text-base ${classes || ''}`}
                aria-label={ariaLabel || label}
                title={title || label}>
                {label}
                {icon ? <span aria-hidden="true">{icon}</span> : undefined}
            </Button>
        )
    }
}

export { Buttons, ButtonExtend };
