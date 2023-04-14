import { JSXElementConstructor, ReactElement } from 'react';
import { Checkbox, CheckboxChangeEvent } from '../../../Checkbox';
import { SelectAllContainer } from './styles';

export interface SelectAllProps {
    checked: boolean;
    onClick?: () => void;
    onSelect?: () => void;
    onDeselect?: () => void;
}

export const SelectAllComponent = (
    props: SelectAllProps,
): ((menu: ReactElement<unknown, string | JSXElementConstructor<unknown>> | undefined) => JSX.Element) => {
    const element = (menu: ReactElement<unknown, string | JSXElementConstructor<unknown>> | undefined): JSX.Element => {
        const { checked, onClick, onSelect, onDeselect } = props;

        const handleChange = (e: CheckboxChangeEvent): void => {
            const { checked } = e.target;

            if (checked && onSelect) {
                onSelect();
                return;
            }

            if (onDeselect) onDeselect();
        };

        return (
            <>
                <SelectAllContainer>
                    <Checkbox id="select-all" checked={checked} onClick={onClick} onChange={handleChange}>
                        Selecionar tudo
                    </Checkbox>
                </SelectAllContainer>

                {menu}
            </>
        );
    };

    return element;
};
