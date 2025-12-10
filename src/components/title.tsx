import { cn } from '@/lib/utils';
import React from 'react';

type TitleSizees = "l" | "m" | "s"

interface Props {
     className?: string;
     size: TitleSizees;
     text: string;
}

export const Title: React.FC<Props> = (props) => {
     const {className, size, text} = props;

    const setMapTag = {
        l: "h1",
        m: "h2",
        s: "h3"
    }

    const setMapSize = {
        l: "text-[36px]",
        m: "text-[26px]",
        s: "text-[22px]"
    }

     return (
        React.createElement(setMapTag[size], {className: cn(setMapSize[size], className)}, text)
    );
}