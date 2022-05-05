import React from 'react';

import DropdownInput from './dropdown-input';

import './style.scss';
const Dropdown = ({ list, setSelected = () => {}, selected }) => {
    const [isListOpen, setListOpen] = React.useState(false);
    const refDropdown = React.useRef();
    React.useEffect(() => {
        const handleClickOutside = e => {
            if (
                e.target.closest('.dropdown') !== refDropdown.current
            ) {
                setListOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className={`dropdown${list.length <= 1 ? ' dropdown__empty' : ''}`} ref={refDropdown}>
            <div className={`dropdown__visible`} >
                <DropdownInput
                    network={selected}
                    onclick={() => (list.length > 1 ? setListOpen(!isListOpen) : null) }
                    optionClass={isListOpen ? "dropdown_opened" : ''}
                />
            </div>
            <div className={`dropdown__options ${isListOpen ? 'dropdown__options_opened' : ''}`}>
                {
                    list.filter(network => network.name !== selected.name)
                        .map((network, index) => (
                            <DropdownInput
                                onclick={() => { setSelected(network); setListOpen(false); }}
                                network={network}
                                key={`${network.name}_${index}`}
                                optionClass={'dropdown__option'}
                            />
                        ))
                }
            </div>
        </div>
    );
};
export default Dropdown;
