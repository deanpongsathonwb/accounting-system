import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Select, SelectProps } from '../ui/Select';

export interface FormSelectProps extends Omit<SelectProps, 'name'> {
  name: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({ name, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Select
          {...field}
          {...props}
          value={field.value ?? ''}
          error={error?.message}
          onChange={(e) => field.onChange(e.target.value)}
        />
      )}
    />
  );
};
