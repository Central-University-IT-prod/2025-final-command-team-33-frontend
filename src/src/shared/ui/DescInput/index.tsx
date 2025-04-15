import { Stack, Textarea } from '@mantine/core';
import React from 'react';
import { Controller } from 'react-hook-form';

interface DescInputProps {
  title: string;
  placeholder: string;
  minLength: number;
  maxLength: number;
  name: string;
  control: any;
}

export const DescInput: React.FC<DescInputProps> = ({
  title,
  placeholder,
  minLength,
  maxLength,
  name,
  control
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Stack w={'100%'} gap={0}>
          <Textarea
            {...field}
            placeholder={placeholder}
            minLength={minLength}
            maxLength={maxLength}
            w={'100%'}
            label={title}
            style={{
              minHeight: '100px',
              maxHeight: '600px',
              marginBottom: '0'
            }}
            description={
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px'
                }}>
                <span>Мин. кол-во символов: {minLength}</span>
                <span>
                  {field.value?.trim().length || 0} / {maxLength}
                </span>
              </div>
            }
            autosize
            maxRows={10}
          />
        </Stack>
      )}
    />
  );
};
