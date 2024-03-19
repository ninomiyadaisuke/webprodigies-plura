import React from 'react';

import { EditorElement } from '@/providers/editor/editor-provider';

type Props = {
  element: EditorElement;
};

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case 'text':
      return <div>text</div>;
    case 'container':
      return <div>container</div>;
    case 'video':
      return <div>video</div>;
    case 'contactForm':
      return <div>contactForm</div>;
    case '2Col':
      return <div>2Col</div>;
    case '__body':
      return <div>__body</div>;
    case 'link':
      return <div>link</div>;
    default:
      return null;
  }
};

export default Recursive;
