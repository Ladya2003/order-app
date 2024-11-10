import { Box, Button, Flex, Input, Icon } from '@chakra-ui/react';
import { CalendarIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useToggle } from '../../../../hooks';
import { isDayAfterTomorrow, isToday, isTomorrow } from '../../../../utils';
import { styles } from './styles';

type Props = {
  value: Date;
  onChange: (value: Date) => void;
};

const DateSelectorAtom = ({ value, onChange }: Props) => {
  const {
    isToggledOn: isCalendarOpen,
    toggle: toggleCalendar,
    setToggleOff: hideCalendar,
  } = useToggle();

  const today = dayjs();
  const todayDate = today.toDate();

  const selectedDay = dayjs(value);
  const formattedSelectedDay = selectedDay.format('DD.MM.YYYY');

  const handleButtonClick = (daysOffset: number) => {
    const newDate = today.add(daysOffset, 'day').toDate();
    onChange(newDate);
  };

  const handleDataPickerChange = (date: Date | null) =>
    onChange(date ?? todayDate);

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
          <Icon
            color="blue.500"
            mr="2"
            cursor="pointer"
            onClick={toggleCalendar}
          >
            <CalendarIcon />
          </Icon>

          <DatePicker
            selected={value}
            onChange={handleDataPickerChange}
            dateFormat="dd.MM.yyyy"
            minDate={todayDate}
            customInput={
              <Input value={formattedSelectedDay} readOnly color="gray.700" />
            }
            open={isCalendarOpen}
            onClickOutside={hideCalendar}
          />
        </Flex>
      </Box>

      <Flex gap="2">
        <Button
          variant="outline"
          onClick={() => handleButtonClick(0)}
          {...(isToday(selectedDay) ? styles.active : styles.inactive)}
        >
          Сегодня
        </Button>

        <Button
          variant="outline"
          onClick={() => handleButtonClick(1)}
          {...(isTomorrow(selectedDay) ? styles.active : styles.inactive)}
        >
          Завтра
        </Button>

        <Button
          variant="outline"
          onClick={() => handleButtonClick(2)}
          {...(isDayAfterTomorrow(selectedDay)
            ? styles.active
            : styles.inactive)}
        >
          Послезавтра
        </Button>
      </Flex>
    </Box>
  );
};

export default DateSelectorAtom;
