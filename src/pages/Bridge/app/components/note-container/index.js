import { bindActionCreators } from '@reduxjs/toolkit';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NotePopup from './note-popup';
import { noteActions } from '../../redux/index';
import './style.scss';

const NoteContainer = () => {
    const popupsNoteList = useSelector(state => state.notePopup);
    const dispatch = useDispatch();

    const { removeNote } = bindActionCreators(noteActions, dispatch);

    return (
        <div className='popups'>
            {popupsNoteList.map(item => (
                <NotePopup key={item.id} togglePopup={() => removeNote(item.id)} text={item.text} />
            ))
            }
        </div>
    );
};
export default NoteContainer;
