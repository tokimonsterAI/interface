import {Select as ASelect, SelectProps} from 'antd';

type Props = {
    minWeek?: number
    maxWeek?: number
    availableWeeks?: number[] | null
    currentWeek?: number
    onChange?: (value: number) => void
}

export const MAX_WEEK = 52;

const WeekSelect: React.FC<Props & SelectProps> = ({
    minWeek = 1,
    maxWeek = MAX_WEEK,
    availableWeeks: originalAvailableWeeks,
    currentWeek,
    onChange,
    ...props
}) => {
    if (minWeek > maxWeek) {
        throw new Error('minWeek cannot be greater than maxWeek');
    }

    const availableWeeks = originalAvailableWeeks ?? Array.from(Array(maxWeek - minWeek + 1), (_, index) => minWeek + index);

    return (
        <ASelect
            bordered={false}
            sx={{
                width: '100%',
                border: 'none',
            }}
            value={currentWeek || ''}
            onChange={onChange}
            {...props}
        >
            {
                availableWeeks && availableWeeks.map(num => {
                    return (
                        <ASelect.Option
                            key={num}
                            value={num}
                        >
                            {num}
                        </ASelect.Option>
                    );
                })
            }
        </ASelect>
    );
};

export default WeekSelect;
