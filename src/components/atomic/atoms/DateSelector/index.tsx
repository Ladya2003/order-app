import React, { useState } from 'react';
import { Box, Button, Flex, Input, Icon } from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { colors } from '../../../../theme/theme';

interface IDataSelector {
  value: Date;
  onChange: (value: Date) => void;
}

const DateSelector = ({ value, onChange }: IDataSelector) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const selectedDay = value ? dayjs(value) : null;

  // Check if selectedDate matches today, tomorrow, or the day after
  const isToday = selectedDay ? selectedDay.isSame(dayjs(), 'day') : false;
  const isTomorrow = selectedDay
    ? selectedDay.isSame(dayjs().add(1, 'day'), 'day')
    : false;
  const isDayAfterTomorrow = selectedDay
    ? selectedDay.isSame(dayjs().add(2, 'day'), 'day')
    : false;

  // Helper function to set the date based on days offset
  const setDate = (daysOffset: number) => {
    const newDate = dayjs().add(daysOffset, 'day').toDate();
    onChange(newDate);
  };

  return (
    <Box>
      <Box mb="4">
        <Flex
          mt="2"
          align="center"
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          p="2"
        >
          {/* Icon with click event to toggle calendar */}
          <Icon
            color="blue.500"
            mr="2"
            cursor="pointer"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <CalendarIcon />
          </Icon>

          {/* DatePicker Input with minDate restriction */}
          <DatePicker
            selected={value}
            onChange={(date: Date | null) => onChange(date ?? new Date())}
            dateFormat="dd.MM.yyyy"
            minDate={new Date()} // Prevents selecting dates before today
            customInput={
              <Input
                value={value ? dayjs(value).format('DD.MM.YYYY') : ''}
                readOnly
                color="gray.700"
              />
            }
            open={isCalendarOpen}
            onClickOutside={() => setIsCalendarOpen(false)}
          />
        </Flex>
      </Box>

      <Flex gap="2">
        <Button
          variant="outline"
          bgColor={isToday ? colors.status.createdColor : 'transparent'}
          color={isToday ? colors.primary.paper : colors.status.createdColor}
          borderColor={colors.status.createdColor}
          onClick={() => setDate(0)}
        >
          Сегодня
        </Button>

        <Button
          variant="outline"
          bgColor={isTomorrow ? colors.status.createdColor : 'transparent'}
          color={isTomorrow ? colors.primary.paper : colors.status.createdColor}
          borderColor={colors.status.createdColor}
          onClick={() => setDate(1)}
        >
          Завтра
        </Button>

        <Button
          variant="outline"
          bgColor={
            isDayAfterTomorrow ? colors.status.createdColor : 'transparent'
          }
          color={
            isDayAfterTomorrow
              ? colors.primary.paper
              : colors.status.createdColor
          }
          borderColor={colors.status.createdColor}
          onClick={() => setDate(2)}
        >
          Послезавтра
        </Button>
      </Flex>
    </Box>
  );
};

export default DateSelector;
