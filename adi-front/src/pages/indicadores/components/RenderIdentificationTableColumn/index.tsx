import { FC } from 'react';
import { Avatar, Space, Tooltip } from '@it-adi/react-components';
import { DisplayText } from '@/pages/indicadores/components/RenderIdentificationTableColumn/styles';

interface RenderIdentificationTableColumnProps {
    avatarSrc?: string;
    value: string;
}

export const RenderIdentificationTableColumn: FC<RenderIdentificationTableColumnProps> = ({
    avatarSrc,
    value,
}): JSX.Element => {
    return (
        <Space align="center" direction="horizontal">
            <Tooltip title={value} placement="right">
                <>
                    <Avatar src={avatarSrc} alt="" size="default">
                        {!avatarSrc && value.toUpperCase()}
                    </Avatar>
                </>
            </Tooltip>

            <DisplayText size="sm">{value}</DisplayText>
        </Space>
    );
};
