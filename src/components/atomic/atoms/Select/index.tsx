import { colors } from '../../../../theme/theme';
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import { CloseIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useState } from 'react';

export interface IOption {
  label?: string;
  value?: string;
}

export interface ISelectProps {
  options: IOption[];
  title?: string;
  placeholder: string;
  value?: string;
  onChange: (payload: string) => void;
}

export const SelectAtom = ({
  options,
  title,
  placeholder,
  value,
  onChange,
}: ISelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <SelectRoot
      size="sm"
      width="320px"
      onValueChange={({ value }: { value: [string] }) => onChange(...value)}
      onOpenChange={setIsOpen}
      onExitComplete={() => setIsOpen(false)}
    >
      {title && <SelectLabel>{title}</SelectLabel>}

      <SelectTrigger position="relative">
        <SelectValueText
          color={value ? colors.primary.secondary : colors.primary.placeholder}
          placeholder={placeholder}
        >
          {value || placeholder}
        </SelectValueText>

        {value && (
          <IconButton
            aria-label="Clear selection"
            size="sm"
            onClick={handleClear}
            position="absolute"
            right="1.3rem"
            top="50%"
            transform="translateY(-50%)"
            zIndex="1"
            variant="ghost"
            rounded="full"
          >
            <CloseIcon boxSize="10px" />
          </IconButton>
        )}

        <Icon
          position="absolute"
          right="0.5rem"
          size="sm"
          top="50%"
          transform="translateY(-50%)"
          pointerEvents="none"
        >
          {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Icon>
      </SelectTrigger>

      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} item={option}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};