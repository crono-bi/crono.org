import React from 'react';
import Link from '@docusaurus/Link';

type ButtonProps = {
  text: string;
  to: string;
  backgroundColor?: string;
  color?: string;
  className?: string;
};

export default function Button({ 
  text, 
  to,
  backgroundColor = '#007bcc',
  color = 'white',
  className = 'button button--lg padding--md'
}: ButtonProps): React.ReactElement {
  return (
    <Link
      className={className}
      to={to}
      style={{ backgroundColor, color }}>
      {text}
    </Link>
  );
}
