import React from 'react';
import './style.scss';

import { ReactComponent as NoteIcon } from '../../../assets/images/note_icon.svg';

const Note = () => (
    <div className='form-note'>
        <NoteIcon className="form-note__img" />
        <span className="form-note__text">Note: The tokens will be sent to the same address they were sent from.</span>
    </div>
);
export default Note;
