import React from 'react';

type SubtitleProps = {
  text: string;
  color?: string;
  className?: string;
};

export default function Subtitle({ 
  text, 
  color = '#007bcc',
  className = 'hero__subtitle'
}: SubtitleProps): React.ReactElement {
  return (
    <p className={className} style={{ color }}>
      {text}
    </p>
  );
}
