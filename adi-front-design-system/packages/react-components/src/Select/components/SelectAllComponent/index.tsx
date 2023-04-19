import { JSXElementConstructor, ReactElement, useEffect, useState } from 'react';
import { Checkbox, CheckboxChangeEvent } from '../../../Checkbox';
import { SelectAllContainer } from './styles';

export interface SelectAllProps {
    defaultValue?: boolean;
    onChange?: (value: boolean) => void;
    onSelect?: () => void;
    onDeselect?: () => void;
}

export const SelectAllComponent = (
    props: SelectAllProps,
    selectOptions: () => void,
    deselectOptions: () => void,
    isAllItemsSelected: Readonly<boolean>,
): ((menu: ReactElement<unknown, string | JSXElementConstructor<unknown>> | undefined) => JSX.Element) => {
    const { defaultValue, onChange, onSelect, onDeselect } = props;
    const [isAllSelected, setIsAllSelected] = useState<boolean>(isAllItemsSelected || (defaultValue ?? false));

    useEffect(() => setIsAllSelected(isAllItemsSelected), [isAllItemsSelected]);

    const element = (menu: ReactElement<unknown, string | JSXElementConstructor<unknown>> | undefined): JSX.Element => {
        const handleClick = () => setIsAllSelected((state) => !state);

        const handleChange = (e: CheckboxChangeEvent): void => {
            const { checked } = e.target;

            if (onChange) onChange(checked);

            setIsAllSelected(checked);

            if (checked) {
                selectOptions();
                if (onSelect) onSelect();

                return;
            }

            deselectOptions();
            if (onDeselect) onDeselect();
        };

        return (
            <>
                <SelectAllContainer>
                    <Checkbox id="select-all" checked={isAllSelected} onClick={handleClick} onChange={handleChange}>
                        Selecionar tudo
                    </Checkbox>
                </SelectAllContainer>

                {menu}
            </>
        );
    };

    return element;
};
