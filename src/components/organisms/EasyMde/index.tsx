import React, { TextareaHTMLAttributes, useEffect, useRef } from 'react';
import EasyMde from 'easymde';

import 'easymde/dist/easymde.min.css';
import './EasyMde.scss';

interface SimpleMdeProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  options?: EasyMde.Options;
  onTextChange: (value: string) => void;
}

/**
 * @see https://github.com/Ionaru/easy-markdown-editor#configuration
 */
const defaultOptions: EasyMde.Options = {
  autofocus: false,
  status: false,
  hideIcons: ['guide', 'fullscreen', 'preview', 'side-by-side'],
  spellChecker: false,
  styleSelectedText: false,
};

const SimpleMde: React.FC<SimpleMdeProps> = ({ options, onTextChange, ...props }) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const onTextChangeHandler = useRef(onTextChange);

  useEffect(() => {
    const elementOption = ref.current
      ? {
          element: ref.current,
        }
      : {};
    let simpleMde: EasyMde | null = new EasyMde({
      ...defaultOptions,
      ...options,
      ...elementOption,
    });

    simpleMde.codemirror.on('change', () => {
      if (simpleMde) {
        onTextChangeHandler.current(simpleMde.value());
      }
    });

    return () => {
      if (simpleMde) {
        simpleMde.toTextArea();
        simpleMde = null;
      }
    };
  }, [options, onTextChangeHandler, ref]);

  return (
    <div>
      <textarea ref={ref} readOnly {...props} />
    </div>
  );
};

export default SimpleMde;
