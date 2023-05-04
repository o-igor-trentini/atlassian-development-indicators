import { FC } from 'react';
import { Avatar, Space, Text, Tooltip } from '@it-adi/react-components';
import { cutWithEllipsis } from '@/utils/string';

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

            <Text size="sm">{cutWithEllipsis(value, 10)}</Text>
        </Space>
    );
};
