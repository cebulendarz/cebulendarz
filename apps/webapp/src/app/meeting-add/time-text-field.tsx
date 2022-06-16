import { CSSProperties, useState } from 'react';
import { TextField } from '@mui/material';

const removeLeading0 = (value: string) => {
  return value.replace(/^0/, '');
};

const formatTime = (time: string) => {
  return time.replace(/^(\d?):?(\d):?(\d)(\d)$/, '$1$2:$3$4');
};

const isValid = (time: string) => {
  return (
    (time.length <= 5 &&
      (time.match(/^\d:[0-5]\d$/) ||
        time.match(/^1\d:[0-5]\d$/) ||
        time.match(/^2[0-4]:[0-5]\d$/))) ||
    time.length === 0
  );
};

export const TimeTextField = ({
  initTime,
  label,
  timeChanged,
  style,
}: {
  initTime: string;
  label: string;
  timeChanged: (time: string) => void;
  style?: CSSProperties;
}) => {
  const [time, setTime] = useState<string>(initTime);
  const [error, setError] = useState<string>();

  const handleChange = (input: HTMLInputElement) => {
    const { value } = input;
    let currentTime = removeLeading0(value);
    if (currentTime.length <= 5) {
      currentTime = formatTime(currentTime);
      input.value = currentTime;
      setTime(currentTime);
    }
    if (isValid(currentTime)) {
      timeChanged(currentTime);
      setError(undefined);
    } else {
      setError('Podaj poprawną godzinę');
    }
  };

  return (
    <TextField
      label={label}
      placeholder="hh:mm"
      onChange={(event) => handleChange(event.target as HTMLInputElement)}
      value={time}
      style={style}
      variant={'standard'}
      error={Boolean(error)}
      helperText={error}
    ></TextField>
  );
};
