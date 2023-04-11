import { Button as AntdButton } from 'antd';
import { styled } from '../styles/global';

export const MyButton = styled(AntdButton)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;

    text-align: center;

    > svg {
        width: 14px;
        height: 14px;
    }

    &.ant-btn {
        &-loading {
            cursor: not-allowed;
        }
    }
`;
